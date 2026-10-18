#!/usr/bin/env node
// Maintainers only: refresh vendor/cruller/ from upstream Cruller (newest commit on its default branch).
// The skill itself never runs this; it only reads the vendored files. Review the diff before committing,
// and run the smoke test (node scripts/rtink.mjs selftest) afterwards: a changed editorInternals API or
// settings-map format would break the profile commands.
//
//   node scripts/update-vendor.mjs [--ref <commit-or-branch>]

import fs from 'node:fs';
import path from 'node:path';
import { VENDOR } from './lib/tools.mjs';
import { ghApi, ghRaw, sha256, parseArgs } from './lib/util.mjs';

const REPO = 'margaale/Cruller';
const FILES = { 'src/web/editor.js': 'editor.js', 'src/web/rt4k_settings.json': 'rt4k_settings.json', LICENSE: 'LICENSE' };

const { opt } = parseArgs(process.argv.slice(2));
const ref = opt.ref || (await ghApi(`repos/${REPO}`)).default_branch;
const c = await ghApi(`repos/${REPO}/commits/${encodeURIComponent(ref)}`);
fs.mkdirSync(VENDOR, { recursive: true });
for (const [src, dst] of Object.entries(FILES)) {
  const buf = await ghRaw(REPO, c.sha, src);
  const out = path.join(VENDOR, dst);
  const old = fs.existsSync(out) ? sha256(fs.readFileSync(out)) : null;
  fs.writeFileSync(out, buf);
  console.log(`${dst}: ${old === sha256(buf) ? 'unchanged' : 'updated'}`);
}
fs.writeFileSync(path.join(VENDOR, 'SOURCE.md'), `# Vendored from Cruller

- Upstream: https://github.com/${REPO} (GPL-3.0, see LICENSE in this folder)
- Commit: \`${c.sha}\` (branch ${ref}, ${c.commit.committer.date})
- Files: \`src/web/editor.js\` (profile codec: parse, CRC, encode/decode), \`src/web/rt4k_settings.json\` (settings byte map)
- Unmodified. To refresh: \`node scripts/update-vendor.mjs\` (maintainers only; the skill never fetches at runtime).
`);
console.log(`vendored ${REPO}@${c.sha.slice(0, 10)}`);
