import * as fs from "fs";
import * as path from "path";
import type { PhaseRecord } from "../../types";
import { VALID_PHASE_TYPES, BRANCHING_PHASE_TYPE_SET, validatePhaseOptions } from "./phase-validation";
import { compilePhasesToNodes } from "../../phase-expander";
import { writeDagV3 } from "../../dag-io";
import { flattenTreeV3 } from "../../dag-tree";

export interface CompileResult {
  planDir: string;
  phasePlanPath: string;
  compiledPlanPath: string;
  phaseCount: number;
  nodeCount: number;
}

/**
 * Parse, validate, compile and write a TOML phase plan to disk.
 * Used by both create_plan (tool) and activate_plan (before-hook recompile).
 */
export function compilePlan(
  plan_name: string,
  toml: string,
  worktree: string,
): CompileResult {
  const planDir = path.join(worktree, ".opencode", "session-plans", plan_name);
  const phasePlanPath = path.join(planDir, "phase-plan.toml");
  const compiledPlanPath = path.join(planDir, "plan.jsonl");

  // Parse TOML
  let parsed: Record<string, unknown>;
  try {
    parsed = Bun.TOML.parse(toml);
  } catch (e: any) {
    throw new Error(`Invalid TOML: ${e.message}`);
  }

  const rawPhases = parsed.phases as Record<string, unknown>[] | undefined;
  if (!Array.isArray(rawPhases) || rawPhases.length === 0) {
    throw new Error("Plan must contain at least one [[phases]] entry.");
  }

  // Validate and build phase list
  const phaseIds = new Set<string>();
  const phaseList: PhaseRecord[] = [];

  for (const raw of rawPhases) {
    const id = raw.id as string;
    const phase_type = raw.type as string;
    if (!id) throw new Error("Every [[phases]] entry must have an id field.");
    if (!phase_type) throw new Error(`Phase '${id}' is missing a type field.`);
    if (phaseIds.has(id)) throw new Error(`Duplicate phase id: '${id}'.`);
    phaseIds.add(id);

    if (!VALID_PHASE_TYPES.has(phase_type)) {
      throw new Error(
        `Phase '${id}': invalid type '${phase_type}'. Valid types: ${[...VALID_PHASE_TYPES].join(", ")}.`,
      );
    }

    const phase_options: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(raw)) {
      if (k !== "id" && k !== "type" && k !== "next") {
        phase_options[k] = v;
      }
    }

    validatePhaseOptions(phase_type, phase_options);

    phaseList.push({
      phase: id,
      phase_type: phase_type as any,
      phase_options,
      children: [],
    });
  }

  // Derive children from next fields
  const phaseMap = new Map(phaseList.map((p) => [p.phase, p]));
  const allReferencedIds = new Set<string>();

  for (const raw of rawPhases) {
    const nextRaw = raw.next as string[] | undefined;
    if (!nextRaw || nextRaw.length === 0) continue;
    const current = phaseMap.get(raw.id as string)!;
    for (const childId of nextRaw) {
      if (!phaseMap.has(childId)) {
        throw new Error(
          `Phase '${raw.id}': next references unknown phase '${childId}'.`,
        );
      }
      if (!current.children.includes(childId)) {
        current.children.push(childId);
      }
      allReferencedIds.add(childId);
    }
  }

  // Validate single entry point
  const entryPhases = rawPhases.filter(
    (raw) => !allReferencedIds.has(raw.id as string),
  );
  if (entryPhases.length === 0) {
    throw new Error(
      "Plan has no entry point. Exactly one phase must not appear in any other phase's 'next' array.",
    );
  }
  if (entryPhases.length > 1) {
    const ids = entryPhases.map((p) => `'${p.id}'`).join(", ");
    throw new Error(
      `Plan has ${entryPhases.length} entry points (${ids}). Exactly one phase must not appear in any other phase's 'next' array.`,
    );
  }
  const entryPhaseId = entryPhases[0].id as string;

  // Validate branching constraints
  for (const phase of phaseList) {
    if (
      BRANCHING_PHASE_TYPE_SET.has(phase.phase_type) &&
      phase.children.length < 2
    ) {
      throw new Error(
        `Phase '${phase.phase}' (${phase.phase_type}) must have at least 2 child phases. Found ${phase.children.length}.`,
      );
    }
    if (
      !BRANCHING_PHASE_TYPE_SET.has(phase.phase_type) &&
      phase.children.length > 1
    ) {
      throw new Error(
        `Phase '${phase.phase}' (${phase.phase_type}) cannot have multiple children. Only agentic-decision-gate and user-decision-gate may branch.`,
      );
    }
  }

  // Write and compile
  fs.mkdirSync(planDir, { recursive: true });
  fs.writeFileSync(phasePlanPath, toml, "utf-8");

  const compiled = compilePhasesToNodes(plan_name, phaseList, entryPhaseId);
  writeDagV3(compiledPlanPath, compiled.metadata, compiled.nodes);

  return {
    planDir,
    phasePlanPath,
    compiledPlanPath,
    phaseCount: phaseList.length,
    nodeCount: compiled.nodes.length,
  };
}

/**
 * Recompile a plan from its existing phase-plan.toml on disk.
 * Used by activate_plan to always pick up manual edits.
 */
export function recompilePlan(
  plan_name: string,
  worktree: string,
): { compiledPlanPath: string; metadata: any; nodeMap: any } {
  const planDir = path.join(worktree, ".opencode", "session-plans", plan_name);
  const phasePlanPath = path.join(planDir, "phase-plan.toml");
  const compiledPlanPath = path.join(planDir, "plan.jsonl");

  if (!fs.existsSync(phasePlanPath)) {
    throw new Error(
      `Plan '${plan_name}' not found. Create it first with create_plan.`,
    );
  }

  const toml = fs.readFileSync(phasePlanPath, "utf-8");
  const parsed = Bun.TOML.parse(toml) as Record<string, unknown>;
  const rawPhases = parsed.phases as Record<string, unknown>[];

  const phaseList: PhaseRecord[] = [];
  const phaseMap = new Map<string, PhaseRecord>();

  for (const raw of rawPhases) {
    const phase: PhaseRecord = {
      phase: raw.id as string,
      phase_type: raw.type as any,
      phase_options: Object.fromEntries(
        Object.entries(raw).filter(
          ([k]) => k !== "id" && k !== "type" && k !== "next",
        ),
      ),
      children: [],
    };
    phaseList.push(phase);
    phaseMap.set(phase.phase, phase);
  }

  const referencedIds = new Set<string>();
  for (const raw of rawPhases) {
    const nextArr = raw.next as string[] | undefined;
    if (nextArr) {
      const current = phaseMap.get(raw.id as string);
      for (const childId of nextArr) {
        if (current && !current.children.includes(childId)) {
          current.children.push(childId);
        }
        referencedIds.add(childId);
      }
    }
  }

  const entryPhaseId =
    phaseList.find((p) => !referencedIds.has(p.phase))?.phase ??
    phaseList[0].phase;

  const compiled = compilePhasesToNodes(plan_name, phaseList, entryPhaseId);
  writeDagV3(compiledPlanPath, compiled.metadata, compiled.nodes);

  const nodeMap = flattenTreeV3(compiled.metadata, compiled.nodes);

  return { compiledPlanPath, metadata: compiled.metadata, nodeMap };
}
