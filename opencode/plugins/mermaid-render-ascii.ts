import { type Plugin, tool } from "@opencode-ai/plugin"
import * as fs from "fs/promises"
import * as path from "path"

export const MermaidRenderAsciiPlugin: Plugin = async (ctx) => {
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
      mermaid_render_ascii: tool({
        description: `Renders a Mermaid diagram to ASCII/Unicode format for terminal display or plain-text documentation.
Best for simple flowcharts and graphs. Complex diagrams may not render well in ASCII.

Uses Unicode box-drawing characters by default for better appearance.
Set useAscii=true for pure ASCII characters (more compatible but less pretty).`,
        args: {
          diagram: tool.schema.string().describe("Mermaid diagram code to render (required)"),
          useAscii: tool.schema.boolean().describe("Use ASCII characters instead of Unicode (default: false)").optional(),
          paddingX: tool.schema.number().describe("Horizontal spacing between nodes (default: 5)").optional(),
          paddingY: tool.schema.number().describe("Vertical spacing between nodes (default: 5)").optional(),
          boxBorderPadding: tool.schema.number().describe("Padding inside node boxes (default: 1)").optional(),
          outputPath: tool.schema.string().describe("File path to save ASCII output (optional). Relative paths are resolved from project directory.").optional(),
          returnContent: tool.schema.boolean().describe("Return ASCII string in output (default: true)").optional(),
        },
        async execute(args, context) {
          try {
            const lib = await loadMermaidLib()
            const { renderMermaidAscii } = lib

            // Build options
            const options: any = {}
            if (args.useAscii !== undefined) options.useAscii = args.useAscii
            if (args.paddingX !== undefined) options.paddingX = args.paddingX
            if (args.paddingY !== undefined) options.paddingY = args.paddingY
            if (args.boxBorderPadding !== undefined) options.boxBorderPadding = args.boxBorderPadding

            // Render ASCII (synchronous function)
            const ascii = renderMermaidAscii(args.diagram, options)

            // Save to file if requested
            let savedPath = undefined
            if (args.outputPath) {
              const absolutePath = path.isAbsolute(args.outputPath)
                ? args.outputPath
                : path.join(directory, args.outputPath)

              await fs.mkdir(path.dirname(absolutePath), { recursive: true })
              await fs.writeFile(absolutePath, ascii, "utf-8")
              savedPath = absolutePath
            }

            // Build response
            const response: any = { success: true }
            if (args.returnContent !== false) {
              response.asciiContent = ascii
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
