import * as fs from "fs";
import type { PhaseDagMetadata, PhaseRecord } from "./types";

export function readPhaseDag(planPath: string): { metadata: PhaseDagMetadata; phases: PhaseRecord[] } {
  if (!fs.existsSync(planPath)) {
    throw new Error(`plan.jsonl not found at ${planPath}`);
  }
  const content = fs.readFileSync(planPath, "utf-8");
  const lines = content.split("\n").filter((l) => l.trim());
  if (lines.length === 0) throw new Error(`plan.jsonl is empty at ${planPath}`);

  const metadata = JSON.parse(lines[0]) as PhaseDagMetadata;
  if (metadata.schema_version !== "4.0") {
    throw new Error(
      `Expected schema_version "4.0" but got "${metadata.schema_version}".`,
    );
  }

  const phases: PhaseRecord[] = [];
  for (let i = 1; i < lines.length; i++) {
    try {
      phases.push(JSON.parse(lines[i]) as PhaseRecord);
    } catch {
      throw new Error(`Invalid JSON on line ${i + 1} of plan.jsonl at ${planPath}`);
    }
  }
  return { metadata, phases };
}

export function writePhaseDag(
  planPath: string,
  metadata: PhaseDagMetadata,
  phases: PhaseRecord[],
): void {
  const lines = [JSON.stringify(metadata), ...phases.map((p) => JSON.stringify(p))];
  fs.writeFileSync(planPath, lines.join("\n"), "utf-8");
}

/** Peek at the schema_version of a plan.jsonl without full parsing. */
export function detectSchemaVersion(planPath: string): string | null {
  if (!fs.existsSync(planPath)) return null;
  const content = fs.readFileSync(planPath, "utf-8");
  const firstLine = content.split("\n").find((l) => l.trim());
  if (!firstLine) return null;
  try {
    const meta = JSON.parse(firstLine);
    return meta.schema_version ?? null;
  } catch {
    return null;
  }
}
