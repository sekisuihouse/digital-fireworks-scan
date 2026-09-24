/**
 * 写真から花火玉を読みとる（画像解析）
 * =========================================================================
 * 紙に描いた「直径6cmの円 + 直径1cmの色つきの星」の写真を、
 * そのまま FireworkShell の星データに起こす。DOM には触らない純粋な計算だけ。
 *
 *   1) 外周をさがす     縮小画像のエッジから円をハフ投票で見つけ、
 *                       放射状に線をなぞって楕円をあてはめる（ななめ撮りの補正）
 *   2) まっすぐに直す   楕円の中を 360px の正方形（= 6cm）に写しとる
 *                       紙の色で割って、照明の色かぶり・明るさのムラを消す
 *   3) 星をさがす       星の大きさ（直径 = 外周の 1/6）は決まっているので、
 *                       その大きさの円だけを「ぬりつぶし」「まるだけ」の両方で探す
 *   4) 色をきめる       星の中の色相を、6色パレットのいちばん近い色へ寄せる
 *                       色がついていない（まるだけ描いた）星は「しろ」
 *   5) ととのえる       はみ出し・重なりを少しずつ押し広げて、合法な配置に整形
 *
 * 画像は {width, height, data: RGBA の Uint8ClampedArray}（ImageData と同じ形）。
 */
import {
  SHELL_RADIUS_CM,
  PELLET_RADIUS_CM,
  MAX_PELLET_CENTER_R_CM,
  MIN_PELLET_GAP_CM,
  MAX_PELLETS,
  canPlacePellet,
  createPellet,
  findNearbySpot,
  hexSlots,
} from '../types/shell.js';
import { PELLET_COLORS } from '../data/pellet-colors.js';

/** 補正後の玉画像の一辺 [px]（6cm = 360px → 1cm = 60px） */
export const RECT_SIZE = 360;
/** 外周さがしに使う縮小画像の長辺 [px] */
const HOUGH_MAX = 260;
/** 星の半径 / 外周の半径 */
const PELLET_RATIO = PELLET_RADIUS_CM / SHELL_RADIUS_CM;

/* ================================================================ 1) 外周 */

/**
 * 写真の中から直径6cmの外周をさがす。
 * @returns {{cx:number, cy:number, m:number[], found:boolean, method:string}}
 *   画像上の点 = (cx, cy) + m × u（u は単位円上の点。m = [m00, m01, m10, m11]）
 */
export function detectOutline(img) {
  const small = grayScaled(img, HOUGH_MAX);
  const cands = houghCircle(small);
  if (!cands.length) return fallbackOutline(img);

  // ハフ変換の候補を 1 つずつ元の解像度でなぞってみて、
  // 「一周ぐるっと、きれいな楕円の上に線がある」割合がいちばん高いものを外周とする。
  // 星のかたまりや紙のふちは、ここで楕円にならずに負ける。
  const k = 1 / small.scale;
  let best = null;
  for (const c of cands) {
    const o = refineOutline(img, c.cx * k, c.cy * k, c.r * k);
    const support = outlineSupport(img, o);
    if (!best || support > best.support + 0.02 || (support > best.support - 0.02 && outlineRadius(o) > outlineRadius(best.o))) {
      best = { o, support };
    }
  }
  if (!best || best.support < 0.25) return fallbackOutline(img);
  return { ...best.o, found: best.support >= 0.55 };
}

/** 円（ゆがみなし）の外周 */
export function circleOutline(cx, cy, r) {
  return { cx, cy, m: [r, 0, 0, r], found: true, method: 'manual' };
}

/** 外周の「だいたいの半径」[px] */
export function outlineRadius(o) {
  return Math.sqrt(Math.abs(o.m[0] * o.m[3] - o.m[1] * o.m[2]));
}

function fallbackOutline(img) {
  const r = Math.min(img.width, img.height) * 0.38;
  return { ...circleOutline(img.width / 2, img.height / 2, r), found: false, method: 'fallback' };
}

function grayScaled(img, maxSide) {
  const s = Math.min(1, maxSide / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * s));
  const h = Math.max(1, Math.round(img.height * s));
  const g = new Float32Array(w * h);
  const n = new Float32Array(w * h);
  const d = img.data;
  for (let y = 0; y < img.height; y++) {
    const ty = Math.min(h - 1, Math.floor(y * s));
    for (let x = 0; x < img.width; x++) {
      const tx = Math.min(w - 1, Math.floor(x * s));
      const i = (y * img.width + x) * 4;
      const t = ty * w + tx;
      g[t] += (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
      n[t]++;
    }
  }
  for (let i = 0; i < g.length; i++) g[i] /= n[i] || 1;
  return { w, h, g, scale: w / img.width };
}

function boxBlur(src, w, h) {
  const out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0;
      let cnt = 0;
      for (let dy = -1; dy <= 1; dy++) {
        const yy = y + dy;
        if (yy < 0 || yy >= h) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx;
          if (xx < 0 || xx >= w) continue;
          sum += src[yy * w + xx];
          cnt++;
        }
      }
      out[y * w + x] = sum / cnt;
    }
  }
  return out;
}

/**
 * エッジの勾配方向に沿って中心を投票し（ハフ変換）、
 * 候補の中心ごとに「どの半径の円がいちばん途切れずに一周しているか」で外周を決める。
 * 星（小さい円）や文字より、外周（大きくて一周つながった円）が必ず勝つ。
 */
function houghCircle({ w, h, g }) {
  const b = boxBlur(g, w, h);
  const edges = [];
  const mags = [];
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const sx = b[i - w + 1] + 2 * b[i + 1] + b[i + w + 1] - (b[i - w - 1] + 2 * b[i - 1] + b[i + w - 1]);
      const sy = b[i + w - 1] + 2 * b[i + w] + b[i + w + 1] - (b[i - w - 1] + 2 * b[i - w] + b[i - w + 1]);
      const m = Math.hypot(sx, sy);
      mags.push(m);
      edges.push(x, y, sx, sy, m);
    }
  }
  const thr = Math.max(0.12, percentile(mags, 0.86));
  const pts = [];
  for (let i = 0; i < edges.length; i += 5) {
    const m = edges[i + 4];
    if (m >= thr) pts.push({ x: edges[i], y: edges[i + 1], dx: edges[i + 2] / m, dy: edges[i + 3] / m });
  }
  if (pts.length < 20) return [];

  const minSide = Math.min(w, h);
  const rMin = Math.max(8, Math.round(minSide * 0.08));
  const rMax = Math.max(rMin + 4, Math.round(minSide * 0.54));

  const acc = new Float32Array(w * h);
  for (const p of pts) {
    for (let r = rMin; r <= rMax; r++) {
      let x = Math.round(p.x + p.dx * r);
      let y = Math.round(p.y + p.dy * r);
      if (x >= 0 && x < w && y >= 0 && y < h) acc[y * w + x]++;
      x = Math.round(p.x - p.dx * r);
      y = Math.round(p.y - p.dy * r);
      if (x >= 0 && x < w && y >= 0 && y < h) acc[y * w + x]++;
    }
  }
  const accB = boxBlur(boxBlur(acc, w, h), w, h);

  // 投票の多い中心を数個とりだす（近すぎるものは除く）
  const order = [];
  for (let i = 0; i < accB.length; i++) if (accB[i] > 0) order.push(i);
  order.sort((a, c) => accB[c] - accB[a]);
  const peaks = [];
  for (const i of order) {
    const x = i % w;
    const y = (i / w) | 0;
    if (peaks.some((q) => Math.hypot(q.x - x, q.y - y) < rMin)) continue;
    peaks.push({ x, y });
    if (peaks.length >= 6) break;
  }

  const cands = [];
  for (const pk of peaks) {
    for (const c of bestRadii(pts, pk.x, pk.y, rMin, rMax)) cands.push({ cx: pk.x, cy: pk.y, ...c });
  }
  cands.sort((a, c) => c.coverage - a.coverage);
  return cands.slice(0, 10);
}

/**
 * 中心を決めたとき、一周ぶん途切れずにエッジがある半径（上位 3 つ）。
 * ななめ撮りの楕円でも拾えるよう、半径は ±3px の幅で見る。
 */
function bestRadii(pts, cx, cy, rMin, rMax) {
  const BINS = 90;
  const rows = rMax + 5;
  const hits = new Uint8Array(rows * BINS);
  for (const p of pts) {
    const vx = p.x - cx;
    const vy = p.y - cy;
    const d = Math.hypot(vx, vy);
    if (d < rMin - 2 || d > rMax + 1) continue;
    if (Math.abs((vx * p.dx + vy * p.dy) / d) < 0.75) continue; // 円の接線方向のエッジは無視
    const ri = Math.round(d);
    const bin = Math.floor(((Math.atan2(vy, vx) + Math.PI) / (Math.PI * 2)) * BINS) % BINS;
    hits[ri * BINS + bin] = 1;
  }
  const cov = new Float32Array(rows);
  for (let r = rMin; r <= rMax; r++) {
    let n = 0;
    for (let bin = 0; bin < BINS; bin++) {
      for (let dr = -3; dr <= 3; dr++) {
        if (hits[(r + dr) * BINS + bin]) {
          n++;
          break;
        }
      }
    }
    cov[r] = n / BINS;
  }
  const out = [];
  for (let r = rMin; r <= rMax; r++) {
    if (cov[r] < cov[r - 1] || cov[r] < cov[r + 1]) continue;
    if (out.some((o) => Math.abs(o.r - r) < 6)) continue;
    out.push({ r, coverage: cov[r] });
  }
  out.sort((a, b) => b.coverage - a.coverage);
  return out.slice(0, 3);
}

/**
 * 元の解像度で、中心から放射状に外周の線（黒い線）をなぞって点を集め、楕円をあてはめる。
 * ハフ変換の中心はななめ撮りだと少しずれるので、
 * 1 回目は広めに探し、2 回目からは当てはめた楕円に沿って細かくなぞりなおす。
 * うまくいかなければ円のまま返す。
 */
function refineOutline(img, cx, cy, r) {
  const circle = { cx, cy, m: [r, 0, 0, r], method: 'circle' };
  let cur = circle;
  let ok = false;
  const WINDOWS = [
    [0.78, 1.3],
    [0.9, 1.1],
    [0.94, 1.06],
  ];
  for (const win of WINDOWS) {
    const pts = traceRays(img, cur, win);
    const fit = pts.length >= RAYS * 0.35 ? robustEllipse(pts) : null;
    if (!fit || !plausible(fit, cx, cy, r)) break;
    cur = { ...fit, method: 'ellipse' };
    ok = true;
  }
  return ok ? cur : circle;
}

const RAYS = 144;

/** 外周 o に沿ってなぞったとき、線がちゃんと楕円の上にある方向の割合（0..1） */
function outlineSupport(img, o) {
  const pts = traceRays(img, o, [0.94, 1.06]);
  const inv = invert2(o.m);
  let n = 0;
  for (const p of pts) {
    const ux = inv[0] * (p.x - o.cx) + inv[1] * (p.y - o.cy);
    const uy = inv[2] * (p.x - o.cx) + inv[3] * (p.y - o.cy);
    if (Math.abs(Math.hypot(ux, uy) - 1) < 0.03) n++;
  }
  return n / RAYS;
}

/** 楕円 o の中心から放射状に、予想位置のまわり [win0, win1] 倍の範囲でいちばん近い黒い線をさがす */
function traceRays(img, o, [w0, w1]) {
  const pts = [];
  for (let k = 0; k < RAYS; k++) {
    const a = (k / RAYS) * Math.PI * 2;
    const ex = o.m[0] * Math.cos(a) + o.m[1] * Math.sin(a);
    const ey = o.m[2] * Math.cos(a) + o.m[3] * Math.sin(a);
    const tp = Math.hypot(ex, ey);
    const dx = ex / tp;
    const dy = ey / tp;
    const ts = [];
    const vs = [];
    let lo = Infinity;
    let hi = -Infinity;
    for (let t = tp * w0; t <= tp * w1; t += 0.5) {
      const v = maxChannel(img, o.cx + dx * t, o.cy + dy * t);
      if (v < 0) continue;
      ts.push(t);
      vs.push(v);
      if (v < lo) lo = v;
      if (v > hi) hi = v;
    }
    if (hi - lo < 0.18 || lo > hi * 0.75) continue;
    // 暗いところのかたまり（線）ごとに中心を出し、予想位置にいちばん近い線をとる
    const cut = lo + (hi - lo) * 0.35;
    let best = null;
    let runStart = -1;
    for (let i = 0; i <= vs.length; i++) {
      const dark = i < vs.length && vs[i] <= cut;
      if (dark && runStart < 0) runStart = i;
      if (!dark && runStart >= 0) {
        const tc = (ts[runStart] + ts[i - 1]) / 2;
        if (!best || Math.abs(tc - tp) < Math.abs(best - tp)) best = tc;
        runStart = -1;
      }
    }
    if (best != null) pts.push({ x: o.cx + dx * best, y: o.cy + dy * best });
  }
  return pts;
}

/** はずれ値（星の線など）を除きながら楕円をあてはめる */
function robustEllipse(pts) {
  let inliers = pts;
  let fit = null;
  for (let round = 0; round < 3; round++) {
    const next = fitEllipse(inliers);
    if (!next) break;
    fit = next;
    const inv = invert2(fit.m);
    const kept = inliers.filter((p) => {
      const ux = inv[0] * (p.x - fit.cx) + inv[1] * (p.y - fit.cy);
      const uy = inv[2] * (p.x - fit.cx) + inv[3] * (p.y - fit.cy);
      return Math.abs(Math.hypot(ux, uy) - 1) < 0.035;
    });
    if (kept.length < RAYS * 0.3) break;
    inliers = kept;
  }
  return fit;
}

/** ななめ撮りとして ありえる楕円か（つぶれすぎ・大きさや位置が外れすぎていない） */
function plausible(fit, cx, cy, r) {
  const { major, minor } = axes(fit.m);
  const mean = Math.sqrt(major * minor);
  return (
    major / minor <= 1.6 &&
    mean > r * 0.7 &&
    mean < r * 1.4 &&
    Math.hypot(fit.cx - cx, fit.cy - cy) < r * 0.3
  );
}

function maxChannel(img, x, y) {
  const xi = Math.round(x);
  const yi = Math.round(y);
  if (xi < 0 || yi < 0 || xi >= img.width || yi >= img.height) return -1;
  const i = (yi * img.width + xi) * 4;
  const d = img.data;
  return Math.max(d[i], d[i + 1], d[i + 2]) / 255;
}

/**
 * 点列に楕円をあてはめる（a x² + b xy + c y² + d x + e y = 1 の最小二乗）
 * @returns {{cx:number, cy:number, m:number[]}|null}  m は単位円 → 楕円 の対称行列
 */
function fitEllipse(pts) {
  if (pts.length < 6) return null;
  let mx = 0;
  let my = 0;
  for (const p of pts) {
    mx += p.x;
    my += p.y;
  }
  mx /= pts.length;
  my /= pts.length;
  let rms = 0;
  for (const p of pts) rms += (p.x - mx) ** 2 + (p.y - my) ** 2;
  const s = 1 / Math.sqrt(rms / pts.length || 1);

  const N = Array.from({ length: 5 }, () => new Float64Array(6));
  for (const p of pts) {
    const x = (p.x - mx) * s;
    const y = (p.y - my) * s;
    const row = [x * x, x * y, y * y, x, y];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) N[i][j] += row[i] * row[j];
      N[i][5] += row[i];
    }
  }
  const sol = solve(N);
  if (!sol) return null;
  const [a, b, c, d, e] = sol;
  const det = 4 * a * c - b * b;
  if (det <= 1e-12) return null;
  const x0 = (b * e - 2 * c * d) / det;
  const y0 = (b * d - 2 * a * e) / det;
  const f0 = a * x0 * x0 + b * x0 * y0 + c * y0 * y0 + d * x0 + e * y0 - 1;
  if (f0 >= 0) return null;
  // (p-p0)ᵀ M (p-p0) = 1 の M
  const M = [a / -f0, b / 2 / -f0, b / 2 / -f0, c / -f0];
  if (M[0] <= 0 || M[0] * M[3] - M[1] * M[2] <= 0) return null;
  // 単位円 → 楕円 の行列 A = M^(-1/2)
  const A = sqrtSym(invert2(M));
  return {
    cx: x0 / s + mx,
    cy: y0 / s + my,
    m: A.map((v) => v / s),
  };
}

function solve(N) {
  const n = N.length;
  for (let col = 0; col < n; col++) {
    let piv = col;
    for (let r = col + 1; r < n; r++) if (Math.abs(N[r][col]) > Math.abs(N[piv][col])) piv = r;
    if (Math.abs(N[piv][col]) < 1e-12) return null;
    [N[col], N[piv]] = [N[piv], N[col]];
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = N[r][col] / N[col][col];
      for (let k = col; k <= n; k++) N[r][k] -= f * N[col][k];
    }
  }
  return N.map((row, i) => row[n] / row[i]);
}

function invert2([a, b, c, d]) {
  const det = a * d - b * c;
  return [d / det, -b / det, -c / det, a / det];
}

/** 2×2 対称正定値行列の平方根 */
function sqrtSym([a, b, , d]) {
  const sd = Math.sqrt(a * d - b * b);
  const t = Math.sqrt(a + d + 2 * sd);
  return [(a + sd) / t, b / t, b / t, (d + sd) / t];
}

function axes(m) {
  // m mᵀ の固有値の平方根 = 楕円の半径（長・短）
  const p = m[0] * m[0] + m[1] * m[1];
  const q = m[0] * m[2] + m[1] * m[3];
  const r = m[2] * m[2] + m[3] * m[3];
  const tr = (p + r) / 2;
  const disc = Math.sqrt(Math.max(0, tr * tr - (p * r - q * q)));
  return { major: Math.sqrt(tr + disc), minor: Math.sqrt(Math.max(1e-9, tr - disc)) };
}

function percentile(arr, q) {
  if (!arr.length) return 0;
  const a = Float32Array.from(arr).sort();
  return a[Math.min(a.length - 1, Math.floor(q * (a.length - 1)))];
}

/* ========================================================== 2) まっすぐに */

/**
 * 外周の楕円の中を RECT_SIZE × RECT_SIZE の正方形へ写しとる（外は透明）。
 * @returns {{width:number, height:number, data:Uint8ClampedArray}}
 */
export function rectify(img, outline, size = RECT_SIZE) {
  const out = new Uint8ClampedArray(size * size * 4);
  const [m00, m01, m10, m11] = outline.m;
  const d = img.data;
  const W = img.width;
  const H = img.height;
  for (let j = 0; j < size; j++) {
    const uy = ((j + 0.5) / size) * 2 - 1;
    for (let i = 0; i < size; i++) {
      const ux = ((i + 0.5) / size) * 2 - 1;
      if (ux * ux + uy * uy > 1) continue;
      const sx = outline.cx + m00 * ux + m01 * uy;
      const sy = outline.cy + m10 * ux + m11 * uy;
      const x0 = Math.floor(sx);
      const y0 = Math.floor(sy);
      if (x0 < 0 || y0 < 0 || x0 >= W - 1 || y0 >= H - 1) continue;
      const fx = sx - x0;
      const fy = sy - y0;
      const o = (j * size + i) * 4;
      const i00 = (y0 * W + x0) * 4;
      const i10 = i00 + 4;
      const i01 = i00 + W * 4;
      const i11 = i01 + 4;
      for (let ch = 0; ch < 3; ch++) {
        const top = d[i00 + ch] * (1 - fx) + d[i10 + ch] * fx;
        const bot = d[i01 + ch] * (1 - fx) + d[i11 + ch] * fx;
        out[o + ch] = top * (1 - fy) + bot * fy;
      }
      out[o + 3] = 255;
    }
  }
  return { width: size, height: size, data: out };
}

/**
 * 紙の色を「位置で少しずつ変わる色（平面）」として推定する。
 * 照明の色かぶりと、スマホの影などのなだらかな明るさのムラを消すため。
 * @returns {(x:number, y:number) => number[]} 正規化座標 (-1..1) → [r,g,b] 0..255
 */
function estimatePaper(rect) {
  const { width: n, data: d } = rect;
  const lums = [];
  for (let i = 0; i < d.length; i += 12) if (d[i + 3]) lums.push(d[i] + d[i + 1] + d[i + 2]);
  const bright = percentile(lums, 0.8);

  // 明るくて色の薄い画素 = 紙
  const A = [new Float64Array(3), new Float64Array(3), new Float64Array(3)];
  const B = [new Float64Array(3), new Float64Array(3), new Float64Array(3)];
  let count = 0;
  for (let j = 0; j < n; j += 3) {
    for (let i = 0; i < n; i += 3) {
      const o = (j * n + i) * 4;
      if (!d[o + 3]) continue;
      const r = d[o];
      const g = d[o + 1];
      const b = d[o + 2];
      const mx = Math.max(r, g, b);
      if (r + g + b < bright * 0.82 || mx - Math.min(r, g, b) > mx * 0.22) continue;
      const x = (i / n) * 2 - 1;
      const y = (j / n) * 2 - 1;
      const row = [1, x, y];
      for (let p = 0; p < 3; p++) {
        for (let q = 0; q < 3; q++) A[p][q] += row[p] * row[q];
        B[0][p] += row[p] * r;
        B[1][p] += row[p] * g;
        B[2][p] += row[p] * b;
      }
      count++;
    }
  }
  if (count < 60) {
    const flat = Math.max(60, bright / 3);
    return () => [flat, flat, flat];
  }
  const coef = [0, 1, 2].map((ch) =>
    solve([
      [...A[0], B[ch][0]],
      [...A[1], B[ch][1]],
      [...A[2], B[ch][2]],
    ]) || [bright / 3, 0, 0]
  );
  return (x, y) => coef.map((c) => Math.max(40, c[0] + c[1] * x + c[2] * y));
}

/* ============================================================ 3) 星さがし */

/** 画素の分類: 0 = 紙 / 外、1 = 黒っぽい線（色なし）、2.. = パレットの色番号 + 2 */
const PAPER = 0;
const DARK = 1;

/** パレットのうち「色のある」色（色相で見分ける）と「しろ」 */
function paletteHues() {
  const chroma = [];
  let white = null;
  let whiteSat = Infinity;
  for (const c of PELLET_COLORS) {
    const [r, g, b] = hexToRgb(c.swatch);
    const { h, s } = hsv(r, g, b);
    if (s < whiteSat) {
      whiteSat = s;
      white = c.id;
    }
    chroma.push({ id: c.id, h, s });
  }
  return { chroma: chroma.filter((c) => c.id !== white && c.s > 0.25), white };
}

function hexToRgb(hex) {
  const v = parseInt(hex.replace('#', ''), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

function hsv(r, g, b) {
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  const c = mx - mn;
  let h = 0;
  if (c > 0) {
    if (mx === r) h = ((g - b) / c) % 6;
    else if (mx === g) h = (b - r) / c + 2;
    else h = (r - g) / c + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: mx ? c / mx : 0, v: mx, c };
}

/** まっすぐにした玉画像を、画素ごとに 紙 / 線 / 色 に分ける */
export function classify(rect) {
  const n = rect.width;
  const d = rect.data;
  const paper = estimatePaper(rect);
  const { chroma } = paletteHues();
  const map = new Uint8Array(n * n);
  for (let j = 0; j < n; j++) {
    const y = (j / n) * 2 - 1;
    for (let i = 0; i < n; i++) {
      const o = (j * n + i) * 4;
      if (!d[o + 3]) continue;
      const x = (i / n) * 2 - 1;
      const rho = Math.hypot(x, y);
      const [pr, pg, pb] = paper(x, y);
      const r = Math.min(1, d[o] / pr);
      const g = Math.min(1, d[o + 1] / pg);
      const b = Math.min(1, d[o + 2] / pb);
      const { h, v, c } = hsv(r, g, b);
      if (c > 0.2 && v > 0.2) {
        let best = 0;
        let bestD = Infinity;
        for (let k = 0; k < chroma.length; k++) {
          const dd = Math.min(Math.abs(h - chroma[k].h), 360 - Math.abs(h - chroma[k].h));
          if (dd < bestD) {
            bestD = dd;
            best = k;
          }
        }
        map[j * n + i] = 2 + best;
      } else if (v < 0.62 && rho < 0.95) {
        // 外周の線そのものは星の線とまぎれるので数えない
        map[j * n + i] = DARK;
      }
    }
  }
  return { map, size: n, chroma: chroma.map((c) => c.id) };
}

function ringOffsets(fracs, counts, pr) {
  const out = [];
  fracs.forEach((f, k) => {
    const cnt = counts[k];
    for (let i = 0; i < cnt; i++) {
      const a = (i / cnt) * Math.PI * 2 + k * 0.4;
      out.push(Math.round(Math.cos(a) * f * pr), Math.round(Math.sin(a) * f * pr));
    }
  });
  return Int16Array.from(out);
}

/**
 * 星をさがす。
 * 星の大きさは決まっているので、その大きさの円を 2 通りの見かたで当てる:
 *   ・ぬりつぶし: 円の中がひとつの色でうまっていて、すぐ外側は別のもの
 *   ・まるだけ   : 円周の上に線がぐるっとあって、内側は紙
 * @returns {{px:number, py:number, x:number, y:number, color:string, score:number, mode:string}[]}
 *   px, py は玉画像の画素、x, y は玉の中心を原点にした cm
 */
export function detectPellets(cls) {
  const { map, size: n, chroma } = cls;
  const { white } = paletteHues();
  const half = n / 2;
  const pr = half * PELLET_RATIO;
  const cmPerPx = SHELL_RADIUS_CM / half;

  const FILL = ringOffsets([0, 0.22, 0.44, 0.66, 0.86], [1, 6, 12, 16, 22], pr);
  const EDGE = ringOffsets([1.28], [24], pr);
  // 内側が紙であること。0.68 まで見るので、まるの中心からずれた候補は線にかかって点が下がる
  const INNER = ringOffsets([0, 0.25, 0.5, 0.68], [1, 6, 12, 16], pr);
  const RING_R = [0.78, 0.9, 1.0, 1.1];
  const RING_A = 36;
  const RING = [];
  for (let a = 0; a < RING_A; a++) {
    const ang = (a / RING_A) * Math.PI * 2;
    for (const f of RING_R) RING.push(Math.round(Math.cos(ang) * f * pr), Math.round(Math.sin(ang) * f * pr));
  }

  const at = (x, y) => (x < 0 || y < 0 || x >= n || y >= n ? PAPER : map[y * n + x]);
  const counts = new Int32Array(2 + chroma.length);
  const reach = (MAX_PELLET_CENTER_R_CM + 0.3) / cmPerPx;
  const cands = [];

  for (let cy = 0; cy < n; cy += 2) {
    for (let cx = 0; cx < n; cx += 2) {
      if (Math.hypot(cx - half, cy - half) > reach) continue;

      // --- ぬりつぶし ---
      counts.fill(0);
      for (let k = 0; k < FILL.length; k += 2) counts[at(cx + FILL[k], cy + FILL[k + 1])]++;
      let cls2 = -1;
      let top = 0;
      for (let c = 2; c < counts.length; c++) {
        if (counts[c] > top) {
          top = counts[c];
          cls2 = c;
        }
      }
      let fillScore = 0;
      if (cls2 >= 0) {
        const fill = top / (FILL.length / 2);
        if (fill > 0.3) {
          let other = 0;
          for (let k = 0; k < EDGE.length; k += 2) if (at(cx + EDGE[k], cy + EDGE[k + 1]) !== cls2) other++;
          fillScore = fill * 0.75 + (other / (EDGE.length / 2)) * 0.25;
        }
      }

      // --- まるだけ ---
      let ringScore = 0;
      let hitAngles = 0;
      for (let a = 0; a < RING_A; a++) {
        const base = a * RING_R.length * 2;
        for (let f = 0; f < RING_R.length; f++) {
          if (at(cx + RING[base + f * 2], cy + RING[base + f * 2 + 1]) !== PAPER) {
            hitAngles++;
            break;
          }
        }
      }
      const ringFrac = hitAngles / RING_A;
      if (ringFrac > 0.5) {
        let paperIn = 0;
        for (let k = 0; k < INNER.length; k += 2) if (at(cx + INNER[k], cy + INNER[k + 1]) === PAPER) paperIn++;
        ringScore = ringFrac * (paperIn / (INNER.length / 2));
      }

      const score = Math.max(fillScore, ringScore);
      if (score >= 0.55) {
        cands.push({ cx, cy, score, mode: fillScore >= ringScore ? 'fill' : 'ring', cls: cls2 });
      }
    }
  }

  // 強いものから順に採用し、近すぎる候補（同じ星のずれ・星と星のすきま）は捨てる
  cands.sort((a, b) => b.score - a.score);
  const picked = [];
  const minD = pr * 1.5;
  for (const c of cands) {
    if (picked.some((p) => Math.hypot(p.cx - c.cx, p.cy - c.cy) < minD)) continue;
    picked.push(c);
    if (picked.length >= MAX_PELLETS + 6) break;
  }

  return picked.map((c) => {
    const { x: px, y: py } = refineCenter(map, n, c, pr);
    let color;
    if (c.mode === 'fill') color = chroma[c.cls - 2];
    else color = ringColor(map, n, px, py, pr, chroma) || white;
    return {
      px,
      py,
      x: (px - half) * cmPerPx,
      y: (py - half) * cmPerPx,
      color,
      score: c.score,
      mode: c.mode,
    };
  });
}

/** 見つけた星の中心を、その星の画素の重心へ少しだけ寄せる */
function refineCenter(map, n, c, pr) {
  const R = Math.ceil(pr * (c.mode === 'fill' ? 1.0 : 1.2));
  // まるだけの星は、その線と同じ種類の画素だけで重心をとる（となりの星に引っぱられない）
  const ink = c.mode === 'ring' ? dominantInk(map, n, c.cx, c.cy, pr) : -1;
  let sx = 0;
  let sy = 0;
  let cnt = 0;
  for (let dy = -R; dy <= R; dy++) {
    const y = c.cy + dy;
    if (y < 0 || y >= n) continue;
    for (let dx = -R; dx <= R; dx++) {
      const x = c.cx + dx;
      if (x < 0 || x >= n) continue;
      const d = Math.hypot(dx, dy);
      if (d > R) continue;
      const v = map[y * n + x];
      const ok = c.mode === 'fill' ? v === c.cls : v === ink && d > pr * 0.65;
      if (!ok) continue;
      sx += x;
      sy += y;
      cnt++;
    }
  }
  if (!cnt) return { x: c.cx, y: c.cy };
  let dx = sx / cnt - c.cx;
  let dy = sy / cnt - c.cy;
  const lim = pr * 0.35;
  const len = Math.hypot(dx, dy);
  if (len > lim) {
    dx *= lim / len;
    dy *= lim / len;
  }
  return { x: c.cx + dx, y: c.cy + dy };
}

function dominantInk(map, n, cx, cy, pr) {
  const counts = new Map();
  const R = Math.ceil(pr * 1.05);
  for (let dy = -R; dy <= R; dy++) {
    for (let dx = -R; dx <= R; dx++) {
      const d = Math.hypot(dx, dy);
      if (d < pr * 0.75 || d > pr * 1.05) continue;
      const x = cx + dx;
      const y = cy + dy;
      if (x < 0 || y < 0 || x >= n || y >= n) continue;
      const v = map[y * n + x];
      if (v !== PAPER) counts.set(v, (counts.get(v) || 0) + 1);
    }
  }
  let best = DARK;
  let top = 0;
  for (const [v, cnt] of counts) {
    if (cnt > top) {
      top = cnt;
      best = v;
    }
  }
  return best;
}

/** 「まるだけ」の星: 線に色があればその色、なければ null（= しろ） */
function ringColor(map, n, cx, cy, pr, chroma) {
  const counts = new Int32Array(2 + chroma.length);
  // 帯を線の近くだけに絞る（となりの ぬりつぶした星の色を拾わないように）
  const R = Math.ceil(pr * 1.0);
  for (let dy = -R; dy <= R; dy++) {
    for (let dx = -R; dx <= R; dx++) {
      const d = Math.hypot(dx, dy);
      if (d < pr * 0.75 || d > pr * 1.0) continue;
      const x = Math.round(cx + dx);
      const y = Math.round(cy + dy);
      if (x < 0 || y < 0 || x >= n || y >= n) continue;
      counts[map[y * n + x]]++;
    }
  }
  let colored = 0;
  let best = -1;
  for (let c = 2; c < counts.length; c++) {
    colored += counts[c];
    if (best < 0 || counts[c] > counts[best]) best = c;
  }
  if (best < 0 || colored < counts[DARK] * 2) return null;
  return chroma[best - 2];
}

/* ============================================================ まとめて実行 */

/**
 * 写真 1 枚をまるごと解析する。
 * @param {{width:number,height:number,data:Uint8ClampedArray}} img
 * @param {{outline?:object}} [opts] outline を渡すと外周さがしを飛ばす（手動であわせたとき）
 */
export function analyzePhoto(img, { outline } = {}) {
  const o = outline || detectOutline(img);
  const rect = rectify(img, o);
  const cls = classify(rect);
  const pellets = detectPellets(cls);
  return { outline: o, rect, pellets };
}

/* ============================================================ 5) ととのえる */

/**
 * 読みとった星を「実際に作れる玉」に整形する。
 *   ・玉の向きを回す（写真が横向き・さかさまのとき）
 *   ・はみ出しは内側へ、重なりはおたがいに押し広げる（形はできるだけ保つ）
 *   ・こうしに そろえる: 最密の六角格子のいちばん近いマスへ寄せる
 *   ・最後に canPlacePellet を必ず通す（通らないものだけ近くの空きへ／入らなければ捨てる）
 *
 * @param {{x:number,y:number,color:string,score?:number}[]} raw  cm
 * @param {{rotation?:number, snapGrid?:boolean}} [opts] rotation は度（時計まわり）
 * @returns {{pellets:object[], moved:number, dropped:number}}
 */
export function tidyPellets(raw, { rotation = 0, snapGrid = false } = {}) {
  const rad = (rotation * Math.PI) / 180;
  const cs = Math.cos(rad);
  const sn = Math.sin(rad);
  const pts = raw
    .slice()
    .sort((a, b) => (b.score ?? 1) - (a.score ?? 1))
    .slice(0, MAX_PELLETS)
    .map((p) => {
      const x = p.x * cs - p.y * sn;
      const y = p.x * sn + p.y * cs;
      return { x, y, ox: x, oy: y, color: p.color };
    });

  if (snapGrid) snapToSlots(pts);
  else relax(pts);

  const out = [];
  let moved = 0;
  let dropped = Math.max(0, raw.length - MAX_PELLETS);
  for (const p of pts) {
    let spot = canPlacePellet(p.x, p.y, out).ok ? { x: p.x, y: p.y } : null;
    if (!spot) spot = findNearbySpot(p.x, p.y, out, { maxDist: 1.2 });
    if (!spot) {
      dropped++;
      continue;
    }
    const pel = createPellet(spot.x, spot.y, p.color);
    out.push(pel);
    if (Math.hypot(pel.x - p.ox, pel.y - p.oy) > 0.08) moved++;
  }
  return { pellets: out, moved, dropped };
}

function clampInside(p) {
  const lim = MAX_PELLET_CENTER_R_CM - 0.002;
  const r = Math.hypot(p.x, p.y);
  if (r > lim) {
    p.x *= lim / r;
    p.y *= lim / r;
  }
}

/** 重なっている星どうしを少しずつ押し広げる */
function relax(pts) {
  const need = MIN_PELLET_GAP_CM * 1.003;
  for (const p of pts) clampInside(p);
  for (let iter = 0; iter < 120; iter++) {
    let worst = 0;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i];
        const b = pts[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        const d = Math.hypot(dx, dy);
        if (d >= need) continue;
        if (d < 1e-6) {
          // 完全に同じ位置: 決まった向きへ離す
          const ang = (i * 2.399 + j) % (Math.PI * 2);
          dx = Math.cos(ang);
          dy = Math.sin(ang);
        } else {
          dx /= d;
          dy /= d;
        }
        const push = (need - d) / 2;
        a.x -= dx * push;
        a.y -= dy * push;
        b.x += dx * push;
        b.y += dy * push;
        worst = Math.max(worst, push);
      }
    }
    for (const p of pts) clampInside(p);
    if (worst < 1e-4) break;
  }
}

/** 六角格子のマスへ、近い組み合わせから順に割りあてる */
function snapToSlots(pts) {
  const slots = hexSlots();
  const pairs = [];
  pts.forEach((p, i) => slots.forEach((s, k) => pairs.push({ i, k, d: Math.hypot(p.x - s.x, p.y - s.y) })));
  pairs.sort((a, b) => a.d - b.d);
  const usedP = new Set();
  const usedS = new Set();
  for (const pr of pairs) {
    if (usedP.has(pr.i) || usedS.has(pr.k)) continue;
    usedP.add(pr.i);
    usedS.add(pr.k);
    pts[pr.i].x = slots[pr.k].x;
    pts[pr.i].y = slots[pr.k].y;
  }
  // マスが足りなかった星は、そのまま（あとで近くの空きをさがす）
  for (let i = 0; i < pts.length; i++) if (!usedP.has(i)) clampInside(pts[i]);
}
