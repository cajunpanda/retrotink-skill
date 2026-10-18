#!/usr/bin/env node
// rtink: manage RetroTINK-4K / 4K CE / 6X SD cards: profiles, firmware, backups.
// Run through the launcher next to this file (scripts/rtink on macOS/Linux, scripts\rtink.cmd on Windows),
// which finds Node.js or downloads a private portable copy first. Needs Node 18+, no npm packages.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { profileCmd } from './lib/profile.mjs';
import { cardCmd, findCards } from './lib/card.mjs';
import { fwCmd } from './lib/fw.mjs';
import { loadCodec, vendorInfo } from './lib/tools.mjs';
import { cacheDir, die } from './lib/util.mjs';
import { readZip, writeZip } from './lib/zip.mjs';

const HELP = `rtink: RetroTINK-4K / 4K CE / 6X SD card tool

card  find                                   list connected RetroTINK SD cards
card  info [card]                            firmware on card, bitstreams, SVS profiles, remote buttons
card  backup [card] [--out DIR] [--label X] [--skip-trash]   zip + sha256 manifest, verified
card  verify <backup.zip|.sha256|folder> [card]              does the card still match?
card  diff   <backup.zip|.sha256|folder> [card]              what changed since then
card  restore <backup.zip> [card] [--delete] --yes           put a backup back (dry run without --yes)
card  buttons [card]                         show remote button assignments (profile/prof.map)
card  buttons set <1-12|power-up> <path under profile/> [card] --yes
card  buttons clear <1-12|power-up> [card] --yes

fw    list [--channel experimental|release] [--n 8]          recent firmware packages
fw    changelog [--since 1.99.0] [--n 3] [--channel ...]      what's new
fw    download [version|latest] [--channel ...]               fetch + unpack into the cache
fw    stage [version|latest] [card] [--model 4k|4kce|6x] [--prune] --yes   copy firmware onto the card

profile check <files...>                     magic, size, CRC
profile dump <f.rt4> [--json] [--all-modes]  every mapped setting, decoded
profile diff <a.rt4> <b.rt4>                 what differs, by setting name
profile find <text>                          search settings and their allowed values
profile set <in> <out> "<label>" <value> [--mode N|--port N|--slot N|--all-modes] [--set "L=V"]... [--in-place]
profile graft <geometry.rt4> <look.rt4> <out> [--set "L=V"]...   crop/sampling of one + CRT look of other
profile mask <f.rt4> ["<mask path under mask/>" <out>] [--in-place]   show/set the mask bitmap
profile copy-bytes <from> <to> <out> 0xSTART-0xEND...        raw transplant of unmapped bytes (advanced)

doctor                                       environment, cache, codec version, cards
selftest                                     check the codec and zip code work on this machine`;

async function doctor() {
  const v = vendorInfo();
  console.log(`node ${process.version} on ${process.platform}/${process.arch} (${os.release()})`);
  console.log(`cache: ${cacheDir()}`);
  console.log(`profile codec: Cruller ${v.commit.slice(0, 10)} ${v.date} (vendored)`);
  const K = loadCodec();
  console.log(`settings map: firmware ${K.MAP.firmware}, struct ver ${K.MAP.ver}, ${K.S.length} settings, body ${K.MAP.size} bytes`);
  const cards = findCards();
  console.log(`cards: ${cards.length ? cards.join(', ') : 'none found'}`);
}

function selftest() {
  const { E, S, C, MAP } = loadCodec();
  const header = new Uint8Array(128);
  header.set(Buffer.from('RT4K Profile'));
  const body = new Uint8Array(MAP.size);
  const i = S.findIndex((s) => s.label === 'Beam Spread');
  const okSet = E.encode(S[i], C[i], body, 'Wide');
  const back = E.parseProfile(E.buildProfile(header, body));
  const ok1 = okSet && back && back.crcOk && E.decode(S[i], C[i], back.body).value === 'Wide';
  const z = readZip(writeZip([{ name: 'a/b.txt', data: Buffer.from('retrotink') }]));
  const ok2 = z.length === 1 && z[0].name === 'a/b.txt' && z[0].data.toString() === 'retrotink';
  console.log(`codec round-trip: ${ok1 ? 'ok' : 'FAILED'}\nzip round-trip: ${ok2 ? 'ok' : 'FAILED'}`);
  process.exitCode = ok1 && ok2 ? 0 : 1;
}

const [cmd, ...rest] = process.argv.slice(2);
try {
  if (cmd === 'profile') await profileCmd(rest);
  else if (cmd === 'card') await cardCmd(rest);
  else if (cmd === 'fw') await fwCmd(rest);
  else if (cmd === 'doctor') await doctor();
  else if (cmd === 'selftest') selftest();
  else console.log(HELP);
} catch (e) {
  die(`error: ${e.message}`);
}
