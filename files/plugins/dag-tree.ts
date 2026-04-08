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

  // Protected nodes are internal plumbing — hide them from the diagram.
  // Resolve the effective entry point (kickoff's child) and track exit annotations.
  const PROTECTED_IDS = new Set(["execution-kickoff", "plan-success", "plan-fail"]);
  const kickoff = nodes.find((n) => n.id === "execution-kickoff");
  const effectiveEntryId = kickoff?.children?.[0] ?? metadata.entry_node_id;

  // Build exit annotations: which nodes point to plan-success or plan-fail
  const exitAnnotations: Record<string, "success" | "failure"> = {};
  for (const node of nodes) {
    if (PROTECTED_IDS.has(node.id)) continue;
    for (const childId of node.children ?? []) {
      if (childId === "plan-success") exitAnnotations[node.id] = "success";
      if (childId === "plan-fail") exitAnnotations[node.id] = "failure";
    }
  }

  // Filter out protected nodes and strip protected children from edges
  const filteredNodes = nodes
    .filter((n) => !PROTECTED_IDS.has(n.id))
    .map((n) => ({
      ...n,
      children: n.children?.filter((c) => !PROTECTED_IDS.has(c)),
    }));

  // Use the effective entry as the virtual entry for BFS
  const virtualMetadata = { ...metadata, entry_node_id: effectiveEntryId };

  const nodeMap: Record<string, DagNodeV3> = {};
  for (const node of filteredNodes) nodeMap[node.id] = node;

  // ── Detect structural issues (don't throw) ────────────────────────────────

  // Broken child references (skip protected node references — those are internal plumbing)
  for (const node of filteredNodes) {
    for (const childId of node.children ?? []) {
      if (!nodeMap[childId] && !PROTECTED_IDS.has(childId)) {
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
    if (nodeMap[virtualMetadata.entry_node_id] && detectCycle(virtualMetadata.entry_node_id)) {
      hasCycle = true;
      warnings.push("DAG contains a cycle — diagram may not render correctly");
    }
  }

  // ── BFS depth assignment ──────────────────────────────────────────────────

  const depth: Record<string, number> = {};
  if (nodeMap[virtualMetadata.entry_node_id]) {
    const queue: Array<{ id: string; d: number }> = [{ id: virtualMetadata.entry_node_id, d: 0 }];
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
  for (const node of filteredNodes) {
    if (depth[node.id] === undefined) {
      orphans.add(node.id);
      depth[node.id] = Infinity;
      warnings.push(`Orphaned node (not reachable from entry): "${node.id}"`);
    }
  }

  // ── Parent-count map (for collapse eligibility) ───────────────────────────

  const parentCount: Record<string, number> = {};
  for (const node of filteredNodes) {
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
  const bfsQueue: string[] = nodeMap[virtualMetadata.entry_node_id] ? [virtualMetadata.entry_node_id] : [];
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

    // Check if any node in this group is an exit point
    const groupExitType = group.ids.reduce<string | null>((acc, id) => {
      if (exitAnnotations[id] === "success") return acc ?? "SUCCESS EXIT";
      if (exitAnnotations[id] === "failure") return acc ?? "FAILURE EXIT";
      return acc;
    }, null);

    if (isOrphan) {
      lines.push(`  ${group.ids[0]}(["[ORPHAN] ${safeLabel}"])`);
    } else if (groupExitType) {
      // Exit nodes use a distinct shape with annotation
      lines.push(`  ${group.ids[0]}(["${safeLabel}<br/>[${groupExitType}]"])`);
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

  // (Orphan grouping is done later, after separating work nodes from protected nodes)

  const PROTECTED_IDS = new Set(["execution-kickoff", "plan-success", "plan-fail"]);

  // Build a node map for O(1) lookup
  const nodeMap: Record<string, DagNodeV3> = {};
  for (const n of nodes) nodeMap[n.id] = n;

  // Render a group of nodes in arrow format.
  // Finds root(s) (nodes not referenced as children within the group),
  // then walks each chain: a → b → [c, d] ; d → e → f
  function renderGroup(group: DagNodeV3[]): string {
    const groupIds = new Set(group.map((n) => n.id));
    // Find children within this group
    const hasParentInGroup = new Set<string>();
    for (const n of group) {
      for (const childId of n.children ?? []) {
        if (groupIds.has(childId)) hasParentInGroup.add(childId);
      }
    }
    const roots = group.filter((n) => !hasParentInGroup.has(n.id));
    if (roots.length === 0 && group.length > 0) roots.push(group[0]); // cycle fallback

    const rendered = new Set<string>();
    const chains: string[] = [];

    function walkChain(startId: string): string {
      const parts: string[] = [];
      let currentId: string | null = startId;
      while (currentId && !rendered.has(currentId)) {
        rendered.add(currentId);
        const node = nodeMap[currentId];
        if (!node) break;
        // Filter out protected nodes — they're invisible to the agent
        const children = (node.children ?? []).filter((c) => !PROTECTED_IDS.has(c));
        if (children.length === 0) {
          // Leaf node — just append the id
          parts.push(`(${currentId})`);
          currentId = null;
        } else if (children.length === 1) {
          // Linear — append and continue
          parts.push(`(${currentId})`);
          currentId = children[0];
        } else {
          // Branching — append with bracket notation
          const childList = children.join(", ");
          parts.push(`(${currentId}) → [${childList}]`);
          currentId = null;
          // Queue sub-chains for unvisited children within this group
          for (const childId of children) {
            if (groupIds.has(childId) && !rendered.has(childId)) {
              chains.push(walkChain(childId));
            }
          }
        }
      }
      // If we stopped at a node already rendered or outside group, add it as a reference
      if (currentId && !rendered.has(currentId) && !PROTECTED_IDS.has(currentId)) {
        // Outside group — show as outgoing reference
        parts.push(`(${currentId})`);
      }
      return parts.join(" → ");
    }

    for (const root of roots) {
      if (!rendered.has(root.id)) {
        chains.push(walkChain(root.id));
      }
    }

    return chains.filter((c) => c.length > 0).join("\n");
  }

  // Build output
  // Work nodes = everything except protected nodes, regardless of reachability
  const workNodes = nodes.filter((n) => !PROTECTED_IDS.has(n.id));
  // Split work nodes into connected (reachable from entry) and orphaned
  const connectedWork = workNodes.filter((n) => reachable.has(n.id));
  const orphanedWork = workNodes.filter((n) => !reachable.has(n.id));

  const BANNER = "// ═══════════════════════════════════════════════════";

  // Compute entry/exit status from protected node edges
  const kickoffNode = nodes.find((n) => n.id === "execution-kickoff");
  const entryNodeId = kickoffNode?.children?.[0] ?? null;

  const successExits: string[] = [];
  const failureExits: string[] = [];
  for (const n of workNodes) {
    for (const childId of n.children ?? []) {
      if (childId === "plan-success" && !successExits.includes(n.id)) successExits.push(n.id);
      if (childId === "plan-fail" && !failureExits.includes(n.id)) failureExits.push(n.id);
    }
  }

  // Find leaf work nodes that have no set_exit_point yet
  const allExits = new Set([...successExits, ...failureExits]);
  const unsetLeaves = workNodes.filter(
    (n) => (!n.children || n.children.filter((c) => !PROTECTED_IDS.has(c)).length === 0) && !allExits.has(n.id),
  );

  const lines: string[] = [];
  lines.push(`plan: ${metadata.id}`);
  lines.push("");

  // Entry/exit status section
  lines.push(BANNER);
  lines.push("// ENTRY / EXIT STATUS");
  lines.push(BANNER);
  lines.push(`// entry: ${entryNodeId ?? "(not set)"}`);
  lines.push(`// success exits: ${successExits.length > 0 ? successExits.join(", ") : "(none)"}`);
  lines.push(`// failure exits: ${failureExits.length > 0 ? failureExits.join(", ") : "(none)"}`);
  if (unsetLeaves.length > 0) {
    lines.push(`// unset leaf nodes: ${unsetLeaves.map((n) => n.id).join(", ")}`);
  }
  lines.push("");

  // Working draft — connected work nodes (excluding protected)
  lines.push(BANNER);
  lines.push("// WORKING DRAFT");
  lines.push(BANNER);
  if (connectedWork.length > 0) {
    lines.push(renderGroup(connectedWork));
  }

  // Re-group orphaned work nodes into connected components
  const orphanWorkGroups: DagNodeV3[][] = [];
  const visitedOrphans = new Set<string>();
  for (const orphan of orphanedWork) {
    if (visitedOrphans.has(orphan.id)) continue;
    const group: DagNodeV3[] = [];
    const groupQueue = [orphan.id];
    while (groupQueue.length > 0) {
      const id = groupQueue.pop()!;
      if (visitedOrphans.has(id)) continue;
      visitedOrphans.add(id);
      const n = nodes.find((x) => x.id === id);
      if (n && !PROTECTED_IDS.has(n.id)) {
        group.push(n);
        for (const childId of n.children ?? []) {
          if (!PROTECTED_IDS.has(childId)) groupQueue.push(childId);
        }
      }
    }
    if (group.length > 0) orphanWorkGroups.push(group);
  }

  // Orphaned groups
  for (let i = 0; i < orphanWorkGroups.length; i++) {
    lines.push("");
    lines.push(`── orphaned group ${i + 1} ──`);
    lines.push(renderGroup(orphanWorkGroups[i]));
  }

  let result = `## DAG Compact Draft: ${metadata.id}\n\n`;
  if (orphanWorkGroups.length > 0) {
    result += `${orphanWorkGroups.length} orphaned group(s)\n\n`;
  }
  result += "```\n" + lines.join("\n").trimEnd() + "\n```";
  return result;
}
