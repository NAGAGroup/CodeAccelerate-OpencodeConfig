import { type Plugin, tool } from "@opencode-ai/plugin";
import { loadConfig } from "../lib/utils";

/**
 * TodoplanPlugin - Provides todolist planning guidance for tech_lead
 * 
 * Returns guidance on how to structure todolists effectively before creating them.
 * Includes skill loading instructions and a 4-criteria checklist for planning.
 */
export const TodoplanPlugin: Plugin = async (ctx: any) => {
  const workingDirectory = ctx.worktree || ctx.directory;
  
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

            // Get config and required skills for tech_lead
            const config = await loadConfig(workingDirectory);
            const techLeadConfig = config.agent?.tech_lead || {};
            const requiredSkills = techLeadConfig.required_skills || [];

            // Build skill loading instructions
            const skillLoadingInstructions = requiredSkills
              .map((skill) => `skill({name: "${skill}"})`)
              .join("\n");

            // Build guidance message
            const guidance = `[Todolist Planning Guidance]

Before creating your todolist, load your required skills:

${skillLoadingInstructions}

---

## Planning Checklist

Use these 4 criteria to structure your todolist effectively:

1. [Delegation] - Are you delegating work to subagents?
   - Implementation → junior_dev
   - Testing/Verification → test_runner
   - Research/Analysis → explore or librarian
   - Shell commands → generic_runner
   
   Your todos should mention which agent handles each task.

2. [Parallelization] - Can independent tasks run in parallel?
   - If you have 2+ pending delegations to different agents
   - You can delegate to multiple agents in the same message
   - This is faster than sequential delegation
   
   Check if your todos can be reordered for parallel execution.

3. [Questions] - Do you need to ask the user anything?
   - Use the question tool for structured questions
   - Never ask questions in plain text
   - Ask before delegating if requirements are unclear
   
   Add a "Ask user" todo if you need clarification.

4. [Tool Usage] - Are you using the right tools?
   - Built-in tools: read, glob, grep, lsp (for analysis)
   - Delegation: task tool (after loading -task skill)
   - Coordination: question, skill, todowrite/todoread
   - Never use bash directly - delegate to generic_runner
   
   Verify your todos use proper tool delegation patterns.

---

## Next Steps

1. Review the 4 criteria above
2. Create your todolist with these patterns in mind
3. The guardrails plugin will provide reflection checkpoints
4. Follow the guidance to improve your delegation strategy

This is guidance, not enforcement. Use it to plan more effectively.`;

            return guidance;
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
