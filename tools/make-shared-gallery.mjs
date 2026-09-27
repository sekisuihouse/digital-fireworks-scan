/**
 * バックアップ JSON（ギャラリーの「バックアップ」で書き出したもの）から、
 * だれでも見られる「みんなの花火」のデータ src/data/shared-gallery.js を作る。
 *
 *   node tools/make-shared-gallery.mjs ../fireworks_all/*.json
 *   npm run build   # ダブルクリック用の app.bundle.js にも反映する
 *
 * file:// でも読めるように JSON ではなく JS モジュールとして書き出す。
 * サムネイルはアプリが星の配置から描き直すので入れない（ファイルを小さく保つ）。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'src/data/shared-gallery.js');

const files = process.argv.slice(2);
if (!files.length) {
  console.error('つかいかた: node tools/make-shared-gallery.mjs <backup.json> ...');
  process.exit(1);
}

const byId = new Map();
for (const f of files) {
  const data = JSON.parse(fs.readFileSync(f, 'utf8'));
  if (!Array.isArray(data?.shells)) {
    console.error(`形式がちがいます: ${f}`);
    process.exit(1);
  }
  for (const r of data.shells) {
    const shell = r.shell || r;
    const id = r.id || shell.id;
    const rec = {
      id,
      name: r.name || shell.name,
      shell: {
        id,
        name: r.name || shell.name,
        pellets: shell.pellets.map(({ x, y, color }, i) => ({ id: `pel_${id}_${i}`, x, y, color })),
      },
      createdAt: Number(r.createdAt) || 0,
      updatedAt: Number(r.updatedAt) || Number(r.createdAt) || 0,
    };
    const prev = byId.get(id);
    if (!prev || rec.updatedAt >= prev.updatedAt) byId.set(id, rec);
  }
}

const records = [...byId.values()].sort((a, b) => a.createdAt - b.createdAt);
const src = `/**
 * みんなの花火（だれでもギャラリーで見られる作品）
 * このファイルは tools/make-shared-gallery.mjs で自動生成しています。手で書きかえないでください。
 */
export const SHARED_SHELLS = ${JSON.stringify(records, null, 1)};
`;
fs.writeFileSync(OUT, src);
console.log(`${records.length} はつ -> ${path.relative(ROOT, OUT)}`);
