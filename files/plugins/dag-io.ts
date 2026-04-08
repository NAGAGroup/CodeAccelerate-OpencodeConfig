import * as fs from "fs";
import type { DagNodeV3, DagMetadataV3 } from "./types";

export function readDagV3(planPath: string): { metadata: DagMetadataV3; nodes: DagNodeV3[] } {
  if (!fs.existsSync(planPath)) {
    throw new Error(`plan.jsonl not found at ${planPath}`);
  }

  const content = fs.readFileSync(planPath, "utf-8");
  const lines = content.split("\n").filter((line: string) => line.trim());

  if (lines.length === 0) {
    throw new Error(`plan.jsonl is empty at ${planPath}`);
  }

  const metadata = JSON.parse(lines[0]) as DagMetadataV3;

  if (metadata.schema_version !== "3.0") {
    throw new Error(
      `Expected schema_version "3.0" but got "${metadata.schema_version}". ` +
      `This JSONL file uses an unsupported format.`
    );
  }

  const nodes: DagNodeV3[] = [];
  for (let i = 1; i < lines.length; i++) {
    try {
      nodes.push(JSON.parse(lines[i]) as DagNodeV3);
    } catch {
      throw new Error(`Invalid JSON on line ${i + 1} of plan.jsonl at ${planPath}`);
    }
  }

  return { metadata, nodes };
}

export function writeDagV3(planPath: string, metadata: DagMetadataV3, nodes: DagNodeV3[]): void {
  const lines = [
    JSON.stringify(metadata),
    ...nodes.map((node: DagNodeV3) => JSON.stringify(node)),
  ];
  fs.writeFileSync(planPath, lines.join("\n"), "utf-8");
}
