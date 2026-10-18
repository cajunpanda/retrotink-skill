# Manual index: where to look

A condensed RetroTINK-4K / 4K CE / 6X manual: ten files adapted from the ConsoleMods wiki (CC BY 4.0,
live text as of 2026-10-12), plus one supplement that isn't from the wiki. Read the section you need;
don't load everything. Each file opens with "Quick facts".

## By kind of question
| The user is asking… | Read |
|---|---|
| What a picture setting does or which value to pick (kernels, scanlines, masks, crop, scaling, gamma/PQ, colour) | `scaling-effects-color.md`, then `undocumented-settings.md` for options the wiki omits (E-Conserve, Beam Spread, Spatial Redist., Auto Fill Int+) |
| 480i, jitter, combing, deinterlacing, sharpness/blur from sampling, Auto Phase/Gain, decimation, sample rate detection, composite/S-Video decoder, HDMI input, MiSTer DV1 | `deinterlace-adc-sampling.md` |
| Output resolution, HDR/PQ, sync lock, VRR, deep colour, BFI, audio out, profiles (load/save/assign, SVS, DV1, Keep Cur.), serial commands | `output-profiles-bfi-serial.md` |
| A specific console: sampling numbers, cables, quirks, homebrew, which profile | `consoles-nintendo-sega.md` (NES, SNES, N64, GameCube, Wii, Wii U, Switch, SMS, Genesis, Saturn, Dreamcast) or `consoles-sony-other.md` (PS1–PS5, PSP, PSTV, Xbox, 360, Neo Geo, PC Engine, PixelFX, C64, MiSTer, Analogue) |
| "Where is setting X / what values can it take" | `menu-map.md` (full OSD tree with options) |
| Models (Pro vs CE vs 6X), ports, pinouts, remote/IR codes, LEDs, Safe Mode, power, banners, OSD/status pages | `hardware-inputs-remote.md` |
| What's on the SD card: profile collections, CRT presets, mask files, CSC files | `sd-card-contents.md` |
| Making custom masks, colour matrices, modelines, input modes, EDID; TV preparation; community tools | `custom-files-community.md` |
| Something's wrong, "can it do X", comparisons, compatibility | `faq-troubleshooting.md` |
| *How* to get a look, practical tuning advice, why two settings interact | `../tuning-guide.md` (experience-based, not from the wiki) |
| Firmware update steps, channels, relevance | `../firmware.md` |
| Profile file internals, prof.map, unmapped bytes | `../profile-format.md` |

## Keyword lookup
| Keyword | File |
|---|---|
| Aspect correction, PAR/DAR, 4:3, 16:9, square pixels | scaling-effects-color |
| Auto crop, AUX1–3 | scaling-effects-color, hardware-inputs-remote |
| Auto Fill, Proportional, Free-Form, Int/Int+/HV scaling modes | scaling-effects-color, undocumented-settings |
| Auto Gain, Auto Phase, Auto Calibrate | deinterlace-adc-sampling |
| Anti-Alias LPF (9/16/35/95 MHz) | deinterlace-adc-sampling, undocumented-settings |
| Banner images (320×128 BMP, `image/`) | hardware-inputs-remote, undocumented-settings |
| Beam Spread, E-Conserve, Normalize Energy | undocumented-settings, ../tuning-guide |
| BFI: strobe, blur, LCD saver, Variable MPRT, CRT Beam [Pro], rolling | output-profiles-bfi-serial |
| Bit crush, dithering, saturation, CSC / colour matrix | scaling-effects-color, custom-files-community |
| Blank res change, buffer length | scaling-effects-color |
| Cables per console (HD Retrovision, RetroTINK, etc.) | consoles-* |
| Colorimetry, RGB range (LG "Black Level"), deep colour | output-profiles-bfi-serial |
| Convergence, colour bleed, Red Bleed | scaling-effects-color |
| CRT preset collections (Kuro Houou, ii_edub_ii, Rog, Chinakat, …) | sd-card-contents |
| CRT Simulation, Motion Adaptive, Bob, Weave, Smooth I/P, Field Inversion | deinterlace-adc-sampling |
| Decimation factor/phase, Sub-Phase (11.25° steps), samples per line | deinterlace-adc-sampling |
| Default profile, Save Current, Save As New, Assign Profile, power-up profile | output-profiles-bfi-serial |
| Detection Mode (Generic/Saturn/N64 Auto Deblur), sample rate detection | deinterlace-adc-sampling, undocumented-settings |
| Dithering blend (CRT blend profiles) | ../tuning-guide, consoles-* |
| EDID (custom) | custom-files-community |
| Enhanced S-Video [Pro] | deinterlace-adc-sampling, hardware-inputs-remote |
| Film mode, inverse telecine, dejudder [Pro] | deinterlace-adc-sampling |
| Gamma, input factor/lift/gain, linear light, SMPTE 2084 PQ (nits), transfer function | scaling-effects-color |
| HD-15 pinout, serial pins 12/15, SCART pinout | hardware-inputs-remote |
| HDMI input: decimation, range, colorspace, A/DAC, target decimate | deinterlace-adc-sampling |
| HDR10/HLG, HDR passthrough | output-profiles-bfi-serial |
| Horizontal blur (IIR) [Pro], xBR smoothing [Pro], RoTATE [Pro] | scaling-effects-color |
| Input crop / trims, vertical pre-scale | scaling-effects-color |
| Input selection: what each port accepts | hardware-inputs-remote, menu-map |
| IR codes, `ir_remote.txt`, using other remotes | hardware-inputs-remote |
| Kernels (Nearest, Bilinear Sharp/Med/Std/Soft, Cubic, Lanczos2/3), anti-ringing | scaling-effects-color |
| Keep Cur. Input / Keep Cur. Res | output-profiles-bfi-serial |
| LCD effects (LCD Mono/RGB) | scaling-effects-color |
| LED colours, Safe Mode, Reset button | hardware-inputs-remote |
| Masks: enable modes, strength, files, 1:1 tiling, custom 16×16 BMP | scaling-effects-color, undocumented-settings, sd-card-contents, custom-files-community |
| MiSTer DV1, MiSTer.ini, Auto Load DV1 | consoles-sony-other, deinterlace-adc-sampling, output-profiles-bfi-serial |
| Modelines (custom1–4.txt, format, interlaced) | custom-files-community |
| Input modes (`input_database.txt`) | custom-files-community |
| Output resolutions, 50/100/120 Hz, interlaced output | output-profiles-bfi-serial |
| Pro vs CE vs 6X differences | hardware-inputs-remote |
| Pseudo interlace, scanline functions/strength/modulation | scaling-effects-color |
| SDP decoder (composite/S-Video), comb filters | deinterlace-adc-sampling |
| Serial commands (`remote …`), USB/HD-15 serial, baud rates | output-profiles-bfi-serial |
| SVS: `S<n>_` naming, S0_, auto-load, serial | output-profiles-bfi-serial |
| Sync Lock: Gen, Frame, TBC, Triple Buffer, A. Buffer, VRR | output-profiles-bfi-serial |
| TV preparation (game/PC mode, 4:4:4, motion smoothing) | custom-files-community, scaling-effects-color |
| Audio input/output, surround, TOSLINK, input override | deinterlace-adc-sampling, hardware-inputs-remote, output-profiles-bfi-serial |

## Known source contradictions (flagged in the files)
- **SD card size:** the FAQ says max 32 GB; Getting Started says cards up to 1 TB were tested formatted
  FAT32. In practice, format FAT32 and larger cards work.
- **Pro input width:** 4096 vs 4095 px.
- **LED colour during an update:** purple vs pink.
- **Banner folder:** `banners/` vs `image/`. The SD pack and real cards use `image/`.
- **Linux serial examples** use 115200 baud, but firmware ≥ 1.75.0 defaults USB serial to 2,000,000.
- **VRR:** the wiki says the RetroTINK only *flags* VRR (HDMI Output › VRR Format). Firmware 1.92 added
  true VRR as a Sync Lock mode. The wiki's "VRR helps BFI" refers to the RetroTINK's own BFI, not a TV's,
  and many TVs can't run their BFI with VRR on. See `../tuning-guide.md`.
- **Auto Phase:** the wiki presents it as always right. It's wrong for CE "Blend" profiles, which sample
  off-centre on purpose. See `../tuning-guide.md`.
- **Vertical kernel "Bilinear Soft for dithering"** (console general notes) is a no-scanlines tip.
  With scanlines on, the vertical kernel barely shows; use Beam Spread.
