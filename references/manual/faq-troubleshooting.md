Condensed from the ConsoleMods RetroTINK-4K wiki (consolemods.org, CC BY 4.0); paraphrased and reorganized. Live text as of 2026-10-12.

# FAQ and troubleshooting

## Quick facts

- Power: USB-C, **5V at 2A+ (10W+)** from a name-brand charger. TV USB ports usually too weak. Any USB-C cable that charges works (no data needed).
- Max input: **1080p60** (no 4K input, not HDMI 2.1). Max output: 18 Gbps / 3840x2160p (4K60).
- Default output: **RT4K 4K60**, **6X 1080p**. Never auto-adapts to the display. Rescue: press **480p** or **1080p** on the remote.
- Default input: HDMI (6X CE has no HDMI in; defaults to front composite). **No auto input switching.**
- HDMI output cable: HDMI 2.0, 18 Gbps rated (6X: any cable).
- SD card: FAT32. Ships with 8 GB; FAQ says 32 GB max, but Getting Started says up to 1 TB tested when FAT32-formatted with Fat32format.
- LEDs: solid green = OK; blinking yellow = SD/firmware files problem; slow red pulse = standby (power on with remote); white/tricolor then green on boot.
- Remote: 2x AA, not included. Big red button top-left is power.
- HDCP: RT4K obscures video when HDCP is detected; it does not strip HDCP.
- Not supported: recording/screenshots to SD, emulators/cores on the FPGA, analog outputs (HDMI Out is the only output), rack mounting (it's <2 RU tall), RF input (convert to composite first).

## Support

### Basic checklist
1. PSU is 5V / 2A+ (10W+).
2. SD card FAT32.
3. Input is 1080p60 or lower.
4. Correct input selected (cycle variants in the Input menu).
5. Output cable HDMI 2.0 / 18 Gbps; isolate cable vs display by pressing 480p.
6. Display supports 4K (again test with 480p).
7. TV motion interpolation off (causes flicker/ghosting, esp. with scanlines).
8. Chroma 4:4:4 (often mislabeled "RGB"), not 4:2:2; usually via TV "PC Mode".

Then try: connect source -> RT4K -> display directly (no splitters/AVRs unless essential); reflash newest stable firmware (put **both** files in SD root, overwrite rt4kup.bin, hold rear reset while powering on); reload the profile or the default profile.

### Getting-started troubleshooting flow
1. **SD card**: FAT32 (use Fat32format). Blinking yellow = missing/mismatched files; see firmware update.
2. **Power**: trusted brand (Anker, Samsung, Sony, Apple). Voltage ideally 5.0-~5.35 V; any amperage >=2A fine if it has a proper 5V mode. **Danger:** chargers with 5V1A then 9V/12V modes may step up voltage under load and fry the unit. Random dropouts = check PSU.
3. **HDMI cable**: HDMI 2.0, 18 Gbps for 4K/1440p120. Dropouts with a good PSU -> better cable.
4. **Power on** with remote if LED pulses red. LED goes white/tricolor then green.
5. **Confirm output**: red "no signal" text top-right means it's on. Nothing shown -> press 1080p or 480p; still nothing -> recheck steps 4, 3, 2, 1.
6. **Connect source cable**: composite is fine (low lag, works with CRT effects); S-Video/RGB/YPbPr look better; mods optional. **CSync over SCART can carry too much voltage and damage the RT4K**; good cables attenuate it; check mod/cable combos with your modder. Sync-on-luma and sync-on-composite are safe; well-shielded SoC cables are as good as CSync.
7. **Select input manually** (no auto select). No picture -> check input, console on, PS2 output setting, clean carts (N64 etc.), console actually supports that output: not all PAL N64 do S-Video; some SNES lack CSync; SNES Jr is composite only; RF needs conversion.

### Common problems
**SD card problems (first batch)?** Early-batch cards fail often; use a new card with fresh SD contents + newest firmware. Symptoms: can't save profiles, boot failure. Not applicable to units bought after 15 Jan 2024.

**Blinks yellow then turns off?** The .rbf on the card doesn't match running firmware. Put a matching .bin + .rbf pair on the card, hold rear reset, power on with remote.

**Looks wrong / jailbars with post-processing / underwhelming?** Turn off all TV processing (motion interpolation), ensure nothing in the chain processes the RT4K's HDMI, enable RGB 4:4:4 (PC mode + game mode).

**Too sharp / blocky?** In order: change scaling kernel (SFX menu); add scanlines; use a generic-sampling or CRT profile instead of optimal sampling; last resort, lower output res (OUT menu) and let the TV scale.

**Too bright with HDR?** HDR is meant for BFI or scanlines/masks; otherwise turn it off. For brightness, calibrate the input.

**Too dark with scanlines?** Calibrate input first; turn HDR on; turn BFI off; else the TV may lack brightness.

**RT4K output but no console picture?** Check input selection, cable seating both ends, console power, console output setting (PS2: YPbPr or RGB in BIOS; HDMI+AV consoles: use the matching output), clean carts with 90%+ IPA.

**Still stuck?** RetroTINK Discord, RT4K help channel. Bring: console, region (NTSC/PAL), mods, game + its region, cables, other devices in chain (splitters shouldn't be there unless PS3/PSTV), profile used, photo/video (ideally capture), steps tried.

## Store / pricing
**Availability?** RT4K permanently on sale at the main store. 6X CE may be out of stock, returns at unannounced time. Check partners' own channels.
**Price?** See the RetroTINK store (regional, tax + shipping included).
**Package size/weight?** 12 x 9 x 3 in, 2 lb (30.48 x 22.86 x 7.62 cm, ~907 g).
**Payment plan?** None from RetroTINK.com; PayPal options may apply.
**Used/refurb?** Not sold by RetroTINK.com.
**UK?** Buy from the RetroTINK store (special UK checkout link if needed); 8bitmods and GamesConnection sell RT4K Pros.
**Outside USA?** RetroStuff (Canada), DragonBox Shop (Germany), GamesConnection and 8bitMods (UK), Consoles4You (Switzerland).

## Compatibility
**Elgato capture?** Works if fed a compatible resolution with Sync Lock on Triple Buffer (old incompatibility was HD60 S and older with older Tinks like the RT2X). Accurate capture of CRT/LCD effects depends on the card's chroma subsampling; most USB capture won't capture them accurately at 4K.
**1080p capture card shows nothing?** RT4K outputs 4K by default and never auto-changes; set 1080p or lower (or a startup profile with that res).
**HDCP Active message?** RT4K blanks/obscures HDCP content; does not circumvent.
**GCVideo Lite cables?** They output a signal, but there are other concerns with them.
**Worth it for PS4/Xbox One and newer?** For sharp 1080p->4K, BFI to cut motion blur, effects on emulators or retro-style modern games (via pre-scaling).
**Set-top box?** If not HDCP-encrypted. Sharp scaling may look worse than your TV's; can add retro processing.
**VHS/DVD?** Yes, deinterlacing settings exist for them.
**MiSTer / Direct Video?** Since firmware 1.1, MiSTer over HDMI in direct video mode gives optimal-sampling-equivalent picture.

## Hardware
**Only 4K output?** Any output up to 18 Gbps / 3840x2160p; common ones on the remote, more in HDMI Output menu.
**4K / HDMI 2.1 input passthrough?** No; max input 1080p60.
**Power?** 5V 2A+ (10W+), reputable brand. TV USB usually insufficient.
**Connector?** USB-C power; USB-A to USB-C cable included.
**Inputs as outputs?** No; HDMI Out only, no plans for analog out.
**Rack mount?** No; under 2 RU tall; look for community mounts.
**S-Video/composite ports?** Discrete jacks on the front behind a sliding door; other routes via other inputs.
**Loose SCART port?** Normal for all modern SCART jacks; use a screw-clamp style lock.
**Memory card?** Full-size SD, FAT32; ships 8 GB; max 32 GB per FAQ (see Quick facts caveat about 1 TB).
**External communication (WiFi/Bluetooth/serial)?** The wiki lists only these: FW 1.0.4: DV1 info over HDMI. FW 1.4.7: auto-loads matching core-named profile from `\profile\DV1\`. FW 1.6.6: serial on USB and VGA ports. FW 1.6.7: load `\profile\SVS\` profiles via SVS serial commands.
**Surround?** Up to 8-ch LPCM passthrough over HDMI; compressed surround via optical; DPLII passes (stereo-encoded).
**VGA / SCART pinouts?** See Inputs section (HD-15 / SCART jack pinout).
**ARC/eARC?** Works in such setups as long as the RT4K isn't plugged into the TV's ARC/eARC port.

## Software
**Reset/update deletes profiles?** No, profiles live on the SD card. Settings don't persist across power cycles; set a power-up profile.
**Emulators on the FPGA?** No plans.
**Auto resolution switching?** Detects vertical-res changes with per-resolution settings: 240p, 288p, 480i, 576i, 480p, 720p, 1080i, 1080p, plus one custom. Experimental horizontal-res detection for 240p/288p/480i/576i (Sample Rate Detection).
**Auto source switching?** No; use remote or serial commands. Reason (Mike Chi): YPbPr vs RGsB, and composite/S-Video luma vs YPbPr, are hard to tell apart.
**240p/480i/540p/786p/1080i/1536p output, HD-CRT?** Most progressive modes under 18 Gbps; use a custom modeline if not listed. Interlaced 480i/576i/1080i since FW 1.5.1 (same-res progressive->interlaced or passthrough). HD-CRT works if it accepts HDMI and a supported mode.
**Record to SD?** No; use a capture card.

## Comparisons
**My TV does nearest neighbor; why bother?** Any-to-almost-any scaling up to 4K, any method, sub-frame latency.
**Vs CRT?** CRT zero lag; RT4K sub-frame + display lag. No CRT-style light gun support. Customizable masks/scanlines. Needs a high-end OLED to approach CRT picture/motion.
**Vs mClassic?** mClassic: 1080p60, 1440p60 (native panels) or 4K30; RT4K up to 4K60 with many sharp/soft kernels.
**Vs 4K Gamer Pro?** That only upscales 1080p to 4K (passes other signals); RT4K takes/outputs nearly any res.
**Vs emulation?** With premium cables/sources, can be indistinguishable from emulation rendered at native res; can't fix early 3D rendering.
**Game doesn't look better?** Scalers don't raise internal render res; benefits are low lag and compatibility.
**Faster HDMI scaling than my TV?** HDMI input adds a tiny amount of processing latency (shown in Scaling/Cropping menu), on top of the display.

## Recommendations
**Capture card?** AVerMedia Live Gamer 4K GC573 (internal), full RGB 4:4:4 at 4K60.
**HDMI splitter?** Input side: any HDMI 1.4 10 Gbps; output side: HDMI 2.0 18 Gbps; non-processing = no extra lag. **DV1 users:** no recommendation yet; many strip HDMI metadata before it reaches the RT4K.
**HDMI switch?** Input: HDMI 1.4 up to 10 Gbps; output: HDMI 2.0 up to 18 Gbps. **Warning:** switch must output a safe 5V or it can permanently damage the RT4K and void warranty; USB-powered switches help. Wiki links a community-tested switch that passes DV1.
**HDMI cable?** Certified HDMI 2.0, 18 Gbps.

## Miscellaneous
**Scaler into RT4K HDMI in (incl. RT5X)?** Not recommended; double scaling/suboptimal sampling. Works if <=1080p60, but the RT4K's ADC is likely better.
**mClassic before RT4K?** Not recommended but accepted (1080p60).
**mClassic after RT4K?** Not recommended; drop RT4K output to 1080p or less (mClassic input max).
**4K Gamer Pro after RT4K?** Unnecessary.
**Forgot the remote?** FW 1.6.8+: custom remote codes let any remote work. Startup profile via SD: get the RT4K Startup Profile Pack, put `prof.map` in `profile/`, copy desired profile next to it renamed `startup.rt4`.
**Lost the remote?** Update to FW 1.6.8, buy an RT5X premium remote (or any remote) and use custom remote codes.
**HDR input?** FW 1.4.7+: HDR passthrough from console to TV.
**Lost USB cable?** Any charging USB-C cable.
**Faulty unit?** Troubleshoot above, then Discord RetroTINK-4K/6X Help & Support. Still broken: reply to the RetroTINK store order confirmation email, or contact the partner store you bought from.
**RT5X remote?** Yes with custom remote codes, FW 1.6.8+.
