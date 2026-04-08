import type { DagNodeV3, DagMetadataV3, FlatNode } from "./types";

// ─── Validation ───────────────────────────────────────────────────────────────

export function validateDagV3(metadata: DagMetadataV3, nodes: DagNodeV3[]): void {
  const ids = new Set<string>();
  const duplicates: string[] = [];
  for (const node of nodes) {
    if (ids.has(node.id)) duplicates.push(node.id);
    else ids.add(node.id);
  }
  if (duplicates.length > 0) {
    throw new Error(`Duplicate node IDs in DAG: ${duplicates.join(", ")}`);
  }
  if (!ids.has(metadata.entry_node_id)) {
    throw new Error(`Entry node "${metadata.entry_node_id}" not found in DAG nodes`);
  }

  const nodeMap: Record<string, DagNodeV3> = {};
  for (const node of nodes) nodeMap[node.id] = node;

  // Check all child references exist
  for (const node of nodes) {
    for (const childId of node.children ?? []) {
      if (!nodeMap[childId]) {
        throw new Error(`Node "${node.id}" references child "${childId}" which does not exist`);
      }
    }
  }

  // Reachability check (BFS from entry)
  const reachable = new Set<string>();
  const queue = [metadata.entry_node_id];
  while (queue.length > 0) {
    const id = queue.shift()!;
    if (reachable.has(id)) continue;
    reachable.add(id);
    for (const childId of nodeMap[id]?.children ?? []) {
      if (!reachable.has(childId)) queue.push(childId);
    }
  }
  const unreachable = nodes.filter((n) => !reachable.has(n.id)).map((n) => n.id);
  if (unreachable.length > 0) {
    throw new Error(`Unreachable nodes (no path from entry): ${unreachable.join(", ")}`);
  }

  // Cycle detection (DFS with recursion stack)
  const visited = new Set<string>();
  const recStack = new Set<string>();
  function hasCycle(nodeId: string): boolean {
    if (recStack.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;
    visited.add(nodeId);
    recStack.add(nodeId);
    for (const childId of nodeMap[nodeId]?.children ?? []) {
      if (hasCycle(childId)) return true;
    }
    recStack.delete(nodeId);
    return false;
  }
  if (hasCycle(metadata.entry_node_id)) {
    throw new Error("DAG contains a cycle (circular dependency detected)");
  }
}

// ─── Flatten ──────────────────────────────────────────────────────────────────

export function flattenTreeV3(metadata: DagMetadataV3, nodes: DagNodeV3[]): Record<string, FlatNode> {
  const map: Record<string, FlatNode> = {};
  for (const node of nodes) {
    if (map[node.id]) {
      throw new Error(`DAG validation error: duplicate node id "${node.id}".`);
    }
    const flat: FlatNode = { id: node.id, prompt: node.prompt, enforcement: node.enforcement };
    if (node.children && node.children.length > 0) flat.children = node.children;
    map[node.id] = flat;
  }
  return map;
}

// ─── Diagram generation ───────────────────────────────────────────────────────

/**
 * Build a compact Mermaid diagram with BFS-ordered collapsed groups.
 *
 * Algorithm:
 * 1. BFS from entry to assign a depth to every reachable node.
 * 2. Collect all nodes (reachable + unreachable) — orphans get depth Infinity.
 * 3. Collapse sequential chains (single-child, single-parent) into groups.
 *    The group's BFS depth = minimum depth of its members.
 * 4. Emit node declarations in ascending depth order so leaf/terminal nodes
 *    always appear at the bottom of the rendered diagram.
 * 5. Orphaned nodes are labelled [ORPHAN: id] and listed in a warning header.
 *
 * For invalid DAGs (broken refs, cycles) the function falls back to showing
 * all nodes individually without collapsing, with a structural warning.
 */
export function dagToMermaidCompactV3(
  metadata: DagMetadataV3,
  nodes: DagNodeV3[],
): { mermaid: string; warnings: string[] } {
  const warnings: string[] = [];
  const nodeMap: Record<string, DagNodeV3> = {};
  for (const node of nodes) nodeMap[node.id] = node;

  // ── Detect structural issues (don't throw) ────────────────────────────────

  // Broken child references
  for (const node of nodes) {
    for (const childId of node.children ?? []) {
      if (!nodeMap[childId]) {
        warnings.push(`Node "${node.id}" references missing child "${childId}"`);
      }
    }
  }

  // Cycle detection
  let hasCycle = false;
  {
    const visited = new Set<string>();
    const recStack = new Set<string>();
    function detectCycle(id: string): boolean {
      if (recStack.has(id)) return true;
      if (visited.has(id)) return false;
      visited.add(id);
      recStack.add(id);
      for (const childId of nodeMap[id]?.children ?? []) {
        if (nodeMap[childId] && detectCycle(childId)) return true;
      }
      recStack.delete(id);
      return false;
    }
    if (nodeMap[metadata.entry_node_id] && detectCycle(metadata.entry_node_id)) {
      hasCycle = true;
      warnings.push("DAG contains a cycle — diagram may not render correctly");
    }
  }

  // ── BFS depth assignment ──────────────────────────────────────────────────

  const depth: Record<string, number> = {};
  if (nodeMap[metadata.entry_node_id]) {
    const queue: Array<{ id: string; d: number }> = [{ id: metadata.entry_node_id, d: 0 }];
    while (queue.length > 0) {
      const { id, d } = queue.shift()!;
      if (depth[id] !== undefined) continue; // already visited (handles shared terminals)
      depth[id] = d;
      for (const childId of nodeMap[id]?.children ?? []) {
        if (nodeMap[childId] && depth[childId] === undefined) {
          queue.push({ id: childId, d: d + 1 });
        }
      }
    }
  }

  // Orphans: nodes with no path from entry
  const orphans = new Set<string>();
  for (const node of nodes) {
    if (depth[node.id] === undefined) {
      orphans.add(node.id);
      depth[node.id] = Infinity;
      warnings.push(`Orphaned node (not reachable from entry): "${node.id}"`);
    }
  }

  // ── Parent-count map (for collapse eligibility) ───────────────────────────

  const parentCount: Record<string, number> = {};
  for (const node of nodes) {
    if (!parentCount[node.id]) parentCount[node.id] = 0;
    for (const childId of node.children ?? []) {
      if (nodeMap[childId]) parentCount[childId] = (parentCount[childId] ?? 0) + 1;
    }
  }

  // A node is collapsible if: 1 child, 1 parent, and that child also has 1 parent.
  // Orphans and cycle participants are never collapsed.
  const isCollapsible = (id: string): boolean => {
    if (orphans.has(id) || hasCycle) return false;
    const node = nodeMap[id];
    if (!node) return false;
    const children = (node.children ?? []).filter((c) => nodeMap[c]);
    if (children.length !== 1) return false;
    if ((parentCount[id] ?? 0) !== 1) return false;
    const childId = children[0];
    if ((parentCount[childId] ?? 0) !== 1) return false;
    return true;
  };

  // ── Build collapsed groups via BFS from entry, then append orphans ────────

  const visited = new Set<string>();
  const groups: Array<{ ids: string[]; minDepth: number }> = [];
  const edges: Array<{ from: string; to: string }> = [];

  // Process reachable nodes in BFS order (entry first)
  const bfsQueue: string[] = nodeMap[metadata.entry_node_id] ? [metadata.entry_node_id] : [];
  while (bfsQueue.length > 0) {
    const startId = bfsQueue.shift()!;
    if (visited.has(startId)) continue;

    // Collect sequential chain
    const chain: string[] = [startId];
    visited.add(startId);
    let cur = startId;
    while (isCollapsible(cur)) {
      const nextId = (nodeMap[cur].children ?? []).find((c) => nodeMap[c] && !visited.has(c));
      if (!nextId) break;
      chain.push(nextId);
      visited.add(nextId);
      cur = nextId;
    }

    const minDepth = Math.min(...chain.map((id) => depth[id] ?? Infinity));
    groups.push({ ids: chain, minDepth });

    // Queue children of the last node in the chain
    const lastNode = nodeMap[chain[chain.length - 1]];
    for (const childId of lastNode?.children ?? []) {
      if (nodeMap[childId]) {
        if (!visited.has(childId)) bfsQueue.push(childId);
        edges.push({ from: chain[0], to: childId });
      }
    }
  }

  // Append orphan groups (each orphan is its own group, depth Infinity)
  for (const orphanId of orphans) {
    if (!visited.has(orphanId)) {
      groups.push({ ids: [orphanId], minDepth: Infinity });
      visited.add(orphanId);
      // Include orphan's own edges if children exist
      for (const childId of nodeMap[orphanId]?.children ?? []) {
        if (nodeMap[childId]) edges.push({ from: orphanId, to: childId });
      }
    }
  }

  // ── Sort groups by BFS depth so terminals appear at the bottom ────────────

  groups.sort((a, b) => {
    if (a.minDepth === Infinity && b.minDepth === Infinity) return 0;
    if (a.minDepth === Infinity) return 1;
    if (b.minDepth === Infinity) return -1;
    return a.minDepth - b.minDepth;
  });

  // ── Build representative map (first node in chain → group) ───────────────

  const repOf: Record<string, string> = {};
  for (const group of groups) {
    for (const id of group.ids) repOf[id] = group.ids[0];
  }

  // ── Emit Mermaid ──────────────────────────────────────────────────────────

  const lines: string[] = ["flowchart TD"];
  for (const group of groups) {
    const isOrphan = orphans.has(group.ids[0]) || group.ids.some((id) => orphans.has(id));
    const label = group.ids.join("<br/>");
    const safeLabel = label.replace(/"/g, "'");
    if (isOrphan) {
      // Orphans use a distinct shape (stadium/pill) to stand out
      lines.push(`  ${group.ids[0]}(["[ORPHAN] ${safeLabel}"])`);
    } else {
      lines.push(`  ${group.ids[0]}["${safeLabel}"]`);
    }
  }

  // Deduplicate edges and resolve to group representatives
  const edgeSet = new Set<string>();
  for (const edge of edges) {
    const fromRep = repOf[edge.from] ?? edge.from;
    const toRep = repOf[edge.to] ?? edge.to;
    const key = `${fromRep}-->${toRep}`;
    if (!edgeSet.has(key) && fromRep !== toRep) {
      edgeSet.add(key);
      lines.push(`  ${fromRep} --> ${toRep}`);
    }
  }

  return { mermaid: lines.join("\n"), warnings };
}

// ─── Compact JSONL draft ──────────────────────────────────────────────────────

/**
 * Format a DAG as a compact JSONL draft with orphaned node groups separated
 * and labeled. Connected nodes appear first, then orphaned groups each prefixed
 * with a comment line. Returns the formatted string ready for display.
 */
export function formatCompactDagDraft(
  metadata: DagMetadataV3,
  nodes: DagNodeV3[],
): string {
  // Find all nodes reachable from the entry node
  const reachable = new Set<string>();
  const queue = [metadata.entry_node_id];
  while (queue.length > 0) {
    const id = queue.pop()!;
    if (reachable.has(id)) continue;
    reachable.add(id);
    const n = nodes.find((x) => x.id === id);
    if (n?.children) queue.push(...n.children);
  }

  const TERMINAL_NODES = ["plan-success", "plan-fail"];

  // Separate reachable and orphaned nodes
  // Terminal nodes (plan-success, plan-fail) are never treated as orphans —
  // they are expected to be unwired during incremental DAG construction.
  const connectedNodes = nodes.filter((n) => reachable.has(n.id));
  const orphanedNodes = nodes.filter((n) => !reachable.has(n.id) && !TERMINAL_NODES.includes(n.id));
  const terminalNodes = nodes.filter((n) => !reachable.has(n.id) && TERMINAL_NODES.includes(n.id));

  // Group orphaned nodes into connected components
  const orphanGroups: DagNodeV3[][] = [];
  const visited = new Set<string>();
  for (const orphan of orphanedNodes) {
    if (visited.has(orphan.id)) continue;
    // BFS within orphaned set
    const group: DagNodeV3[] = [];
    const groupQueue = [orphan.id];
    while (groupQueue.length > 0) {
      const id = groupQueue.pop()!;
      if (visited.has(id)) continue;
      visited.add(id);
      const n = nodes.find((x) => x.id === id);
      if (n) {
        group.push(n);
        if (n.children) groupQueue.push(...n.children);
      }
    }
    orphanGroups.push(group);
  }

  // Serialize metadata line
  const metadataLine = JSON.stringify({
    schema_version: metadata.schema_version,
    id: metadata.id,
    entry_node_id: metadata.entry_node_id,
  });

  // Build output sections
  const KICKOFF_NODE = "execution-kickoff";
  const kickoffNode = connectedNodes.find((n) => n.id === KICKOFF_NODE);
  const nonKickoffConnected = connectedNodes.filter((n) => n.id !== KICKOFF_NODE);
  const allProtected = [
    ...(kickoffNode ? [kickoffNode] : []),
    ...terminalNodes,
  ];

  const BANNER = "// ═══════════════════════════════════════════════════";

  let output = metadataLine + "\n";
  if (allProtected.length > 0) {
    output += `${BANNER}\n`;
    output += `// PROTECTED NODES — wire last\n`;
    output += `${BANNER}\n`;
    for (const n of allProtected) {
      output += JSON.stringify(n) + "\n";
    }
    output += "\n";
  }
  output += `${BANNER}\n`;
  output += `// WORKING DRAFT\n`;
  output += `${BANNER}\n`;
  for (const n of nonKickoffConnected) {
    output += JSON.stringify(n) + "\n";
  }
  for (let i = 0; i < orphanGroups.length; i++) {
    output += `\n// ── orphaned group ${i + 1} ──\n`;
    for (const n of orphanGroups[i]) {
      output += JSON.stringify(n) + "\n";
    }
  }

  let result = `## DAG Compact Draft: ${metadata.id}\n\n`;
  if (orphanGroups.length > 0) {
    result += `${orphanGroups.length} orphaned group(s)\n\n`;
  }
  result += `\`\`\`jsonl\n${output.trimEnd()}\n\`\`\``;
  return result;
}
