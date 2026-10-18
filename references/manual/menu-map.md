Condensed from the ConsoleMods RetroTINK-4K wiki (consolemods.org, CC BY 4.0); paraphrased and reorganized. Live text as of 2026-10-12.

# RT4K OSD menu map

Path notation: Menu > Submenu > Setting. **[Pro only]** = not on the 4K CE. Ranges are as given by the wiki; "On/Off" = toggle. Remote shortcuts mentioned elsewhere: SFX = Processing/Effects, OUT = HDMI Output.

## 1. Basic Setup

### Input Selection
| Group | Options |
|---|---|
| HDMI | HDMI (HDMI In) |
| Front | Composite; S-Video |
| RCA (rear) | YPbPr; RGsB; CVBS on Green |
| SCART | RGBS (75 ohm); RGsB; YPbPr; CVBS on Pin 20; CVBS on Green; Y/C on Pin 20/Red |
| HD-15 | RGBHV; RGBS; RGsB; YPbPr; CVBS on Hsync; CVBS on Green; Y/C on Green/Red; Y/C on G/R (Enh.) **[Pro only]** |

### HDMI Output
**Transmitter**
| Setting | Values |
|---|---|
| HDR | Off, HDR10 [8-bit], HLG [8-bit] |
| Colorimetry | Auto, Rec. 709, Rec. 2020, Adobe RGB, Display-P3 (Rec. 2100 via Auto when HDR on) |
| RGB Range | Full, Limited |
| Sync Lock | Triple Buffer, Gen, Frame, TBC, A. Buffer (all but Triple Buffer show current refresh) |
| VRR | Off, FreeSync, VESA |
| Deep Color | Off, On (exceeds HDMI 2.0 bandwidth at 4K60) |

**BFI Control**: Strobe, Blur, LCD Saver (same as Black Frame Insertion menu).

**Output Resolution**: 4K60, 4K50 (3840x2160); 1080p60, 1080p50, 1080p100, 1080p120 (1920x1080); 1440p100, 1440p120 (2560x1440); 480p60 (720x480); Custom Modeline 1-4.

### Profiles
**Load Profile**
| Setting | Values / effect |
|---|---|
| Load From File | browse `profile/` on SD |
| Load Default | load default profile |
| Auto Load DV1 | Off/On; load DV1 profile on DV1 signal (global, not per profile) |
| Auto Load SVS | Off/On; load SVS profile on SVS command (global, not per profile) |

**Save Profile**: Save Current (overwrites original file); Save As New ("New Profile #").

**Assign Profile**: Button 1 ... Button 12 (map an SD profile to remote buttons 1-12); Power Up (profile loaded at power-on).

## 2. Advanced Settings

### Scaling/Cropping
**Input Crop**
| Setting | Values / effect |
|---|---|
| Top / Bottom / Left / Right Trim | trim each edge |
| Vert. Pre-Scale | 1/2 to 1/31; reduce effective vertical res of HDMI image |
| RoTATE (Beta) | image rotation methods |

**Auto Crop** (all set Scaling Mode = Proportional)
| Action | Crop | Sets Aspect |
|---|---|---|
| Vertical Only | top/bottom | 4:3 (PAR) |
| Full Crop to 4:3 | all edges | 4:3 (PAR) |
| Full Crop to 16:9 | all edges | 16:9 (PAR) |

**Scaler**
| Setting | Values |
|---|---|
| Aspect Correction | 4:3 (PAR), 16:9 (PAR), 1:1 (Sq. Pixel) |
| Scaling Mode | Auto Fill, Proportional, Free-Form, Auto Fill Integer |
| Vert. Factor | image height; only Proportional or Free-Form |
| Hori. Factor | image width; only Free-Form |
| Buffer Length | Min. Lag, 1/2 Frame, 1 Frame (shows measured lag in ms) |
| Blank Res. Change | On/Off; black frame on res change |

**Masking Color** (crop mask fill): Red 0-31, Green 0-31, Blue 0-31; Show = Cropping Only / Always.

### Processing / Effects
**Interpolation**
| Setting | Values |
|---|---|
| Vert. Kernel / Hori. Kernel | Bilinear Sharp, Bilinear Med., Bilinear Std., Bilinear Soft, Cubic, Lanczos2, Lanczos3, Nearest Neighbor |
| Anti-Ringing | On/Off; only shown for Lanczos2/3 |
| Linear Light | On/Off; On = process in linear light (inverse gamma at pipeline start), Off = gamma domain |

**Scanline**
| Setting | Values |
|---|---|
| Function | Off, Exponential, Gaussian, Super Gaussian, Linear, Box, LCD Mono 1, LCD Mono 2, LCD BGR, LCD RGB (non-Off unlocks the rest) |
| Strength | 0-99 |
| Modulation | 0-99 |
| Pseudo Interlace | interlaced-order scanlines on progressive: 2x (480p->960i, thinner, full detail) or 1x (480p->480i, thicker, half vertical res) |
| Red Bleed | enable red bleed |
| Red Convergence | -10 to 10 (vertical shift of red) |
| Blue Convergence | -10 to 10 |

**Masks**
| Setting | Values |
|---|---|
| Enable | on/off; does nothing until a file is loaded |
| Strength | -10 to 10 |
| Load from File | browse `mask/` |

**Horizontal Blur [Pro only]**: Function = Off / IIR LPF; Cut-Off Freq 0.50-9.00 MHz, 0.25 steps.

**Smoothing [Pro only]**: Algorithm = Off / XBR Level 1 / XBR Level 2; Noise Threshold = Off / Low / Medium / High.

### Color Correction
**Gamma/PQ**
| Setting | Range |
|---|---|
| Input Factor | 0.1-5.00 (input gamma -> linear) |
| Input Lift | -1.00 to 1.00 (offset) |
| Input Gain | 0.00-10.00 (multiplier) |
| Output Factor | 0.10-5.00 (re-encode to gamma) |
| SMPTE 2048 PQ | 250-10,000 nits; PQ peak for HDR output |

**Color Space Conversion**
| Setting | Values |
|---|---|
| Apply Preset | browse `csc/` presets (gamma + matrix) |
| Custom Matrix | enable Input RGB->XYZ matrix |
| Prevent Clipping | On/Off; scale matrix to keep highlights (dimmer) |
| Saturation | -1.0 to +1.0 |

**Input RGB to XYZ**: Xo[Rin], Xo[Gin], Xo[Bin], Yo[Rin], Yo[Gin], Yo[Bin], Zo[Rin], Zo[Gin], Zo[Bin]; each -1.75000 to +1.75000.

**Advanced Controls**
| Setting | Values |
|---|---|
| Transfer Function | sRGB 0.055, Rec.601/709 0.099, SMPTE 240M 0.1115, Gamma |
| Bit Crush | Off ... 7 bits Removed (posterize; fixes Game Boy Interface rounding) |
| Dithering | On/Off; noise to hide 8-bit banding |

### Black Frame Insertion
**BFI Control**
| Setting | Values / effect |
|---|---|
| Strobe | number of flashes per frame |
| Blur | duration of each flash |
| LCD Saver | alternates BFI phase against IPS retention (momentary glitch per inversion) |
| Min. BFI Limit | On (default) / Off; Off removes safety limits, extra warning screen |

**BFI Color**
| Setting | Values |
|---|---|
| Blending Mode | Solid, Alpha, Solid Color, Alpha Color, CRT Beam **[Pro only]**, Variable MPRT |
| Red / Green / Blue | 0-31 each |

**Variable MPRT**: Gain -10 to 10 (brightness).

**Rolling BFI [Pro only]**: Beam Steepness = Off or 1-6 (higher: clearer motion, more tearing); Phosphor Glow = Off or 1-11 (decay sim, restores brightness, reduces clarity).

### Deinterlacer / Film
**Mode**
| Setting | Values |
|---|---|
| Algorithm | Motion Adaptive, Weave, Bob, Linear, Blend, CRT Simulation, LCD Blending (LCD Blending also works on progressive) |
| Field Inversion | Off/On; reverse 480i field order |
| Smooth I/P Switch | Off/On; seamless 240p<->480i, 288p<->576i |

**Motion Adaptive Settings [Pro only]**
| Setting | Values |
|---|---|
| Sensitivity | Low, Medium, High, Max (higher = more solid, more weave artifacts) |
| Noise Threshold | 0-63 |
| Interpolator | Linear, Edge Adaptive |
| Detector | Zero-lag, Symmetric |

**Bob Settings**: Offset -3 to +3 (field shift).

**Film Mode [Pro only]**: Inverse Telecine (3:2 for 24fps, 2:2 for 30fps detector); Dejudder 24 Hz Off/On.

**Cadence Detection**: Motion Digital 0-500; Motion CP 0-500; Motion SDP 0-500; Threshold 0-500.

## 3. Acquisition

### HDMI In Receiver
**Input Decimation**
| Setting | Values |
|---|---|
| Input Pixels | 1 (Output: 1) to 15 (Output: 1) |
| Output Pixels | 1-15 |
| Initial Phase | 1 of X ... X of X (X = Input Pixels) |

**Colorspace**
| Setting | Values |
|---|---|
| 4:2:2 Upsampler | Linear, Nearest |
| Input Range | Auto, RGB Lim., RGB Full, YCbCr 601, YCbCr 709, XUYCC 601, XUYCC 709, YCbCr 601 (Full), YCbCr 709 (Full) |

**MiSTer DV1**: Auto-Decimate = Infoframe / Measure / Off; Auto-Crop On/Off; Auto-RoTATE On/Off **[Pro only]**.

**A/DAC**: Enable = Off / NTSC / PAL; Auto-Decimate On/Off.

**Misc**: Target Decimate = Off, 720, 1024, 1280, 1440, 1600.

### RGB / Component ADC
**Sampling**
| Setting | Values |
|---|---|
| Samples per Line | samples per line of the analog capture |
| Decimation Factor | divides samples per line |
| Decimation Phase | which subdivision to show |
| Sub-Phase | 11.25 deg steps, up to 348.75 deg |
| Anti-Alias LPF | Auto (16MHz), 9MHz (Strong), 16 MHz (Med), 35 MHz (Light), 95 MHz (Min.), Off |

**Sync**
| Setting | Values |
|---|---|
| SoG Threshold | 0.00-327.42 mV, 11.29 mV steps |
| Pre-coast | 1-31 |
| Post-coast | 1-31 |
| Wide Tolerance | On/Off; helps malformed 240p/288p sync (arcade, NEOGEO); keep Off normally (artifacts) |

**Gain**: Pre-ADC -0.7 to +0.8; Red / Green / Blue 1.000-1.996 in 0.008 steps.

**Offset**: Red / Green / Blue -100 to +100.

**Auto Calibrate**: Phase (sets Sub-Phase; best on high-contrast detail); Gain (sets R/G/B gain; best on calibration screens, e.g. 240p Test Suite).

### Sample Rate Detection
**Control**
| Setting | Values |
|---|---|
| Auto Dec. Factor | Off/On; enables the rest of this menu |
| Auto Dec. Phase | Off, Auto |
| Detection Mode | Generic Console (fixed video clock), Saturn (variable master clock) |
| ADC Sample Rate | manual sampling |

**Progressive Detection**: Enable 1/10, 1/8, 1/7, 1/6, 1/5, 1/4 (each toggles that auto-decimation ratio).
**Interlaced Detection**: Enable 1/10, 1/8, 1/7, 1/6, 1/5, 1/4.

### SDP Decoder (composite / S-Video)
**Gain / Balance**
| Setting | Values (default) |
|---|---|
| Brightness | -100 to +100 (0) |
| Contrast | -100 to +100 (0) |
| Chroma | -100 to +100 (0); saturation |
| Phase | -100 to +100 (0); green/magenta tint |
| Blue Only | On/Off (Off); calibration |
| Setup | 0 IRE, 7.5 IRE (0); black level |

**2D Processing**
| Setting | Values |
|---|---|
| 2D Y/C Filter | Notch, 2D Adaptive, 2D Fixed |
| 2D Bandwidth | Low, High (high = more detail, more artifacts) |
| Chroma Bandwidth | Low, High (chroma LPF vs rainbowing) |
| PAL Delay Line | On/Off; vertical chroma blur for PAL |
| Sharpness | 0-15 |
| CTIE | 0-3; chroma sharpen guided by luma |

**3D Processing [Pro only]**: 3D Comb Enable On/Off; Noise Threshold = Default, Low, Medium, High.

**Sync**: H-Lock Speed = Auto, Slow, Medium, Fast; Standard = Auto, NTSC, PAL, SECAM, NTSC-443, PAL-M, PAL-N, PAL-60.

**Enhanced S-Video [Pro only]**: Chroma Shift -100 to 100 (0).

### Audio Input
**Sampling** (analog audio only)
| Setting | Values |
|---|---|
| Sample Rate | 48 kHz, 96 kHz |
| Pre-amp Gain | -24.0 to +28.0 dB, 0.5 steps |
| Pre-amp Balance | Off, or boost L or R up to +24.0 dB, 0.5 steps |

**Source**: Input Override = Off, RCA, HD-15, SCART, Front, S/PDIF; Input Swap = Mono (Left), Mono (Right), L/R Swap.

**VU-Meter**: Right, Left (level bars). **Audio Level**: Right, Left (dB readout).

## 4. System

### OSD / Firmware
| Group | Setting | Values |
|---|---|---|
| Banner Image | Load Banner | load from `image/` folder (community docs say `banners/`) |
| On Screen Display | Position | Left, Center, Right |
| | Auto-Off | up to 100 sec, 10 sec steps |
| | Hide Input Res | On/Off |
| | Enable Debug OSD | Off, Status Pg 1, Status Pg 2, Status Pg 3, Console |
| Power Control (global, not per profile) | Sleep Timer | Off, 5 min, 10 min, 20 min, 1 hr (no signal / no remote press) |
| | Auto Power Up | On/Off; power on when power applied |
| Firmware Update | Check SD Card | find `rt4kup.bin` in SD root and prompt; matching `rt4k_###.rbf` also required |

### Status (three pages)
- **Page 1**: Video Source (source e.g. "CP Proc.", input timing, pixel clock, freq, detected mode); Audio Input (e.g. "I2S", measured freq x2, HDMI N, CTS); FPGA Core (scaler clock, PLL VCO, pipeline, SDRAM clock, SDRAM load); HDMI Transmitter (output timing, active size, pixel clock, HDMI standard); PIC32MX MCU (system clock, uptime, loop time, last IR code, SD card free).
- **Page 2, HDMI Input Protocol Analyzer**: TMDS, mode, resolution, colorspace; H timing (FP, sync+polarity, BP, active); V timing F0 (FP, sync+polarity, BP, active, total) and F1; Audio, AVI / Audio / VS / ACP infoframes.
- **Page 3, HDMI TX info**: TX mode, hot plug, scrambling, clock factor, Ch 0/1/2 error, sink EDID dump.

### Diagnostic Console
Diagnostic console for HDMI TX channels.

### About
About (device name, firmware version, Device ID); Resources (RetroTINK website, Discord, wiki URLs); Thanks! (credits).
