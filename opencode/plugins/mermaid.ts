import { type Plugin, tool } from "@opencode-ai/plugin";
import * as fs from "fs/promises";
import { createLazyLoader, resolveAbsolutePath, successResponse, errorResponse } from "../lib/utils";
import * as path from "path";

export const MermaidPlugin: Plugin = async (ctx) => {
  const { directory } = ctx;
  const loadMermaid = createLazyLoader("beautiful-mermaid");

  return {
    tool: {
      mermaid_list_themes: tool({
        description: `Lists all available built-in themes with preview colors.
Useful for discovering theme options before rendering diagrams.

Returns theme names and their color schemes.`,
        args: {},
        async execute(args, context) {
          try {
            const lib = await loadMermaid();
            const { THEMES } = lib;

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
            );

            return successResponse({ themes });
          } catch (error: any) {
            return errorResponse(error);
          }
        },
      }),

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
            const lib = await loadMermaid();
            const { renderMermaid } = lib;

            const trimmed = args.diagram.trim();
            let diagramType = "unknown";

            if (trimmed.startsWith("graph ") || trimmed.startsWith("flowchart ")) {
              diagramType = "flowchart";
            } else if (trimmed.startsWith("sequenceDiagram")) {
              diagramType = "sequence";
            } else if (trimmed.startsWith("classDiagram")) {
              diagramType = "class";
            } else if (trimmed.startsWith("stateDiagram")) {
              diagramType = "state";
            } else if (trimmed.startsWith("erDiagram")) {
              diagramType = "er";
            }

            try {
              await renderMermaid(args.diagram);
              return successResponse({ valid: true, diagramType });
            } catch (renderError: any) {
              let suggestion = undefined;
              const errorMsg = renderError.message || String(renderError);

              if (errorMsg.includes("Parse error")) {
                suggestion = "Check your syntax - ensure arrows (-->, ->>), brackets, and keywords are correct";
              } else if (errorMsg.includes("Unknown diagram type")) {
                suggestion = "Start your diagram with: graph TD, sequenceDiagram, classDiagram, stateDiagram-v2, or erDiagram";
              }

              return successResponse({
                valid: false,
                diagramType,
                error: errorMsg,
                suggestion,
              });
            }
          } catch (error: any) {
            return errorResponse(error);
          }
        },
      }),

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
            const lib = await loadMermaid();
            const { renderMermaid, THEMES } = lib;

            let themeConfig = undefined;
            if (args.customTheme) {
              themeConfig = args.customTheme;
            } else if (args.theme) {
              if (THEMES[args.theme]) {
                themeConfig = THEMES[args.theme];
              } else {
                const availableThemes = Object.keys(THEMES).join(", ");
                throw new Error(`Unknown theme: ${args.theme}. Available: ${availableThemes}`);
              }
            }

            const svg = await renderMermaid(args.diagram, themeConfig);

            let savedPath = undefined;
            if (args.outputPath) {
              const absolutePath = resolveAbsolutePath(args.outputPath, directory);
              await fs.mkdir(path.dirname(absolutePath), { recursive: true });
              await fs.writeFile(absolutePath, svg, "utf-8");
              savedPath = absolutePath;
            }

            const response: any = {};
            if (args.returnContent !== false) {
              response.svgContent = svg;
            }
            if (savedPath) {
              response.outputPath = savedPath;
            }

            return successResponse(response);
          } catch (error: any) {
            return errorResponse(error);
          }
        },
      }),

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
            const lib = await loadMermaid();
            const { renderMermaidAscii } = lib;

            const options: any = {};
            if (args.useAscii !== undefined) options.useAscii = args.useAscii;
            if (args.paddingX !== undefined) options.paddingX = args.paddingX;
            if (args.paddingY !== undefined) options.paddingY = args.paddingY;
            if (args.boxBorderPadding !== undefined) options.boxBorderPadding = args.boxBorderPadding;

            const ascii = renderMermaidAscii(args.diagram, options);

            let savedPath = undefined;
            if (args.outputPath) {
              const absolutePath = resolveAbsolutePath(args.outputPath, directory);
              await fs.mkdir(path.dirname(absolutePath), { recursive: true });
              await fs.writeFile(absolutePath, ascii, "utf-8");
              savedPath = absolutePath;
            }

            const response: any = {};
            if (args.returnContent !== false) {
              response.asciiContent = ascii;
            }
            if (savedPath) {
              response.outputPath = savedPath;
            }

            return successResponse(response);
          } catch (error: any) {
            return errorResponse(error);
          }
        },
      }),
    },
  };
};
