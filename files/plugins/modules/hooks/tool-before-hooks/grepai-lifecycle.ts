import * as fs from "fs";
import * as path from "path";

/**
 * Ensure grepai is initialized and the background watcher is running for the given project directory.
 *
 * - If .grepai/ does not exist: runs `grepai init -p ollama --yes` synchronously.
 * - Always attempts `grepai watch --background` (grepai handles the case where it's already running).
 * - Never throws — failures are soft (grepai may not be installed, Ollama may not be ready).
 *   Agents will still get useful error messages from the tools themselves if the index is unavailable.
 */
export function ensureGrepai(worktree: string): void {
  try {
    const grepaiDir = path.join(worktree, ".grepai");

    if (!fs.existsSync(grepaiDir)) {
      // First time for this project — build the index. This blocks until complete.
      Bun.spawnSync(["grepai", "init", "-p", "ollama", "--yes"], {
        cwd: worktree,
        stdout: "pipe",
        stderr: "pipe",
      });
    }

    // Start background watcher. If already running, grepai exits cleanly.
    Bun.spawn(["grepai", "watch", "--background"], {
      cwd: worktree,
      stdout: "pipe",
      stderr: "pipe",
    });
  } catch {
    // Soft failure — grepai not installed or Ollama unavailable.
    // Agents will surface errors through tool calls when they try to search.
  }
}
