// The profile codec is Cruller's (github.com/margaale/Cruller, GPL-3.0), vendored unmodified in
// vendor/cruller/: editor.js holds the .rt4 parser/CRC/encode/decode, rt4k_settings.json is the byte map
// of the settings, read off a real RT4K. Nothing is fetched at runtime; vendor/cruller/SOURCE.md records
// the upstream commit, and scripts/update-vendor.mjs refreshes it (maintainers only).
//
// editor.js is browser code; it runs in a node:vm context that has only `window`, `console` and a stub
// `document` (no require, no process, no fs), and exposes window.editorInternals.

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

export const VENDOR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'vendor', 'cruller');

export function vendorInfo() {
  const src = fs.readFileSync(path.join(VENDOR, 'SOURCE.md'), 'utf8');
  const commit = (/Commit: `([0-9a-f]+)`/.exec(src) || [])[1] || 'unknown';
  const date = (/\(branch \S+, ([^)]+)\)/.exec(src) || [])[1] || '';
  return { commit, date };
}

// The codec: { E (editorInternals), MAP (settings map), S (settings), C (codecs) }.
export function loadCodec() {
  const win = {};
  const src = fs.readFileSync(path.join(VENDOR, 'editor.js'), 'utf8');
  vm.runInContext(src, vm.createContext({ window: win, console, document: { getElementById: () => null } }), { filename: 'editor.js' });
  const E = win.editorInternals;
  if (!E || !E.parseProfile) throw new Error('vendor/cruller/editor.js does not expose window.editorInternals');
  const doc = JSON.parse(fs.readFileSync(path.join(VENDOR, 'rt4k_settings.json'), 'utf8'));
  const MAP = E.mapFor(doc, '');
  return { E, MAP, S: MAP.settings, C: E.codecs(MAP.settings) };
}
