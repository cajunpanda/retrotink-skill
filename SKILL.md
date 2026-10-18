---
name: retrotink
description: Manage the SD card of a RetroTINK-4K, RetroTINK-4K CE or RetroTINK-6X video upscaler. Back up, verify, compare and restore the card; check for, download and stage firmware updates (with changelog relevance); and inspect, compare and edit .rt4 profiles setting by setting: scanlines, masks, kernels, HDR/PQ, crop, deinterlacer, ADC phase/gain. Also grafting a CRT look onto console profiles, Scalable Video Switch (SVS) auto-load profiles, and remote-button assignments (prof.map). Use whenever the user mentions a RetroTINK, RT4K, 4K CE, 6X, "the tink", their upscaler's SD card, .rt4 profiles, Wobbling Pixels or other community profile packs, SVS profiles, RetroTINK firmware, or asks things like "back up my card", "is there a new firmware", "what changed in my profile", "make my SNES look like a Trinitron", "why is 480i shaky", "assign profiles to the remote buttons". Use it even if they don't name the tool.
---

# RetroTINK SD card manager

Everything a RetroTINK keeps lives on its SD card: firmware, profiles, masks, button assignments. This
skill reads and edits that card safely from the user's computer.

**Assume the user is not technical.** Most RetroTINK owners are retro gamers, not developers:
- Don't ask them to install anything or run commands themselves. You run the tool, and explain results in
  plain words ("your SNES profile now uses a Trinitron-style grille").
- Avoid jargon such as offsets, CRC or bytes unless they ask.
- When they must do something physical (insert the card, press a menu option, eject), give exact,
  short steps for their OS.

## Running the tool

One command-line tool, `rtink`, sits in `scripts/` next to this file. Always run it through the launcher,
which works with nothing preinstalled:
- **macOS / Linux:** `sh "<skill dir>/scripts/rtink" <command>`
- **Windows:** `"<skill dir>\scripts\rtink.cmd" <command>` (from PowerShell: `& "<skill dir>\scripts\rtink.cmd" <command>`)

On the first run, if Node.js 18+ isn't installed, the launcher downloads a private portable copy of
Node.js from nodejs.org (~30 MB, checked against its SHA-256) into the user's cache folder. Tell the user
that's happening; nothing is installed system-wide. Firmware commands need internet. Everything else
works offline. `rtink doctor` shows the environment and any connected cards; `rtink selftest` checks the
tool works. Run `rtink` with no arguments for the full command list.

Output files (backups, edited profiles) go where you point them. Default backups go to `./backups/` under
the current directory, so `cd` somewhere sensible first, e.g. the user's project or Documents folder.

## First: understand this user's setup

Setups vary a lot. One person has a single SNES on SCART, another a dozen consoles behind a Scalable
Video Switch (SVS), another only HDMI and a MiSTer. Advice and edits that fit one are wrong for another:
an SVS profile name means nothing without a switch, and HD15 input settings are wrong for a console on
SCART. So before working on a card, know the setup. Don't guess it.

1. **Look for saved notes.** Check for a `retrotink-setup.md` in the working folder, the folder where
   their backups live. If it exists, read it, confirm it's still current in one line ("Still a 4K CE
   with the SVS and LG C4?"), and skip to the task.
2. **Infer what the card shows.** Run `rtink card info`:
   - The bitstreams give the likely model (`rt4kce_*.rbf` = 4K CE, `rt4k_*` = 4K Pro, `rt6x_*` = 6X).
   - A populated `profile/SVS` folder suggests a switch.
   - Button and SVS profiles show which inputs they use (SCART, HD15/VGA, RCA, HDMI, front).
   - Custom files and dates hint at what they've tuned.
3. **Ask for the rest**, briefly and in plain words, only what the task needs. Typically:
   - **Unit:** 4K Pro, 4K CE or 6X? (Confirm the inferred one.) Firmware installed (About screen), if
     relevant.
   - **Consoles and connections:** which consoles, what cable/port each uses (e.g. "SNES, RGB SCART"),
     and whether a switch sits in between (SVS, another auto-switch, a manual switch, or none).
   - **How they pick profiles:** SVS auto-load, remote number buttons, or loading from the menu.
   - **Display:** TV/monitor model, whether it does HDR, and whether they use the TV's motion
     smoothing/BFI or VRR (these interact: many TVs turn BFI off while VRR is on).
   - **Taste:** CRT look (and which kind of CRT) or sharp/clean; community packs in use (e.g. Wobbling
     Pixels).
   Ask at most 3–4 things at once. A user who says "I don't know" gets a sensible default and a note to
   revisit it.
4. **Save the notes** as `retrotink-setup.md` in their working folder (ask where they'd like their
   RetroTINK files, e.g. Documents/RetroTINK), so the next session starts informed. Keep it short and
   human-readable: unit, consoles → connection → profile, display, preferences, notable tuning (e.g. "SNES
   blend phase hand-tuned; don't overwrite"), and a dated log of changes made. Update it whenever something
   changes.

Only suggest SVS profiles, button maps, HDR, BFI or a particular community pack when they fit the
setup. When the setup is unknown and the task is small (e.g. "back up my card"), just do the safe part
and ask afterwards.

## Ground rules (why they matter)

1. **Back up before any write to the card:** `rtink card backup`. A card holds hours of hand
   calibration (gain, phase, crops) that exists nowhere else. Backups are a normal .zip plus a checksum
   file, so they open by double-click and can be restored with `card restore`.
2. **The user edits profiles on the unit too.** Before rebuilding or bulk-editing anything, compare the
   card against your last known copy (`card diff <last backup>`). Then build from the card's *current*
   file, so their on-device tuning survives. Report what they changed; it's useful history.
3. **Change only what was asked, and show it.** After every edit, run `profile diff old new` and read the
   result back in plain words. "0 other bytes differ" means nothing unexpected changed.
4. **Never overwrite a hand-tuned blend phase** (see the tuning guide). If unsure, diff first and keep
   theirs.
5. Writes to the card need `--yes`. Run without it first: the dry run says exactly what will happen, so
   summarise that to the user.
6. Leave the card mounted when you're done unless they ask otherwise, and remind them to **eject it
   safely** before pulling it. On Windows: the "Safely Remove Hardware" tray icon, or right-click the drive
   in File Explorer and choose Eject. On macOS: drag the card to the Trash/Eject icon, or click the eject
   arrow in Finder. Pulling it mid-write can corrupt the card.

## Finding the card
`rtink card find` looks for mounted volumes that contain `rt4kup.bin` or a `profile` folder: Windows
drive letters, macOS `/Volumes`, Linux `/media` and `/run/media`. If nothing turns up, the card isn't
inserted or isn't readable. Ask the user to put it in the computer's SD slot or a USB card reader, and
check that it appears in File Explorer or Finder. Pass the path explicitly if several are found.
`card info` gives a quick overview:
- the firmware staged on the card
- the bitstreams for each model
- the SVS profiles per input (it warns about duplicates)
- the remote buttons (it flags missing files)

## Common tasks

**Back up / check / restore**
```
rtink card backup [card] [--label before-firmware]
rtink card verify backups/sdcard-….zip          # does the card still match the backup?
rtink card diff   backups/sdcard-….zip          # what changed since then (files)
rtink card restore backups/sdcard-….zip --yes   # put it back (add --delete to remove extra files)
```

**Firmware**: read `references/firmware.md` first.
```
rtink fw changelog --since 1.99.0     # what's new since their version; then explain what matters to THEM
rtink fw stage latest [card] --yes    # copies rt4kup.bin + the right .rbf for the card's model, verified
```
`fw stage` picks the model from the bitstreams already on the card. Pass `--model 4k|4kce|6x` for a blank
card. The card only *stages* the update; the user installs it on the unit (`fw stage` prints the steps).
The installed version is on the unit's About screen, which may differ from the staged one.

**Profiles**: `references/profile-format.md` covers what the settings map does and doesn't cover.
```
rtink profile dump  <f.rt4>                 # every setting, as the menus name it
rtink profile diff  <a.rt4> <b.rt4>         # what differs
rtink profile find  kernel                  # setting names + allowed values
rtink profile set   <in> <out> "Beam Spread" Wide
rtink profile set   <in> <out> "Hori. Kernel" Lanczos2 --all-modes   # per-resolution setting, every resolution
rtink profile mask  <in> "RGB Masks/A Grille RYCB 600TVL.bmp" <out>
rtink profile graft <console-sharp.rt4> <crt-look.rt4> <out> --set "Input Source=HD15/RGBS"
```
- Settings that exist per resolution (crop, kernels, ADC phase/gain, scaling) need `--mode N` or
  `--all-modes`. Mode numbers: 1 = 480i, 2 = 240p, 5 = 480p (the full list is in the format reference).
- `graft` keeps the first profile's crop, sampling and console-specific timing, and copies the second
  profile's CRT look: scanlines, mask, processing, colour/HDR, deinterlacer, kernels. Use it to give a
  console with only "sharp" community profiles a CRT look, or to spread one look across many consoles.
- Use `--in-place` only on copies, never as the first edit to a card file.
- Edit copies on the computer, check them, back up the card, then copy them onto the card.

**SVS (Scalable Video Switch), only if they have one or are setting one up**: profiles in `profile/SVS/` named `S<input>_<anything>.rt4` load when the
switch changes input. This needs Auto Load SVS = On inside each profile and a VGA cable with serial pins
12/15. `card info` lists them.

**Remote buttons**: `rtink card buttons` shows them; `card buttons set <1-12> "SVS/S1_NES….rt4" --yes`
assigns one. Paths are relative to `profile/`. If a button doesn't work on the unit, assign it in the
RetroTINK menu (Profiles › Assign Profile) and compare.

## Answering setting questions (expect lots of these)

Owners poke at settings and ask as they go:
- "what does Beam Spread do?"
- "why can't I just use Auto Phase?"
- "the vertical kernel doesn't seem to do anything?"
- "was it really this blurry on a CRT?"
- "is there a mask closer to a consumer Trinitron?"
- "what's an N64 480i game?"
- "does the new firmware affect me?"

They often ask them in quick succession, mid-test, with a console and the 240p Test Suite running.
These questions are the main job, not a side quest. Good answers in practice follow the same pattern:

1. **Look it up, don't recall it.** `references/manual/INDEX.md` maps settings, features and consoles to
   the condensed wiki manual in `references/manual/`. `references/tuning-guide.md` has practical,
   experience-based advice. Read the relevant section before answering. RetroTINK behaviour is specific,
   and model differences (Pro vs CE vs 6X) change the answer.
2. **Check their actual values** when a card or profile is available. `rtink profile dump <file>` shows
   what the profile really has, e.g. "your SNES profile already blurs horizontally at the sampling
   stage, so a soft kernel stacks on top". Many confusing results come from two settings interacting.
3. **Explain the mechanism briefly, in plain words.** Why it looks that way: scale factor, per-resolution
   storage, scanlines overriding the vertical kernel, deinterlacing only touching interlaced input.
   Short tables help when comparing options.
4. **Tie it to their setup and goal** from `retrotink-setup.md`: their model, consoles, TV and taste.
   Give a recommendation, not a survey. Be honest when it's a judgement call or unverified, and say what
   to test on screen (which Test Suite pattern, which game).
5. **Offer to apply it, and remind them how settings stick.** Most settings are stored **per detected
   resolution** (and some per detected horizontal width), so adjust with that content on screen, then
   **Profiles › Save Current**. Offer an A/B copy on a spare remote button for subjective choices.
6. **Accept corrections and record findings.** If the user knows better ("I tuned that by hand, not with
   Auto Phase"), correct the record and update `retrotink-setup.md`. Hand-tuned values are precious.

Don't make the user dig through menus to report values you can read from the card. Ask them to bring
the card over instead.

## Limits to be honest about
- The settings map names 172 settings and was read off a 4K Pro on firmware 1.92. Settings it doesn't
  name are preserved but can't be shown or edited by name. Pro-only features (CRT Beam BFI, Horizontal
  Blur, Motion Adaptive tuning) don't exist on the CE or 6X even though the map lists some of them.
- The `prof.map` power-up slot meaning is unconfirmed. Unknown bytes in diffs are mostly live signal
  state that the unit rewrites on each save.
- Picture quality is subjective and depends on the TV. Offer A/B options (e.g. a copy on another remote
  button) rather than asserting one right answer.

## Credits
The condensed manual in `references/manual/` is adapted from the ConsoleMods RetroTINK-4K wiki
(consolemods.org, CC BY 4.0): paraphrased and reorganized, live text as of 2026-10-12.
The profile codec and settings map are vendored, unmodified, from Cruller
(github.com/margaale/Cruller, GPL-3.0); see `vendor/cruller/SOURCE.md`. Maintainers can refresh them
with `node scripts/update-vendor.mjs`. Firmware comes from RetroTINK's official repository.
