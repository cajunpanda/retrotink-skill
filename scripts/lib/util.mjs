// Shared helpers: cache location, GitHub fetches, hashing, file walking. Node 18+ only (global fetch),
// no npm dependencies, and every path goes through node:path so it works on Windows, macOS and Linux.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';

export const die = (msg, code = 1) => { console.error(msg); process.exit(code); };

// Where downloaded tools and firmware live: RTINK_CACHE, else the platform's usual cache directory.
export function cacheDir() {
  if (process.env.RTINK_CACHE) return process.env.RTINK_CACHE;
  const home = os.homedir();
  if (process.platform === 'win32') return path.join(process.env.LOCALAPPDATA || path.join(home, 'AppData', 'Local'), 'retrotink');
  if (process.platform === 'darwin') return path.join(home, 'Library', 'Caches', 'retrotink');
  return path.join(process.env.XDG_CACHE_HOME || path.join(home, '.cache'), 'retrotink');
}

export const mkdirp = (d) => fs.mkdirSync(d, { recursive: true });

function ghHeaders(extra = {}) {
  const h = { 'User-Agent': 'retrotink', ...extra };
  const tok = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (tok) h.Authorization = `Bearer ${tok}`;
  return h;
}

// GitHub REST API (JSON). Unauthenticated use is limited to 60 requests/hour; set GITHUB_TOKEN to lift it.
export async function ghApi(p) {
  const r = await fetch(`https://api.github.com/${p}`, { headers: ghHeaders({ Accept: 'application/vnd.github+json' }) });
  if (!r.ok) throw new Error(`GitHub API ${p}: HTTP ${r.status}${r.status === 403 ? ' (rate limited? set GITHUB_TOKEN)' : ''}`);
  return r.json();
}

// A file from a repo at a ref, as bytes (raw.githubusercontent.com, not rate limited like the API).
export async function ghRaw(repo, ref, file) {
  const url = `https://raw.githubusercontent.com/${repo}/${ref}/${file.split('/').map(encodeURIComponent).join('/')}`;
  const r = await fetch(url, { headers: ghHeaders() });
  if (!r.ok) throw new Error(`download ${url}: HTTP ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
}

export const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

// Every regular file under root, as forward-slash paths relative to root, sorted.
export function walk(root, { skip = [] } = {}) {
  const out = [];
  const rec = (dir, rel) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (skip.some((s) => r === s || r.startsWith(s + '/'))) continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) rec(full, r);
      else if (e.isFile()) out.push(r);
    }
  };
  rec(root, '');
  return out.sort();
}

// Folders an SD card should never have copied around: OS clutter, not RetroTINK data.
export const CARD_SKIP = ['System Volume Information', '$RECYCLE.BIN', '.Spotlight-V100', '.fseventsd', '.Trashes', '.TemporaryItems'];

export const stamp = () => new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);

// Minimal flag parser: --key value, --flag (boolean when next token is another flag or absent), repeatable keys.
export function parseArgs(argv, { bools = [], multi = [] } = {}) {
  const pos = [], opt = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) { pos.push(a); continue; }
    const k = a.slice(2);
    if (bools.includes(k)) { opt[k] = true; continue; }
    const v = argv[++i];
    if (v === undefined) die(`--${k} needs a value`);
    if (multi.includes(k)) (opt[k] ||= []).push(v); else opt[k] = v;
  }
  return { pos, opt };
}
