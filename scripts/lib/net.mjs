// Network commands: manage a RetroTINK-4K / 4K CE over Wi-Fi through a DonutShop bridge
// (github.com/svirant/DonutShop: an ESP32-S3 on the RT4K's USB-C port with a REST API), so the SD card
// can stay in the unit. Host: --host, else RTINK_HOST, else donutshop.local.
//
// Baseline model: the newest net backup (backups/net-*.zip) IS the reference. Whatever the unit had when
// it was backed up is taken as intended, including tuning done on the unit. Backups default to the SVS
// profiles (profile/SVS), the files that get edited; --all takes every profile, --path picks folders.
// A push refuses to overwrite a file that changed on the unit since the baseline, and a successful push
// rolls the baseline forward so it always matches the unit.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { die, parseArgs, sha256, stamp, mkdirp } from './util.mjs';
import { readZip, writeZip } from './zip.mjs';
import { MODELS, fwVersionOf } from './card.mjs';
import { fetchPackage, pick, cmpVer } from './fw.mjs';
import { profileCmd } from './profile.mjs';
import { loadCodec } from './tools.mjs';

const DEFAULT_SCOPE = ['profile/SVS', 'profile/prof.map'];
let HOST;
const base = () => `http://${HOST}`;
const enc = (rel) => rel.split('/').map(encodeURIComponent).join('/');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function req(p, init = {}, { tries = 3, timeout = 120000 } = {}) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(base() + p, { ...init, signal: AbortSignal.timeout(timeout) });
      return r;
    } catch (e) { last = e; await sleep(1500); }
  }
  throw new Error(`cannot reach DonutShop at ${base()} (${last?.cause?.code || last?.message}). Is it powered and on the same network? Try --host <ip>.`);
}

async function json(p, init) {
  const r = await req(p, init);
  const t = await r.text();
  let j; try { j = JSON.parse(t); } catch { throw new Error(`${p}: HTTP ${r.status}, not JSON: ${t.slice(0, 120)}`); }
  if (!r.ok || j.ok === false) throw new Error(`${p}: ${j.error || 'HTTP ' + r.status}`);
  return j;
}

// A console command; returns the RT4K's reply text (lines without the "[COM] " prefix).
export async function command(c, { quiet = false } = {}) {
  const j = await json('/api/command', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: c }) });
  if (!j.responded && !quiet) throw new Error(`the RetroTINK did not answer "${c}" (is it on? standby does not answer)`);
  return String(j.response || '').split('\n').map((l) => l.replace(/^\[COM\] ?/, '').trim()).filter(Boolean).join('\n');
}

const list = async (rel) => (await json('/api/files/' + enc(rel))).entries;

async function getFile(rel, size) {
  for (let i = 0; i < 3; i++) {
    const r = await req('/api/files/' + enc(rel));
    if (!r.ok) throw new Error(`download ${rel}: HTTP ${r.status} ${(await r.text()).slice(0, 120)}`);
    const b = Buffer.from(await r.arrayBuffer());
    if (size === undefined || b.length === size) return b;
  }
  throw new Error(`download ${rel}: size never matched the listing (${size} bytes)`);
}

async function putFile(rel, data) {
  return json('/api/files/' + enc(rel), { method: 'PUT', headers: { 'Content-Type': 'application/octet-stream' }, body: data });
}

// Write a file, read it back and compare hashes (DonutShop's USB uploads run without per-frame ACKs).
async function putVerified(rel, data) {
  const t0 = Date.now();
  const r = await putFile(rel, data);
  const back = await getFile(rel);
  if (sha256(back) !== sha256(data)) throw new Error(`${rel}: read-back does not match what was written. Do NOT use it; try again.`);
  return { ...r, secs: ((Date.now() - t0) / 1000).toFixed(0) };
}

// The listing entry for one path, or null if it isn't there.
async function stat(rel) {
  const parent = path.posix.dirname(rel), name = path.posix.basename(rel);
  return (await list(parent === '.' ? '' : parent).catch(() => [])).find((e) => e.name === name) || null;
}

// Every file under the given card paths (folders, or single files such as profile/prof.map).
async function walkRemote(roots) {
  const out = [];
  const rec = async (rel) => {
    for (const e of await list(rel)) {
      const r = `${rel}/${e.name}`;
      if (e.type === 'dir') await rec(r); else out.push({ rel: r, size: e.size, mtime: e.mtime });
    }
  };
  for (const r0 of roots) {
    const r = r0.replace(/^\/+|\/+$/g, '');
    const e = await stat(r);
    if (!e) continue;
    if (e.type === 'dir') await rec(r); else out.push({ rel: r, size: e.size, mtime: e.mtime });
  }
  return out.sort((a, b) => (a.rel < b.rel ? -1 : 1));
}

async function mkdirs(dir) {
  let cur = '';
  for (const part of dir.split('/')) {
    cur = cur ? `${cur}/${part}` : part;
    if (await stat(cur)) continue;
    await json('/api/files/mkdir', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: cur }) });
  }
}

// prof.map: 13 slots of 1040 bytes, each a NUL-terminated path under profile/. Slot N-1 is remote
// button N; slot 13 is presumably the power-up profile (as in card.mjs).
const SLOT = 1040, SLOTS = 13, MAP_PATH = 'profile/prof.map';
const slotName = (s) => (s < 12 ? `button ${s + 1}` : 'slot 13 (power-up?)');
const slotPath = (m, s) => { const b = m.subarray(s * SLOT, (s + 1) * SLOT); const z = b.indexOf(0); return b.subarray(0, z < 0 ? b.length : z).toString('utf8'); };

// Write one file to the unit, guarded by the baseline: it may replace only a file the baseline holds and
// the unit hasn't changed since; a brand-new file is fine anywhere. Then roll the baseline forward.
async function pushFile(data, dest, opt, what) {
  const ref = baselineOr(opt.baseline, opt);
  const b = readBaseline(ref);
  const inScope = b.scope.some((s) => dest === s || dest.startsWith(s + '/'));
  const cur = await stat(dest);
  if (cur && !inScope) die(`${dest} is outside the baseline (${b.scope.join(', ')}). Back it up first: net backup --path ${dest}`);
  const old = b.files.find((e) => e.name === dest);
  const curData = cur ? await getFile(dest, cur.size) : null;
  if (old && curData && sha256(curData) !== sha256(old.data)) die(`${dest} was changed on the unit since the baseline (${path.basename(ref)}). Run "net backup" so the unit's version becomes the baseline, rebuild the edit from that copy, then retry.`);
  if (!old && curData) die(`${dest} exists on the unit but not in the baseline: run "net backup" first`);
  if (curData && sha256(curData) === sha256(data)) { console.log(`${dest} already has this content; nothing to do`); return false; }
  console.log(`${cur ? 'replace' : 'create'} ${dest} on the unit with ${what} (${data.length} bytes)`);
  if (!opt.yes) { console.log('dry run only: re-run with --yes'); return false; }
  if (!cur) await mkdirs(path.posix.dirname(dest));
  const w = await putVerified(dest, data);
  console.log(`written and read back OK (${w.secs} s, ${w.transport})`);
  const files = b.files.filter((e) => e.name !== dest).map((e) => ({ rel: e.name, data: e.data }));
  files.push({ rel: dest, data, mtime: new Date() });
  files.sort((x, y) => (x.rel < y.rel ? -1 : 1));
  // A new file starts being tracked: its folder, unless that's profile/ itself (too big to back up).
  const dir = path.posix.dirname(dest);
  const scope = inScope ? b.scope : [...b.scope, dir !== 'profile' && dir !== '.' ? dir : dest];
  console.log(`baseline: ${writeBaseline(outDirOf(opt), 'after-push', scope, files)}`);
  return true;
}

// Default scope: the SVS profiles and button map, plus whatever the newest baseline already tracks
// (e.g. an Experiments folder created by a push), so a fresh backup never drops a tracked file.
function scopeOf(opt) {
  if (opt.all) return ['profile'];
  if (opt.path?.length) return opt.path.map((p) => p.replace(/\\/g, '/'));
  const bl = newestBaseline(outDirOf(opt));
  return [...new Set([...DEFAULT_SCOPE, ...(bl ? readBaseline(bl).scope : [])])];
}
const outDirOf = (opt) => opt.out || path.join(process.cwd(), 'backups');
const manifestText = (files) => files.map(({ rel, data }) => `${sha256(data)}  ./${rel}`).join('\n') + '\n';

// A baseline zip also records its scope, so diffs know which folders to look at.
const SCOPE_FILE = '.rtink-scope';
function readBaseline(file) {
  const entries = readZip(fs.readFileSync(file));
  const s = entries.find((e) => e.name === SCOPE_FILE);
  const scope = s ? s.data.toString('utf8').split('\n').filter(Boolean) : [...new Set(entries.map((e) => e.name.split('/').slice(0, 2).join('/')))];
  return { file, scope, files: entries.filter((e) => e.name !== SCOPE_FILE) };
}

function writeBaseline(outDir, label, scope, files) {
  mkdirp(outDir);
  const name = path.join(outDir, `net-${label ? label.replace(/[^\w.-]+/g, '-') + '-' : ''}${stamp()}`);
  const entries = [...files.map((f) => ({ name: f.rel, data: f.data, mtime: f.mtime })), { name: SCOPE_FILE, data: Buffer.from(scope.join('\n') + '\n') }];
  fs.writeFileSync(name + '.zip', writeZip(entries));
  fs.writeFileSync(name + '.sha256', manifestText(files));
  const back = new Map(readZip(fs.readFileSync(name + '.zip')).map((e) => [e.name, sha256(e.data)]));
  if (files.some((f) => back.get(f.rel) !== sha256(f.data))) die(`backup verification FAILED; do not rely on ${name}.zip`);
  return name + '.zip';
}

// The newest net backup in the backups folder: the baseline.
function newestBaseline(outDir) {
  const zips = fs.existsSync(outDir) ? fs.readdirSync(outDir).filter((f) => /^net-.*\.zip$/.test(f)) : [];
  if (!zips.length) return null;
  zips.sort((a, b) => fs.statSync(path.join(outDir, a)).mtimeMs - fs.statSync(path.join(outDir, b)).mtimeMs);
  return path.join(outDir, zips[zips.length - 1]);
}
const baselineOr = (ref, opt) => ref || newestBaseline(outDirOf(opt)) || die(`no baseline yet: run "rtink net backup" first (looked in ${outDirOf(opt)})`);

async function backup(opt, scope) {
  const t0 = Date.now();
  const remote = await walkRemote(scope);
  const files = [];
  for (const [i, f] of remote.entries()) {
    if (remote.length > 20 && i % 25 === 0) process.stderr.write(`  ${i}/${remote.length} files...\r`);
    files.push({ ...f, data: await getFile(f.rel, f.size), mtime: new Date(f.mtime * 1000) });
  }
  const zip = writeBaseline(outDirOf(opt), opt.label, scope, files);
  const kb = (files.reduce((n, f) => n + f.data.length, 0) / 1024).toFixed(0);
  console.log(`baseline: ${zip}  (${files.length} files, ${kb} KB from ${scope.join(', ')}, ${((Date.now() - t0) / 1000).toFixed(0)} s, verified)`);
  return zip;
}

async function compare(ref) {
  const b = readBaseline(ref);
  const remote = await walkRemote(b.scope);
  const want = new Map(b.files.map((e) => [e.name, e.data]));
  const have = new Map(remote.map((f) => [f.rel, f]));
  const changed = [], removed = [], added = [];
  for (const [rel, data] of want) {
    const f = have.get(rel);
    if (!f) { removed.push(rel); continue; }
    const cur = await getFile(rel, f.size);
    if (sha256(cur) !== sha256(data)) changed.push({ rel, old: data, cur });
  }
  for (const rel of have.keys()) if (!want.has(rel)) added.push(rel);
  return { b, changed, removed, added };
}

// The RT4K's on-screen menu as text, read over DonutShop's raw serial WebSocket (port 81, the one its
// web page's Remote + OSD mirror uses). The RT4K's `osd` / `osd2` commands answer with a ready line and
// RTL1 binary frames (magic A5 5A, nonce, length, type, seq, payload, CRC-16/CCITT-FALSE): 2048 character
// codes, then 2048 colour bytes. Read-only: it never presses a key.
async function osdRead(plane = 1) {
  if (typeof WebSocket === 'undefined') throw new Error('net osd needs Node.js 22 or newer (built-in WebSocket)');
  const ws = new WebSocket(`ws://${HOST}:81`);
  ws.binaryType = 'arraybuffer';
  let buf = Buffer.alloc(0);
  const texts = [];
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error(`cannot open ws://${HOST}:81`)); setTimeout(() => rej(new Error('WebSocket connect timed out')), 5000); });
  ws.onmessage = (m) => { if (typeof m.data === 'string') texts.push(m.data); else buf = Buffer.concat([buf, Buffer.from(m.data)]); };
  const ctl = (op) => ws.send(JSON.stringify({ type: 'rt4k-bridge', op }));
  const waitFor = async (pred, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { const r = pred(); if (r) return r; await sleep(20); } return null; };
  try {
    ctl('hello');
    ctl('osdLeaseBegin');
    const lease = await waitFor(() => texts.map((t) => { try { return JSON.parse(t); } catch { return null; } }).find((j) => j?.op === 'osdLeaseBegin'), 2000);
    if (lease && !lease.ok) throw new Error('DonutShop is busy with another serial operation; try again');
    buf = Buffer.alloc(0);
    ws.send(Buffer.from(`\r${plane === 2 ? 'osd2' : 'osd'}\r\n`));
    const done = await waitFor(() => /osd (done|aborted|failed)|nothing shown|busy|unknown command/.test(buf.toString('latin1')) && buf, 6000);
    if (!done) throw new Error('no OSD reply from the RetroTINK (is it on?)');
    const s = buf.toString('latin1');
    const ready = (plane === 2 ? /osd2 ready on=(\d) osk=(\d) rows=(\d+) cols=(\d+) stride=(\d+) cells=(\d+) nonce=0x([0-9A-Fa-f]+)/ : /osd ready rows=(\d+) stride=(\d+) width=(\d+) cells=(\d+) nonce=0x([0-9A-Fa-f]+)/).exec(s);
    if (!ready) throw new Error(`the RetroTINK refused: ${s.replace(/[^\x20-\x7e\n]/g, '').trim().split('\n').pop()}`);
    const rows = +(plane === 2 ? ready[3] : ready[1]), stride = +(plane === 2 ? ready[5] : ready[2]), cells = +(plane === 2 ? ready[6] : ready[4]);
    const nonce = parseInt(plane === 2 ? ready[7] : ready[5], 16);
    let p = s.indexOf('\n', ready.index) + 1;
    const data = [];
    while (p + 8 <= buf.length) {
      if (buf[p] !== 0xa5 || buf[p + 1] !== 0x5a || buf.readUInt16LE(p + 2) !== nonce) { p++; continue; }
      const len = buf.readUInt16LE(p + 4), type = buf[p + 6];
      if (type === 3) data.push(buf.subarray(p + 8, p + 8 + len));
      p += 10 + len;
      if (type === 2) break;
    }
    const all = Buffer.concat(data);
    if (all.length < cells * 2) throw new Error(`short OSD reply (${all.length} of ${cells * 2} bytes)`);
    const chars = all.subarray(0, cells), colours = all.subarray(cells, cells * 2);
    const lines = [];
    for (let r = 0; r < rows; r++) {
      let line = '', hl = false;
      for (let c = 0; c < stride; c++) {
        const ch = chars[r * stride + c], col = colours[r * stride + c];
        line += ch >= 0x20 && ch < 0x7f ? String.fromCharCode(ch) : ch === 0 ? ' ' : '·';
        if (ch > 0x20 && ch < 0x7f && (col >> 6) !== 0) hl = true; // a filled background marks the selected row
      }
      lines.push({ text: line.replace(/\s+$/, ''), hl });
    }
    return lines;
  } finally {
    try { ctl('osdLeaseEnd'); await sleep(100); } catch {}
    ws.close();
  }
}

// Model key (4k, 4kce, 6x) from DonutShop's /api/info model string (e.g. "RT4K_CE").
const modelKey = (m) => (/6X/i.test(m) ? '6x' : /CE/i.test(m) ? '4kce' : '4k');

export async function netCmd(argv) {
  const [sub, ...rest] = argv;
  const { pos, opt } = parseArgs(rest, { bools: ['yes', 'all', 'files-only'], multi: ['path'] });
  HOST = opt.host || process.env.RTINK_HOST || 'donutshop.local';

  if (sub === 'info') {
    const info = await json('/api/info');
    const st = await json('/api/status');
    let ver = null;
    try { ver = await command('ver'); } catch {}
    const rt = info.retrotink || {}, ds = info.donutshop || {}, dst = st.donutshop || {}, rst = st.retrotink || {};
    console.log(`bridge: DonutShop ${ds.version} at ${base()} (${dst.ip || '?'}), Wi-Fi ${ds.ssid || '?'} ${dst.rssi ?? '?'} dBm, link ${dst.serial_type || '?'}`);
    console.log(`unit: ${rt.model || '?'}, firmware ${ver ? (/FW Version:\s*(\S+)/.exec(ver) || [])[1] : rt.fw + ' (cached; unit not answering)'}`);
    if (rst.power_state) console.log(`now: ${rst.power_state}, input ${rst.active_video_input}, output ${rst.active_video_output}, profile ${rst.profile_path || rst.profile || 'none'}`);
    const svs = (await list('profile/SVS').catch(() => [])).filter((e) => /^S\d+_.*\.rt4$/i.test(e.name)).map((e) => e.name).sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));
    console.log(`SVS profiles:${svs.length ? '\n  ' + svs.join('\n  ') : ' none'}`);
    const bl = newestBaseline(outDirOf(opt));
    console.log(`baseline: ${bl || 'none yet (run net backup)'}`);
  } else if (sub === 'backup') {
    await backup(opt, scopeOf(opt));
  } else if (sub === 'diff' || sub === 'verify') {
    const ref = baselineOr(pos[0], opt);
    const r = await compare(ref);
    console.log(`baseline: ${ref}  (${r.b.files.length} files, ${r.b.scope.join(', ')})`);
    if (sub === 'verify') {
      const ok = !r.changed.length && !r.removed.length && !r.added.length;
      console.log(ok ? 'OK: the unit matches the baseline' : `MISMATCH: ${r.changed.length} changed, ${r.added.length} added, ${r.removed.length} removed on the unit`);
      process.exitCode = ok ? 0 : 1;
    }
    for (const c of r.changed) {
      console.log(`CHANGED  ${c.rel}`);
      if (sub !== 'diff' || opt['files-only'] || !/\.rt4$/i.test(c.rel)) continue;
      const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rtink-'));
      fs.writeFileSync(path.join(tmp, 'a.rt4'), c.old); fs.writeFileSync(path.join(tmp, 'b.rt4'), c.cur);
      await profileCmd(['diff', path.join(tmp, 'a.rt4'), path.join(tmp, 'b.rt4')]);
      fs.rmSync(tmp, { recursive: true, force: true });
    }
    for (const f of r.added) console.log(`ADDED    ${f}`);
    for (const f of r.removed) console.log(`REMOVED  ${f}`);
    if (sub === 'diff') {
      console.log(`# ${r.changed.length} changed, ${r.added.length} added, ${r.removed.length} removed since the baseline`);
      if (r.changed.length || r.added.length || r.removed.length) console.log('# Changes on the unit are taken as intended: run "net backup" to make them the new baseline.');
    }
  } else if (sub === 'push') {
    // push <local file> <path on the card, e.g. profile/SVS/S2_SNES.rt4> --yes
    const [local, destIn] = pos;
    if (!local || !destIn) die('usage: net push <local file> <path on the card, e.g. profile/SVS/S2_SNES.rt4> --yes');
    const dest = destIn.replace(/\\/g, '/').replace(/^\/+/, '');
    const data = fs.readFileSync(local);
    if (/\.rt4$/i.test(dest)) {
      const K = loadCodec(), p = K.E.parseProfile(data);
      if (!p || !p.crcOk || p.body.length !== K.MAP.size) die(`${local} is not a valid profile (bad header, size or CRC); not sending it`);
    }
    if (await pushFile(data, dest, opt, local) && /^profile\/SVS\//.test(dest)) console.log('The unit loads it the next time the switch selects that input, or now with: net load ' + dest.replace(/^profile\//, ''));
  } else if (sub === 'buttons') {
    // buttons | buttons set <1-12|power-up> <path under profile/> --yes | buttons clear <1-12|power-up> --yes
    const [action, which, value] = pos;
    const e = await stat(MAP_PATH);
    const m = e ? await getFile(MAP_PATH, e.size) : Buffer.alloc(SLOT * SLOTS);
    if (action !== 'set' && action !== 'clear') { for (let s = 0; s < SLOTS; s++) console.log(`${slotName(s).padEnd(20)} ${slotPath(m, s) || '-'}`); return; }
    const s = which === 'power-up' ? 12 : +which - 1;
    if (!(s >= 0 && s < SLOTS)) die('button must be 1-12 or power-up');
    const rel = action === 'set' ? String(value || '').replace(/\\/g, '/').replace(/^\/?profile\//, '') : '';
    if (action === 'set' && !rel) die('usage: net buttons set <1-12|power-up> <path under profile/, e.g. SVS/S1_NES.rt4> --yes');
    if (action === 'set' && !(await stat('profile/' + rel))) die(`profile/${rel} is not on the unit`);
    console.log(`${slotName(s)}: ${slotPath(m, s) || '(none)'} -> ${rel || '(none)'}`);
    const out = Buffer.from(m);
    out.fill(0, s * SLOT, (s + 1) * SLOT);
    Buffer.from(rel, 'utf8').copy(out, s * SLOT);
    await pushFile(out, MAP_PATH, opt, 'the new button map');
    if (opt.yes) console.log('The RetroTINK reads the button map when it starts: power it off and on (remote Power twice) before using the button.');
  } else if (sub === 'load') {
    const p = (pos[0] || die('usage: net load <path under profile/, e.g. SVS/S2_SNES.rt4>')).replace(/\\/g, '/').replace(/^\/?profile\//, '');
    const r = await command(`prof load ${p}`);
    if (!/prof load ok/.test(r)) die(`the RetroTINK refused to load ${p}: ${r || 'no reply'}`);
    console.log(`loaded profile/${p}`);
  } else if (sub === 'osd') {
    // osd [--plane 2]: what the menu shows right now, as text ("> " marks the selected row)
    const lines = await osdRead(opt.plane === '2' ? 2 : 1);
    const shown = lines.filter((l) => l.text.trim());
    if (!shown.length) { console.log('(no menu on screen)'); return; }
    let first = lines.findIndex((l) => l.text.trim()), last = lines.length - 1;
    while (last > first && !lines[last].text.trim()) last--;
    for (const l of lines.slice(first, last + 1)) console.log(`${l.hl ? '> ' : '  '}${l.text}`);
  } else if (sub === 'cmd') {
    // SVS commands (e.g. "SVS NEW INPUT=2", as the switch sends) act without answering.
    const c = pos.join(' ');
    const r = await command(c, { quiet: /^svs /i.test(c) });
    console.log(r || (/^svs /i.test(c) ? '(sent; SVS commands give no reply)' : ''));
  } else if (sub === 'fw') {
    // fw install [version|latest] [--channel experimental|release] --yes
    if (pos[0] !== 'install') die('usage: net fw install [version|latest] [--channel experimental|release] --yes');
    const channel = opt.channel || 'experimental';
    const info = await json('/api/info');
    const model = modelKey(info.retrotink?.model || '');
    const verLine = await command('ver');
    const installed = (/FW Version:\s*(\S+)/.exec(verLine) || [])[1];
    const pkg = await fetchPackage(await pick(channel, pos[1]));
    const rbf = Object.keys(pkg.files).find((f) => MODELS[model].rbf.test(f)) || die(`package ${pkg.version} has no bitstream for ${MODELS[model].name}`);
    console.log(`${MODELS[model].name}: installed ${installed || '?'}; will install ${pkg.version} (${channel}) over Wi-Fi: write ${rbf}, then rt4kup.bin, then run the unit's updater (~40 s, it restarts)`);
    if (installed && cmpVer(pkg.version, installed) <= 0) console.log(`note: ${pkg.version} is not newer than ${installed}`);
    if (!opt.yes) { console.log('dry run only: re-run with --yes. Profiles are not touched.'); return; }
    for (const f of [rbf, 'rt4kup.bin']) { // rt4kup.bin last: it names the .rbf to install
      const data = fs.readFileSync(path.join(pkg.dir, f));
      const w = await putVerified(f, data);
      console.log(`  ${f}: written and read back OK (${w.secs} s)`);
    }
    const staged = fwVersionOf(fs.readFileSync(path.join(pkg.dir, 'rt4kup.bin')));
    const chk = await command('fwup check');
    const m = /fwup ok version=(\S+) token=(\S+)/.exec(chk);
    if (!m) die(`the RetroTINK refused the update: ${chk}`);
    if (staged && m[1] !== staged && m[1] !== pkg.version) die(`the unit sees version ${m[1]} on the card, expected ${pkg.version}; not installing`);
    console.log(`  fwup check: ${m[1]} ok; installing (do not power off)...`);
    await command(`fwup go ${m[2]}`, { quiet: true });
    const t0 = Date.now();
    while (Date.now() - t0 < 180000) {
      await sleep(5000);
      let v = '';
      try { v = await command('ver', { quiet: true }); } catch {}
      const now = (/FW Version:\s*(\S+)/.exec(v) || [])[1];
      if (now && now === m[1]) { console.log(`installed: ${now} (${((Date.now() - t0) / 1000).toFixed(0)} s). Older .rbf files stay on the card, unused.`); return; }
    }
    die('the unit did not report the new version within 3 minutes. Check the TV and its LED; a red blink means an install error.');
  } else {
    die(`net commands: info, backup, diff, verify, push, buttons, load, osd, cmd, fw install (got "${sub || ''}")`);
  }
}
