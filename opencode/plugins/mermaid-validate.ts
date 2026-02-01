import { type Plugin, tool } from "@opencode-ai/plugin"

export const MermaidValidatePlugin: Plugin = async (ctx) => {
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
      mermaid_validate: tool({
        description: `Validates Mermaid diagram syntax without rendering.
Provides helpful error messages for debugging diagram code.

Attempts to detect the diagram type and common syntax errors.
Note: This is a basic validation - some errors may only be caught during rendering.`,
        args: {
          diagram: tool.schema.string().describe("Mermaid diagram code to validate"),
        },
        async execute(args, context) {
          try {
            const lib = await loadMermaidLib()
            const { renderMermaid } = lib

            // Detect diagram type
            const trimmed = args.diagram.trim()
            let diagramType = "unknown"

            if (trimmed.startsWith("graph ") || trimmed.startsWith("flowchart ")) {
              diagramType = "flowchart"
            } else if (trimmed.startsWith("sequenceDiagram")) {
              diagramType = "sequence"
            } else if (trimmed.startsWith("classDiagram")) {
              diagramType = "class"
            } else if (trimmed.startsWith("stateDiagram")) {
              diagramType = "state"
            } else if (trimmed.startsWith("erDiagram")) {
              diagramType = "er"
            }

            // Try to render to validate syntax
            try {
              await renderMermaid(args.diagram)
              return JSON.stringify({ valid: true, diagramType }, null, 2)
            } catch (renderError: any) {
              // Provide helpful suggestions based on common errors
              let suggestion = undefined
              const errorMsg = renderError.message || String(renderError)

              if (errorMsg.includes("Parse error")) {
                suggestion = "Check your syntax - ensure arrows (-->, ->>), brackets, and keywords are correct"
              } else if (errorMsg.includes("Unknown diagram type")) {
                suggestion = "Start your diagram with: graph TD, sequenceDiagram, classDiagram, stateDiagram-v2, or erDiagram"
              }

              return JSON.stringify(
                {
                  valid: false,
                  diagramType,
                  error: errorMsg,
                  suggestion,
                },
                null,
                2,
              )
            }
          } catch (error: any) {
            return JSON.stringify(
              {
                valid: false,
                error: error.message || String(error),
              },
              null,
              2,
            )
          }
        },
      }),
    },
  }
}
