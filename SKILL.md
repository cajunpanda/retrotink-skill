---
name: retrotink
description: Manage the SD card of a RetroTINK-4K, RetroTINK-4K CE or RetroTINK-6X video upscaler, either mounted on the computer or over Wi-Fi through a DonutShop bridge on the unit's USB-C port. Back up, verify, compare and restore the card; check for, download and stage firmware updates (with changelog relevance); and inspect, compare and edit .rt4 profiles setting by setting: scanlines, masks, kernels, HDR/PQ, crop, deinterlacer, ADC phase/gain. Also grafting a CRT look onto console profiles, Scalable Video Switch (SVS) auto-load profiles, and remote-button assignments (prof.map). Use whenever the user mentions a RetroTINK, RT4K, 4K CE, 6X, "the tink", their upscaler's SD card, .rt4 profiles, Wobbling Pixels or other community profile packs, SVS profiles, RetroTINK firmware, or asks things like "back up my card", "is there a new firmware", "what changed in my profile", "make my SNES look like a Trinitron", "why is 480i shaky", "assign profiles to the remote buttons", "DonutShop", "donutshop.local", "update the tink over Wi-Fi". Use it even if they don't name the tool.
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

## Over Wi-Fi: DonutShop (use this when the user has one)

A [DonutShop](https://github.com/svirant/DonutShop) is an ESP32-S3 on the RT4K's USB-C port that puts the
unit on the network, so the SD card never leaves it. If `retrotink-setup.md` mentions one, or
`rtink net info` answers, **work over the network and don't ask for the card.** The `net` commands talk
to `donutshop.local` (or `--host <name|ip>`, or the `RTINK_HOST` environment variable). The RT4K must be
on: standby doesn't answer.

```
rtink net info                         # unit, installed firmware, what's loaded, SVS profiles, baseline
rtink net backup                       # back up profile/SVS: this becomes the new baseline
rtink net diff                         # what changed on the unit since the baseline, setting by setting
rtink net push <edited.rt4> "profile/SVS/S2_SNES….rt4" --yes   # write one file, read back and checked
rtink net load "SVS/S2_SNES….rt4"      # load it now (otherwise it loads when the SVS selects that input)
rtink net fw install latest --yes      # install firmware over Wi-Fi (see references/firmware.md)
rtink net cmd "ver"                    # raw console command
rtink net osd                          # what the on-screen menu shows right now, as text ("> " = selected)
```
`net osd` plus `net cmd "remote <key>"` (keys: menu, up, down, left, right, ok, back, prof1…) lets you
see and drive the menu like the user does. Read the screen after every key. Use **left/right only when
you mean to change a value**, put anything you changed back, and never "Save Current" unless asked.
Leave the menu closed when done (`back` until `net osd` says no menu).

Remote buttons over Wi-Fi: `rtink net buttons` shows them, `net buttons set 7 "Experiments/x.rt4" --yes`
assigns one. **The unit reads the button map only when it starts**, so a new assignment works after a
power off/on. For experiments, put a copy in `profile/Experiments/` (never a second `S<n>_` file in
`profile/SVS`) on a spare button: the SVS profile stays untouched, and the switch reloads it whenever the
console is turned on or the input changes. Probe with `net load` rather than pressing buttons: loading a
profile changes what the user sees, so ask first if a console might be on.

Power and input over Wi-Fi: `net cmd "remote pwr"` puts the unit in standby (it stops answering);
`net cmd "pwr on"` wakes it (`pwr off` doesn't exist). After a wake it starts on HDMI with no profile,
and with `z_keep_cur_input` = 1 on the card, loading a profile from a button or `net load` keeps that
input. `net cmd "SVS NEW INPUT=<n>"` does what the switch does: loads `S<n>_…` with its own input.

**The newest backup is the baseline.** Backups are `backups/net-*.zip` (plus a `.sha256` manifest), and
the newest one is the reference for `diff`, `verify` and `push`:
- Whatever the unit had when it was backed up counts as **intended**, including tuning done on the unit
  itself. Don't treat a difference from older notes or older backups as something to fix.
- Workflow for an edit: `net backup` → take the profile out of that zip → edit the copy (`profile set`,
  `graft`…) → `profile diff` it → `net push --yes`.
- `push` refuses when the unit's file changed since the baseline: the user tuned it on the unit after the
  backup. Run `net diff` to see what they changed and tell them in a line ("you raised the SNES 480i gain"),
  then `net backup` to make it the baseline and rebuild the edit from the new copy.
- A successful push rolls the baseline forward by itself (`net-after-push-*.zip`), so the baseline
  always matches the unit.

**Scope is the SVS profiles.** Users change `profile/SVS/` (the per-input auto-load profiles), not the
default or community profiles, so `net backup` covers only `profile/SVS` by default. That takes seconds;
the whole card would take about half an hour over Wi-Fi. Use `--path <folder>` for anything else you
must touch (e.g. `--path profile` for button profiles elsewhere), and `--all` for every profile.

Speed: about 150 KB/s writing, 12–170 KB/s reading (small files are slow). There's no password on a
DonutShop: it's for a trusted home network only.

## Ground rules (why they matter)

1. **Back up before any write to the card:** `rtink card backup` (or `rtink net backup` over Wi-Fi). A card holds hours of hand
   calibration (gain, phase, crops) that exists nowhere else. Backups are a normal .zip plus a checksum
   file, so they open by double-click and can be restored with `card restore`.
2. **The user edits profiles on the unit too.** Before rebuilding or bulk-editing anything, compare the
   card against your last known copy (`card diff <last backup>`, or `net diff` over Wi-Fi). Then build from
   the card's *current* file, so their on-device tuning survives. Their on-device changes are intended:
   report them in a line (useful history, and worth noting in `retrotink-setup.md`), then take a fresh
   backup so they become the new baseline. Don't "correct" them back.
3. **Change only what was asked, and show it.** After every edit, run `profile diff old new` and read the
   result back in plain words. "0 other bytes differ" means nothing unexpected changed.
4. **Never overwrite a hand-tuned blend phase** (see the tuning guide). If unsure, diff first and keep
   theirs.
5. Writes to the card need `--yes`. Run without it first: the dry run says exactly what will happen, so
   summarise that to the user.
6. (Card only) Leave the card mounted when you're done unless they ask otherwise, and remind them to **eject it
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
- The settings map names 172 settings read off a 4K Pro on firmware 1.92, plus 22 newer ones (Advanced
  CRT Effects, Multi-frame Glow) from RetroTINK's WebCtl schema for 1.99.x. Settings it doesn't
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
(github.com/margaale/Cruller, GPL-3.0); see `vendor/cruller/SOURCE.md`. The 1.99.x settings overlay comes from RetroTINK's WebCtl
profile schema as served by DonutShop; see `vendor/webctl/SOURCE.md`. Maintainers can refresh them
with `node scripts/update-vendor.mjs`. Firmware comes from RetroTINK's official repository.
