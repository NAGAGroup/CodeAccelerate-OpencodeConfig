/**
 * Shared plugin dependencies passed to all modules.
 * Avoids global state by threading context explicitly.
 */
export interface PluginDeps {
  /** OpenCode API client for session.prompt calls. */
  client: any;
  /** Resolve the worktree path (always process.cwd() in current impl). */
  resolveWorktree: (ctx: { worktree?: string }) => string;
  /** Per-turn flag: true if a DAG is active for this session. */
  dagActiveThisTurn: () => boolean;
  /** Set the per-turn DAG active flag. */
  setDagActiveThisTurn: (value: boolean) => void;
  /** The raw plugin context (_ctx) for hooks that need it. */
  pluginCtx: { worktree?: string };
}
