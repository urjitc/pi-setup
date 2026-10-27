// Local workaround: Rex currently has no official Pi startup hook.
// Keep status reporting native to Pi; this adds context only, without UI noise.
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function rexContext(pi: ExtensionAPI) {
  let context = "";

  pi.on("session_start", async () => {
    context = "";
    if (!process.env.REX_SESSION || !process.env.REX_BLOCK) return;
    try {
      const result = await pi.exec(
        "rex",
        ["__internal", "session-start", "--agent", "pi", "--feature-session-naming=false"],
        { timeout: 3000 },
      );
      if (result.code === 0 && !result.killed) context = result.stdout.trim();
    } catch {
      // Missing/unavailable Rex must never prevent Pi from starting.
    }
  });

  pi.on("before_agent_start", (event) => {
    if (context) event.systemPromptOptions.sections.rex_environment = context;
  });

  pi.on("session_shutdown", () => {
    context = "";
  });
}
