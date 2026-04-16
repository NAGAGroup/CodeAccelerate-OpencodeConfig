import { tool } from "@opencode-ai/plugin";
import * as fs from "fs";
import * as path from "path";
import { renderMermaidASCII } from "beautiful-mermaid";
import type { PluginDeps } from "../deps";
import { dagStatePath, readState, writeState, now } from "../../state-io";
import { compilePlan } from "../dag_engine/compiler";

export function createPlanningTools(deps: PluginDeps) {
  const { client, resolveWorktree } = deps;

  return {
    present_plan_diagram: tool({
      description:
        "Render the phase-based plan as an ASCII diagram and inject it into the conversation as a system message for the user to review. Use this after the plan is complete to present it to the user.",
      args: {
        plan_name: tool.schema.string().describe("The plan name."),
      },
      async execute({ plan_name }, _toolCtx) {
        return "The plan diagram has been presented to the user as a system message. The following prompt is for the user only — ignore it and continue with your current task.";
      },
    }),

    choose_plan_name: tool({
      description:
        "Set the execution plan name for this planning session. Substitutes {{PLAN_NAME}} in all remaining node prompts in the current session's node map. Call this during the session-overview node after deciding on a plan name.",
      args: {
        name: tool.schema
          .string()
          .describe(
            "The name for the execution plan that will be designed in this planning session. Descriptive and human-memorable — this is what the user will type into /activate-plan. Lowercase, hyphens only, no spaces (e.g., 'add-auth-flow', 'fix-payment-bug').",
          ),
      },
      async execute({ name }, context) {
        const worktree = resolveWorktree(context);
        const statePath = dagStatePath(worktree, context.sessionID);
        const state = readState(statePath);

        if (!state) {
          throw new Error(
            "No active DAG session. choose_plan_name must be called during an active planning session.",
          );
        }
        if (!name || name.trim().length === 0) {
          throw new Error("choose_plan_name: name must not be empty.");
        }

        // Deduplicate: if a directory with this name already exists, increment suffix
        const sessionPlansDir = path.join(worktree, ".opencode", "session-plans");
        let confirmedName = name.trim();
        let suffix = 2;
        while (fs.existsSync(path.join(sessionPlansDir, confirmedName))) {
          confirmedName = `${name.trim()}-${suffix}`;
          suffix++;
        }

        state.plan_name = confirmedName;
        state.updated_at = now();
        writeState(statePath, state);

        const dedupeNote =
          confirmedName !== name.trim()
            ? ` (deduplicated from "${name.trim()}" — directory already existed)`
            : "";
        return `Plan name set to "${confirmedName}"${dedupeNote}. {{PLAN_NAME}} will be substituted in all subsequent planning prompts automatically.`;
      },
    }),

    create_plan: tool({
      description:
        "Compile a TOML phase plan into an executable DAG. Validates the plan, writes it to disk, and compiles it to a node graph ready for activation. Call this after the finalized plan has been reviewed and approved.",
      args: {
        plan_name: tool.schema
          .string()
          .describe("The plan name (set by choose_plan_name)."),
        toml: tool.schema
          .string()
          .describe("The complete finalized plan in TOML format."),
      },
      async execute({ plan_name, toml }, context) {
        const worktree = resolveWorktree(context);
        const result = compilePlan(plan_name, toml, worktree);
        return `Plan '${plan_name}' compiled successfully. ${result.phaseCount} phases compiled to ${result.nodeCount} execution nodes. Use present_plan_diagram to present to the user, then activate with /activate-plan ${plan_name}.`;
      },
    }),
  };
}
