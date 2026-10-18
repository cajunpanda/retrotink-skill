# Console-Specific Settings: Sony & Others

Condensed from the ConsoleMods RetroTINK-4K wiki (consolemods.org, CC BY 4.0); paraphrased and reorganized. Live/patched text as of 2026-10-06.

**Contents:** General notes | PS1 | PS2 (+ PS1 on PS2) | PSP (+ PSone Classics on PSP) | PS3 (+ PS1/PS2 games on PS3) | PlayStation TV (+ Unlock Framebuffer, PSone Classics) | PS4 | PS5 | Xbox (OG, XboxHDMI) | Xbox 360 | Neo Geo MVS/AES | TurboGrafx-16/PC Engine | PixelFX GEM/HDMI mods (PS1, PS2, N64) | Commodore 64 | MiSTer | Analogue Super NT / Mega SG | Analogue Pocket + Dock (+ Analogizer)

Profile paths are relative to the SD card root. `[REGION]` is a placeholder in the profile pack's folder names.

---

## General notes (short version)

- **Sampling tables only apply to the RGB/Component ADC**: Enhanced S-Video **[Pro only]**, YPbPr, RGBS or RGBHV. Plain S-Video and composite have no sampling settings.
- **"Sample Rate Detection"** in a table means the console works with Automatic Sample Rate Detection at 15 kHz. Use it if your games really mix horizontal resolutions; otherwise manual settings are simpler.
- **Cables:** the wiki recommends the simplest native connection that gives the best result, usually RGB SCART. RGBS-to-YPbPr transcoding cables also work. **Turn off the RT4K Low Pass Filter with HD Retrovision cables**, which have their own LPF.
- **Dithering:** in Advanced Settings > Processing / Effects, set Hori./Vert. Kernel to "Bilinear Soft". Add scanlines and HDR to offset the blur. For vertical-stripe-only dither, Bilinear Sharp on the Hori. Kernel is enough.
- **[6X]** The RetroTINK-6X CE has **no HDMI input**. HDMI-only sources need a VGA or component DAC to use it.

---

## Sony PlayStation (PS1 / PSone)

**Sampling**, Sample Rate Detection (Auto Dec. Factor **On**, Auto Dec. Phase **Auto**):

| Setting | NTSC | PAL |
|---|---|---|
| ADC Sample Rate | 3413 | 3406 |
| Progressive Detection | 341.300, 426.625, 487.571, 682.600, 852.250 | 340.600, 425.750, 486.571, 681.200, 851.500 |
| Interlace Detection | same as Progressive | same as Progressive |

**Connections**
- **RGB Sync-on-Luma SCART** is recommended: cheap, easy to find, and safe to plug straight into the RT4K.
- RGB CSync cables use a sync stripper. Only use one if your setup needs CSync, and make sure its sync levels are safe for the RT4K.
- Cables: RetroTINK PS1 Dongle with a RetroTINK HD15-to-HD15 or HD15-to-SCART cable (uses a safe sync stripper); Insurrection Industries SCART; RetroGamingCables SCART; RetroAccess SCART (coaxial, Luma).

**Settings & tips**
- The PS1 can output up to **20 resolutions** and uses up to **5 horizontal sample rates**. Many games switch rates between scenes, often between gameplay and menus. You can switch off rates your library never uses. A community Google Sheet lists games and their horizontal resolutions (incomplete).
- Some games switch between **240p and 480i** mid-play. Set HDMI Output > Sync Lock to **Triple Buffer** so you don't lose gameplay during the switch. The included profiles usually default to Triple Buffer.

**Profiles:** `\profile\Sony PS1\_Start Here [REGION].rt4` (sharp 4K).

---

## Sony PlayStation 2

Original and Slim models.

**Sampling**, Sample Rate Detection (Auto Dec. Factor **On**, Auto Dec. Phase **Auto**):

| Setting | NTSC | PAL |
|---|---|---|
| ADC Sample Rate | 3432 | 3456 |
| Progressive Detection | 343.200, 429.000, 490.286, 686.400, 858.000 | 345.600, 432.000, 492.714, 691.200, 864.000 |
| Interlace Detection | 341.300, 426.625, 487.571, 682.600, 852.250 | 340.600, 425.750, 486.571, 681.200, 851.500 |

(As printed on the wiki, the Interlace row is identical to the PS1 table.)

**Connections**
- **YPbPr component** is best. Avoid RGBS-to-YPbPr transcoding cables, such as HD Retrovision Genesis cables with the PS1 adapter.
- RGB SCART also works, but YPbPr makes 15/31 kHz switching simple. If you need a SCART cable, still set the PS2 to output YPbPr.
- Optional: a TOSLink optical audio cable.
- YPbPr cables: HD Retrovision PS2/PS3 component (turn off the RT4K LPF); RetroGamingCables YPbPr.
- SCART/dongle cables (set the PS2 to YPbPr and use the matching YPbPr input on the RT4K): RetroTINK PS2 Dongle with an HD15-to-HD15 or HD15-to-SCART cable; Insurrection Industries SCART; RetroGamingCables SCART (Sync-on-Luma); RetroAccess SCART.

**Settings & tips**
- **Enable YPbPr:** boot with no disc and no memory card (goes to the BIOS), press Down > X (System Configuration), Down x3 > X (Component Video Out), Left/Right to "Y Cb/Pb Cr/Pr", then X.
- **RGB caveat:** set to RGB, the PS2 outputs RGBS Sync-on-Luma at 15 kHz but **RGsB Sync-on-Green at 31 kHz**. The RT4K handles both, but it can't switch between them automatically. YPbPr avoids the problem.
- **Optical audio (optional):** in the BIOS, System Configuration > DIGITAL OUT (OPTICAL) > On. On the RT4K: connect TOSLink, then MENU > Advanced Settings > Audio Input > Input Override > **S/PDIF**, then PROF > Save Current > Confirm. Some games have no optical audio (e.g. Parappa the Rapper 2). The analog audio is also excellent.

**Profiles:** `\profile\Sony PS2\_Start Here [REGION].rt4`

### PS1 games on PS2
- The PS2 outputs PS1 games correctly over both YPbPr and RGB. Claims that YPbPr doesn't work usually come from displays that struggle with 240p. The PS2 hardware converts PS1 output to YPbPr properly.
- **Texture filter:** boot to the BIOS with no disc or memory card, press Triangle (Version menu), highlight PlayStation Driver, Triangle (Options), then Texture Mapping: **Standard** (sharp) or **Smooth** (for CRT-style profiles).
- All the other PS2 notes still apply.
- Profile (sharpest): `\profile\Sony PS2\Wobbling Pixels PS1 on PS2 [REGION] YPbPr - Sharp\PS1 on PS2 4-3 - Sharp.rt4`

---

## Sony PSP (PSP-2000, 3000, Go)

**Sampling & scaling:**

| Setting | Value |
|---|---|
| Samples per Line | 3432 (2880 Act.) |
| Decimation Factor | 4 (858.000) |
| Top & Bottom Trim | edge of the game picture minus 2 px (top or bottom) |
| Left & Right Trim | edge of the game picture |
| Aspect Correction | 1:1 (Sq Pixel) |
| Scaling mode | Auto Fill Integer |

**Connections:** **YPbPr component** gives full 480p. Composite and S-Video cables exist but can't do 480p.

**Settings & tips**
- In the XMB: Settings > Connected Display Settings > Component/D-Terminal Output > **Progressive**, and Flicker Reduction > **Off**.
- Start video output either from the XMB (Connected Display Settings > Switch Video Output > Yes) or by holding the **screen button**.

**Profiles:** **start a game first**, then load `\profile\Sony PSP & PSP Go\_Start Here.rt4`. The PSP menu is a full 720x480 image, while games render at **480x272** inside the 480p canvas, so loading the profile too early can crop important parts of the menu. The profile may drop 2 rows of pixels. You can adjust scaling and trim to show everything, at the cost of slightly softer scaling.

### PSone Classics on PSP
- **Connections:** S-Video, composite or YPbPr. YPbPr gives consistently sharp sampling. The RT4K Pro needs Enhanced S-Video **[Pro only]** for sharp sampling. The RT4K CE can't sharply sample S-Video. Neither model can sharply scale composite.
- **Settings:** Component/D-Terminal Output = **Interlace**, Flicker Reduction = Off. This option is really a 15 kHz vs 31 kHz switch, and Interlace keeps the PS1 game's original vertical resolution. With Progressive: 240p games can use prescale, but 480i content may be deinterlaced or prescaled wrongly, and sample rate detection doesn't work at 480p (you'd need manual or generic sampling).
- **Profiles:** start the PS1 game first, then load `\profile\Sony PSP & PSP Go\MrMoro PSP+PS1 Basic Profile.rt4`. Games with unusual resolutions (decimation factor 5, 8 or 10 examples) can use the profiles in `profile\Sony PSP & PSP Go\Mr Moro PS1 YPbPr 09x`.

---

## Sony PlayStation 3

**Connections**
- **HDMI:** digital and flawless, but **HDCP is always on** (you need external hardware to deal with it). No 15 kHz output.
- **YPbPr:** no HDCP, but the DAC quality is mediocre. 15 kHz is **interlaced only**, so the PS3 never outputs 240p or 288p.
- Composite/S-Video: 15 kHz only, and never progressive.
- RGB: same behavior as the PS2 (Sync-on-Luma at 15 kHz, Sync-on-Green at 31 kHz). See the PS2 section.
- Audio: use HDMI where possible. **[6X]** On the 6X CE, enable optical output on both the PS3 and the RetroTINK.
- Cables: any HDMI cable works. Analog uses the same cables as the PS2.

**Settings & tips**
- **First-time output setup:** connect the console, then from standby hold power until the second beep and release. Choose Yes to HDMI and Yes to 1080p.
- **Changing resolution later:** Settings > Display Settings > Video Output Settings > HDMI > Custom. Enabling every resolution is safe. Press X, then Finish.
- Most games output **720p** even with 1080p enabled.
- **HDMI range:** the PS3 flags Full range incorrectly. Either set the PS3 to **Limited** (the RT4K then handles it automatically, no profile needed), or set it to Full and save a profile with the HDMI input forced to Full.
- **Analog:** set the PS3 to YPbPr, like the PS2. It has the same SoL/SoG caveat on RGB. If the PS3 thinks a SCART cable is connected, it caps YPbPr at 480p; tell it you're using YPbPr cables to unlock up to 1080p.

### PS1 and PS2 games on PS3
- Everything is emulated in software, and PS1/PS2 games are rendered so that their original resolution **can't be recovered**. Treat them as PS3 software: plug and play, without sharp or CRT tuning. For PS1, the wiki suggests using a real PS1 or PS2.
- PS2 discs only play on backward-compatible models: **CECHA-0X** (full hardware BC, with wireless), **CECHB-0X** (full hardware, no wireless), **CECHC-0X** and **CECHE-0X** (partly software-emulated).
- XMB > PS/PS2 Settings:
  - **Upscaler Off:** scales unevenly to 640x480. At 15 kHz the output is a field render of that 480p image, so the RT4K can't recover the original.
  - **Upscaler Normal:** current resolution, forced 4:3.
  - **Upscaler Full Screen:** current resolution, forced 16:9.
  - **Smoothing Off** gives point scaling; **On** applies a bilinear filter.
- Recommended: **Upscaler Normal**, Smoothing to taste, **1080p** output.
- A disc and the same game as a digital PSone Classic play identically. Sharpness occasionally differs between the two, with no consistent pattern.

---

## Sony PlayStation TV (Vita TV)

Runs Vita and PSP software and accepts only Vita cartridges. **A stock PSTV without custom firmware is plug and play: no settings or profiles needed.**

**Connections:** HDMI only, with **HDCP always on** (you need extra equipment to strip it). **[6X]** On the 6X CE, use a component or VGA DAC.

**Settings & tips**
- Settings > Sound & Display > Resolution > **720p**.
- **Custom firmware + Sharpscale plugin:** Scaling Mode **Integer**, PS1 Aspect Ratio **Pixel**, Scaling Algorithm **Point**. This windowboxes the picture with black bars on all four sides; the profiles fix that.
- **Adrenaline (PSP content):** open Adrenaline, hold Home > Settings, press R1 twice for the full menu, choose **Reset Adrenaline Settings**, set **Smooth Graphics: No**. Treat everything else like Vita software, with Vita profiles.

**Profiles** (`\profile\Sony PSTV\MrMoro + Sharpscale\`; they crop 4 rows on Vita and 2 rows on PSP for maximum sharpness)
- Vita: `Vita 720p.rt4`, with masks enabled if you want effects.
- PSP without effects: `PSP.rt4`. PSP with effects: `PSP 2000.rt4` or `PSP 3000.rt4`.

### Unlock Framebuffer (advanced, per game)
- The Vita's native resolution is 960x544, but some games render lower and get stretched.
- Sharpscale: Scaling Mode **Real**, Unlock Framebuffer **On**.
- RT4K (4K output only): trim to the picture edge; Scaling Mode **Freeform**; Vertical Factor **2176**; Horizontal Factor **3840**.
- You need a profile per game; standard Vita profiles won't work (switch Sharpscale back to the main settings to use them). Post-processing effects may look wrong because scaling can be non-integer.

### PSone Classics on PSTV (advanced)
- Sharpscale: Scaling Mode **Real**, PS1 Ratio **Pixel**, Scaling Algorithm **Point**. Profiles are in `\profile\Sony PSTV\MrMoro + Sharpscale\`.
- PS1 games use one of **10 internal resolutions**, but the RT4K can only scale one correctly at a time on the PSTV. Use these profiles for single-resolution games, or accept that some scenes will scale wrong.
- Simpler option: turn Sharpscale off and leave the PSTV at 720p. The image is softer, but the aspect ratio is always right.

---

## Sony PlayStation 4

- **Connections:** HDMI only. **[6X]** On the 6X CE, use a VGA or component DAC.
- **HDCP:** turn it off in the PS4 settings. Non-game apps need HDCP on, so either live with that or use an external HDCP stripper.
- **Resolution:** every output mode on the base PS4 and PS4 Slim works. The **PS4 Pro's 2160p does NOT work** (black screen), and the Pro has no 480p mode.

## Sony PlayStation 5

- **Connections:** HDMI only. **[6X]** On the 6X CE, use a VGA or component DAC.
- **HDCP:** turn it off. Non-game apps need it on, so the same tradeoff or an external stripper applies.
- **Resolution:** only **1080p, 1080i or 720p** work. **1440p and 2160p do NOT work** with the RT4K.

---

## Microsoft Xbox (original)

- **Preferred output:** YPbPr. Up to 720p is available with custom firmware.
- **XboxHDMI / XboxHD+ (basic, no Stellar) settings:**
  - System Settings: Video Modes enable all of 480p, 720p and 1080i; Aspect Ratio Widescreen (or Normal for 4:3).
  - Video Settings:
    - Target Resolution (Upscale) **480P**.
    - 4:3 Widescreen **Auto** (allows widescreen games; also set the aspect ratio in the RT4K scaling menu). Use Never for 4:3 only.
    - Pre-scale 480p Correction **Disable** (grey).
    - Assume 16:9 480p(HD) **Disable** (grey).
  - Advanced Settings:
    - HDMI Colorspace YCBCR/RGB. It doesn't matter: a bug makes it always output YCbCr 444.
    - Upscaling Interpolation **Bilinear**.
    - Auto Video Blanking **Enable**; Auto Region Switching **Enable** (green).
    - Advance Interpolation: X & Y Scale Bilinear, X & Y Weight Round.

## Microsoft Xbox 360

- **Connections:** 2007 and later models have HDMI; use it first. Early models are A/V only, but 360 component is sharp (unlike PS3 or Wii U component) and a good alternative. A/V was standard on most models except the 360 E.
- **HDMI settings** (safe for the default RT4K profile; the wiki notes Reference Levels and Color Space are debated):
  - HDTV Settings: **720p**. Most games are native 720p, and 1080p makes the 360 upscale and soften.
  - Reference Levels: **Standard** (RGB Limited, the default) or **Expanded** (RGB Full). Expanded **requires** setting the RT4K to Advanced Settings > Acquisition > HDMI Receiver > Colorspace > Input Range > **RGB Full**, because the 360 always flags Limited.
  - HDMI Color Space: **Source**.

---

## NEO GEO MVS / AES

**Sampling**, RGB/Component ADC Setup:

| Setting | Value |
|---|---|
| Samples per Line | 3840 (3222 Act.) |
| Decimation Factor | 10 (384.000) |

**Settings & tips**
- Output is always **320x240p**. SNK told developers to keep the action in the middle **304 px** and treat 16 px as overscan, and the BIOS can draw 8 px pillarboxes on each side. Not every game follows this (SNK's own included). Crop manually in the RT4K scaling settings if you want; a game list is linked from the wiki (Patreon post).
- **Sync problems:** firmware **v1.0.8** added **"Wide Tolerance"** to RGB/Component ADC Setup. Update to 1.0.8 or later and turn it on.

---

## TurboGrafx-16 / PC Engine

**Sampling** (NTSC), Sample Rate Detection:

| Setting | Value |
|---|---|
| Auto Dec. Factor | On |
| Auto Dec. Phase | Auto |
| ADC Sample Rate | 2730 dots/line |
| Enable | 341.250, 455.000, 682.500 |

**Profiles:** `profile\NEC SuperGrafx\_Start Here - SCART_RGBS.rt4`

---

## PixelFX GEM / HDMI-modded consoles (PS1, PS2, N64)

HDMI input only, so **[6X]** this doesn't apply to the 6X CE. Some HDMI switches, splitters and AVRs don't pass the DV1 metadata; if you have problems, connect the console directly.

- **Enable Direct Video** (tested with FX firmware 3.7.30.13 and RT4K firmware 1.47; should apply to every GEM, basic included): in the GEM OSD, Video > Direct Mode > Video Output = **DV1-Direct Mode**. In Shift/Crop, set every shift value to 0 and crop off/0. Save.
- **PS1** (also tested up to 3.11.137): Video Shift/Crop > **Horiz. Auto Adjust: On**. This fixes shaky 480i in DV1 mode.
- **PS2** (System > PS2Digital Settings):
  - Extended Input Width: **Disabled**.
  - Horiz. Auto Detect: **normal**.
  - Audio Mode: **I2S** or **S/PDIF**. I2S plays copy-protected audio (e.g. Parappa 2) and Dolby Pro Logic II, but not DTS or Dolby Digital. S/PDIF does DTS, DD and PL2, but protected games are silent.
- **N64** (System > N64Digital Settings): **Deblur: on**.

---

## Commodore 64

**Sampling** (for Enhanced S-Video **[Pro only]**), RGB/Component ADC Setup:

| Setting | PAL | NTSC |
|---|---|---|
| Samples per Line | 2016 (1680 Act) | 3070 (2576 Act) |
| Decimation Factor | 4 (504.000) | 6 (511.667) |
| Anti-Alias LPF | 9 MHz (Strong) | 9 MHz (Strong) |

**Connections**
- The C64 outputs Y/C. With an adapter cable it plugs into any regular S-Video input.
- Enhanced S-Video is only available through an HD-15 adapter: not on the front port, and not on the CE. On a stock machine it helps only a little, because the image is soft. Internal mods such as ClearVideo64 (built into the Evo64 board) can give very good results.

**Settings & tips**
- **Phase:** auto gain (RGB/Component ADC Setup) should work, but auto phase may not, so set it by hand. Type `POKE 53280,0` and `POKE 53281,0` (black background), press CTRL+2 for white text, and fill a line with `IIII...` from edge to edge. Adjust Decimation Phase and Sub-Phase. The center stroke of `I` should be **2 px wide**. If it looks 1 px wide with a hazy edge, you're well out of phase, or the cable or a stock machine is softening the image too much.
- **Chroma Shift** (SDP Decoder Setup): adjust it until color lines up with pixel edges. Colored text (e.g. yellow on black) makes misalignment easy to see. The Chroma value in the same menu is to taste. Brightness, Contrast and IRE are ignored when Enhanced S-Video is on.

---

## MiSTer (MiSTer FPGA and MiSTer Pi)

**Connections**
- HDMI by default. An optional Analog I/O board adds analog output.
- **[6X]** The 6X CE has no HDMI input, so use an Analog I/O board with it.

**Setup:** update the MiSTer firmware and all cores. The wiki says to **replace all of `MiSTer.ini`** (SD card root) with its full recommended file; back up your old file first. That file sends each core's native resolution over HDMI with Direct Video, and also outputs RGBS on the analog board. Changing other settings may cause unexpected behavior. The key non-default and important lines under `[MiSTer]`:

```ini
[MiSTer]
direct_video=1        ; core timing over HDMI (DV1)
vga_mode=rgb
composite_sync=1      ; csync on HSync of VGA output
forced_scandoubler=0
vga_scaler=0
vga_sog=0
vscale_mode=0
vscale_border=0
hdmi_limited=0
hdmi_audio_96k=0
hdr=0
fb_size=0
menu_pal=0
vsync_adjust=0
refresh_min=0
refresh_max=0
video_info=0
;video_mode=0         ; left commented (MiSTer auto-detects the display's mode)
;dvi_mode=0           ; left commented
vrr_mode=0
video_brightness=50
video_contrast=50
video_saturation=100
video_hue=0
video_gain_offset=1,0,1,0,1,0
hdr_max_nits=1000
hdr_avg_nits=250
```

The rest of the file is stock non-video options: key_menu_as_rgui=0, ntsc_mode=0, keyrah_mode=0x18d80002, rbf_hide_datecode=0, fb_terminal=1, osd_timeout=30, video_off=0, osd_rotate=0, recents=0, bootcore_timeout=10, font=font/myfont.pf, reset_combo=0, controller_info=6, jamma_vid=0x04D8, jamma_pid=0xF3AD, jamma2_vid=0x1111, jamma2_pid=0x2222, sniper_mode=0, logo=1, shared_folder= (empty), gamepad_defaults=0, log_file_entry=0, bt_auto_disconnect=0, bt_reset_before_pair=0, vrr_min_framerate=0, vrr_max_framerate=0, vrr_vesa_framerate=0, disable_autofire=0, controller_unique_mapping=0, osd_lock_time=5. Everything else is commented out.
**Note:** one comment line in the source file (an example `[video=WIDTHxHEIGHT@VREFRESH]` override header) was mangled by Cloudflare e-mail obfuscation in the archived page, and the original text is unrecoverable.

**Verification:** in the MiSTer menu, press Left to reach **Misc. Options > Information**. The top resolution shown is the core's output. Press **STAT** on the RT4K remote: `Detected Mode` and the `V=` part of `Freq` should match it.

### HDMI + Direct Video (DV1) (RT4K and 6X Pro only; **[6X]** not on the 6X CE)
- DV1 sends the core's native resolution plus metadata in the HDMI InfoFrame, and the RetroTINK configures itself from it. Behavior is defined per core. These features are on by default, so you usually need no profiles or manual tweaks:
  - **Auto-Decimate – InfoFrame:** the MiSTer sends the decimation value.
  - **Auto-Decimate – Measure:** the RetroTINK estimates it from the image.
  - Auto-Decimate isn't instant. When a game changes horizontal resolution live, expect brief artifacts while it catches up. This is normal and works differently from Automatic Sample Rate Detection.
  - **Auto-Crop:** the MiSTer sends crop info.
  - **Auto-RoTATE** **[Pro only]:** rotation info is applied automatically.
  - **Target Decimate:** for CRT-simulation profiles, use it with Auto Decimate to raise horizontal pixel density so effects look better. It may also lag behind resolution changes.
- **Menu core:** the menu doesn't send correct crop info. For best compatibility across cores, add:
  ```ini
  [menu]
  direct_video=0
  ```
  To make the menu display correctly in DV1 instead, use these RT4K settings (they conflict with every other core): HDMI Receiver Setup > Auto-Crop **Off**; Scaling/Crop Setup Top Trim **-12**, Bottom Trim **-2**, Left Trim **-67**, Right Trim **-24**, Aspect Correction **16:9 (PAR)**.
- **Cores without DV1 support:** turn off direct_video for that core. MiSTer then uses its own scaler, so set the output mode to exactly match each core resolution, by hand, one resolution at a time. Also set **`vsync_adjust=2`** under `[MiSTer]`, or these cores may stutter.
  - **AO486:** in the core, Audio & Video > Aspect ratio: Full Screen, VSync: Variable. In MiSTer.ini, add an `[ao486]` section with `forced_scandoubler=0`, `vga_scaler=1`, `direct_video=0`. For each resolution, add a block `[video=WxH]` with `vscale_mode=1` and `video_mode=W,H,60`. Resolutions listed: 320x200, 640x200, 320x350, 640x350, 720x350, 320x400, 640x400, 720x400, 640x480, 800x600, 1024x768. The list isn't exhaustive; add any other resolution your software uses.
  - **X68000:** in the core, Aspect ratio: Full Screen, Video Frequency: Original. Add an `[X68000]` section with the same three lines, and the same per-resolution blocks for 256x240, 256x256, 512x240, 512x256, 512x512, 640x480, 768x512, 1024x1024.
  - Example block:
    ```ini
    [video=320x200]
    vscale_mode=1
    video_mode=320,200,60
    ```

### Analog output
- **RGBS:** with the provided ini, it comes out of the VGA connector or the 10-pin Saturn-style port. No further setup on the MiSTer or RT4K.
- **YPbPr** (HDMI to the RT4K while YPbPr goes to another display): set `direct_video=1`, `composite_sync=1`, `vga_mode=ypbpr` in the ini, and turn on the **SoG switch** on the Analog I/O board. On the RT4K, press **ADC** and set Input Range to **YCbCr 709**.

### Profiles
- Community DV1 profiles: TheJesusFish's Retrotink-DV1-Profile-Repository on GitHub.
- **HDMI + DV1:** no profiles needed for a sharp, accurate picture. Some cores need small crop tweaks, which you can save as profiles and load with **Auto Load DV1** (see the main wiki for naming and placement). A DV1 profile can also load an analog profile once, but only while the HDMI input is active. The HDMI receiver is off on analog inputs, so switch back to HDMI and confirm Auto Load DV1 is enabled.
- **Analog:** the RT4K treats the signal like original hardware, so console profiles work. Most weren't made with MiSTer in mind, though, so results vary, especially when mixing DV1 HDMI behavior with analog output.

---

## Analogue Super NT / Mega SG

- **Analog via the Analogue DAC:** outputs the same analog signal as the console being emulated.
- **HDMI with A/DAC emulation:** the wiki says this excludes the "RetroTINK-6X Pro" because it lacks HDMI input (sic: elsewhere the model without HDMI is the 6X CE). The DAC mode forces 240p, original timings, and no console-side buffering. The RT4K can imitate the DAC over HDMI, so you keep the digital sharpness.
  1. Open HDMI Receiver > **A/DAC** and set Enable to the region of your games.
  2. Power the console on **after** enabling it. Turning it on first causes erratic behavior.
  3. Optional: turn Auto-Decimate off if you want to fine-tune sharpness by hand.
- **If A/DAC won't activate:** update the RT4K and the Analogue console to their latest firmware, and remove any HDMI switches or splitters between them.

---

## Analogue Pocket + Dock

- Don't use the Pocket's built-in CRT filters with RT4K profiles or scaling. If you want the built-in effects, leave the RT4K on default settings.
- **Connections:** the Dock outputs HDMI only, and A/DAC isn't supported. The Dock **always triple-buffers**, and there's no way around it. **[6X]** On the 6X CE, use an HDMI DAC.
- **Original carts (Pocket OS):** Home > Settings > Pocket > Systems > (system) > Reset to Defaults, then Video > Size/Position > choose the **Scale** option (second from last). Repeat for each system. For maximum sharpness, set Prescale to the number shown next to "Scale" and match HDMI input decimation to it.
- **OpenFPGA cores tested by Mr. Moro:**
  - NES: agg23 1.0.1, Spiritualized 1.0.2. SNES: agg23 0.4.4.
  - Genesis: Spiritualized 1.0.8, ericlewis 0.4.2.
  - PC Engine: agg23 1.0.1. PCE CD: Mazamars312 0.2.3.
  - CPS1/1.5/2: Jotego. Neo Geo: Mazamars312 0.8.1.
  - GB: Spiritualized 1.3.0, budude2 1.3.3. GBC: Spiritualized 1.3.0, budude 1.3.3.
  - GBA: Spiritualized 1.2.0. Game Gear: Spiritualized 1.2.0.
  - WonderSwan Color: agg23 1.0.1.
- For each core: Home > Core Settings > Reset All to Default; Display Mode > Reset to Defaults; Mode Settings > Size > **Integer**.
  - GBC budude2: also uncheck Core Settings > "Original Colors".
  - Neo Geo: also turn on Core Settings > **320/304 H Video Output**.
- **Profiles:** for the sharpest picture, `\profile\Analogue Pocket\MrMoro Handhelds HDMI\` or `\profile\Analogue Pocket\MrMoro Sharp 10x DAR HDMI\`. These also work on a 6X CE with a DAC. Other scanline profiles in `\profile\Analogue Pocket\` may not. Profiles are per core, so don't pair a core with another core's profile. The OpenFPGA profiles assume 240p; for 480i games, adjust prescale and scaling.

### Analogizer
- An add-on that gives the Pocket single-buffered analog video matching the emulated console. Only with supported OpenFPGA cores (updated for it), not original carts.
- **Connections:** a plain VGA cable from its HD-15 port to the RetroTINK's VGA input. Audio comes only from the Pocket's bottom audio port.
- **Profiles:** at 15 kHz, use the profiles for the console being emulated. For the GBC core, use `\profile\MiSTer\MrMoro Mister Profiles\GBC.rt4`. The wiki lists NES, Super NES, Genesis/Mega Drive and PCEngine/PCEngine CD/TurboGrafx-16 here without paths.
