Condensed from the ConsoleMods RetroTINK-4K wiki (consolemods.org, CC BY 4.0); paraphrased and reorganized. Live text as of 2026-10-12.

# HDMI Output, Profiles, BFI, Serial/SVS

## Quick facts

- **Sync Lock: Gen Lock is recommended** if the display accepts the source's refresh rate. Profiles usually default to Triple Buffer for compatibility; press GEN on the remote, then save the profile to make Gen Lock stick. BUF button returns to Triple Buffer.
- **HDR is meant to offset the dimming from scanlines, masks and BFI.** Without those, turn HDR off. If you insist on HDR without scanlines, set SMPTE 2084 PQ to about **520.8 nits** (Advanced Settings > Color Correction).
- **RGB Range must match on the RT4K and the display**, or blacks look crushed or washed out. LG TVs call it "Black Level": Low or High.
- **BFI needs** an output at least 2x the input rate (120 Hz for NTSC, 100 Hz for PAL), **1440p or lower**, and **Gen or Frame** Sync Lock.
- **SVS auto-load naming**: `profile/svs/S<input>_<anything>.rt4`; `S0_...` loads when all inputs are off; the first match wins. The VGA cable needs pins 12 and 15 connected.
- **DV1 auto-load**: `profile/dv1/<core-name>.rt4`, with the RT4K on the HDMI input.
- **Deep Color at 4K60 exceeds the HDMI 2.0 bandwidth spec** and may break TVs or capture cards.
- **Serial** over USB-C (FTDI) runs at 2000000 baud on firmware newer than 1.75.0 (115200 before that). HD-15 runs at 9600 baud. Both use 8-N-1, and commands end in `\r` or `\n`. **[6X CE] has no USB serial.**
- **BFI Color / Blending Mode is [Pro only]**. CE has Strobe, Blur, LCD Saver and Min. BFI Limit.

## Output resolutions

The RT4K outputs video and audio **only** through HDMI Out. If you're unsure which resolution to use, try the remote buttons.

| Resolution | Use / notes | Remote button |
|---|---|---|
| 4K60 (3840x2160) | RT4K default. **Not on [6X]** | Yes |
| 4K50 | PAL games, 24 Hz content. **Not on [6X]** | No |
| 1080p60 | Default for 1080p displays. **[6X] default** | Yes |
| 1080p50 | PAL, 24 Hz content | No |
| 1440p60 (2560x1440) | Default for 1440p monitors | Yes |
| 1440p50 | PAL, 24 Hz content | No |
| 1080p100 / 1440p100 | PAL and 24 Hz content **with BFI** | No |
| 1080p120 / 1440p120 | NTSC content **with BFI** | No |
| 480p60 (720x480) | Minimum suggested output for modern displays. The rear **Reset button** switches to this mode | Yes |
| Custom 1-4 | Loaded from `custom[1-4].txt` on the SD card (custom modelines) | Yes |
| Custom 5-6 | **[6X] only** (the 6X has 6 custom slots) | No |

- **Interlaced output** (firmware 1.5.1+): 480i, 576i and 1080i. It's meant to turn a progressive input into interlaced at the same resolution, or to pass interlaced through (e.g. 1080p/i to 1080i, 480p/i to 480i).

## HDR

- **Modes**: "HDR10 [8-bit]" and "HLG [8-bit]". They're different standards but should look the same in practice.
- **Purpose**: a brighter picture to compensate for BFI, scanlines and masks. Without these features, leave HDR off. If the picture is too dark without HDR, adjust the ADC, the colorimetry, or the CSC color correction instead.
- **Brightness**: adjust with Advanced Settings > Color Correction > **SMPTE 2084 PQ** (in nits). This helps if you use HDR without scanlines and highlights are blown out; 520.8 nits is the suggested level.
- **HDR passthrough** (firmware 1.5.4+): HDR10 and HLG from the HDMI input pass through automatically. You can't turn it off on the RT4K; disable HDR on the source device instead.

## Colorimetry

- **Auto** (default): Rec. 709, switching to Rec. 2100 when HDR is on.
- **Manual**: Rec. 2020 (without HDR), Adobe RGB or DCI-P3 for wide-gamut displays. These may improve accuracy when you use the Color Correction menu.

## RGB Range

- **Full** (meant for PC monitors) or **Limited** (meant for TVs). Neither looks better than the other.
- **The RT4K and the display must match**: too dark or washed out means a mismatch. Most displays accept both, so check carefully.
- Other names: OBS calls it "Color Range"; LG TVs call it "Black Level" (Low/High). Check capture software too.
- If the picture still looks wrong, set Advanced Settings > HDMI Receiver > **Input Range** to Auto or to match the console's output.

## Sync Lock

Sync Lock controls how output timing follows the input and how input changes are handled. The "Chrono Cross problem": some games switch between 240p and 480i (in-game vs menus in Silent Hill or Chrono Cross on PS1), and many displays and capture devices blank for seconds on each switch.

| Mode | Behavior | Trade-off / use |
|---|---|---|
| **Triple Buffer** (BUF) | Output runs independently of input | Most stable and compatible. Variable lag, from a fraction of a frame up to about 1 frame plus a fraction; occasional judder from dropped or repeated frames. **Use for capture.** |
| **Gen Lock** (GEN) | Loosely couples output to input; locks after a few seconds | **Recommended**: minimum lag, no judder. Needs a display that accepts the source rate. If it causes trouble, try VRR. |
| **Frame Lock** | Tightly couples output to input | Any change in input rate causes an output disruption and a hard resync. Least compatible. |
| **TBC** | Like Gen Lock but handles sync glitches better | Converges more slowly than Gen Lock |
| **Adaptive Triple Buffer (A. Buffer)** | Triple Buffer that switches to 50 Hz output for 50 Hz input | For PAL consoles that switch between 50 and 60 Hz. Select a 60 Hz output mode. Its 50 Hz output may be less TV-compatible than manually choosing the built-in 50 Hz modes. |

- Compatibility decreases from Triple Buffer to Gen Lock to Frame Lock.
- **Out of range**: Gen Lock shows "Gen Out of Range!" and Frame Lock shows "Fr. Out of Range!" when the input is **more than 19% faster or 30% slower** than the output rate. The RT4K then falls back to Triple Buffer at the modeline's rate.

## VRR flag

- Flags the output as VRR. The RT4K itself **never outputs a variable frame rate**.
- **Uses**: makes the display accept a broader range of refresh rates (helps with Gen Lock); stops some displays from re-buffering or changing rates, which interferes with BFI; and some TVs enter a low-lag mode when they see the flag.

## Deep Color

- **Off** = 8-bit, **On** = 10-bit (more colors). This helps when you've applied color adjustments. Turning it on requires confirming an on-screen OK prompt.
- **Caveat**: at 4K60 it exceeds the HDMI 2.0 bandwidth spec, so TVs or capture cards may fail. Disable it or use a lower resolution. PAL users may do better with 4K50, as long as HDR is off.

## Audio output

- Up to **8-channel LPCM** over HDMI. All 8 channels are always sent but correctly routed (firmware 1.4.2 testing), so a 5.1 receiver that reports 7.1 should still work correctly.
- **Dolby Surround** (all iterations) passes through. It's matrix-encoded in stereo, so the receiver does the decoding.

## Black Frame Insertion (BFI)

BFI inserts black (or Pro-colored) frames between real frames to imitate CRT phosphor decay, which improves perceived motion clarity. It does **not** interpolate frames. **Caution**: the strobing may bother light-sensitive people.

**Requirements** (the BFI options stay locked until both are met):
- An output refresh rate **at least 2x the input**: 120 Hz for NTSC, 100 Hz for PAL. Bandwidth limits BFI to **1440p or lower**.
- Sync Lock set to **Gen** or **Frame**.

**Settings** (quick access: HDMI Output > BFI Control):
- **Strobe**: how many times each input frame is flashed within the output rate. Example: a 60 Hz input at 240 Hz output flashes once with Strobe 1 and twice (with black between) with Strobe 2. At 60 Hz in 120 Hz, the frame shows for half the window.
- **Blur**: duty cycle; how long the source frame shows relative to black. For 60 Hz in 240 Hz: Blur 1 = 1/4, Blur 2 = 2/4, Blur 3 = 3/4 of the window. Some combinations are fixed; 60 Hz in 120 Hz only allows Blur 1 (1/2).
- **LCD Saver**: swaps the video/black frame order at a set interval to prevent LCD image retention. Values: 0, 1, 5, 10 minutes. Each swap can cause a brief dark or light flicker. Setting 0 (never swap) shows a retention warning.
- **Min. BFI Limit**: On (default) or Off. Off removes the safety limits on strobe effects and shows an extra warning screen.
- **Tip**: the VRR flag can stop displays from re-buffering in ways that disrupt BFI.

### BFI Color **[Pro only]** (not on CE)

**Blending Mode** sets what the inserted frame looks like:
- **Solid**: a grayscale frame. R, G and B are locked together; lower is darker.
- **Alpha**: a copy of the video frame darkened by a transparent overlay. Lower values are darker and more opaque.
- **Solid Color**: a solid frame in a custom RGB color.
- **Alpha Color**: a copy of the video frame with a colored alpha overlay set by RGB.
- Red, Green and Blue can be set separately only in the Color modes; in Solid and Alpha they're locked together.
- Per the wiki's GUI menu map (not in the BFI chapter): the full list of modes also includes **CRT Beam (Pro only)** and **Variable MPRT**. R, G and B range from 0 to 31. Variable MPRT has a **Gain** setting (-10 to 10, brightness). **Rolling BFI [Pro only]** adds **Beam Steepness** (Off or 1-6; higher values mean less blending between phases, giving more clarity but more tearing) and **Phosphor Glow** (Off or 1-11; simulates phosphor decay and restores brightness, but higher values reduce motion clarity).

## Profiles

Every setting lives in the loaded profile, including input, output resolution and scanlines. **Loading another profile discards unsaved changes**, so save before you compare. CRT presets are just profiles. The Load From File menu mirrors the SD card's `profile/` folder structure, so you can reorganize it on a PC.

### Load

- **Load From File**: browse `profile/` on the SD card.
- **Load Default**: the built-in Default profile. It can never be deleted or overwritten.
- **Auto Load DV1**: automatically loads a profile for the detected DV1-compatible MiSTer core or console HDMI mod.
  - Requires the RT4K to be on the HDMI input, a file named `core-name.rt4`, and the file placed in `profile/dv1/` (e.g. `profile/dv1/batrideru.rt4`).
  - The core name appears at the bottom of the RT4K menu (`Mode: MiSTer 240p (core-name)`) and in the resolution-change popup at top right. **Only the first 14 characters** of long names are sent, even though MiSTer's OSD shows the full name.
- **Auto Load SVS**: loads a profile when a serial command arrives from a Scalable Video Switch or compatible device.
  - The file goes in `profile/svs/`, named `S<input number>_<anything>.rt4` (e.g. `S2_SNES.rt4`).
  - When the SVS first detects all inputs off, it loads `S0_<anything>.rt4`.
  - If several files match a pattern, the **first match** is used.
  - Input 1 is the module closest to the control unit, input 2 the next closest, and so on.
  - **Requires a VGA cable with pins 12 and 15 connected.**

### Override options (experimental firmware 1.24.0+)

These apply no matter what the profile contains, and are handy for A/B comparisons. They **don't apply to profiles loaded by DV1 or SVS auto-load**.
- **Keep Cur. Input**: stays on the current input when loading a profile. Useful for CRT profiles that you use across inputs.
- **Keep Cur. Res**: keeps your output resolution, for non-4K displays.
  - Off: uses the profile's resolution.
  - On: overrides the profile's resolution with the current one.
  - On + Auto Scale: also overrides the profile's Scaling Mode. It *tries* to translate the profile's scaling factors to suit the current resolution.

### Save

- **Save Current**: overwrites the loaded profile. If the Default profile is loaded, this acts like Save As New.
- **Save As New**: creates `New Profile X` (X counts up) in the root of `profile/`. Rename it on a PC.

### Assign

- Assigns any of the **12 number buttons** on the remote to a profile (using the same browser as Load From File).
- Also sets the **Power Up** profile, which is separate from the Default profile; the Default profile can't be changed.
- To clear an assignment, highlight the button and press **Left**.

### Nested profile settings

One profile can hold several entries for **ADC** (RGB/Component ADC), **SCL** (Scaling & Crop) and **Interpolation**, keyed by conditions:
- **HDMI sources**: separate SCL and Interpolation for the special HDMI modes (DV1, A/DAC) and for normal HDMI, plus separate values for each input resolution within each.
- **RGB/Component**: separate ADC, Interpolation and SCL for each detected vertical line count and refresh rate.
- **SDP decoder inputs** (composite/S-Video): one shared SDP ADC setting, with separate Interpolation and SCL for 240p, 480i, 288p and 576i.
- **Sample Rate Detection** (when enabled): separate SCL and Phase for each detected horizontal resolution.
- The selected input is also a key.
- Every setting, nested ones included, is saved in the `.rt4` file **except Power Control** (OSD/Firmware menu). Power Control is global and saved to the SD card root.

### SD card notes

- The card holds firmware, profiles, banners, custom CRT mask images, color correction presets, custom modelines and custom input modes. **The RT4K needs it to boot.**
- Hot-swapping is supported, but don't remove the card during a save.
- New cards must be **FAT32**; extract the official SD card image onto them. If the image's firmware version doesn't match the installed firmware, update through the blue Reset button method.

## Serial control (USB / HD-15)

The RT4K accepts remote-control commands and SVS commands over USB (the USB-C power port) or UART (HD-15 TX/RX pins). **[6X CE]: no USB serial.**

| | USB | HD-15 |
|---|---|---|
| Interface | FTDI RT232R | TX = **pin 12** (open drain); RX = **pin 15** (3.3 V TTL push-pull or open drain) |
| Baud | **2000000** (firmware > 1.75.0); **115200** (firmware < 1.75.0) | **9600** |
| Framing | 8-N-1 | 8-N-1 |

- **HD-15 open drain** is required when serial shares the port with video (VGA or Enhanced S-Video). It needs a pull-up resistor from 3.3 V to TX/RX; **2.2k-10k ohm** has been tested.
- The source doesn't document an ACK or acknowledge mode.

### Remote commands

Every command ends with `\r` and/or `\n` and takes the prefix `remote `. Example: `remote menu\n`.

| Command | Button | Command | Button |
|---|---|---|---|
| `pwr` | PWR | `prof` | PROF |
| `menu` | MENU | `prof1`...`prof12` | Number buttons 1-12 |
| `up` / `down` / `left` / `right` | Arrows | `gain` | GAIN |
| `ok` | OK | `phase` | PHASE |
| `back` | BACK | `pause` | PAUSE |
| `diag` | DIAG | `safe` | SAFE |
| `stat` | STAT | `genlock` | GENLOCK |
| `input` | INPUT | `buffer` | BUFFER |
| `output` | OUTPUT | `res4k` | 4K |
| `scaler` | SCALER | `res1080p` | 1080P |
| `sfx` | SFX | `res1440p` | 1440P |
| `adc` | ADC | `res480p` | 480P |
| `col` | COL | `res1`...`res4` | RES1-RES4 |
| `aud` | AUD | `aux1`...`aux5`, `aux7`, `aux8` | AUX1-5, 7, 8 |
| | | **`axu6`** | AUX6 (misspelled in firmware, last checked on 1.75) |

- **Wake from sleep**: `pwr on` (no `remote` prefix) turns the RT4K on. While it's asleep, all other commands do nothing.

### SVS commands

Commands end with `\r` and/or `\n`.
- `SVS NEW INPUT=<n>`: triggers an auto profile load (see Auto Load SVS).
- `SVS CURRENT INPUT=<n>`: keep-alive telling the RT4K a switch is connected. Send it every **1-2 seconds**.

### Hardware setup

- **HD-15**: use a passthrough adapter with a serial breakout, in either VGA or Y/C style (Y/C is Enhanced S-Video on the Pro). Connect it to an Arduino Nano, Raspberry Pi or similar. Open designs: donutswdad's DonutDongle adapters.
- **USB**: the cable must carry data **and** supply 5 V 2 A. Power matters more on the Pro, which draws more than the CE.
  - **A) Direct to a PC USB 3.x port**: most ports can't supply 5 V 2 A, so check the specs or use a USB power meter. USB-C ports are more likely to work.
  - **B) Powered USB 3.x hub** (at least 5 V 2 A supply) or a Raspberry Pi USB power splitter. Hubs often sag under load; aim for 5.0-5.25 V at the output, never below 4.8 V.
  - **C) Raspberry Pi Zero 2 W (recommended)**: its second USB port isn't current-limited and the Pi itself draws under 0.1 A, so one supply runs both. It needs quality parts because micro USB is near its limit:
    - Cable Matters USB-C to Micro cable (5 V 3 A rated), 0.3 m, to the RT4K.
    - 5 V **3 A** supply (Anker or Haribo suggested) that holds 5.0-5.25 V at 2.4 A.
    - A short, 3 A-rated micro USB power cable, no longer than 1.8 m.
    - Setup: flash Raspberry Pi OS Lite with Pi Imager (set Wi-Fi and user), connect over SSH, then run `ls /dev/ttyU*` and expect `/dev/ttyUSB0`.
    - Optional power savings (do these with the RT4K disconnected if you see instability), in `/boot/firmware/config.txt`:
      - Set `dtparam=audio=off`, `camera_auto_detect=0`, `display_auto_detect=0`.
      - Comment out `#dtoverlay=vc4-kms-v3d`.
      - Under `[all]`, add `dtoverlay=disable-bt`, `dtparam=hdmi=off`, `enable_tvout=0`, `enable_uart=0`, `gpu_mem=16`, `gpu_freq=67`.
    - Further savings: add `maxcpus=2` (or `1`) after `console=tty1` in `/boot/firmware/cmdline.txt`, and/or `arm_freq=600` under `[all]` in config.txt. These may be needed with the official 12.5 W Pi micro USB supply.
  - **D) USB-C OTG adapter (not recommended)**: no known adapter works reliably. Avoid A-to-A cables.
- **Common issues**:
  - The RT4K doesn't appear as a serial device: you're probably using a power-only cable.
  - The RT4K is unstable: a power problem. Use a quality 5 V 3 A supply and short branded cables. The supply should read 5.0-5.25 V, and the RT4K's USB jack must read **at least 4.75 V**.

### Linux examples

The device is `/dev/ttyUSB0`, or a higher number if other adapters are connected; find it with `dmesg | grep -i ftdi`. The wiki's examples use 115200 baud. Use 2000000 on firmware newer than 1.75.0.

```sh
stty -F /dev/ttyUSB0 115200 cs8 -cstopb -parenb
echo "remote menu" > /dev/ttyUSB0
tio -b 115200 -d 8 -f none -s 1 -p none --map INLCRNL --input-mode line /dev/ttyUSB0   # exit: ctrl-t q
```
