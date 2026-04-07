import * as fs from "fs";
import * as path from "path";
import type { DagNodeV3, DagMetadataV3, DagSessionStateV3 } from "./types";

/**
 * Read a JSONL DAG file (schema_version "3.0")
 * First line contains metadata, subsequent lines contain nodes.
 * Optional: also read the embedded state from .opencode/dag-state/embedded.json
 */
export function readDagV3(planPath: string, readState: boolean = false): { 
  metadata: DagMetadataV3; 
  nodes: DagNodeV3[];
  state?: DagSessionStateV3;
} {
  if (!fs.existsSync(planPath)) {
    throw new Error(`plan.jsonl not found at ${planPath}`);
  }

  try {
    const content = fs.readFileSync(planPath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());

    if (lines.length === 0) {
      throw new Error(`plan.jsonl is empty`);
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
        throw new Error(`Invalid JSON on line ${i + 1} of plan.jsonl`);
      }
    }

    const result = { metadata, nodes };

    // Optionally read embedded state
    if (readState) {
      const statePath = path.join(path.dirname(planPath), ".opencode", "dag-state", "embedded.json");
      if (fs.existsSync(statePath)) {
        result.state = JSON.parse(fs.readFileSync(statePath, 'utf-8')) as DagSessionStateV3;
      }
    }

    return result;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Error reading JSONL DAG: ${msg}`);
  }
}

/**
 * Write a JSONL DAG file (new format, schema_version "3.0")
 * First line is metadata, subsequent lines are nodes.
 * Optional: also write the embedded state to .opencode/dag-state/embedded.json
 */
export function writeDagV3(
  planPath: string, 
  metadata: DagMetadataV3, 
  nodes: DagNodeV3[],
  state?: DagSessionStateV3
): void {
  const lines: string[] = [
    JSON.stringify(metadata),
    ...nodes.map(node => JSON.stringify(node))
  ];
  
  if (state) {
    // Add state as the last line
    lines.push(JSON.stringify(state));
  }

  fs.writeFileSync(planPath, lines.join('\n'), 'utf-8');
}

/**
 * Migrate a DAG file from the old format (nested JSON) to the new format (JSONL with embedded state)
 * This function:
 * 1. Reads the old format DAG file
 * 2. Converts it to the new JSONL format
 * 3. Optionally migrates the state file
 */
export function migrateDagFromOldFormat(
  oldPlanPath: string,
  newPlanPath: string,
  migrateState: boolean = true
): string {
  // Read old format DAG
  const oldContent = fs.readFileSync(oldPlanPath, 'utf-8');
  const oldLines = oldContent.split('\n').filter(line => line.trim());

  if (oldLines.length === 0) {
    throw new Error(`Old plan.jsonl is empty at ${oldPlanPath}`);
  }

  const oldMetadata = JSON.parse(oldLines[0]);
  const oldNodes: DagNodeV3[] = [];

  for (let i = 1; i < oldLines.length; i++) {
    const node = JSON.parse(oldLines[i]);
    // Convert old format node to new format
    const newNode: DagNodeV3 = {
      id: node.id,
      prompt: node.prompt,
      enforcement: node.todo, // Convert old 'todo' array to 'enforcement'
      children: node.next ? [] : undefined // Convert old 'next' to 'children'
    };

    if (node.next && Array.isArray(node.next)) {
      // Handle branching nodes
      newNode.children = node.next.map(opt => opt.node.id);
    } else if (node.next && !Array.isArray(node.next)) {
      // Handle linear nodes with 'next'
      newNode.children = [node.next.id];
    }

    oldNodes.push(newNode);
  }

  // Create new metadata
  const newMetadata: DagMetadataV3 = {
    schema_version: "3.0",
    id: oldMetadata.id,
    entry_node_id: oldMetadata.entry.id
  };

  // Write new format DAG
  writeDagV3(newPlanPath, newMetadata, oldNodes);

  // Optionally migrate state
  if (migrateState) {
    const oldStatePath = path.join(path.dirname(oldPlanPath), ".opencode", "dag-state", `${oldMetadata.id}.json`);
    if (fs.existsSync(oldStatePath)) {
      const oldState = JSON.parse(fs.readFileSync(oldStatePath, 'utf-8'));
      // Convert old state to new format
      const newState: DagSessionStateV3 = {
        dag_id: oldMetadata.id,
        status: oldState.status,
        current_node: oldState.current_node,
        todo_index: oldState.todo_index,
        started_at: oldState.started_at,
        updated_at: oldState.updated_at,
        decisions: oldState.decisions,
        progress_log: [] // Start with empty progress log
      };

      // Write new state to embedded location
      const newStatePath = path.join(path.dirname(newPlanPath), ".opencode", "dag-state", "embedded.json");
      fs.mkdirSync(path.dirname(newStatePath), { recursive: true });
      fs.writeFileSync(newStatePath, JSON.stringify(newState, null, 2), 'utf-8');

      // Remove old state file
      fs.unlinkSync(oldStatePath);
    }
  }

  return `Migrated from ${oldPlanPath} to ${newPlanPath}`;
}
