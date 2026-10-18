# Settings the wiki doesn't document (or documents incompletely)

This file is not from the wiki, unlike the rest of this folder:
- **Options** come from the settings map (`vendor/cruller/rt4k_settings.json`, read off a 4K Pro on
  firmware 1.92). Newer firmware may add values.
- **Behaviour notes** come from hands-on use on a 4K CE (2026-10), marked *observed*, or from reasoning,
  marked *inferred*.

Treat inferred notes as explanations to confirm on screen, not facts. Check `rtink profile find <name>`
for the current option list.

## Processing / Effects
| Setting | Options | Notes |
|---|---|---|
| Scanline › Function | Off, Exponential, Gaussian, Super Gaussian, Linear, Box, **E-Conserve**, LCD Mono 1, LCD Mono 2, LCD BGR, LCD RGB | **E-Conserve** (energy-conserving): beams widen on bright pixels and thin on dark ones, keeping brightness near no-scanlines. Bright detail "blooms" into the gaps (*observed*). Wobbling Pixels uses it in its SDR CRT profiles and Linear/Exponential in HDR ones |
| Scanline › **Beam Spread** | Minimum, Low, Medium, Wide | How far each beam spreads vertically into the gap. This, not the vertical kernel, is the practical vertical-softness control with scanlines on (*observed*). Wide suits a consumer-TV look; Minimum/Low a pro monitor |
| Scanline › Strength | 0–99 | Max width of the dark scanline |
| Modulation | 0–99 | How much darker areas get thicker dark lines |
| Scanline › Input Gain | 0–10 (step 0.01) | Shares its byte with Color Correction › Input Gain: changing one changes the other (*observed* in the map) |
| **Normalize Energy** | Off, On | Compensates the brightness the scanline pattern removes. WP CRT profiles turn it on |
| Mask › **Enable** | Off, **Multiply**, **Spatial Redist.** | Multiply darkens through the mask. Spatial Redist. redistributes energy into the lit mask stripes, so it loses less brightness (*inferred* from the name and *observed* as brighter) |
| Mask › Strength | −10…+10 | 0 neutral, +10 max, −10 = effectively off |
| Mask file | path under `mask/` | Not shown by name in the map. `rtink profile mask` reads and writes it |

## Scaling / Crop
| Setting | Options | Notes |
|---|---|---|
| Scaling Mode (per input mode) | Auto Fill, Proportional, Free-Form, **Auto Fill Int, Auto Fill Int+, Auto Fill Int HV, Auto Fill Int HV+** | "Int" = integer scale factor. WP's "+" profiles use **Int+**, a larger (zoomed) integer step that crops overscan. "HV" presumably applies integer scaling on both axes (*inferred*). Integer vertical scale means scanlines land evenly |
| Vert. Pre-Scale | Off, 1/2 … 1/17, 1/31 | Discards lines from high-line-count sources so scanlines match the original line structure |

Kernels at large scale factors, sharpest to softest (*inferred* from how each works, consistent with
what was *observed*): Nearest > Bilinear Sharp > Bilinear Med. > Lanczos3 > Lanczos2 > Cubic ≈ Bilinear
Std. > Bilinear Soft. With scanlines on and integer vertical scaling, the **vertical kernel has little
visible effect** (*observed*).

## Sample Rate Detection / ADC
| Setting | Options | Notes |
|---|---|---|
| Detection Mode | Generic Console, Saturn, **N64 Auto Deblur** | N64 Auto Deblur is used by WP's N64 "Auto Deblur" sharp profiles. They sharpen 320-native games automatically |
| Auto Dec. Phase | Auto (4), Off | The wiki's console tables write "Yes" for this, meaning **Auto (4)**. Off is required to hand-tune Decimation Phase per detected width, e.g. CE blend profiles |
| Anti-Alias LPF | Auto (Off), 9 MHz (Strong), 16 MHz (Med), 35 MHz (Light), 95 MHz (Min.), Off | CE "Blend" profiles pair 9 MHz with off-centre phase to blend dithering |
| Decimation Factor | Off, 2–17, 64 (the remaining samples per line are shown in brackets) | |
| Per-width storage | — | With detection on, trims, scaling and Sub-Phase are stored per detected horizontal width (e.g. SNES 256 vs 512), and phase must be tuned for each width (*observed*) |

## Output and inputs
| Setting | Options |
|---|---|
| Sync Lock | A. Buffer, Gen, Frame, TBC, Triple Buffer, **VRR**. This is true VRR (firmware 1.92+), not the older HDMI Output › VRR Format flag the wiki describes. See `../tuning-guide.md` |
| Output Resolution | 4K60, 4K50, 1080p60/50/100/120, 1440p60/50/100/120, 480p60, Custom 1–4 |
| BFI Blending Mode | Solid, Alpha, Solid Color, Alpha Color, CRT Beam [Pro only], Variable MPRT |
| Input Source | HDMI; Front/CVBS, Front/YC; RCA/YPbPr, RCA/RGsB, RCA/CVBS; SCART/RGBS, RGsB, YPbPr, CVBS-20, CVBS-G, YC; HD15/RGBHV, RGBS, RGsB, YPbPr, CVBS-H, CVBS-G, YC, YC-Enh [Pro only] |

## Files and behaviour
- `profile/prof.map`: remote buttons. Slot N−1 = button N (*observed*); paths may include subfolders
  such as `SVS/…`. See `../profile-format.md`.
- `profile/SVS/auto.svs`: created by the unit itself (*observed*). Leave it.
- Banners load from `image/`, where the SD pack ships them. The wiki also mentions a `banners/` folder
  in one place.
- `z_keep_cur_input` / `z_keep_cur_res`: 1-byte files holding the Load Profile "Keep Cur. Input/Res"
  options. Per the wiki they don't apply to SVS/DV1 auto-loads.
- The unit rewrites live signal-state bytes on every save, so two saves of "the same" profile differ
  slightly. That's normal.
