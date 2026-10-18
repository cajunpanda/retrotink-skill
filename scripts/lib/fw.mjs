// Firmware commands: list, changelog, download, stage. Source: RetroTINK's official firmware repository
// (github.com/RetroTINK-LLC/firmware, published at retrotink-llc.github.io/firmware). One package covers the
// 4K Pro, 4K CE and 6X: it holds rt4kup.bin (which decides what gets installed) plus one .rbf bitstream per
// model. Version numbers come from the repo's commit messages ("1.99.2"); zip names are irregular.

import fs from 'node:fs';
import path from 'node:path';
import { die, parseArgs, ghApi, ghRaw, cacheDir, mkdirp, sha256 } from './util.mjs';
import { readZip } from './zip.mjs';
import { MODELS, cardRoot, fwVersionOf, modelsOn } from './card.mjs';

const REPO = 'RetroTINK-LLC/firmware';
const CHANNELS = {
  experimental: { dir: 'RetroTINK-4K/Experimental', notes: '4k-experimental.md', page: 'https://retrotink-llc.github.io/firmware/4k-experimental.html' },
  release: { dir: 'RetroTINK-4K/Release', notes: '4k.md', page: 'https://retrotink-llc.github.io/firmware/4k.html' },
};

const verKey = (v) => String(v).match(/\d+|[a-z]+/gi)?.map((x) => (/^\d+$/.test(x) ? x.padStart(6, '0') : x)).join('.') || '';
export const cmpVer = (a, b) => (verKey(a) < verKey(b) ? -1 : verKey(a) > verKey(b) ? 1 : 0);

// Recent packages on a channel: [{ version, date, zip, sha }], newest first.
async function packages(channel, n) {
  const ch = CHANNELS[channel] || die(`channel must be ${Object.keys(CHANNELS).join(' or ')}`);
  const commits = await ghApi(`repos/${REPO}/commits?path=${encodeURIComponent(ch.dir)}&per_page=${n}`);
  const out = [];
  for (const c of commits) {
    const detail = await ghApi(`repos/${REPO}/commits/${c.sha}`);
    const zip = (detail.files || []).find((f) => f.status !== 'removed' && f.filename.startsWith(ch.dir + '/') && /\.zip$/i.test(f.filename));
    if (!zip) continue;
    out.push({ version: c.commit.message.split('\n')[0].trim(), date: c.commit.committer.date.slice(0, 10), zip: zip.filename, sha: c.sha, channel });
  }
  return out;
}

// Changelog sections from the channel's notes page: [{ version, date, text }], newest first.
async function changelog(channel) {
  const md = (await ghRaw(REPO, 'main', CHANNELS[channel].notes)).toString('utf8');
  const parts = md.split(/^## Version /m).slice(1);
  return parts.map((p) => {
    const [head, ...body] = p.split('\n');
    const m = /^(\S+)\s*\(([^)]*)\)/.exec(head) || [];
    const text = body.join('\n').replace(/<[^>]+>/g, '').replace(/\n{3,}/g, '\n\n').trim();
    return { version: m[1] || head.trim(), date: m[2] || '', text };
  });
}

// Download (cached) and unpack a package. Returns { version, dir, files }.
async function fetchPackage(pkg) {
  const dir = path.join(cacheDir(), 'firmware', pkg.version.replace(/[^\w.-]+/g, '_'));
  const zipFile = path.join(dir, path.basename(pkg.zip));
  if (!fs.existsSync(zipFile)) {
    mkdirp(dir);
    const buf = await ghRaw(REPO, pkg.sha, pkg.zip);
    // RetroTINK publishes each package's SHA-256 in the changelog: check against it when listed.
    const entry = (await changelog(pkg.channel)).find((s) => s.version === pkg.version);
    const want = entry && (/SHA-256:\s*`?([0-9a-f]{64})/i.exec(entry.text) || [])[1];
    if (want && want.toLowerCase() !== sha256(buf)) die(`${path.basename(pkg.zip)} does not match the SHA-256 published in the changelog; not using it`);
    console.error(want ? `${path.basename(pkg.zip)}: SHA-256 matches the published changelog` : `${path.basename(pkg.zip)}: no published SHA-256 to check against`);
    fs.writeFileSync(zipFile, buf);
  }
  const files = {};
  for (const e of readZip(fs.readFileSync(zipFile))) {
    const name = path.basename(e.name);
    if (!name || name.startsWith('.')) continue;
    fs.writeFileSync(path.join(dir, name), e.data);
    files[name] = sha256(e.data);
  }
  if (!files['rt4kup.bin']) die(`${pkg.zip} has no rt4kup.bin; not a 4K/6X firmware package`);
  return { version: pkg.version, dir, files };
}

async function pick(channel, want) {
  const list = await packages(channel, want && want !== 'latest' ? 30 : 3);
  if (!list.length) die(`no packages found on the ${channel} channel`);
  if (!want || want === 'latest') return list[0];
  return list.find((p) => p.version === want) || die(`version ${want} not among the last 30 ${channel} packages: ${list.map((p) => p.version).join(', ')}`);
}

export async function fwCmd(argv) {
  const [sub, ...rest] = argv;
  const { pos, opt } = parseArgs(rest, { bools: ['yes', 'prune'] });
  const channel = opt.channel || 'experimental';

  if (sub === 'list') {
    for (const p of await packages(channel, +(opt.n || 8))) console.log(`${p.version.padEnd(10)} ${p.date}  ${path.basename(p.zip)}`);
    console.log(`(${channel} channel; notes: ${CHANNELS[channel].page})`);
  } else if (sub === 'changelog') {
    // changelog [--since <version>] [--n N]: what's new, newest first
    const all = await changelog(channel);
    const since = opt.since;
    const items = since ? all.filter((s) => cmpVer(s.version, since) > 0) : all.slice(0, +(opt.n || 3));
    if (!items.length) console.log(since ? `nothing newer than ${since} on the ${channel} channel` : 'no changelog entries found');
    for (const s of items) console.log(`## ${s.version} (${s.date})\n${s.text}\n`);
  } else if (sub === 'download') {
    const pkg = await fetchPackage(await pick(channel, pos[0]));
    console.log(`firmware ${pkg.version} -> ${pkg.dir}`);
    for (const f of Object.keys(pkg.files)) console.log(`  ${f}`);
  } else if (sub === 'stage') {
    // stage [version|latest] [card] [--model 4k|4kce|6x] [--prune] --yes
    const root = cardRoot(pos[1]);
    const onCard = modelsOn(root);
    const model = opt.model || (Object.keys(onCard).length === 1 ? Object.keys(onCard)[0] : null);
    if (!model || !MODELS[model]) die(`which RetroTINK is this card for? pass --model 4k (4K Pro), 4kce (4K CE) or 6x${Object.keys(onCard).length ? ` (card has bitstreams for: ${Object.keys(onCard).join(', ')})` : ''}`);
    const pkg = await fetchPackage(await pick(channel, pos[0]));
    const rbf = Object.keys(pkg.files).find((f) => MODELS[model].rbf.test(f)) || die(`package ${pkg.version} has no bitstream for ${MODELS[model].name}`);
    const up = path.join(root, 'rt4kup.bin');
    const cur = fs.existsSync(up) ? fwVersionOf(fs.readFileSync(up)) : null;
    const older = (onCard[model] || []).filter((f) => f !== rbf);
    console.log(`${MODELS[model].name}: card has ${cur || 'no firmware'} staged; will copy ${pkg.version} (rt4kup.bin + ${rbf}) to ${root}`);
    if (cur && cmpVer(pkg.version, cur) <= 0) console.log(`note: ${pkg.version} is not newer than ${cur}`);
    // The menu updater runs from the currently installed bitstream, so the old .rbf must stay unless pruning.
    const keep = older.slice(-1);
    const prune = opt.prune ? older.filter((f) => !keep.includes(f)) : [];
    if (prune.length) console.log(`--prune: will delete ${prune.join(', ')} (keeping ${keep.join(', ') || 'none'} for the menu updater)`);
    if (!opt.yes) { console.log('dry run only: back up the card first (card backup), then re-run with --yes'); return; }
    fs.copyFileSync(path.join(pkg.dir, 'rt4kup.bin'), up);
    fs.copyFileSync(path.join(pkg.dir, rbf), path.join(root, rbf));
    for (const f of prune) fs.rmSync(path.join(root, f));
    const ok = sha256(fs.readFileSync(up)) === pkg.files['rt4kup.bin'] && sha256(fs.readFileSync(path.join(root, rbf))) === pkg.files[rbf];
    if (!ok) die('copy verification FAILED; do not install from this card until fixed');
    console.log(`staged ${pkg.version}, verified. To install: eject the card safely, put it in the RetroTINK, then`);
    console.log('  Advanced Settings > OSD/Firmware > Firmware update > Check SD Card (or unplug, hold Reset, plug in).');
    console.log('  ~40 s, LED pink then blue, then green. A red blink means an install error: check the card files.');
  } else {
    die(`fw commands: list, changelog, download, stage (got "${sub || ''}")`);
  }
}
