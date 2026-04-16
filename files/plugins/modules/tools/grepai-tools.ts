import { tool } from "@opencode-ai/plugin";
import type { PluginDeps } from "../deps";

/** Run a grepai CLI command in the given cwd and return stdout as a string. */
function runGrepai(args: string[], cwd: string): string {
  const result = Bun.spawnSync(["grepai", ...args], {
    cwd,
    stdout: "pipe",
    stderr: "pipe",
  });
  const out = result.stdout.toString().trim();
  const err = result.stderr.toString().trim();
  if (result.exitCode !== 0) {
    return err
      ? `grepai error (exit ${result.exitCode}): ${err}`
      : `grepai exited with code ${result.exitCode}`;
  }
  return out || "(no output)";
}

export function createGrepaiTools(deps: PluginDeps) {
  const { resolveWorktree } = deps;

  return {
    smart_grep_index_status: tool({
      description: "Check if the semantic search index is ready. Call this before using smart_grep_search to confirm the index is populated — if it is empty, smart_grep_search will return no results.",
      args: {},
      async execute(_args, context) {
        return runGrepai(["status"], resolveWorktree(context));
      },
    }),

    smart_grep_search: tool({
      description: "Find any code, function, config, or pattern using plain English. Faster and smarter than text search — describe what you're looking for and smart_grep finds it across the entire codebase, even if you don't know the exact filename or symbol name. Use path to narrow results to a specific file or directory.",
      args: {
        query: tool.schema.string().describe("Plain-language description of what you're looking for"),
        path: tool.schema.string().optional().describe("File or directory path to restrict the search to"),
        limit: tool.schema.number().optional().describe("Maximum number of results (default: 10)"),
      },
      async execute({ query, path: pathArg, limit }, context) {
        const args = ["search", query];
        if (pathArg) args.push("--path", pathArg);
        if (limit !== undefined) args.push("--limit", String(limit));
        return runGrepai(args, resolveWorktree(context));
      },
    }),

    smart_grep_trace_callers: tool({
      description: "Find every place in the codebase that calls a function or method. Use this before modifying anything to understand blast radius — who will be affected by changes to this symbol.",
      args: {
        symbol: tool.schema.string().describe("Function or method name to find callers for"),
      },
      async execute({ symbol }, context) {
        return runGrepai(["trace", "callers", symbol], resolveWorktree(context));
      },
    }),

    smart_grep_trace_callees: tool({
      description: "Find everything a function or method calls. Use this to understand what a symbol depends on without reading every line of code.",
      args: {
        symbol: tool.schema.string().describe("Function or method name to find callees for"),
      },
      async execute({ symbol }, context) {
        return runGrepai(["trace", "callees", symbol], resolveWorktree(context));
      },
    }),

    smart_grep_trace_graph: tool({
      description: "Get the complete call graph around a function — both who calls it and what it calls — in a single view. Use this to trace execution flow, understand the full dependency chain, or map the impact of a change.",
      args: {
        symbol: tool.schema.string().describe("Function or method name to build the call graph for"),
        depth: tool.schema.number().optional().describe("How many levels deep to traverse (default: 2)"),
      },
      async execute({ symbol, depth }, context) {
        const args = ["trace", "graph", symbol];
        if (depth !== undefined) args.push("--depth", String(depth));
        return runGrepai(args, resolveWorktree(context));
      },
    }),
  };
}
