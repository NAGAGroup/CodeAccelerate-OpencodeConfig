import { tool } from "@opencode-ai/plugin";
import type { Plugin } from "@opencode-ai/plugin";
import { renderMermaidASCII } from "beautiful-mermaid";
import * as fs from "fs";
import * as path from "path";
import type { DagNode, BranchOption, PlanDag, FlatNode, DecisionEntry, DagSessionState } from "./types";
import { CONFIG_ROOT, exemptTools } from "./constants";
import { dagStatePath, writeState, readState, now } from "./state-io";
import { expandPath, readPrompt, resolveDagPath } from "./path-utils";
import { readDag, writeDag } from "./dag-io";
import { collectAllNodes, dagToMermaid, validateDagTree, validateDagTreeIds, findNode, flattenTree, rewritePromptPaths } from "./dag-tree";
import { copyPlanningDag, activateDag, autoAdvance } from "./dag-lifecycle";
import { ensureOpenCodeIgnore } from "./plugin-utils";

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
          try {
            const { localPlanPath, dag } = copyPlanningDag(
              "plan-session",
              context.sessionID,
              resolveWorktree(context),
            );
            return activateDag(dag, localPlanPath, context.sessionID, resolveWorktree(context));
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            return `Error activating plan-session: ${msg}`;
          }
        },
      }),

      activate_plan: tool({
        description:
          "Activate a project DAG produced by a planning session. Reads plan.json from the given session plan directory and starts execution.",
        args: {
          plan_name: tool.schema
            .string()
            .describe(
              'Name of the session plan to activate (matches directory under .opencode/session-plans/).',
            ),
        },
        async execute({ plan_name }, context) {
          const planPath = path.join(
            resolveWorktree(context),
            ".opencode",
            "session-plans",
            plan_name,
            "plan.json",
          );
          try {
            const dag: PlanDag = JSON.parse(fs.readFileSync(planPath, "utf-8"));
            // Rewrite bare prompt filenames to worktree-relative paths
            const promptsPrefix = `.opencode/session-plans/${plan_name}/prompts/`;
            rewritePromptPaths(dag.entry, promptsPrefix);
            return activateDag(dag, planPath, context.sessionID, resolveWorktree(context));
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            return `Error activating plan "${plan_name}": ${msg}`;
          }
        },
      }),

      next_step: tool({
        description:
          "Call this after completing a node's todos to advance to the next node. Required on every node. Pass { next } to choose a branch; omit for linear advance or session completion.",
        args: {
          next: tool.schema
            .string()
            .optional()
            .describe("The node ID of the branch to take (required for branching nodes, omit for linear advance)."),
        },
        async execute({ next }, context) {
          const statePath = dagStatePath(resolveWorktree(context), context.sessionID);
          const state = readState(statePath);

          if (!state) {
            return "No active DAG session. Start one with plan_session() or activate_plan().";
          }
          if (state.status === "complete") {
            return "DAG session is already complete.";
          }
          if (state.status !== "waiting_step") {
            const currentNode = state.node_map[state.current_node];
            const remaining = currentNode ? currentNode.todo.length - state.todo_index : 0;
            const nextExpected = currentNode ? currentNode.todo[state.todo_index] ?? "none" : "unknown";
            return `Cannot call next_step — node "${state.current_node}" still has ${remaining} todo(s) pending. ` +
              `Next expected tool: "${nextExpected}". Call "${nextExpected}" to continue, ` +
              `then call next_step when all todos are complete.`;
          }

          const node = state.node_map[state.current_node];
          if (!node) {
            return `Current node "${state.current_node}" not found in DAG.`;
          }

          // Linear next — no branch choice needed
          if (node.nextLinear) {
            const nextNode = state.node_map[node.nextLinear];
            if (!nextNode) return `Error: next node "${node.nextLinear}" not found in DAG.`;

            state.current_node = nextNode.id;
            state.todo_index = 0;
            state.status = "running";
            state.updated_at = now();
            writeState(statePath, state);

            const promptText = readPrompt(nextNode.prompt, resolveWorktree(context));
             let result = `Node "${node.id}" complete. Advancing to "${nextNode.id}".\n\n---\n\n${promptText}`;

              // If next node has empty todo, set waiting_step instead of auto-advancing
              if (nextNode.todo.length === 0) {
                const hasNext = nextNode.nextLinear || (nextNode.branches && nextNode.branches.length > 0);
                if (hasNext) {
                  state.status = "waiting_step";
                  writeState(statePath, state);
                  result += `\n\n---\n\nNo todos for this node. Call \`next_step()\` now to advance.`;
               } else {
                // Terminal node with no todos
                const advanceResult = autoAdvance(state, statePath, resolveWorktree(context));
                if (advanceResult) {
                  result += `\n\n---\n\n${advanceResult}`;
                }
              }
            }

            return result;
          }

          // Branching — next parameter is required
          if (node.branches && node.branches.length > 0) {
            if (!next) {
              const options = node.branches.map((b) => b.nodeId).join(", ");
              return `Branch choice required. Valid options: [${options}]. Call \`next_step({ next: "<node-id>" })\` to choose.`;
            }

            const branch = node.branches.find((b) => b.nodeId === next);
            if (!branch) {
              const valid = node.branches.map((b) => b.nodeId).join(", ");
              return `Invalid branch "${next}". Valid options: [${valid}]`;
            }

            // Log the decision
            state.decisions.push({
              node_id: state.current_node,
              timestamp: now(),
              summary: `Chose branch "${next}": ${branch.when}`,
            });

            const nextNode = state.node_map[next];
            if (!nextNode) {
              return `Branch node "${next}" not found in DAG.`;
            }

            state.current_node = next;
            state.todo_index = 0;
            state.status = "running";
            state.updated_at = now();
            writeState(statePath, state);

             const promptText = readPrompt(nextNode.prompt, resolveWorktree(context));
             let result = `Branch taken: "${next}". Advancing.\n\n---\n\n${promptText}`;

              // If the branch node has empty todo, set waiting_step instead of auto-advancing
              if (nextNode.todo.length === 0) {
                const hasNext = nextNode.nextLinear || (nextNode.branches && nextNode.branches.length > 0);
                if (hasNext) {
                  state.status = "waiting_step";
                  writeState(statePath, state);
                  result += `\n\n---\n\nNo todos for this node. Call \`next_step()\` now to advance.`;
               } else {
                // Terminal node with no todos
                const advanceResult = autoAdvance(state, statePath, resolveWorktree(context));
                if (advanceResult) {
                  result += `\n\n---\n\n${advanceResult}`;
                }
              }
            }

            return result;
          }

          // Terminal node — end session
          state.status = "complete";
          state.updated_at = now();
          writeState(statePath, state);

           return `Node "${node.id}" complete. DAG session "${state.dag_id}" finished.\n\n` +
             `---\n\n` +
             `**PLANNING SESSION COMPLETE.** Do NOT continue executing tasks. ` +
             `Present a summary of what was produced to the user. ` +
             `If a project DAG was written, tell the user they can activate it with \`/activate-plan {plan-name}\`.`;
        },
      }),

       recover_context: tool({
         description:
           "Recover DAG session context after autocompaction or context loss. Returns current node, completed work, and decisions made.",
         args: {},
         async execute(_args, context) {
           const statePath = dagStatePath(resolveWorktree(context), context.sessionID);
           const state = readState(statePath);

           if (!state) return "No active DAG session found.";

           // Resume an abandoned session from where it left off
           if (state.status === "abandoned") {
             const node = state.node_map[state.current_node];
             const remaining = node ? node.todo.length - state.todo_index : 0;
             // If all todos were done, resume as waiting_step; otherwise resume as running
             state.status = remaining === 0 ? "waiting_step" : "running";
             state.updated_at = now();
             writeState(statePath, state);
           }

           const currentNode = state.node_map[state.current_node];
          const promptText = currentNode
            ? readPrompt(currentNode.prompt, resolveWorktree(context))
            : "(prompt not found)";

          const todoProgress = currentNode
            ? currentNode.todo
                .map((t, i) => `  ${i < state.todo_index ? "[x]" : "[ ]"} ${t}`)
                .join("\n")
            : "  (no todos)";

          const decisionsLog =
            state.decisions.length > 0
              ? state.decisions
                  .map((d) => `- [${d.node_id}] ${d.summary}`)
                  .join("\n")
              : "None yet";

           let result = `# DAG Session Recovery\n\n`;
           result += `**DAG:** ${state.dag_id}\n`;
           result += `**Status:** ${state.status}\n`;
           result += `**Started:** ${state.started_at}\n\n`;
           result += `## Decisions Made\n${decisionsLog}\n\n`;
           result += `## Current Node: ${state.current_node}\n`;
           result += `**Todo progress:**\n${todoProgress}\n\n`;
           result += `## Current Node Prompt\n\n${promptText}\n`;

             if (currentNode?.branches) {
               const choices = currentNode.branches
                 .map((b) => `- **${b.nodeId}** — ${b.when}`)
                 .join("\n");
               result += `\n## Pending Branch Choice\n${choices}\n`;
               result += `\nAll todos complete. You MUST call \`next_step({ next: "<node-id>" })\` right now to choose a branch.\n`;
             } else if (state.status === "waiting_step") {
               if (currentNode?.nextLinear) {
                 result += `\nAll todos complete. You MUST call \`next_step()\` right now. Do not call any other tool — call \`next_step()\` immediately.\n`;
               } else {
                 result += `\nNo todos for this node. Call \`next_step()\` now to advance.\n`;
              }
            }

            return result;
         },
       }),

       exit_plan: tool({
         description:
           "Abandon the current DAG session. Sets status to 'abandoned' and saves state. Use when a session needs to be exited due to a bug, user cancellation, or scope change.",
         args: {},
          async execute(_args, context) {
            const statePath = dagStatePath(resolveWorktree(context), context.sessionID);
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

            return `DAG session "${state.dag_id}" has been abandoned. ` +
              `State saved at node "${state.current_node}". ` +
              `Call recover_context() to resume from where you left off.`;
         },
       }),

        validate_dag: tool({
          description:
            "Validate a project DAG plan.json file. Checks schema validity, duplicate node IDs, and prompt file discoverability. Returns a formatted report.",
          args: {
            plan_name: tool.schema
              .string()
              .describe(
                'Name of the session plan to validate (matches directory under .opencode/session-plans/).',
              ),
          },
           async execute({ plan_name }, context) {
             try {
               const planPath = path.join(
                 resolveWorktree(context),
                 ".opencode",
                 "session-plans",
                 plan_name,
                 "plan.json",
               );

              // Helper: collect all nodes in the tree recursively
              function collectNodes(node: DagNode, collected: DagNode[] = []): DagNode[] {
                collected.push(node);
                if (Array.isArray(node.next)) {
                  for (const branch of node.next as BranchOption[]) {
                    collectNodes(branch.node, collected);
                  }
                } else if (node.next && typeof node.next === "object" && !Array.isArray(node.next)) {
                  collectNodes(node.next as DagNode, collected);
                }
                return collected;
              }

              // Parse plan.json
              if (!fs.existsSync(planPath)) {
                return `## validate_dag Report: ${plan_name}\n\n**Error:** plan.json not found at ${planPath}`;
              }

              let dag: PlanDag;
              try {
                dag = JSON.parse(fs.readFileSync(planPath, "utf-8"));
              } catch {
                return `## validate_dag Report: ${plan_name}\n\n**Error:** plan.json is not valid JSON`;
              }

              const issues: string[] = [];
              const nodeCollected = collectNodes(dag.entry);
              let checksPassedCount = 0;

              // Check 1: schema_version and entry field
              if (dag.schema_version !== "2.0") {
                issues.push(`- [schema] check-schema: schema_version is "${dag.schema_version}", expected "2.0"`);
              } else {
                checksPassedCount++;
              }

              if (!dag.entry) {
                issues.push(`- [entry] check-entry: entry field is missing`);
              } else {
                checksPassedCount++;
              }

              // Check 2: No duplicate node IDs
              const nodeIds = new Set<string>();
              const duplicates = new Set<string>();
              for (const node of nodeCollected) {
                if (nodeIds.has(node.id)) {
                  duplicates.add(node.id);
                }
                nodeIds.add(node.id);
              }
              if (duplicates.size > 0) {
                const dupList = Array.from(duplicates).join(", ");
                issues.push(`- [nodes] check-unique-ids: duplicate node ids found: ${dupList}`);
              } else {
                checksPassedCount++;
              }

              const promptsDir = path.join(
                 resolveWorktree(context),
                 ".opencode",
                 "session-plans",
                 plan_name,
                 "prompts",
               );

              // Check 3: For each node, verify prompt file is discoverable
              for (const node of nodeCollected) {
                // Bare filenames (no "/") resolve to the plan's prompts/ subdirectory,
                // matching the same rewrite logic used by activate_plan.
                const resolvedPrompt = node.prompt.includes("/")
                  ? expandPath(node.prompt)
                  : path.join(promptsDir, node.prompt);
                 const fullPromptPath = path.isAbsolute(resolvedPrompt)
                   ? resolvedPrompt
                   : path.join(resolveWorktree(context), resolvedPrompt);

                // Check 3: Prompt file exists
                if (!fs.existsSync(fullPromptPath)) {
                  issues.push(`- [${node.id}] check-prompt-exists: prompt file not found at ${node.prompt}`);
                } else {
                  checksPassedCount++;
                }
              }

              // Build report
              let report = `## validate_dag Report: ${plan_name}\n\n`;
              report += `**Nodes checked:** ${nodeCollected.length}\n`;
              report += `**Checks passed:** ${checksPassedCount}\n`;
              report += `**Issues found:** ${issues.length}\n\n`;

              if (issues.length > 0) {
                report += `## Issues\n\n${issues.join("\n")}\n\n`;
                report += `${issues.length} issue(s) found. Review before proceeding.`;
              } else {
                report += `All checks passed.`;
              }

              return report;
            } catch (err) {
              const msg = err instanceof Error ? err.message : String(err);
              return `## validate_dag Report: ${plan_name}\n\n**Error:** ${msg}`;
            }
          },
        }),

    show_dag: tool({
      description: "Display an ASCII Mermaid diagram of a DAG. Accepts a session plan name or a raw path to plan.json.",
      args: {
        target: tool.schema.string().describe(
          "Session plan name (under .opencode/session-plans/) or raw file path to plan.json."
        ),
      },
      async execute({ target }, context) {
        try {
          const worktree = resolveWorktree(context);
          const planPath = resolveDagPath(target, worktree);
          const dag = readDag(planPath);
          validateDagTree(dag);
          const mermaid = dagToMermaid(dag);
          const ascii = await renderMermaidASCII(mermaid, { colorMode: 'none' });
          return `## DAG: ${dag.id}\n\n${ascii}`;
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return `Error in show_dag: ${msg}`;
        }
      },
    }),

     present_dag_to_user: tool({
       description: "Display an ASCII Mermaid diagram of a session plan DAG to the user. Injects the diagram directly into the conversation as a system message that the agent ignores.",
       args: {
         plan_name: tool.schema.string().describe(
           "Session plan name (under .opencode/session-plans/) or raw file path to plan.json."
         ),
       },
       async execute({ plan_name }, toolCtx) {
         try {
           const worktree = resolveWorktree(toolCtx);
           const planPath = resolveDagPath(plan_name, worktree);
           const dag = readDag(planPath);
           validateDagTree(dag);
           const mermaid = dagToMermaid(dag);
           const ascii = await renderMermaidASCII(mermaid, { colorMode: 'none' });
           const diagramText = `## Session Plan: ${dag.id}\n\n**Plan Name:** ${plan_name}\n\n${ascii}`;
          
          // Inject the diagram into the conversation as a system message.
          // Must await so the prompt is written before the tool returns.
          await client.session.prompt({
            path: { id: toolCtx.sessionID },
            body: {
              noReply: true,
              parts: [{
                type: "text",
                text: diagramText
              }]
            }
          });
          
          return "DAG diagram presented via prompt injection below. Ignore the following system message—it contains the session plan visualization.";
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return `Error in present_dag_to_user: ${msg}`;
        }
      },
    }),

    init_dag: tool({
      description: "Initialize a new project DAG plan.json with a single entry node. Call this first before using add_node. Creates the session plan directory and plan.json with the entry node as the root.",
      args: {
        plan_name: tool.schema.string().describe(
          "Name for the session plan (e.g., 'my-feature-delivery'). Used as the directory name under .opencode/session-plans/. Lowercase, hyphens only, no spaces."
        ),
        dag_id: tool.schema.string().describe(
          "Identifier for this DAG (e.g., 'my-feature-delivery'). Stored as the 'id' field in plan.json."
        ),
        entry_node_id: tool.schema.string().describe(
          "ID for the entry node. Must be 'session-overview' by convention."
        ),
        entry_prompt_file: tool.schema.string().describe(
          "Prompt filename for the entry node (e.g., 'session-overview.md'). Bare filename only."
        ),
        entry_todo: tool.schema.array(tool.schema.string()).describe(
          "Todo array for the entry node. Use [] for session-overview (auto-advances)."
        ),
      },
      async execute({ plan_name, dag_id, entry_node_id, entry_prompt_file, entry_todo }, context) {
        try {
          const worktree = resolveWorktree(context);
          const planDir = path.join(worktree, '.opencode', 'session-plans', plan_name);
          const planPath = path.join(planDir, 'plan.json');
          const promptsDir = path.join(planDir, 'prompts');

          if (fs.existsSync(planPath)) {
            return `Error in init_dag: plan.json already exists at ${planPath}. Use add_node to extend the existing DAG, or delete the file manually to start fresh.`;
          }

          fs.mkdirSync(planDir, { recursive: true });
          fs.mkdirSync(promptsDir, { recursive: true });

          const dag: PlanDag = {
            schema_version: "2.0",
            id: dag_id,
            entry: {
              id: entry_node_id,
              prompt: entry_prompt_file,
              todo: entry_todo,
            },
          };

          writeDag(planPath, dag);
          const ascii = await renderMermaidASCII(dagToMermaid(dag), { colorMode: 'none' });
          return `## init_dag: Created DAG "${dag_id}"\n\nPlan directory: ${planDir}\nPrompts directory: ${promptsDir}\n\n${ascii}`;
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return `Error in init_dag: ${msg}`;
        }
      },
    }),

    add_node: tool({
      description: "Add a new node to a DAG. For linear add (extending a terminal node), omit 'when'. For branch add (adding a branch option), provide 'when'.",
      args: {
        target: tool.schema.string().describe(
          "Session plan name or raw path to plan.json."
        ),
        parentId: tool.schema.string().describe(
          "ID of the existing node to attach the new node to."
        ),
        newNodeId: tool.schema.string().describe(
          "ID for the new node. Must be unique across all existing node IDs."
        ),
        promptFile: tool.schema.string().describe(
          "Prompt filename for the new node (bare filename like 'my-node.md')."
        ),
        todo: tool.schema.array(tool.schema.string()).describe(
          "Ordered array of tool-name strings for the new node's todo list."
        ),
        when: tool.schema.string().optional().describe(
          "Branch condition string. Required when adding a branch option to a branching parent. Omit for linear add (parent must be a terminal node)."
        ),
      },
      async execute({ target, parentId, newNodeId, promptFile, todo, when }, context) {
        try {
          const worktree = resolveWorktree(context);
          const planPath = resolveDagPath(target, worktree);
          const dag = readDag(planPath);
          validateDagTreeIds(dag);

          const parent = findNode(dag, parentId);
          if (!parent) {
            return `Error in add_node: Node "${parentId}" not found in DAG.`;
          }

          const existing = findNode(dag, newNodeId);
          if (existing) {
            return `Error in add_node: Node ID "${newNodeId}" already exists in DAG.`;
          }

          const newNode: DagNode = { id: newNodeId, prompt: promptFile, todo };

          if (when === undefined) {
            // Linear add — parent must be terminal
            if (parent.next !== undefined && parent.next !== null) {
              return `Error in add_node: Parent node "${parentId}" is not a terminal (has next). Linear add requires a terminal parent. Use "when" to add a branch option instead.`;
            }
            parent.next = newNode;
          } else {
            // Branch add
            if (parent.next !== undefined && !Array.isArray(parent.next)) {
              return `Error in add_node: Parent node "${parentId}" has a linear next. Cannot add a branch option to a linear node. Remove the linear next first, or omit "when" for a linear add on a terminal node.`;
            }
            if (parent.next === undefined || parent.next === null) {
              parent.next = [{ when, node: newNode }];
            } else {
              (parent.next as BranchOption[]).push({ when, node: newNode });
            }
          }

          validateDagTreeIds(dag);
          writeDag(planPath, dag);
          const ascii = await renderMermaidASCII(dagToMermaid(dag), { colorMode: 'none' });
          return `## add_node: Added "${newNodeId}" to "${parentId}"\n\n${ascii}`;
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return `Error in add_node: ${msg}`;
        }
      },
    }),

    delete_node: tool({
      description: "Delete a node and its entire subtree from a DAG. Returns before-and-after ASCII diagrams.",
      args: {
        target: tool.schema.string().describe(
          "Session plan name or raw path to plan.json."
        ),
        nodeId: tool.schema.string().describe(
          "ID of the node to delete. The node and its entire subtree are removed."
        ),
      },
       async execute({ target, nodeId }, context) {
        try {
          const worktree = resolveWorktree(context);
          const planPath = resolveDagPath(target, worktree);
          const dag = readDag(planPath);
          validateDagTreeIds(dag);

          const beforeAscii = await renderMermaidASCII(dagToMermaid(dag), { colorMode: 'none' });

          if (nodeId === dag.entry.id) {
            return `Error in delete_node: Cannot delete the entry node "${nodeId}". The entry node is required.`;
          }

          const targetNode = findNode(dag, nodeId);
          if (!targetNode) {
            return `Error in delete_node: Node "${nodeId}" not found in DAG.`;
          }

           // Find and detach from parent
           function detach(node: DagNode): boolean {
             if (Array.isArray(node.next)) {
               const branches = node.next as BranchOption[];
               const idx = branches.findIndex(b => b.node.id === nodeId);
               if (idx !== -1) {
                 branches.splice(idx, 1);
                 if (branches.length === 0) {
                   node.next = undefined;
                 }
                 // A single remaining branch is intentionally left as a 1-element
                 // branch array — the DAG is in an incomplete state. Use add_node
                 // to add more branches, or validate_dag to check final structure.
                 return true;
               }
               for (const branch of branches) {
                 if (detach(branch.node)) return true;
               }
             } else if (node.next && typeof node.next === 'object') {
               if ((node.next as DagNode).id === nodeId) {
                 node.next = undefined;
                 return true;
               }
               return detach(node.next as DagNode);
             }
             return false;
           }

           const detached = detach(dag.entry);
           if (!detached) {
             return `Error in delete_node: Could not detach node "${nodeId}" from parent.`;
           }

           // Only validate ID uniqueness post-delete — branch count violations are
           // allowed (incomplete DAG state), same as add_node. Use validate_dag for
           // full structural validation.
           try {
             validateDagTreeIds(dag);
           } catch (validErr) {
             const msg = validErr instanceof Error ? validErr.message : String(validErr);
             return `Error in delete_node: Deletion would produce an invalid DAG: ${msg}. No changes written.`;
           }

          writeDag(planPath, dag);
          const afterAscii = await renderMermaidASCII(dagToMermaid(dag), { colorMode: 'none' });
          return `## delete_node: Deleted "${nodeId}" and its subtree\n\n### Before\n\n${beforeAscii}\n\n### After\n\n${afterAscii}`;
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return `Error in delete_node: ${msg}`;
        }
      },
    }),

    modify_node: tool({
      description: "Modify an existing DAG node's prompt file, todo array, or branch 'when' label. Does NOT change the node's next/children.",
      args: {
        target: tool.schema.string().describe(
          "Session plan name or raw path to plan.json."
        ),
        nodeId: tool.schema.string().describe(
          "ID of the node to modify."
        ),
        promptFile: tool.schema.string().optional().describe(
          "New prompt filename. If omitted, the existing value is unchanged."
        ),
        todo: tool.schema.array(tool.schema.string()).optional().describe(
          "New todo array. If omitted, the existing value is unchanged."
        ),
        when: tool.schema.string().optional().describe(
          "New branch 'when' label. Updates the parent's branch condition that routes to this node. Only valid if this node is a branch child. If omitted, no 'when' is updated."
        ),
      },
      async execute({ target, nodeId, promptFile, todo, when }, context) {
        try {
          const worktree = resolveWorktree(context);
          const planPath = resolveDagPath(target, worktree);
          const dag = readDag(planPath);
          validateDagTreeIds(dag);

          const node = findNode(dag, nodeId);
          if (!node) {
            return `Error in modify_node: Node "${nodeId}" not found in DAG.`;
          }

          if (promptFile === undefined && todo === undefined && when === undefined) {
            return `Nothing to modify — provide at least one of promptFile, todo, or when.`;
          }

          if (when !== undefined) {
            // Find the parent branch that points to this node
            const allNodes = collectAllNodes(dag.entry);
            let found = false;
            for (const n of allNodes) {
              if (Array.isArray(n.next)) {
                const branch = (n.next as BranchOption[]).find(b => b.node.id === nodeId);
                if (branch) {
                  branch.when = when;
                  found = true;
                  break;
                }
              }
            }
            if (!found) {
              return `Error in modify_node: Node "${nodeId}" is not a branch child of any node. Cannot update "when".`;
            }
          }

          if (promptFile !== undefined) node.prompt = promptFile;
          if (todo !== undefined) node.todo = todo;

          validateDagTree(dag);
          writeDag(planPath, dag);
          const ascii = await renderMermaidASCII(dagToMermaid(dag), { colorMode: 'none' });
          return `## modify_node: Modified "${nodeId}"\n\n${ascii}`;
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return `Error in modify_node: ${msg}`;
        }
      },
    }),
      },

    // ── Hooks ────────────────────────────────────────────────────────────────

    // Block tool calls that don't match the expected todo item.
    "tool.execute.before": async (input, output) => {
      if (!input.tool || !input.sessionID) return;

      if (exemptTools.includes(input.tool)) return;

      const worktree = resolveWorktree(_ctx);
      const statePath = dagStatePath(worktree, input.sessionID);
      const state = readState(statePath);

      if (!state) return;
      if (state.status === "complete" || state.status === "abandoned") return;

       if (state.status === "waiting_step") {
         throw new Error(
           `[DAG BLOCKED] All todos for node "${state.current_node}" are complete. ` +
           `Call \`next_step()\` to advance to the next node before calling any other tools.`
         );
       }

       // status === "running" from here
       const node = state.node_map[state.current_node];
       if (!node || node.todo.length === 0) return;

       const expectedTool = node.todo[state.todo_index];
       if (!expectedTool) return;

        if (input.tool !== expectedTool) {
          if (exemptTools.includes(input.tool)) return;
          throw new Error(
            `[DAG BLOCKED] Tool "${input.tool}" is not allowed at this step. ` +
            `Expected: "${expectedTool}". Call "${expectedTool}" to continue.\n\n` +
            `Current node: "${state.current_node}" | Todo progress can be checked with recover_context().`
          );
        }
    },

     // Track tool calls and auto-advance when todos are exhausted.
     "tool.execute.after": async (input, output) => {
       if (!input.tool || !input.sessionID) return;

       // Exempt tools bypass blocking but still participate in todo tracking when
       // they appear as the currently expected todo item (e.g. "question" in todo[]).
       const worktree = resolveWorktree(_ctx);
       const statePath = dagStatePath(worktree, input.sessionID);
       const state = readState(statePath);

       if (!state) return;
       if (state.status === "complete" || state.status === "abandoned") return;

      const node = state.node_map[state.current_node];
      if (!node || node.todo.length === 0) return;

      // Check if this tool call matches the expected todo item
      const expectedTool = node.todo[state.todo_index];
      if (!expectedTool) return;

      // Exempt tools skip tracking unless they ARE the currently expected todo item.
      // This allows "question" in a todo[] to advance todo_index normally.
      const isExpectedTodo = expectedTool === input.tool;
      if (exemptTools.includes(input.tool) && !isExpectedTodo) return;

      if (input.tool === expectedTool) {
        state.todo_index += 1;
        state.updated_at = now();

        // Check if all todos exhausted
        if (state.todo_index >= node.todo.length) {
          writeState(statePath, state);
          const advanceResult = autoAdvance(state, statePath, worktree);
          if (advanceResult) {
            // Append navigation prompt to the tool's output
            output.output = output.output + `\n\n---\n\n${advanceResult}`;
          }
        } else {
          writeState(statePath, state);
          // Inform agent of progress
          const remaining = node.todo.length - state.todo_index;
          const nextExpected = node.todo[state.todo_index];
          output.output =
            output.output +
            `\n\n[DAG: ${remaining} todo(s) remaining. Next expected: ${nextExpected}]`;
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

    // Signal to HeadWrench that a DAG session is active.
    // headwrench.md checks for [DAG_ACTIVE] and switches to executor mode.
    "experimental.chat.system.transform": async (_input, output) => {
      if (!_dagActiveThisTurn) return;
      output.system.push("[DAG_ACTIVE]");
    },

    // Inject DAG state into compaction context for recovery.
    "experimental.session.compacting": async (input, output) => {
      const worktree = resolveWorktree(_ctx);
      const statePath = dagStatePath(worktree, input.sessionID);
      const state = readState(statePath);

      if (!state) return;

      const node = state.node_map[state.current_node];
      const todoProgress = node
        ? node.todo
            .map((t, i) => `${i < state.todo_index ? "[done]" : "[pending]"} ${t}`)
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
