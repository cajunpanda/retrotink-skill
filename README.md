# retrotink

A Claude Code skill (and standalone CLI) for **RetroTINK-4K / 4K CE / 6X** SD cards:

- **Backups:** zip + SHA-256 manifest of the whole card, verified on write; plus verify, diff and restore.
- **Firmware:** list packages, read the changelog since your version, then download and stage the right
  files for your model. Packages are checked against the SHA-256 RetroTINK publishes.
- **Profiles (.rt4):** dump and diff by setting name, set values (per resolution or across all of them),
  change the mask bitmap, and graft a CRT look from one profile onto another console's geometry.
- **SVS and remote buttons:** list SVS auto-load profiles; read and write `prof.map` button assignments.

No installs needed. The launchers use Node.js if present, otherwise they download a private portable
Node.js once (verified) into the user cache. Works on Windows, macOS and Linux.

```
sh scripts/rtink card backup          # macOS / Linux
scripts\rtink.cmd card backup         # Windows
```

Run `rtink` with no arguments for all commands. See `SKILL.md` for how Claude uses it. `references/`
holds the profile format, tuning knowledge and firmware notes. `references/manual/` is a condensed
RetroTINK-4K manual (adapted from the ConsoleMods wiki, CC BY 4.0) for answering setting questions;
`references/manual/INDEX.md` is the lookup.

## Install as a Claude Code skill
Put (or symlink) this folder at `~/.claude/skills/retrotink` (all projects) or
`<project>/.claude/skills/retrotink` (one project).

## License
Code: GPL-3.0 (see `LICENSE`). `references/manual/`: CC BY 4.0, adapted from the
[ConsoleMods RetroTINK-4K wiki](https://consolemods.org/wiki/AV:RetroTINK-4K) (paraphrased and
reorganized). `vendor/cruller/` is vendored unmodified from
[Cruller](https://github.com/margaale/Cruller) (GPL-3.0); its source commit is in
`vendor/cruller/SOURCE.md`.
