# Maintaining this personal Pi setup

These rules apply when changing this user's Pi setup, not to unrelated project work.

- The source of truth for Pi extensions, themes, and these instructions is `~/code/pi-setup` (private remote: `urjitc/pi-setup`). Confirm the configured local package path if this checkout moves.
- Edit reusable customizations in that checkout. Pi loads it directly as a local package. Do not create duplicate copies under `~/.pi/agent/extensions` or `themes`.
- These instructions are scoped to this repository, not installed as global agent context. A plain `~/.pi/agent/README.md` points agents inspecting the live configuration here; it is not automatically loaded into prompts.
- Live preferences and MCP connections remain in `~/.pi/agent/settings.json` and `mcp.json`. When intentionally changing a reusable preference, also update the corresponding sanitized example under `config/` and explain any platform-specific difference. Examples are documentation, not automatically applied configuration; never replace live settings wholesale.
- Keep credentials, OAuth tokens, sessions, logs, caches, device IDs, internal service configuration, and machine-specific package paths out of Git. Do not vendor shared third-party skills without checking licensing and attribution.
- Keep the setup minimal: public Pi APIs, default footer, quiet presentation, and no automatic Rex session renaming. The existing Rex internal startup hook is a documented compatibility exception, not a pattern to expand.
- Preserve unrelated preferences, model selections, and steering mode. Read installed Pi docs before changing APIs or resource layout.
- Validate changes, review the diff and staged files for secrets, and commit/push ready setup changes to the existing private origin when requested. Do not publish publicly or broaden repository access without permission.
- Tell the user when `/reload` is needed. Distinguish automated checks from live visual verification.
