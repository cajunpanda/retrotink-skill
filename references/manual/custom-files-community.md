Condensed from the ConsoleMods RetroTINK-4K wiki (consolemods.org, CC BY 4.0); paraphrased and reorganized. Live text as of 2026-10-12.

# Custom SD-card files, TV prep and community resources

## Quick facts

| Thing | SD location | Format / limit |
|---|---|---|
| CRT mask | `mask/` | 32-bit .BMP, max 16x16 px, tiled across screen |
| Color matrix / CSC preset | `csc/` (loaded via Color Correction > Apply Preset) | CSV, 14 floats on one line |
| Output modelines | `modelines/custom1.txt`..`custom4.txt` | one line, 12 CSV values (+3 optional) |
| Custom input modes | `inputmodes/input_database.txt` | one CSV line per mode, 17 fields, max 24 modes |
| Custom EDID | `edid.bin` in SD root | raw 256-byte EDID dump |
| Community profiles | `profile/` | .rt4 files |
| Banners | `banners/` per community section (OSD menu says it loads from `image/`) | image |

- Output clock limit: 600 MHz on 4K models, 300 MHz on 6X models.
- 120 Hz output: max input 1080p60 on 4K models, 720p60 on 6X models.

## Custom CRT masks

- Overlay that imitates shadow/slot/aperture masks across the whole screen (unlike scanlines, which modify the underlying picture). Image is tiled.
- Must be **32-bit .BMP**; max **16 x 16 px**; smaller images tile more densely.
- Pixel values: 128 = neutral, 0 = fully black, 255 = doubles input (clamped).
- Store in the `mask` folder; enable via Processing/Effects > Masks > Enable + Load from File.
- Tool: infinest's Mask Editor, https://infine.st/rt4k-mask-editor/
- Caveat: masks do **not** follow the pixel grid the way scanlines do. To align, the mask must match the size of one upscaled pixel, which depends on the profile; so it is profile-specific, and upscaled pixels can't exceed 16x16 output px for this to work.

## Custom color matrix (CSC file)

- Single CSV line of 14 floating-point values describing gamma and Input RGB -> XYZ. The RT4K applies the XYZ -> output RGB matrix itself based on the HDMI output colorimetry setting.

| # | Field |
|---|---|
| 1 | Input Gamma |
| 2 | Input Lift |
| 3 | Input Gain |
| 4 | Output Gamma |
| 5 | Transfer Function: 0 = sRGB, 1 = Rec.601/709, 2 = SMPTE 240, 3 = conventional gamma |
| 6-14 | Input RGB -> XYZ matrix coefficients (9) |

- Example data/credit: Dan Mons & Keith Raney (github.com/danmons/colour_matrix_adaptations), Extrems (Game Boy Interface).

## Custom output modelines

- Files `modelines/custom1.txt`..`custom4.txt`, mapped to remote buttons **RES1-RES4** (and to Custom Modeline 1-4 in HDMI Output > Output Resolution). The `modelines` folder also contains `_Mode Line Instructions.html`.
- One modeline per file. Only 4 usable at once.
- Firmware 1.21.0+: all models can store/add modelines from the SD card under any filename; they are assigned via output modeline **slots 3 and 4** (select a new one to reassign, or press RES3/RES4 to use the assigned one).
- RetroTINK-6X models: 6 custom modelines; slots 3-6 user-definable.
- Compatibility depends on your display (YMMV), even within 600 MHz and the display's claimed specs.

### Field list (single line, comma separated)

| # | Meaning |
|---|---|
| 1 | H active pixels |
| 2 | H front porch pixels |
| 3 | H sync pixels |
| 4 | H total blank (front porch + sync + back porch) |
| 5 | H sync polarity (1 = positive, 0 = negative) |
| 6 | V active lines |
| 7 | V front porch lines |
| 8 | V sync lines |
| 9 | V total blank (FP + sync + BP) |
| 10 | V sync polarity (1 = pos, 0 = neg) |
| 11 | Nominal frame rate (float), used in Triple Buffer mode |
| 12 | Name string (currently unused) |
| 13 (opt) | 0 = progressive, 1 = interlaced (fields 7-9 then use per-field values) |
| 14 (opt) | Aspect correction for non-square PAR, default 1.0. For 16:9 display: (H res x 9) / (V res x 16) |
| 15 (opt) | 0 = HDMI, 1 = DVI mode (no audio) |

Examples:
```
1690, 130, 184, 624, 1, 1420, 3, 10, 60, 1, 69.420, "1420p60"
2048, 48, 32, 160, 1, 1536, 3, 4, 44, 0, 60.0, "1536p"
3840, 176, 88, 560, 1, 1080, 4, 5, 45, 1, 120, "3840x1080p120", 0, 2.0
3840, 176, 88, 560, 1, 960, 4, 5, 45, 1, 120, "3840x960p120", 0, 2.25
```

### Interlaced modelines (firmware 1.5.1+)

- Meant for progressive -> interlaced at the same resolution, or passthrough (1080p/i -> 1080i, 480p/i -> 480i). Set Scaling Mode to **Free-Form**; interlaced output does **not** scale.
- Convert progressive -> interlaced: halve fields 7, 8, 9 (round down), append `, 1`.
```
480i:  720, 16, 62, 138, 0, 480, 4, 3, 22, 0, 59.94, "720x480i59.94", 1
576i:  720, 12, 63, 144, 0, 576, 3, 3, 24, 0, 50.00, "720x576i50.00", 1
1080i: 1920, 88, 44, 280, 1, 1080, 2, 5, 22, 1, 59.94, "1920x1080i59.94", 1
480p source: 720, 16, 62, 138, 0, 480, 9, 6, 45, 0, 59.94, "720x480p59.94"
```

### Making one (tutorial, example 1080p180 for 2:1 BFI on a non-240 Hz monitor)

1. Know target resolution and refresh (1920x1080, 180 Hz).
2. Open Guspaz's Video Timings Calculator: https://guspaz.github.io/video_timings_calculator
3. Enter H pixels, V pixels, refresh; click another field to refresh the table.
4. Green = within output clock (600 MHz column for 4K, 300 MHz for 6X); red = too fast, won't work.
5. Copy the green lines from "RT4K Custom modelines", e.g.
   `1920, 176, 208, 768, 0, 1080, 3, 5, 122, 1, 179.98, "1920x1080p179.98"`
   `1920, 48, 32, 160, 1, 1080, 3, 5, 98, 0, 179.98, "1920x1080p179.98"`
   `1920, 8, 32, 80, 1, 1080, 84, 8, 98, 0, 180, "1920x1080p180"`
   `1920, 8, 32, 80, 1, 1080, 84, 8, 6, 0, 180, "1920x1080p180"`
6. Put one line in each customN.txt (repeat if more than 4), save, reinsert card.
7. Press RES1-RES4 to find one your display syncs to stably; tweak and repeat if needed.
- Caveat: source refresh matters, e.g. a Super NES needs ~180.03 Hz rather than 180. "Not an exact science"; the community, not just Mike, tests display/modeline combos.

## Custom input modes (`inputmodes/input_database.txt`)

- Fixes RGB/YPbPr sources detected as "Unknown" (often shown as a small strip with missing image). With a matching definition the image is auto-cropped and scaled. Up to **24** definitions.
- Matching uses fields 1-7; on a match, fields 8-15 drive sampling/cropping; field 16 picks the save slot inside the profile; field 17 is the name shown in the menu and detection popup.

| # | Field |
|---|---|
| 1 / 2 | Min / max frame rate (float) |
| 3 / 4 | Min / max lines per frame (int; interlaced counted per frame: 525 for 480i, 625 for 576i) |
| 5 | H sync polarity (0 = don't care, 1 = negative, 2 = positive) |
| 6 | V sync polarity (same codes) |
| 7 | Interlaced (0 = progressive, 1 = interlaced) |
| 8 | H sync + back porch pixels |
| 9 | H active pixels |
| 10 | H total pixels (canonical) |
| 11 | V sync + back porch lines |
| 12 | V active lines |
| 13 | V total lines |
| 14 | Actual H sampling pixels (may differ from field 10) |
| 15 | PAR factor (float) |
| 16 | Profile slot number (1-24) |
| 17 | Mode name |

Examples:
```
55.0, 65.0, 523, 527, 0, 0, 1, 122, 720, 858, 18, 240, 263, 1716, 0.90909, 10, 480iCustom
59.0, 61.0, 529, 531, 1, 1, 0, 122, 749, 858, 34, 480, 495, 2200, 0.90909, 11, Sega Naomi
```
- Fields 8-13: from system documentation or trial and error.
- BT.656 480i is conventionally 858 px/line at PAR 10/11; the example samples at 1716 (oversampling, better quality). The RT4K uses canonical rate + PAR + actual rate together so the result scales correctly. (NAOMI example by Aru.)

## Custom EDID

- RT4K uses its built-in EDID on HDMI In unless `edid.bin` exists in the SD root.
- Uses: make a source see the RT4K as another device, e.g. force 480p when a source can't otherwise be set; let a device know 1080i or HDR input is accepted.
- File: raw binary dump of a 256-byte EDID. Tools: AW EDID Editor (Analog Way), Custom Resolution Utility (CRU, monitortests.com).

## Preparing the TV

Setting names differ by brand; search "[model] + setting".
- **Motion interpolation off** (Motion Smoothing, TruMotion etc.): big latency source and breaks post-processing effects.
- **Turn off anything with an off switch**; smart processing adds lag.
- **Game Mode on**: lowest lag, lets the RT4K drive the image; may still need manual tweaks.
- **PC Mode on**: usually forces full color / no chroma subsampling (4:4:4). Difference between effects rendering correctly or not.
- **BFI**: if the TV has its own, consider using it while the RT4K outputs max resolution.
- **HDR**: enable and recheck all of the above; some TVs re-enable options when HDR turns on.

## Community resources

**Get profiles/masks:** all community profiles and masks are bundled in the SD card images released with each stable firmware: https://retrotink-llc.github.io/firmware/4k-sdcards.html (Firmware Repository, by Squid Hominid, also has release + experimental firmware: https://retrotink-llc.github.io/firmware/). Install profiles by copying .rt4 files into `profile/`.

Community profile packs:
- **Wobbling Pixels** NTSC & PAL profiles (read the "How to install and update profiles" txt).
- **Prof_gLX**: 3DO RGB 240p/480i, Atari 2600 composite, GBA Consolizer, Neo Geo MVS, Hi-Def NES (as of 2023-12-17).
- **RegentOfOrigin**: N64 NTSC HD Retrovision, 7th/8th-gen simple HDMI profiles (as of 2023-12-26).
- **VHS Capture Profile** (Bob, RetroRGB): default profile tuned for VHS capture via front composite/S-Video.
- **DV1 Profile Repository** (TheJesusFish): MiSTer DV1-mode profiles with post-processing; follow the GitHub page for required settings/version: https://github.com/TheJesusFish/Retrotink-DV1-Profile-Repository

Banners (go in `banners/`; select via OSD/Firmware menu): MiSTerFPGA (Pezz82); ArielAces set: RT4K-RGB, Retrowave, NES-SMB3, SNES-SFII, Chrono Trigger, Sega Sonic A/B, #EmulationIsForQuitters, $10 FPGA inside, RetroRGB, The Lag is Real!

Tools/downloads:
- Fat32format GUI (Ridgecrop): format >32 GB cards as FAT32, http://ridgecrop.co.uk/index.htm?guiformat.htm
- Video Timings Calculator (Guspaz), Mask Editor (infinest), see above.
- RT4K Schematics (Mike Chi): zip with dimensioned schematics + .step CAD model, for shells/parts.

Serial-command implementations (remote commands / auto profile switching):
- Stream Deck control (Carter3000): https://github.com/carter300/RetroTink4K-PCRemote
- Auto profile switching via Arduino from TESmart HDMI switches, Extron, gscart/gcomp, Otaku Games SCART switch (donutswdad): https://github.com/svirant/RT4k_HD15_serial_control
- RetroTINK 4K Remote, browser mouse/keyboard control (PIPe): https://rt4k-remote.pipe.hr/

Accessories:
- SCART2VGA Adapter (jeffqchen): 3D-printed, turns SCART port into a second HD-15.
- SCART-Lock (Kytor Industries): screw-down sleeve for angled SCART plugs.
- Vertical Stand with remote holder (Retro Frog, .stl on Printables).
- Laser Bear Industries: Remote Mount (also fits RT5X remote), Wall Mount Kit (VESA + strain relief), Fan Mount Kit (replaces left white cover; Noctua NF-A4x10 5V sold separately; fan not needed normally, only for poor airflow), DB15 to S-Video/CVBS Adapter.
- YC2VGA (Zaxour, open source, enclosure files): S-Video/CVBS into DB15.
- Caveat for both DB15 S-Video/CVBS adapters: DB15 carries no audio; feed audio to the 3.5 mm jack.

Video guides: My Life in Gaming (HDMI-input possibilities, scanlines on HD retro-style games, analog overview); FirebrandX (building an optimal-sampling profile); Wobbling Pixels (using their SD-card profiles).
