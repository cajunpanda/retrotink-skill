# retrotink

An AI-agent skill (and standalone CLI) for **RetroTINK-4K / 4K CE / 6X** SD cards: backups, firmware
updates, profile editing, and answers to "what does this setting do?"

## Quick install

### Coding agents (Claude Code, GitHub Copilot, Cursor, Codex, Gemini CLI…)

Paste this prompt into the agent:

```text
Install the agent skill from https://github.com/cajunpanda/retrotink as a personal skill named
"retrotink", so it's available in every project. Put it in your own skills folder, then run its
self-test (scripts/rtink selftest, or scripts\rtink.cmd selftest on Windows) and tell me whether
it worked.
```

Then start a new session and ask something like *"back up my RetroTINK SD card"* or *"what does Beam
Spread do?"*.

The first self-test may download a private copy of Node.js (~30 MB) if your computer doesn't have it.
That's expected, and nothing is installed system-wide.

### Chat apps and manual install

**Claude.ai / Claude Desktop app:** download
**[retrotink.zip](https://github.com/cajunpanda/retrotink/releases/latest/download/retrotink.zip)** and
upload it under *Settings → Capabilities → Skills*. There Claude can answer setting and tuning questions
from the bundled manual, but it can't reach your SD card; use a coding agent for backups, firmware and
profile edits.

**Any agent, by hand:** it's one folder in the open [Agent Skills](https://agentskills.io) format (`SKILL.md` plus scripts).
Put it where your agent looks for skills:

| Agent | Personal (all projects) | One project only |
|---|---|---|
| **Claude Code** | `~/.claude/skills/retrotink` | `.claude/skills/retrotink` |
| **GitHub Copilot** (VS Code, Visual Studio, CLI) | `~/.copilot/skills/retrotink` (or `~/.claude/skills/…`) | `.github/skills/retrotink` |
| **Cursor** | `~/.cursor/skills/retrotink` (or `~/.agents/skills/…`) | `.cursor/skills/retrotink` |
| **OpenAI Codex CLI** | `~/.codex/skills/retrotink` | — |
| **Gemini CLI** | `~/.gemini/skills/retrotink` (or `~/.agents/skills/…`) | `.gemini/skills/retrotink` |

Copilot and Cursor also read `~/.claude/skills`, and Cursor, Gemini CLI and Visual Studio's Copilot read
`~/.agents/skills`. So one clone into either folder covers several agents.

**With git** (swap the path for your agent's from the table):
```bash
git clone https://github.com/cajunpanda/retrotink ~/.claude/skills/retrotink
```
```powershell
git clone https://github.com/cajunpanda/retrotink "$env:USERPROFILE\.claude\skills\retrotink"
```

**Without git:** download **[retrotink.zip](https://github.com/cajunpanda/retrotink/releases/latest/download/retrotink.zip)**
from the latest release and unzip it into your agent's skills folder from the table (create the folder if
it doesn't exist). You should end up with `…/skills/retrotink/SKILL.md`. On Windows, `~` means
`C:\Users\<you>`.

To update later: `git pull` in the folder, or download the zip again. Or just ask your agent to update
the retrotink skill.

## What it does

- **Backups:** zip + SHA-256 manifest of the whole card, verified on write; plus verify, diff and restore.
- **Firmware:** list packages, read the changelog since your version, then download and stage the right
  files for your model. Packages are checked against the SHA-256 RetroTINK publishes.
- **Profiles (.rt4):** dump and diff by setting name, set values (per resolution or across all of them),
  change the mask bitmap, and graft a CRT look from one profile onto another console's geometry.
- **SVS and remote buttons:** list SVS auto-load profiles; read and write `prof.map` button assignments.
- **Questions:** a condensed RetroTINK manual and tuning notes, so the agent can explain settings
  (kernels, scanlines, masks, HDR/PQ, deinterlacing, sampling) and give console-specific advice.
- **Your setup first:** before touching a card, it learns how your consoles are connected (SVS or not,
  which ports, which TV), and keeps short setup notes so it doesn't have to ask again.

Nothing to install yourself. The launchers use Node.js if present, otherwise they download a private
portable Node.js once (checksum-verified) into your user cache folder. Works on Windows, macOS and Linux.

```
sh scripts/rtink card backup          # macOS / Linux
scripts\rtink.cmd card backup         # Windows
```

Run `rtink` with no arguments for all commands. `SKILL.md` explains how the agent uses it.
`references/` holds the profile format, tuning knowledge and firmware notes. `references/manual/` is the
condensed manual (adapted from the ConsoleMods wiki, CC BY 4.0); `references/manual/INDEX.md` is the
lookup.

## License
Code: GPL-3.0 (see `LICENSE`). `references/manual/`: CC BY 4.0, adapted from the
[ConsoleMods RetroTINK-4K wiki](https://consolemods.org/wiki/AV:RetroTINK-4K) (paraphrased and
reorganized). `vendor/cruller/` is vendored unmodified from
[Cruller](https://github.com/margaale/Cruller) (GPL-3.0); its source commit is in
`vendor/cruller/SOURCE.md`.
