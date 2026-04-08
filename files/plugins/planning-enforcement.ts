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
import { dagToMermaidCompactV3, validateDagV3, flattenTreeV3 } from "./dag-tree";
import { copyPlanningDag } from "./dag-lifecycle";
import { ensureOpenCodeIgnore } from "./plugin-utils";
import { detectDivergence, suggestRecoveryActions } from "./divergence-detection";

export const PlanningEnforcementPlugin: Plugin = async (_ctx) => {
  const { client } = _ctx;
  
  // Helper to resolve worktree with fallback to cwd
  const resolveWorktree = (_ctx: { worktree?: string }) => process.cwd();

  // 500ms delay before prompt injection to prevent llamacpp hangs
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Shared prompt injection helper — always waits before injecting
  const injectPrompt = async (sessionID: string, text: string) => {
    await sleep(500);
    await client.session.prompt({
      path: { id: sessionID },
      body: {
        noReply: true,
        parts: [{ type: "text", text }]
      }
    });
  };

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
            if (!entryNode) throw new Error(`Entry node "${metadata.entry_node_id}" not found in DAG`);

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
            
            await injectPrompt(context.sessionID, promptText);

            if (entryNode.enforcement.length === 0) {
              const hasNext = entryNode.children && entryNode.children.length > 0;
              state.status = hasNext ? "waiting_step" : "complete";
              writeState(statePath, state);
            }

            const result = `DAG "${metadata.id}" activated. Your next task, "${metadata.entry_node_id}", will be presented in the following message.`;
            return result;
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            throw new Error(`Error activating plan-session: ${msg}`);
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
              throw new Error(`Entry node "${metadata.entry_node_id}" not found in DAG "${plan_name}"`);
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
            
            await injectPrompt(context.sessionID, promptText);

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
            throw new Error(`Error activating plan "${plan_name}": ${msg}`);
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
          if (!nextNode) throw new Error(`Next node "${nextId}" not found in DAG`);

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
          
          await injectPrompt(context.sessionID, promptText);

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
            const planPath = path.join(worktree, ".opencode", "session-plans", plan_name, "plan.jsonl");

            // readDagV3 throws if file not found or unparseable
            const { metadata, nodes } = readDagV3(planPath);

            // validateDagV3 throws on: duplicates, missing entry, broken refs, unreachable nodes, cycles
            validateDagV3(metadata, nodes);

            // Check prompt files exist (separate from structural validation)
            const promptsDir = path.join(worktree, ".opencode", "session-plans", plan_name, "prompts");
            const missingPrompts: string[] = [];
            for (const node of nodes) {
              const resolvedPrompt = node.prompt.includes("/")
                ? expandPath(node.prompt)
                : path.join(promptsDir, node.prompt);
              const fullPromptPath = path.isAbsolute(resolvedPrompt)
                ? resolvedPrompt
                : path.join(worktree, resolvedPrompt);
              if (!fs.existsSync(fullPromptPath)) {
                missingPrompts.push(`- [${node.id}] prompt file not found: ${node.prompt}`);
              }
            }

            if (missingPrompts.length > 0) {
              throw new Error(
                `validate_dag: ${missingPrompts.length} prompt file(s) missing:\n${missingPrompts.join("\n")}`
              );
            }

            return (
              `## validate_dag: ${plan_name} — All checks passed\n\n` +
              `**Nodes:** ${nodes.length} | **Entry:** ${metadata.entry_node_id}\n\n` +
              `Checks: schema, unique IDs, child refs, reachability, cycles, prompt files.`
            );
          },
        }),

    show_dag_jsonl: tool({
      description: "Display the raw JSONL content of a DAG plan file. Returns the plan.jsonl text so agents can read node IDs, enforcement arrays, and structure. Accepts a session plan name or a raw path to plan.jsonl. Throws on file-not-found or parse errors.",
      args: {
        target: tool.schema.string().describe(
          "Session plan name (under .opencode/session-plans/) or raw file path to plan.jsonl."
        ),
      },
      async execute({ target }, context) {
        const worktree = resolveWorktree(context);
        const planPath = resolveDagPath(target, worktree);
        const content = fs.readFileSync(planPath, "utf-8");
        return `## DAG JSONL: ${target}\n\n\`\`\`jsonl\n${content}\n\`\`\``;
      },
    }),

    get_dag_draft_diagram: tool({
      description: "Display an ASCII diagram of a DAG with sequential nodes collapsed into groups, ordered by BFS depth so leaf/terminal nodes appear at the bottom. Shows ALL nodes including orphans — orphaned nodes are marked [ORPHAN] with a warning header. Use this to visualize structure during design, including incomplete or invalid DAGs. Use present_dag_diagram to show the final validated diagram to the user.",
      args: {
        target: tool.schema.string().describe(
          "Session plan name (under .opencode/session-plans/) or raw file path to plan.jsonl."
        ),
      },
      async execute({ target }, context) {
        const worktree = resolveWorktree(context);
        const planPath = resolveDagPath(target, worktree);
        const { metadata, nodes } = readDagV3(planPath);
        const { mermaid, warnings } = dagToMermaidCompactV3(metadata, nodes);
        const ascii = await renderMermaidASCII(mermaid, { colorMode: "none" });
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
      description: "Validate a DAG and inject its ASCII diagram into the conversation as a system message for the user to review. Throws if the DAG has structural errors (unreachable nodes, cycles, broken refs). Use this for final review after design is complete.",
      args: {
        plan_name: tool.schema.string().describe(
          "Session plan name (under .opencode/session-plans/) or raw file path to plan.jsonl."
        ),
      },
      async execute({ plan_name }, toolCtx) {
        const worktree = resolveWorktree(toolCtx);
        const planPath = resolveDagPath(plan_name, worktree);
        const { metadata, nodes } = readDagV3(planPath);
        validateDagV3(metadata, nodes); // throws on any structural issue
        const { mermaid } = dagToMermaidCompactV3(metadata, nodes);
        const ascii = await renderMermaidASCII(mermaid, { colorMode: "none" });
        const diagramText = `## Session Plan: ${metadata.id}\n\n**Plan Name:** ${plan_name}\n\n${ascii}`;
        await injectPrompt(toolCtx.sessionID, diagramText);
        return "DAG diagram presented to user via prompt injection.";
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
        const worktree = resolveWorktree(context);
        const statePath = dagStatePath(worktree, context.sessionID);
        const state = readState(statePath);

        if (!state) {
          throw new Error("No active DAG session. choose_plan_name must be called during an active planning session.");
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

        const dedupeNote = confirmedName !== name.trim()
          ? ` (deduplicated from "${name.trim()}" — directory already existed)`
          : "";
        return `Plan name set to "${confirmedName}"${dedupeNote}. {{PLAN_NAME}} will be substituted in all subsequent planning prompts automatically.`;
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
          const worktree = resolveWorktree(context);
          const planDir = path.join(worktree, ".opencode", "session-plans", plan_name);
          const planPath = path.join(planDir, "plan.jsonl");

          if (fs.existsSync(planPath)) {
            throw new Error(`plan.jsonl already exists at ${planPath}. Use add_node to extend the existing DAG, or delete the file manually to start fresh.`);
          }

          const nodeLibRelBase = path.join("planning", "plan-session", "node-library");
          const kickoffSpecPath = path.join(CONFIG_ROOT, nodeLibRelBase, "execution-kickoff", "node-spec.json");
          if (!fs.existsSync(kickoffSpecPath)) {
            throw new Error(`execution-kickoff node-spec.json not found at ${kickoffSpecPath}.`);
          }
          const kickoffSpec = JSON.parse(fs.readFileSync(kickoffSpecPath, "utf-8"));
          const sourcePromptPath = path.join(CONFIG_ROOT, nodeLibRelBase, "execution-kickoff", "prompt.md");

          const sessionPromptsDir = path.join(planDir, "prompts");
          fs.mkdirSync(sessionPromptsDir, { recursive: true });
          const destPromptPath = path.join(sessionPromptsDir, "execution-kickoff.md");
          fs.copyFileSync(sourcePromptPath, destPromptPath);

          const promptPath = path.join(".opencode", "session-plans", plan_name, "prompts", "execution-kickoff.md");
          const metadata: DagMetadataV3 = { schema_version: "3.0", id: plan_name, entry_node_id: "execution-kickoff" };
          const entryNode: DagNodeV3 = { id: "execution-kickoff", prompt: promptPath, enforcement: kickoffSpec.enforcement };

          writeDagV3(planPath, metadata, [entryNode]);

          return (
            `## init_dag: Created DAG "${plan_name}"\n\n` +
            `Plan directory: ${planDir}\n` +
            `Plan file: ${planPath}\n` +
            `Entry node: execution-kickoff`
          );
        },
      }),

     add_node: tool({
         description: "Create a new node in the DAG without wiring it. Looks up the component type in the node library for its fixed enforcement array and prompt. Use add_child to wire it to a parent after creation.",
         args: {
          plan_name: tool.schema.string().describe(
            "Name of the session plan (directory under .opencode/session-plans/)."
          ),
          nodeId: tool.schema.string().describe(
            "ID for the new node. Must be unique across all existing node IDs."
          ),
          component_name: tool.schema.string().describe(
            "Component type name from the node library (e.g., 'work-item', 'research', 'plan-fail'). Use get_planning_components_catalogue() to see available types."
          ),
        },
        async execute({ plan_name, nodeId, component_name }, context) {
          const worktree = resolveWorktree(context);
          const planPath = path.join(worktree, ".opencode", "session-plans", plan_name, "plan.jsonl");

          if (!fs.existsSync(planPath)) {
            throw new Error(`plan.jsonl not found for "${plan_name}". Initialize with init_dag first.`);
          }

          const { metadata, nodes } = readDagV3(planPath);

          if (nodes.some((n) => n.id === nodeId)) {
            throw new Error(`Node ID "${nodeId}" already exists in DAG.`);
          }

          const nodeLibRelBase = path.join("planning", "plan-session", "node-library");
          const specPath = path.join(CONFIG_ROOT, nodeLibRelBase, component_name, "node-spec.json");
          if (!fs.existsSync(specPath)) {
            throw new Error(`Component "${component_name}" not found in node library. Use get_planning_components_catalogue() to see available types.`);
          }
          const spec = JSON.parse(fs.readFileSync(specPath, "utf-8"));
          const sourcePromptPath = path.join(CONFIG_ROOT, nodeLibRelBase, component_name, "prompt.md");

          const sessionPromptsDir = path.join(worktree, ".opencode", "session-plans", plan_name, "prompts");
          fs.mkdirSync(sessionPromptsDir, { recursive: true });
          const destPromptPath = path.join(sessionPromptsDir, `${nodeId}.md`);
          fs.copyFileSync(sourcePromptPath, destPromptPath);

          const promptPath = path.join(".opencode", "session-plans", plan_name, "prompts", `${nodeId}.md`);
          const newNode: DagNodeV3 = { id: nodeId, prompt: promptPath, enforcement: spec.enforcement };

          nodes.push(newNode);
          writeDagV3(planPath, metadata, nodes);

          return (
            `## add_node: Created "${nodeId}" (${component_name})\n\n` +
            `Node: ${nodeId}\n` +
            `Component: ${component_name}\n` +
            `Enforcement items: ${spec.enforcement.length}\n` +
            `Prompt: ${destPromptPath}\n\n` +
            `**DAG now contains ${nodes.length} nodes.**\n\n` +
            `Use add_child to wire this node to a parent.`
          );
        },
      }),

     add_child: tool({
       description: "Wire an edge from parentId to childId. Works whether childId is newly created or already exists elsewhere in the DAG (shared terminals like plan-fail and plan-success). Use this to connect any two nodes.",
       args: {
         plan_name: tool.schema.string().describe(
           "Name of the session plan (directory under .opencode/session-plans/)."
         ),
         parentId: tool.schema.string().describe(
           "ID of the parent node. Must already exist in the DAG."
         ),
         childId: tool.schema.string().describe(
           "ID of the child node. Must already exist in the DAG."
         ),
       },
       async execute({ plan_name, parentId, childId }, context) {
         const worktree = resolveWorktree(context);
         const planPath = path.join(worktree, ".opencode", "session-plans", plan_name, "plan.jsonl");
         const { metadata, nodes } = readDagV3(planPath);

         const parent = nodes.find((n) => n.id === parentId);
         if (!parent) throw new Error(`Parent node "${parentId}" not found in DAG.`);

         const child = nodes.find((n) => n.id === childId);
         if (!child) throw new Error(`Child node "${childId}" not found in DAG. Create it first with add_node.`);

         if (parent.children?.includes(childId)) {
           throw new Error(`"${childId}" is already a child of "${parentId}".`);
         }

         // Cycle detection: parentId must not be a descendant of childId
         const descendants = new Set<string>();
         const queue = [childId];
         while (queue.length > 0) {
           const id = queue.pop()!;
           descendants.add(id);
           const n = nodes.find((x) => x.id === id);
           if (n?.children) queue.push(...n.children);
         }
         if (descendants.has(parentId)) {
           throw new Error(`Adding "${childId}" as child of "${parentId}" would create a cycle.`);
         }

         if (!parent.children) parent.children = [];
         parent.children.push(childId);

         writeDagV3(planPath, metadata, nodes);
         return `## add_child: Wired "${parentId}" → "${childId}"\n\nCall get_dag_draft_diagram to visualize the current DAG diagram.`;
       },
     }),

    delete_node: tool({
      description: "Delete a node from the DAG and remove all edges to/from it. The node's children become orphaned — use add_child to reconnect them. Returns list of orphaned nodes.",
      args: {
        plan_name: tool.schema.string().describe(
          "Name of the session plan (directory under .opencode/session-plans/)."
        ),
        nodeId: tool.schema.string().describe(
          "ID of the node to delete. Its children will become orphaned."
        ),
      },
        async execute({ plan_name, nodeId }, context) {
          const worktree = resolveWorktree(context);
          const planPath = path.join(worktree, ".opencode", "session-plans", plan_name, "plan.jsonl");
          const { metadata, nodes } = readDagV3(planPath);

          if (nodeId === metadata.entry_node_id) {
            throw new Error(`Cannot delete the entry node "${nodeId}". The entry node is required.`);
          }

          const nodeToDelete = nodes.find((n) => n.id === nodeId);
          if (!nodeToDelete) throw new Error(`Node "${nodeId}" not found in DAG.`);

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

          const promptFile = path.join(path.dirname(planPath), "prompts", `${nodeId}.md`);
          if (fs.existsSync(promptFile)) fs.unlinkSync(promptFile);

          let result = `## delete_node: Deleted "${nodeId}"\n\n`;
          if (orphanedChildren.length > 0) {
            result += `**Orphaned nodes (need re-parenting):** ${orphanedChildren.join(", ")}\n`;
            result += `Use add_child to reconnect these nodes to a new parent.\n\n`;
          }
          result += `Call get_dag_draft_diagram to visualize the current DAG diagram.`;
          return result;
        },
    }),

    delete_child: tool({
      description: "Remove an edge between parentId and childId without deleting either node. Use this to disconnect a child from a parent when restructuring the DAG.",
      args: {
        plan_name: tool.schema.string().describe(
          "Name of the session plan (directory under .opencode/session-plans/)."
        ),
        parentId: tool.schema.string().describe(
          "ID of the parent node."
        ),
        childId: tool.schema.string().describe(
          "ID of the child node to disconnect from the parent."
        ),
      },
       async execute({ plan_name, parentId, childId }, context) {
         const worktree = resolveWorktree(context);
         const planPath = path.join(worktree, ".opencode", "session-plans", plan_name, "plan.jsonl");
         const { metadata, nodes } = readDagV3(planPath);

         const parent = nodes.find((n) => n.id === parentId);
         if (!parent) throw new Error(`Parent node "${parentId}" not found in DAG.`);

         if (!parent.children?.includes(childId)) {
           throw new Error(`"${childId}" is not a child of "${parentId}".`);
         }

         parent.children = parent.children.filter((id) => id !== childId);
         if (parent.children.length === 0) delete parent.children;

         writeDagV3(planPath, metadata, nodes);
         return (
           `## delete_child: Removed edge "${parentId}" → "${childId}"\n\n` +
           `Note: "${childId}" still exists in the DAG — use add_child to reconnect it if needed.\n\n` +
           `Call get_dag_draft_diagram to visualize the current DAG diagram.`
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
             "A short label for the task (3-5 words). Shown in the delegation UI. Example: 'Explore auth module'."
           ),
         prompt: tool.schema
           .string()
           .describe(
             "Full task instructions for the subagent. Be specific: include the goal, relevant context, constraints, and what to return. The subagent has no memory of the current conversation."
           ),
         subagent_type: tool.schema
           .string()
           .describe(
             "The agent type to dispatch. Available types: context-scout, context-insurgent, external-scout, junior-dev, documentation-expert, dag-designer, dag-reviewer, tailwrench, autonomous-agent."
           ),
         task_id: tool.schema
           .string()
           .optional()
           .describe(
             "Optional. Provide a task_id returned by a previous task call to resume that subagent session with its prior context intact."
           ),
       },
       async execute({ description, prompt, subagent_type, task_id }, _context) {
         // OpenCode intercepts this tool call by name and handles the actual delegation.
         // This implementation is a fallback only — it should not normally be reached.
         return (
           `[task] Dispatched "${description}" to @${subagent_type}.` +
           (task_id ? ` (resuming session ${task_id})` : "")
         );
       },
     }),

     get_planning_components_catalogue: tool({
       description:
         "Retrieve the planning components catalogue listing all available node types. Returns CATALOGUE.md text verbatim from the global node-library installation.",
       args: {},
       async execute(_args, _context) {
         const cataloguePath = path.join(CONFIG_ROOT, "planning", "plan-session", "node-library", "CATALOGUE.md");
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
