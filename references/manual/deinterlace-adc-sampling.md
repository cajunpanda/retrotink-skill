Condensed from the ConsoleMods RetroTINK-4K wiki (consolemods.org, CC BY 4.0); paraphrased and reorganized. Live text as of 2026-10-12.

# Deinterlacer, Film Mode, Acquisition (HDMI Rx / ADC / Sample Rate Detection / SDP / Audio)

## Quick facts
- Deinterlacer modes act on interlaced input; the exception is **LCD Blending**, which also blends progressive frames. Tip: pause on a frame with motion while tuning.
- **CRT Simulation** looks identical to Bob unless Scanlines are on, and it only displays correctly when output frame rate equals input rate (PAL 50 Hz into a 60 Hz output is wrong).
- **Smooth I/P Switch**: 240p uses the 480i settings (and the menu reports it as 480i). 240p scanlines in this mode need CRT Simulation.
- CE has Motion Adaptive deinterlacing, but its tuning (Motion Adaptive Settings), Film Mode/inverse telecine, 3D comb and Enhanced S-Video are **[Pro only]**.
- **Auto Phase** picks the Decimation Phase + Sub-Phase that give the sharpest picture. Run it 3-5 times and check that it lands on the same values each time.
- **Auto Gain** needs a 100% white patch (RGB / Enhanced S-Video) or 100% SMPTE color bars (YPbPr). Run it separately for each resolution and each physical console.
- **Sample Rate Detection**: set the console's master ADC Sample Rate and turn on Auto Dec. Factor + Phase. The unit then switches to a separate set of settings whenever it detects one of the enabled horizontal resolutions.
- The ADC button on the remote opens the menu for the active input: HDMI Receiver, RGB/Component ADC, or SDP Decoder (composite/S-Video).

## Deinterlacer: Mode
| Mode | Behavior |
|---|---|
| **Motion Adaptive** | Bob for areas that change, Weave for areas that stay still. Tunable on Pro only. |
| **Weave** | Interleaves the current field with the next one (same as "disabled" in VLC). Shows combing. |
| **Bob** | Line-doubles each field to full height. Keeps temporal resolution but the image bobs up and down. |
| **Linear** | Interpolated Bob: each missing line is the average of the lines above and below. |
| **Blend** | Averages lines from the two most recent fields. Causes ghosting. |
| **CRT Simulation** | Bob plus 15 kHz CRT interlaced scanline behavior: each field draws 240 lines, and the alternate lines go black. |
| **LCD Blending** | Progressive: averages the current and previous frame, which blends flicker-based transparency. Interlaced: averages the current field with the previous field of the same parity, which removes NTSC composite artifacts on a fully still picture. Not recommended for gaming. |

**CRT Simulation caveats**
- It needs a Scanline effect (Processing / Effects) and interlaced content, or it looks the same as Bob.
- Crop settings display incorrectly in this mode, so expect to redo the crop after enabling it.
- Output frame rate **must** match input frame rate. PAL 50 fps content needs a 50 Hz output; the default 60 Hz output breaks the effect.

**Smooth I/P Switch**: processes input the way a 15 kHz CRT does, which minimizes glitches when the source switches between 240p and 480i. 240p shares the 480i settings and appears as 480i in the menu. 240p scanlines require Mode = CRT Simulation.

**Field Inversion**: inverts the field processing order for interlaced input.

## Motion Adaptive Settings **[Pro only]**
These settings only apply to the Motion Adaptive mode. On CE, MADI runs with no user controls.
- **Sensitivity**: Min / Medium / High / Max. Higher settings weave more in moving areas, and static areas look more stable. Min suits many games; some need Medium or higher (e.g. PS2 *Burnout 3*, whose dithering and flicker confuse MADI on still areas).
- **Noise Threshold**: how much low-level change is ignored, so MADI doesn't fall back to Bob unnecessarily. Helps with noisy or dithered content but adds more weave artifacts. The wiki's Burnout 3 example compares Sensitivity Low with Noise Threshold 0 vs 15 vs 2:2 IVTC.
- **Interpolator**: how the Bob part of MADI is computed. **Linear** is blurry but stable. **Edge Adaptive** detects edges and interpolates sharper pixels along them.
- **Detector**: **Zero-Lag** favors the current field. **Symmetric** favors the previous field and does symmetric motion detection, which may give cleaner results.

## Bob Settings
- **Bob Offset**: the vertical distance between the two fields; -3 to +3. Useful for 240p games badly ported to 480i (e.g. PS2 *Mega Man Anniversary Collection*).

## Film Mode **[Pro only]**
- **Inverse Telecine 3:2**: rebuilds 24 fps from 24 Hz material telecined to 60 Hz, for cinematic playback.
- **Inverse Telecine 2:2**: rebuilds progressive frames from 480i games that hold a steady 30 fps, effectively turning 480i into 480p with more resolution and clarity. Especially useful on PS2, where much of the library is 480i only.
- **Dejudder 24 Hz**: treats telecined material as a virtual 24 Hz source under Gen Lock / Frame Lock Sync Lock. Combined with a 24 Hz output modeline this gives true 24 Hz output; 48/72/120 Hz modelines also work. It only applies once a 3:2 source is detected and deinterlaced.

## Cadence Detection
Controls how content is detected and handed to the inverse telecine functions.
- **Motion Digital / Motion CP / Motion SDP**: noise thresholds for HDMI, component/RGB and composite/S-Video inputs respectively; 0-500. Higher values give fewer false positives but can miss weak or noisy telecine. Lower values catch less stable signals but produce more false readings.
- **Threshold**: once a signal passes the Motion check, this sets how many consecutive telecine-pattern detections are needed before IVTC engages. Raise it for noisy sources such as VHS.

## HDMI Receiver
Does not apply to the RT6X CE, which has no HDMI input. The menu only works when HDMI In is the selected input.

**Input Decimation**: reduces the horizontal resolution of HDMI input by the ratio Input Pixels : Output Pixels. The resulting width is shown in parentheses after Input Pixels.
- **Input Pixels**: the sample width the decimation starts from.
- **Output Pixels**: how many pixels that width is divided into.
- **Initial Phase**: phase offset that decides which pixels are kept and which are dropped.

**Colorspace**
- **4:2:2 Upsampler**: Linear (bilinear, smoother) or Nearest (sharper, more aliasing).
- **Input Range**: Auto (use this unless there's a mismatch), RGB Lim., RGB Full, YCbCr 601, YCbCr 709, xvYCC 601, xvYCC 709, YCbCr 601 (Full), YCbCr 709 (Full). Set it to match the console's output (e.g. Wii U is Limited). It is independent of the output menu's HDMI range.

**MiSTer DV1** (DirectVideo): compatible cores send pixel-accurate video padded with black bars and pixel-multiplied. Padding and multiplication info travels in the HDMI SPD infoframe, so the RT4K can crop and decimate back to the original image.
- **Auto-Decimate**: **Infoframe** (recommended with DV1) uses the infoframe to set the decimation factor. **Measure** guesses the decimation from the image characteristics.
- **Auto-Crop**: On uses the infoframe to crop the black borders.
- **Auto RoTATE**: On rotates the picture in the direction the infoframe specifies; RoTATE is **[Pro only]**. Some cores report the wrong direction. In that case turn this Off and pick the direction in the Scaling menu.
- DV1 input can also trigger profile changes via **Auto Load DV1 Profile**.

**A/DAC Mode**: Analogue consoles that support the Analogue DAC send an unscaled image.
- **Off**: the RT4K appears to the console as a normal HDMI display.
- **NTSC / PAL**: the RT4K appears as an Analogue DAC with the region switch set to NTSC or PAL.
- Caveats:
  - The console outputs 240p with variable horizontal pixel repetition, so the initial horizontal scale is about 4x what you'd expect (2x in SNES 512-column mode). Fix it with Input Decimation and Scaling/Cropping. This behavior may change in future firmware.
  - PAL needs manual aspect-ratio adjustment.
  - Mega Sg needs heavy cropping because of its exaggerated overscan.
  - None of this is handled automatically.
  - Don't change A/DAC mode while the console is on.

**Target Decimate**: changes the auto-decimation used by DV1 and A/DAC. Instead of decimating to the game's native width, you give a target horizontal pixel count and the RT4K picks Output Pixels to get close to it. This keeps horizontal interpolation and IIR blur consistent across cores, which helps with CRT-effect profiles.

## RGB / Component ADC
Covers YPbPr, RGBS, RGsB and RGBHV. The menu only works when an RGB or Component input is active.

### Sampling
- **Samples per Line**: total samples taken per video line. Set it to a multiple of the source's pixels per line so pixel edges align with the samples and the image is sharper. The parentheses show the active (visible) samples.
- **Decimation Factor**: divides Samples per Line (e.g. 1716 / 2 = 858). The parentheses show the samples left after decimation.
- **Decimation Phase**: which of the N sample sets is kept. Factor 3 gives a choice of phase 1, 2 or 3. Disabled when Decimation Factor is off, and also when Auto Dec. Phase is on.
- **Sub-Phase**: fine timing of the sampling instant; 0 to 348.75 degrees in 11.25 degree steps. A calibrated Sub-Phase gives a sharper image. Set it manually or with Auto Phase.
- **Anti-Alias LPF**: low-pass filter on the analog signal before the ADC. It cuts interference but softens the image at stronger settings. Values: Auto (chosen from the sample rate), 9 MHz (Strong), 16 MHz (Med), 35 MHz (Light), 95 MHz (Min.), Off.

### Sync
- **SoG Threshold**: voltage at which the signal is sliced to produce a digital sync pulse. Range 0.00-327.42 mV in 11.29 mV steps. Adjust it for problem sources.
- **Pre-coast / Post-coast**: lines before or after vertical sync during which the RT4K uses internally generated sync instead of the source's; 1-31 lines each. The padding protects horizontal sync from off-spec or glitchy signals around vsync. Adjust these for off-spec sources.
- **Wide Tolerance**: extra sync processing for 240p/288p sources with malformed sync pulses (arcade boards, NEOGEO). Keep it off for normal use, because it can cause artifacts on other systems.

### Gain / Offset
- **Pre-ADC gain**: analog gain before the ADC, acting as a coarse contrast control; -0.7 to +0.8.
- **Red / Green / Blue gain**: per-channel digital gain, acting as a fine contrast control; 1.000-1.996.
- **Red / Green / Blue offset**: per-channel black level / brightness; -100 to +100.

### Auto Calibrate
- **Auto Phase**: chooses the best Decimation Phase and Sub-Phase for the current picture, the sharpest result. It works whether the decimation factor came from Sample Rate Detection or was set by hand. Any game screen works; a patterned screen such as the 240p Test Suite makes the result easier to judge by eye. Run it 3-5 times to confirm the same factors and phases come back.
- **Auto Gain**: works only for RGB, YPbPr and Enhanced S-Video. Enhanced S-Video support arrived in fw 1.2.3; set it by hand on older firmware.
  - Input: RGB and Enhanced S-Video need a 100% white patch on screen (white text or HUD works). YPbPr needs 100% SMPTE color bars. Keep the screen unchanged until it finishes.
  - It sets overall gain and contrast. On RGB it also matches the channels to each other, which removes tint.
  - It picks conservative values to avoid clipping, so you may need to raise individual channels a few ticks to reach RGB 255. The 240p Test Suite is recommended for this.
  - Results don't carry across progressive and interlaced resolutions, so run it per resolution. Run it per console too, even for two units of the same model, because each unit's output has aged differently.

## Sample Rate Detection
Applies to RGB/Component inputs only. Using the console's master sampling rate, the RT4K detects horizontal resolution changes and switches settings seamlessly, setting Decimation Factor and Phase automatically.

**Setup**
1. Set the console's **ADC Sample Rate**.
2. Turn on **Auto Dec. Factor** and **Auto Dec. Phase**.
3. Under Progressive / Interlace Detection, enable each resolution the console actually uses. Leave unused ones off, because extra resolutions slow detection.

**Control**
- **Auto Dec. Factor**: turns Sample Rate Detection on.
- **Auto Dec. Phase**: the RT4K picks the phase itself, which disables Decimation Phase in the ADC menu.
- **Detection Mode**: **Generic Console** covers most systems, which have a fixed video clock. **Saturn** is needed because the Saturn's master video clock is variable.
- **ADC Sample Rate**: the number of samples taken per line (the master rate).

**Progressive Detection / Interlace Detection**: each entry is ADC Sample Rate divided by 10, 8, 7, 6, 5 and 4 in turn. When an entry is enabled and that resolution is detected, the RT4K switches to that resolution's own set of settings.

**Master Sample Rate chart**: decimated samples per line, with active width in parentheses.
| Console | Rate | 1/10 | 1/8 | 1/7 | 1/6 | 1/5 | 1/4 |
|---|---|---|---|---|---|---|---|
| SNES | 3410 | 341.000 (256) | | | | 682.000 (512) | |
| Genesis/MD | 3420 | 342.000 (256) | 427.500 (320) | | | | |
| TG16/PCE | 2730 | | 341.250 (256) | | 455.000 (368) | | 682.500 (512) |
| Saturn NTSC 320+640 | 3416 | | 427.000 (320) | | | | 851.000 (640) |
| Saturn NTSC 352+704 | 3640 | | 455.000 (352) | | | | 910.000 (704) |
| PS1 NTSC | 3413 | 341.300 (256) | 426.625 (320) | 487.571 (384) | | 682.600 (512) | 853.250 (640) |
| PS1 PAL | 3406 | 340.600 (256) | 425.750 (320) | 486.571 (384) | | 681.200 (512) | 851.500 (640) |
| PS2 NTSC | 3432 | 343.200 (256) | 429.000 (320) | 490.286 (384) | | 686.400 (512) | 858.000 (640) |
| PS2 PAL | 3456 | 345.600 (256) | 432.000 (320) | 493.714 (384) | | 691.200 (512) | 864.000 (640) |

Consoles not listed either don't use this feature or are covered on their System Specific Settings page.

## SDP Decoder (Composite / S-Video)
**Gain and Balance**
- **Brightness / Contrast / Chroma (saturation)**: -100 to +100 each.
- **Phase**: tint.
- **Blue Only**: greyscale view of the blue channel (white = full blue).
- **Setup**: 0 or 7.5 IRE.

**2D Processing**
- **2D Y/C Filter**: how composite luma and chroma are separated: 2D Adaptive, 2D Fixed, or Notch.
- **2D Bandwidth**: Low / High. Higher keeps more detail but adds artifacts.
- **Chroma Bandwidth**: low-pass filter on chroma; can reduce rainbowing.
- **PAL Delay Line**: vertical chroma blur, mainly for horizontal color banding on PAL NES. Affects PAL-encoded composite only; on by default.
- **Sharpness**: 0-15 (artificial sharpening).
- **CTIE**: 0-3. Sharpens chroma using luma as a guide.

**3D Processing [Pro only]** (not on CE)
- **3D Comb Enable**: NTSC composite 3D comb Y/C filter. It compares three consecutive fields at the same location. If nothing moves, separation is near S-Video quality; if motion is found, it falls back to 2D comb. This is the same "3D when still, 2D in motion" approach as MADI.
- **Noise Threshold**: Low falls back to 2D quickly. Medium and High bias toward 3D. Default sits between Low and Medium.

**Sync (SDP)**
- **H-Lock Speed**: Auto / Slow / Medium / Fast.
- **Standard**: Auto, NTSC, PAL, SECAM, NTSC-443, PAL-M, PAL-N, PAL-60.

**Enhanced S-Video [Pro only]**: S-Video fed into the HD-15 runs through the SD and high-resolution ADCs at the same time. This gives higher-resolution luma and enables Decimation and Auto Phase on S-Video.
- Enable it at Input Selection > HD15 > Y/C on G/R (Enh.).
- Wire Y to Green and C to Red on the HD-15.
- **Chroma Shift**: horizontal chroma alignment; -100 to +100, default 0.

## Audio Input
**Sampling** (analog audio input only)
- **Sample Rate**: 48 kHz or 96 kHz.
- **Pre-amp Gain**: -24 dB to +28 dB.
- **Pre-amp Balance**: corrects left/right imbalance by raising gain on the side you press.

**Source**
- **Input Override**: forces an alternate audio source: RCA, HD-15, SCART, Front, S/PDIF, or Off.
- **Input Swap**: Mono (left) or Mono (right) sends one channel to both speakers; L/R Swap swaps the channels.

**Surround**
- Dolby Surround encoded in stereo is passed through for the receiver to decode; there is no setting for it.
- Optical input carries compressed surround, which is decoded correctly to the output.
- HDMI LPCM passes through up to 8 channels.
