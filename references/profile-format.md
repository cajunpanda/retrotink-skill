# .rt4 profile format: what is known

Read this when editing profiles at the byte level, interpreting a `profile diff`, or when a setting the
user mentions isn't in `profile find`.

## Layout
- 128-byte header: `RT4K Profile` magic at 0x00, **CRC-16/XMODEM of the body at 0x20** (little-endian).
  The RetroTINK rejects a profile whose CRC is wrong; every write through `rtink` recomputes it.
- Body: the settings as the unit runs them. It is 22,876 bytes on firmware 1.92 through 1.99 (struct ver
  109), and the same for 4K Pro, 4K CE and 6X. All offsets below are **body** offsets (file offset − 128).
- A 0-byte or tiny `~----Game_Profiles----.rt4` file in Wobbling Pixels packs is a menu separator, not a
  broken profile.

## The settings map
- `vendor/cruller/rt4k_settings.json` (from Cruller) names 172 settings: offsets, sizes and the values
  the OSD shows. It was read off a 4K **Pro** on firmware 1.92. The CE uses the same layout. Some
  settings exist only on one model:
  - Pro only: Horizontal Blur, Smoothing (xBR), CRT Beam BFI, Motion Adaptive tuning, Film Mode,
    Enhanced S-Video, RoTATE.
  - Not in the map at all: e.g. Red Bleed, if a model has it.
- Bytes the map doesn't name are **preserved** on write. `profile diff` counts them as "other bytes".
- **Per input mode** settings exist once per detected input mode (128 slots): crop/trims, scaling mode,
  factors, kernels, ADC sampling, gain/offset, phase, LPF. Useful mode numbers:
  0 No Signal, 1 480i, 2 240p, 3 576i, 4 288p, 5 480p, 6 576p, 8 1080i, 96–99 SDP (S-Video/composite
  decoder) 240p/480i/288p/576i, 100–119 HDMI, 120–124 MiSTer DV1. Use `--mode N` or `--all-modes`.
- **Per detected rate**: with Sample Rate Detection on, trims, scaling and Sub-Phase are kept per detected
  horizontal resolution. There are 32 slots, 4 groups (240p, 480i, 288p, 576i) × divisors 1/10, 1/8,
  1/7, 1/6, 1/5, 1/4. Example on the SNES (3,410 samples/line): 1/10 is 256-wide, 1/5 is 512-wide
  hi-res. Use `--slot N` (group×8 + divisor index).
- **Per audio port** settings: 8 slots (`--port N`).

## Unmapped regions learned in practice
| Body offset | What | Notes |
|---|---|---|
| 0x0c | Mask Enable (mapped) | Off / Multiply / Spatial Redist. |
| **0x10–0x21f** | **Mask bitmap path**, NUL-terminated, relative to `/mask` | `profile mask` reads and writes it |
| 0x220 | Mask Strength (mapped) | |
| 0x224 / 0x22c | Red / Blue Convergence (mapped) | |
| 0x0c–0x22f | The whole mask + convergence block | `copy-bytes … 0x0c-0x230` copies mask and convergence in one go |
| 0x1bd4 + slot | Sub-Phase per detected-rate slot (1 byte; value × 11.25°) | Mapped as Sub-Phase [rate …] |
| 0x1bf4 + slot | Probably Decimation Phase per rate slot | Changes together with manual and auto phase; not in the map |
| 0x1ef0 | Set to 1 on save by firmware 1.99 | Unknown meaning; carry it when rebuilding |
| 0x2384 (8) | "Saved on device" ID | Changes whenever the unit saves |
| 0x2f0, 0x57ec+ | Live signal / detection state | Rewritten on every save; ignore in diffs |
| ~0xca8–0xcc4 | Scaler factors derived from other settings | Not written directly |

A **hand-tuned blend phase** (Sub-Phase plus the 0x1bf4 bytes for that slot) is the user's calibration
of *their* console and cable. Never overwrite it when rebuilding; graft onto the user's current file.

## Other SD card files
- `profile/prof.map`: remote buttons. 13 slots × 1040 bytes, each a NUL-terminated path relative to
  `/profile`.
  - **Slot N−1 = button N** (confirmed on a 4K CE).
  - Subfolder paths like `SVS/S1_NES.rt4` work.
  - Slot 12 (the 13th) is presumably the power-up profile (unconfirmed).
- `profile/SVS/S<n>_<name>.rt4`: loaded when a Scalable Video Switch (or compatible device) sends "new
  input n" over serial (VGA pins 12/15). This needs **Auto Load SVS = On** in the profile. The first match
  wins. `S0_` loads when all inputs are off. `profile/SVS/auto.svs` (0 bytes) is created by the unit
  itself; leave it.
- `z_keep_cur_input`, `z_keep_cur_res` (1 byte each): the global Load Profile "Keep Cur. Input/Res"
  options. Per the wiki they don't apply to SVS or DV1 auto-loads.
- `modelines/custom1-4.txt`, `inputmodes/input_database.txt`, `mask/`, `csc/`, `image/`: user-editable
  text and bitmaps.
