import * as path from "path";
import type { DagNode, BranchOption, PlanDag, FlatNode, DagNodeV3, DagMetadataV3 } from "./types";

// ─── V3 (JSONL flat-array) utilities ─────────────────────────────────────────

export function dagToMermaidV3(metadata: DagMetadataV3, nodes: DagNodeV3[]): string {
  const lines: string[] = ['flowchart TD'];
  for (const node of nodes) {
    const promptFile = path.basename(node.prompt);
    const todoStr = node.todo.length > 0 ? node.todo.join(', ') : 'none';
    lines.push(`  ${node.id}["${node.id}<br/>${promptFile} | [${todoStr}]"]`);
  }
  for (const node of nodes) {
    if (!node.children || node.children.length === 0) continue;
    for (const childId of node.children) {
      lines.push(`  ${node.id} --> ${childId}`);
    }
  }
  return lines.join('\n');
}

export function validateDagV3(metadata: DagMetadataV3, nodes: DagNodeV3[]): void {
  const ids = new Set<string>();
  const duplicates: string[] = [];
  for (const node of nodes) {
    if (ids.has(node.id)) duplicates.push(node.id);
    else ids.add(node.id);
  }
  if (duplicates.length > 0) {
    throw new Error(`Duplicate node IDs in DAG: ${duplicates.join(', ')}`);
  }
  if (!ids.has(metadata.entry_node_id)) {
    throw new Error(`Entry node "${metadata.entry_node_id}" not found in DAG nodes`);
  }
}

export function flattenTreeV3(metadata: DagMetadataV3, nodes: DagNodeV3[]): Record<string, FlatNode> {
  const map: Record<string, FlatNode> = {};
  for (const node of nodes) {
    if (map[node.id]) {
      throw new Error(`DAG validation error: duplicate node id "${node.id}".`);
    }
    const flat: FlatNode = { id: node.id, prompt: node.prompt, todo: node.todo };
    if (node.children && node.children.length > 0) flat.children = node.children;
    if (node.unlocked_tools && node.unlocked_tools.length > 0) flat.unlockedTools = node.unlocked_tools;
    map[node.id] = flat;
  }
  return map;
}

export function collectAllNodes(node: DagNode, collected: DagNode[] = []): DagNode[] {
  collected.push(node);
  if (Array.isArray(node.next)) {
    for (const branch of node.next as BranchOption[]) {
      collectAllNodes(branch.node, collected);
    }
  } else if (node.next && typeof node.next === 'object') {
    collectAllNodes(node.next as DagNode, collected);
  }
  return collected;
}

export function dagToMermaid(dag: PlanDag): string {
  const lines: string[] = ['flowchart TD'];
  const nodes = collectAllNodes(dag.entry);
  for (const node of nodes) {
    const promptFile = path.basename(node.prompt);
    const todoStr = node.todo.length > 0 ? node.todo.join(', ') : 'none';
    const label = `${node.id}["${node.id}<br/>${promptFile} | [${todoStr}]"]`;
    lines.push(`  ${label}`);
  }
  for (const node of nodes) {
    if (Array.isArray(node.next)) {
      for (const branch of node.next as BranchOption[]) {
        lines.push(`  ${node.id} -->|"${branch.when}"| ${branch.node.id}`);
      }
    } else if (node.next && typeof node.next === 'object') {
      lines.push(`  ${node.id} --> ${(node.next as DagNode).id}`);
    }
  }
  return lines.join('\n');
}

export function validateDagTree(dag: PlanDag): void {
  const nodes = collectAllNodes(dag.entry);
  const ids = new Set<string>();
  const duplicates: string[] = [];
  for (const node of nodes) {
    if (ids.has(node.id)) {
      duplicates.push(node.id);
    } else {
      ids.add(node.id);
    }
  }
  if (duplicates.length > 0) {
    throw new Error(`Duplicate node IDs in DAG: ${duplicates.join(', ')}`);
  }
  for (const node of nodes) {
    if (Array.isArray(node.next) && (node.next as BranchOption[]).length < 2) {
      throw new Error(`Branch node "${node.id}" has fewer than 2 branches`);
    }
  }
}

// Validates only node ID uniqueness — used by add_node to allow incremental
// branch building (branches can have <2 options while being constructed).
export function validateDagTreeIds(dag: PlanDag): void {
  const nodes = collectAllNodes(dag.entry);
  const ids = new Set<string>();
  const duplicates: string[] = [];
  for (const node of nodes) {
    if (ids.has(node.id)) {
      duplicates.push(node.id);
    } else {
      ids.add(node.id);
    }
  }
  if (duplicates.length > 0) {
    throw new Error(`Duplicate node IDs in DAG: ${duplicates.join(', ')}`);
  }
}

export function findNode(dag: PlanDag, nodeId: string): DagNode | null {
  function search(node: DagNode): DagNode | null {
    if (node.id === nodeId) return node;
    if (Array.isArray(node.next)) {
      for (const branch of node.next as BranchOption[]) {
        const found = search(branch.node);
        if (found) return found;
      }
    } else if (node.next && typeof node.next === 'object') {
      return search(node.next as DagNode);
    }
    return null;
  }
  return search(dag.entry);
}

// ─── Tree flattening ─────────────────────────────────────────────────────────

export function flattenTree(node: DagNode, map: Record<string, FlatNode> = {}): Record<string, FlatNode> {
  // Detect duplicate node IDs — DAG nodes must be unique. A loop-back or shared
  // node silently overwrites the first entry and corrupts the node_map, causing
  // autoAdvance to treat a non-terminal node as terminal.
  if (map[node.id]) {
    throw new Error(
      `DAG validation error: duplicate node id "${node.id}". ` +
      `Each node must have a unique id. Use "-2", "-3" suffixes for repeated nodes ` +
      `(e.g. "audit-agents-2" instead of reusing "audit-agents").`
    );
  }

  const flat: FlatNode = {
    id: node.id,
    prompt: node.prompt,
    todo: node.todo,
  };

  if (node.next === undefined || node.next === null) {
    // Terminal node
  } else if (Array.isArray(node.next)) {
    // Branching
    flat.branches = (node.next as BranchOption[]).map((b) => {
      flattenTree(b.node, map);
      return { when: b.when, nodeId: b.node.id };
    });
  } else {
    // Linear
    const child = node.next as DagNode;
    flat.nextLinear = child.id;
    flattenTree(child, map);
  }

  map[node.id] = flat;
  return map;
}

// ─── Prompt path rewriting ───────────────────────────────────────────────────

// Bare filenames (no "/") are rewritten to a worktree-relative path under prompts/.
export function rewritePromptPaths(node: DagNode, prefix: string): void {
  if (!node.prompt.includes("/")) {
    node.prompt = `${prefix}${node.prompt}`;
  }
  if (Array.isArray(node.next)) {
    for (const branch of node.next as BranchOption[]) {
      rewritePromptPaths(branch.node, prefix);
    }
  } else if (node.next && typeof node.next === "object" && !Array.isArray(node.next)) {
    rewritePromptPaths(node.next as DagNode, prefix);
  }
}
