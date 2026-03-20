import { tool } from "@opencode-ai/plugin"
import type { Plugin } from "@opencode-ai/plugin"
import * as fs from "fs"
import * as path from "path"

// ─── Types ───────────────────────────────────────────────────────────────────

interface DagNode {
  id: string
  type: "agent" | "gate"
  prompt: string
  next?: string | string[]
  remaining_visits?: number
}

interface PlanDag {
  schema_version: "1.0"
  id: string
  session_type: string
  description?: string
  goal?: string
  entry: string
  nodes: Record<string, DagNode>
}

interface DagSessionState {
  dag_id: string
  plan_path: string  // absolute path to plan.json — set at activation, used by next_step
  status: "running" | "waiting_gate" | "complete" | "failed"
  current_node: string
  started_at: string
  updated_at: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function dagStatePath(worktree: string, sessionId: string): string {
  return path.join(worktree, ".opencode", "dag-state", `${sessionId}.json`)
}

function readDag(dagPath: string): PlanDag {
  const content = fs.readFileSync(dagPath, "utf-8")
  return JSON.parse(content) as PlanDag
}

function readPrompt(promptPath: string, worktree: string): string {
  // Prompt paths in plan.json may be relative to worktree
  const resolved = path.isAbsolute(promptPath)
    ? promptPath
    : path.join(worktree, promptPath)
  return fs.readFileSync(resolved, "utf-8")
}

function writeState(statePath: string, state: DagSessionState): void {
  fs.mkdirSync(path.dirname(statePath), { recursive: true })
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2), "utf-8")
}

function readState(statePath: string): DagSessionState | null {
  if (!fs.existsSync(statePath)) return null
  return JSON.parse(fs.readFileSync(statePath, "utf-8")) as DagSessionState
}

function now(): string {
  return new Date().toISOString()
}

// ─── Plan activation (shared logic for plan_* and activate_plan) ──────────────

async function activateDag(
  dag: PlanDag,
  planPath: string,       // absolute path to plan.json — stored in state for next_step
  sessionId: string,
  worktree: string,
  client: any,
): Promise<string> {
  const entryNode = dag.nodes[dag.entry]
  if (!entryNode) {
    return `Error: entry node "${dag.entry}" not found in DAG "${dag.id}"`
  }

  const statePath = dagStatePath(worktree, sessionId)

  const state: DagSessionState = {
    dag_id: dag.id,
    plan_path: planPath,
    status: entryNode.type === "gate" ? "waiting_gate" : "running",
    current_node: dag.entry,
    started_at: now(),
    updated_at: now(),
  }
  writeState(statePath, state)

  // Inject first node prompt
  const promptText = readPrompt(entryNode.prompt, worktree)
  await client.session.prompt({
    path: { id: sessionId },
    body: {
      noReply: true,
      parts: [{ type: "text", text: promptText, synthetic: true }],
    },
  })

  return `DAG "${dag.id}" activated. Starting at node: ${dag.entry}. Status: ${state.status}.`
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export const PlanningEnforcementPlugin: Plugin = async (ctx) => {
  const { client } = ctx

  return {
    tool: {

      // ── plan_generic ──────────────────────────────────────────────────────
      plan_generic: tool({
        description:
          "Start a /plan-generic planning session. Reads the plan-generic DAG and activates the planning workflow for the current session.",
        args: {},
        async execute(_args, context) {
          const planPath = path.join(
            context.worktree,
            "opencode",
            "planning",
            "plan-generic",
            "plan.json",
          )
          try {
            const dag = readDag(planPath)
            return await activateDag(dag, planPath, context.sessionID, context.worktree, client)
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err)
            return `Error activating plan-generic: ${msg}`
          }
        },
      }),

      // ── plan_debug ────────────────────────────────────────────────────────
      plan_debug: tool({
        description:
          "Start a /plan-debug planning session. Reads the plan-debug DAG and activates the debug planning workflow for the current session.",
        args: {},
        async execute(_args, context) {
          const planPath = path.join(
            context.worktree,
            "opencode",
            "planning",
            "plan-debug",
            "plan.json",
          )
          try {
            const dag = readDag(planPath)
            return await activateDag(dag, planPath, context.sessionID, context.worktree, client)
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err)
            return `Error activating plan-debug: ${msg}`
          }
        },
      }),

      // ── plan_collaborative ────────────────────────────────────────────────
      plan_collaborative: tool({
        description:
          "Start a /plan-collaborative planning session. Reads the plan-collaborative DAG and activates the collaborative planning workflow for the current session.",
        args: {},
        async execute(_args, context) {
          const planPath = path.join(
            context.worktree,
            "opencode",
            "planning",
            "plan-collaborative",
            "plan.json",
          )
          try {
            const dag = readDag(planPath)
            return await activateDag(dag, planPath, context.sessionID, context.worktree, client)
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err)
            return `Error activating plan-collaborative: ${msg}`
          }
        },
      }),

      // ── activate_plan ─────────────────────────────────────────────────────
      activate_plan: tool({
        description:
          "Activate an execution plan produced by a planning session. Reads plan.json from the given session plan directory and starts execution at the entry node.",
        args: {
          plan_name: tool.schema
            .string()
            .describe(
              'Name of the session plan to activate (matches directory name under .opencode/session-plans/). Example: "my-feature-plan"',
            ),
        },
        async execute({ plan_name }, context) {
          const planPath = path.join(
            context.worktree,
            ".opencode",
            "session-plans",
            plan_name,
            "plan.json",
          )
          try {
            const dag = readDag(planPath)
            return await activateDag(dag, planPath, context.sessionID, context.worktree, client)
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err)
            return `Error activating plan "${plan_name}": ${msg}`
          }
        },
      }),

      // ── next_step ─────────────────────────────────────────────────────────
      next_step: tool({
        description:
          "Advance the current DAG session to the next node and inject that node's prompt. Call this when the current node's work is complete. If the current node has multiple possible next nodes, pass the chosen node ID via the 'next' argument.",
        args: {
          next: tool.schema
            .string()
            .optional()
            .describe(
              "The node ID to advance to. Required when the current node has multiple next options (array). Omit when there is only one next node.",
            ),
        },
        async execute({ next }, context) {
          const statePath = dagStatePath(context.worktree, context.sessionID)
          const state = readState(statePath)

          if (!state) {
            return "No active DAG session found for this session ID. Start a planning session first with plan_generic(), plan_debug(), or plan_collaborative()."
          }

          if (state.status === "complete" || state.status === "failed") {
            return `Session DAG is already in terminal state: ${state.status}.`
          }

          // Load the plan from the path stored at activation time.
          // state.plan_path is set by activateDag and is always an absolute path.
          // For collaborative/debug sessions the agent may have rewritten plan.json in-place
          // (that's fine — we always re-read from the same path).
          if (!fs.existsSync(state.plan_path)) {
            return `plan.json not found at stored path "${state.plan_path}". Cannot advance.`
          }
          const dag = readDag(state.plan_path)

          const currentNode = dag.nodes[state.current_node]
          if (!currentNode) {
            return `Current node "${state.current_node}" not found in DAG. DAG may have been modified.`
          }

          // Decrement remaining_visits if applicable
          if (typeof currentNode.remaining_visits === "number") {
            currentNode.remaining_visits -= 1
            if (currentNode.remaining_visits <= 0) {
              state.status = "failed"
              state.updated_at = now()
              writeState(statePath, state)
              return `Node "${state.current_node}" has exhausted its remaining_visits. DAG status set to "failed".`
            }
            // Write updated remaining_visits back to plan.json
            dag.nodes[state.current_node] = currentNode
            fs.writeFileSync(state.plan_path, JSON.stringify(dag, null, 2), "utf-8")
          }

          // Resolve next node
          let nextNodeId: string
          if (typeof currentNode.next === "string") {
            nextNodeId = currentNode.next
          } else if (Array.isArray(currentNode.next)) {
            if (!next) {
              return `Node "${state.current_node}" has multiple next options: [${currentNode.next.join(", ")}]. Call next_step with the 'next' argument specifying which node to advance to.`
            }
            if (!currentNode.next.includes(next)) {
              return `Invalid next node "${next}". Valid options for "${state.current_node}": [${currentNode.next.join(", ")}]`
            }
            nextNodeId = next
          } else {
            // Terminal node — no next
            state.status = "complete"
            state.updated_at = now()
            writeState(statePath, state)
            return `Node "${state.current_node}" is a terminal node (no next). DAG complete. Call close_session() to clean up.`
          }

          const nextNode = dag.nodes[nextNodeId]
          if (!nextNode) {
            return `Next node "${nextNodeId}" not found in DAG. DAG may be malformed.`
          }

          // Update state
          state.current_node = nextNodeId
          state.status = nextNode.type === "gate" ? "waiting_gate" : "running"
          state.updated_at = now()
          writeState(statePath, state)

          // Inject next node's prompt
          const promptText = readPrompt(nextNode.prompt, context.worktree)
          await client.session.prompt({
            path: { id: context.sessionID },
            body: {
              noReply: true,
              parts: [{ type: "text", text: promptText, synthetic: true }],
            },
          })

          return `Advanced to node "${nextNodeId}" (type: ${nextNode.type}). Status: ${state.status}.`
        },
      }),

      // ── close_session ─────────────────────────────────────────────────────
      close_session: tool({
        description:
          "Close the current DAG session. Marks the session as complete and removes the runtime dag-state file. Call this when all DAG work is finished.",
        args: {},
        async execute(_args, context) {
          const statePath = dagStatePath(context.worktree, context.sessionID)

          if (!fs.existsSync(statePath)) {
            return "No active DAG session found for this session. Nothing to close."
          }

          try {
            fs.unlinkSync(statePath)
            return "DAG session closed. State file removed."
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err)
            return `Error closing session: ${msg}`
          }
        },
      }),
    },
  }
}
