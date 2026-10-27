// Presentation only: collapsed tools occupy one line; Ctrl+O keeps native details.
import { homedir } from "node:os";
import { stripVTControlCharacters } from "node:util";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Text, truncateToWidth } from "@earendil-works/pi-tui";

const inline = (value: unknown) => stripVTControlCharacters(String(value ?? ""))
  .replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g, " ")
  .replace(/\s+/g, " ").trim();
const empty = { render: (_width: number): string[] => [], invalidate() {} };

// Model-authored display metadata, not a security guarantee or execution summary.
// Only leading line comments are supported; block comments deliberately stop the scan.
function intentTitle(source: unknown, javascript: boolean): string | undefined {
  if (typeof source !== "string") return undefined;
  const marker = javascript ? "//" : "#";
  for (const line of source.split(javascript ? /\r\n|[\n\r\u2028\u2029]/ : /\r?\n/, 12)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (!javascript && trimmed.startsWith("#!")) continue;
    if (!trimmed.startsWith(marker)) break;
    const match = trimmed.slice(marker.length).match(/^\s*title:\s*(.+)$/i);
    if (match) return Array.from(inline(match[1])).slice(0, 120).join("") || undefined;
  }
  return undefined;
}

function summarize(name: string, args: Record<string, unknown>): string {
  const path = typeof args.path === "string"
    ? (args.path.startsWith(`${homedir()}/`) ? `~/${args.path.slice(homedir().length + 1)}` : args.path)
    : "";
  if (name === "bash" || name === "powershell") {
    const title = intentTitle(args.command, false);
    if (title) return `${name} · ${title}`;
    const command = String(args.command ?? "").split(/\r?\n/).find(line => line.trim()) ?? "";
    return `${name} ${inline(command)}`;
  }
  if (name === "write") {
    const lines = typeof args.content === "string" ? args.content.split("\n").length : undefined;
    return `write ${inline(path)}${lines ? ` (${lines} lines)` : ""}`;
  }
  if (name === "edit") {
    const count = Array.isArray(args.edits) ? args.edits.length : undefined;
    return `edit ${inline(path)}${count ? ` (${count} ${count === 1 ? "change" : "changes"})` : ""}`;
  }
  if (name === "read") return `read ${inline(path)}${args.offset ? `:${inline(args.offset)}` : ""}`;
  if (name === "codemode") {
    const title = intentTitle(args.code, true);
    return title ? `codemode · ${title}` : "codemode";
  }
  // Unknown tools may carry sensitive/huge arguments; show details only on expansion.
  return inline(name);
}

export default function compactTools(pi: ExtensionAPI) {
  pi.on("before_agent_start", event => {
    event.systemPromptOptions.sections.tool_intent_labels = [
      "For codemode, bash, and powershell calls, include a short human-readable intent title (about 3–8 words) in a leading source comment.",
      "Codemode: // title: Check browser profile support. If using // @options:, keep that as the first line and put the title immediately after it.",
      "Bash/PowerShell: # title: Run authentication regression tests. Preserve any required shebang as the first line.",
      "Describe the intended action, not a claimed result. Do not include credentials or sensitive values in titles. These are display labels only; the actual code remains authoritative.",
      "Use ordinary comments, not a new tool argument or an @options field. Omit the title if a tool's input format does not permit comments.",
    ].join("\n");
  });
  pi.registerToolRenderer((name, next) => {
    const original = next();
    return {
      renderShell: "self",
      renderCall(args, theme, ctx) {
        if (ctx.expanded) {
          return original?.renderCall?.(args, theme, ctx)
            ?? new Text(`${name}\n${JSON.stringify(args, null, 2)}`, ctx.outputPad, 0);
        }
        const status = ctx.isError ? "error" : ctx.isPartial
          ? (ctx.executionStarted ? "running" : "queued") : "done";
        const duration = ctx.durationMs == null ? "" : ` ${(ctx.durationMs / 1000).toFixed(1)}s`;
        const label = `${summarize(name, args ?? {})} · ${status}${duration}`;
        return {
          invalidate() {},
          render(width: number): string[] {
            const pad = Math.min(ctx.outputPad, Math.max(0, width - 1));
            return width <= 0 ? [] : [" ".repeat(pad) + truncateToWidth(theme.fg(ctx.isError ? "error" : "toolTitle", label), width - pad)];
          },
        };
      },
      renderResult(result, options, theme, ctx) {
        if (options.expanded) {
          return original?.renderResult?.(result, options, theme, ctx)
            ?? new Text(result.content.filter(block => block.type === "text").map(block => block.text).join("\n"), ctx.outputPad, 0);
        }
        if (!ctx.isError) return empty;
        const message = result.content.filter(block => block.type === "text").map(block => block.text).join("\n");
        const first = message.split(/\r?\n/).find(line => line.trim()) ?? "Tool failed; Ctrl+O for details";
        return {
          invalidate() {},
          render(width: number): string[] {
            const pad = Math.min(ctx.outputPad, Math.max(0, width - 1));
            return width <= 0 ? [] : [" ".repeat(pad) + truncateToWidth(theme.fg("error", inline(first)), width - pad)];
          },
        };
      },
    };
  });
}
