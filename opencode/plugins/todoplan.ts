import { type Plugin, tool } from "@opencode-ai/plugin";
import { loadConfig } from "../lib/utils";

/**
 * TodoplanPlugin - Provides todolist planning guidance for tech_lead
 *
 * Injects reflection prompt with guidance on how to structure todolists effectively.
 * Includes 4 planning criteria: Delegation, Parallelization, Questions, and Agent Reuse.
 */
export const TodoplanPlugin: Plugin = async (ctx: any) => {
  const workingDirectory = ctx.worktree || ctx.directory;
  const client = ctx.client;

  // Helper: Inject reflection prompt
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
          parts: [{ type: "text", text: message, synthetic: true }],
        },
      });
    } catch (error) {
      // Silently fail
    }
  }

  return {
    tool: {
      todoplan: tool({
        description:
          "Get todolist planning guidance before creating your todolist. Tech_lead must call this before todowrite/todoread.",
        args: {},
        async execute(args, context) {
          try {
            // Get session ID from context
            const sessionID = context.sessionID;
            if (!sessionID) {
              return JSON.stringify({
                success: false,
                error: "Unable to determine session ID",
              });
            }

            // Get agent from session - should be tech_lead
            const agent = context.agent;
            if (agent !== "tech_lead") {
              return JSON.stringify({
                success: false,
                error: `This tool is for tech_lead only. Current agent: ${agent}`,
              });
            }

            // Get config - no longer needed for skill loading
            // const config = await loadConfig(workingDirectory);

            // Build guidance message
            const guidance = `[Todolist Planning Guidance]

## Planning Checklist

Use these 4 criteria to structure your todolist effectively:

1. [Delegation] - Are you delegating work to subagents?
   - Implementation → junior_dev
   - Testing/Verification → test_runner
   - Research/Analysis → explore or librarian
   - Shell commands → general_runner
   
   Your todos should mention which agent handles each task.

2. [Parallelization] - Can independent tasks run in parallel?
   - If you have 2+ pending delegations to different agents
   - You can delegate to multiple agents in the same message
   - This is faster than sequential delegation
   
   Mark parallel todos with (Parallel) prefix in the todo content.
   Example: "(Parallel) Delegate to librarian for API research"

3. [Questions] - Do you need to ask the user anything?
   - Use the question tool for structured questions
   - Never ask questions in plain text
   - Ask before delegating if requirements are unclear
   
   Mark question todos with (Question Tool) prefix in the todo content.
   Example: "(Question Tool) Ask user about preferred authentication method"

4. [Agent Reuse] - Should you reuse an existing agent session?
   - Some tasks benefit from session reuse: multi-phase work, iterative refinement, continuing context
   - Some tasks benefit from fresh sessions: independent work, different contexts
   
   Mark reuse todos clearly with session_id reference in the todo content.
   Example: "Delegate to junior_dev for phase 2 (reuse session_id from phase 1)"

---

## Next Steps

1. Review the 4 criteria above
2. Create your todolist with these patterns in mind
3. Use prefixes (Parallel), (Question Tool), and session_id notes where appropriate
4. The guardrails plugin will provide reflection checkpoints

Given the above, summarize how it will affect your approach to the user before creating the todolist and continuing.`;

            // Inject guidance as reflection prompt
            await injectReflection(sessionID, guidance, agent);

            return "Todolist planning guidance provided. Review the checklist and create your todolist.";
          } catch (error: any) {
            return JSON.stringify({
              success: false,
              error: error.message || String(error),
            });
          }
        },
      }),
    },
  };
};
