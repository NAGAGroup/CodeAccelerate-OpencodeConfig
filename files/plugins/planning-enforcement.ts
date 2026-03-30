import { tool } from "@opencode-ai/plugin";
import type { Plugin } from "@opencode-ai/plugin";
import * as fs from "fs";
import * as path from "path";

// The config root is the directory that contains this plugin's parent folder.
// When installed via OCX the layout is:
//   {install_root}/plugins/planning-enforcement.js  ← this file
//   {install_root}/planning/plan-generic/plan.json  ← DAG files
// So CONFIG_ROOT = dirname of this file's directory = {install_root}.
const CONFIG_ROOT = path.dirname(import.meta.dirname);

// Primary agent name — only this agent's tool calls are tracked/enforced.
const PRIMARY_AGENT = "headwrench";

// Tools that bypass DAG blocking, regardless of current node's todos
const exemptTools = ["plan_session", "activate_plan", "next_step", "recover_context", "question", "exit_plan", "validate_dag", "compress"];

// ─── Types ───────────────────────────────────────────────────────────────────

interface DagNode {
  id: string;
  prompt: string;
  todo: string[];
  next?: DagNode | BranchOption[];
}

interface BranchOption {
  when: string;
  node: DagNode;
}

interface PlanDag {
  schema_version: "2.0";
  id: string;
  entry: DagNode;
}

// Flattened representation for O(1) lookup during execution.
interface FlatNode {
  id: string;
  prompt: string;
  todo: string[];
  nextLinear?: string; // id of single child (linear)
  branches?: Array<{ when: string; nodeId: string }>; // branching children
  // undefined nextLinear + undefined branches = terminal
}

interface DecisionEntry {
  node_id: string;
  timestamp: string;
  summary: string;
}

interface DagSessionState {
  dag_id: string;
  plan_path: string; // absolute path to local plan.json
  status: "running" | "waiting_step" | "complete" | "abandoned";
  current_node: string;
  todo_index: number; // how many todo items have been completed for current node
  started_at: string;
  updated_at: string;
  decisions: DecisionEntry[];
  node_map: Record<string, FlatNode>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function dagStatePath(worktree: string, sessionId: string): string {
  return path.join(worktree, ".opencode", "dag-state", `${sessionId}.json`);
}

function writeState(statePath: string, state: DagSessionState): void {
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2), "utf-8");
}

function readState(statePath: string): DagSessionState | null {
  if (!fs.existsSync(statePath)) return null;
  return JSON.parse(fs.readFileSync(statePath, "utf-8")) as DagSessionState;
}

function now(): string {
  return new Date().toISOString();
}

function expandPath(p: string): string {
  if (p.startsWith("~/")) {
    const home = process.env.HOME || process.env.USERPROFILE || "";
    return path.join(home, p.slice(2));
  }
  return p;
}

function readPrompt(promptPath: string, worktree: string): string {
  const expanded = expandPath(promptPath);
  if (path.isAbsolute(expanded)) {
    return fs.readFileSync(expanded, "utf-8");
  }
  return fs.readFileSync(path.join(worktree, expanded), "utf-8");
}

// ─── Tree flattening ─────────────────────────────────────────────────────────

function flattenTree(node: DagNode, map: Record<string, FlatNode> = {}): Record<string, FlatNode> {
  // Detect duplicate node IDs — DAG nodes must be unique. A loop-back or shared
  // node silently overwrites the first entry and corrupts the node_map, causing
  // autoAdvance to treat a non-terminal node as terminal.
  if (map[node.id]) {
    throw new Error(
      `DAG validation error: duplicate node id "${node.id}". ` +
      `Each node must have a unique id. Use "-2", "-3" suffixes for repeated nodes ` +
      `(e.g. "audit-agents-2" instead of reusing "audit-agents").`
    );
  }

  const flat: FlatNode = {
    id: node.id,
    prompt: node.prompt,
    todo: node.todo,
  };

  if (node.next === undefined || node.next === null) {
    // Terminal node
  } else if (Array.isArray(node.next)) {
    // Branching
    flat.branches = (node.next as BranchOption[]).map((b) => {
      flattenTree(b.node, map);
      return { when: b.when, nodeId: b.node.id };
    });
  } else {
    // Linear
    const child = node.next as DagNode;
    flat.nextLinear = child.id;
    flattenTree(child, map);
  }

  map[node.id] = flat;
  return map;
}

// ─── Prompt path rewriting ───────────────────────────────────────────────────

// Bare filenames (no "/") are rewritten to a worktree-relative path under prompts/.
function rewritePromptPaths(node: DagNode, prefix: string): void {
  if (!node.prompt.includes("/")) {
    node.prompt = `${prefix}${node.prompt}`;
  }
  if (Array.isArray(node.next)) {
    for (const branch of node.next as BranchOption[]) {
      rewritePromptPaths(branch.node, prefix);
    }
  } else if (node.next && typeof node.next === "object" && !Array.isArray(node.next)) {
    rewritePromptPaths(node.next as DagNode, prefix);
  }
}

// ─── Copy planning DAG to local ──────────────────────────────────────────────

function copyPlanningDag(
  planType: string,
  sessionId: string,
  worktree: string,
  configRoot: string = CONFIG_ROOT,
): { localPlanPath: string; dag: PlanDag } {
  const srcDir = path.join(configRoot, "planning", planType);
  const destDirName = `${planType}-${sessionId}`;
  const destDir = path.join(worktree, ".opencode", "session-plans", destDirName);
  const srcPromptsDir = path.join(srcDir, "prompts");
  const destPromptsDir = path.join(destDir, "prompts");

  fs.mkdirSync(destPromptsDir, { recursive: true });

  // Resolved session path used for placeholder substitution in prompt files
  const sessionPath = `.opencode/session-plans/${destDirName}`;

  // Helper: copy a directory recursively
  function copyDirRecursive(src: string, dest: string): void {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
      const srcEntry = path.join(src, entry.name);
      const destEntry = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        copyDirRecursive(srcEntry, destEntry);
      } else {
        fs.copyFileSync(srcEntry, destEntry);
      }
    }
  }

  // Helper: copy a prompt file with {{SESSION_PATH}} substitution
  function copyPromptFile(src: string, dest: string): void {
    const content = fs.readFileSync(src, "utf-8");
    fs.writeFileSync(dest, content.replaceAll("{{SESSION_PATH}}", sessionPath), "utf-8");
  }

  // Copy all prompt files (with substitution)
  if (fs.existsSync(srcPromptsDir)) {
    for (const file of fs.readdirSync(srcPromptsDir)) {
      copyPromptFile(path.join(srcPromptsDir, file), path.join(destPromptsDir, file));
    }
  }

  // Copy reference docs if present (with substitution)
  const refDir = path.join(configRoot, "planning", "reference");
  if (fs.existsSync(refDir)) {
    const destRefDir = path.join(destDir, "reference");
    fs.mkdirSync(destRefDir, { recursive: true });
    for (const file of fs.readdirSync(refDir)) {
      copyPromptFile(path.join(refDir, file), path.join(destRefDir, file));
    }
  }

  // Copy node-library if present (plain copy, no substitution needed)
  const srcNodeLibDir = path.join(srcDir, "node-library");
  if (fs.existsSync(srcNodeLibDir)) {
    copyDirRecursive(srcNodeLibDir, path.join(destDir, "node-library"));
  }

  // Read and rewrite DAG prompt paths
  const srcPlanPath = path.join(srcDir, "plan.json");
  const dag: PlanDag = JSON.parse(fs.readFileSync(srcPlanPath, "utf-8"));
  const localPrefix = `.opencode/session-plans/${destDirName}/prompts/`;
  rewritePromptPaths(dag.entry, localPrefix);

  const localPlanPath = path.join(destDir, "plan.json");
  fs.writeFileSync(localPlanPath, JSON.stringify(dag, null, 2), "utf-8");

  return { localPlanPath, dag };
}

// ─── Activation ──────────────────────────────────────────────────────────────

function activateDag(
  dag: PlanDag,
  planPath: string,
  sessionId: string,
  worktree: string,
): string {
  const nodeMap = flattenTree(dag.entry);
  const entryNode = nodeMap[dag.entry.id];
  if (!entryNode) {
    return `Error: entry node "${dag.entry.id}" not found in DAG "${dag.id}"`;
  }

  const statePath = dagStatePath(worktree, sessionId);
  const state: DagSessionState = {
    dag_id: dag.id,
    plan_path: planPath,
    status: "running",
    current_node: dag.entry.id,
    todo_index: 0,
    started_at: now(),
    updated_at: now(),
    decisions: [],
    node_map: nodeMap,
  };
  writeState(statePath, state);

  const promptText = readPrompt(entryNode.prompt, worktree);
  let result = `DAG "${dag.id}" activated. Starting at node: ${dag.entry.id}.\n\n---\n\n${promptText}`;

   // If entry node has empty todo, set waiting_step status and ask for next_step
   if (entryNode.todo.length === 0) {
     const hasNext = entryNode.nextLinear || (entryNode.branches && entryNode.branches.length > 0);
     if (hasNext) {
       state.status = "waiting_step";
       writeState(statePath, state);
       result += `\n\n---\n\nNo todos for this node. When you're ready, call \`next_step()\` to advance.`;
    } else {
      // Terminal node with no todos
      const advanceResult = autoAdvance(state, statePath, worktree);
      if (advanceResult) {
        result += `\n\n---\n\n${advanceResult}`;
      }
    }
  }

  return result;
}

// ─── Auto-advance logic ──────────────────────────────────────────────────────

function autoAdvance(
  state: DagSessionState,
  statePath: string,
  worktree: string,
): string | null {
  const node = state.node_map[state.current_node];
  if (!node) return null;

   // Linear next — do NOT auto-advance; require explicit next_step()
   if (node.nextLinear) {
     state.status = "waiting_step";
     state.updated_at = now();
     writeState(statePath, state);

     return `All todos complete. When you're ready, call \`next_step()\` to advance to the next node.`;
  }

  // Branching — present choices and require next_step()
  if (node.branches && node.branches.length > 0) {
    state.status = "waiting_step";
    state.updated_at = now();
    writeState(statePath, state);

     const choices = node.branches
       .map((b, i) => `${i + 1}. **${b.nodeId}** — ${b.when}`)
       .join("\n");

     return `All todos complete. Choose next path:\n\n${choices}\n\nWhen you're ready, call \`next_step({ next: "<node-id>" })\` to continue.`;
  }

  // Terminal — close session
  state.status = "complete";
  state.updated_at = now();
  writeState(statePath, state);

   return `Node "${node.id}" complete. DAG session "${state.dag_id}" finished.\n\n` +
     `---\n\n` +
     `**PLANNING SESSION COMPLETE.** Do NOT continue executing tasks. ` +
     `Present a summary of what was produced to the user. ` +
     `If a project DAG was written, tell the user they can activate it with \`/activate-plan {plan-name}\`.`;
}

// ─── Plugin ──────────────────────────────────────────────────────────────────

function ensureOpenCodeIgnore(worktree: string): void {
  try {
    const ignorePath = path.join(worktree, ".opencodeignore");
    const patterns = ["!.opencode/", "!.opencode/**"];
    if (fs.existsSync(ignorePath)) {
      const content = fs.readFileSync(ignorePath, "utf-8");
      const lines = content.split('\n').map(l => l.trim());
      for (const pattern of patterns) {
        if (!lines.includes(pattern)) {
          fs.appendFileSync(ignorePath, `${pattern}\n`);
        }
      }
    } else {
      fs.writeFileSync(ignorePath, `${patterns.join('\n')}\n`);
    }
  } catch {
    // Non-fatal: silently continue if .opencodeignore cannot be written
  }
}

export const PlanningEnforcementPlugin: Plugin = async (_ctx) => {
  // Track blocked calls so the after hook can override their output.
  const blockedCalls = new Map<string, { expected: string; actual: string }>();

  // Helper to resolve worktree with fallback to cwd
  const resolveWorktree = (ctx: { worktree?: string }) => ctx.worktree || process.cwd();

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
            return `Cannot call next_step — current status is "${state.status}", not "waiting_step".`;
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
                 result += `\n\n---\n\nNo todos for this node. When you're ready, call \`next_step()\` to advance.`;
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
                 result += `\n\n---\n\nNo todos for this node. When you're ready, call \`next_step()\` to advance.`;
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
              result += `\nAll todos complete. When you're ready, call \`next_step({ next: "<node-id>" })\` to choose a branch.\n`;
            } else if (state.status === "waiting_step") {
              if (currentNode?.nextLinear) {
                result += `\nAll todos complete. When you're ready, call \`next_step()\` to advance to the next node.\n`;
              } else {
                result += `\nNo todos for this node. When you're ready, call \`next_step()\` to advance.\n`;
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
             return `DAG session "${state.dag_id}" is already abandoned.`;
           }

           state.status = "abandoned";
           state.updated_at = now();
           writeState(statePath, state);

            return `DAG session "${state.dag_id}" has been abandoned. ` +
              `State saved at ${statePath}. ` +
              `You can start a new session with plan_session() or activate_plan().`;
         },
       }),

       validate_dag: tool({
         description:
           "Validate a project DAG plan.json file. Performs 6 checks: schema validity, duplicate node IDs, prompt file existence, todo sections, question tool phrases, and template patterns. Returns a formatted report.",
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
             let nodeCheckCount = 0;
             let checksPassedCount = 0;

             // Check 1: schema_version and entry field
             if (dag.schema_version !== "2.0") {
               issues.push(`- [schema] check-schema: schema_version is "${dag.schema_version}", expected "2.0"`);
             } else {
               checksPassedCount++;
             }
             nodeCheckCount++;

             if (!dag.entry) {
               issues.push(`- [entry] check-entry: entry field is missing`);
             } else {
               checksPassedCount++;
             }
             nodeCheckCount++;

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
             nodeCheckCount++;

              const promptsDir = path.join(
                resolveWorktree(context),
                ".opencode",
                "session-plans",
                plan_name,
                "prompts",
              );

             // Check 3, 4, 5, 6: For each node, validate prompt file
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
               nodeCheckCount++;

               // Read prompt file if it exists
               let promptContent = "";
               if (fs.existsSync(fullPromptPath)) {
                 try {
                   promptContent = fs.readFileSync(fullPromptPath, "utf-8");
                 } catch {
                   // Already counted above, skip
                 }
               }

               if (promptContent) {
                 // Check 4: If todo is non-empty, prompt must contain "## Todo" section
                 if (node.todo && node.todo.length > 0) {
                   if (!promptContent.includes("## Todo")) {
                     issues.push(`- [${node.id}] check-todo-section: todo array is non-empty but prompt has no "## Todo" section`);
                   } else {
                     checksPassedCount++;
                   }
                   nodeCheckCount++;

                   // Check 5: If "question" is in todo[], prompt must contain "question tool" phrase
                   if (node.todo.includes("question")) {
                     const hasQuestionPhrase = promptContent.toLowerCase().includes("question tool");
                     if (!hasQuestionPhrase) {
                       issues.push(`- [${node.id}] check-question-phrase: todo contains "question" but prompt does not mention "question tool"`);
                     } else {
                       checksPassedCount++;
                     }
                     nodeCheckCount++;
                   }
                 }

                 // Check 6: No {{ placeholder patterns in prompt file
                 if (promptContent.includes("{{")) {
                   issues.push(`- [${node.id}] check-no-placeholders: prompt contains "{{" placeholder patterns that should be resolved`);
                 } else {
                   checksPassedCount++;
                 }
                 nodeCheckCount++;
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
     },

    // ── Hooks ────────────────────────────────────────────────────────────────

    // Block tool calls that don't match the expected todo item.
    "tool.execute.before": async (input, output) => {
      if (!input.tool || !input.sessionID) return;

      if (exemptTools.includes(input.tool)) return;

      const worktree = resolveWorktree(_ctx);
      const statePath = dagStatePath(worktree, input.sessionID);
      const state = readState(statePath);

      if (!state || state.status !== "running") return;

      const node = state.node_map[state.current_node];
      if (!node || node.todo.length === 0) return;

      const expectedTool = node.todo[state.todo_index];
      if (!expectedTool) return;

      if (input.tool !== expectedTool) {
        // Corrupt args so the tool fails — then override output in after hook.
        blockedCalls.set(input.callID, { expected: expectedTool, actual: input.tool });
        output.args = { __dag_blocked: true };
      }
    },

    // Track tool calls and auto-advance when todos are exhausted.
    "tool.execute.after": async (input, output) => {
      if (!input.tool || !input.sessionID) return;

      // Check if this call was blocked by the before hook
      const blocked = blockedCalls.get(input.callID);
      if (blocked) {
        blockedCalls.delete(input.callID);
        output.output = `[DAG BLOCKED] Tool "${blocked.actual}" is not allowed at this step. ` +
          `Expected: "${blocked.expected}". Call "${blocked.expected}" to continue.\n\n` +
          `Current node: "${input.tool}" | Todo progress can be checked with recover_context().`;
        return;
      }

      // Exempt tools bypass blocking but still participate in todo tracking when
       // they appear as the currently expected todo item (e.g. "question" in todo[]).
       const worktree = resolveWorktree(_ctx);
       const statePath = dagStatePath(worktree, input.sessionID);
      const state = readState(statePath);

      if (!state || state.status !== "running") return;

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
