// SD card commands: find, info, backup, verify, diff, restore, buttons.
// Backups are a .zip of every file on the card plus a sha256sum-compatible manifest (".sha256"), so they
// open anywhere (double-click on Windows/macOS) and can be verified later. Writes to the card (restore,
// buttons set) print what they will do and need --yes.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { die, parseArgs, walk, sha256, stamp, mkdirp, CARD_SKIP } from './util.mjs';
import { readZip, writeZip } from './zip.mjs';
import { loadCodec } from './tools.mjs';

// A one-line summary of a profile's setup: which input it selects, output, HDR, and whether it auto-loads.
let K;
function setupOf(file) {
  try {
    K ||= loadCodec();
    const p = K.E.parseProfile(fs.readFileSync(file));
    if (!p) return '(not a profile)';
    const get = (label) => { const i = K.S.findIndex((s) => s.label === label && !s.each); return i < 0 ? '?' : K.E.decode(K.S[i], K.C[i], p.body).value ?? '?'; };
    return `input ${get('Input Source')}, out ${get('Output Resolution')}, HDR ${get('HDR')}, SVS auto-load ${get('Auto Load SVS')}`;
  } catch { return '(unreadable)'; }
}

// Firmware bitstreams by model. One firmware package covers all three; each model loads its own .rbf.
export const MODELS = {
  '4k': { rbf: /^rt4k_(\w+)\.rbf$/i, name: 'RetroTINK-4K Pro' },
  '4kce': { rbf: /^rt4kce_(\w+)\.rbf$/i, name: 'RetroTINK-4K CE' },
  '6x': { rbf: /^rt6x_(\w+)\.rbf$/i, name: 'RetroTINK-6X' },
};

function isCard(root) {
  try {
    const names = fs.readdirSync(root);
    return names.includes('rt4kup.bin') || (names.includes('profile') && names.some((n) => /\.rbf$/i.test(n) || n === 'mask'));
  } catch { return false; }
}

function candidates() {
  if (process.platform === 'win32') return [...'DEFGHIJKLMNOPQRSTUVWXYZ'].map((l) => `${l}:\\`);
  const kids = (d) => { try { return fs.readdirSync(d).map((n) => path.join(d, n)); } catch { return []; } };
  if (process.platform === 'darwin') return kids('/Volumes');
  const user = os.userInfo().username;
  return [...kids(`/media/${user}`), ...kids(`/run/media/${user}`), ...kids('/media'), ...kids('/mnt')];
}

export const findCards = () => [...new Set(candidates())].filter(isCard);

// The card root: an explicit path, else the only RetroTINK card mounted.
export function cardRoot(p) {
  if (p) { if (!isCard(p)) die(`${p} does not look like a RetroTINK SD card (no rt4kup.bin / profile folder)`); return p; }
  const found = findCards();
  if (found.length === 1) return found[0];
  die(found.length ? `several RetroTINK cards are connected, say which one:\n  ${found.join('\n  ')}` : 'no RetroTINK SD card found. Insert it in the computer (it must show up as a drive) or pass its path.');
}

// The firmware version rt4kup.bin will install: its first "x.y.z" string.
export function fwVersionOf(buf) {
  let run = '';
  for (const b of buf) {
    if (b >= 0x20 && b < 0x7f) { run += String.fromCharCode(b); continue; }
    if (/^\d+\.\d+\.\d+[a-z]?$/.test(run)) return run;
    run = '';
  }
  return null;
}

export function modelsOn(root) {
  const files = fs.readdirSync(root);
  return Object.fromEntries(Object.entries(MODELS).map(([k, m]) => [k, files.filter((f) => m.rbf.test(f))]).filter(([, v]) => v.length));
}

// prof.map: 13 slots of 1040 bytes, each a NUL-terminated path relative to /profile. Slot N-1 is remote
// button N (1..12, confirmed on a 4K CE); slot 12 is presumably the power-up profile (unconfirmed).
const SLOT = 1040, SLOTS = 13;
const slotName = (s) => (s < 12 ? `button ${s + 1}` : 'slot 13 (power-up?)');
function readMap(root) { const f = path.join(root, 'profile', 'prof.map'); return fs.existsSync(f) ? fs.readFileSync(f) : Buffer.alloc(SLOT * SLOTS); }
function slotPath(m, s) { const b = m.subarray(s * SLOT, (s + 1) * SLOT); const z = b.indexOf(0); return b.subarray(0, z < 0 ? b.length : z).toString('utf8'); }

const abs = (root, rel) => path.join(root, ...rel.split('/'));

function filesOf(root, skipTrash) {
  const trash = skipTrash ? fs.readdirSync(root).filter((n) => /^\.Trash/.test(n)) : [];
  return walk(root, { skip: [...CARD_SKIP, ...trash] }).map((rel) => ({ rel, data: fs.readFileSync(abs(root, rel)), mtime: fs.statSync(abs(root, rel)).mtime }));
}
const manifestText = (files) => files.map(({ rel, data }) => `${sha256(data)}  ./${rel}`).join('\n') + '\n';
function parseManifest(txt) {
  return new Map(txt.split(/\r?\n/).filter(Boolean).map((l) => { const i = l.indexOf('  '); return [l.slice(i + 2).replace(/^\.\//, ''), l.slice(0, i)]; }));
}

// Hashes of a reference: a .sha256 manifest, a backup .zip, or a folder (e.g. a staging copy).
function hashesOf(ref) {
  if (fs.statSync(ref).isDirectory()) return new Map(walk(ref, { skip: CARD_SKIP }).map((r) => [r, sha256(fs.readFileSync(abs(ref, r)))]));
  if (/\.zip$/i.test(ref)) return new Map(readZip(fs.readFileSync(ref)).map((e) => [e.name, sha256(e.data)]));
  return parseManifest(fs.readFileSync(ref, 'utf8'));
}

function compare(ref, root) {
  const want = hashesOf(ref);
  const have = new Set(walk(root, { skip: CARD_SKIP }));
  const changed = [], removed = [], added = [];
  for (const [rel, h] of want) {
    if (!have.has(rel)) removed.push(rel);
    else if (sha256(fs.readFileSync(abs(root, rel))) !== h) changed.push(rel);
  }
  for (const rel of have) if (!want.has(rel)) added.push(rel);
  return { changed, removed, added, total: want.size };
}

export async function cardCmd(argv) {
  const [sub, ...rest] = argv;
  const { pos, opt } = parseArgs(rest, { bools: ['yes', 'delete', 'skip-trash'] });

  if (sub === 'find') {
    const found = findCards();
    if (!found.length) { console.log('no RetroTINK SD card found'); process.exitCode = 1; }
    for (const r of found) console.log(r);
  } else if (sub === 'info') {
    const root = cardRoot(pos[0]);
    const up = path.join(root, 'rt4kup.bin');
    const ver = fs.existsSync(up) ? fwVersionOf(fs.readFileSync(up)) : null;
    console.log(`card: ${root}`);
    console.log(`firmware on card (rt4kup.bin): ${ver || 'none'}   (installed version: see the unit's About screen)`);
    for (const [k, files] of Object.entries(modelsOn(root))) console.log(`bitstreams for ${MODELS[k].name}: ${files.join(', ')}`);
    const pdir = path.join(root, 'profile');
    if (!fs.existsSync(pdir)) return;
    console.log(`profiles: ${walk(pdir).filter((f) => /\.rt4$/i.test(f)).length}`);
    const svsDir = path.join(pdir, 'SVS');
    if (fs.existsSync(svsDir)) {
      const by = {};
      for (const f of fs.readdirSync(svsDir).filter((f) => /^S\d+_.*\.rt4$/i.test(f)).sort()) (by[parseInt(f.slice(1), 10)] ||= []).push(f);
      console.log('SVS profiles (profile/SVS, loaded as S<input>_*.rt4 when the switch changes input):');
      for (const n of Object.keys(by).map(Number).sort((a, b) => a - b)) {
        console.log(`  input ${n}: ${by[n].join('  |  ')}${by[n].length > 1 ? '   <- several: only the first is used' : ''}`);
        console.log(`      ${setupOf(path.join(svsDir, by[n][0]))}`);
      }
      if (!Object.keys(by).length) console.log('  (folder exists but has no S<n>_ profiles)');
      else if (!by[0]) console.log('  (no S0_ profile: nothing special loads when every SVS input is off)');
    } else console.log('SVS: no profile/SVS folder (no Scalable Video Switch auto-loading set up)');
    const m = readMap(root), lines = [];
    for (let s = 0; s < SLOTS; s++) {
      const p = slotPath(m, s);
      if (!p) continue;
      const f = abs(pdir, p);
      lines.push(`  ${slotName(s)}: ${p}${fs.existsSync(f) ? `\n      ${setupOf(f)}` : '   <- MISSING FILE'}`);
    }
    console.log(`remote buttons (profile/prof.map):${lines.length ? '\n' + lines.join('\n') : ' none assigned'}`);
    for (const f of ['z_keep_cur_input', 'z_keep_cur_res']) if (fs.existsSync(path.join(root, f))) console.log(`${f}: ${fs.readFileSync(path.join(root, f))[0]}   (Load Profile option; not applied to SVS/DV1 auto-loads)`);
  } else if (sub === 'backup') {
    const root = cardRoot(pos[0]);
    const outDir = opt.out || path.join(process.cwd(), 'backups');
    mkdirp(outDir);
    const base = path.join(outDir, `sdcard-${opt.label ? opt.label.replace(/[^\w.-]+/g, '-') + '-' : ''}${stamp()}`);
    const files = filesOf(root, opt['skip-trash']);
    fs.writeFileSync(base + '.zip', writeZip(files.map(({ rel, data, mtime }) => ({ name: rel, data, mtime }))));
    fs.writeFileSync(base + '.sha256', manifestText(files));
    const back = new Map(readZip(fs.readFileSync(base + '.zip')).map((e) => [e.name, sha256(e.data)]));
    const bad = files.filter(({ rel, data }) => back.get(rel) !== sha256(data));
    if (bad.length) die(`backup verification FAILED for ${bad.length} file(s); do not rely on ${base}.zip`);
    const mb = (files.reduce((n, f) => n + f.data.length, 0) / 1048576).toFixed(1);
    console.log(`backup: ${base}.zip  (${files.length} files, ${mb} MB, read back and verified)`);
    console.log(`manifest: ${base}.sha256`);
  } else if (sub === 'verify' || sub === 'diff') {
    const [ref, cardPath] = pos;
    if (!ref) die(`usage: card ${sub} <backup.zip | manifest.sha256 | folder> [card]`);
    const r = compare(ref, cardRoot(cardPath));
    if (sub === 'verify') {
      const ok = !r.changed.length && !r.removed.length;
      console.log(ok ? `OK: all ${r.total} files match` : `MISMATCH: ${r.changed.length} changed, ${r.removed.length} missing`);
      for (const f of r.changed) console.log(`  CHANGED ${f}`);
      for (const f of r.removed) console.log(`  MISSING ${f}`);
      if (r.added.length) console.log(`(${r.added.length} extra file(s) on the card that are not in the reference)`);
      process.exitCode = ok ? 0 : 1;
    } else {
      for (const f of r.changed) console.log(`CHANGED  ${f}`);
      for (const f of r.added) console.log(`ADDED    ${f}`);
      for (const f of r.removed) console.log(`REMOVED  ${f}`);
      console.log(`# ${r.changed.length} changed, ${r.added.length} added, ${r.removed.length} removed (reference has ${r.total} files)`);
    }
  } else if (sub === 'restore') {
    const [zipPath, cardPath] = pos;
    if (!zipPath) die('usage: card restore <backup.zip> [card] [--delete] --yes');
    const root = cardRoot(cardPath);
    const entries = readZip(fs.readFileSync(zipPath));
    const keep = new Set(entries.map((e) => e.name));
    const extra = walk(root, { skip: CARD_SKIP }).filter((r) => !keep.has(r));
    const writes = entries.filter((e) => { const f = abs(root, e.name); return !fs.existsSync(f) || sha256(fs.readFileSync(f)) !== sha256(e.data); });
    console.log(`restore ${zipPath} -> ${root}: ${writes.length} file(s) to write; ${extra.length} file(s) on the card not in the backup ${opt.delete ? 'will be DELETED' : 'are left alone (add --delete to remove them)'}`);
    if (!opt.yes) { console.log('dry run only. Take a fresh backup first (card backup), then re-run with --yes.'); return; }
    for (const e of writes) { const f = abs(root, e.name); mkdirp(path.dirname(f)); fs.writeFileSync(f, e.data); }
    if (opt.delete) for (const r of extra) fs.rmSync(abs(root, r));
    const r = compare(zipPath, root);
    console.log(r.changed.length || r.removed.length ? `restore incomplete: ${r.changed.length} changed, ${r.removed.length} missing` : `restored and verified (${r.total} files)`);
  } else if (sub === 'buttons') {
    // buttons [card] | buttons set <1-12|power-up> <path-under-profile> [card] --yes | buttons clear <1-12|power-up> [card] --yes
    const [action, which, value, cardPath] = pos;
    const set = action === 'set', clear = action === 'clear';
    const root = cardRoot(set ? cardPath : clear ? value : action);
    const m = readMap(root);
    if (!set && !clear) { for (let s = 0; s < SLOTS; s++) console.log(`${slotName(s).padEnd(20)} ${slotPath(m, s) || '-'}`); return; }
    const s = which === 'power-up' ? 12 : +which - 1;
    if (!(s >= 0 && s < SLOTS)) die('button must be 1-12 or power-up');
    const rel = set ? String(value || '').replace(/\\/g, '/').replace(/^\/?profile\//, '') : '';
    if (set && !rel) die('usage: card buttons set <1-12|power-up> <path under profile/, e.g. SVS/S1_NES.rt4> [card] --yes');
    if (set && !fs.existsSync(abs(path.join(root, 'profile'), rel))) die(`profile/${rel} is not on the card`);
    console.log(`${slotName(s)}: ${slotPath(m, s) || '(none)'} -> ${rel || '(none)'}`);
    if (!opt.yes) { console.log('dry run only: re-run with --yes to write profile/prof.map'); return; }
    m.fill(0, s * SLOT, (s + 1) * SLOT);
    Buffer.from(rel, 'utf8').copy(m, s * SLOT);
    fs.writeFileSync(path.join(root, 'profile', 'prof.map'), m);
    console.log('written');
  } else {
    die(`card commands: find, info, backup, verify, diff, restore, buttons (got "${sub || ''}")`);
  }
}
