import type { DagNodeV3, DagMetadataV3, FlatNode } from "./types";

// ─── Validation (retained for reference — no longer called at runtime) ────────

function _validateDagV3_unused(
  metadata: DagMetadataV3,
  nodes: DagNodeV3[],
): void {
  // Protected nodes are internal plumbing — never expose them in agent-facing error messages.
  const PROTECTED_IDS = new Set([
    "execution-kickoff",
    "plan-success",
    "plan-fail",
  ]);
  const workNodes = nodes.filter((n) => !PROTECTED_IDS.has(n.id));

  // Duplicate IDs
  const ids = new Set<string>();
  const duplicates: string[] = [];
  for (const node of nodes) {
    if (ids.has(node.id)) duplicates.push(node.id);
    else ids.add(node.id);
  }
  if (duplicates.length > 0) {
    throw new Error(`Duplicate node IDs in DAG: ${duplicates.join(", ")}`);
  }

  const nodeMap: Record<string, DagNodeV3> = {};
  for (const node of nodes) nodeMap[node.id] = node;

  // Check all child references exist (skip protected node references — they are internal plumbing)
  for (const node of workNodes) {
    for (const childId of node.children ?? []) {
      if (!PROTECTED_IDS.has(childId) && !nodeMap[childId]) {
        throw new Error(
          `Node "${node.id}" references child "${childId}" which does not exist`,
        );
      }
    }
  }

  // Entry point check — execution-kickoff must have exactly one work node child
  const kickoff = nodes.find((n) => n.id === "execution-kickoff");
  const effectiveEntryId = kickoff?.children?.[0];
  if (
    !effectiveEntryId ||
    PROTECTED_IDS.has(effectiveEntryId) ||
    !nodeMap[effectiveEntryId]
  ) {
    throw new Error(
      `No entry point has been set. Call \`set_entry_point\` with the first work node to resolve.`,
    );
  }

  // Reachability check (BFS from effective entry, work nodes only)
  const reachable = new Set<string>();
  const queue = [effectiveEntryId];
  while (queue.length > 0) {
    const id = queue.shift()!;
    if (reachable.has(id)) continue;
    reachable.add(id);
    for (const childId of nodeMap[id]?.children ?? []) {
      if (!PROTECTED_IDS.has(childId) && !reachable.has(childId))
        queue.push(childId);
    }
  }
  const unreachableWork = workNodes.filter((n) => !reachable.has(n.id));
  if (unreachableWork.length > 0) {
    throw new Error(
      `Unreachable nodes (no path from entry): ${unreachableWork.map((n) => n.id).join(", ")}. ` +
        `Connect them via \`connect_nodes\` or remove them with \`delete_node\`.`,
    );
  }

  // Leaf node check — work node leaves that are neither wired to an exit point nor connected onward
  const allExits = new Set<string>();
  for (const n of workNodes) {
    for (const childId of n.children ?? []) {
      if (childId === "plan-success" || childId === "plan-fail")
        allExits.add(n.id);
    }
  }
  const unsetLeaves = workNodes.filter(
    (n) =>
      (!n.children ||
        n.children.filter((c) => !PROTECTED_IDS.has(c)).length === 0) &&
      !allExits.has(n.id),
  );
  if (unsetLeaves.length > 0) {
    throw new Error(
      `The following leaf nodes are not connected or marked as exit points: ${unsetLeaves.map((n) => n.id).join(", ")}. ` +
        `Connect them to another DAG node via \`connect_nodes\` or mark them as exit points via \`set_exit_point\`.`,
    );
  }

  // Branching limit: no work node may have more than 2 non-protected children
  const overBranched = workNodes.filter(
    (n) => (n.children ?? []).filter((c) => !PROTECTED_IDS.has(c)).length > 2,
  );
  if (overBranched.length > 0) {
    const details = overBranched
      .map((n) => {
        const visibleChildren = n.children!.filter(
          (c) => !PROTECTED_IDS.has(c),
        );
        return `"${n.id}" has ${visibleChildren.length} children: [${visibleChildren.join(", ")}]`;
      })
      .join("; ");
    throw new Error(
      `Branching limit violated — nodes may have at most 2 children. ${details}. ` +
        `Decision gates and verify nodes must have exactly 2 children. ` +
        `Decompose wider branches into nested binary decisions.`,
    );
  }

  // Parallel work prevention — only branching types may have multiple children
  const BRANCHING_COMPONENTS = new Set([
    "verify-work-item",
    "decision-gate",
    "user-decision-gate",
  ]);
  const illegalBranching = workNodes.filter((n) => {
    const visibleChildren = (n.children ?? []).filter(
      (c) => !PROTECTED_IDS.has(c),
    );
    if (visibleChildren.length < 2) return false;
    return !n.component || !BRANCHING_COMPONENTS.has(n.component);
  });
  if (illegalBranching.length > 0) {
    const details = illegalBranching
      .map((n) => {
        const visibleChildren = (n.children ?? []).filter(
          (c) => !PROTECTED_IDS.has(c),
        );
        return `"${n.id}" (${n.component ?? "unknown type"}) has ${visibleChildren.length} children: [${visibleChildren.join(", ")}]`;
      })
      .join("; ");
    throw new Error(
      `Parallel work detected — only decision-gate, user-decision-gate, and verify-work-item may have multiple children. ${details}. ` +
        `Branches represent mutually exclusive routing paths, not parallel execution.`,
    );
  }

  // Cycle detection (DFS on work nodes only, skip protected)
  const visited = new Set<string>();
  const recStack = new Set<string>();
  function hasCycle(nodeId: string): boolean {
    if (PROTECTED_IDS.has(nodeId)) return false;
    if (recStack.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;
    visited.add(nodeId);
    recStack.add(nodeId);
    for (const childId of nodeMap[nodeId]?.children ?? []) {
      if (!PROTECTED_IDS.has(childId) && hasCycle(childId)) return true;
    }
    recStack.delete(nodeId);
    return false;
  }
  if (hasCycle(effectiveEntryId)) {
    throw new Error("DAG contains a cycle (circular dependency detected)");
  }

  // Binary branching enforcement: verify, decision-gate, and user-decision-gate must have exactly 2 children
  const BINARY_COMPONENTS = new Set([
    "verify-work-item",
    "decision-gate",
    "user-decision-gate",
  ]);
  const underBranched = workNodes.filter((n) => {
    if (!n.component || !BINARY_COMPONENTS.has(n.component)) return false;
    const visibleChildren = (n.children ?? []).filter(
      (c) => !PROTECTED_IDS.has(c),
    );
    return visibleChildren.length !== 2;
  });
  if (underBranched.length > 0) {
    const details = underBranched
      .map((n) => {
        const visibleChildren = (n.children ?? []).filter(
          (c) => !PROTECTED_IDS.has(c),
        );
        return `"${n.id}" (${n.component}) has ${visibleChildren.length} children — needs exactly 2`;
      })
      .join("; ");
    throw new Error(
      `Binary branching violated — verify, decision-gate, and user-decision-gate nodes must have exactly 2 children. ${details}.`,
    );
  }
}

// ─── Flatten ──────────────────────────────────────────────────────────────────

export function flattenTreeV3(
  metadata: DagMetadataV3,
  nodes: DagNodeV3[],
): Record<string, FlatNode> {
  const map: Record<string, FlatNode> = {};
  for (const node of nodes) {
    if (map[node.id]) {
      throw new Error(`DAG validation error: duplicate node id "${node.id}".`);
    }
    const flat: FlatNode = {
      id: node.id,
      prompt: node.prompt,
      enforcement: node.enforcement,
    };
    if (node.children && node.children.length > 0)
      flat.children = node.children;
    if (node.inject && Object.keys(node.inject).length > 0)
      flat.inject = node.inject;
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
  const PROTECTED_IDS = new Set([
    "execution-kickoff",
    "plan-success",
    "plan-fail",
  ]);
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

  // Branching limit: no node may have more than 2 children
  for (const node of filteredNodes) {
    const children = (node.children ?? []).filter((c) => !PROTECTED_IDS.has(c));
    if (children.length > 2) {
      warnings.push(
        `BRANCHING VIOLATION: "${node.id}" has ${children.length} children [${children.join(", ")}] — max 2 allowed. Decompose into nested binary decisions.`,
      );
    }
  }

  // Broken child references (skip protected node references — those are internal plumbing)
  for (const node of filteredNodes) {
    for (const childId of node.children ?? []) {
      if (!nodeMap[childId] && !PROTECTED_IDS.has(childId)) {
        warnings.push(
          `Node "${node.id}" references missing child "${childId}"`,
        );
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
    if (
      nodeMap[virtualMetadata.entry_node_id] &&
      detectCycle(virtualMetadata.entry_node_id)
    ) {
      hasCycle = true;
      warnings.push("DAG contains a cycle — diagram may not render correctly");
    }
  }

  // ── BFS depth assignment ──────────────────────────────────────────────────

  const depth: Record<string, number> = {};
  if (nodeMap[virtualMetadata.entry_node_id]) {
    const queue: Array<{ id: string; d: number }> = [
      { id: virtualMetadata.entry_node_id, d: 0 },
    ];
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
      if (nodeMap[childId])
        parentCount[childId] = (parentCount[childId] ?? 0) + 1;
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
  const bfsQueue: string[] = nodeMap[virtualMetadata.entry_node_id]
    ? [virtualMetadata.entry_node_id]
    : [];
  while (bfsQueue.length > 0) {
    const startId = bfsQueue.shift()!;
    if (visited.has(startId)) continue;

    // Collect sequential chain
    const chain: string[] = [startId];
    visited.add(startId);
    let cur = startId;
    while (isCollapsible(cur)) {
      const nextId = (nodeMap[cur].children ?? []).find(
        (c) => nodeMap[c] && !visited.has(c),
      );
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
    const isOrphan =
      orphans.has(group.ids[0]) || group.ids.some((id) => orphans.has(id));
    const label = group.ids
      .map((id) => {
        const comp = nodeMap[id]?.component;
        return comp ? `${id} (${comp})` : id;
      })
      .join("<br/>");
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

  const PROTECTED_IDS = new Set([
    "execution-kickoff",
    "plan-success",
    "plan-fail",
  ]);

  // Build a node map for O(1) lookup
  const nodeMap: Record<string, DagNodeV3> = {};
  for (const n of nodes) nodeMap[n.id] = n;

  // Render a group of nodes in compact arrow format.
  //
  // Uses topological sort (Kahn's algorithm) for ordering — no dependency on
  // entry node. Roots naturally appear first, leaves last. Linear chains
  // (single-child → single-parent) are collapsed into one line. Branching
  // nodes show children in brackets. Convergence points (nodes with multiple
  // parents) start their own line and are referenced with → arrows.
  function renderGroup(group: DagNodeV3[]): string {
    const groupIds = new Set(group.map((n) => n.id));

    // ── In-group parent counts (for chain collapse decisions) ──────────────
    const inGroupParents: Record<string, number> = {};
    for (const n of group) inGroupParents[n.id] = 0;
    for (const n of group) {
      for (const childId of (n.children ?? []).filter(
        (c) => !PROTECTED_IDS.has(c),
      )) {
        if (groupIds.has(childId)) {
          inGroupParents[childId] = (inGroupParents[childId] ?? 0) + 1;
        }
      }
    }

    // ── Topological sort (Kahn's) — gives top-to-bottom order ─────────────
    const inDegree: Record<string, number> = {};
    for (const id of groupIds) inDegree[id] = inGroupParents[id] ?? 0;
    const kahnQueue: string[] = [];
    for (const n of group) {
      if (inDegree[n.id] === 0) kahnQueue.push(n.id);
    }
    const topoOrder: string[] = [];
    while (kahnQueue.length > 0) {
      const id = kahnQueue.shift()!;
      topoOrder.push(id);
      for (const childId of (nodeMap[id]?.children ?? []).filter(
        (c) => !PROTECTED_IDS.has(c),
      )) {
        if (groupIds.has(childId)) {
          inDegree[childId]--;
          if (inDegree[childId] === 0) kahnQueue.push(childId);
        }
      }
    }
    // Append cycle members not reached by Kahn's
    for (const n of group) {
      if (!topoOrder.includes(n.id)) topoOrder.push(n.id);
    }

    // ── Format helpers ────────────────────────────────────────────────────
    function nodeLabel(id: string): string {
      return `(${id})`;
    }

    // ── Walk chains in topo order ─────────────────────────────────────────
    const rendered = new Set<string>();
    const chains: string[] = [];

    for (const startId of topoOrder) {
      if (rendered.has(startId)) continue;

      const parts: string[] = [];
      let cur: string | null = startId;

      while (cur && !rendered.has(cur)) {
        rendered.add(cur);
        const node = nodeMap[cur];
        if (!node) break;
        const children = (node.children ?? []).filter(
          (c) => !PROTECTED_IDS.has(c),
        );

        if (children.length === 0) {
          // Leaf
          parts.push(nodeLabel(cur));
          cur = null;
        } else if (children.length === 1) {
          const nextId = children[0];
          // Continue chain only if child is in-group, unrendered, single-parent
          if (
            groupIds.has(nextId) &&
            !rendered.has(nextId) &&
            (inGroupParents[nextId] ?? 0) <= 1
          ) {
            parts.push(nodeLabel(cur));
            cur = nextId;
          } else {
            // End chain with forward reference
            parts.push(nodeLabel(cur));
            parts.push(`[→ ${nextId}]`);
            cur = null;
          }
        } else {
          // Branching — show children in brackets, mark already-rendered or out-of-group
          // Also mark in-group leaf children as rendered so they don't get standalone lines
          const annotations = children.map((childId) => {
            if (rendered.has(childId) || !groupIds.has(childId))
              return `→ ${childId}`;
            const childChildren = (nodeMap[childId]?.children ?? []).filter(
              (c) => !PROTECTED_IDS.has(c),
            );
            if (childChildren.length === 0) rendered.add(childId); // leaf — mark rendered, no standalone line
            return childId;
          });
          parts.push(`${nodeLabel(cur)} → [${annotations.join(", ")}]`);
          cur = null;
        }
      }

      // Stopped at already-rendered node — show convergence
      if (cur && rendered.has(cur)) {
        parts.push(`[→ ${cur}]`);
      }

      if (parts.length > 0) {
        chains.push(parts.join(" → "));
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
      if (childId === "plan-success" && !successExits.includes(n.id))
        successExits.push(n.id);
      if (childId === "plan-fail" && !failureExits.includes(n.id))
        failureExits.push(n.id);
    }
  }

  // Find leaf work nodes that have no set_exit_point yet
  const allExits = new Set([...successExits, ...failureExits]);
  const unsetLeaves = workNodes.filter(
    (n) =>
      (!n.children ||
        n.children.filter((c) => !PROTECTED_IDS.has(c)).length === 0) &&
      !allExits.has(n.id),
  );

  const lines: string[] = [];
  lines.push(`plan: ${metadata.id}`);
  lines.push("");

  // Entry/exit status section
  lines.push(BANNER);
  lines.push("// ENTRY / EXIT STATUS");
  lines.push(BANNER);
  lines.push(`// entry: ${entryNodeId ?? "(not set)"}`);
  lines.push(
    `// success exits: ${successExits.length > 0 ? successExits.join(", ") : "(none)"}`,
  );
  lines.push(
    `// failure exits: ${failureExits.length > 0 ? failureExits.join(", ") : "(none)"}`,
  );
  if (unsetLeaves.length > 0) {
    lines.push(
      `// unset leaf nodes: ${unsetLeaves.map((n) => n.id).join(", ")}`,
    );
  }
  lines.push("");

  // Node types index — flat lookup of all node IDs and their component types
  lines.push(BANNER);
  lines.push("// NODE TYPES");
  lines.push(BANNER);
  for (const n of workNodes) {
    if (n.component) {
      lines.push(`// ${n.id} [type: ${n.component}]`);
    }
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
  // Only include nodes that are themselves orphaned — don't follow children into the connected set
  const orphanIds = new Set(orphanedWork.map((n) => n.id));
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
          // Only follow children that are also orphaned
          if (!PROTECTED_IDS.has(childId) && orphanIds.has(childId))
            groupQueue.push(childId);
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

  let result = `DAG: ${metadata.id}\n\n`;
  if (orphanWorkGroups.length > 0) {
    result += `${orphanWorkGroups.length} orphaned group(s)\n\n`;
  }
  result += lines.join("\n").trimEnd();
  return result;
}
