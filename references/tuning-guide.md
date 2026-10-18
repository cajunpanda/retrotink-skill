# Picture tuning knowledge (CRT look, sampling, deinterlacing)

Read this when a user asks why something looks a certain way, or how to get a look: CRT, blur,
dithering, jitter, brightness, a specific TV. It distils what worked in practice plus the ConsoleMods
wiki. Explain in plain words; most users aren't video engineers.

## Where the look comes from (and which knob matters)
| Look | Controls | Notes |
|---|---|---|
| Horizontal softness | Hori. Kernel, then ADC phase/LPF | At 4K a 256-wide image is stretched ~11× and a 640-wide one ~4.5×, so the same kernel is ~2.5× blurrier on 240p consoles |
| Vertical softness | Scanline Function, Strength, **Beam Spread** | With scanlines on and integer vertical scaling, **Vert. Kernel barely matters**: the beam profile defines the vertical look |
| Dithering blend | ADC Decimation Phase + Sub-Phase (with a strong 9 MHz LPF), or a soft Hori. Kernel | See "blend phase" below |
| Phosphor structure | Mask bitmap + Mask Enable + Strength | The mask tiles 1:1 in output pixels, regardless of source resolution |
| Brightness / "glow" | HDR10, SMPTE 2084 PQ (nits), Normalize Energy, Spatial Redist. mask mode | HDR exists to pay for scanline/mask/BFI dimming |
| Colour fringing | Red/Blue Convergence (vertical offset in the scanline) | ±1 is subtle; beyond ±2 looks like a broken TV. Relatively stronger on 480-line content |

The wiki's dithering tip ("set both kernels to Bilinear Soft") is a **no-scanlines** approach. With
scanlines on, soften horizontally with Hori. Kernel (or phase) and vertically with Beam Spread; the
vertical kernel is mostly hidden by the beam profile.

Kernel sharpness at large scale factors, sharpest to softest (approximate): Nearest > Bilinear Sharp >
Bilinear Med. > Lanczos3 > Lanczos2 > Cubic ≈ Bilinear Std. > Bilinear Soft (blends over 4 source
pixels). Pick **one** source of horizontal softness. Phase blur plus a soft kernel stacks into mush.

## Masks (stripe width at 4K, 4:3 image ~2,880 px wide)
| Mask | Tile | Approx TVL | Resembles |
|---|---|---|---|
| Mono Masks/A Grille Dense Mono | grey+black 2 px | — | PVM/BVM-ish, no colour |
| RGB Masks/A Grille Dense RGB | R G B, 3 px | ~720 | PVM-class |
| **RGB Masks/A Grille RYCB 600TVL** | R Y C B, 4 px | ~540 | **Consumer Trinitron** (Kuro Houou's Sony KV-FV310 profile uses it), bright |
| RGB Masks/A Grille RGBX 600TVL | R G B black, 4 px | ~540 | Consumer Trinitron with visible grille gaps, darker |
| RGB Masks/A Grille Coarse RGB | RR GG BB, 6 px | ~360 | Huge or close-up TV |
| RGB Masks/Slot Mask *, Triad * | | | Slot-mask / shadow-mask (non-Trinitron) TVs |
Trinitron = aperture grille (vertical stripes). Its faint horizontal damper wires can't be simulated.
The "600TVL" in a mask's file name is its author's label. The ~540 figures above are an estimate from the
stripe width at 4K: a 4 px stripe set gives about 720 sets across a 2,880 px wide 4:3 image, which works
out to roughly 540 lines per picture height. Both describe the same consumer-TV density.
**Red Bleed** (red beam softer than green/blue, a Trinitron trait) is listed on the wiki, but a 4K CE on
firmware 1.99 has only Red/Blue Convergence. Check the unit's menu before recommending it.

## HDR, brightness and the TV's BFI
- Use HDR10 with scanlines and masks. Raise **SMPTE 2084 PQ** first (it sets how bright full white is). A
  good OLED can take ~800–1000 nits. Then lighten the mask strength, then scanline strength. Input Gain is
  the last resort, because it clips first.
- With the TV's own BFI (e.g. LG "OLED Motion"), expect roughly half the light. Raise PQ further.
- Many TVs (e.g. **LG C4**) disable their BFI while VRR is active. Then keep **Sync Lock = Gen** with
  VRR Off. Triple Buffer is the fallback for consoles with odd timing.
- **Two different VRRs, and two different BFIs. Keep them apart when reading the wiki.**
  - *HDMI Output › VRR Format* (FreeSync/VESA injection) only flags the signal as VRR. That's what the
    wiki means when it says the RetroTINK "never outputs a variable frame rate" and suggests VRR when Gen
    lock gives trouble.
  - *Sync Lock = VRR* is **true VRR**, added in firmware 1.92: the output actually follows the source's
    rate. That wiki text predates it.
  - The wiki's "VRR helps BFI" advice concerns the **RetroTINK's own BFI** (which needs 100/120 Hz
    output). The **TV's BFI** is separate, and on many TVs it can't run with VRR at all. So for TV-BFI users:
    Gen lock, VRR off.
- The RetroTINK's own CRT Beam BFI / phosphor glow is **4K Pro only** and needs 120 Hz output. On a CE at
  4K60 the "glow" comes from HDR + mask + E-Conserve beams.
- Set the TV to PC/Game mode with 4:4:4 chroma (LG: rename the input to "PC"). Otherwise masks render
  wrong.

## Deinterlacing (only affects interlaced input)
- **CRT Simulation** draws one field (240 lines) per frame, alternating, like a real CRT. On a sharp
  OLED this shows as **vertical jitter/twitter** on 480i edges. That's authentic, not a fault.
- **Motion Adaptive** gives a stable progressive picture: weave for still areas, bob for motion. It can
  occasionally comb on dithering. Its tuning controls are 4K Pro only. With Detector = Zero-lag it adds
  no meaningful lag.
- **Field Inversion** fixes back-and-forth jitter caused by a wrong field order.
- **Smooth I/P Switch** treats 240p as 480i to avoid glitches when a game switches resolution. With it
  on, 240p scanlines need CRT Simulation, so switching to Motion Adaptive can change 240p too.
- Prefer 480p wherever the console offers it: GameCube (hold B at boot), Wii (system setting), many PS2
  games.
- SNES 480i is extremely rare (R.P.M. Racing; the 240p Test Suite has a 480i screen). N64 480i appears in
  hi-res modes that mostly need the Expansion Pak. Commonly cited examples (general knowledge, not from
  the wiki; confirm the in-game option, since some "hi-res" modes are progressive in-between
  resolutions): Rogue Squadron, Battle for Naboo, Indiana Jones and the Infernal Machine, Turok 2/3,
  Perfect Dark, Resident Evil 2.
- A shaky 480i picture on a *sharp* profile, with the deinterlacer already on Motion Adaptive, can also be
  the game's own deflicker or field rendering. GameCube homebrew such as Swiss exposes video options for
  this (see the GameCube section of `manual/consoles-nintendo-sega.md`). Prefer 480p wherever it exists.

## Sampling, Auto Phase and blend phase
- Auto Phase picks the **sharpest** Decimation Phase and Sub-Phase. It's right for "Sharp" profiles,
  and WP sharp profiles even adjust phase continuously.
- Wobbling Pixels' **4K CE "Blend" profiles** (SNES, Genesis) fake the Pro's horizontal-blur filter by
  sampling **off-centre** with a strong 9 MHz LPF, so dithering melts like over a cable and CRT.
  **Auto Phase undoes that.** Tune by hand:
  - Use the 240p Test Suite **Checkerboard**.
  - Step Decimation Phase until the pattern looks most even, then fine-tune Sub-Phase. Check Grid and
    Monoscope for acceptable softness.
- Phase is stored per detected width (e.g. SNES 256-wide vs 512-wide), so tune each with matching
  content. Kirby's Dream Land 3 uses 512-wide pseudo hi-res for transparency; Seiken Densetsu 3 uses it
  for text; Jurassic Park for its HUD.
- WP's stock blend value was tuned on their console. A user's own console and cable can need something
  quite different (one SNES: 315° vs WP's 33.75°).
- Settings are per resolution: set them while that resolution is on screen, then **Profiles › Save
  Current**.
- Auto Gain (remote "Gain" over pure white) is per console and per resolution. WP recommends it for every
  profile. A value far above ~1.25 is worth re-checking on a clean white screen.

## Was it really this blurry on a CRT?
It depends on the connection:
- RF or composite on a consumer TV (most US kids): blurrier than WP's blend.
- S-Video: cleaner.
- RGB on a consumer Trinitron: fairly sharp, with soft single-pixel edges.
- PVM/BVM: the sharp "pro" look.

Also: two-chip SNES models output a soft picture, and 1CHIP boards a sharp one. CRT softness is
horizontal; vertically it keeps a crisp line structure, and that structure plus perfect motion clarity
is what people remember as "sharp".

## Wobbling Pixels (WP) profile packs
- These are popular community profiles. Install them per WP's own note: delete all "Wobbling Pixels" files
  on the card, then copy their `image`, `mask` and `profile` folders over.
- "Sharp" profiles add continuous auto phase and per-game resolution fitting. "Fill" variants also crop
  the black bars. "CRT" and "Blend" profiles exist only for some consoles; CE vs PRO variants matter.
- N64: WP's CRT profiles use a **Bilinear Soft** horizontal kernel on purpose, to hide the N64's own
  blur filter, dithering and aliasing. Its output is always 640 wide, so that's far less blur than the
  same kernel on a SNES.
- To get a CRT look on a console WP only ships "Sharp" for: `profile graft <WP sharp> <a CRT profile>
  <out>`. Geometry and sampling stay console-correct, and the look comes from the donor.
