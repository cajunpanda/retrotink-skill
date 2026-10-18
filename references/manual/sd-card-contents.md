# SD Card Contents (profiles, masks, CSCs, other folders)

Condensed from the ConsoleMods RetroTINK-4K wiki SD Card Inventory page (consolemods.org, CC BY 4.0; page dated Dec 2023), reorganized and updated against the RetroTINK-4K SD pack of Oct 2026.

The wiki page lists only the 1.0-release profiles and has an empty CSC section. Everything here about masks, CSCs, lumacode and the newer collections comes from the Oct 2026 pack's folder listing and its bundled instruction/_info files. Where neither source says what a file does, only its name is given.

## Card layout (root)

| Item | What it is |
|---|---|
| `rt4kup.bin` | Firmware updater image |
| `rt4k_XXXX.rbf`, `rt4kce_XXXX.rbf` | FPGA bitstreams for the 4K Pro and 4K CE (Oct 2026 pack: `_1950`) |
| `z_keep_cur_input`, `z_keep_cur_res` | 1-byte marker files. The names say "keep current input" and "keep current resolution"; the wiki does not describe them |
| `profile/` | `.rt4` profiles, grouped by console/collection (see below) |
| `profile/SVS/` | Scalable Video Switch auto-load profiles. You create this yourself; it is not in the pack |
| `prof.map` | Remote profile-button assignments. Written by the device or user, not in the pack |
| `mask/` | Custom shadow masks: 32-bit RGB BMP (24-bit won't work), at most 16x16. Each pixel is a per-channel gain: 128 = unchanged, 0 = fully masked, 255 = 2x |
| `csc/` | Custom colour matrices: `.txt` files holding one CSV line of 14 floats (input gamma, lift, gain, output gamma, transfer function 0=sRGB/1=Rec.601/709/2=SMPTE 240/3=conventional gamma, then a 3x3 input RGB to XYZ matrix). The RT4K applies the XYZ to output matrix itself |
| `image/` | Banner `.bmp` images. Subfolders: Console, Simple, For Fun, FirebrandX, MrMoro, Moon, LaserDisc. Root has `default.bmp`, `default_ce_fbx.bmp`, `_CRT-SIMULATOR.bmp`, plus FBX-*, KH-*, Wobbling Pixels and NAC arcade banners |
| `modelines/` | Custom output modeline `.txt` files: 720p HD, 1080p FHD, 4K, Interlaced, 17x9, Ultra Wide, WonderSwan, plus loose files such as `540p.txt`, `1280x720p240.txt`, `3840x1080p60.txt`, `3840x2160p24/30.txt` |
| `inputmodes/` | `input_database.txt`, a CSV of custom input timings (examples: GBIHF-OSSC 360p, 480i Custom, Sega Naomi, WonderSwan 75Hz), plus its instructions |
| `lumacode/` | `.lmc` Lumacode decoder tables: C64 (PAL/NTSC/R56A), VIC20, TIA_2600 (+PAL), MARIA_7800 (+NTSC), G7000 (+PAL), Intellivision (+PAL), MC6847, MSX_COLECO, SMS, PC-10, ZX_SPECTRUM, Sony CXA, DIAG, NES. `NES/` adds Composite Direct (FBX), NES Classic (FBX), PVM Style D93 (FBX), Smooth (FBX), Wavebeam, NES HDR Raw/Soft Clamp/Medium Clamp/Sony Decoder |
| `profile custom instructions & Info/` | Authors' instruction text files (AdesAcceptable, austinbroth, BIGTIME NAC, Billgonzo, Chungo, cobhc, Mr Moro, ...) |
| `Custom EDID Instructions.html` | EDID how-to (new since the wiki page) |

Most folders also hold a `_... Instructions.html` file.

## Profile pack: top-level folders

General notes. "Basic" / "Basic RGBS/YPbPr" profiles in a console folder are the simple defaults. "Zoom" profiles are zoomed views for dialling in ADC phase and colour. "DAR" means scaled to the display aspect ratio. "Sharp" / "PAR" means 1:1 pixel aspect. "09x/10x" etc. is the integer scale factor. Wobbling Pixels makes "Sharp" and "Razor Sharp" variants, each with a "Sharp vs Razor Sharp Differences" text file.

| Folder | Notes / main sub-collections (Oct 2026 pack) |
|---|---|
| `_starter` | Basic set "tested on authentic hardware and MiSTer". `Console - <system>.rt4` gives the sharpest picture: Dreamcast, GameCube, Genesis MD, N64 RGB + YC ENH, Neo Geo, NES RGB, PS1, PS2, PSP, Saturn, SMS, Super NES, TurboGrafx PCE, Wii, XBOX. `CRT Emulation/` has `_CRT - Classic` BVM/Consumer/Hi Res Triad/PVM/Slot Mask and `_CRT - E-Con` Basic/BVM/Consumer/PVM/Trinitron. New since the wiki |
| `_CRT Emulation` | CRT look presets, built for 3840x2160p60 unless noted (see next section) |
| `__Profile Instructions` | A single profile: load it and press Back |
| Nintendo NES + FC | FirebrandX RGBS NTSC and HDRV-Low NTSC (DAR/Sharp, optional L-Crop, 09x/10x, Zoom); Wobbling Pixels RGBS Sharp; Billgonzo NES CRT; Prof_gLX HiDefNES; AdesAcceptable |
| Nintendo SNES + SFC | FirebrandX RGBS / HDRV-Low / YPbPr / RGB-via-VGA (DAR, Sharp, Capcom Fighters, Super Game Boy, Zoom); Wobbling Pixels RGBS/YPbPr Sharp and CRT Blend (wiki: RGBL Sharp/Razor Sharp with PAL-to-NTSC variants); BakerHole RGBS DAR 1080p/1440p; Billgonzo CRT and Super GB; Mr. Moro DMD; AdesAcceptable |
| Nintendo N64 | FirebrandX RGBS NTSC (4:3 Fill/Overscan, Deblur variants, Zoom); Wobbling Pixels RGBS, S-Video, Enh S-Video R4K PRO (Sharp/CRT); Fox_83 SCART; Billgonzo CRT; RegentOfOrigin HD Retrovision; AdesAcceptable |
| Nintendo GameCube | FirebrandX GCVideo + Swiss (DAR/Wide 448/480 Fill), Swiss 1x1 PAR (DAR 512/608/640), GCVideo + GBI (GBIHF 13x for GBA, 15x for GBC); Wobbling Pixels YPbPr Sharp, HDMI Swiss R4K Opt, GBIHF LCD Razor Sharp sets (GB/GBC/GBA screen colour, LCD RGB/mono mask, HDR); Fox_83 YPbPr; Mr Moro GBP and game-specific HDMI; Master Hand GBI GB Pocket |
| Nintendo Wii / WiiU | Wii: MrMoro YPbPr (Generic Wii for 240p/480i/480p; VC NES/SNES, MD and TG16 at SDTV), Wobbling Pixels YPbPr, Fox_83, teennick GCVideo HDMI, Mr. Moro DMD. WiiU: austinbroth DS Official/Modded Modeline/GBA VC, RegentOfOrigin HDMI |
| Nintendo Switch | Mr Moro NSO HDMI (GBA 13x, GBC 15x, NSO 256/320 at 09x/10x, N64 720p for scanlines); pram0d HDMI; Fox_83; Billgonzo GBC-GBA; SDMasterYoda game-specific; Mr. Moro DMD |
| Nintendo GBA / 3DS | GBA: Prof_gLX GBAConsolizer. 3DS: Aru's Loopy xx3dsfml |
| Sega Genesis & MD, SMS, Saturn, Dreamcast, Game Gear | FirebrandX RGBS/HDRV-Low (MD, SMS 11x); Wobbling Pixels RGBS/YPbPr Sharp, CRT Blend, R4K PRO; Pyrons Lair (MD); Billgonzo (Saturn); Goldanas HDRV (Saturn); FirebrandX VGA and DCDigital (DC; Mcbazel/Toro VGA, Fill/Over/Sharp); MLiG Tim Worthington RGB (GG); AdesAcceptable |
| Sony PS1 / PS2 / PS3 / PSP / PSTV | PS1: FirebrandX RGBL and HDRV-Low, Wobbling Pixels RGBS/YPbPr (Sharp, CRT Blend), BakerHole, Fox_83 SCART, Mr. Moro DMD. PS2: Wobbling Pixels YPbPr (Sharp, CRT, R4K PRO, PS1-on-PS2; GSM 480i to 480p/1080i), Fox_83. PS3: Wobbling Pixels HDMI. PSP: Wobbling Pixels YPbPr (LCD) Razor Sharp. PSTV: MrMoro + Sharpscale (PS1 256 to 640 at 09x/10x, PS1 Generic, PSP, Vita 720p), Fox_83 |
| Microsoft Original Xbox / 360 / PC | Xbox: Wobbling Pixels YPbPr and Stellar/XboxHD+ HDMI, cha0shacker HD-AV-Pack, Chungo 480i IRE Correction. 360: Wobbling Pixels HDMI |
| NEC SuperGrafx (PCE) / PC-8801 | FirebrandX RGBS NTSC (DAR/Sharp 09x/10x, sampled for 256 and 512 widths), BreakmanX TurboNanza, MLIG Enhanced S-Video. PC-8801: Cyo 24 kHz BASIC (24 kHz modes need a profile) |
| SNK Neo Geo AES / MVS | FirebrandX RGBS Bypass (304 vs 320 width, with a game list), Open MVS RGBS, Prof_gLX O-MVS |
| Atari 2600 / 7800 / Jaguar | Prof_gLX 2600 Composite; Chungo 7800 YPbPr/RGBS; FirebrandX Jaguar RGBL (Sharp 09x/10x, Zoom) |
| Panasonic 3DO, Phillips CD-i, Sharp X68000, Fujitsu FM Towns | 3DO: Prof_gLX 3DORGB 240p/480i. X68000: Artemio. FM Towns: Cyo 24 kHz profile for towers/UX/UG/UR/HG/HR models that do not convert internally |
| Arcade / Arcade + NAC Spitfire | pram0d SCART RGBS game pack (Akai Katana, Guwange, KI, MK2, NBA Jam TE, ...); NAC per board: CPS I/II/III, Namco System I/II, Sega System 16/18/32, Konami, Neo Geo MVS |
| Analogue Pocket / Super NT / Mega SG / Duo / Nt Mini Noir | Pocket: GBA 13x and GBC 15x (instead of the default 12x/14x), Fox_83 mask variants, Billgonzo, Shissa, MrMoro. Others: SDMasterYoda HDMI and Game Gear RGBS |
| Classic Mini Consoles | Mini NES/SNES (256) and Genesis (320) at 09x/10x; MrMoro DAR HDMI |
| RetroUSB AVS | Chungo DAR/Sharp, NTSC and PAL |
| HDMI | Generic and game-specific HDMI: Fox_83 Generic, Kenbakes' Neo-Retro CRT Prescaling, MasterYoda, Mr Moro, cobhc, INDIGOTRANCE, tunnotron3000 / Castlevania Dominus collections at 1080p |
| Composite Video Only | RF+Composite, GTS RF+Composite, Mike Chi 3D Comb profiles |
| MiSTer / dv1 | MrMoro MiSTer profiles, Tunnotron3000 CRT Generic. `dv1/` is an empty slot for your own MiSTer DV1 profiles. For CRT effects over DV1, adjust Target Decimate |
| Video Content / VHS Capture / LaserDisc | Mr Moro BD and NTSC DVD 480i IVTC (4:3, 16:9). LaserDisc Style A/B |

Wiki-only items that the new pack has renamed or replaced: "Sony PSP (Go)" is now "Sony PSP & PSP Go", and "Mr. Moro Sony PSTV Sharpscale" is now "MrMoro + Sharpscale". The wiki's PSTV Sharpscale settings were Integer scaling / Pixel PS1 AR / Point / Unlock FB off for PSP, Vita and PS1 Generic, and Real scaling for the fixed-width PS1 256-640 profiles (avoid these on Chrono Cross and Silent Hill).

## CRT preset collections (`profile/_CRT Emulation`)

| Collection | Author | Look / variants |
|---|---|---|
| Basic HDR CRT | (pack default) | HDR. BVM 1000 TVL, PVM 600 TVL, Consumer Trinitron, Consumer Slot Mask, Hi-Res Dot Mask, plus LCD looks: GBI 360p RGB LCD, SNES SGB Mono/RGB LCD |
| CRT TV and PVM Emulation | Kuro Houou | Real-set models: JVC TM-H150CG, JVC TM-H1950CG, JVC D-Series D200 (new), Sony KV-FV310, Sony PVM 20L5, Toshiba AF44. Each in 4K HDR and 4K HDR BFI. SDR versions exist only for AF44 and D200 |
| Kuro Houou HDR / HDR BFI / SDR Optimized Masks and Scanlines | Kuro Houou | **Listed in the wiki, absent from the Oct 2026 pack.** Grayscale- and gamma-calibrated presets per mask: AG Coarse/Dense/RYB/YMC, Mono Dense/Medium, Slot Coarse/Dense/Medium, Triad Coarse/Dense |
| ii_edub_ii CRT Emulation (EDUBS CRT Simulator v1.3) | ii_edub_ii | `_SD-CRT` (to 480i/576i), `_HD-CRT-EDTV` (to 480p/576p), `_HD-CRT-HDTV` (720p/1080i component), `_PC-CRT` (480p VGA). Uses the `_P22-*` CSCs and `_`-prefixed root masks. Set nits to 10% sustained of the TV's capability; works with TV BFI (costs 1 frame of lag); needs firmware 1.48+ |
| Rog's CRT Emulation 60Hz | Rog | HDMI/YPbPr 480p, with or without CX BFI; HDMI 720-1080 Smooth (BFI or none) |
| Rog's CRT Emulation 50Hz | Rog | RGB, Composite, Enh S-Video and Mega Drive RGB at 240p; YPbPr/HDMI 480p. Optional CRT Beam and PAL-to-NTSC variants |
| Chinakat CRT HDR + BFI | Chinakat | HDR + BFI: HD CRT, Plasma EDTV, VGA Monitor |
| Billgonzo's General Use CRT Profiles | Billgonzo | Consumer Composite, Consumer S-Video |
| JROMR 35XBR48 Emulation | JROMR | Sony 35XBR48, D65 and D93 versions |
| Tellytron CRT Emulation | tellytron3000 | 4K SDR; Slot 1440p SDR |
| Splash - Sony KD-34XBR970 - 4K HDR v2 | Splash | Single HDR profile |

## Masks (`mask/`)

| Location | Masks |
|---|---|
| root (`_` prefix = ii_edub_ii set) | `_COURSE-APERATURE-GRILLE` and `_COURSE-SLOT-MASK` (suited to SDTV); `_DENSE-APERATURE-GRILLE` and `_DENSE-SLOT-MASK` (suit all profiles); `_MEDIUM-SHADOW-MASK` (PC content); `_540P-APERATURE-GRILLE` (HD CRT profiles); `_540TVL-SHADOW-MASK`, `_720TVL-APERATURE-GRILLE`, `_720TVL-SLOT-MASK`; `_444 Test`, `_444 Test-2`; also `RBCYmask Rog`, `Clown Face Emoji`, `puttputt` |
| RGB Masks | Aperture grille: A Grille Coarse/Dense RGB, RYB, YMC, RMCG; 600TVL: RGBX, RMCG, RYCB, YMCX; 1000TVL: GM, MG, YB. Slot: Slot Mask Coarse/Medium/Dense RGB, SlotMaskGWM1, SlotMaskMGW1. Shadow: Shadow_Dark, Dense, Light, Light_A, Light_B. Triad Coarse/Dense RGB. Also Honeycomb_attempt_2, WRGB |
| Mono Masks | A_Grille_Coarse_Mono (plain, 4px, 5px), A Grille Medium/Dense Mono, rt5x_grille_bright/med/dark, rt5x_shadow_1/2/3, SlotMask1/2/3 |
| Mono Tunno / RGB Tunno | SlotMask1/2/3 (mono); SlotMaskGWM1/MGW1 (RGB) |
| Rog Mask | Rog RGB AG 2880 |
| DMG | Original Game Boy LCD grids: DMG 7x/10x/15x, ALT/ALT_2, alpha and grey versions |
| GB Pocket | GBP_15x |
| GBC | GBC 6x/7x/10x/14x/15x, Real_*, ALT, LCD_True_RGB, New_LCD, Real_14x-Dark, GRID 14x/15x, Pocket_GBC 7x/10x/14x/15x |
| GBA | GBA 6x/9x/13x, Real_6/9/13, GBA_SP_Real 9/13 (+ALT), GBA_Mask 25-L/50-L, Pocket_GBA 9x/13x |
| GG | Game Gear 15x13 with Divider (+ALT, and HDMI/RGBS versions), 15X Horizontal, GG 06x (+Pocket) |
| DMD | DMD 9x/10x/11x grids (SQ, 9x10, 11x10), DMD GBA, DMD GBC |
| Other Handheld Masks | PSP-1000/2000/3000 (4x/5x), Moro PSP 2000/3000, PSP Moro 3K/Vert, Vita (4x, WOLED), Switch_OLED pattern / Color_Adjusted |

## CSC files (`csc/`)

| File(s) | Purpose (where stated) |
|---|---|
| `_P22-SMPTE-C` / `_P22-EBU` / `_P22-D93` | P22 phosphors: SD NTSC / SD PAL / SD Japanese (D93) content (ii_edub_ii) |
| `_P22-HD` / `_P22-PC` / `_P22-PC-D93` | P22 phosphors: HD / PC / Japanese PC content (ii_edub_ii) |
| `_P22-C`, `_P22-C-D93` | Name only |
| `BT601_525`, `BT601_525_A`, `BT601_525_D93`, `BT601_625` | BT.601 525-line (NTSC) and 625-line (PAL) primaries; D93 white point variant; `_A` not described |
| `BT709`, `BT709_A`, `BT709_D93` | BT.709 primaries, with D93 variant |
| `sRGB`, `sRGB_A`, `sRGB_D93` | sRGB, with D93 variant |
| `BT2020`, `BT460_6`, `AppleRGB`, `ARIBTRB9v1` | Named standard gamuts (names only) |
| `Raney_PVM_20L2MDU`, `Raney_PVM_20M2U` | Measured Sony PVM matrices (Keith Raney; credited in the CSC instructions) |
| `Mathieulh_WEGA_ KV-29FX30B` | Sony WEGA KV-29FX30B (name only) |
| `SDR_Scanline_Compensation` | Name only |
| `Game Boy Interface/`, `Game Boy Player Start-up Disc/`, `Wii U Virtual Console/` | The same 17 handheld-screen matrices for each GameCube/Wii U route: GBA, GBA SP AGS-101 (+D65), GBA higan/ares, GBA NSO, GBC, GBC Gambatte/higan/ares, Gameboy Hi-Colour Convertor, Game Boy Interface, Nintendo DS (+D65), Switch OLED, PSP (+D65), Palm Treo 700p (+D65), VisualBoyAdvance-M |
| `Billgonzo GBC-DMG/` | DMG, DMG A/B, DMG Contrast 1 to 5, GBC Subpixle Mask |
| `Master Hand GBI GB Pocket/` | Game Boy Pocket HDR / SDR |
| `Colourblind/` | Deuteranopia, Protanopia and Tritanopia (each plain and "boost"), plus Deuteranomaly, Protanomaly, Tritanomaly |

Matrix data credits from the CSC instructions: Dan Mons, Keith Raney (colour_matrix_adaptations) and Extrems (Game Boy Interface).

## Community contributors in the pack

- **FirebrandX (FBX)**: optimally sampled per-console sets (DAR / Sharp / Zoom at 09x/10x) for RGBS, RGBL, HDRV-Low, YPbPr and VGA; GameCube GCVideo/Swiss/GBI; Lumacode NES tables; FBX banners.
- **Wobbling Pixels**: per-console NTSC & PAL sets in Sharp / Razor Sharp / CRT Blend / R4K PRO variants, plus GBI and PSP LCD-mask profiles.
- **Kuro Houou (KH)**: HDR / BFI models of real CRT sets. The wiki also lists mask/scanline calibration sets that are no longer in the pack.
- **MrMoro**: Switch NSO, Wii VC, PSTV Sharpscale, Pocket, MiSTer, DMD, Video Content (DVD IVTC, BD); handheld masks.
- **pram0d**: arcade SCART RGBS game pack; Switch HDMI.
- **Cyo**: FM Towns and PC-8801 24 kHz profiles.
- **austinbroth**: Wii U DS and GBA Virtual Console layouts.
- **Chungo**: RetroUSB AVS, Atari 7800, Xbox 480i IRE correction.
- **Others (new since the wiki)**: Fox_83, Billgonzo, AdesAcceptable, BakerHole, Prof_gLX, SDMasterYoda/MasterYoda, ii_edub_ii, Rog, Chinakat, JROMR, tellytron3000/tunnotron3000, Kenbakes, RegentOfOrigin, Mike Chi, Artemio, BreakmanX, MLiG, Goldanas, Pyrons Lair, Shissa, teennick, cha0shacker, Aru, cobhc, INDIGOTRANCE, Master Hand, Extrems (GBI CSC data).
