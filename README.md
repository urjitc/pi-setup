# Personal Pi setup

A small, public configuration package, tested with Pi 1.4.0. The working Git checkout is the source of truth for the extensions and theme; GitHub is its versioned remote.

## Included

- **compact-tools.ts**: one-line collapsed tool calls, hidden successful text output, short error previews, and native renderer delegation on expansion (Ctrl+O). Codemode and shell calls can show model-written intent comments.
- **default-quiet.json**: quiet dark theme using muted tool titles and unboxed tool presentation. Retains Pi's default footer.
- **rex-context.ts**: optional Rex environment context. Inactive outside Rex; missing/unavailable Rex does not block startup. It currently uses Rex's internal `session-start` CLI hook, so this integration is version-sensitive, not a stable public Rex API. It does not rename sessions.
- **config/**: sanitized examples of reusable preferences, updated alongside intentional preference changes; not automatically synchronized or applied. Exa is search-only and keyless, subject to service limits.
- **AGENTS.md**: repository-scoped maintenance instructions; not injected into unrelated Pi conversations.

## Use this checkout locally

Install Pi separately, then:

```sh
pi install /absolute/path/to/pi-setup
```

Pi loads local package resources directly from this directory; it does not copy them into `~/.pi/agent/extensions` or `themes`. Do not also keep the same resources there, or they may load twice.

Select `default-quiet` in Pi's settings. Review and merge optional preferences from `config/settings.example.json`; do not replace existing settings wholesale. The example records `steeringMode: "all"` and portable `externalEditor: "vim"`; this Mac uses `/usr/bin/vim` explicitly. Run `/reload` in existing sessions after installing or editing resources.

A short plain `README.md` in `~/.pi/agent/` points to this checkout for agents inspecting the live configuration. It is a location note, not global prompt context. The actual maintenance instructions live only in this repository's `AGENTS.md`. Other users should adapt the checkout path.

Optional Exa setup:

```sh
pi mcp add exa --url 'https://mcp.exa.ai/mcp?tools=web_search_exa' --description 'Search the public web for current information and sources using Exa. Returns search results, not a research agent.'
```

No local MCP package or additional search agent is needed. Run `/reload` after adding it.

## Daily workflow

1. Edit the extension/theme/instruction files here. For live preference changes, update the sanitized example too when the preference belongs in the shared setup.
2. Run `/reload` and verify behavior in Pi.
3. Review `git diff`, commit, and push to `origin`.

No copy-back or synchronization script. Other users can clone this repository and install their checkout in the same way.

## Intent titles

```js
// title: Compare browser automation options
```

```sh
# title: Run authentication regression tests
```

Use about 3–8 words. Keep codemode's options directive or a shell shebang first. Only leading line comments within the first 12 lines are checked; display titles are sanitized and capped at 120 Unicode code points. Missing titles retain legacy summaries. Comments are model-authored intent, not proof of behavior or a security guarantee. Model compliance is not guaranteed.

Expanded details remain available. Pi manages inline images separately, so hiding successful text output does not suppress all images.

## Private machine state stays outside Git

Keep live `settings.json`, `mcp.json`, credentials, OAuth tokens, model/provider configuration, sessions, caches, logs, and shared skills in their normal locations under `~/.pi/agent` and `~/.agents/skills`. This package does not own them or overwrite them. Settings examples intentionally omit model defaults, device IDs, machine paths, and internal MCP integrations.

No third-party skills are vendored. The Pi-derived theme's upstream MIT notice is preserved in `THIRD_PARTY_NOTICES.md`. No repository-wide redistribution license is selected yet. Review secrets and machine-specific assumptions before committing.

## References

- [Pi](https://github.com/earendil-works/pi)
- [Rex](https://www.superlogical.com/rex/docs)
- [Exa MCP](https://github.com/exa-labs/exa-mcp-server)
