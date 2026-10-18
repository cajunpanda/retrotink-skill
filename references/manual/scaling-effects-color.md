Condensed from the ConsoleMods RetroTINK-4K wiki (consolemods.org, CC BY 4.0); paraphrased and reorganized. Live text as of 2026-10-12.

# Scaling, Processing/Effects, Color Correction (RT4K / RT4K CE)

## Quick facts

- **Sharpest kernel**: Nearest Neighbor (fully sharp, but shimmers at non-integer factors). Bilinear Sharp keeps sharp pixels *without* shimmer at non-integer factors. Softest: Bilinear Soft.
- **Sharpness order (soft to sharp)**: Bilinear Soft < Bilinear Std < Bilinear Medium < Bilinear Sharp; Cubic is sharper than bilinear but softer than Lanczos.
- **Scanlines scale with source pixels** (240p lines are thick, 1080p lines thin). **Masks tile 1:1 on the output** and ignore source pixels; lowering output resolution makes masks bigger.
- **Effects look wrong?** The TV is probably not in 4:4:4 chroma: enable Ultra Deep Color / "4:4:4 Pass Through" (LG) or rename the input/icon to PC. Fallback: even integer H and V factors (4.000x, 5.000x).
- **Linear Light in SDR** needs Gamma/PQ Input Factor and Output Factor both set to 2.4 by hand. Enabling HDR, CSC, or Adobe RGB/P3 colorimetry sets Gamma/PQ correctly automatically.
- **PQ (HDR) value** is the tone-map peak in nits (250-10,000); normally your TV's max nits, lower it to dim the HDR picture.
- **No scanline presets in this menu**: CRT presets are profiles on the SD card (Profiles > Load from File > CRT Simulation).
- **Pro-only**: RoTATE, Horizontal Blur (IIR LPF/HPF), Smoothing (xBR). CE lacks all three.
- By default the RT4K sizes and centers the image from the crop (unlike the 5X); Scaling Mode overrides this.

---

## Scaling / Crop Setup

### Input Crop
- **Top Trim / Bottom Trim**: effectively scale the image up/down in most Scaling Modes. Tip: set Scaling Mode to Auto Fill Integer to see the top/bottom edges easily.
- **Left Trim / Right Trim**: control centering (the RT4K auto-centers from them). To shift the image, raise the trim on the side opposite to the direction you want it to move.

### Vertical Pre-Scale
- Discards scanlines at a fractional step of the source, losing vertical resolution. Useful for more accurate scanlines on 240p content that a console outputs at a higher resolution (e.g. Dreamcast, Wii).

### RoTATE **[Pro only]**
- Rotates the picture 90 degrees right (clockwise) or left (counterclockwise); for vertical (tate) games such as arcade shooters.
- Requirements: source under **1024 samples per line** (shown in RGB/Component ADC menu) and **240p, 288p or 360p** only (matters for games that mix in 480i).
  - Composite/S-Video are fixed at 858 samples/line: no tweaking needed.
  - RGB/YPbPr: use ADC sampling/decimation settings to get under 1024.
  - HDMI: use Input Decimation in the HDMI Receiver menu if over 1024 (e.g. MiSTer cores with pixel repetition).

### Auto Crop (remote AUX buttons)
Works with RGB, Component and HDMI. Finds the black edges of the game image, so feed it a screen with clear edges. Avoid dark-edged, letterboxed, pillarboxed or windowboxed screens (they produce a wrong crop).

| Mode | Button | Effect |
|---|---|---|
| Vertical Only | AUX 1 | Sets Top/Bottom Trim only; Left/Right Trim and Aspect Correction untouched |
| Full Crop to 4:3 | AUX 2 | Sets all four trims; Aspect Correction -> 4:3 (PAR) |
| Full Crop to 16:9 | AUX 3 | Sets all four trims; Aspect Correction -> 16:9 (PAR) |

### Aspect Correction (Scaler)
Picks the Pixel Aspect Ratio (PAR) so the image matches the Display Aspect Ratio (DAR) the game expects.
- Only adjustable for variable-PAR inputs (240p, 288p, 480i/p, 576i/p). Other resolutions lock to their expected PAR (e.g. PS3 720p component locks to 1:1; PS3 480p HDMI stays selectable). When locked, use the Scaling Factors instead.

| Setting | Meaning | Use for |
|---|---|---|
| **4:3 (PAR)** | Pixels slightly wider/narrower than square depending on input res | Pre-HDMI consoles meant for 4:3 CRTs |
| **16:9 (PAR)** | Pixels wider still | Widescreen modes of pre-HDMI systems (PS2, Wii) |
| **1:1 (Sq. Pixel)** | Square pixels | Sub-HD sources expecting 1:1, e.g. PSP, Game Boy via Super Game Boy / Game Boy Player |

Set the source device's own aspect option to match.

### Scaling Mode
- **Auto Fill**: fills the screen at the Aspect Correction ratio.
- **Proportional**: unlocks Vert. Factor; Hori. Factor follows automatically to keep the aspect ratio.
- **Free-Form**: unlocks both Vert. and Hori. Factor independently of Aspect Correction (5X-style free transform).
- **Auto Fill Integer**: largest integer V and H factors that fit the screen while respecting the aspect ratio. Crop tightly to get the biggest picture.
- (The source describes only these four modes; no other Int+/HV variants are documented there.)

### Scaling Factors (Horizontal / Vertical Factor)
- Show multiplier, input res and output res: *input x multiplier = output*. Example: Vert 9.000 x 240 = 2160; Hori 2.045 x 1440 = 2945.
- Availability depends on Scaling Mode (Proportional: Vert only; Free-Form: both).

### Buffer Length
Together with Sync Lock mode, the main driver of latency.
- **Min. Lag**: buffers only the minimum lines; lowest latency, usually compatible.
- **1/2 Frame** / **1 Frame**: try these if you see tearing.
- Some movie modes (e.g. Inverse Telecine) force a 1-frame buffer.

### Blank Resolution Change
- On/Off. Inserts a black frame on resolution changes to hide glitches; helps 480i/240p-switching games (e.g. PS1 Chrono Cross, Silent Hill).

### Masking Color
- Color of the crop-menu mask overlay. Default R 0, G 0, B 31. Can show in the crop menu only, or always (even with the menu closed).

---

## Processing / Effects Setup

### Scanline presets (where they went)
- Stored as SD-card profiles: Profiles > Load from File > CRT Simulation.
- Generic sampling is fine for CRT looks (real CRTs, even PVM/BVM, are a bit soft). For decimated digital sources (NSO, HDMI-modded consoles) add softness with the Horizontal Interpolation Kernel and/or Horizontal Blur [Pro].
- Exception: **LCD scanlines** need a flat integer scale (e.g. 4.000x, 5.000x) for the pixel grid lines to render correctly.
- **RT5X equivalents**: profiles in `\profile\_CRT Emulation\Basic HDR CRT\` on the SD card are the analogues of 5X presets (the mapping table is still "Pending" on the wiki).
- **Pro vs CE profiles**: only differ when the profile uses IIR LPF (Pro-only). Compared profiles include Hi-Res Slot Mask, BVM 1000, PVM-600, Consumer Trinitron, Consumer Slot Mask, LCD Mono, JVC D-Series-D200, JVC TM-H150CG, JVC TM-H1950CG, Sony KV-FV310, Sony PVM 20L5, Toshiba AF44, AG Coarse/Dense/RYB/YMC, Mono Dense/Medium, Slot Coarse/Dense/Medium, Triad Coarse/Dense.

### Interpolation: Vertical and Horizontal Kernel
Set independently per axis. Interpolation smooths the picture and reduces shimmer while scrolling.
- **Nearest Neighbor**: fully sharp pixels; shimmers at non-integer factors.
- **Bilinear Sharp**: NN up to the largest integer that fits, then bilinear to final size (no bilinear if already an exact integer). Sharp pixels, no shimmer at non-integer factors.
- **Bilinear Medium**: NN up to the largest integer <= (output pixels / 2), then bilinear. Softer than Sharp, sharper than Std.
- **Bilinear Std**: conventional bilinear.
- **Bilinear Soft**: linear interpolation over 4 pixels instead of 2; very soft. Can supply horizontal blur for CRT looks.
- **Cubic**: bicubic spline; sharper than bilinear, softer than Lanczos.
- **Lanczos2 / Lanczos3**: good for natural imagery (movies) and most 3D games.

**Anti-Ringing**: On/Off, default **On**; only acts with Lanczos2/Lanczos3; reduces ringing artifacts.

**Linear Light**: may give more accurate scaling/blending; also changes how scanlines look (subjective).
- **On**: inverse gamma at the start of the scaler; all processing in linear light; output gamma-encoded (SDR) or PQ-encoded (HDR).
- **Off**: processing in the gamma domain; inverse gamma only at the output if needed for gamut transforms.
- SDR defaults: set Input Factor and Output Factor to **2.4** manually (Color Correction > Gamma/PQ). HDR (HDMI Output > Transmitter), CSC (Color Correction > Color Space Conversion) or Adobe RGB/P3 (HDMI Output > Colorimetry) adjust Gamma/PQ automatically.

### Scanlines
Scanlines follow the source's pixel grid (like a CRT's beam), so they get thinner as input resolution rises. On a CRT every drawn line is a scanline; 240p uses only every other line, leaving the visible dark gaps. Full CRT/LCD simulation also depends on scaling, ADC sampling, interpolation and color correction: start from a bundled profile if unsure.

**Function (Blank / Black Scanlines)**: shape of the bright-to-dark transition.
- **Off**: generator disabled; other scanline settings do nothing.
- **Exponential**: softest falloff.
- **Gaussian**: like Exponential but sharper transition.
- **Super Gaussian**: very sharp transition.
- **Linear**: straight ramp.
- **Box**: hard on/off, old-emulator style.

**Parameters**
- **Strength**: maximum width of the scanline effect.
- **Modulation**: how much thickness varies with brightness; higher = thicker dark lines in dark areas.
- **Pseudo Interlace**: draws scanlines in interlaced order on progressive sources. **2x** (480p -> 960i): no vertical detail lost, thinner lines. **1x** (480p -> 480i): thicker lines, loses half the vertical resolution.
- Beam Spread, Input Gain (scanline) and Normalize Energy are **not described** in this source section.
- Interlaced inputs: set Deinterlacer/Film > Algorithm to **CRT Simulation** so lines alternate each frame like a real CRT.

### LCD Effects (scanline Function options)
- **LCD Mono**: 1x1 pixel border around every upscaled pixel.
- **LCD RGB**: simulates RGB subpixels per upscaled pixel.
- With an LCD function, Strength becomes **LCD Subpixel Str.** and Modulation becomes **LCD Vert Str.** (values carry over). Both only affect **LCD RGB**.
  - **LCD Subpixel Str.**: subpixel mask strength; lower = subpixels tinted more toward the pixel's color.
  - **LCD Vertical Str.**: size of the horizontal line under each pixel.

### Color Bleed / Convergence
Require a (non-LCD) scanline function to be enabled.
- **Red Bleed**: red beam softer/less focused than green and blue (common on CRTs, especially Trinitrons).
- **Red Convergence**: vertical offset of red within the scanline; -10 to +10.
- **Blue Convergence**: vertical offset of blue within the scanline; -10 to +10.

### Masks
Emulate shadow masks / aperture grilles / slot masks. Like a real CRT's metal mask, they're independent of the image and do **not** follow source pixels: a mask image is tiled 1:1 over the whole output, so a lower output resolution gives larger masks.
- **Enable**: Off / On. (Other enable modes such as Multiply or Spatial Redist. are not described in this source.)
- **Strength**: -10 to +10; **+0 = neutral**, **+10 = maximum**, **-10 = same as masks off**.
- **Load from File**: opens the SD card `masks` folder. Custom masks can be made (covered in the wiki's Custom CRT Masks section).

### Horizontal Blur **[Pro only]**
- **Function**: Off / **IIR LPF** (adds left-to-right CRT-style smear, like a 3-chip SNES) / **IIR HPF** (reduces smear; can make a 3-chip SNES look closer to a 1CHIP, with more visible noise).
- **Cut-Off Freq**: blur strength.
- For conventional blur, use the Interpolation Kernels instead.

### Smoothing **[Pro only]**
xBR-style edge interpolation; meant for 2D but can reduce aliasing in 3D.
- **Algorithm**: Off / XBR Level 1 / XBR Level 2.
- **Noise Threshold**: Off / Low / Medium / High.

---

## Color Correction Setup

**Apply Preset** quickly loads Color Correction (CSC) profiles from the SD card (many ship on the 1.0 card), e.g. `csc/Game Boy Interface/Game Boy Advance.txt`.

### Gamma and PQ
Input controls convert incoming RGB from gamma space to linear light.

| Setting | Meaning | Range | Mode |
|---|---|---|---|
| **Input Factor** | Inverse gamma exponent for input -> linear light | 0.10-5.00 | both |
| **Input Lift** | Offset; raises/lowers black level | -1.00 to 1.00 | both |
| **Input Gain** | Multiplies the input gamma conversion's output | 0.00-10.00 | both |
| **Output Factor** | Re-encodes linear light back to gamma | 0.10-5.00 | SDR only |
| **SMPTE 2084 PQ** (wiki text spells it "2048") | Perceptual-quantizer tone-map peak brightness in nits; normally your TV's max nits; lower to dim HDR | 250-10,000 | HDR only |

### Color Space Conversion
- **Apply Preset**: opens Load CSC Matrix to load saved CSC profiles (e.g. gamut correction to emulate a PVM).
- **Custom Matrix**: On/Off; enables/disables CSC (the Input RGB to XYZ matrix plus its Gamma/PQ settings).
- **Prevent Clipping**: On/Off; auto-scales the CSC matrix so highlights aren't lost, at the cost of a dimmer image.
- **Saturation**: -1.0 to +1.0; lower toward black-and-white, higher for more intense color.

### Input RGB to XYZ
- Manually edit the input RGB -> XYZ matrix; each coefficient -1.75000 to +1.75000. The RT4K chains the correct XYZ -> output RGB for the chosen output colorimetry (BT709, BT2020, Adobe RGB, etc.).

### Advanced Controls
- **Transfer Function**: sRGB 0.055 / Rec.601/709 0.099 / SMPTE 240M 0.1115 / Gamma. The named curves linearize the low end to avoid bit loss; Gamma is plain gamma encoding.
- **Bit Crush**: reduces bits per color. Mainly to remove rounding errors in the source (e.g. GBI) and sometimes noise; also usable for a posterized/limited-color look.
- **Dithering**: On/Off; adds imperceptible random noise to the HDMI output to prevent 8-bit banding, approximating 10-bit deep color.
