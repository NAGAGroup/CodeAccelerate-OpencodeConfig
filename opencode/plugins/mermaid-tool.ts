import { tool } from "@opencode-ai/plugin/tool"
import type { Hooks, PluginInput } from "@opencode-ai/plugin"
import { renderMermaid, renderMermaidAscii } from "beautiful-mermaid"

export default async (ctx: PluginInput): Promise<Hooks> => {
  return {
    tool: {
      render_mermaid: tool({
        description:
          "Render a Mermaid diagram. Use 'ascii' for terminal/chat (returns unicode box-drawing art), 'svg' for SVG markup, or 'markdown' to wrap the source in a ```mermaid fenced code block for GitHub rendering.",
        args: {
          diagram: tool.schema
            .string()
            .describe("Mermaid diagram source code (e.g. 'graph LR; A-->B')"),
          format: tool.schema
            .enum(["ascii", "svg", "markdown"])
            .describe(
              "Output format: ascii (unicode art, flowcharts only), svg (SVG string), or markdown (GitHub-renderable fenced block)",
            ),
        },
        execute: async ({ diagram, format }, context) => {
          try {
            if (format === "markdown") {
              return `\`\`\`mermaid\n${diagram}\n\`\`\``
            }

            if (format === "ascii") {
              let text: string
              try {
                text = renderMermaidAscii(diagram)
              } catch {
                // ASCII only supports flowcharts — fall back to markdown
                text = `\`\`\`mermaid\n${diagram}\n\`\`\``
              }
              // Strip ANSI color codes — TUI renders plain text, not terminal sequences
              const stripped = text.replace(/\x1B\[[0-9;]*m/g, "")
              await ctx.client.session.prompt({
                path: { id: context.sessionID },
                body: {
                  noReply: true,
                  parts: [{ type: "text", text: stripped }],
                },
              })
              return "Diagram rendered and injected into conversation."
            }

            // format === "svg"
            return await renderMermaid(diagram)
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error)
            return `Error rendering diagram: ${message}`
          }
        },
      }),
    },
  }
}
