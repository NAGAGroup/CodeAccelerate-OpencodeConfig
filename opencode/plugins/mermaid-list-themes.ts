import { type Plugin, tool } from "@opencode-ai/plugin"

export const MermaidListThemesPlugin: Plugin = async (ctx) => {
  // Lazy-load beautiful-mermaid
  let mermaidLib: any = null

  async function loadMermaidLib() {
    if (!mermaidLib) {
      try {
        mermaidLib = await import("beautiful-mermaid")
      } catch (error) {
        throw new Error(
          "beautiful-mermaid library not found. Install with: npm install beautiful-mermaid",
        )
      }
    }
    return mermaidLib
  }

  return {
    tool: {
      mermaid_list_themes: tool({
        description: `Lists all available built-in themes with preview colors.
Useful for discovering theme options before rendering diagrams.

Returns theme names and their color schemes.`,
        args: {},
        async execute(args, context) {
          try {
            const lib = await loadMermaidLib()
            const { THEMES } = lib

            const themes = Object.entries(THEMES).map(
              ([name, colors]: [string, any]) => ({
                name,
                colors: {
                  bg: colors.bg,
                  fg: colors.fg,
                  line: colors.line,
                  accent: colors.accent,
                  muted: colors.muted,
                },
              }),
            )

            return JSON.stringify({ themes }, null, 2)
          } catch (error: any) {
            return JSON.stringify({ error: error.message || String(error) }, null, 2)
          }
        },
      }),
    },
  }
}
