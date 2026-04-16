/**
 * phase-expander.ts
 *
 * Compiles a phase-based plan (schema 4.0) into a flat node graph (schema 3.0)
 * that the existing execution engine can run unchanged.
 *
 * Two-pass process:
 *   Pass 1 — expandPhase(): expand each phase into internal nodes + track exit slots
 *   Pass 2 — wire(): connect exit slots to the next phase's entry node
 */

import * as fs from "fs";
import * as path from "path";
import { CONFIG_ROOT } from "./constants";
import type { PhaseRecord, DagNodeV3, DagMetadataV3 } from "./types";

// Sentinel used in children[] to mark unresolved exit slots
const EXIT = "__EXIT__";

// ─── Node library helpers ─────────────────────────────────────────────────────

function nodeLibPath(componentType: string): string {
  return path.join(CONFIG_ROOT, "planning", "plan-session", "node-library", componentType);
}

interface NodeSpec {
  enforcement: string[];
  promptPath: string;
}

const specCache = new Map<string, NodeSpec>();

function loadNodeSpec(componentType: string): NodeSpec {
  if (specCache.has(componentType)) return specCache.get(componentType)!;
  const dir = nodeLibPath(componentType);
  const specPath = path.join(dir, "node-spec.json");
  const promptPath = path.join(dir, "prompt.md");
  if (!fs.existsSync(specPath)) {
    throw new Error(`Node spec not found for component "${componentType}" at ${specPath}`);
  }
  const spec = JSON.parse(fs.readFileSync(specPath, "utf-8")) as { enforcement: string[] };
  const result = { enforcement: spec.enforcement, promptPath };
  specCache.set(componentType, result);
  return result;
}

function makeNode(
  id: string,
  componentType: string,
  inject: Record<string, string>,
  children: string[] = [],
): DagNodeV3 {
  const { enforcement, promptPath } = loadNodeSpec(componentType);
  const node: DagNodeV3 = { id, prompt: promptPath, enforcement, component: componentType };
  if (Object.keys(inject).length > 0) node.inject = inject;
  if (children.length > 0) node.children = children;
  return node;
}

// ─── Phase expansion result ───────────────────────────────────────────────────

interface PhaseExpansion {
  entryNodeId: string;
  nodes: DagNodeV3[];
  /** nodeId + childIndex pairs whose child is an unresolved EXIT slot (point to next phase entry or auto-exit) */
  exitSlots: Array<{ nodeId: string; childIndex: number }>;
  /** For branching phases: each child phase ID maps to the gate node childIndex to receive it */
  branchMap?: Map<string, number>; // childPhaseId → index in gate.children
  gateNodeId?: string;
}

// ─── Individual phase expanders ───────────────────────────────────────────────

function bullets(items: string[]): string {
  return items.map((q) => `- ${q}`).join("\n");
}

function expandExternalResearch(phase: PhaseRecord): PhaseExpansion {
  const questions = phase.phase_options.questions as string[];
  const researchType = (phase.phase_options["research-type"] as string) ?? "standard";
  const component = researchType === "deep" ? "deep-research" : "external-scout";
  const nodeId = `${phase.phase}`;
  const node = makeNode(nodeId, component, { DESCRIPTION: `Running external research for the following questions:\n\n${bullets(questions)}` }, [EXIT]);
  return {
    entryNodeId: nodeId,
    nodes: [node],
    exitSlots: [{ nodeId, childIndex: 0 }],
  };
}

function expandInternalResearch(phase: PhaseRecord): PhaseExpansion {
  const questions = phase.phase_options.questions as string[];
  const scoutId = `${phase.phase}-scout`;
  const insurgentId = `${phase.phase}-insurgent`;
  const nodes: DagNodeV3[] = [
    makeNode(scoutId, "context-scout", { DESCRIPTION: `Surveying the following topics:\n\n${bullets(questions)}` }, [insurgentId]),
    makeNode(insurgentId, "context-insurgent", { DESCRIPTION: `Investigating the following questions:\n\n${bullets(questions)}` }, [EXIT]),
  ];
  return {
    entryNodeId: scoutId,
    nodes,
    exitSlots: [{ nodeId: insurgentId, childIndex: 0 }],
  };
}

function expandProjectSurvey(phase: PhaseRecord): PhaseExpansion {
  const topics = phase.phase_options.topics as string[];
  const nodeId = `${phase.phase}`;
  const node = makeNode(nodeId, "context-scout", { DESCRIPTION: `Surveying the following topics:\n\n${bullets(topics)}` }, [EXIT]);
  return {
    entryNodeId: nodeId,
    nodes: [node],
    exitSlots: [{ nodeId, childIndex: 0 }],
  };
}

function expandWork(phase: PhaseRecord): PhaseExpansion {
  const goal = phase.phase_options.goal as string;
  const workType = phase.phase_options["work-type"] as string;
  const verifyDescription = phase.phase_options["verify-description"] as string;
  const retries = 5;
  const commit = (phase.phase_options.commit as boolean) ?? false;
  const workComponent =
    workType === "docs" ? "documentation-expert-work-item" : "junior-dev-work-item";
  const fixComponent =
    workType === "docs" ? "documentation-expert-fix-item" : "junior-dev-fix-item";

  // Embedded pre-work research/setup fields
  const surveyTopics = (phase.phase_options["project-survey-topics"] as string[]) ?? [];
  const externalQuestions = (phase.phase_options["web-search-questions"] as string[]) ?? [];
  const internalQuestions = (phase.phase_options["deep-search-questions"] as string[]) ?? [];
  const setupGoals = (phase.phase_options["pre-work-project-setup"] as string[]) ?? [];

  const nodes: DagNodeV3[] = [];
  const exitSlots: Array<{ nodeId: string; childIndex: number }> = [];

  // Build the pre-work chain: survey → external → internal → setup
  // Each group collapses to a single node with a bulleted description
  const preWorkIds: string[] = [];

  if (surveyTopics.length > 0) {
    const id = `${phase.phase}-survey`;
    nodes.push(makeNode(id, "context-scout", { DESCRIPTION: `Surveying the following topics:\n\n${bullets(surveyTopics)}` }, []));
    preWorkIds.push(id);
  }
  if (externalQuestions.length > 0) {
    const id = `${phase.phase}-ext`;
    nodes.push(makeNode(id, "external-scout", { DESCRIPTION: `Running external research for the following questions:\n\n${bullets(externalQuestions)}` }, []));
    preWorkIds.push(id);
  }
  if (internalQuestions.length > 0) {
    const id = `${phase.phase}-internal`;
    nodes.push(makeNode(id, "context-insurgent", { DESCRIPTION: `Investigating the following questions:\n\n${bullets(internalQuestions)}` }, []));
    preWorkIds.push(id);
  }
  if (setupGoals.length > 0) {
    const id = `${phase.phase}-presetup`;
    nodes.push(makeNode(id, "project-setup", { DESCRIPTION: `Running the following setup steps:\n\n${bullets(setupGoals)}` }, []));
    preWorkIds.push(id);
  }

  const workId = `${phase.phase}-work`;
  const initialVerifyId = `${phase.phase}-verify`;

  // Wire pre-work chain: each node → next, last → workId
  for (let i = 0; i < preWorkIds.length; i++) {
    const nextId = i < preWorkIds.length - 1 ? preWorkIds[i + 1] : workId;
    nodes.find((n) => n.id === preWorkIds[i])!.children = [nextId];
  }

  const entryNodeId = preWorkIds.length > 0 ? preWorkIds[0] : workId;

  // Initial verify branches: success → EXIT, fail → triage-1
  const triage1Id = `${phase.phase}-triage-1`;
  nodes.push(makeNode(workId, workComponent, { GOAL: goal, VERIFY_DESCRIPTION: verifyDescription }, [initialVerifyId]));
  nodes.push(
    makeNode(initialVerifyId, "verify-work-item", { GOAL: goal, VERIFY_DESCRIPTION: verifyDescription }, [EXIT, triage1Id]),
  );
  exitSlots.push({ nodeId: initialVerifyId, childIndex: 0 }); // success branch

  // Triage → fix → verify retry chain
  for (let r = 1; r <= retries; r++) {
    const triageId = `${phase.phase}-triage-${r}`;
    const fixId = `${phase.phase}-fix-${r}`;
    const verifyRId = `${phase.phase}-verify-${r}`;

    nodes.push(makeNode(triageId, "verify-triage", { GOAL: goal, VERIFY_DESCRIPTION: verifyDescription }, [fixId]));
    nodes.push(makeNode(fixId, fixComponent, { GOAL: goal, VERIFY_DESCRIPTION: verifyDescription }, [verifyRId]));

    if (r < retries) {
      // Non-final retry verify: branches to [EXIT, next-triage]
      const nextTriageId = `${phase.phase}-triage-${r + 1}`;
      nodes.push(
        makeNode(verifyRId, "verify-work-item", { GOAL: goal, VERIFY_DESCRIPTION: verifyDescription }, [EXIT, nextTriageId]),
      );
      exitSlots.push({ nodeId: verifyRId, childIndex: 0 }); // success branch
    } else {
      // Final retry verify: linear (both outcomes go forward)
      nodes.push(makeNode(verifyRId, "verify-work-item", { GOAL: goal, VERIFY_DESCRIPTION: verifyDescription }, [EXIT]));
      exitSlots.push({ nodeId: verifyRId, childIndex: 0 });
    }
  }

  // Optional commit node — inserted before the exit destination
  // All exit slots → commit → exit destination
  if (commit) {
    const commitId = `${phase.phase}-commit`;
    nodes.push(makeNode(commitId, "commit", {}, [EXIT]));
    // Redirect all current exit slots to the commit node
    for (const slot of exitSlots) {
      const node = nodes.find((n) => n.id === slot.nodeId)!;
      node.children![slot.childIndex] = commitId;
    }
    return {
      entryNodeId,
      nodes,
      exitSlots: [{ nodeId: commitId, childIndex: 0 }],
    };
  }

  return { entryNodeId, nodes, exitSlots };
}

function expandProjectCommands(phase: PhaseRecord): PhaseExpansion {
  const goals = phase.phase_options.goals as string[];
  const commit = (phase.phase_options.commit as boolean) ?? false;
  const nodeId = `${phase.phase}`;
  const nodes: DagNodeV3[] = [makeNode(nodeId, "project-setup", { DESCRIPTION: `Running the following setup steps:\n\n${bullets(goals)}` }, [EXIT])];

  if (commit) {
    const commitId = `${phase.phase}-commit`;
    nodes[0].children = [commitId];
    nodes.push(makeNode(commitId, "commit", {}, [EXIT]));
    return {
      entryNodeId: nodeId,
      nodes,
      exitSlots: [{ nodeId: commitId, childIndex: 0 }],
    };
  }

  return {
    entryNodeId: nodeId,
    nodes,
    exitSlots: [{ nodeId, childIndex: 0 }],
  };
}

function expandUserDiscussion(phase: PhaseRecord): PhaseExpansion {
  const topic = phase.phase_options.topic as string;
  const discussionId = `${phase.phase}-discussion`;
  const nodes: DagNodeV3[] = [];

  nodes.push(makeNode(discussionId, "user-discussion", { DESCRIPTION: topic }, [EXIT]));
  return {
    entryNodeId: discussionId,
    nodes,
    exitSlots: [{ nodeId: discussionId, childIndex: 0 }],
  };
}

function expandUserDecisionGate(phase: PhaseRecord): PhaseExpansion {
  const question = phase.phase_options.question as string;
  const gateId = `${phase.phase}-gate`;
  const gateDesc = question;
  const nodes: DagNodeV3[] = [];

  const gateChildren = new Array(phase.children.length).fill(EXIT);
  nodes.push(makeNode(gateId, "user-decision-gate", { DESCRIPTION: gateDesc }, gateChildren));

  const branchMap = new Map<string, number>();
  phase.children.forEach((childId, i) => branchMap.set(childId, i));

  return {
    entryNodeId: gateId,
    nodes,
    exitSlots: [],
    branchMap,
    gateNodeId: gateId,
  };
}

function expandAgenticDecisionGate(phase: PhaseRecord): PhaseExpansion {
  const question = phase.phase_options.question as string;
  const gateId = `${phase.phase}-gate`;
  const gateDesc = question;
  const nodes: DagNodeV3[] = [];

  // Gate children placeholders — one per branch child phase
  const gateChildren = new Array(phase.children.length).fill(EXIT);
  nodes.push(makeNode(gateId, "decision-gate", { DESCRIPTION: gateDesc }, gateChildren));

  const branchMap = new Map<string, number>();
  phase.children.forEach((childId, i) => branchMap.set(childId, i));

  return {
    entryNodeId: gateId,
    nodes,
    exitSlots: [],
    branchMap,
    gateNodeId: gateId,
  };
}

function expandWriteNotes(phase: PhaseRecord): PhaseExpansion {
  const context = phase.phase_options.context as string | undefined;
  const noteId = `${phase.phase}-notes`;
  const desc = context ?? "Document findings, decisions, and context for future reference.";
  const node = makeNode(noteId, "write-notes", { DESCRIPTION: desc }, [EXIT]);
  return {
    entryNodeId: noteId,
    nodes: [node],
    exitSlots: [{ nodeId: noteId, childIndex: 0 }],
  };
}

function expandEarlyExit(phase: PhaseRecord): PhaseExpansion {
  const reason = phase.phase_options.reason as string | undefined;
  const exitId = `${phase.phase}-exit`;
  const desc = reason ?? "Early exit — document context, reasoning, and any follow-up work for future sessions.";
  const node = makeNode(exitId, "write-notes", { DESCRIPTION: desc }, [EXIT]);
  return {
    entryNodeId: exitId,
    nodes: [node],
    exitSlots: [{ nodeId: exitId, childIndex: 0 }],
  };
}

function expandPhase(phase: PhaseRecord): PhaseExpansion {
  switch (phase.phase_type) {
    case "web-search":                       return expandExternalResearch(phase);
    case "deep-project-search-and-analysis": return expandInternalResearch(phase);
    case "project-survey":     return expandProjectSurvey(phase);
    case "work":               return expandWork(phase);
    case "project-setup":   return expandProjectCommands(phase);
    case "user-discussion":    return expandUserDiscussion(phase);
    case "user-decision-gate": return expandUserDecisionGate(phase);
    case "agentic-decision-gate": return expandAgenticDecisionGate(phase);
    case "write-notes":        return expandWriteNotes(phase);
    case "early-exit":         return expandEarlyExit(phase);
    default:
      throw new Error(`Unknown phase type: ${(phase as PhaseRecord).phase_type}`);
  }
}

// ─── Auto write-notes leaf node ───────────────────────────────────────────────

function makeAutoExitNote(phase: PhaseRecord): DagNodeV3 {
  const noteId = `${phase.phase}-auto-exit`;
  const desc = `Execution of phase "${phase.phase}" complete. Document what was accomplished, any deferred items, and context for future sessions.`;
  return makeNode(noteId, "write-notes", { DESCRIPTION: desc });
}

// ─── Main compiler ────────────────────────────────────────────────────────────

export function compilePhasesToNodes(
  planId: string,
  phases: PhaseRecord[],
  entryPhaseId: string,
): { metadata: DagMetadataV3; nodes: DagNodeV3[] } {
  // Pass 1: expand each phase
  const expansions = new Map<string, PhaseExpansion>();
  for (const phase of phases) {
    expansions.set(phase.phase, expandPhase(phase));
  }

  const phaseMap = new Map<string, PhaseRecord>();
  for (const phase of phases) phaseMap.set(phase.phase, phase);

  // Collect all expanded nodes into a mutable map
  const nodeMap = new Map<string, DagNodeV3>();
  for (const [, exp] of expansions) {
    for (const node of exp.nodes) nodeMap.set(node.id, node);
  }

  // Pass 2: wire exit slots to child phase entries (or auto-exit notes for leaves)
  for (const phase of phases) {
    const exp = expansions.get(phase.phase)!;

    if (exp.branchMap && exp.gateNodeId) {
      // Branching phase: wire each branch slot to child entry
      const gateNode = nodeMap.get(exp.gateNodeId)!;
      for (const [childPhaseId, childIndex] of exp.branchMap) {
        const childExp = expansions.get(childPhaseId);
        if (!childExp) throw new Error(`Phase "${childPhaseId}" not found during wiring`);
        if (!gateNode.children) gateNode.children = [];
        gateNode.children[childIndex] = childExp.entryNodeId;
      }
    }

    if (exp.exitSlots.length === 0) continue; // branching or true terminal

    const childPhaseIds = phase.children ?? [];

    if (childPhaseIds.length === 0) {
      // Leaf phase — add auto write-notes exit if not already a terminal type
      if (phase.phase_type !== "write-notes" && phase.phase_type !== "early-exit") {
        const autoNote = makeAutoExitNote(phase);
        nodeMap.set(autoNote.id, autoNote);
        for (const slot of exp.exitSlots) {
          const node = nodeMap.get(slot.nodeId)!;
          if (!node.children) node.children = [];
          while (node.children.length <= slot.childIndex) node.children.push(EXIT);
          node.children[slot.childIndex] = autoNote.id;
        }
      }
      // write-notes / early-exit are already terminal, exit slots are empty
    } else if (childPhaseIds.length === 1) {
      const childExp = expansions.get(childPhaseIds[0]);
      if (!childExp) throw new Error(`Phase "${childPhaseIds[0]}" not found during wiring`);
      for (const slot of exp.exitSlots) {
        const node = nodeMap.get(slot.nodeId)!;
        if (!node.children) node.children = [];
        while (node.children.length <= slot.childIndex) node.children.push(EXIT);
        node.children[slot.childIndex] = childExp.entryNodeId;
      }
    } else {
      // Multiple children on a non-branching phase — convergence case
      // All exit slots point to the first child (convergence is handled by multiple parents → same entry)
      // This only happens when parent has multiple children that are the same phase (should not occur)
      throw new Error(
        `Phase "${phase.phase}" (${phase.phase_type}) has ${childPhaseIds.length} children but is not a branching type`,
      );
    }
  }

  // Add execution-kickoff as the graph entry
  const kickoffSpec = loadNodeSpec("execution-kickoff");
  const entryExp = expansions.get(entryPhaseId);
  if (!entryExp) throw new Error(`Entry phase "${entryPhaseId}" not found`);

  const kickoff: DagNodeV3 = {
    id: "execution-kickoff",
    prompt: kickoffSpec.promptPath,
    enforcement: kickoffSpec.enforcement,
    component: "execution-kickoff",
    children: [entryExp.entryNodeId],
  };

  const allNodes: DagNodeV3[] = [kickoff, ...nodeMap.values()];

  // Sanitize: remove any remaining EXIT sentinels (should not occur, but guard against it)
  for (const node of allNodes) {
    if (node.children) {
      node.children = node.children.filter((c) => c !== EXIT);
      if (node.children.length === 0) delete node.children;
    }
  }

  const metadata: DagMetadataV3 = {
    schema_version: "3.0",
    id: planId,
    entry_node_id: "execution-kickoff",
  };

  return { metadata, nodes: allNodes };
}
