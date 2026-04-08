import * as fs from "fs";
import * as path from "path";
import type { DagSessionState } from "./types";

/**
 * Get the path to the DAG state file for a specific session.
 * Each session gets its own state file keyed by sessionID to prevent
 * cross-session state bleed when multiple sessions run concurrently.
 */
export function dagStatePath(worktree: string, sessionID: string): string {
  const safeId = sessionID.replace(/[^a-zA-Z0-9_-]/g, "_");
  return path.join(worktree, ".opencode", "dag-state", `${safeId}.json`);
}

export function writeState(statePath: string, state: DagSessionState): void {
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2), "utf-8");
}

export function readState(statePath: string): DagSessionState | null {
  if (!fs.existsSync(statePath)) return null;
  return JSON.parse(fs.readFileSync(statePath, "utf-8")) as DagSessionState;
}

export function now(): string {
  return new Date().toISOString();
}
