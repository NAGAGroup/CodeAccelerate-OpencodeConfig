import { tool } from "@opencode-ai/plugin";
import type { Plugin } from "@opencode-ai/plugin";
import { renderMermaidASCII } from "beautiful-mermaid";
import * as fs from "fs";
import * as path from "path";
import type {
  DecisionEntry,
  DagSessionState,
  DagNodeV3,
  DagMetadataV3,
} from "./types";
import { exemptTools, isExempt, CONFIG_ROOT } from "./constants";
import { dagStatePath, writeState, readState, now } from "./state-io";
import { expandPath, readPrompt, resolveDagPath } from "./path-utils";
import { readDagV3, writeDagV3 } from "./dag-io";
import {
  dagToMermaidCompactV3,
  validateDagV3,
  flattenTreeV3,
  formatCompactDagDraft,
} from "./dag-tree";
import { copyPlanningDag } from "./dag-lifecycle";
import { ensureOpenCodeIgnore } from "./plugin-utils";
import {
  detectDivergence,
  suggestRecoveryActions,
} from "./divergence-detection";

/** Append planner-authored description to a static component prompt. */
function withDescription(promptText: string, description?: string): string {
  if (!description) return promptText;
  return `${promptText}\n\n---\n\n## Node Context\n\n${description}`;
}

export const PlanningEnforcementPlugin: Plugin = async (_ctx) => {
  const { client } = _ctx;

  // Helper to resolve worktree with fallback to cwd
  const resolveWorktree = (_ctx: { worktree?: string }) => process.cwd();

  // Per-turn cache: populated by chat.params (has sessionID), consumed by
  // experimental.chat.system.transform (input: {} — no sessionID available).
  let _dagActiveThisTurn = false;

  // Ensure .opencodeignore exists and includes !.opencode/ pattern
  ensureOpenCodeIgnore(resolveWorktree(_ctx));

  return {
    // ── Tools ──────────────────────────────────────────────────────────────

    tool: {
      plan_session: tool({
        description:
          "Start a /plan-session planning session. Copies the global planning DAG locally and activates it.",
        args: {},
        async execute(_args, context) {
          // State creation and prompt injection handled by tool.execute.before.
          const worktree = resolveWorktree(context);
          const statePath = dagStatePath(worktree, context.sessionID);
          const state = readState(statePath);
          if (!state) return "Failed to activate plan session.";
          return `DAG "${state.dag_id}" activated. Your next task, "${state.current_node}", will be presented in the following message.`;
        },
      }),

      activate_plan: tool({
        description:
          "Activate a project DAG produced by a planning session. Reads plan.jsonl from the given session plan directory and starts execution.",
        args: {
          plan_name: tool.schema
            .string()
            .describe(
              "Name of the session plan to activate (matches directory under .opencode/session-plans/).",
            ),
        },
        async execute({ plan_name }, context) {
          // State creation and prompt injection handled by tool.execute.before.
          const worktree = resolveWorktree(context);
          const statePath = dagStatePath(worktree, context.sessionID);
          const state = readState(statePath);
          if (!state) return `Failed to activate plan "${plan_name}".`;
          return `DAG "${state.dag_id}" activated. Your next task, "${state.current_node}", will be presented in the following message.`;
        },
      }),

      next_step: tool({
        description:
          "Call this after completing a node's todos to advance to the next node. Required on every node. Pass { next } to choose a branch; omit for linear advance or session completion.",
        args: {
          next: tool.schema
            .string()
            .optional()
            .describe(
              "The node ID of the branch to take (required for branching nodes, omit for linear advance).",
            ),
        },
        async execute({ next }, context) {
          // Validation and prompt injection already happened in tool.execute.before.
          // If we reach here, the call is valid. Do state transitions and return status.
          const statePath = dagStatePath(
            resolveWorktree(context),
            context.sessionID,
          );
          const state = readState(statePath);

          if (!state) return "No active DAG session.";

          const node = state.node_map[state.current_node];
          if (!node)
            return `Current node "${state.current_node}" not found in DAG.`;

          const children = node.children ?? [];

          // Terminal — end session
          if (children.length === 0) {
            state.status = "complete";
            state.updated_at = now();
            writeState(statePath, state);

            const isPlanningSession = state.dag_id.startsWith("plan-session");
            if (isPlanningSession) {
              return (
                `Node "${node.id}" complete. DAG session "${state.dag_id}" finished.\n\n` +
                `---\n\n` +
                `**PLANNING SESSION COMPLETE.** Do NOT continue executing tasks. ` +
                `Present the final DAG to the user by calling \`present_dag_diagram\` with the plan name, then ` +
                `present a summary of what was produced. ` +
                `If a project DAG was written, tell the user they can activate it with \`/activate-plan {plan-name}\`.`
              );
            } else {
              return (
                `Node "${node.id}" complete. DAG session "${state.dag_id}" finished.\n\n` +
                `---\n\n` +
                `**EXECUTION COMPLETE.** Do NOT continue executing tasks. ` +
                `Present a summary to the user of what was accomplished, any deferred items, and known limitations.`
              );
            }
          }

          // Branching — record decision
          if (children.length > 1) {
            state.decisions.push({
              node_id: state.current_node,
              timestamp: now(),
              summary: `Chose branch "${next}"`,
            });
          }

          // Advance to next node
          const nextId = children.length === 1 ? children[0] : next!;
          const nextNode = state.node_map[nextId];
          if (!nextNode)
            throw new Error(`Next node "${nextId}" not found in DAG`);

          state.current_node = nextId;
          state.todo_index = 0;
          state.status = "running";
          state.updated_at = now();
          writeState(statePath, state);

          // Handle zero-enforcement nodes (passthrough)
          if (nextNode.enforcement.length === 0) {
            const nextChildren = nextNode.children ?? [];
            if (nextChildren.length > 0) {
              state.status = "waiting_step";
            } else {
              state.status = "complete";
            }
            writeState(statePath, state);
          }

          // Build status message
          const { metadata } = readDagV3(state.plan_path);
          const isFromEntryNode = node.id === metadata.entry_node_id;

          let result = "";
          if (!isFromEntryNode) {
            result += `You have just completed "${node.id}". `;
          }
          result += `Your next task, "${nextId}", will be presented in the following message.`;

          return result;
        },
      }),

      recover_context: tool({
        description:
          "Recover DAG session context after autocompaction or context loss. Returns current node, completed work, and decisions made. Also detects and reports any divergence between session state and DAG structure.",
        args: {},
        async execute(_args, context) {
          const statePath = dagStatePath(
            resolveWorktree(context),
            context.sessionID,
          );
          const state = readState(statePath);

          if (!state) return "No active DAG session found.";

          // Detect divergence between state and DAG
          const divergenceReport = detectDivergence(state);
          let divergenceWarning = "";
          if (divergenceReport.hasDivergence) {
            divergenceWarning = "# ⚠️ DIVERGENCE DETECTED\n\n";
            for (const issue of divergenceReport.issues) {
              divergenceWarning += `**[${issue.severity.toUpperCase()}] ${issue.type}:** ${issue.description}\n\n`;
            }
            const suggestions = suggestRecoveryActions(divergenceReport);
            divergenceWarning += "## Suggested Recovery Actions\n";
            suggestions.forEach((s) => {
              divergenceWarning += `- ${s}\n`;
            });
            divergenceWarning += "\n---\n\n";
          }

          // Resume an abandoned session from where it left off
          if (state.status === "abandoned") {
            const node = state.node_map[state.current_node];
            const remaining = node
              ? node.enforcement.length - state.todo_index
              : 0;
            // If all enforcement items were done, resume as waiting_step; otherwise resume as running
            state.status = remaining === 0 ? "waiting_step" : "running";
            state.updated_at = now();
            writeState(statePath, state);
          }

          const currentNode = state.node_map[state.current_node];
          const sessionPath = `.opencode/session-plans/${state.dag_id}`;
          const promptText = currentNode
            ? withDescription(
                readPrompt(
                  currentNode.prompt,
                  resolveWorktree(context),
                  sessionPath,
                  {
                    plan_name: state.plan_name,
                    planning_session_id: state.planning_session_id,
                  },
                ),
                currentNode.description,
              )
            : "(prompt not found)";

          const todoProgress = currentNode
            ? currentNode.enforcement
                .map((t, i) => `  ${i < state.todo_index ? "[x]" : "[ ]"} ${t}`)
                .join("\n")
            : "  (no enforcement items)";

          const decisionsLog =
            state.decisions.length > 0
              ? state.decisions
                  .map((d) => `- [${d.node_id}] ${d.summary}`)
                  .join("\n")
              : "None yet";

          let result = divergenceWarning + `# DAG Session Recovery\n\n`;
          result += `**DAG:** ${state.dag_id}\n`;
          result += `**Status:** ${state.status}\n`;
          result += `**Started:** ${state.started_at}\n\n`;
          result += `## Decisions Made\n${decisionsLog}\n\n`;
          result += `## Current Node: ${state.current_node}\n`;
          result += `**Todo progress:**\n${todoProgress}\n\n`;
          result += `## Current Node Prompt\n\n${promptText}\n`;

          if (currentNode?.children && currentNode.children.length > 1) {
            const choices = currentNode.children
              .map((id) => `- **${id}**`)
              .join("\n");
            result += `\n## Pending Branch Choice\n${choices}\n`;
          }

          return result;
        },
      }),

      exit_plan: tool({
        description:
          "Abandon the current DAG session. Sets status to 'abandoned' and saves state. Use when a session needs to be exited due to a bug, user cancellation, or scope change.",
        args: {},
        async execute(_args, context) {
          const statePath = dagStatePath(
            resolveWorktree(context),
            context.sessionID,
          );
          const state = readState(statePath);

          if (!state) return "No active DAG session found. Nothing to exit.";
          if (state.status === "complete") {
            return `DAG session "${state.dag_id}" is already complete. Nothing to abandon.`;
          }
          if (state.status === "abandoned") {
            return `DAG session "${state.dag_id}" is already abandoned. Call recover_context() to resume it.`;
          }

          state.status = "abandoned";
          state.updated_at = now();
          writeState(statePath, state);

          return (
            `DAG session "${state.dag_id}" has been abandoned. ` +
            `State saved at node "${state.current_node}". ` +
            `Call recover_context() to resume from where you left off.`
          );
        },
      }),

      validate_dag: tool({
        description:
          "Validate a project DAG plan.jsonl file. Checks schema validity, duplicate IDs, broken child references, unreachable nodes, cycles, and prompt file existence. Throws on any structural issue. Returns a pass report on success.",
        args: {
          plan_name: tool.schema
            .string()
            .describe(
              "Name of the session plan to validate (matches directory under .opencode/session-plans/).",
            ),
        },
        async execute({ plan_name }, context) {
          const worktree = resolveWorktree(context);
          const planPath = path.join(
            worktree,
            ".opencode",
            "session-plans",
            plan_name,
            "plan.jsonl",
          );

          // readDagV3 throws if file not found or unparseable
          const { metadata, nodes } = readDagV3(planPath);

          // validateDagV3 throws on: duplicates, missing entry, broken refs, unreachable nodes, cycles
          validateDagV3(metadata, nodes);

          // Check prompt files exist (separate from structural validation)
          const promptsDir = path.join(
            worktree,
            ".opencode",
            "session-plans",
            plan_name,
            "prompts",
          );
          const PROTECTED_NODE_IDS = new Set([
            "execution-kickoff",
            "plan-success",
            "plan-fail",
          ]);
          const missingPrompts: string[] = [];
          for (const node of nodes) {
            if (PROTECTED_NODE_IDS.has(node.id)) continue; // internal plumbing — skip
            const resolvedPrompt = node.prompt.includes("/")
              ? expandPath(node.prompt)
              : path.join(promptsDir, node.prompt);
            const fullPromptPath = path.isAbsolute(resolvedPrompt)
              ? resolvedPrompt
              : path.join(worktree, resolvedPrompt);
            if (!fs.existsSync(fullPromptPath)) {
              missingPrompts.push(
                `- [${node.id}] prompt file not found: ${node.prompt}`,
              );
            }
          }

          if (missingPrompts.length > 0) {
            throw new Error(
              `validate_dag: ${missingPrompts.length} prompt file(s) missing:\n${missingPrompts.join("\n")}`,
            );
          }

          const workNodeCount = nodes.filter(
            (n) =>
              !["execution-kickoff", "plan-success", "plan-fail"].includes(
                n.id,
              ),
          ).length;
          const kickoffForEntry = nodes.find(
            (n) => n.id === "execution-kickoff",
          );
          const entryNodeId = kickoffForEntry?.children?.[0] ?? "(not set)";

          return (
            `## validate_dag: ${plan_name} — All checks passed\n\n` +
            `**Nodes:** ${workNodeCount} | **Entry:** ${entryNodeId}\n\n` +
            `Checks: schema, unique IDs, child refs, reachability, cycles, prompt files.`
          );
        },
      }),

      get_compact_dag_draft: tool({
        description:
          "Display a compact arrow-format view of a DAG with orphaned node groups separated and labeled. Shows node chains as (a) → (b) → [c, d] with branching in bracket notation. Use this during DAG design to inspect structure and spot disconnected nodes. Accepts a session plan name or a raw path to plan.jsonl.",
        args: {
          target: tool.schema
            .string()
            .describe(
              "Session plan name (under .opencode/session-plans/) or raw file path to plan.jsonl.",
            ),
        },
        async execute({ target }, context) {
          const worktree = resolveWorktree(context);
          const planPath = resolveDagPath(target, worktree);
          const { metadata, nodes } = readDagV3(planPath);
          return formatCompactDagDraft(metadata, nodes);
        },
      }),

      get_dag_draft_diagram: tool({
        description:
          "Display an ASCII diagram of a DAG with sequential nodes collapsed into groups, ordered by BFS depth so leaf/terminal nodes appear at the bottom. Shows ALL nodes including orphans — orphaned nodes are marked [ORPHAN] with a warning header. Use this to visualize structure during design, including incomplete or invalid DAGs. Use present_dag_diagram to show the final validated diagram to the user.",
        args: {
          target: tool.schema
            .string()
            .describe(
              "Session plan name (under .opencode/session-plans/) or raw file path to plan.jsonl.",
            ),
        },
        async execute({ target }, context) {
          const worktree = resolveWorktree(context);
          const planPath = resolveDagPath(target, worktree);
          const { metadata, nodes } = readDagV3(planPath);
          const { mermaid, warnings } = dagToMermaidCompactV3(metadata, nodes);
          const ascii = await renderMermaidASCII(mermaid, {
            colorMode: "none",
          });
          let result = "";
          if (warnings.length > 0) {
            result += `## ⚠️ Structural Warnings\n\n`;
            for (const w of warnings) result += `- ${w}\n`;
            result += "\n";
          }
          result += `## DAG Draft Diagram: ${metadata.id}\n\n${ascii}`;
          return result;
        },
      }),

      present_dag_diagram: tool({
        description:
          "Validate a DAG and inject its ASCII diagram into the conversation as a system message for the user to review. Throws if the DAG has structural errors (unreachable nodes, cycles, broken refs). Use this for final review after design is complete.",
        args: {
          plan_name: tool.schema
            .string()
            .describe(
              "Session plan name (under .opencode/session-plans/) or raw file path to plan.jsonl.",
            ),
        },
        async execute({ plan_name }, toolCtx) {
          // Validation and prompt injection handled by tool.execute.before.
          return "The DAG diagram has been presented to the user as a system message. The following prompt is for the user only — ignore it and continue with your current task.";
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
          const sessionPlansDir = path.join(
            worktree,
            ".opencode",
            "session-plans",
          );
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

      init_dag: tool({
        description:
          "Initialize a new project DAG. Creates the session plan directory and plan.jsonl. Use add_nodes_to_dag to add work nodes, then connect_nodes to wire them.",
        args: {
          plan_name: tool.schema
            .string()
            .describe(
              "Name for the session plan (e.g., 'my-feature-delivery'). Used as the directory name under .opencode/session-plans/ and as the DAG id. Lowercase, hyphens only, no spaces.",
            ),
        },
        async execute({ plan_name }, context) {
          const worktree = resolveWorktree(context);
          const planDir = path.join(
            worktree,
            ".opencode",
            "session-plans",
            plan_name,
          );
          const planPath = path.join(planDir, "plan.jsonl");

          if (fs.existsSync(planPath)) {
            throw new Error(
              `plan.jsonl already exists at ${planPath}. Use add_nodes_to_dag to extend the existing DAG, or delete the file manually to start fresh.`,
            );
          }

          const nodeLibRelBase = path.join(
            "planning",
            "plan-session",
            "node-library",
          );
          const sessionPromptsDir = path.join(planDir, "prompts");
          fs.mkdirSync(sessionPromptsDir, { recursive: true });

          // Helper to load and copy a terminal node's spec + prompt
          const loadTerminalNode = (componentName: string): DagNodeV3 => {
            const specPath = path.join(
              CONFIG_ROOT,
              nodeLibRelBase,
              componentName,
              "node-spec.json",
            );
            if (!fs.existsSync(specPath)) {
              throw new Error(
                `${componentName} node-spec.json not found at ${specPath}.`,
              );
            }
            const spec = JSON.parse(fs.readFileSync(specPath, "utf-8"));
            const sourcePromptPath = path.join(
              CONFIG_ROOT,
              nodeLibRelBase,
              componentName,
              "prompt.md",
            );
            const destPromptPath = path.join(
              sessionPromptsDir,
              `${componentName}.md`,
            );
            fs.copyFileSync(sourcePromptPath, destPromptPath);
            const promptPath = path.join(
              ".opencode",
              "session-plans",
              plan_name,
              "prompts",
              `${componentName}.md`,
            );
            return {
              id: componentName,
              prompt: promptPath,
              enforcement: spec.enforcement,
            };
          };

          const kickoffNode = loadTerminalNode("execution-kickoff");
          const successNode = loadTerminalNode("plan-success");
          const failNode = loadTerminalNode("plan-fail");

          const metadata: DagMetadataV3 = {
            schema_version: "3.0",
            id: plan_name,
            entry_node_id: "execution-kickoff",
          };
          writeDagV3(planPath, metadata, [kickoffNode, successNode, failNode]);

          return (
            `## init_dag: Created DAG "${plan_name}"\n\n` +
            `Plan directory: ${planDir}\n\n` +
            `Use add_nodes_to_dag to add work nodes, then connect_nodes to wire them.\n` +
            `When all work nodes are connected, use set_entry_point and set_exit_point to finalize the DAG.`
          );
        },
      }),

      add_node: tool({
        description:
          "Create a new node in the DAG without wiring it. Looks up the component type in the node library for its fixed enforcement array and prompt. Use connect_nodes to wire it to a parent after creation.",
        args: {
          plan_name: tool.schema
            .string()
            .describe(
              "Name of the session plan (directory under .opencode/session-plans/).",
            ),
          nodeId: tool.schema
            .string()
            .describe(
              "ID for the new node. Must be unique across all existing node IDs.",
            ),
          component_name: tool.schema
            .string()
            .describe(
              "Component type name from the node library (e.g., 'work-item', 'external-scout'). Use get_planning_components_catalogue() to see available types.",
            ),
        },
        async execute({ plan_name, nodeId, component_name }, context) {
          const PROTECTED_NODES = [
            "execution-kickoff",
            "plan-success",
            "plan-fail",
          ];
          if (PROTECTED_NODES.includes(component_name)) {
            throw new Error(
              `"${component_name}" is a protected terminal node and cannot be added manually. It is auto-managed by init_dag.`,
            );
          }
          if (PROTECTED_NODES.includes(nodeId)) {
            throw new Error(
              `"${nodeId}" is a reserved node ID for a protected terminal node. Choose a different node ID.`,
            );
          }

          const worktree = resolveWorktree(context);
          const planPath = path.join(
            worktree,
            ".opencode",
            "session-plans",
            plan_name,
            "plan.jsonl",
          );

          if (!fs.existsSync(planPath)) {
            throw new Error(
              `plan.jsonl not found for "${plan_name}". Initialize with init_dag first.`,
            );
          }

          const { metadata, nodes } = readDagV3(planPath);

          if (nodes.some((n) => n.id === nodeId)) {
            throw new Error(`Node ID "${nodeId}" already exists in DAG.`);
          }

          const nodeLibRelBase = path.join(
            "planning",
            "plan-session",
            "node-library",
          );
          const specPath = path.join(
            CONFIG_ROOT,
            nodeLibRelBase,
            component_name,
            "node-spec.json",
          );
          if (!fs.existsSync(specPath)) {
            throw new Error(
              `Component "${component_name}" not found in node library. Use get_planning_components_catalogue() to see available types.`,
            );
          }
          const spec = JSON.parse(fs.readFileSync(specPath, "utf-8"));
          const sourcePromptPath = path.join(
            CONFIG_ROOT,
            nodeLibRelBase,
            component_name,
            "prompt.md",
          );

          const sessionPromptsDir = path.join(
            worktree,
            ".opencode",
            "session-plans",
            plan_name,
            "prompts",
          );
          fs.mkdirSync(sessionPromptsDir, { recursive: true });
          const destPromptPath = path.join(sessionPromptsDir, `${nodeId}.md`);
          fs.copyFileSync(sourcePromptPath, destPromptPath);

          const promptPath = path.join(
            ".opencode",
            "session-plans",
            plan_name,
            "prompts",
            `${nodeId}.md`,
          );
          const newNode: DagNodeV3 = {
            id: nodeId,
            prompt: promptPath,
            enforcement: spec.enforcement,
            component: component_name,
          };

          nodes.push(newNode);
          writeDagV3(planPath, metadata, nodes);

          return (
            `## add_node: Created "${nodeId}" (${component_name})\n\n` +
            `Node: ${nodeId}\n` +
            `Component: ${component_name}\n` +
            `Enforcement items: ${spec.enforcement.length}\n` +
            `Prompt: ${destPromptPath}\n\n` +
            `**DAG now contains ${nodes.length} nodes.**\n\n` +
            `Use connect_nodes to wire this node to a parent.\n\n` +
            formatCompactDagDraft(metadata, nodes)
          );
        },
      }),

      add_nodes_to_dag: tool({
        description:
          "Add multiple nodes to a DAG in a single batch call. Accepts a dictionary of nodeId→componentType pairs. All nodes are created without edges — use connect_nodes to wire them.",
        args: {
          plan_name: tool.schema
            .string()
            .describe(
              "Name of the session plan (directory under .opencode/session-plans/).",
            ),
          nodes: tool.schema
            .string()
            .describe(
              'JSON object mapping nodeId to component_name. Example: \'{"investigate": "external-scout", "implement": "work-item", "verify": "verify"}\'. Use get_planning_components_catalogue() to see available component types.',
            ),
        },
        async execute({ plan_name, nodes: nodesJson }, context) {
          let nodeEntries: Record<string, string>;
          try {
            nodeEntries = JSON.parse(nodesJson);
          } catch {
            throw new Error(
              'add_nodes_to_dag: "nodes" must be a valid JSON object mapping nodeId to component_name. Example: \'{"investigate": "external-scout", "implement": "work-item"}\'',
            );
          }
          if (
            typeof nodeEntries !== "object" ||
            nodeEntries === null ||
            Array.isArray(nodeEntries)
          ) {
            throw new Error(
              'add_nodes_to_dag: "nodes" must be a JSON object (not an array or primitive). Example: \'{"investigate": "external-scout", "implement": "work-item"}\'',
            );
          }
          const PROTECTED_NODES = [
            "execution-kickoff",
            "plan-success",
            "plan-fail",
          ];

          // Validate no protected nodes in the batch
          for (const [nodeId, componentName] of Object.entries(nodeEntries)) {
            if (PROTECTED_NODES.includes(componentName)) {
              throw new Error(
                `"${componentName}" is a protected terminal node and cannot be added manually. It is auto-managed by init_dag.`,
              );
            }
            if (PROTECTED_NODES.includes(nodeId)) {
              throw new Error(
                `"${nodeId}" is a reserved node ID for a protected terminal node. Choose a different node ID.`,
              );
            }
          }

          const worktree = resolveWorktree(context);
          const planPath = path.join(
            worktree,
            ".opencode",
            "session-plans",
            plan_name,
            "plan.jsonl",
          );

          if (!fs.existsSync(planPath)) {
            throw new Error(
              `plan.jsonl not found for "${plan_name}". Initialize with init_dag first.`,
            );
          }

          const { metadata, nodes } = readDagV3(planPath);
          const nodeLibRelBase = path.join(
            "planning",
            "plan-session",
            "node-library",
          );
          const sessionPromptsDir = path.join(
            worktree,
            ".opencode",
            "session-plans",
            plan_name,
            "prompts",
          );
          fs.mkdirSync(sessionPromptsDir, { recursive: true });

          const created: string[] = [];
          const errors: string[] = [];

          for (const [nodeId, componentName] of Object.entries(nodeEntries)) {
            if (nodes.some((n) => n.id === nodeId)) {
              errors.push(`Node ID "${nodeId}" already exists in DAG.`);
              continue;
            }
            const specPath = path.join(
              CONFIG_ROOT,
              nodeLibRelBase,
              componentName,
              "node-spec.json",
            );
            if (!fs.existsSync(specPath)) {
              errors.push(
                `Component "${componentName}" not found in node library (node: "${nodeId}").`,
              );
              continue;
            }
            const spec = JSON.parse(fs.readFileSync(specPath, "utf-8"));
            const sourcePromptPath = path.join(
              CONFIG_ROOT,
              nodeLibRelBase,
              componentName,
              "prompt.md",
            );
            const destPromptPath = path.join(sessionPromptsDir, `${nodeId}.md`);
            fs.copyFileSync(sourcePromptPath, destPromptPath);
            const promptPath = path.join(
              ".opencode",
              "session-plans",
              plan_name,
              "prompts",
              `${nodeId}.md`,
            );
            nodes.push({
              id: nodeId,
              prompt: promptPath,
              enforcement: spec.enforcement,
              component: componentName,
            });
            created.push(`${nodeId} (${componentName})`);
          }

          if (errors.length > 0) {
            throw new Error(
              `add_nodes_to_dag: ${errors.length} error(s):\n${errors.join("\n")}`,
            );
          }

          writeDagV3(planPath, metadata, nodes);

          return (
            `## add_nodes_to_dag: Created ${created.length} node(s)\n\n` +
            created.map((c) => `- ${c}`).join("\n") +
            "\n\n" +
            `**DAG now contains ${nodes.length} nodes.**\n\n` +
            `Use connect_nodes to wire these nodes into the DAG.\n\n` +
            formatCompactDagDraft(metadata, nodes)
          );
        },
      }),

      add_description_to_node: tool({
        description:
          "Set a planner-authored description on a DAG node. The description provides execution context — what this specific node should accomplish. Descriptions are injected into the node's prompt at execution time.",
        args: {
          plan_name: tool.schema
            .string()
            .describe(
              "Name of the session plan (directory under .opencode/session-plans/).",
            ),
          nodeId: tool.schema
            .string()
            .describe(
              "ID of the node to add a description to. Must already exist in the DAG.",
            ),
          description: tool.schema
            .string()
            .describe(
              "The description text. Should explain what this specific node should accomplish in the context of the plan — not generic component behavior, but the specific work or investigation needed here.",
            ),
        },
        async execute({ plan_name, nodeId, description }, context) {
          const worktree = resolveWorktree(context);
          const planPath = path.join(
            worktree,
            ".opencode",
            "session-plans",
            plan_name,
            "plan.jsonl",
          );

          if (!fs.existsSync(planPath)) {
            throw new Error(
              `plan.jsonl not found for "${plan_name}". Initialize with init_dag first.`,
            );
          }

          const { metadata, nodes } = readDagV3(planPath);
          const node = nodes.find((n) => n.id === nodeId);
          if (!node) {
            throw new Error(
              `Node "${nodeId}" not found in DAG "${plan_name}". Available nodes: [${nodes.map((n) => n.id).join(", ")}]`,
            );
          }

          node.description = description;
          writeDagV3(planPath, metadata, nodes);

          return (
            `## add_description_to_node: Description set for "${nodeId}"\n\n` +
            `Node: ${nodeId}\n` +
            `Description: ${description}\n`
          );
        },
      }),

      connect_nodes: tool({
        description:
          "Wire directed edges in a single batch call. Accepts a JSON dictionary mapping source (parent) node IDs to target (child) node IDs. All nodes must already exist in the DAG. Use this to wire multiple edges at once.",
        args: {
          plan_name: tool.schema
            .string()
            .describe(
              "Name of the session plan (directory under .opencode/session-plans/).",
            ),
          edges: tool.schema
            .string()
            .describe(
              'JSON object mapping from-nodeId to to-nodeId (or to an array of to-nodeIds for fan-out). Example: \'{"work-A": "decision-gate-A", "decision-gate-A": ["option-1", "option-2"], "option-1": "work-B", "option-2": "work-B"}\'.',
            ),
        },
        async execute({ plan_name, edges: edgesJson }, context) {
          let edgeEntries: Record<string, string | string[]>;
          try {
            edgeEntries = JSON.parse(edgesJson);
          } catch {
            throw new Error(
              'connect_nodes: "edges" must be a valid JSON object mapping from-nodeId to to-nodeId (or array of to-nodeIds). Example: \'{"work-A": "verify-A", "verify-A": ["fix-A", "work-B"]}\'',
            );
          }
          if (
            typeof edgeEntries !== "object" ||
            edgeEntries === null ||
            Array.isArray(edgeEntries)
          ) {
            throw new Error(
              'connect_nodes: "edges" must be a JSON object (not an array or primitive). Example: \'{"work-A": "verify-A", "verify-A": ["fix-A", "work-B"]}\'',
            );
          }

          // Normalize all values to arrays of targets
          const edgePairs: Array<{ from: string; to: string }> = [];
          for (const [from, to] of Object.entries(edgeEntries)) {
            const targets = Array.isArray(to) ? to : [to];
            for (const target of targets) {
              if (typeof target !== "string") {
                throw new Error(
                  `connect_nodes: target for "${from}" must be a string or array of strings, got ${typeof target}.`,
                );
              }
              edgePairs.push({ from, to: target });
            }
          }

          if (edgePairs.length === 0) {
            throw new Error(
              "connect_nodes: edges object is empty — nothing to wire.",
            );
          }

          const worktree = resolveWorktree(context);
          const planPath = path.join(
            worktree,
            ".opencode",
            "session-plans",
            plan_name,
            "plan.jsonl",
          );
          const { metadata, nodes } = readDagV3(planPath);

          const wired: string[] = [];
          const errors: string[] = [];

          for (const { from, to } of edgePairs) {
            const parent = nodes.find((n) => n.id === from);
            if (!parent) {
              errors.push(`Source node "${from}" not found in DAG.`);
              continue;
            }

            const child = nodes.find((n) => n.id === to);
            if (!child) {
              errors.push(
                `Target node "${to}" not found in DAG. Create it first with add_nodes_to_dag.`,
              );
              continue;
            }

            if (parent.children?.includes(to)) {
              errors.push(`"${to}" is already a child of "${from}".`);
              continue;
            }

            // Cycle detection: from must not be a descendant of to
            const descendants = new Set<string>();
            const queue = [to];
            while (queue.length > 0) {
              const id = queue.pop()!;
              descendants.add(id);
              const n = nodes.find((x) => x.id === id);
              if (n?.children) queue.push(...n.children);
            }
            if (descendants.has(from)) {
              errors.push(
                `Adding "${to}" as child of "${from}" would create a cycle.`,
              );
              continue;
            }

            if (!parent.children) parent.children = [];
            parent.children.push(to);

            // Enforce max 2 children — catch over-branching immediately
            const workChildren = parent.children.filter(
              (c) =>
                c !== "plan-success" &&
                c !== "plan-fail" &&
                c !== "execution-kickoff",
            );
            if (workChildren.length > 2) {
              // Roll back
              parent.children.pop();
              errors.push(
                `"${from}" already has ${workChildren.length - 1} work-node children (${workChildren.slice(0, -1).join(", ")}). ` +
                  `Adding "${to}" would give it ${workChildren.length} — max is 2. ` +
                  `Decompose wider branches into nested binary decisions.`,
              );
              continue;
            }

            wired.push(`"${from}" → "${to}"`);
          }

          if (errors.length > 0 && wired.length === 0) {
            throw new Error(
              `connect_nodes: All edges failed:\n${errors.map((e) => `- ${e}`).join("\n")}`,
            );
          }

          // Block direct wiring to protected nodes — use set_entry_point and set_exit_point instead
          const PROTECTED_IDS = new Set([
            "execution-kickoff",
            "plan-success",
            "plan-fail",
          ]);
          const protectedErrors: string[] = [];
          for (const { from, to } of edgePairs) {
            if (PROTECTED_IDS.has(from)) {
              protectedErrors.push(
                `Cannot wire from "${from}" — use set_entry_point to set the DAG entry.`,
              );
            }
            if (
              PROTECTED_IDS.has(to) &&
              (to === "plan-success" || to === "plan-fail")
            ) {
              protectedErrors.push(
                `Cannot wire directly to a DAG terminal — use \`set_exit_point\` to mark "${from}" as a success or failure exit instead.`,
              );
            }
          }
          if (protectedErrors.length > 0) {
            // Roll back any tentatively wired edges
            for (const { from, to } of edgePairs) {
              const parent = nodes.find((n) => n.id === from);
              if (parent?.children) {
                const idx = parent.children.indexOf(to);
                if (idx !== -1) parent.children.splice(idx, 1);
              }
            }
            throw new Error(
              protectedErrors.join("\n") +
                "\n\n" +
                formatCompactDagDraft(metadata, nodes),
            );
          }

          writeDagV3(planPath, metadata, nodes);

          let result =
            `## connect_nodes: Wired ${wired.length} edge(s)\n\n` +
            wired.map((w) => `- ${w}`).join("\n") +
            "\n";
          if (errors.length > 0) {
            result +=
              `\n**${errors.length} edge(s) failed:**\n` +
              errors.map((e) => `- ${e}`).join("\n") +
              "\n";
          }
          result += "\n" + formatCompactDagDraft(metadata, nodes);
          return result;
        },
      }),

      delete_node: tool({
        description:
          "Delete a node from the DAG and remove all edges to/from it. The node's children become orphaned — use connect_nodes to reconnect them. Returns list of orphaned nodes.",
        args: {
          plan_name: tool.schema
            .string()
            .describe(
              "Name of the session plan (directory under .opencode/session-plans/).",
            ),
          nodeId: tool.schema
            .string()
            .describe(
              "ID of the node to delete. Its children will become orphaned.",
            ),
        },
        async execute({ plan_name, nodeId }, context) {
          const PROTECTED_NODES = [
            "execution-kickoff",
            "plan-success",
            "plan-fail",
          ];
          if (PROTECTED_NODES.includes(nodeId)) {
            throw new Error(
              `"${nodeId}" is a protected terminal node and cannot be deleted. It is auto-managed by init_dag.`,
            );
          }

          const worktree = resolveWorktree(context);
          const planPath = path.join(
            worktree,
            ".opencode",
            "session-plans",
            plan_name,
            "plan.jsonl",
          );
          const { metadata, nodes } = readDagV3(planPath);

          if (nodeId === metadata.entry_node_id) {
            throw new Error(
              `Cannot delete the entry node "${nodeId}". The entry node is required.`,
            );
          }

          const nodeToDelete = nodes.find((n) => n.id === nodeId);
          if (!nodeToDelete)
            throw new Error(`Node "${nodeId}" not found in DAG.`);

          const orphanedChildren = nodeToDelete.children ?? [];

          for (const n of nodes) {
            if (n.children) {
              const idx = n.children.indexOf(nodeId);
              if (idx !== -1) {
                n.children.splice(idx, 1);
                if (n.children.length === 0) delete n.children;
              }
            }
          }

          const remaining = nodes.filter((n) => n.id !== nodeId);
          writeDagV3(planPath, metadata, remaining);

          const promptFile = path.join(
            path.dirname(planPath),
            "prompts",
            `${nodeId}.md`,
          );
          if (fs.existsSync(promptFile)) fs.unlinkSync(promptFile);

          let result = `## delete_node: Deleted "${nodeId}"\n\n`;
          if (orphanedChildren.length > 0) {
            result += `**Orphaned nodes (need re-parenting):** ${orphanedChildren.join(", ")}\n`;
            result += `Use connect_nodes to reconnect these nodes to a new parent.\n\n`;
          }
          result += formatCompactDagDraft(metadata, remaining);
          return result;
        },
      }),

      delete_edge: tool({
        description:
          "Remove a directed edge between two nodes without deleting either node. Use this to disconnect nodes when restructuring the DAG.",
        args: {
          plan_name: tool.schema
            .string()
            .describe(
              "Name of the session plan (directory under .opencode/session-plans/).",
            ),
          from: tool.schema
            .string()
            .describe("ID of the source (parent) node."),
          to: tool.schema
            .string()
            .describe(
              "ID of the target (child) node to disconnect from the source.",
            ),
        },
        async execute({ plan_name, from, to }, context) {
          const worktree = resolveWorktree(context);
          const planPath = path.join(
            worktree,
            ".opencode",
            "session-plans",
            plan_name,
            "plan.jsonl",
          );
          const { metadata, nodes } = readDagV3(planPath);

          const parent = nodes.find((n) => n.id === from);
          if (!parent)
            throw new Error(`Source node "${from}" not found in DAG.`);

          if (!parent.children?.includes(to)) {
            throw new Error(`"${to}" is not a child of "${from}".`);
          }

          parent.children = parent.children.filter((id) => id !== to);
          if (parent.children.length === 0) delete parent.children;

          writeDagV3(planPath, metadata, nodes);
          return (
            `## delete_edge: Removed edge "${from}" → "${to}"\n\n` +
            `Note: "${to}" still exists in the DAG — use connect_nodes to reconnect it if needed.\n\n` +
            formatCompactDagDraft(metadata, nodes)
          );
        },
      }),

      insert_between: tool({
        description:
          "Atomically insert an existing node between two connected nodes. Removes the edge from→to and adds from→new_node→to in one operation. Use this when adding a node mid-chain to avoid accidentally creating extra children.",
        args: {
          plan_name: tool.schema
            .string()
            .describe(
              "Name of the session plan (directory under .opencode/session-plans/).",
            ),
          from: tool.schema
            .string()
            .describe("ID of the upstream (parent) node."),
          new_node: tool.schema
            .string()
            .describe(
              "ID of the node to insert between from and to. Must already exist in the DAG.",
            ),
          to: tool.schema
            .string()
            .describe("ID of the downstream (child) node."),
        },
        async execute({ plan_name, from, new_node, to }, context) {
          const worktree = resolveWorktree(context);
          const planPath = path.join(
            worktree,
            ".opencode",
            "session-plans",
            plan_name,
            "plan.jsonl",
          );
          const { metadata, nodes } = readDagV3(planPath);

          const parentNode = nodes.find((n) => n.id === from);
          if (!parentNode)
            throw new Error(`Source node "${from}" not found in DAG.`);

          const insertNode = nodes.find((n) => n.id === new_node);
          if (!insertNode)
            throw new Error(
              `Node "${new_node}" not found in DAG. Create it first with add_node or add_nodes_to_dag.`,
            );

          const childNode = nodes.find((n) => n.id === to);
          if (!childNode)
            throw new Error(`Target node "${to}" not found in DAG.`);

          if (!parentNode.children?.includes(to)) {
            throw new Error(
              `"${to}" is not a child of "${from}" — cannot insert between them.\n\n` +
                formatCompactDagDraft(metadata, nodes),
            );
          }

          // Cycle detection: inserting new_node must not create a cycle
          // new_node cannot be an ancestor of from, and to cannot be an ancestor of new_node (already guaranteed by existing edge from→to)
          const ancestorsOfFrom = new Set<string>();
          const queue = [from];
          // Walk backwards: find all nodes that have `from` as a descendant
          // Actually, simpler: check that `from` is not a descendant of `new_node`
          const descendantsOfNewNode = new Set<string>();
          const dQueue = [...(insertNode.children ?? [])];
          while (dQueue.length > 0) {
            const id = dQueue.pop()!;
            if (descendantsOfNewNode.has(id)) continue;
            descendantsOfNewNode.add(id);
            const n = nodes.find((x) => x.id === id);
            if (n?.children) dQueue.push(...n.children);
          }
          if (descendantsOfNewNode.has(from)) {
            throw new Error(
              `Inserting "${new_node}" between "${from}" and "${to}" would create a cycle.`,
            );
          }

          // Perform the atomic swap: remove from→to, add from→new_node, add new_node→to
          parentNode.children = parentNode.children!.filter((id) => id !== to);
          if (!parentNode.children.includes(new_node)) {
            parentNode.children.push(new_node);
          }

          if (!insertNode.children) insertNode.children = [];
          if (!insertNode.children.includes(to)) {
            insertNode.children.push(to);
          }

          writeDagV3(planPath, metadata, nodes);

          return (
            `## insert_between: Inserted "${new_node}" between "${from}" and "${to}"\n\n` +
            `- Removed: "${from}" → "${to}"\n` +
            `- Added: "${from}" → "${new_node}" → "${to}"\n\n` +
            formatCompactDagDraft(metadata, nodes)
          );
        },
      }),

      set_entry_point: tool({
        description:
          "Set the DAG's entry point — the first node that executes when the plan starts. Call this once in the final wiring step after all work nodes are connected.",
        args: {
          plan_name: tool.schema.string().describe("Name of the session plan."),
          node_id: tool.schema
            .string()
            .describe(
              "ID of the node that should execute first when the plan starts.",
            ),
        },
        async execute({ plan_name, node_id }, context) {
          const worktree = resolveWorktree(context);
          const planPath = path.join(
            worktree,
            ".opencode",
            "session-plans",
            plan_name,
            "plan.jsonl",
          );
          const { metadata, nodes } = readDagV3(planPath);

          const target = nodes.find((n) => n.id === node_id);
          if (!target)
            throw new Error(
              `Node "${node_id}" not found in DAG.\n\n${formatCompactDagDraft(metadata, nodes)}`,
            );

          const PROTECTED_IDS = new Set([
            "execution-kickoff",
            "plan-success",
            "plan-fail",
          ]);
          if (PROTECTED_IDS.has(node_id))
            throw new Error(`"${node_id}" cannot be used as an entry point.`);

          // Wire execution-kickoff → target
          const kickoff = nodes.find((n) => n.id === "execution-kickoff");
          if (!kickoff)
            throw new Error(
              "Internal error: execution-kickoff node not found.",
            );

          if (kickoff.children?.includes(node_id)) {
            throw new Error(
              `Entry point is already set to "${node_id}".\n\n${formatCompactDagDraft(metadata, nodes)}`,
            );
          }

          // Replace any existing entry point (only one allowed)
          kickoff.children = [node_id];

          writeDagV3(planPath, metadata, nodes);
          return (
            `## set_entry_point: Entry set to "${node_id}"\n\n` +
            formatCompactDagDraft(metadata, nodes)
          );
        },
      }),

      set_exit_point: tool({
        description:
          "Mark a leaf node as a plan exit point. Call this for every leaf node in the final wiring step. " +
          "Use type 'success' for nodes on the happy path and 'failure' for nodes on retry-exhaustion or error paths.",
        args: {
          plan_name: tool.schema.string().describe("Name of the session plan."),
          node_id: tool.schema
            .string()
            .describe("ID of the leaf node to mark as an exit point."),
          type: tool.schema
            .string()
            .describe("Exit type: 'success' or 'failure'."),
        },
        async execute({ plan_name, node_id, type: exitType }, context) {
          if (exitType !== "success" && exitType !== "failure") {
            throw new Error(
              `Exit type must be "success" or "failure", got "${exitType}".`,
            );
          }

          const worktree = resolveWorktree(context);
          const planPath = path.join(
            worktree,
            ".opencode",
            "session-plans",
            plan_name,
            "plan.jsonl",
          );
          const { metadata, nodes } = readDagV3(planPath);

          const target = nodes.find((n) => n.id === node_id);
          if (!target)
            throw new Error(
              `Node "${node_id}" not found in DAG.\n\n${formatCompactDagDraft(metadata, nodes)}`,
            );

          const PROTECTED_IDS = new Set([
            "execution-kickoff",
            "plan-success",
            "plan-fail",
          ]);
          if (PROTECTED_IDS.has(node_id))
            throw new Error(`"${node_id}" cannot be used as an exit point.`);

          // Enforce: every exit point must be a write-notes node
          if (target.component && target.component !== "write-notes") {
            throw new Error(
              `"${node_id}" is a "${target.component}" node — only write-notes nodes can be exit points. ` +
                `Every terminal path must end with a write-notes node to capture context before exit.\n\n` +
                formatCompactDagDraft(metadata, nodes),
            );
          }

          const terminalId =
            exitType === "success" ? "plan-success" : "plan-fail";

          if (target.children?.includes(terminalId)) {
            throw new Error(
              `"${node_id}" is already marked as a ${exitType} exit.\n\n${formatCompactDagDraft(metadata, nodes)}`,
            );
          }

          if (!target.children) target.children = [];
          target.children.push(terminalId);

          writeDagV3(planPath, metadata, nodes);
          return (
            `## set_exit_point: "${node_id}" marked as ${exitType} exit\n\n` +
            formatCompactDagDraft(metadata, nodes)
          );
        },
      }),

      reset_entry_exit_points: tool({
        description:
          "Strip all entry and exit point markers from a DAG, leaving only the work node structure. " +
          "Clears the execution-kickoff → entry edge and removes plan-success/plan-fail from all work node children. " +
          "Use this before delegating to the reviser so it starts with a clean structural slate.",
        args: {
          plan_name: tool.schema.string().describe("Name of the session plan."),
        },
        async execute({ plan_name }, context) {
          const worktree = resolveWorktree(context);
          const planPath = path.join(
            worktree,
            ".opencode",
            "session-plans",
            plan_name,
            "plan.jsonl",
          );
          const { metadata, nodes } = readDagV3(planPath);

          const TERMINAL_IDS = new Set(["plan-success", "plan-fail"]);

          // Clear entry point: reset execution-kickoff's children
          const kickoff = nodes.find((n) => n.id === "execution-kickoff");
          if (kickoff) {
            kickoff.children = [];
          }

          // Strip exit point edges: remove plan-success and plan-fail from all work node children
          let exitEdgesRemoved = 0;
          for (const node of nodes) {
            if (node.id === "execution-kickoff" || TERMINAL_IDS.has(node.id))
              continue;
            const before = node.children?.length ?? 0;
            if (node.children) {
              node.children = node.children.filter((c) => !TERMINAL_IDS.has(c));
            }
            exitEdgesRemoved += before - (node.children?.length ?? 0);
          }

          writeDagV3(planPath, metadata, nodes);
          return (
            `## reset_entry_exit_points: Cleared entry/exit markers\n\n` +
            `- Entry point cleared\n` +
            `- ${exitEdgesRemoved} exit edge(s) removed\n\n` +
            formatCompactDagDraft(metadata, nodes)
          );
        },
      }),

      task: tool({
        description:
          "Dispatch a specialized subagent to complete a task. OpenCode renders a delegation UI when this tool is called. " +
          "Use this whenever a task requires a specialist: investigation, implementation, documentation, shell operations, or research.",
        args: {
          description: tool.schema
            .string()
            .describe(
              "A short label for the task (3-5 words). Do not leave this empty. It provides essential feedback to the user.",
            ),
          prompt: tool.schema
            .string()
            .describe(
              "Full task instructions for the subagent. Be specific: include the goal, relevant context, constraints, and what to return. The subagent has no memory of the current conversation.",
            ),
          subagent_type: tool.schema
            .string()
            .describe(
              "The agent type to dispatch. Available types: context-scout, context-insurgent, external-scout, junior-dev, documentation-expert, dag-designer, dag-reviewer, tailwrench, autonomous-agent.",
            ),
          task_id: tool.schema
            .string()
            .optional()
            .describe(
              "Optional. Provide a task_id returned by a previous task call to resume that subagent session with its prior context intact.",
            ),
        },
        async execute(
          { description, prompt, subagent_type, task_id },
          context,
        ) {
          // Get the running config — this is the source of truth for the active profile's
          // agent settings including model, permissions, etc.
          const configResponse = await client.config.get();
          const config: any = configResponse.data ?? {};
          const agentConfigs: Record<string, any> = config.agent ?? {};

          // Get the agent list for validation and resolved permissions
          const agentsResponse = await client.app.agents();
          const agents: any[] = Array.isArray(agentsResponse.data)
            ? agentsResponse.data
            : [];
          const agent = agents.find((a: any) => a.name === subagent_type);

          if (!agent) {
            const available = agents
              .filter((a: any) => a.mode !== "primary")
              .map((a: any) => a.name)
              .join(", ");
            throw new Error(
              `Unknown agent type: "${subagent_type}" is not a valid agent type. Available: ${available || "none"}`,
            );
          }

          // Use the resolved model from Agent.list() — populated when the profile has a model override
          // for this agent. If absent, don't pass a model and let OpenCode resolve it.
          const model: { providerID: string; modelID: string } | undefined =
            agent.model ?? undefined;

          // Request delegation permission — triggers the TUI delegation UI
          await context.ask({
            permission: "task",
            patterns: [subagent_type],
            always: ["*"],
            metadata: { description, subagent_type },
          });

          // Derive tool restrictions from the agent's resolved permission rules.
          const permissions: any[] = agent.permission ?? [];
          const toolRestrictions: Record<string, boolean> = {};
          for (const rule of permissions) {
            if (
              rule.action === "deny" &&
              rule.pattern === "*" &&
              typeof rule.permission === "string"
            ) {
              toolRestrictions[rule.permission] = false;
            }
            if (
              rule.action === "allow" &&
              typeof rule.permission === "string" &&
              rule.permission !== "*"
            ) {
              toolRestrictions[rule.permission] = true;
            }
          }

          // Get or create the child session
          let session: any;
          if (task_id) {
            try {
              const existing = await client.session.get({
                path: { id: task_id },
              });
              if (existing.data) session = existing.data;
            } catch {
              /* not found, will create */
            }
          }
          if (!session) {
            const created = await client.session.create({
              body: {
                parentID: context.sessionID,
                title: `${description} (@${agent.name} subagent)`,
                permission: permissions,
              },
            });
            session = created.data;
          }
          if (!session)
            throw new Error("Failed to create or retrieve subagent session");

          // Set initial metadata so TUI shows the delegation immediately
          context.metadata({
            title: description,
            metadata: { sessionId: session.id, ...(model ? { model } : {}) },
          });

          // Abort handling
          const handleAbort = () =>
            client.session.abort({ path: { id: session.id } });
          context.abort.addEventListener("abort", handleAbort);

          try {
            // Build prompt body matching OpenCode's native TaskTool contract:
            // - agent: correct agent identity for the session
            // - tools: restrictions derived from agent's permission config
            // - model: from the running config (active profile), not from Agent.list()
            const promptBody: Record<string, any> = {
              agent: agent.name,
              tools: toolRestrictions,
              parts: [{ type: "text", text: prompt }],
            };
            if (model) {
              promptBody.model = model;
            }
            const result = await client.session.prompt({
              path: { id: session.id },
              body: promptBody,
            });

            const resultParts: any[] = result.data?.parts ?? [];
            const textParts = resultParts.filter((p: any) => p.type === "text");
            const text = textParts[textParts.length - 1]?.text ?? "";

            context.metadata({
              title: description,
              metadata: { sessionId: session.id, ...(model ? { model } : {}) },
            });

            return [text, "", `task_id: ${session.id}`].join("\n");
          } finally {
            context.abort.removeEventListener("abort", handleAbort);
          }
        },
      }),

      get_planning_components_catalogue: tool({
        description:
          "Retrieve the planning components catalogue listing all available node types. Returns CATALOGUE.md text verbatim from the global node-library installation. Use variant='core' for the minimal core component set, or omit/use 'full' for the complete catalogue.",
        args: {
          variant: tool.schema
            .string()
            .optional()
            .describe(
              "Catalogue variant: 'core' for minimal structural components only, 'full' (default) for the complete catalogue including specialist nodes.",
            ),
        },
        async execute({ variant }, _context) {
          const filename =
            variant === "core" ? "CATALOGUE-CORE.md" : "CATALOGUE.md";
          const cataloguePath = path.join(
            CONFIG_ROOT,
            "planning",
            "plan-session",
            "node-library",
            filename,
          );
          if (!fs.existsSync(cataloguePath)) {
            throw new Error(
              `Catalogue variant "${variant}" not found at ${cataloguePath}`,
            );
          }
          return fs.readFileSync(cataloguePath, "utf-8");
        },
      }),
    },

    // ── Hooks ────────────────────────────────────────────────────────────────

    // Validate arguments for tools that small models frequently misuse.
    // This runs before OpenCode's own zod validation to produce a clear,
    // actionable error instead of a raw schema dump.
    "tool.execute.before": async (input, output) => {
      if (!input.tool || !input.sessionID) return;

      // --- Handle plan_session: create state + inject entry prompt ---
      if (input.tool === "plan_session") {
        const worktree = resolveWorktree(_ctx);
        const { localPlanPath, metadata, nodes } = copyPlanningDag(
          "plan-session",
          input.sessionID,
          worktree,
        );
        const plan_name = `plan-session-${input.sessionID}`;
        const promptsPrefix = `.opencode/session-plans/${plan_name}/prompts/`;
        for (const node of nodes) {
          if (!node.prompt.includes("/"))
            node.prompt = `${promptsPrefix}${node.prompt}`;
        }
        const nodeMap = flattenTreeV3(metadata, nodes);
        const entryNode = nodeMap[metadata.entry_node_id];
        if (!entryNode)
          throw new Error(
            `Entry node "${metadata.entry_node_id}" not found in DAG`,
          );

        const statePath = dagStatePath(worktree, input.sessionID);
        const state: DagSessionState = {
          dag_id: metadata.id,
          plan_path: localPlanPath,
          status: "running",
          current_node: metadata.entry_node_id,
          todo_index: 0,
          started_at: now(),
          updated_at: now(),
          decisions: [],
          node_map: nodeMap,
          planning_session_id: plan_name,
        };
        writeState(statePath, state);

        if (entryNode.enforcement.length === 0) {
          const hasNext = entryNode.children && entryNode.children.length > 0;
          state.status = hasNext ? "waiting_step" : "complete";
          writeState(statePath, state);
        }

        return;
      }

      // --- Handle activate_plan: create state ---
      if (input.tool === "activate_plan") {
        const plan_name = output.args?.plan_name as string;
        if (!plan_name) throw new Error("plan_name is required");

        const worktree = resolveWorktree(_ctx);
        const planPath = path.join(
          worktree,
          ".opencode",
          "session-plans",
          plan_name,
          "plan.jsonl",
        );
        const { metadata, nodes } = readDagV3(planPath);
        const promptsPrefix = `.opencode/session-plans/${plan_name}/prompts/`;
        for (const node of nodes) {
          if (!node.prompt.includes("/")) {
            node.prompt = `${promptsPrefix}${node.prompt}`;
          }
        }
        const nodeMap = flattenTreeV3(metadata, nodes);
        const entryNode = nodeMap[metadata.entry_node_id];
        if (!entryNode) {
          throw new Error(
            `Entry node "${metadata.entry_node_id}" not found in DAG "${plan_name}"`,
          );
        }

        const statePath = dagStatePath(worktree, input.sessionID);
        const state: DagSessionState = {
          dag_id: metadata.id,
          plan_path: planPath,
          status: "running",
          current_node: metadata.entry_node_id,
          todo_index: 0,
          started_at: now(),
          updated_at: now(),
          decisions: [],
          node_map: nodeMap,
          plan_name: plan_name,
        };
        writeState(statePath, state);

        if (entryNode.enforcement.length === 0) {
          if (entryNode.children && entryNode.children.length > 0) {
            state.status = "waiting_step";
            writeState(statePath, state);
          } else {
            state.status = "complete";
            writeState(statePath, state);
          }
        }

        return;
      }

      // --- Handle present_dag_diagram: validate ---
      if (input.tool === "present_dag_diagram") {
        const plan_name = output.args?.plan_name as string;
        if (!plan_name) throw new Error("plan_name is required");

        const worktree = resolveWorktree(_ctx);
        const planPath = resolveDagPath(plan_name, worktree);
        const { metadata, nodes } = readDagV3(planPath);
        validateDagV3(metadata, nodes); // throws on structural issues

        const { mermaid } = dagToMermaidCompactV3(metadata, nodes);
        const ascii = renderMermaidASCII(mermaid, {
          colorMode: "none",
        });
        const diagramText = `## Session Plan: ${metadata.id}\n\n**Plan Name:** ${plan_name}\n\n${ascii}`;

        client.session.prompt({
          path: { id: input.sessionID },
          body: {
            parts: [{ type: "text", text: diagramText }],
            noReply: true,
          },
        });
        return;
      }

      // --- Handle next_step: validate + inject prompt ---
      // Throws on invalid calls so the tool never executes.
      // On valid calls: reads the next node prompt and injects it.
      // State transitions happen in execute.
      if (input.tool === "next_step") {
        const worktree = resolveWorktree(_ctx);
        const statePath = dagStatePath(worktree, input.sessionID);
        const state = readState(statePath);

        if (!state) {
          throw new Error(
            "No active DAG session. Start one with plan_session() or activate_plan().",
          );
        }
        if (state.status === "complete") {
          throw new Error("DAG session is already complete.");
        }
        if (state.status !== "waiting_step") {
          const currentNode = state.node_map[state.current_node];
          const remaining = currentNode
            ? currentNode.enforcement.length - state.todo_index
            : 0;
          const nextExpected = currentNode
            ? (currentNode.enforcement[state.todo_index] ?? "none")
            : "unknown";
          throw new Error(
            `Cannot call next_step — node "${state.current_node}" still has ${remaining} enforcement item(s) pending. ` +
              `Next expected tool: "${nextExpected}". Call "${nextExpected}" to continue, ` +
              `then call next_step when all enforcement items are complete.`,
          );
        }

        const node = state.node_map[state.current_node];
        if (!node) {
          throw new Error(
            `Current node "${state.current_node}" not found in DAG.`,
          );
        }

        const children = node.children ?? [];

        // Terminal — no prompt to inject, execute handles completion
        if (children.length === 0) {
          return;
        }

        // Branching — validate the `next` parameter
        const next = output.args?.next as string | undefined;
        if (children.length > 1) {
          if (!next) {
            throw new Error(
              `[BRANCH REQUIRED] Node "${state.current_node}" has multiple children.\n` +
                `Call next_step with the next parameter. Valid options: [${children.join(", ")}].`,
            );
          }
          if (!children.includes(next)) {
            throw new Error(
              `Invalid branch "${next}". Valid options: [${children.join(", ")}]`,
            );
          }
        }

        // Resolve the next node — validate it exists
        const nextId = children.length === 1 ? children[0] : next!;
        const nextNode = state.node_map[nextId];
        if (!nextNode)
          throw new Error(`Next node "${nextId}" not found in DAG`);

        return;
      }

      if (isExempt(input.tool)) return;

      const worktree = resolveWorktree(_ctx);
      const statePath = dagStatePath(worktree, input.sessionID);
      const state = readState(statePath);

      if (!state) return;
      if (state.status === "complete" || state.status === "abandoned") return;

      if (state.status === "waiting_step") {
        throw new Error(
          `[DAG BLOCKED] All required calls for node "${state.current_node}" are complete.\n` +
            `Call next_step to advance to the next node.`,
        );
      }

      // status === "running" from here
      const node = state.node_map[state.current_node];
      if (!node || node.enforcement.length === 0) return;

      const expectedTool = node.enforcement[state.todo_index];
      if (!expectedTool) return;

      if (input.tool !== expectedTool) {
        if (isExempt(input.tool)) return;
        throw new Error(
          `[DAG BLOCKED] Cannot call ${input.tool} — prerequisite not met.\n` +
            `Call ${expectedTool} first to continue.`,
        );
      }
    },

    // Track tool calls, auto-advance enforcement, and inject prompts after successful execution.
    "tool.execute.after": async (input, output) => {
      if (!input.tool || !input.sessionID) return;

      // Skip if the tool call failed.
      if (!output) return;
      if (output.error) return;

      // --- Prompt injection for DAG-driving tools ---
      // These run after successful tool execution. The before hook already
      // validated and created state; we just need to inject the prompt.

      if (input.tool === "plan_session") {
        const worktree = resolveWorktree(_ctx);
        const statePath = dagStatePath(worktree, input.sessionID);
        const state = readState(statePath);
        if (!state) return;

        const entryNode = state.node_map[state.current_node];
        if (!entryNode) return;

        const sessionPath = `.opencode/session-plans/${state.planning_session_id}`;
        const promptText = readPrompt(entryNode.prompt, worktree, sessionPath, {
          planning_session_id: state.planning_session_id,
        });

        client.session.prompt({
          path: { id: input.sessionID },
          body: { parts: [{ type: "text", text: promptText }] },
        });
        return;
      }

      if (input.tool === "activate_plan") {
        const worktree = resolveWorktree(_ctx);
        const statePath = dagStatePath(worktree, input.sessionID);
        const state = readState(statePath);
        if (!state) return;

        const entryNode = state.node_map[state.current_node];
        if (!entryNode) return;

        const sessionPath = `.opencode/session-plans/${state.plan_name}`;
        const promptText = withDescription(
          readPrompt(entryNode.prompt, worktree, sessionPath, {
            plan_name: state.plan_name,
          }),
          entryNode.description,
        );

        client.session.prompt({
          path: { id: input.sessionID },
          body: { parts: [{ type: "text", text: promptText }] },
        });
        return;
      }

      if (input.tool === "next_step") {
        const worktree = resolveWorktree(_ctx);
        const statePath = dagStatePath(worktree, input.sessionID);
        const state = readState(statePath);
        if (!state) return;

        // When status is "complete" after a next_step call, there are two cases:
        //   1. True terminal: next_step was called on a node with no children — the execute
        //      handler completed the session and already returned "PLANNING SESSION COMPLETE".
        //      No prompt injection needed.
        //   2. Passthrough terminal: next_step advanced to a zero-enforcement leaf node
        //      (e.g. plan-success). The execute handler set status="complete" immediately via
        //      the passthrough block, but the node's prompt has not been injected yet.
        //      We MUST inject it so the agent sees the node instructions.
        //
        // Distinguishing factor: in case (1) the current node has enforcement items (it just
        // exhausted them). In case (2) the current node has zero enforcement (passthrough).
        if (state.status === "complete") {
          const currentNode = state.node_map[state.current_node];
          // True terminal — no injection needed
          if (!currentNode || currentNode.enforcement.length > 0) return;
          // Passthrough terminal — fall through to inject its prompt below
        }

        const currentNode = state.node_map[state.current_node];
        if (!currentNode) return;

        const sessionPath = `.opencode/session-plans/${state.plan_name ?? state.planning_session_id ?? state.dag_id}`;
        const promptText = withDescription(
          readPrompt(currentNode.prompt, worktree, sessionPath, {
            plan_name: state.plan_name,
            planning_session_id: state.planning_session_id,
          }),
          currentNode.description,
        );

        client.session.prompt({
          path: { id: input.sessionID },
          body: { parts: [{ type: "text", text: promptText }] },
        });
        return;
      }

      // --- Enforcement tracking for all other tools ---
      const worktree = resolveWorktree(_ctx);
      const statePath = dagStatePath(worktree, input.sessionID);
      const state = readState(statePath);

      if (!state) return;
      if (state.status === "complete" || state.status === "abandoned") return;

      const node = state.node_map[state.current_node];
      if (!node || node.enforcement.length === 0) return;

      // Check if this tool call matches the expected enforcement item
      const expectedTool = node.enforcement[state.todo_index];
      if (!expectedTool) return;

      // Exempt tools skip tracking unless they ARE the currently expected enforcement item.
      // This allows "question" in an enforcement[] to advance todo_index normally.
      const isExpectedTodo = expectedTool === input.tool;
      if (isExempt(input.tool) && !isExpectedTodo) return;

      if (input.tool === expectedTool) {
        state.todo_index += 1;
        state.updated_at = now();

        // Check if all enforcement items exhausted — flip to waiting_step so next_step() can run
        if (state.todo_index >= node.enforcement.length) {
          state.status = "waiting_step";
          state.updated_at = now();
          writeState(statePath, state);
        } else {
          writeState(statePath, state);
        }
      }
    },

    // Cache whether a DAG is active for this session turn.
    // Must run before experimental.chat.system.transform (which has no sessionID).
    "chat.params": async (input, _output) => {
      const worktree = resolveWorktree(_ctx);
      const statePath = dagStatePath(worktree, input.sessionID);
      const state = readState(statePath);
      _dagActiveThisTurn =
        state !== null &&
        state.status !== "complete" &&
        state.status !== "abandoned";
    },

    // Inject DAG state into compaction context for recovery.
    "experimental.session.compacting": async (input, output) => {
      const worktree = resolveWorktree(_ctx);
      const statePath = dagStatePath(worktree, input.sessionID);
      const state = readState(statePath);

      if (!state) return;

      const node = state.node_map[state.current_node];
      const todoProgress = node
        ? node.enforcement
            .map(
              (t, i) => `${i < state.todo_index ? "[done]" : "[pending]"} ${t}`,
            )
            .join(", ")
        : "none";

      const decisionsLog =
        state.decisions.length > 0
          ? state.decisions.map((d) => `${d.node_id}: ${d.summary}`).join("; ")
          : "none";

      output.context.push(
        `ACTIVE DAG SESSION: ${state.dag_id} | ` +
          `Current node: ${state.current_node} | ` +
          `Status: ${state.status} | ` +
          `Todo: ${todoProgress} | ` +
          `Decisions: ${decisionsLog} | ` +
          `Call recover_context() to reload full state.`,
      );
    },
  };
};
