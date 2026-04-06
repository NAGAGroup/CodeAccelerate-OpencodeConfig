import { tool } from "@opencode-ai/plugin";
import type { Plugin } from "@opencode-ai/plugin";
import { renderMermaidASCII } from "beautiful-mermaid";
import * as fs from "fs";
import * as path from "path";
import type { DecisionEntry, DagSessionState, DagNodeV3, DagMetadataV3 } from "./types";
import { exemptTools, isExempt, CONFIG_ROOT } from "./constants";
import { dagStatePath, writeState, readState, now } from "./state-io";
import { expandPath, readPrompt, resolveDagPath } from "./path-utils";
import { readDagV3, writeDagV3 } from "./dag-io";
import { dagToMermaidV3, dagToMermaidCompactV3, validateDagV3, flattenTreeV3 } from "./dag-tree";
import { copyPlanningDag } from "./dag-lifecycle";
import { ensureOpenCodeIgnore } from "./plugin-utils";
import { detectDivergence, suggestRecoveryActions } from "./divergence-detection";

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
            const worktree = resolveWorktree(context);
            const { localPlanPath, metadata, nodes } = copyPlanningDag(
              "plan-session",
              context.sessionID,
              worktree,
            );
            // Rewrite bare prompt filenames to session-local paths
            const plan_name = `plan-session-${context.sessionID}`;
            const promptsPrefix = `.opencode/session-plans/${plan_name}/prompts/`;
            for (const node of nodes) {
              if (!node.prompt.includes("/")) node.prompt = `${promptsPrefix}${node.prompt}`;
            }
            const nodeMap = flattenTreeV3(metadata, nodes);
            const entryNode = nodeMap[metadata.entry_node_id];
            if (!entryNode) return `Error: entry node "${metadata.entry_node_id}" not found`;

            const statePath = dagStatePath(worktree, context.sessionID);
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

            const sessionPath = `.opencode/session-plans/${plan_name}`;
            const promptText = readPrompt(entryNode.prompt, worktree, sessionPath, { planning_session_id: plan_name });
            
            // Inject the prompt into the conversation as a system message.
            // Must await so the prompt is written before the tool returns.
            await client.session.prompt({
              path: { id: context.sessionID },
              body: {
                noReply: true,
                parts: [{
                  type: "text",
                  text: promptText
                }]
              }
            });

            if (entryNode.enforcement.length === 0) {
              const hasNext = entryNode.children && entryNode.children.length > 0;
              state.status = hasNext ? "waiting_step" : "complete";
              writeState(statePath, state);
            }

            const result = `DAG "${metadata.id}" activated. Your next task, "${metadata.entry_node_id}", will be presented in the following message.`;
            return result;
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            return `Error activating plan-session: ${msg}`;
          }
        },
      }),

      activate_plan: tool({
        description:
          "Activate a project DAG produced by a planning session. Reads plan.jsonl from the given session plan directory and starts execution.",
        args: {
          plan_name: tool.schema
            .string()
            .describe(
              'Name of the session plan to activate (matches directory under .opencode/session-plans/).',
            ),
        },
        async execute({ plan_name }, context) {
          const worktree = resolveWorktree(context);
          const planPath = path.join(worktree, ".opencode", "session-plans", plan_name, "plan.jsonl");
          try {
            const { metadata, nodes } = readDagV3(planPath);
            // Rewrite bare prompt filenames to worktree-relative paths
            const promptsPrefix = `.opencode/session-plans/${plan_name}/prompts/`;
            for (const node of nodes) {
              if (!node.prompt.includes("/")) {
                node.prompt = `${promptsPrefix}${node.prompt}`;
              }
            }
            const nodeMap = flattenTreeV3(metadata, nodes);
            const entryNode = nodeMap[metadata.entry_node_id];
            if (!entryNode) {
              return `Error activating plan "${plan_name}": entry node "${metadata.entry_node_id}" not found in DAG`;
            }

            const statePath = dagStatePath(worktree, context.sessionID);
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
            };
            writeState(statePath, state);

            const sessionPath = `.opencode/session-plans/${plan_name}`;
            const promptText = readPrompt(entryNode.prompt, worktree, sessionPath);
            
            // Inject the prompt into the conversation as a system message.
            // Must await so the prompt is written before the tool returns.
            await client.session.prompt({
              path: { id: context.sessionID },
              body: {
                noReply: true,
                parts: [{
                  type: "text",
                  text: promptText
                }]
              }
            });

            if (entryNode.enforcement.length === 0) {
              if (entryNode.children && entryNode.children.length > 0) {
                state.status = "waiting_step";
                writeState(statePath, state);
              } else {
                // Terminal node with no todos — complete immediately
                state.status = "complete";
                writeState(statePath, state);
              }
            }

            const result = `DAG "${metadata.id}" activated. Your next task, "${metadata.entry_node_id}", will be presented in the following message.`;
            return result;
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
             const remaining = currentNode ? currentNode.enforcement.length - state.todo_index : 0;
             const nextExpected = currentNode ? currentNode.enforcement[state.todo_index] ?? "none" : "unknown";
             return `Cannot call next_step — node "${state.current_node}" still has ${remaining} enforcement item(s) pending. ` +
               `Next expected tool: "${nextExpected}". Call "${nextExpected}" to continue, ` +
               `then call next_step when all enforcement items are complete.`;
          }

          const node = state.node_map[state.current_node];
          if (!node) {
            return `Current node "${state.current_node}" not found in DAG.`;
          }

          const children = node.children ?? [];

          // Terminal — end session
          if (children.length === 0) {
            state.status = "complete";
            state.updated_at = now();
            writeState(statePath, state);
            return `Node "${node.id}" complete. DAG session "${state.dag_id}" finished.\n\n` +
              `---\n\n` +
              `**PLANNING SESSION COMPLETE.** Do NOT continue executing tasks. ` +
              `Present a summary of what was produced to the user. ` +
              `If a project DAG was written, tell the user they can activate it with \`/activate-plan {plan-name}\`.`;
          }

           // Branching — next parameter required
           if (children.length > 1) {
             if (!next) {
               return `[BRANCH REQUIRED] Node "${state.current_node}" has multiple children.\nCall next_step with the next parameter. Valid options: [${children.join(", ")}].`;
             }
             if (!children.includes(next)) {
               return `Invalid branch "${next}". Valid options: [${children.join(", ")}]`;
             }
             state.decisions.push({ node_id: state.current_node, timestamp: now(), summary: `Chose branch "${next}"` });
           }

          // Linear or chosen branch — advance
          const nextId = children.length === 1 ? children[0] : next!;
          const nextNode = state.node_map[nextId];
          if (!nextNode) return `Error: next node "${nextId}" not found in DAG.`;

          state.current_node = nextId;
          state.todo_index = 0;
          state.status = "running";
          state.updated_at = now();
          writeState(statePath, state);

          const sessionPath = `.opencode/session-plans/${state.dag_id}`;
          const promptText = readPrompt(nextNode.prompt, resolveWorktree(context), sessionPath, {
            plan_name: state.plan_name,
            planning_session_id: state.planning_session_id,
          });
          
          // Inject the prompt into the conversation as a system message.
          // Must await so the prompt is written before the tool returns.
          await client.session.prompt({
            path: { id: context.sessionID },
            body: {
              noReply: true,
              parts: [{
                type: "text",
                text: promptText
              }]
            }
          });

           if (nextNode.enforcement.length === 0) {
             const nextChildren = nextNode.children ?? [];
             if (nextChildren.length > 0) {
               state.status = "waiting_step";
               writeState(statePath, state);
             } else {
               state.status = "complete";
               writeState(statePath, state);
             }
           }

          // Build completion message - read DAG to get entry node
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
            const statePath = dagStatePath(resolveWorktree(context), context.sessionID);
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
              suggestions.forEach(s => {
                divergenceWarning += `- ${s}\n`;
              });
              divergenceWarning += "\n---\n\n";
            }

            // Resume an abandoned session from where it left off
             if (state.status === "abandoned") {
               const node = state.node_map[state.current_node];
               const remaining = node ? node.enforcement.length - state.todo_index : 0;
               // If all enforcement items were done, resume as waiting_step; otherwise resume as running
               state.status = remaining === 0 ? "waiting_step" : "running";
               state.updated_at = now();
               writeState(statePath, state);
             }

            const currentNode = state.node_map[state.current_node];
            const sessionPath = `.opencode/session-plans/${state.dag_id}`;
            const promptText = currentNode
              ? readPrompt(currentNode.prompt, resolveWorktree(context), sessionPath, {
                  plan_name: state.plan_name,
                  planning_session_id: state.planning_session_id,
                })
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
                const choices = currentNode.children.map((id) => `- **${id}**`).join("\n");
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
            "Validate a project DAG plan.jsonl file. Checks schema validity, duplicate node IDs, and prompt file discoverability. Returns a formatted report.",
          args: {
            plan_name: tool.schema
              .string()
              .describe(
                'Name of the session plan to validate (matches directory under .opencode/session-plans/).',
              ),
          },
           async execute({ plan_name }, context) {
             try {
               const worktree = resolveWorktree(context);
               const planPath = path.join(worktree, ".opencode", "session-plans", plan_name, "plan.jsonl");

              if (!fs.existsSync(planPath)) {
                return `## validate_dag Report: ${plan_name}\n\n**Error:** plan.jsonl not found at ${planPath}`;
              }

              let metadata: DagMetadataV3;
              let nodes: DagNodeV3[];
              try {
                ({ metadata, nodes } = readDagV3(planPath));
              } catch (parseErr) {
                const msg = parseErr instanceof Error ? parseErr.message : String(parseErr);
                return `## validate_dag Report: ${plan_name}\n\n**Error:** ${msg}`;
              }

              const issues: string[] = [];
              let checksPassedCount = 0;

              // Check 1: entry_node_id exists in nodes
              if (!nodes.some(n => n.id === metadata.entry_node_id)) {
                issues.push(`- [entry] check-entry: entry_node_id "${metadata.entry_node_id}" not found in nodes`);
              } else {
                checksPassedCount++;
              }

              // Check 2: No duplicate node IDs
              const nodeIds = new Set<string>();
              const duplicates = new Set<string>();
              for (const node of nodes) {
                if (nodeIds.has(node.id)) duplicates.add(node.id);
                nodeIds.add(node.id);
              }
              if (duplicates.size > 0) {
                issues.push(`- [nodes] check-unique-ids: duplicate node ids found: ${Array.from(duplicates).join(", ")}`);
              } else {
                checksPassedCount++;
              }

              // Check 3: children node IDs reference existing nodes
              for (const node of nodes) {
                if (node.children) {
                  for (const childId of node.children) {
                    if (!nodeIds.has(childId)) {
                      issues.push(`- [${node.id}] check-refs: child "${childId}" does not exist`);
                    } else {
                      checksPassedCount++;
                    }
                  }
                }
              }

              // Check 4: prompt files exist
              const promptsDir = path.join(worktree, ".opencode", "session-plans", plan_name, "prompts");
              for (const node of nodes) {
                const resolvedPrompt = node.prompt.includes("/")
                  ? expandPath(node.prompt)
                  : path.join(promptsDir, node.prompt);
                const fullPromptPath = path.isAbsolute(resolvedPrompt)
                  ? resolvedPrompt
                  : path.join(worktree, resolvedPrompt);
                if (!fs.existsSync(fullPromptPath)) {
                  issues.push(`- [${node.id}] check-prompt-exists: prompt file not found at ${node.prompt}`);
                } else {
                  checksPassedCount++;
                }
              }

              let report = `## validate_dag Report: ${plan_name}\n\n`;
              report += `**Nodes checked:** ${nodes.length}\n`;
              report += `**Checks passed:** ${checksPassedCount}\n`;
              report += `**Issues found:** ${issues.length}\n\n`;
              if (issues.length > 0) {
                report += `### Issues\n\n${issues.join("\n")}\n\n`;
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
      description: "Display the raw JSONL content of a DAG plan file. Returns the plan.jsonl text directly so agents can read node IDs, enforcement arrays, and structure without file access. Accepts a session plan name or a raw path to plan.jsonl.",
      args: {
        target: tool.schema.string().describe(
          "Session plan name (under .opencode/session-plans/) or raw file path to plan.jsonl."
        ),
      },
      async execute({ target }, context) {
        try {
          const worktree = resolveWorktree(context);
          const planPath = resolveDagPath(target, worktree);
          const content = fs.readFileSync(planPath, "utf-8");
          return `## DAG: ${target}\n\n\`\`\`jsonl\n${content}\n\`\`\``;
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return `Error in show_dag: ${msg}`;
        }
      },
    }),

    show_compact_dag: tool({
      description: "Display an ASCII Mermaid diagram of a DAG with sequential nodes collapsed into single blocks. Only branching structure is shown. Use this instead of show_dag when you need a visual overview — it avoids hangs on large DAGs.",
      args: {
        target: tool.schema.string().describe(
          "Session plan name (under .opencode/session-plans/) or raw file path to plan.jsonl."
        ),
      },
      async execute({ target }, context) {
        try {
          const worktree = resolveWorktree(context);
          const planPath = resolveDagPath(target, worktree);
          const { metadata, nodes } = readDagV3(planPath);
          validateDagV3(metadata, nodes);
          const mermaid = dagToMermaidCompactV3(metadata, nodes);
          const ascii = await renderMermaidASCII(mermaid, { colorMode: 'none' });
          return `## DAG (compact): ${metadata.id}\n\n${ascii}`;
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return `Error in show_compact_dag: ${msg}`;
        }
      },
    }),

     present_compact_dag_to_user: tool({
      description: "Display an ASCII Mermaid diagram of a session plan DAG to the user, with sequential nodes collapsed into single blocks. Injects the compact diagram into the conversation as a system message that the agent ignores. Use this for user review — it avoids hangs on large DAGs.",
      args: {
        plan_name: tool.schema.string().describe(
          "Session plan name (under .opencode/session-plans/) or raw file path to plan.jsonl."
        ),
      },
      async execute({ plan_name }, toolCtx) {
        try {
          const worktree = resolveWorktree(toolCtx);
          const planPath = resolveDagPath(plan_name, worktree);
          const { metadata, nodes } = readDagV3(planPath);
          validateDagV3(metadata, nodes);
          const mermaid = dagToMermaidCompactV3(metadata, nodes);
          const ascii = await renderMermaidASCII(mermaid, { colorMode: 'none' });
          const diagramText = `## Session Plan: ${metadata.id}\n\n**Plan Name:** ${plan_name}\n\n${ascii}`;

          await client.session.prompt({
            path: { id: toolCtx.sessionID },
            body: {
              noReply: true,
              parts: [{ type: "text", text: diagramText }]
            }
          });

          return "Compact DAG diagram presented via prompt injection below. Ignore the following system message—it contains the session plan visualization.";
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return `Error in present_compact_dag_to_user: ${msg}`;
        }
      },
    }),

    choose_plan_name: tool({
      description: "Set the execution plan name for this planning session. Substitutes {{PLAN_NAME}} in all remaining node prompts in the current session's node map. Call this during the session-overview node after deciding on a plan name.",
      args: {
        name: tool.schema.string().describe(
          "The name for the execution plan that will be designed in this planning session. Descriptive and human-memorable — this is what the user will type into /activate-plan. Lowercase, hyphens only, no spaces (e.g., 'add-auth-flow', 'fix-payment-bug')."
        ),
      },
      async execute({ name }, context) {
        try {
          const worktree = resolveWorktree(context);
          const statePath = dagStatePath(worktree, context.sessionID);
          const state = readState(statePath);

          if (!state) {
            return "No active DAG session. choose_plan_name must be called during an active planning session.";
          }

          if (!name || name.trim().length === 0) {
            return "Error in choose_plan_name: name must not be empty.";
          }

          // Deduplicate: if a directory with this name already exists, increment suffix
          const sessionPlansDir = path.join(worktree, ".opencode", "session-plans");
          let confirmedName = name.trim();
          let suffix = 2;
          while (fs.existsSync(path.join(sessionPlansDir, confirmedName))) {
            confirmedName = `${name.trim()}-${suffix}`;
            suffix++;
          }

          // Store in state — {{PLAN_NAME}} will be substituted at prompt read time
          state.plan_name = confirmedName;
          state.updated_at = now();
          writeState(statePath, state);

          const dedupeNote = confirmedName !== name.trim()
            ? ` (deduplicated from "${name.trim()}" — directory already existed)`
            : "";
          return `Plan name set to "${confirmedName}"${dedupeNote}. {{PLAN_NAME}} will be substituted in all subsequent planning prompts automatically.`;
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return `Error in choose_plan_name: ${msg}`;
        }
      },
    }),

     init_dag: tool({
        description: "Initialize a new project DAG plan.jsonl (JSONL format, schema_version 3.0). Creates the session plan directory and plan.jsonl with the hardcoded execution-kickoff entry node.",
        args: {
          plan_name: tool.schema.string().describe(
            "Name for the session plan (e.g., 'my-feature-delivery'). Used as the directory name under .opencode/session-plans/ and as the DAG id. Lowercase, hyphens only, no spaces."
          ),
        },
        async execute({ plan_name }, context) {
          try {
            const worktree = resolveWorktree(context);
            const planDir = path.join(worktree, '.opencode', 'session-plans', plan_name);
            const planPath = path.join(planDir, 'plan.jsonl');

            if (fs.existsSync(planPath)) {
              return `Error in init_dag: plan.jsonl already exists at ${planPath}. Use add_node to extend the existing DAG, or delete the file manually to start fresh.`;
            }

             // Load execution-kickoff node spec from the library
             const nodeLibRelBase = path.join("planning", "plan-session", "node-library");
             const kickoffSpecPath = path.join(CONFIG_ROOT, nodeLibRelBase, "execution-kickoff", "node-spec.json");
             if (!fs.existsSync(kickoffSpecPath)) {
               return `Error in init_dag: execution-kickoff node-spec.json not found at ${kickoffSpecPath}.`;
             }
             const kickoffSpec = JSON.parse(fs.readFileSync(kickoffSpecPath, "utf-8"));
             const sourcePromptPath = path.join(CONFIG_ROOT, nodeLibRelBase, "execution-kickoff", "prompt.md");

            // Create session prompts directory and copy prompt file
            const sessionPromptsDir = path.join(planDir, 'prompts');
            fs.mkdirSync(sessionPromptsDir, { recursive: true });
            const destPromptPath = path.join(sessionPromptsDir, 'execution-kickoff.md');
            fs.copyFileSync(sourcePromptPath, destPromptPath);

            // Store worktree-relative path in plan.jsonl
            const promptPath = path.join('.opencode', 'session-plans', plan_name, 'prompts', 'execution-kickoff.md');

            const metadata: DagMetadataV3 = {
              schema_version: "3.0",
              id: plan_name,
              entry_node_id: "execution-kickoff",
            };

             const entryNode: DagNodeV3 = {
               id: "execution-kickoff",
               prompt: promptPath,
               enforcement: kickoffSpec.enforcement,
             };

            writeDagV3(planPath, metadata, [entryNode]);

            return `## init_dag: Created DAG "${plan_name}"\n\n` +
              `Plan directory: ${planDir}\n` +
              `Plan file: ${planPath}\n` +
              `Entry node: execution-kickoff`;
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            return `Error in init_dag: ${msg}`;
          }
        },
      }),

     add_node: tool({
         description: "Add a new node to a JSONL DAG (plan.jsonl, schema_version 3.0). Looks up the component type in the node library for its fixed enforcement array and prompt. Adds the node and appends its ID to the parent's children array.",
         args: {
          plan_name: tool.schema.string().describe(
            "Name of the session plan (directory under .opencode/session-plans/)."
          ),
          parentId: tool.schema.string().describe(
            "ID of the existing node to attach the new node to."
          ),
          nodeId: tool.schema.string().describe(
            "ID for the new node. Must be unique across all existing node IDs."
          ),
          component_name: tool.schema.string().describe(
            "Component type name from the node library (e.g., 'work-item', 'research', 'plan-fail'). Use get_planning_components_catalogue() to see available types."
          ),
        },
        async execute({ plan_name, parentId, nodeId, component_name }, context) {
          try {
            const worktree = resolveWorktree(context);
            const planPath = path.join(worktree, '.opencode', 'session-plans', plan_name, 'plan.jsonl');

            if (!fs.existsSync(planPath)) {
              return `Error in add_node: plan.jsonl not found for "${plan_name}". Initialize with init_dag first.`;
            }

            const { metadata, nodes } = readDagV3(planPath);

            if (nodes.some(n => n.id === nodeId)) {
              return `Error in add_node: Node ID "${nodeId}" already exists in DAG.`;
            }

            const parent = nodes.find(n => n.id === parentId);
            if (!parent) {
              return `Error in add_node: Parent node "${parentId}" not found in DAG.`;
            }

            // Load component spec from the node library
            const nodeLibRelBase = path.join("planning", "plan-session", "node-library");
            const specPath = path.join(CONFIG_ROOT, nodeLibRelBase, component_name, "node-spec.json");
            if (!fs.existsSync(specPath)) {
              return `Error in add_node: Component "${component_name}" not found in node library at ${specPath}. Use get_planning_components_catalogue() to see available types.`;
            }
             const spec = JSON.parse(fs.readFileSync(specPath, "utf-8"));
             const sourcePromptPath = path.join(CONFIG_ROOT, nodeLibRelBase, component_name, "prompt.md");

            // Copy prompt.md to session prompts folder as {node_id}.md
            const sessionPromptsDir = path.join(worktree, '.opencode', 'session-plans', plan_name, 'prompts');
            fs.mkdirSync(sessionPromptsDir, { recursive: true });
            const destPromptPath = path.join(sessionPromptsDir, `${nodeId}.md`);
            fs.copyFileSync(sourcePromptPath, destPromptPath);

            // Store worktree-relative path in plan.jsonl
            const promptPath = path.join('.opencode', 'session-plans', plan_name, 'prompts', `${nodeId}.md`);

             const newNode: DagNodeV3 = {
               id: nodeId,
               prompt: promptPath,
               enforcement: spec.enforcement,
             };

            // Append to parent's children array
            if (!parent.children) parent.children = [];
            parent.children.push(nodeId);

            nodes.push(newNode);
            writeDagV3(planPath, metadata, nodes);

            const ascii = await renderMermaidASCII(dagToMermaidCompactV3(metadata, nodes), { colorMode: 'none' });
            return `## add_node: Added "${nodeId}" (${component_name}) to "${parentId}"\n\n` +
              `Node: ${nodeId}\n` +
              `Component: ${component_name}\n` +
              `Enforcement items: ${spec.enforcement.length}\n` +
              `Prompt: ${destPromptPath}\n\n` +
              `**DAG now contains ${nodes.length} nodes.**\n\n${ascii}`;
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
          "Session plan name or raw path to plan.jsonl."
        ),
        nodeId: tool.schema.string().describe(
          "ID of the node to delete. The node and its entire subtree are removed."
        ),
      },
        async execute({ target, nodeId }, context) {
         try {
           const worktree = resolveWorktree(context);
           const planPath = resolveDagPath(target, worktree);
           const { metadata, nodes } = readDagV3(planPath);

           if (nodeId === metadata.entry_node_id) {
             return `Error in delete_node: Cannot delete the entry node "${nodeId}". The entry node is required.`;
           }

           if (!nodes.some(n => n.id === nodeId)) {
             return `Error in delete_node: Node "${nodeId}" not found in DAG.`;
           }

           // Collect all node IDs reachable from nodeId (the subtree to remove)
           const toRemove = new Set<string>();
           const queue = [nodeId];
           while (queue.length > 0) {
             const id = queue.pop()!;
             if (toRemove.has(id)) continue;
             toRemove.add(id);
             const n = nodes.find(x => x.id === id);
             if (n?.children) queue.push(...n.children);
           }

           // Detach from parent: remove nodeId from any parent's children array
           for (const n of nodes) {
             if (n.children) {
               n.children = n.children.filter(c => !toRemove.has(c));
               if (n.children.length === 0) delete n.children;
             }
           }

           const remaining = nodes.filter(n => !toRemove.has(n.id));
           writeDagV3(planPath, metadata, remaining);

           // Remove prompt files from session prompts folder for all deleted nodes
           const planDir = path.dirname(planPath);
           const sessionPromptsDir = path.join(planDir, 'prompts');
           for (const removedId of toRemove) {
             const promptFile = path.join(sessionPromptsDir, `${removedId}.md`);
             if (fs.existsSync(promptFile)) {
               fs.unlinkSync(promptFile);
             }
           }

           const ascii = await renderMermaidASCII(dagToMermaidCompactV3(metadata, remaining), { colorMode: 'none' });
           return `## delete_node: Deleted "${nodeId}" and its subtree (${toRemove.size} node(s))\n\n${ascii}`;
         } catch (err) {
           const msg = err instanceof Error ? err.message : String(err);
           return `Error in delete_node: ${msg}`;
         }
       },
    }),

    modify_node: tool({
      description: "Change the parent of a node. Used to restructure the DAG without deleting surviving children. Prompt content is immutable — to change a node's prompt or enforcement sequence, delete it and add a new one.",
      args: {
        target: tool.schema.string().describe(
          "Session plan name or raw path to plan.jsonl."
        ),
        nodeId: tool.schema.string().describe(
          "ID of the node to reparent."
        ),
        new_parent_id: tool.schema.string().describe(
          "ID of the new parent node. Must already exist in the DAG."
        ),
      },
      async execute({ target, nodeId, new_parent_id }, context) {
        try {
          const worktree = resolveWorktree(context);
          const planPath = resolveDagPath(target, worktree);
          const { metadata, nodes } = readDagV3(planPath);

          if (nodeId === metadata.entry_node_id) {
            return `Error in modify_node: Cannot reparent the entry node "${nodeId}".`;
          }

          const node = nodes.find(n => n.id === nodeId);
          if (!node) {
            return `Error in modify_node: Node "${nodeId}" not found in DAG.`;
          }

          const newParent = nodes.find(n => n.id === new_parent_id);
          if (!newParent) {
            return `Error in modify_node: New parent node "${new_parent_id}" not found in DAG.`;
          }

          // Cycle detection: new_parent_id must not be a descendant of nodeId
          const descendants = new Set<string>();
          const queue = [nodeId];
          while (queue.length > 0) {
            const id = queue.pop()!;
            descendants.add(id);
            const n = nodes.find(x => x.id === id);
            if (n?.children) queue.push(...n.children);
          }
          if (descendants.has(new_parent_id)) {
            return `Error in modify_node: Reparenting "${nodeId}" to "${new_parent_id}" would create a cycle.`;
          }

          // Remove nodeId from old parent's children
          for (const n of nodes) {
            if (n.children) {
              const idx = n.children.indexOf(nodeId);
              if (idx !== -1) {
                n.children.splice(idx, 1);
                if (n.children.length === 0) delete n.children;
              }
            }
          }

          // Add nodeId to new parent's children
          if (!newParent.children) newParent.children = [];
          newParent.children.push(nodeId);

          writeDagV3(planPath, metadata, nodes);
          const ascii = await renderMermaidASCII(dagToMermaidCompactV3(metadata, nodes), { colorMode: 'none' });
          return `## modify_node: Reparented "${nodeId}" to "${new_parent_id}"\n\n${ascii}`;
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return `Error in modify_node: ${msg}`;
        }
       },
     }),

     get_planning_components_catalogue: tool({
       description:
         "Retrieve the planning components catalogue listing all available node types. Returns CATALOGUE.md text verbatim from the global node-library installation.",
       args: {},
         async execute(_args, _context) {
           try {
             const cataloguePath = path.join(CONFIG_ROOT, "planning", "plan-session", "node-library", "CATALOGUE.md");

            if (!fs.existsSync(cataloguePath)) {
              return `CATALOGUE.md not found at ${cataloguePath}. ` +
                `Ensure the planning components are installed correctly via OCX.`;
            }

            const catalogue = fs.readFileSync(cataloguePath, "utf-8");
            return catalogue;
         } catch (err) {
           const msg = err instanceof Error ? err.message : String(err);
           return `Error retrieving catalogue: ${msg}`;
         }
       },
     }),

     get_dag_design_guide: tool({
       description:
         "Retrieve the DAG design guide. Returns the guide verbatim from the global plan-session installation.",
       args: {},
        async execute(_args, _context) {
          try {
             const guidePath = path.join(CONFIG_ROOT, "planning", "plan-session", "dag-design-guide.md");

            if (!fs.existsSync(guidePath)) {
              return `dag-design-guide.md not found at ${guidePath}. ` +
                `Ensure the planning components are installed correctly via OCX.`;
            }

            const guide = fs.readFileSync(guidePath, "utf-8");
            return guide;
         } catch (err) {
           const msg = err instanceof Error ? err.message : String(err);
           return `Error retrieving DAG design guide: ${msg}`;
         }
       },
     }),
        },

    // ── Hooks ────────────────────────────────────────────────────────────────

    // Validate arguments for tools that small models frequently misuse.
    // This runs before OpenCode's own zod validation to produce a clear,
    // actionable error instead of a raw schema dump.
    "tool.execute.before": async (input, output) => {
      if (!input.tool || !input.sessionID) return;

      if (input.tool === "question") {
        const args = (output as any).args ?? {};
        const questions = args.questions;
        const errors: string[] = [];

        if (questions === undefined || questions === null) {
          errors.push(
            `  - "questions" is missing. Did you pass a single question object instead of wrapping it in a "questions" array?`
          );
        } else if (!Array.isArray(questions)) {
          errors.push(
            `  - "questions" must be an array but got ${typeof questions}. Wrap your question object(s) in an array: { "questions": [ ... ] }`
          );
        } else if (questions.length === 0) {
          errors.push(`  - "questions" array must not be empty.`);
        } else {
          questions.forEach((q: any, i: number) => {
            const prefix = `  - questions[${i}]`;
            if (typeof q !== "object" || q === null) {
              errors.push(`${prefix}: must be an object, got ${typeof q}`);
              return;
            }
            if (typeof q.question !== "string" || q.question.trim() === "") {
              errors.push(`${prefix}.question: required string (the full question text)`);
            }
            if (typeof q.header !== "string" || q.header.trim() === "") {
              errors.push(`${prefix}.header: required string (very short label, max 30 chars)`);
            } else if (q.header.length > 30) {
              errors.push(`${prefix}.header: must be ≤30 chars, got ${q.header.length} ("${q.header}")`);
            }
            if (!Array.isArray(q.options)) {
              errors.push(`${prefix}.options: required array of { label: string, description: string }`);
            } else if (q.options.length === 0) {
              errors.push(`${prefix}.options: must have at least one option`);
            } else {
              q.options.forEach((opt: any, j: number) => {
                if (typeof opt !== "object" || opt === null) {
                  errors.push(`${prefix}.options[${j}]: must be an object`);
                  return;
                }
                if (typeof opt.label !== "string" || opt.label.trim() === "") {
                  errors.push(`${prefix}.options[${j}].label: required string (1-5 words)`);
                }
                if (typeof opt.description !== "string" || opt.description.trim() === "") {
                  errors.push(`${prefix}.options[${j}].description: required string (explanation of this choice)`);
                }
              });
            }
            if (q.multiple !== undefined && typeof q.multiple !== "boolean") {
              errors.push(`${prefix}.multiple: must be boolean if provided, got ${typeof q.multiple}`);
            }
          });
        }

        if (errors.length > 0) {
          throw new Error(
            `[question] Invalid arguments:\n${errors.join("\n")}\n\n` +
            `Correct schema:\n` +
            `{\n` +
            `  "questions": [\n` +
            `    {\n` +
            `      "question": "Full question text?",\n` +
            `      "header": "Short label",          // max 30 chars\n` +
            `      "options": [\n` +
            `        { "label": "Option A", "description": "Explanation of A" },\n` +
            `        { "label": "Option B", "description": "Explanation of B" }\n` +
            `      ],\n` +
            `      "multiple": false                 // optional boolean\n` +
            `    }\n` +
            `  ]\n` +
            `}`
          );
        }
      }

      if (input.tool === "task") {
        const args = (output as any).args ?? {};
        const errors: string[] = [];

        if (typeof args.description !== "string" || args.description.trim() === "") {
          errors.push(`  - "description": required string (3-5 words describing the task, e.g. "Explore auth module")`);
        }
        if (typeof args.prompt !== "string" || args.prompt.trim() === "") {
          errors.push(`  - "prompt": required string (full task instructions for the subagent)`);
        }
        if (typeof args.subagent_type !== "string" || args.subagent_type.trim() === "") {
          errors.push(`  - "subagent_type": required string (the agent type to dispatch, e.g. "context-scout", "junior-dev")`);
        }
        if (args.task_id !== undefined && typeof args.task_id !== "string") {
          errors.push(`  - "task_id": must be a string if provided, got ${typeof args.task_id}`);
        }

        if (errors.length > 0) {
          throw new Error(
            `[task] Invalid arguments:\n${errors.join("\n")}\n\n` +
            `Correct schema:\n` +
            `{\n` +
            `  "description": "Short task label",   // 3-5 words\n` +
            `  "prompt": "Full instructions...",\n` +
            `  "subagent_type": "context-scout",    // agent type string\n` +
            `  "task_id": "..."                     // optional: resume prior session\n` +
            `}`
          );
        }
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
            `Call next_step to advance to the next node.`
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
             `Call ${expectedTool} first to continue.`
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

    // Inject continuation instructions into the system prompt when a DAG session is active.
    // These instructions condition the model before it begins generating, making them more
    // durable than inline tool-result suffixes for small models.
    "experimental.chat.system.transform": async (_input, output) => {
      if (!_dagActiveThisTurn) return;
      output.system.push(
        "[DAG_EXECUTOR_MODE] You are executing a DAG session. " +
        "After every tool result, call the next required tool immediately — do not generate prose between tool calls. " +
        "Do not stop to summarize findings or wait for user confirmation. " +
        "The only legitimate pause is the `question` tool, which requires a user answer before you can continue. " +
        "Once the user answers a question, call the next required tool immediately."
      );
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
