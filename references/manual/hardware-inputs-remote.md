Condensed from the ConsoleMods RetroTINK-4K wiki (consolemods.org, CC BY 4.0); paraphrased and reorganized. Live text as of 2026-10-12.

# Hardware, Models, Inputs, Remote, LED, System/OSD

## Quick facts

- **Models**: 4K Pro (black, bigger FPGA), 4K CE (white, baseline), 6X CE (budget: max 1440p60 output, no HDMI input), 6X Pro (unreleased). All run the **same firmware**; Pro-only features are just unavailable on others.
- **Max input**: 1920x1080p60 or 1920x1200p60 CVT-rb (analog and HDMI). No 1440p/4K input: a higher-res HDMI source shows nothing.
- **Max input width**: 2048 px on CE/6X; 4096 px on 4K Pro (the Inputs section says 4095; source inconsistent).
- **Default output**: 4K60 on 4K models, 1080p on 6X models. No picture? Press 1080p/1440p/480p on the remote, or use Safe Mode (480p59.94).
- **Power**: USB-C, 5V 2A (10W+) from a reputable adapter; avoid TV USB ports (underpowered). HDMI cable: 2.0+/18Gbps.
- **SD card is required** (firmware, profiles live on it). Any FAT32 SD/microSD works; up to 1TB tested (formatted with guiformat).
- **HD-15 carries no audio**: use the 3.5mm TRS jack (default for HD-15) or TOSLINK. SCART audio is on pins 2 (R) and 6 (L).
- **LED**: green = ready, white = booting, slow red pulse = asleep, yellow flash = firmware .rbf missing, red flash = update error (not bricked).
- **Safe Mode**: blue Reset button on the back, or hold SAFE 2 s. Loads Default profile, HDMI input (6X CE: front composite), 480p 59.94 Hz output.
- **Custom IR**: `ir_remote.txt` in SD root, lines `<IR_RT_name>, address, command` in **decimal**; power-cycle once to load. Replaces the codes (doesn't add to them).

## Models

| Model | Notes |
|---|---|
| **4K Pro** | Original black unit, stronger FPGA, all features below. Box includes a USB-A/USB-C SD reader. |
| **4K CE** | White baseline model, up to 4K60 output, HDMI in. Firmware support from 1.7.3. No SD reader in box. |
| **6X CE** | Budget version of 4K CE: output capped at 1440p60, **no HDMI input**, 1080p default output. Has an SD reader in box. SCART screw holes are not threaded. Safe Mode input = front composite. |
| **6X Pro** | Not yet released; meant to offer more than the 6X CE. |

Box contents: unit, 8GB SD card (preloaded), remote (model-specific), USB-A to USB-C cable. **No** power adapter or HDMI cable.

### Pro-only features **[Pro only]**

- **Input width up to 4096 px** (others 2048). Only matters in practice for MiSTer DV1 with Auto Decimate off (often sends >2048 wide).
- **Enhanced S-Video** (HD-15 input "Y/C on G/R (Enc.)"): S-Video processed with near-RGB/YPbPr sharpness; for S-Video-max consoles like N64, 3DO.
- **RoTATE**: 90° CW/CCW for 240p/288p/360p inputs (arcade/vertical shmups).
- **IIR LPF horizontal blur**: emulates CRT left-to-right blur (e.g. Toshiba AF44 example).
- **IIR HPF horizontal blur**: cleans up 3-chip SNES smear.
- **xBR smoothing**: emulator-style xBR scaling (wiki suggests trying the interpolation kernels instead).
- **BFI extras**: BFI itself is on all models; Pro adds **BFI Color** and **Rolling BFI** (sectioned, CRT-like rolling).
- **Motion Adaptive Deinterlacing controls**: sensitivity, noise threshold, Edge Adaptive interpolator. Other models still have the deinterlace algorithms, just not the fine tuning.
- **Inverse Telecine**: 3:2 (24 fps film from 480i60) and 2:2 (576i50/480i60 made from 25p/30p; useful for many PS2 games). Needs telecined content, not just interlaced; not all PS2 games are stable 30 fps.
- **3D comb filter** for NTSC composite (less rainbowing/dot crawl).
- **Digital audio resampler**: converts off-spec rates (e.g. GameCube 44.042 kHz) to 48/96 kHz.
- Caveat: an Aug-2026 revision also listed **Continuous Auto Phase** (Pro runs auto-phase continuously; CE runs it on demand via remote/menu and can save it to a profile) and **banner color depth**; the Oct-2026 live page dropped them from this list (banner difference now said to apply only to firmware <=1.72.0).

## Headline feature set (all models unless tagged)

- **Output**: HDMI up to 4K60 (4K models), 480p/1080p/1440p at various rates, custom modelines on SD; fully buffered (drop-free input changes), Gen Lock and Frame Lock sync modes; HDR10 with color correction to Rec.2020; high-refresh 1440p120, 1080p240; optional deep color (10-bit at 4K60 may not work on all displays); up to 8-ch LPCM or compressed passthrough; interlaced output (480i, 1080i).
- **Analog**: auto gain, auto phase, auto crop, manual gain/offset/sample rate, experimental per-console auto sample-rate detection, off-spec arcade/PC tolerance (may need custom profiles), composite/S-Video decoder for NTSC, PAL, PAL-60, SECAM.
- **Scaling**: independent H/V crop and zoom, auto aspect correction to 4:3/16:9, motion-adaptive deinterlacing (telecine modes Pro only), RoTATE [Pro only].
- **CRT sim**: beam profiles, beam strength / intensity modulation, adjustable masks, interlaced simulation with offset scanlines (also on progressive sources), LCD patterns that adapt to non-integer scaling (RGB/BGR subpixel).
- **Processing**: RGB pipeline at 12-bit internal precision, conventional and approximated gamma, configurable gamma and PQ (HDR), gamut transforms, BFI with custom pattern/intensity, linear-light processing.
- **UI**: OSD menus, SD card for modelines/firmware/profiles, 100,000+ profiles supported.

## Firmware: CE-specific notes

(Install steps, LED codes and channels: see `references/firmware.md`.)
- **[CE]** 4K CE support began at **1.7.3**. Copy only `rt4kce_#.rbf` + `rt4kup.bin` to the card; `rt4k_#.rbf` (Pro) is not needed and skipping it speeds boot.
- Keep the old .rbf on the card if updating from the menu; deleting it forces the Reset-button method (yellow LED / no boot).
- Firmware updates keep profiles, CSCs, banners, input modes, mask overlays and modelines (all on the SD card).

### Significant features added after launch

- MiSTer DV1 auto-decimate and auto-crop; auto-load DV1 profiles by reported core name.
- Auto-crop for HDMI sources.
- Sega Saturn auto-sampling.
- Interlaced (offset) scanlines on progressive sources.
- Enhanced S-Video via HD-15 **[Pro only]**.
- Edge Adaptive interpolator for MADI Bob deinterlacing **[Pro only]**.
- HDR10 and HLG passthrough from HDMI sources (e.g. PS4).
- Interlaced output modes (480i, 1080i).
- Low-res OSD mode for 480i/240p output.
- Auto-sleep timer (power off after no input) and configurable power-on state.
- Serial remote control over HD-15 (pins 12/15) and USB virtual serial ports.
- SVS (Scalable Video Switch) support incl. auto-load profiles on new input.
- Third-party remote support (`ir_remote.txt`).
- Custom modeline slots 3-6 user-definable and saved in profiles. **[6X]** has 6 custom modeline slots; RetroTINK-4K has 4.

## Inputs

Select via the remote's INPUT button or Menu > Input Selection. Analog max for RGB/YPbPr modes: 1920x1080p60 (148.5 MHz). Composite and S-Video modes: 240p/480i/288p/576i only.

### Port summary

| Port | Video modes | Default audio |
|---|---|---|
| **HDMI** **[not on 6X CE]** | Digital up to 1080p60 / 1200p60 CVT-rb, tolerates off-spec resolutions. No 1440p/4K input. | HDMI audio, up to 8-ch LPCM up to 96 kHz or compressed |
| **Front** | Composite (yellow RCA), S-Video (Mini-DIN). Sliding cover. Connect only one front video input at a time. | Front red/white RCA (active for front composite or S-Video unless overridden) |
| **Rear RCA** | YPbPr, RGsB, CVBS on Green (yellow lead into Green jack; max 480i) | Leftmost red/white RCA pair |
| **SCART** (right side) | RGBS (75 ohm: attenuated csync, sync-on-luma, sync-on-composite), RGsB (e.g. PS2 480p), YPbPr, CVBS on pin 20, CVBS on Green, Y/C on pin 20/Red | SCART pins 2 (R) / 6 (L) |
| **HD-15 / VGA** | RGBHV (PC), RGBS (csync 75 ohm or TTL, sync-on-luma, sync-on-composite), RGsB, YPbPr, CVBS on Hsync, CVBS on Green, Y/C on Green/Red, Y/C on G/R (Enc.) **[Pro only]** | None on the port; 3.5mm TRS by default |
| **3.5mm TRS** | (audio only) stereo analog, tied to HD-15 by default | |
| **TOSLINK optical** | (audio only) 2-ch LPCM or compressed surround | |

Analog audio is sampled at up to 96 kHz/24-bit with gain control.

**SCART mounting**: two M4x0.7 threaded holes beside the SCART port, 70.4 mm apart center-to-center, for a DIY retention bracket (6X CE has holes but no threads).

### SCART pinout

| Pin | RGBS | RGsB | YPbPr | CVBS pin 20 | CVBS on Green | Y/C pin 20/Red |
|---|---|---|---|---|---|---|
| 2 | Audio R | | | | | |
| 4 | Audio ground | | | | | |
| 5 | Blue ground | | | | | |
| 6 | Audio L | | | | | |
| 7 | Blue | Blue | Pb | unused | | |
| 9 | Green ground | | | | | |
| 11 | Green | Green+Sync | Y | unused | CVBS | unused |
| 13 | Red ground | | | | | C ground |
| 15 | Red | Red | Pr | unused | | Chroma (C) |
| 17 | Ground | | | | | |
| 18 | Sync ground | | | CVBS ground | unused | Y ground |
| 20 | Sync | unused | | CVBS | unused | Luma (Y) |

Pins 1, 3, 8, 10, 12, 14, 16, 19 unused. Blank cells: not specified in the source (pins 2-6, 9, 17 apply to all modes).

### HD-15 pinout

| Pin | RGBHV | RGBS | RGsB | YPbPr | CVBS on Hsync | CVBS on Green | Y/C & Enhanced Y/C | Data |
|---|---|---|---|---|---|---|---|---|
| 1 | Red | Red | Red | Pr | unused | | Chroma (C) | unused |
| 2 | Green | Green | Green+Sync | Y | unused | CVBS | Luma (Y) | unused |
| 3 | Blue | Blue | Blue | Pb | unused | | | |
| 5 | H-sync gnd | Sync gnd | unused | | CVBS gnd | unused | | |
| 6 | Red gnd | Red gnd | Red gnd | Pr gnd | unused | | C gnd | unused |
| 7 | Green gnd | Green gnd | G+Sync gnd | Y gnd | unused | CVBS gnd | Y gnd | unused |
| 8 | Blue gnd | Blue gnd | Blue gnd | Pb gnd | unused | | | |
| 10 | V-sync gnd | unused | | | | | | |
| 12 | | | | | | | | **EXT TX** (serial transmit) |
| 13 | H-sync | Sync | unused | | CVBS | unused | | |
| 14 | V-sync | unused | | | | | | |
| 15 | | | | | | | | **EXT RX** (serial receive) |

Pins 4, 9, 11 unused.

**Enhanced S-Video cable [Pro only]** (HD-15 female to 4-pin Mini-DIN male): Y signal pin 2 -> 3; Y ground pin 7 -> 1; C signal pin 1 -> 4; C ground pin 6 -> 2. Sampling and luma calibration for it live in the RGB/Comp. ADC menu.

### Audio routing / override

- Advanced Settings > Acquisition > Audio Input > Source > **Input Override**: take the current video input's audio from another source: RCA (Rear), HD-15 (= 3.5mm TRS), SCART (pins 2/6), Front (red/white RCA), S/PDIF (TOSLINK).
- HDMI audio **cannot** be assigned to a non-HDMI video input; non-HDMI audio on HDMI video is allowed.
- **Input Swap**: swap L/R (some third-party Saturn cables) or make mono from L or R (e.g. NES).

## Basic analog calibration (getting started)

- HDMI sources need no calibration.
- **Auto Gain** (remote GAIN): needs a patch of pure white on screen; set per console. Manual gain: Advanced Settings > RGB/Component ADC (use 240p Test Suite).
- **Auto Crop** (per game; use a screen without dark edges): AUX1 = vertical only; AUX2 = full crop to 4:3; AUX3 = full crop to 16:9 (also sets aspect correction 16:9). Manual: Scaling/Cropping menu.

## Remote

Both remotes use NEC address **0x49 (73 decimal)**; command codes are identical across remotes. Same codes as some Oppo devices: an Oppo remote may turn the RT4K on (change the Oppo's code set).

| Button | Function | Cmd hex | Cmd dec | ir_remote.txt name | Pro remote | CE remote |
|---|---|---|---|---|---|---|
| Power | On/off | 0x1A | 26 | IR_RT_PWR | yes | yes |
| INPUT | Input selection menu | 0x11 | 17 | IR_RT_INPUT | yes | yes |
| OUT / OUTPUT | HDMI output menu | 0x20 | 32 | IR_RT_OUTPUT | yes | yes |
| SCL / SCALER | Scaling/Cropping menu | 0x21 | 33 | IR_RT_SCALER | yes | yes |
| SFX | Processing/Effects menu | 0x22 | 34 | IR_RT_SFX | yes | yes |
| ADC | Context: HDMI Receiver / RGB-Component ADC / SDP Decoder (composite, S-Video) menu | 0x23 | 35 | IR_RT_ADC | yes | yes |
| PROF | Profiles menu | 0x24 | 36 | IR_RT_PROF | yes | yes |
| COL | Color Correction menu | 0x60 | 96 | IR_RT_COL | no | yes |
| AUD | Audio input menu | 0x61 | 97 | IR_RT_AUD | no | yes |
| 1 | Profile 1 | 0x0B | 11 | IR_RT_1 | yes | yes |
| 2 | Profile 2 | 0x07 | 7 | IR_RT_2 | yes | yes |
| 3 | Profile 3 | 0x03 | 3 | IR_RT_3 | yes | yes |
| 4 | Profile 4 | 0x0A | 10 | IR_RT_4 | yes | yes |
| 5 | Profile 5 | 0x06 | 6 | IR_RT_5 | yes | yes |
| 6 | Profile 6 | 0x02 | 2 | IR_RT_6 | yes | yes |
| 7 | Profile 7 | 0x09 | 9 | IR_RT_7 | yes | yes |
| 8 | Profile 8 | 0x05 | 5 | IR_RT_8 | yes | yes |
| 9 | Profile 9 | 0x01 | 1 | IR_RT_9 | yes | yes |
| 10 | Profile 10 | 0x25 | 37 | IR_RT_10 | yes | yes |
| 11 | Profile 11 | 0x26 | 38 | IR_RT_11 | yes | yes |
| 12 | Profile 12 | 0x27 | 39 | IR_RT_12 | yes | yes |
| MENU | Main menu | 0x5C | 92 | IR_RT_MENU | yes | yes |
| BACK | Previous menu | 0x42 | 66 | IR_RT_BACK | yes | yes |
| Up | | 0x18 | 24 | IR_RT_UP | yes | yes |
| Left | | 0x57 | 87 | IR_RT_LEFT | yes | yes |
| ENTER (CE: "Bunny") | Enter | 0x53 | 83 | IR_RT_OK | yes | yes |
| Right | | 0x4F | 79 | IR_RT_RIGHT | yes | yes |
| Down | | 0x10 | 16 | IR_RT_DOWN | yes | yes |
| DIAG | Diagnostic console | 0x28 | 40 | IR_RT_DIAG | yes | yes |
| STAT | Status screen | 0x29 | 41 | IR_RT_STAT | yes | yes |
| AUTO-GAIN | Auto gain calibration | 0x2B | 43 | IR_RT_GAIN | yes | yes |
| AUTO-PHASE | Auto phase calibration | 0x2D | 45 | IR_RT_PHASE | yes | yes |
| PLAY/PAUSE | Freeze frame | 0x56 | 86 | IR_RT_PAUSE | yes | no |
| SAFE | Safe Mode (hold 2 s) | 0x2E | 46 | IR_RT_SAFE | yes | yes |
| SYNC-GEN | Sync lock: Gen Lock | 0x2C | 44 | IR_RT_GENLOCK | yes | yes |
| SYNC-BUF | Sync lock: Triple Buffer | 0x2F | 47 | IR_RT_BUFFER | yes | yes |
| 4K | 3840x2160p60 | 0x30 | 48 | IR_RT_4K | yes | yes |
| 1080p | 1920x1080p60 | 0x31 | 49 | IR_RT_1080P | yes | yes |
| 1440p | 2560x1440p60 | 0x32 | 50 | IR_RT_1440P | yes | yes |
| 480p | 720x480p60 | 0x33 | 51 | IR_RT_480P | yes | yes |
| RES1 | Custom modeline output 1 | 0x34 | 52 | IR_RT_RES_1 | yes | yes |
| RES2 | Custom modeline output 2 | 0x35 | 53 | IR_RT_RES_2 | yes | yes |
| RES3 | Custom modeline output 3 | 0x36 | 54 | IR_RT_RES_3 | yes | no |
| RES4 | Custom modeline output 4 | 0x37 | 55 | IR_RT_RES_4 | yes | no |
| AUX1 | Auto crop: vertical only | 0x38 | 56 | IR_RT_AUX_1 | yes | yes |
| AUX2 | Auto crop: full to 4:3 | 0x39 | 57 | IR_RT_AUX_2 | yes | yes |
| AUX3 | Auto crop: full to 16:9 | 0x3A | 58 | IR_RT_AUX_3 | yes | yes |
| AUX4-AUX8 | No default function listed | 0x3B-0x3F | 59-63 | IR_RT_AUX_4 .. IR_RT_AUX_8 | yes | yes |

("no" means the button isn't on that remote's table; the function/name still exists and can be mapped via `ir_remote.txt`.)

### Pause **[Pro remote only]**

- Freezes the current frame and mutes audio; frame is remembered across input switches. Best use: tuning motion-adaptive deinterlacing on a frozen frame.
- **[CE]/others**: add it by mapping `IR_RT_PAUSE` to a spare remote button in `ir_remote.txt`.
- Caveats: odd results when loading a profile, using crop tools or engaging inverse telecine while paused; BFI isn't visible (needs new frames).

### Custom IR codes (`ir_remote.txt`)

- Put `ir_remote.txt` in the SD root, power the unit off/on once. New codes **replace** the defaults (unit no longer listens for the stock codes of remapped buttons).
- One line per button to change: `<button name>, <NEC address>, <NEC command>`, all **decimal**.
- The STAT screen shows the IR codes of any remote it detects, in **hex**: convert to decimal before use.
- Example (RetroTINK-5X standard remote): `IR_RT_PWR, 128, 129` / `IR_RT_MENU, 128, 131` / `IR_RT_UP, 128, 56` / `IR_RT_DOWN, 128, 64` / `IR_RT_LEFT, 128, 55` / `IR_RT_RIGHT, 128, 57` / `IR_RT_OK, 128, 19` / `IR_RT_BACK, 128, 39`. The wiki also offers a downloadable mapping for the RT5X Premium Remote.

### Safe Mode

Trigger: blue Reset button (rear) or hold SAFE 2 s. Effect: loads Default profile; input = HDMI (6X CE: front composite); output = 480p 59.94 Hz (every HDMI display must support it). For troubleshooting / returning to a known state. (Holding Reset while plugging in power instead starts a firmware install.)

## LED

| LED | Meaning |
|---|---|
| Off | No power |
| Slow red pulse | Sleeping; turn on to use |
| White | Booting |
| Green | On and ready |
| Yellow flash | System files missing at boot: check SD inserted, `.rbf` present, `rt4kup.bin` matches it |
| Purple flashing | Firmware updating (firmware section calls it pink, then blue) |
| Blue flashing | Firmware update succeeded |
| Red flash | Firmware update error; check SD files and retry (not bricked) |

## System menu (OSD, banner, status, diagnostics, about)

### Banner image

- Stored in the SD card's `image` folder. Format: **24-bit BMP for RT4K, 8-bit BMP for RT6X**.
- Recommended 320x128; larger is allowed but only the top-left 320x128 is drawn.
- Displayed in 256 colors; more colors are auto-converted on load (pre-quantizing on a PC may look better).
- Magenta RGB 255,0,255 = transparent; use 255,0,254 for visible magenta.
- Banner is saved in the profile; profiles without one load `default.bmp` (set your own default by replacing it).
- Bundled extras include FirebrandX's Demon's Crest banner and moon banners (moon deliberately not a perfect circle).
- Firmware <=1.72.0: banner color depth was RGB443 on 4K Pro, RGB222 on all others (incl. 4K CE).

### On Screen Display

- **Position**: Left / Center / Right; default Left.
- **Auto-Off**: menu auto-hide; Off (default) or 10-100 s in 10 s steps.
- **Hide Input Res.**: suppresses the top-right input/resolution popup on changes; handy for capture/streaming.
- **Enable Debug OSD**: permanently show one of the three Status pages or the Diagnostic Console.
- Low-res OSD mode exists for 480i/240p output.

### Firmware Update

"Check SD Card" scans for the `.rbf` + `rt4kup.bin` pair and offers to install.

### Status / Diagnostic Console / About

- **Status** (STAT): status pages (three, per the Debug OSD option) on current operation; also shows IR codes of detected remotes (hex).
- **Diagnostic Console** (DIAG): shows the 30 most recent operations/actions (source itself is unsure: "Or something?").
- **About**: Device (hardware version), FW Version, Device ID; resources (retrotink.com, Discord, wiki consolemods.org/rt4k); special-thanks list.
