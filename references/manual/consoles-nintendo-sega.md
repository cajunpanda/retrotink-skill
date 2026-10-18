# Console-Specific Settings: Nintendo & SEGA

Condensed from the ConsoleMods RetroTINK-4K wiki (consolemods.org, CC BY 4.0); paraphrased and reorganized. Live/patched text as of 2026-10-06.

**Contents:** General notes (sampling, cables, dithering) | NES/Famicom | Super NES/Super Famicom (+ Super Game Boy) | Nintendo 64 | GameCube (+ Swiss/GCVideo, Game Boy Player/GBI) | Wii (+ USB Loader GX, Virtual Console, GCVideo HDMI mods/WiiDual) | Wii U | Switch (+ Nintendo Classics/NSO) | Master System | Genesis/Mega Drive | Saturn | Dreamcast (+ DCDigital/DCHDMI)

Profile paths are relative to the SD card root. `[REGION]` / `[CONNECTION]` are placeholders in the profile pack's folder names.

---

## General notes

- **Sampling tables only apply to the RGB/Component ADC**: you need Enhanced S-Video **[Pro only]**, YPbPr, RGBS or RGBHV. Plain S-Video and composite (CVBS) have no sampling settings.
- **Automatic vs manual sample detection**: "Sample Rate Detection" in a table means the console works with the RT4K's Automatic Sample Rate Detection for 15 kHz signals. Use it if your library really mixes horizontal resolutions. If it uses just one, manual settings are simpler. Example: almost every SNES game is 256 px wide and few are 512 px, so forcing a single rate can be easier.
- **Cables**: the wiki recommends the simplest native connection that gives the best result. For most retro consoles that means RGB SCART. YPbPr cables that transcode RGBS to YPbPr also work. **Turn off the RT4K Low Pass Filter with HD Retrovision cables**, because they have their own LPF.
- **Dithering** (shows clearly over RGB/component): go to Advanced Settings > Processing / Effects and set Hori. Kernel and Vert. Kernel to "Bilinear Soft". This blurs the image, so you can add scanlines to offset it and use HDR to win back brightness. For vertical-stripe-only dither (Sonic waterfalls, Kirby's Dream Land 3 water), Bilinear Sharp on the Hori. Kernel alone is a sharper option.

---

## NES / Famicom

**Sampling** (RGB-modded only, NTSC & PAL), RGB/Component ADC Setup (256):

| Setting | Value |
|---|---|
| Samples per Line | 3410 (2861 Act) |
| Decimation Factor | 10 (341.000) |

**Connections**
- Composite: only the AV Famicom (HVC-101) and the front-loader NES (NES-001). Use two plain male-to-male RCA cables.
- RF-only units need a demodulator (e.g. a VCR) to get composite.
- RGB: mod only.
- Audio is mono only.

**Settings & tips**
- Audio Input Setup > **Input Swap** sends a single audio connection to both channels. Which setting is right depends on how your audio is wired.

**Profiles**
- Unmodded (composite): `\profile\Composite Video Only\Mike Chi 3D Comb Profiles\CVBS_3D_Comb_Game.rt4` for a sharp picture, or a CRT profile for color blending.
- RGB-modded: `\profile\Nintendo NES + FC\_Start Here SCART + RGBS.rt4`. Sharp PAL profiles may not exist yet.

---

## Super NES / Super Famicom

Covers SNS-001 and SHVC-001. The Jr models (SNS-101 / SHVC-101) need a hardware RGB mod.

**Sampling** (NTSC & PAL), Sample Rate Detection:

| Setting | Value |
|---|---|
| Auto Dec. Factor | Yes |
| Auto Dec. Phase ("Audo Dec Phase" (sic) on the wiki) | Yes |
| ADC Sample Rate | 3410 |
| Progressive Detection | 341.000, 682.000 |
| Interlaced Detection | 341.000 |

**Connections**
- Every 001 model outputs RGBS Sync-on-Luma and RGBS Sync-on-Composite. **Sync-on-Luma SCART is recommended.**
- RGBS CSync works on most models, but not on the 1-Chip-03 motherboard revision.
- **Warning:** PAL and NTSC RGB cables are not interchangeable (incompatible pinouts).
- RGB cables: the RetroTINK SNES HD15 Dongle with a RetroTINK HD15-to-HD15 or HD15-to-SCART cable (works for NTSC and PAL); Insurrection Industries SCART, Sync-on-Luma (NTSC); RetroGamingCables SCART (NTSC and PAL versions); RetroAccess SCART, Luma (NTSC).
- S-Video cables (NTSC): Insurrection Industries, RetroGamingCables.

**Settings & tips**
- **1-Chip vs non-1-Chip:** 1-Chip boards are sharper, but they can be too bright for the RT4K ADC and clip colors. Non-1-Chip boards smear slightly to the right but keep correct brightness. The wiki treats this as identification and troubleshooting info, not a recommendation.

**Profiles**
- Sharp: `\profile\Nintendo SNES + SFC\_Start Here [REGION].rt4`. It uses sample rate detection to handle games that switch between 341 and 682 samples per line.

### Super Game Boy (SGB / SGB2)
- GB games render in a **160x144** window inside a **256x223** canvas, with a border.
- Biggest and sharpest in 4K, filling the full screen height with the border fitting a 16:9 display: `\profile\Nintendo SNES + SFC\Wobbling Pixels NTSC [REGION] Super Gameboy - Razor Sharp\Super Gameboy + - Razor Sharp.rt4`
- Shows more of the border: `\profile\Nintendo SNES + SFC\Wobbling Pixels [REGION] RGBS Super Gameboy - Razor Sharp\Super Gameboy - Razor Sharp.rt4`

---

## Nintendo 64

Assumes at least an S-Video model and Enhanced S-Video **[Pro only]**.

**Sampling**, Sample Rate Detection:

| Setting | NTSC | PAL |
|---|---|---|
| Auto Dec. Factor | Yes | Yes |
| Auto Dec. Phase | Yes | Yes |
| ADC Sample Rate | 3094 (2596 Act.) | 3176 (2646 Act.) |
| Progressive Detection | 386.750, 773.500 | 397.000, 794.000 |
| Interlaced Detection | 386.750, 773.500 | 397.000, 794.000 |

**Connections**
- Composite: all units.
- S-Video: all NTSC units and some PAL units.
- RGB: not native on any unit, but every unit can be modded.
- Enhanced S-Video: use the rear HD-15 input on the RT4K **[Pro only]**.
- S-Video cables (NTSC): Insurrection Industries, RetroGamingCables. PAL (compatible models only): Retro Verse S-Video, sold via videogameperfection.com (UK) and consoles4you.ch (Switzerland).

**Settings & tips**
- No picture at all usually means a dirty or badly seated cartridge or slot. Clean both.
- **The output is always 640 pixels wide.** Games can render at other internal resolutions, but the console scales everything to 640. Only games that render 320 wide internally benefit from different (deblur) sampling settings.
- **Expansion Pak:** some games switch to higher-resolution or interlaced output with it installed. The higher default sample rate is recommended for consistent quality. Consider removing the Pak when using Gen or Frame sync lock, for smoother results.
- **RGB mods with built-in deblur** (which halve the sample rate) decimate the image and aren't needed with the RT4K. Turn that feature off and let the RT4K deblur.

**Profiles**
- Sharp: `\profile\Nintendo N64\_Start Here [REGION].rt4`. It uses sample rate detection and the N64 deblur features.
- If a game renders at half the N64 sample rate and the RT4K doesn't adjust on its own, make a profile that forces deblur sampling.

---

## Nintendo GameCube

Covers DOL-001 and DOL-101. Assumes Enhanced S-Video **[Pro only]**, YPbPr, RGB SCART, or HDMI through GCVideo.

**Sampling** (analog only; 240p, 288p, 480i, 576i, 480p), RGB/Component ADC Setup:

| Setting | NTSC | PAL |
|---|---|---|
| Samples per Line | 3432 (2880 Act.) | 3456 (2880 Act.) |
| Decimation Factor | 4 (858.000) | 4 (864.000) |

**Connections**
- **DOL-001** has the "Digital AV Out" port. Recommended: **Insurrection Industries Carby** (GCVideo HDMI adapter) running GCVideo HDMI firmware 3.1. OEM component or D-Terminal cables also work. **Third-party component cables are not recommended.** GCVideo HDMI and YPbPr both allow 31 kHz (480p).
- **DOL-101** (Analog AV Out only): composite on all units. NTSC adds S-Video but no RGB; PAL adds RGB but no S-Video. 31 kHz modes generally need a hardware mod.
- **[6X]** The 6X CE has no HDMI input. Use a DAC with the GCVideo HDMI adapter, or a RetroTINK that has HDMI input.
- S-Video (NTSC only; **no progressive scan**): Insurrection Industries, RetroGamingCables.
- RGB SCART (PAL only; **no progressive scan**): RetroGamingCables, RetroAccess.

**Settings & tips**
- **Alternate video modes:** hold **B** after the GameCube startup screen. This works on stock consoles, but not every game supports it.
  - **480p progressive scan:** NTSC games output double vertical resolution.
  - **PAL60:** PAL games output 60 fps in progressive mode.
- **GCVideo HDMI 3.1 settings** (HDMI connection only):
  - Linedoubler Off; Scanline Profile Off; Picture Settings: Reset.
  - Output: Allow 480p Mode On; Crop 486 to 480 Off; Enhanced DVI Mode On; Display as 16:9 Off; Volume 255; Mute Off.
  - View All Modes: Linedoubler Off for all modes.
  - Advanced: Chroma Interpolation Off; Fix Resolution On; Regenerate CSync Off; Digital Color Format YC422; Report 240p as 480i Off; Sample Rate Hack Off.
- **RetroTINK setting:** HDMI Receiver Setup > Input Range = **YCbCr 601 (Full)**.

**Profiles**
- Analog (Enhanced S-Video/RGB/YPbPr): `\profile\Nintendo GameCube\_Start Here Analog [REGION].rt4`. The wiki also gives this as `_Start Here [REGION] Analog.rt4`. Switch the input to match your cable.
- GCVideo HDMI: `\profile\Nintendo GameCube\_Start Here HDMI.rt4`, used with the settings above.

### Swiss + GCVideo HDMI
Swiss is GameCube homebrew that can turn off stock settings that soften the video.
- **Analog, advanced:** Force Horizontal Scale = 1:1 gives the sharpest picture, but you then have to correct each game's width by hand. There's no list of per-game ratios. (The wiki's example: 1:1 plus GCVideo Fix Resolution Off plus RT4K Aspect Correction 4:3.)
- **GCVideo HDMI:** use all the GCVideo settings above, plus **Advanced > Fix Resolution: Off**.
- **Swiss settings:**
  - Global Settings: Screen Position +0; Swiss Video Mode Auto; AVE Compatibility GCVideo; Optimise for RetroTINK-4K **Yes** (may be labeled "RetroTINK-4K HDMI Input").
  - Global Game Settings: Force Video Active No; Disable Video Patches None; Pause for resolution change No.
  - Default Game Settings and Current Game Settings (same values in both): Force Video Mode Auto; Force Horizontal Scale Auto; Force Vertical Offset +0; Force Vertical Filter Auto; Force Field Rendering Auto.
  - **Shortcut:** delete `\swiss\settings\global.ini` from the SD card, then set only Optimise for RetroTINK-4K = Yes. This wipes every other Swiss customization, including network settings.
- RetroTINK: HDMI Receiver Setup > Input Range = YCbCr 601 (Full).
- Once set up, most games run at their internal render resolution and the RT4K corrects the aspect ratio.
- **Games that need manual width adjustment:** Wind Waker (1.28:1), Super Smash Bros. Melee (40:33), Star Wars: Rogue Squadron. Profiles for these are in `\profile\Nintendo GameCube\Mr Moro Game Specific HDMI\`. Report other problem games on the RT4K Discord.
- Profiles: HDMI uses `\profile\Nintendo GameCube\_Start Here HDMI.rt4`; analog uses `\profile\Nintendo GameCube\_Start Here [REGION] Analog.rt4`.

### Game Boy Player + Game Boy Interface (GBI)
- Stock GBP disc: use `\profile\Nintendo GameCube\_Start Here Analog [REGION].rt4`. Progressive scan works, but LCD effects may not display correctly.
- **Connections:** the optimal setup needs GCVideo HDMI or YPbPr on the digital port. PAL consoles can use RGB SCART on the analog port. S-Video and composite aren't covered: no configuration with working LCD effects has been found. For S-Video, use the GBP disc or other GBI settings (see the gc-forever wiki).
- **Analog (YPbPr/RGB):** `GBIHF-OSSC.dol+cli` with `GBIHF-OSSC.cli`. No Swiss changes needed.
  - GBA: `\profile\Nintendo GameCube\Mr Moro GBIHF-OSSC HDMI + YPbPr\GBIHF-OSSC GBA.rt4`
  - GB/GBC: `\profile\Nintendo GameCube\Mr Moro GBIHF-OSSC HDMI + YPbPr\GBIHF-OSSC GBC.rt4`
- **GCVideo HDMI:** set up Swiss and GCVideo as described above, then use `GBIHF-RT4K-HDMI.dol+cli` with `GBIHF-RT4K-HDMI.cli`.
  - GB/GBC: `\profile\Nintendo GameCube\Wobbling Pixels HDMI GCVideo GBIHF (GB GBC GBA) - Razor Sharp\GB GBC - Razor Sharp.rt4`
  - GBA: same folder, `GBA - Razor Sharp.rt4`
  - These are the sharpest options. Other profiles add LCD effects or a DMG look; their instructions are in `\profile custom instructions & Info\`.

---

## Nintendo Wii

Covers Wii models from all regions, plus GameCube software running on a Wii (same settings). The RVL-101 Wii Mini is excluded: it's composite-only without mods.

**Sampling** (240p, 288p, 480i, 576i, 480p), RGB/Component ADC Setup:

| Setting | NTSC | PAL |
|---|---|---|
| Samples per Line | 3432 (2880 Act.) | 3456 (2880 Act.) |
| Decimation Factor | 4 (858.000) | 4 (864) |

**Connections**
- Every RVL-001 supports YPbPr component, including 480p. Component is the assumed connection.
- Cables: RetroTINK Wii Dongle with a RetroTINK HD15-to-HD15 or HD15-to-SCART cable; HD Retrovision Wii component cables (with these, turn off the RT4K LPF).

**Settings & tips**
- **GameCube software on a Wii:** 480p and aspect ratio are set inside the GameCube game (hold B, as described in the GameCube section), not in the Wii menu.
- **480p on an NTSC Wii** (sharpest): Wii Options > Wii Settings > Screen > TV Resolution > **EDTV or HDTV (480p)** > Confirm.
- **Widescreen:** Wii Options > Wii Settings > Screen > Widescreen Settings > Standard (4:3) or Widescreen (16:9). Set the RT4K's Scaling/Crop Setup > **Aspect Correction** to match.
- **4:3-only and 16:9-only games:** 16:9-only titles letterbox on a 4:3 Wii. 4:3-only titles pillarbox on a 16:9 Wii; some, like Wario Land: Shake It!, fill the sides with art or HUD. With anamorphic output you lose resolution to those bars, so switch the Wii and RT4K settings to match the game. A list of titles is on a shmups.system11.org thread. Alternatives:
  - USB Loader GX can set the aspect ratio per game.
  - Gecko codes (see the Dolphin wiki) can force some 16:9-only games to 4:3. Possible side effects: pop-in, stretched or misplaced UI, frame-rate drops.

**Profiles**
- `\profile\Nintendo Wii\_Start Here.rt4` covers Wii and GameCube-on-Wii software. It defaults to 4:3, so change the RT4K aspect setting as needed.

### Wii + USB Loader GX (homebrew)
- **Deflicker filter** (softens 480i, but often left on in 480p games):
  - Globally: cogs > Loader Settings > Deflicker Filter > **OFF (Extended)**.
  - Per game: select the game > Settings > Game Load > Deflicker Filter, then pick one that works, e.g. **Off (Safe)**.
- **480p Pixel Fix Patch:** fixes a low-pass filter glitch that affects every mode, including 480p. Only some consoles are compatible.
  - Test: in Wii 240p Test Suite, set 480p Modes ON, then Video > "480p mixed 480p/240p assets (1:1)", then go back to Checkerboard and press the PHA button. Black and white squares mean compatible; light and dark grey means not.
  - It's safe to enable either way: cogs > Loader Settings > 480p Pixel Fix Patch > ON.
- **Video Width: Framebuffer (advanced):** cogs > Loader Settings > Video Width > Framebuffer. Games render at their original size inside a 720x480 canvas. Width varies by game, so fix it per game in Scaling/Crop Setup.

### Wii Virtual Console
- NES VC games run much darker than the original hardware, as an anti-epilepsy measure.
- Most VC titles output 15 kHz progressive. The exceptions are some later releases and all N64 titles.
- **Set the Wii to 15 kHz:** Wii Options > Wii Settings > Screen > TV Resolution > **Standard TV (480i)** > Confirm. VC games then run at their native 15 kHz.
- **Force 240p when a game defaults to 480i:** start the game, press Home, attach a Nunchuk, then press **A + Z + 1** together. A sound confirms it; check the RT4K status screen shows 15 kHz progressive.
- Profiles: CRT profiles need no changes. Sharp: `\profile\Nintendo Wii\MrMoro YPbPr\480p Wii + 15kHz VC Primary.rt4`, which uses sample rate detection and keeps the correct aspect ratio. It doesn't cover Neo Geo games or 512x240 modes. `_Start Here.rt4` also works but isn't as sharp.
- **SNES 512x240 games** (e.g. Secret of Mana) can be misdetected as 640x240. Fix: in USB Loader GX, select the game > Settings > Game Load > Video Width: Framebuffer > save. Then use `\profile\Nintendo Wii\MrMoro YPbPr\480p Wii + 15kHz VC Secondary.rt4`.
- **VC in EDTV (480p) mode with Vert. Pre-Scale:** works for some games, breaks others.
  - Some SNES games use bilinear scaling at 480p, which scales unevenly.
  - Some content runs in 480i (e.g. Sonic 2's 2-player mode), which forces the Wii's deinterlacer instead of the RT4K's.
  - Sample rate detection doesn't work at 480p, so you need manual decimation and scaling.

### Wii GCVideo-based HDMI mods (WiiDual, AVE-HDMI, etc.)
These devices aren't affected by the 480p LPF issue. Choose "Store Settings" in the GCVideo menu to save. The settings below are for WiiDual firmware 3.1 with the default RT4K profile; for system-specific profile packs, follow their own instructions.
- Output: Allow 480p Mode On (also enable 480p in the Wii menu); Enhanced DVI Mode **On** (no audio otherwise); Display as 16:9 set to match the Wii's setting.
- View All Modes: 240p, 288p, 480i and 576i Linedoubler **Off**, so the RT4K does all scaling and deinterlacing.
- Advanced:
  - Chroma Interpolation Off (no effect with YC422).
  - Fix Sync Timing & Regenerate CSync Off (turn on only if it fixes a problem).
  - Fix Resolution Off (fine with the default RT4K profile; otherwise see the profile maker's txt file on the SD card).
  - Digital Color Format **YC422** (matches the Wii internally).
  - Report 240p as 480i Off; (Audio) Sample Rate Hack Off.

---

## Nintendo Wii U

**Connections:** strongly prefer **HDMI**. The Wii U's component output is duller and softer, even next to PS3 and 360 component.

**Settings & tips**
- Wii U HDMI is limited range only. Set Advanced Settings > HDMI Receiver > Input Range = **"RGB Lim."**
- **Wii backward compatibility:** Wii games get a 1% scale even at 480p output. Custom firmware can undo the scale but currently causes offset chroma. A real Wii that works with the 480p Pixel Fix Patch is recommended instead.

---

## Nintendo Switch

**Connections:** HDMI only.

**Settings & tips** (all in System Settings > TV Settings)
- TV Resolution: 720p or 1080p.
- Adjust Screen Size: **100%**, which disables the Switch's internal scaler.
- RGB Range: the Switch flags it correctly on Auto; change it manually if you want.
- TV Sound: **Stereo** unless you have a surround system. Avoid "Automatic": it forces 5.1 and can cause missing audio.

**Profiles:** none needed.

### Nintendo Classics (formerly NSO)
Without the tweaks below, treat these apps like any Switch game and use the default profile.
- **NES, SNES, Genesis:** on the game list, press Left > Settings. Set Game Screen to **Pixel Perfect** and uncheck Control Display > "Show controls in game".
- **GB/GBA:** in the same Settings menu, uncheck "Reproduce classic feel" and "Display with small screen", and uncheck "Show controls in game". Which Game Boy model you pick is personal preference.
- **N64:** games render at 720p, so set the Switch's TV Resolution to **720p** to avoid upscaling to 1080p. Uncheck "Show controls in game".
- Profiles (correct scaling, NSO border removed): `\profile\Nintendo Switch\Mr Moro NSO HDMI\`

---

## SEGA Master System

**Sampling:** no table on the wiki.

**Connections**
- Model 1: composite and RGB. S-Video needs a mod.
- Master System II: RF only, so it needs a mod to use with the RT4K.
- Cables: Insurrection Industries SCART (SMS/Genesis model 1, mono), RetroGamingCables SCART.

**Settings & tips**
- **Borders:** remove the solid-color borders with the Input Crop trim tools. Games use 248 px or 256 px widths, and some use both. Cropping to 256 is safest (it leaves a column on the left in 248-wide scenes). You could also keep a separate profile for 248-wide games. Auto Crop won't work, because it treats the border as part of the picture.
- **Dim output:** raise Gain under Advanced Settings > RGB/Component ADC, using the 240p Test Suite. Or use Auto Calibrate Gain, which works best with a patch of pure white on screen.

---

## SEGA Genesis / Mega Drive

All models, plus the Sega CD and 32X. Mods are optional and don't change RT4K usage.

**Sampling** (NTSC), Sample Rate Detection:

| Setting | Value |
|---|---|
| Auto Dec. Factor | On |
| Auto Dec. Phase | Auto |
| ADC/Sample Rate | 3420 dots/line |
| Progressive Detection | 342.000, 427.5 |
| Interlace Detection | 427.5 |

**Connections**
- Every model outputs RGBS Sync-on-Composite and CSync.
- Model 1: stereo audio only comes from the front 3.5 mm headphone jack, so it needs a special cable. Later models carry stereo on the AV port.
- Cables: RetroTINK HD15 Dongle (Genesis 2) with a RetroTINK HD15-to-HD15 or HD15-to-SCART cable. For a Model 1, add the HD Retrovision Genesis 1-to-2 adapter and plug the cable's 3.5 mm lead into the front jack. Also: Insurrection Industries SCART (Model 1 and Model 2), RetroGamingCables SCART (Model 1 and Model 2), RetroAccess SCART (Model 1 mono only, and Model 2).

**Profiles**
- `\profile\Sega Genesis & Mega Drive\_Start Here [REGION].rt4`: sharp 4K, handles both 256x240 and 320x240 games.

---

## SEGA Saturn

**Sampling** (NTSC), manual settings in RGB/Component ADC Setup:

| Mode (H res) | Samples per Line | Decimation Factor |
|---|---|---|
| 320 | 3416 (2866 Act.) | 8 (427.000) |
| 352 | 3640 (3054 Act.) | 8 (455.000) |
| 640 | 3416 (2866 Act.) | 4 (854.000) |
| 704 | 3640 (3054 Act.) | 4 (910.000) |

**Connections**
- Every model outputs RGBS Sync-on-Luma and Sync-on-Composite. SCART cables are easy to find.
- Cables: RetroTINK Saturn HD15 Dongle with a RetroTINK HD15-to-HD15 or HD15-to-SCART cable; Insurrection Industries RGB SCART (Sync-on-Luma); RetroGamingCables RGB SCART; RetroAccess RGB SCART (Luma).

**Settings & tips**
- The Saturn's two video chips can output up to 8 resolutions. The profiles' sample rate detection is set up for these.

**Profiles** (try them in order)
1. `\profile\Sega Saturn\_Start Here [REGION].rt4`
2. If it doesn't lock: `\profile\Sega Saturn\Wobbling Pixels [REGION] [CONNECTION] - Sharp\Saturn 4-3 - Secondary - Sharp.rt4`
3. If that also fails: same folder, `Saturn 4-3 - Tertiary - 640x480 only - Sharp.rt4`

---

## SEGA Dreamcast

**Sampling**, RGB/Component ADC Setup:

| Setting | NTSC | PAL |
|---|---|---|
| Samples per Line | 3432 (2880 Act.) | 3456 (2880 Act.) |
| Decimation Factor | 4 (858.000) | 4 (864.000) |

**Connections**
- 31 kHz only over RGBHV (VGA); every other signal is 15 kHz. The console detects the cable in hardware at boot.
- Special switched SCART (RGBS) and YPbPr cables exist that convert 31 kHz RGBHV.
- Some games need extra patches or mods to run at 31 kHz.
- Cables: RetroTINK Dreamcast HD15 Dongle with the RetroTINK HD15-to-HD15 cable (**don't** use the HD15-to-SCART cable with this dongle); RetroGamingCables Dreamcast RGB 480p SCART "Powered by RetroTink"; RetroAccess Dreamcast RGB SCART Fortraflex 15/31 kHz.

**Settings & tips**
- **240p:** some games can be forced to 240p by holding **Start + L** at boot. This may be better than using prescale. The list of compatible games is on retrorgb.com/dreamcast.html.

**Profiles**
- `\profile\Sega Dreamcast\_Start Here [REGION].rt4`: all Dreamcast resolutions.

### DCDigital / DCHDMI (first gen / HW1 only)
Second-gen and GEM versions may differ. These settings assume the default RT4K profile; for profile packs, follow their own instructions. Firmware 4.7std:
- **Games with native VGA support, or that can be forced to VGA:** Output Resolution VGA. Advanced Video: Deinterlacer 480i & 576 passthru; 240p adjust position off; VGA adjust position auto; RGB color space full. Video Mode Settings: Force VGA/Switch Trick VGA.
- **Games that can't be forced to VGA** (Marvel vs Capcom, JoJo, Plasma Sword, Last Blade 2, etc.): Output Resolution 480p. Advanced Video settings as above. Video Mode Settings: Cable Detect.
