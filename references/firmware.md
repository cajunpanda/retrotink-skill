# Firmware updates

Read this before staging firmware, or when the user asks "is there an update / does it matter to me".

- Source: RetroTINK's official repository, github.com/RetroTINK-LLC/firmware (pages at
  retrotink-llc.github.io/firmware). The **experimental** channel gets frequent builds with full
  changelogs; **release** is rarely updated. Most owners run experimental.
- One package covers the 4K Pro, 4K CE and 6X. It contains `rt4kup.bin`, which decides what gets
  installed, plus `rt4k_<v>.rbf` (4K Pro), `rt4kce_<v>.rbf` (4K CE) and `rt6x_<v>.rbf` (6X). Copy only
  `rt4kup.bin` and the bitstream for the user's model. `fw stage` does that, and checks the package
  against the SHA-256 RetroTINK publishes in the changelog.
- Keep the old `.rbf` on the card if updating from the menu: the updater runs from the installed
  bitstream. Deleting it forces the Reset-button method. `--prune` deletes older ones but keeps the
  newest previous one.
- To install: put the card in the unit, then **Advanced Settings › OSD/Firmware › Firmware update ›
  Check SD Card**. Or unplug the unit, hold the blue Reset button, and plug it back in (firmware 1.6.0+).
  It takes about 40 s: the LED goes pink, then blue, then green. A **red blink** is an install error:
  recheck the card files. **Yellow flashes** at boot mean the bitstream that `rt4kup.bin` expects is
  missing.
- Profiles, masks, CSC files, banners, modelines and input modes survive updates (they live on the card).
- `rt4kup.bin` on the card is what's *staged*. It doesn't prove what's installed; that's on the unit's
  About screen.
- Judging relevance: run `fw changelog --since <installed>`. Then map each item to the user's model
  (many items say "4K Pro") and setup: their inputs, whether they use VRR, BFI or HDMI. If the new `.rbf`
  for their model is byte-identical to the old one, the change is software-only.
- SD card images (a complete fresh card) are under `RetroTINK-4K/SD card images` in the repo. They tend
  to be older than the experimental firmware: install a card image, then stage the newest firmware on top.
