import type { Plugin } from "@opencode-ai/plugin";
import { tool } from "@opencode-ai/plugin";
import { createCompactionDetector } from "../lib/utils";

/**
 * WorkflowConstraintsPlugin - Enforces structured workflow steps for tech_lead
 *
 * Features:
 * 1. Two workflows: create-session-goal and execute-session-goal
 * 2. Five mandatory steps: memory → explore_initial → librarian → explore_specialized → questions
 * 3. Blocks read/glob/grep/edit/write/bash until all steps complete
 * 4. Provides skip_librarian and skip_questions tools
 * 5. Tracks workflow state per session with compaction cleanup
 */

// Workflow state tracking
interface WorkflowState {
  active: boolean;
  type: "create-session-goal" | "execute-session-goal" | null;
  steps: {
    memory: boolean;
    explore_initial: boolean;
    librarian: boolean;
    explore_specialized: boolean;
    questions: boolean;
  };
  exploreCallCount: number; // Track how many explore delegations
}

export const WorkflowConstraintsPlugin: Plugin = async ({ client }) => {
  // Track workflow state per session
  const workflowState = new Map<string, WorkflowState>();

  // Track current agent per session
  const sessionAgents = new Map<string, string>();

  // Helper: Inject reflection prompt that agent will see
  async function injectReflection(
    sessionID: string,
    message: string,
    agentName?: string,
  ) {
    try {
      await client.session.prompt({
        path: { id: sessionID },
        body: {
          noReply: true,
          ...(agentName ? { agent: agentName } : {}),
          parts: [
            {
              type: "text",
              text: message,
              synthetic: true,
            },
          ],
        },
      });
    } catch (error) {
      // Silently fail
    }
  }

  // Helper: Guide agent with synthetic prompt then block tool execution
  async function guideThenBlock(
    sessionID: string,
    guidance: string,
    agentName?: string,
  ) {
    await injectReflection(sessionID, guidance, agentName);
    throw new Error("Tool execution blocked by guardrail");
  }

  // Helper: Get workflow status message
  function getWorkflowStatusMessage(state: WorkflowState): string {
    const remaining: string[] = [];
    if (!state.steps.memory) remaining.push("- [1] Search/list memories");
    if (!state.steps.explore_initial) remaining.push("- [2] Delegate to explore (high-level understanding)");
    if (!state.steps.librarian) remaining.push("- [3] Delegate to librarian OR call skip_librarian");
    if (!state.steps.explore_specialized) remaining.push("- [4] Delegate to multiple explore agents (specialized analysis)");
    if (!state.steps.questions) remaining.push("- [5] Ask questions OR call skip_questions");

    return remaining.join("\n");
  }

  // Use shared compaction detection utility
  const createCompactionHandler = createCompactionDetector(client);

  return {
    // Track agent identity per session
    "chat.message": async (input, output) => {
      const sessionID = input.sessionID || output.message?.sessionID;
      const agent = output.message?.agent;

      // Skip internal OpenCode agents
      if (agent === "compaction") return;

      if (sessionID && agent) {
        sessionAgents.set(sessionID, agent);
      }
    },

    // Track workflow activation and step completion
    "tool.execute.after": async (input, output) => {
      const sessionID = input.sessionID;
      const agent = sessionAgents.get(sessionID);
      const tool = input.tool;

      // Only track for tech_lead
      if (agent !== "tech_lead") return;

      // Workflow activation via command tool
      if (tool === "command") {
        const command = output.metadata?.command || input.args?.command;
        if (command === "/workflow-create-session-goal" || command === "/workflow-execute-session-goal") {
          const workflowType = command === "/workflow-create-session-goal" 
            ? "create-session-goal" 
            : "execute-session-goal";

          workflowState.set(sessionID, {
            active: true,
            type: workflowType,
            steps: {
              memory: false,
              explore_initial: false,
              librarian: false,
              explore_specialized: false,
              questions: false,
            },
            exploreCallCount: 0,
          });
        }
      }

      // Skip if no active workflow
      const state = workflowState.get(sessionID);
      if (!state?.active) return;

      // Track step completion
      if (tool === "memory") {
        const mode = output.metadata?.mode || input.args?.mode;
        if (mode === "list" || mode === "search") {
          state.steps.memory = true;
        }
      }

      if (tool === "task") {
        const subagentType = output.metadata?.subagent_type || input.args?.subagent_type;
        if (subagentType === "explore") {
          state.exploreCallCount++;

          // First explore call is initial, subsequent are specialized
          if (state.exploreCallCount === 1) {
            state.steps.explore_initial = true;
          } else if (state.exploreCallCount >= 2) {
            state.steps.explore_specialized = true;
          }
        } else if (subagentType === "librarian") {
          state.steps.librarian = true;
        }
      }

      if (tool === "skip_librarian") {
        state.steps.librarian = true;
      }

      if (tool === "question") {
        state.steps.questions = true;
      }

      if (tool === "skip_questions") {
        state.steps.questions = true;
      }

      // Check if all steps complete - deactivate workflow
      const allComplete = Object.values(state.steps).every(s => s);
      if (allComplete) {
        state.active = false;
        // Inject success message
        injectReflection(
          sessionID,
          `[Workflow Steps Complete]

All mandatory workflow steps are now complete. You can now use:
- read/glob/grep for codebase analysis
- edit/write for markdown files
- bash for project management commands

Proceed with your workflow-specific tasks.`,
          agent
        );
      }
    },

    // Enforce workflow constraints before tool execution
    "tool.execute.before": async (input, output) => {
      const sessionID = input.sessionID;
      const tool = input.tool;
      const agent = sessionAgents.get(sessionID);

      // Only apply to tech_lead
      if (agent !== "tech_lead") return;

      // Skip if no active workflow
      const state = workflowState.get(sessionID);
      if (!state?.active) return;

      // Check if all steps complete
      const allStepsComplete = Object.values(state.steps).every(s => s);
      if (allStepsComplete) return; // Allow all tools

      // Tools that are ALWAYS allowed during workflow
      const alwaysAllowed = [
        "memory",
        "task",
        "skill",
        "question",
        "skip_librarian",
        "skip_questions",
        "todowrite",
        "todoread",
        "todoplan",
      ];

      // Allow mermaid tools (for visualization/planning)
      if (tool.startsWith("mermaid_")) return;

      // Allow always-allowed tools
      if (alwaysAllowed.includes(tool)) return;

      // Block restricted tools until workflow complete
      const blockedTools = ["read", "glob", "grep", "edit", "write", "bash", "lsp"];
      
      if (blockedTools.includes(tool)) {
        const remaining = getWorkflowStatusMessage(state);
        const workflowName = state.type === "create-session-goal" 
          ? "Create Session Goal" 
          : "Execute Session Goal";

        await guideThenBlock(
          sessionID,
          `[Workflow Required: ${workflowName}]

You must complete workflow steps 1-5 before using ${tool}.

Remaining steps:
${remaining}

Why this matters:
- Step 1 (memory): Understand historical context
- Step 2 (explore initial): Get high-level codebase overview
- Step 3 (librarian): Research external docs/APIs/best practices
- Step 4 (explore specialized): Deep dive into specific areas
- Step 5 (questions): Clarify ambiguities with user

Complete these steps first, then you can use ${tool}.`,
          agent
        );
      }
    },

    // Compaction cleanup
    event: createCompactionHandler(async (sessionID) => {
      workflowState.delete(sessionID);
    }),

    // Provide workflow tools
    tool: {
      skip_librarian: tool({
        description: "Skip librarian research step in workflow (step 3 of 5)",
        args: {
          reason: tool.schema
            .string()
            .describe("Why skipping librarian research (e.g., 'No external docs needed', 'Internal-only changes')"),
        },
        async execute(args, context) {
          const sessionID = context.sessionID;
          const state = workflowState.get(sessionID);

          if (!state?.active) {
            return JSON.stringify({
              success: false,
              error: "No active workflow. Use /workflow-create-session-goal or /workflow-execute-session-goal first.",
            }, null, 2);
          }

          // Mark librarian step complete
          state.steps.librarian = true;

          return JSON.stringify({
            success: true,
            message: "Librarian research step skipped",
            reason: args.reason,
            remaining_steps: Object.values(state.steps).filter(s => !s).length,
          }, null, 2);
        },
      }),

      skip_questions: tool({
        description: "Skip clarifying questions step in workflow (step 5 of 5)",
        args: {
          reason: tool.schema
            .string()
            .describe("Why no questions needed (e.g., 'Requirements are clear', 'User already specified approach')"),
        },
        async execute(args, context) {
          const sessionID = context.sessionID;
          const state = workflowState.get(sessionID);

          if (!state?.active) {
            return JSON.stringify({
              success: false,
              error: "No active workflow. Use /workflow-create-session-goal or /workflow-execute-session-goal first.",
            }, null, 2);
          }

          // Mark questions step complete
          state.steps.questions = true;

          return JSON.stringify({
            success: true,
            message: "Clarifying questions step skipped",
            reason: args.reason,
            remaining_steps: Object.values(state.steps).filter(s => !s).length,
          }, null, 2);
        },
      }),
    },
  };
};
