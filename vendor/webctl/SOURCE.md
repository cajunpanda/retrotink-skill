# Settings overlay for firmware 1.99.x

`rt4k_settings_overlay.json` adds the settings the vendored Cruller map (firmware 1.92) doesn't have:
the **Advanced CRT Effects** page (firmware 1.99.7+: Tube, Bezel & Glass, and the 4K Pro's Composite
Video) and BFI's **Multi-frame Glow** (4K Pro, 1.99.0+). 22 settings.

- Source: the profile schema of RetroTINK's WebCtl page as served by a DonutShop bridge (v0.8.3,
  github.com/svirant/DonutShop) to an RT4K on firmware 1.99.12. Labels, byte offsets, types, ranges,
  scales and value lists are taken from it and converted to Cruller's map format (`bytes` are body
  offsets, i.e. file offset − 128; numbers are given as two example values that fix raw = a·value + b).
- Checked on a 4K CE running 1.99.12: a profile saved on the unit (Cylindrical, Bezel On, Zoom +2 %) decodes
  correctly, and a profile written with unusual values in all 13 Tube and Bezel & Glass settings loads
  and shows exactly those values in the unit's OSD; options and defaults were read off the OSD too.
- `tools.mjs` appends these to the Cruller map at load time; the Cruller files stay unmodified.
- Cycles/Line: NTSC and PAL share codes (the meaning follows Standard), so each value names both.
