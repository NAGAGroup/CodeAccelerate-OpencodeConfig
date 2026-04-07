import * as fs from "fs";
import * as path from "path";
import type { DagSessionStateV3 } from "./types";

/**
 * Get the path to the DAG state file for a specific session.
 * Each session gets its own state file keyed by sessionID to prevent
 * cross-session state bleed when multiple sessions run concurrently.
 */
export function dagStatePath(planPath: string, sessionID: string): string {
  const safeId = sessionID.replace(/[^a-zA-Z0-9_-]/g, "_");
  return path.join(path.dirname(planPath), ".opencode", "dag-state", `${safeId}.json`);
}

/**
 * Write state to a standalone file (for backward compatibility or migration)
 */
export function writeState(statePath: string, state: DagSessionStateV3): void {
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2), "utf-8");
}

/**
 * Read state from a standalone file
 */
export function readState(statePath: string): DagSessionStateV3 | null {
  if (!fs.existsSync(statePath)) return null;
  return JSON.parse(fs.readFileSync(statePath, "utf-8")) as DagSessionStateV3;
}

/**
 * Read state from the embedded location within the DAG file
 * The state is stored as the last line of the JSONL file
 */
export function readEmbeddedState(planPath: string): DagSessionStateV3 | null {
  const statePath = dagStatePath(planPath);
  return readState(statePath);
}

/**
 * Write state to the embedded location within the DAG file
 * State is stored as the last line of the JSONL file
 */
export function writeEmbeddedState(planPath: string, state: DagSessionStateV3): void {
  const statePath = dagStatePath(planPath);
  writeState(statePath, state);
}

export function now(): string {
  return new Date().toISOString();
}
