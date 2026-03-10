import { type Plugin, type PluginContext, tool } from "@opencode-ai/plugin";
import * as fs from "fs/promises";
import * as path from "path";

// ─── Types ────────────────────────────────────────────────────────────────────

type DiagramColors = {
  bg: string;
  fg: string;
  line?: string;
  accent?: string;
  muted?: string;
  surface?: string;
  border?: string;
};

type RenderFormat = "ascii" | "svg" | "source";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const resolveOutputPath = (outputPath: string, directory: string): string =>
  path.isAbsolute(outputPath) ? outputPath : path.join(directory, outputPath);

const wrapMermaidSource = (diagram: string): string =>
  "```mermaid\n" + diagram.trim() + "\n```";

const detectDiagramType = (diagram: string): string => {
  const trimmed = diagram.trim();
  if (trimmed.startsWith("graph ") || trimmed.startsWith("flowchart "))
    return "flowchart";
  if (trimmed.startsWith("sequenceDiagram")) return "sequence";
  if (trimmed.startsWith("classDiagram")) return "class";
  if (trimmed.startsWith("stateDiagram")) return "state";
  if (trimmed.startsWith("erDiagram")) return "er";
  if (trimmed.startsWith("gantt")) return "gantt";
  if (trimmed.startsWith("pie")) return "pie";
  if (trimmed.startsWith("xychart")) return "xychart";
  return "unknown";
};

const getValidationSuggestion = (errorMsg: string): string | undefined => {
  if (errorMsg.includes("Parse error")) {
    return "Check syntax — ensure arrows (-->, ->>, ---), brackets, and keywords are correct.";
  }
  if (errorMsg.includes("Unknown diagram type")) {
    return "Start with a valid type: graph TD, flowchart LR, sequenceDiagram, classDiagram, stateDiagram-v2, erDiagram, gantt, pie, xychart-beta.";
  }
  if (errorMsg.includes("Lexical error")) {
    return "A character or token is not valid in this position. Check quotes, brackets, and special characters.";
  }
  return undefined;
};

const resolveTheme = (
  themes: Record<string, DiagramColors>,
  themeName?: string,
  customTheme?: Record<string, string>,
): DiagramColors | undefined => {
  if (customTheme) return customTheme as DiagramColors;
  if (!themeName) return undefined;
  if (themes[themeName]) return themes[themeName];
  throw new Error(
    `Unknown theme: "${themeName}". Available: ${Object.keys(themes).join(", ")}`,
  );
};

// ─── Session Prompt ───────────────────────────────────────────────────────────

const SESSION_DIAGRAM_GUIDANCE = `\
## Diagram Rendering Guideline

When you would naturally draw a diagram, flowchart, or ASCII art to illustrate something, \
use the \`mermaid_render\` tool instead. This produces clean, properly aligned diagrams.

Choose the format based on context:
- \`ascii\` — display a diagram inline in chat (most common)
- \`svg\` — save a diagram to a file for use in a webpage or UI (requires outputPath)
- \`source\` — write a mermaid codeblock to a markdown file for GitHub rendering

Do this proactively — don't wait to be asked.`;

// ─── Plugin ───────────────────────────────────────────────────────────────────

export const MermaidPlugin: Plugin = async ({
  directory,
  client,
}: PluginContext) => {
  let lib: any = null;

  const loadLib = async () => {
    if (!lib) {
      try {
        lib = await import("beautiful-mermaid");
      } catch {
        throw new Error(
          "beautiful-mermaid not found. Run: npm install beautiful-mermaid",
        );
      }
    }
    return lib;
  };

  return {
    "session.created": async (event: any) => {
      const sessionId = event.properties?.sessionID;
      if (!sessionId) return;
      try {
        await client.session.prompt({
          path: { id: sessionId },
          body: {
            noReply: true,
            parts: [
              { type: "text", text: SESSION_DIAGRAM_GUIDANCE, synthetic: true },
            ],
          },
        });
      } catch {
        // Non-fatal: session prompt injection failed silently
      }
    },

    tool: {
      mermaid_render: tool({
        description: `Render a Mermaid diagram to one of three formats — choose based on where the output will be used:

- **ascii** (default): Unicode box-art diagram for display directly in chat. Use this when presenting a diagram inline in a response.
- **svg**: Full vector graphic saved to a file. Use this when the diagram is destined for a webpage, UI, or design asset. Requires \`outputPath\`.
- **source**: Validates the diagram and returns a \`\`\`mermaid\`\`\` codeblock. Use this when writing to a markdown file that will be rendered by GitHub, GitLab, or a mermaid-aware viewer.

Available themes: zinc-light, zinc-dark, tokyo-night, tokyo-night-storm, tokyo-night-light, catppuccin-mocha, catppuccin-latte, nord, nord-light, dracula, github-light, github-dark, solarized-light, solarized-dark, one-dark

Theme only applies to \`svg\` format. For \`ascii\`, the diagram renders with Unicode line art. For \`source\`, no rendering occurs.`,
        args: {
          diagram: tool.schema
            .string()
            .describe("Mermaid diagram source code to render"),
          format: tool.schema
            .enum(["ascii", "svg", "source"])
            .describe(
              'Output format: "ascii" for inline chat display, "svg" for file output, "source" for GitHub markdown codeblock',
            )
            .default("ascii"),
          theme: tool.schema
            .string()
            .describe(
              'Named theme for svg format (e.g. "github-dark", "catppuccin-mocha"). See available themes in tool description.',
            )
            .optional(),
          customTheme: tool.schema
            .record(tool.schema.string(), tool.schema.string())
            .describe(
              "Custom theme colors for svg format. Keys: bg, fg, line, accent, muted, surface, border.",
            )
            .optional(),
          outputPath: tool.schema
            .string()
            .describe(
              'File path to save the output. Required for "svg" format. Optional for "ascii" and "source". Relative paths resolve from the project directory.',
            )
            .optional(),
        },
        async execute(args, context) {
          try {
            const {
              format = "ascii",
              diagram,
              theme,
              customTheme,
              outputPath,
            } = args;

            if (format === "source") {
              // Validate then return wrapped codeblock — no rendering needed
              const { parseMermaid } = await loadLib();
              try {
                parseMermaid(diagram);
              } catch (parseError: any) {
                const errorMsg = parseError.message || String(parseError);
                return JSON.stringify(
                  {
                    success: false,
                    error: `Invalid diagram — cannot produce source block: ${errorMsg}`,
                    suggestion: getValidationSuggestion(errorMsg),
                  },
                  null,
                  2,
                );
              }

              const codeblock = wrapMermaidSource(diagram);

              if (outputPath) {
                const absPath = resolveOutputPath(outputPath, directory);
                await fs.mkdir(path.dirname(absPath), { recursive: true });
                await fs.writeFile(absPath, codeblock, "utf-8");
                return JSON.stringify(
                  {
                    success: true,
                    format,
                    outputPath: absPath,
                    content: codeblock,
                  },
                  null,
                  2,
                );
              }

              return JSON.stringify(
                { success: true, format, content: codeblock },
                null,
                2,
              );
            }

            if (format === "ascii") {
              const { renderMermaidASCII } = await loadLib();
              const output = renderMermaidASCII(diagram, { colorMode: "none" });

              if (outputPath) {
                const absPath = resolveOutputPath(outputPath, directory);
                await fs.mkdir(path.dirname(absPath), { recursive: true });
                await fs.writeFile(absPath, output, "utf-8");
                return JSON.stringify(
                  {
                    success: true,
                    format,
                    outputPath: absPath,
                    content: output,
                  },
                  null,
                  2,
                );
              }

              return JSON.stringify(
                { success: true, format, content: output },
                null,
                2,
              );
            }

            if (format === "svg") {
              const { renderMermaidSVG, THEMES } = await loadLib();
              const themeColors = resolveTheme(THEMES, theme, customTheme);
              const svg = renderMermaidSVG(diagram, themeColors);

              if (!outputPath) {
                return JSON.stringify(
                  {
                    success: false,
                    error:
                      "outputPath is required for svg format — SVG content cannot be displayed in a terminal.",
                    suggestion:
                      'Provide an outputPath to save the SVG file, e.g. "assets/diagram.svg"',
                  },
                  null,
                  2,
                );
              }

              const absPath = resolveOutputPath(outputPath, directory);
              await fs.mkdir(path.dirname(absPath), { recursive: true });
              await fs.writeFile(absPath, svg, "utf-8");
              return JSON.stringify(
                { success: true, format, outputPath: absPath },
                null,
                2,
              );
            }

            return JSON.stringify(
              { success: false, error: `Unknown format: ${format}` },
              null,
              2,
            );
          } catch (error: any) {
            return JSON.stringify(
              { success: false, error: error.message || String(error) },
              null,
              2,
            );
          }
        },
      }),

      mermaid_validate: tool({
        description: `Validate Mermaid diagram syntax without rendering.

Use this when:
- The diagram source was written by a user and you want to check it before writing to a file
- A render attempt failed and you need a clearer error message
- You're using "source" format and want to confirm the diagram is valid before committing it

Returns: validity status, detected diagram type, and an actionable suggestion if invalid.`,
        args: {
          diagram: tool.schema
            .string()
            .describe("Mermaid diagram source code to validate"),
        },
        async execute(args, context) {
          try {
            const { parseMermaid } = await loadLib();
            const diagramType = detectDiagramType(args.diagram);

            try {
              parseMermaid(args.diagram);
              return JSON.stringify(
                { success: true, valid: true, diagramType },
                null,
                2,
              );
            } catch (parseError: any) {
              const errorMsg = parseError.message || String(parseError);
              return JSON.stringify(
                {
                  success: true,
                  valid: false,
                  diagramType,
                  error: errorMsg,
                  suggestion: getValidationSuggestion(errorMsg),
                },
                null,
                2,
              );
            }
          } catch (error: any) {
            return JSON.stringify(
              { success: false, error: error.message || String(error) },
              null,
              2,
            );
          }
        },
      }),

      mermaid_themes: tool({
        description: `List all available built-in themes with their color palettes.

Use this when selecting a theme for svg rendering and you want to see the available options and their colors. Theme names can be passed directly to the \`theme\` parameter of \`mermaid_render\`.

Dark themes: zinc-dark, tokyo-night, tokyo-night-storm, catppuccin-mocha, dracula, github-dark, solarized-dark, one-dark, nord
Light themes: zinc-light, tokyo-night-light, catppuccin-latte, github-light, solarized-light, nord-light`,
        args: {},
        async execute(args, context) {
          try {
            const { THEMES } = await loadLib();
            const themes = Object.entries(
              THEMES as Record<string, DiagramColors>,
            ).map(([name, colors]) => ({ name, colors }));
            return JSON.stringify({ success: true, themes }, null, 2);
          } catch (error: any) {
            return JSON.stringify(
              { success: false, error: error.message || String(error) },
              null,
              2,
            );
          }
        },
      }),
    },
  };
};
