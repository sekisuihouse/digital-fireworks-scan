/**
 * 「しゃしんから つくる」ダイアログ
 * =========================================================================
 * 紙に描いた花火玉を写真でとりこんで、そのまま編集中の玉にする。
 *
 *   ① しゃしんを とる / えらぶ
 *   ② よみとり結果を見る
 *        左: 写真の上に、見つけた外周（6cm）と星を重ねて表示
 *            外周がずれていたら、ドラッグで動かす・スライダーで大きさをあわせる
 *        右: 整形したあとの玉（実際に使われる配置）
 *            向きを 90° ずつ回す／こうしに そろえる
 *   ③ この たまを つかう → 編集画面へ（あとは ふつうに なおせる）
 *
 * 解析そのものは analyze.js（DOM に触らない純粋な計算）。
 */
import { el, clear } from '../core/dom.js';
import { uiIcon } from '../components/icons.js';
import { openModal, confirmDialog } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import { drawShell } from '../components/shell-render.js';
import { getPelletColor } from '../data/pellet-colors.js';
import { createShell, PELLET_RADIUS_CM, SHELL_RADIUS_CM } from '../types/shell.js';
import { uid } from '../core/rng.js';
import * as store from '../app/state.js';
import {
  analyzePhoto,
  tidyPellets,
  outlineRadius,
  RECT_SIZE,
} from './analyze.js';

/** 解析・表示に使う写真の長辺 [px]（これ以上大きくしても精度はほぼ変わらない） */
const PHOTO_MAX = 1000;

export function openScanDialog() {
  const body = el('div.scan');
  const modal = openModal({ title: 'しゃしんから つくる', wide: true, body });

  /** いま見ている写真と解析結果 */
  let photo = null; // {canvas, width, height, data}
  let result = null; // analyzePhoto の戻り値
  let tidy = null; // tidyPellets の戻り値
  let rotation = 0;
  let snapGrid = false;

  showPick();

  /* ------------------------------------------------------- ① えらぶ */

  function showPick() {
    clear(body);
    const fileBtn = (cls, icon, label, capture) =>
      el(`label.btn.btn-big.file-btn.${cls}`, {}, [
        el('span', { html: uiIcon(icon) }),
        el('span', {}, [label]),
        el('input', {
          type: 'file',
          accept: 'image/*',
          capture: capture ? 'environment' : null,
          onChange: (e) => {
            const f = e.target.files?.[0];
            e.target.value = '';
            if (f) handleFile(f);
          },
        }),
      ]);

    body.append(
      el('ol.scan-steps', {}, [
        el('li', {}, [
          el('b', {}, ['ちょっけい 6cm の まる']),
          'の なかに、',
          el('b', {}, ['ちょっけい 1cm の まる（ほし）']),
          'を いろペンで かく',
        ]),
        el('li', {}, ['ほしは なかまで ぬりつぶす。「しろ」の ほしは くろい せんで まるだけ かく']),
        el('li', {}, ['あかるい ところで、まうえから まる ぜんたいが うつるように しゃしんを とる']),
      ]),
      el('div.scan-pick', {}, [
        fileBtn('btn-accent', 'camera', 'しゃしんを とる', true),
        fileBtn('btn-soft', 'gallery', 'がぞうを えらぶ', false),
      ]),
      el('div.scan-print', {}, [
        el('span', {}, ['6cm の まるが かいてある よう紙が ないときは → ']),
        el('button.btn.btn-ghost.btn-icon-text', {
          type: 'button',
          html: uiIcon('print') + '<span>よう紙を いんさつ</span>',
          onClick: printWorksheet,
        }),
      ])
    );
  }

  // 画像ファイルをダイアログへドラッグ＆ドロップしてもよい（PC 向け）
  modal.panel.addEventListener('dragover', (e) => e.preventDefault());
  modal.panel.addEventListener('drop', (e) => {
    e.preventDefault();
    const f = e.dataTransfer?.files?.[0];
    if (f) handleFile(f);
  });

  async function handleFile(file) {
    if (!file.type.startsWith('image/')) {
      showToast('がぞうの ファイルを えらんでね', 'warn');
      return;
    }
    clear(body);
    body.append(el('div.scan-busy', {}, [el('span.scan-spinner'), 'よみとっています…']));
    try {
      photo = await loadPhoto(file);
    } catch {
      showToast('この がぞうは よみこめませんでした', 'error');
      showPick();
      return;
    }
    // 「よみとっています」を先に画面へ出してから重い処理をする
    await new Promise((r) => setTimeout(r, 30));
    rotation = 0;
    snapGrid = false;
    analyze();
    showResult();
  }

  /* ---------------------------------------------------- ② けっか */

  function analyze(outline) {
    result = analyzePhoto(photo, { outline });
    retidy();
  }

  function retidy() {
    tidy = tidyPellets(result.pellets, { rotation, snapGrid });
  }

  function showResult() {
    clear(body);

    const photoCv = el('canvas.scan-photo');
    const previewCv = el('canvas.scan-preview');
    const summary = el('p.scan-summary');

    const r0 = outlineRadius(result.outline);
    const minSide = Math.min(photo.width, photo.height);
    const sizeInput = el('input.scan-range', {
      type: 'range',
      min: String(Math.round(minSide * 0.08)),
      max: String(Math.round(Math.max(photo.width, photo.height) * 0.6)),
      step: '1',
      value: String(Math.round(r0)),
      'aria-label': 'まるの おおきさ',
    });

    const snapBtn = el('button.btn.btn-soft.btn-icon-text.scan-toggle', {
      type: 'button',
      html: uiIcon('grid') + '<span>こうしに そろえる</span>',
      onClick: () => {
        snapGrid = !snapGrid;
        retidy();
        paintAll();
      },
    });

    body.append(
      el('div.scan-result', {}, [
        el('div.scan-col', {}, [
          el('div.scan-label', {}, ['しゃしん']),
          el('div.scan-photo-wrap', {}, [photoCv]),
          el('div.scan-adjust', {}, [
            el('span.scan-adjust-label', {}, ['まるの おおきさ']),
            sizeInput,
            el('button.btn.btn-ghost.btn-icon-text', {
              type: 'button',
              title: 'まるを じどうで さがしなおす',
              html: uiIcon('reset') + '<span>じどう</span>',
              onClick: () => {
                analyze();
                sizeInput.value = String(Math.round(outlineRadius(result.outline)));
                paintAll();
              },
            }),
          ]),
          el('p.scan-note', {}, ['まるが ずれていたら、しゃしんを ドラッグして あわせてね']),
        ]),
        el('div.scan-col', {}, [
          el('div.scan-label', {}, ['できあがり']),
          el('div.scan-preview-wrap', {}, [previewCv]),
          el('div.scan-adjust', {}, [
            el('button.btn.btn-soft.btn-icon-text', {
              type: 'button',
              title: 'ひだりに まわす',
              html: uiIcon('undo') + '<span>まわす</span>',
              onClick: () => rotate(-90),
            }),
            el('button.btn.btn-soft.btn-icon-text', {
              type: 'button',
              title: 'みぎに まわす',
              html: uiIcon('redo') + '<span>まわす</span>',
              onClick: () => rotate(90),
            }),
            snapBtn,
          ]),
          summary,
        ]),
      ]),
      el('div.scan-foot', {}, [
        el('button.btn.btn-ghost', {
          type: 'button',
          html: uiIcon('camera') + '<span>とりなおす</span>',
          onClick: showPick,
        }),
        el('button.btn.btn-accent.btn-big', {
          type: 'button',
          html: uiIcon('brush') + '<span>この たまを つかう</span>',
          onClick: apply,
        }),
      ])
    );

    function rotate(deg) {
      rotation = (rotation + deg + 360) % 360;
      retidy();
      paintAll();
    }

    /* --- 外周を手であわせる: ドラッグで移動、スライダーで大きさ --- */
    let drag = null;
    photoCv.addEventListener('pointerdown', (e) => {
      const p = toPhoto(photoCv, e, photo.width);
      drag = { x: p.x, y: p.y, cx: result.outline.cx, cy: result.outline.cy };
      photoCv.setPointerCapture?.(e.pointerId);
      e.preventDefault();
    });
    photoCv.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const p = toPhoto(photoCv, e, photo.width);
      result.outline = adjustOutline(result.outline, { cx: drag.cx + p.x - drag.x, cy: drag.cy + p.y - drag.y });
      paintPhoto(photoCv, { showPellets: false });
    });
    const endDrag = () => {
      if (!drag) return;
      drag = null;
      analyze(result.outline);
      paintAll();
    };
    photoCv.addEventListener('pointerup', endDrag);
    photoCv.addEventListener('pointercancel', endDrag);

    sizeInput.addEventListener('input', () => {
      result.outline = adjustOutline(result.outline, { r: Number(sizeInput.value) });
      paintPhoto(photoCv, { showPellets: false });
    });
    sizeInput.addEventListener('change', () => {
      analyze(result.outline);
      paintAll();
    });

    function paintAll() {
      paintPhoto(photoCv, { showPellets: true });
      paintPreview(previewCv);
      snapBtn.classList.toggle('is-on', snapGrid);
      summary.textContent = summaryText();
      summary.classList.toggle('is-warn', !result.outline.found || !tidy.pellets.length);
    }

    // レイアウトが決まってから描く（キャンバスの表示サイズに合わせる）
    requestAnimationFrame(paintAll);
    setTimeout(paintAll, 60);
  }

  function summaryText() {
    if (!result.outline.found) {
      return '6cm の まるが うまく みつからなかったよ。しゃしんを ドラッグして、あおい まるを あわせてね';
    }
    const n = tidy.pellets.length;
    if (!n) return 'ほしが みつからなかったよ。いろを こく ぬって、あかるい ところで とりなおしてみてね';
    let t = `ほしを ${n}こ よみとったよ。`;
    if (tidy.moved) t += `かさなりや はみだしを なおすため ${tidy.moved}こ すこし ずらしたよ。`;
    if (tidy.dropped) t += `${tidy.dropped}こ は はいりきらなかったよ。`;
    return t + 'いろや ばしょは つくる がめんで なおせるよ';
  }

  /** 写真 + 見つけた外周 + 見つけた星 */
  function paintPhoto(cv, { showPellets }) {
    const { ctx, w, h } = fitCanvas(cv, photo.width / photo.height, window.innerHeight * 0.5);
    const k = w / photo.width;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(photo.canvas, 0, 0, w, h);

    const o = result.outline;
    const [m00, m01, m10, m11] = o.m;
    const unit = k * Math.sqrt(Math.abs(m00 * m11 - m01 * m10)); // 単位円 1 あたりの画面 px
    const px = (w / 400) * (window.devicePixelRatio > 1 ? 1.4 : 1);

    ctx.save();
    ctx.setTransform(k * m00, k * m10, k * m01, k * m11, k * o.cx, k * o.cy);
    // 外周
    ctx.lineWidth = (3.5 * px) / unit;
    ctx.strokeStyle = o.found ? 'rgba(47,138,74,0.95)' : 'rgba(40,110,255,0.95)';
    ctx.setLineDash(o.found ? [] : [12 / unit, 8 / unit]);
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // 星（写真の上では、整形まえの読みとった位置に出す）
    if (showPellets) {
      const pr = PELLET_RADIUS_CM / SHELL_RADIUS_CM;
      const half = RECT_SIZE / 2;
      for (const p of result.pellets) {
        const ux = (p.px - half) / half;
        const uy = (p.py - half) / half;
        ctx.beginPath();
        ctx.arc(ux, uy, pr, 0, Math.PI * 2);
        ctx.lineWidth = (5 * px) / unit;
        ctx.strokeStyle = 'rgba(255,255,255,0.95)';
        ctx.stroke();
        ctx.lineWidth = (2.6 * px) / unit;
        ctx.strokeStyle = getPelletColor(p.color).swatch;
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  /** 整形したあとの玉（実際に使われる配置） */
  function paintPreview(cv) {
    const { ctx, w, h } = fitCanvas(cv, 1, window.innerHeight * 0.5);
    ctx.fillStyle = '#0a1122';
    ctx.fillRect(0, 0, w, h);
    drawShell(ctx, { pellets: tidy.pellets }, w / 2, h / 2, Math.min(w, h) * 0.45, { showCase: true });
  }

  /* ------------------------------------------------------- ③ つかう */

  async function apply() {
    if (!tidy.pellets.length) {
      showToast('ほしが みつかっていないよ', 'warn');
      return;
    }
    if (store.state.shell.pellets.length) {
      const ok = await confirmDialog({
        title: 'いまの たまを おきかえますか？',
        message: 'しゃしんの たまを よみこむと いまの たまは きえます（ほぞんして いなければ）',
        okLabel: 'よみこむ',
      });
      if (!ok) return;
    }
    store.setShell(
      createShell({ id: uid('shell'), name: 'しゃしんの花火', pellets: tidy.pellets }),
      { dirty: true }
    );
    modal.close();
    showToast(`しゃしんから ほしを ${tidy.pellets.length}こ よみこんだよ`, 'success');
  }
}

/* ============================================================ 補助 */

/** 写真ファイル → 長辺 PHOTO_MAX の画素データ（スマホ写真の向き情報はブラウザが反映する） */
async function loadPhoto(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const s = Math.min(1, PHOTO_MAX / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.max(1, Math.round(img.naturalWidth * s));
    const h = Math.max(1, Math.round(img.naturalHeight * s));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, w, h);
    const { data } = ctx.getImageData(0, 0, w, h);
    return { canvas, width: w, height: h, data };
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * キャンバスを「親の幅いっぱい、ただし高さは maxCssH まで」の大きさ × dpr にあわせる。
 * aspect = 幅 / 高さ（縦長の写真でも、ゆがまず・はみださない）
 */
function fitCanvas(cv, aspect, maxCssH = Infinity) {
  const parentW = cv.parentElement?.clientWidth || 320;
  const cssW = Math.max(1, Math.min(parentW, maxCssH * aspect));
  cv.style.width = cssW + 'px';
  cv.style.height = cssW / aspect + 'px';
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = Math.max(1, Math.round(cssW * dpr));
  const h = Math.max(1, Math.round(w / aspect));
  if (cv.width !== w || cv.height !== h) {
    cv.width = w;
    cv.height = h;
  }
  const ctx = cv.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  return { ctx, w, h };
}

/** ポインタ位置 → 写真の画素座標 */
function toPhoto(cv, e, photoWidth) {
  const rect = cv.getBoundingClientRect();
  const k = photoWidth / (rect.width || 1);
  return { x: (e.clientX - rect.left) * k, y: (e.clientY - rect.top) * k };
}

/** 外周を手で動かす・大きさを変える（ななめ撮りの楕円の形はそのまま保つ） */
function adjustOutline(o, { cx = o.cx, cy = o.cy, r = outlineRadius(o) }) {
  const k = r / (outlineRadius(o) || 1);
  return { cx, cy, m: o.m.map((v) => v * k), found: true, method: 'manual' };
}

/* ======================================================== よう紙の印刷 */

/**
 * 実寸の「直径 6cm の まる」をかいた A4 のよう紙を印刷する。
 * SVG を mm 単位で書くので、印刷の倍率が 100% なら定規ではかって 6cm になる。
 */
export function printWorksheet() {
  const html = `<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><title>デジタル花火 よう紙</title>
<style>
  @page { size: A4 portrait; margin: 0; }
  * { box-sizing: border-box; }
  body { margin: 0; color: #173f24; font-family: "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", sans-serif; }
  .page { width: 210mm; height: 296mm; padding: 20mm 22mm 0; display: flex; flex-direction: column; align-items: center; }
  h1 { font-size: 19pt; margin: 0 0 3mm; letter-spacing: 0.05em; }
  .lead { font-size: 11pt; line-height: 1.8; margin: 0; text-align: center; }
  .name { margin-top: 9mm; width: 120mm; font-size: 12pt; border-bottom: 0.3mm solid #173f24; padding: 0 0 1.5mm 1mm; }
  .shell { margin-top: 18mm; }
  .note { margin-top: 14mm; font-size: 10pt; line-height: 1.8; color: #3d5a45; }
  .note li { margin: 0; }
  .sample { display: flex; align-items: center; gap: 4mm; font-size: 10pt; margin-top: 8mm; color: #3d5a45; }
</style></head>
<body><div class="page">
  <h1>デジタル花火 よう紙（2.5号玉）</h1>
  <p class="lead">まるの なかに、ちょっけい 1cm の まる（ほし）を いろペンで かこう。<br>かいたら アプリの「しゃしんから」で よみとれるよ。</p>
  <div class="name">なまえ：</div>
  <svg class="shell" width="80mm" height="80mm" viewBox="-40 -40 80 80" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="-34.5" font-size="4" text-anchor="middle" fill="#173f24">▲ うえ</text>
    <circle cx="0" cy="0" r="30" fill="none" stroke="#111" stroke-width="0.7"/>
  </svg>
  <div class="sample">
    <svg width="12mm" height="12mm" viewBox="-6 -6 12 12" xmlns="http://www.w3.org/2000/svg">
      <circle cx="0" cy="0" r="5" fill="none" stroke="#9aa" stroke-width="0.3" stroke-dasharray="1 0.8"/>
    </svg>
    <span>← ほし 1こ の おおきさ（ちょっけい 1cm）</span>
  </div>
  <ul class="note">
    <li>ほしは なかまで しっかり ぬりつぶす（あか・レモン・みどり・むらさき・あお）</li>
    <li>「しろ」の ほしは、くろい せんで まるだけ かく（なかは ぬらない）</li>
    <li>ほしどうしは かさねない ／ 6cm の まるから はみださない</li>
    <li>しゃしんは あかるい ところで、まうえから まる ぜんたいが うつるように とる</li>
  </ul>
</div></body></html>`;

  const frame = document.createElement('iframe');
  frame.setAttribute('aria-hidden', 'true');
  Object.assign(frame.style, { position: 'fixed', right: '0', bottom: '0', width: '0', height: '0', border: '0' });
  frame.srcdoc = html;
  frame.addEventListener('load', () => {
    const win = frame.contentWindow;
    const cleanup = () => setTimeout(() => frame.remove(), 500);
    win.addEventListener('afterprint', cleanup);
    setTimeout(() => frame.isConnected && frame.remove(), 120000);
    win.focus();
    win.print();
  });
  document.body.append(frame);
}
