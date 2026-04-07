import * as fs from "fs";
import * as path from "path";
import type { DagSessionStateV3 } from "./types";

/**
 * Get the path to the embedded state file within the DAG JSONL
 * In the new format, state is stored at the end of the JSONL file
 */
export function dagStatePath(planPath: string): string {
  return path.join(path.dirname(planPath), ".opencode", "dag-state", "embedded.json");
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
