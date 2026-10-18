// .rt4 profile commands: check, dump, diff, find, set, graft, mask, copy-bytes.
// A profile is a 128-byte header ("RT4K Profile", CRC-16/XMODEM of the body at 0x20) + the settings body.
// Only settings in the map are named; every other byte is preserved untouched on write.

import fs from 'node:fs';
import path from 'node:path';
import { loadCodec } from './tools.mjs';
import { die, parseArgs } from './util.mjs';

// The mask bitmap path (relative to /mask) is not in the settings map. It sits at body 0x10 as a
// NUL-terminated string, just after Mask Enable (0x0c) and before Mask Strength (0x220).
export const MASK_PATH = { off: 0x10, len: 0x210 };
// The "look" block copied by graft, raw: scanline function/strength/modulation, mask enable + path,
// mask strength, convergence, energy normalize, horizontal blur.
const LOOK_RAW = [0x000, 0x240];
// Mapped global settings copied by graft (the CRT look), plus the deinterlacer algorithm.
const LOOK_MENUS = /^(Processing\/Effects Setup|Color Correction Setup|Black Frame Insertion Setup|HDMI• Output)$/;
// A per-mode kernel missing in the donor is taken from a sibling mode (576p<-480p, 720p<-480p, SDP<-CP).
const SIBLING = { 6: 5, 7: 5, 9: 8, 96: 2, 97: 1, 98: 4, 99: 3 };

let K; // codec, loaded once
const codec = async () => (K ||= await loadCodec());
const menuOf = (s) => s.path.split(' › ').pop();
const nameOf = (s) => [s.path.split(' › ').slice(1).join(' › '), s.section, s.label].filter(Boolean).join(' › ');
const show = (d) => (d.value === null ? `?hex:${d.hex}` : String(d.value));

function load(f) {
  const p = K.E.parseProfile(fs.readFileSync(f));
  if (!p) die(`${f}: not an RT4K profile (an empty "~----" menu separator file is normal in WP packs)`);
  if (!p.crcOk) console.error(`warning: ${f}: CRC mismatch (the RT4K will reject this file)`);
  if (p.body.length !== K.MAP.size) console.error(`warning: ${f}: body is ${p.body.length} bytes, the settings map expects ${K.MAP.size} (different struct version?)`);
  return p;
}
const save = (f, p, body) => fs.writeFileSync(f, K.E.buildProfile(p.header, body));
const guardOut = (src, dst, opt) => { if (path.resolve(src) === path.resolve(dst) && !opt['in-place']) die('refusing to overwrite the input; pass --in-place to do that'); };

function entries(bodies, allModes) {
  const { E, S } = K;
  const modes = new Set(), slots = new Set();
  for (const b of bodies) { E.modesUsed(S, b).forEach((m) => modes.add(m)); E.slotsUsed(S, b).forEach((k) => slots.add(k)); }
  const out = [];
  S.forEach((s, i) => {
    if (!s.bytes) return;
    const e = s.each;
    if (!e) return out.push({ i, el: 0, slot: -1, where: '' });
    const els = e.by === 'mode' && !allModes ? [...modes] : [...Array(e.count).keys()];
    for (const el of els) out.push({ i, el, slot: -1, where: e.by === 'mode' ? E.modeName(el) : `port ${el}` });
    if (e.srd !== undefined) for (const k of slots) out.push({ i, el: 0, slot: k, where: 'rate ' + E.rateName(k) });
  });
  return { out, modes: [...modes].sort((a, b) => a - b), slots: [...slots].sort((a, b) => a - b) };
}

// A setting by "Label" or "Menu › Label" (or any unique substring of the full name).
function resolve(q) {
  const { S } = K, lc = q.toLowerCase();
  const exact = S.map((s, i) => i).filter((i) => nameOf(S[i]).toLowerCase() === lc);
  const byLabel = S.map((s, i) => i).filter((i) => S[i].label.toLowerCase() === lc);
  const sub = S.map((s, i) => i).filter((i) => nameOf(S[i]).toLowerCase().includes(lc));
  const hits = exact.length ? exact : byLabel.length ? byLabel : sub;
  if (hits.length !== 1) die(`"${q}" matches ${hits.length || 'no'} settings${hits.length ? ':\n' + hits.map((i) => '  ' + nameOf(S[i])).join('\n') : ''}`);
  return hits[0];
}

function setValue(body, i, value, el = 0, slot = -1) {
  const { S, C, E } = K;
  const v = C[i].type === 'number' ? +value : value;
  if (!E.encode(S[i], C[i], body, v, el, slot)) {
    const vals = C[i].type === 'list' ? ` (values: ${S[i].values.map((x) => x[0]).join(' | ')})` : C[i].type === 'number' ? ` (${S[i].min}..${S[i].max} step ${S[i].step})` : ' (unmapped/read-only)';
    die(`cannot set ${nameOf(S[i])} to "${value}"${vals}`);
  }
}

const readMask = (body) => { const b = Buffer.from(body.subarray(MASK_PATH.off, MASK_PATH.off + MASK_PATH.len)); const z = b.indexOf(0); return b.subarray(0, z < 0 ? b.length : z).toString('utf8'); };

export async function profileCmd(argv) {
  await codec();
  const { E, S, C, MAP } = K;
  const [sub, ...rest] = argv;
  const { pos, opt } = parseArgs(rest, { bools: ['json', 'all-modes', 'in-place'], multi: ['set'] });

  if (sub === 'check') {
    let bad = 0;
    for (const f of pos) {
      const p = E.parseProfile(fs.readFileSync(f));
      const ok = p && p.crcOk && p.body.length === MAP.size;
      if (!ok) bad++;
      console.log(`${ok ? 'OK ' : 'BAD'}  ${p ? (p.crcOk ? 'crc-ok ' : 'crc-BAD') : 'not-rt4'}  ${p ? p.body.length : '-'}  ${f}`);
    }
    process.exitCode = bad ? 1 : 0;
  } else if (sub === 'dump') {
    const p = load(pos[0]);
    const { out, modes, slots } = entries([p.body], opt['all-modes']);
    const rows = out.map((x) => ({ setting: nameOf(S[x.i]), where: x.where, value: show(E.decode(S[x.i], C[x.i], p.body, x.el, x.slot)) }));
    rows.push({ setting: 'Processing/Effects Setup › Mask › File (unmapped, 0x10)', where: '', value: readMask(p.body) });
    if (opt.json) process.stdout.write(JSON.stringify({ file: pos[0], crcOk: p.crcOk, map: MAP.firmware, modes, slots, rows }, null, 1) + '\n');
    else {
      console.log(`# ${pos[0]}  crc:${p.crcOk ? 'ok' : 'BAD'}  map:${MAP.firmware}  modes:[${modes.map(E.modeName).join(', ')}]  rate-slots:[${slots.join(',')}]`);
      for (const r of rows) console.log(`${r.setting}${r.where ? ' [' + r.where + ']' : ''} = ${r.value}`);
    }
  } else if (sub === 'diff') {
    const a = load(pos[0]), b = load(pos[1]);
    const { out } = entries([a.body, b.body], false);
    const seen = new Set();
    let n = 0;
    for (const x of out) {
      const da = E.decode(S[x.i], C[x.i], a.body, x.el, x.slot), db = E.decode(S[x.i], C[x.i], b.body, x.el, x.slot);
      E.bytesAt(S[x.i], x.el, x.slot).forEach(([o, l]) => { for (let k = o; k < o + l; k++) seen.add(k); });
      if (da.hex !== db.hex) { n++; console.log(`${nameOf(S[x.i])}${x.where ? ' [' + x.where + ']' : ''}: ${show(da)} -> ${show(db)}`); }
    }
    const ma = readMask(a.body), mb = readMask(b.body);
    for (let k = MASK_PATH.off; k < MASK_PATH.off + MASK_PATH.len; k++) seen.add(k);
    if (ma !== mb) { n++; console.log(`Processing/Effects Setup › Mask › File: ${ma || '(none)'} -> ${mb || '(none)'}`); }
    let other = 0;
    for (let k = 0; k < a.body.length; k++) if (a.body[k] !== b.body[k] && !seen.has(k)) other++;
    console.log(`# ${n} setting(s) differ; ${other} other byte(s) differ outside the map (live signal state, device ID, unmapped settings)`);
  } else if (sub === 'find') {
    const lc = pos.join(' ').toLowerCase();
    S.forEach((s, i) => {
      if (!nameOf(s).toLowerCase().includes(lc)) return;
      const c = C[i], per = s.each ? `, per ${s.each.by}` : '';
      const vals = c.type === 'list' ? ': ' + s.values.map((v) => v[0]).join(' | ') : c.type === 'number' ? `: ${s.min}..${s.max} step ${s.step}` : '';
      console.log(`${nameOf(s)}  (${c.type}${per}${vals})`);
    });
  } else if (sub === 'set') {
    // set <in> <out> "<label>" <value> [--mode N | --port N | --slot N | --all-modes] [--set "Label=Value"]...
    const [src, dst, label, value] = pos;
    if (!dst || (!label && !opt.set)) die('usage: profile set <in> <out> "<label>" <value> [--mode N|--port N|--slot N|--all-modes] [--set "Label=Value"]... [--in-place]');
    guardOut(src, dst, opt);
    const p = load(src), body = p.body.slice();
    const pairs = [];
    if (label) pairs.push([label, value]);
    for (const kv of opt.set || []) { const eq = kv.indexOf('='); pairs.push([kv.slice(0, eq), kv.slice(eq + 1)]); }
    for (const [lab, val] of pairs) {
      const i = resolve(lab);
      const els = opt['all-modes'] && S[i].each && S[i].each.by === 'mode' ? E.modesUsed(S, p.body) : [opt.port !== undefined ? +opt.port : +(opt.mode || 0)];
      const slot = opt.slot !== undefined ? +opt.slot : -1;
      for (const el of els) {
        const before = show(E.decode(S[i], C[i], body, el, slot));
        setValue(body, i, val, el, slot);
        const w = S[i].each ? ` [${S[i].each.by === 'mode' ? E.modeName(el) : 'port ' + el}${slot >= 0 ? ', rate ' + E.rateName(slot) : ''}]` : '';
        console.log(`${nameOf(S[i])}${w}: ${before} -> ${show(E.decode(S[i], C[i], body, el, slot))}`);
      }
    }
    save(dst, p, body);
    console.log(`=> ${dst}`);
  } else if (sub === 'graft') {
    // graft <geometry-base> <look-donor> <out> [--set "Label=Value"]...
    const [basePath, donorPath, dst] = pos;
    if (!dst) die('usage: profile graft <geometry-base.rt4> <look-donor.rt4> <out.rt4> [--set "Label=Value"]...');
    const base = load(basePath), donor = load(donorPath), d = donor.body, body = base.body.slice();
    body.set(d.subarray(...LOOK_RAW), LOOK_RAW[0]);
    let n = 0;
    S.forEach((s) => {
      if (!s.bytes || s.each || s.readonly) return;
      if (LOOK_MENUS.test(menuOf(s)) || (menuOf(s) === 'Deinterlacer/Film Mode Setup' && s.label === 'Algorithm')) { s.bytes.forEach(([o, l]) => body.set(d.subarray(o, o + l), o)); n++; }
    });
    const donorModes = new Set(E.modesUsed(S, d));
    const kernels = S.filter((s) => s.each && s.each.by === 'mode' && / Kernel$/.test(s.label));
    const report = [];
    for (const m of E.modesUsed(S, base.body)) {
      const from = donorModes.has(m) ? m : SIBLING[m] !== undefined && donorModes.has(SIBLING[m]) ? SIBLING[m] : null;
      if (from === null) { report.push(`${m}:base`); continue; }
      for (const s of kernels) { const [[so, l]] = E.bytesAt(s, from), [[to]] = E.bytesAt(s, m); body.set(d.subarray(so, so + l), to); }
      report.push(from === m ? `${m}` : `${m}<-${from}`);
    }
    for (const kv of opt.set || []) { const eq = kv.indexOf('='); setValue(body, resolve(kv.slice(0, eq)), kv.slice(eq + 1)); }
    save(dst, base, body);
    console.log(`${path.basename(dst)}: geometry from ${path.basename(basePath)}; look (${n} settings + mask/scanline block "${readMask(d)}") from ${path.basename(donorPath)}; kernels per mode [${report.join(' ')}]${opt.set ? '; overrides: ' + opt.set.join(', ') : ''}`);
  } else if (sub === 'mask') {
    // mask <file> [<new mask path relative to /mask> <out>]
    const [src, newPath, dst] = pos;
    const p = load(src);
    if (!newPath) { console.log(readMask(p.body) || '(none)'); return; }
    if (!dst) die('usage: profile mask <in> ["RGB Masks/A Grille RYCB 600TVL.bmp" <out>] [--in-place]');
    guardOut(src, dst, opt);
    const enc = Buffer.from(newPath.replace(/\\/g, '/'), 'utf8');
    if (enc.length >= MASK_PATH.len) die('mask path too long');
    const body = p.body.slice();
    body.fill(0, MASK_PATH.off, MASK_PATH.off + MASK_PATH.len);
    body.set(enc, MASK_PATH.off);
    save(dst, p, body);
    console.log(`mask: ${readMask(p.body) || '(none)'} -> ${newPath}  => ${dst}`);
  } else if (sub === 'copy-bytes') {
    // copy-bytes <from> <to> <out> 0xSTART-0xEND [...]: raw transplant of unmapped regions (advanced)
    const [from, to, dst, ...ranges] = pos;
    if (!ranges.length) die('usage: profile copy-bytes <from.rt4> <to.rt4> <out.rt4> 0x0c-0x230 [...] [--in-place]');
    guardOut(to, dst, opt);
    const a = load(from), b = load(to), body = b.body.slice();
    for (const r of ranges) {
      const [s, e] = r.split('-').map((x) => parseInt(x, 16));
      if (!(e > s) || e > body.length) die(`bad range ${r}`);
      body.set(a.body.subarray(s, e), s);
      console.log(`copied 0x${s.toString(16)}..0x${e.toString(16)} (${e - s} bytes)`);
    }
    save(dst, b, body);
    console.log(`=> ${dst}`);
  } else {
    die(`profile commands: check, dump, diff, find, set, graft, mask, copy-bytes (got "${sub || ''}")`);
  }
}
