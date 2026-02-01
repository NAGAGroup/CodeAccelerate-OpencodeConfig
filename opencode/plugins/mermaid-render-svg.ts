import { type Plugin, tool } from "@opencode-ai/plugin"
import * as fs from "fs/promises"
import * as path from "path"

export const MermaidRenderSvgPlugin: Plugin = async (ctx) => {
  const { directory } = ctx

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
      mermaid_render_svg: tool({
        description: `Renders a Mermaid diagram to SVG format with optional theming.
Supports all Mermaid diagram types: flowchart, sequence, class, state, and ER diagrams.
Can save to file or return SVG content directly.

Available themes: zinc-dark, tokyo-night, tokyo-night-storm, tokyo-night-light, 
catppuccin-mocha, catppuccin-latte, nord, nord-light, dracula, github-light, 
github-dark, solarized-light, solarized-dark, one-dark

Use custom colors by providing customTheme object with bg, fg, line, accent, muted, surface, border properties.`,
        args: {
          diagram: tool.schema.string().describe("Mermaid diagram code to render (required)"),
          theme: tool.schema.string().describe("Theme name from available themes (optional). Leave empty for default or use customTheme for custom colors.").optional(),
          customTheme: tool.schema.record(tool.schema.string(), tool.schema.string()).describe("Custom theme colors object. Keys: bg, fg, line, accent, muted, surface, border (all optional except bg/fg)").optional(),
          outputPath: tool.schema.string().describe("File path to save SVG (optional). Relative paths are resolved from project directory.").optional(),
          returnContent: tool.schema.boolean().describe("Return SVG string in output (default: true)").optional(),
        },
        async execute(args, context) {
          try {
            const lib = await loadMermaidLib()
            const { renderMermaid, THEMES } = lib

            // Determine theme options
            let themeConfig = undefined
            if (args.customTheme) {
              themeConfig = args.customTheme
            } else if (args.theme) {
              if (THEMES[args.theme]) {
                themeConfig = THEMES[args.theme]
              } else {
                const availableThemes = Object.keys(THEMES).join(", ")
                throw new Error(`Unknown theme: ${args.theme}. Available: ${availableThemes}`)
              }
            }

            // Render SVG
            const svg = await renderMermaid(args.diagram, themeConfig)

            // Save to file if requested
            let savedPath = undefined
            if (args.outputPath) {
              const absolutePath = path.isAbsolute(args.outputPath)
                ? args.outputPath
                : path.join(directory, args.outputPath)

              await fs.mkdir(path.dirname(absolutePath), { recursive: true })
              await fs.writeFile(absolutePath, svg, "utf-8")
              savedPath = absolutePath
            }

            // Build response
            const response: any = { success: true }
            if (args.returnContent !== false) {
              response.svgContent = svg
            }
            if (savedPath) {
              response.outputPath = savedPath
            }

            return JSON.stringify(response, null, 2)
          } catch (error: any) {
            return JSON.stringify({ success: false, error: error.message || String(error) }, null, 2)
          }
        },
      }),
    },
  }
}
