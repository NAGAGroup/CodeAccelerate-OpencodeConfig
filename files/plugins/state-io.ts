import * as fs from "fs";
import * as path from "path";
import type { DagSessionState } from "./types";

export function dagStatePath(worktree: string, sessionId: string): string {
  return path.join(worktree, ".opencode", "dag-state", `${sessionId}.json`);
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
