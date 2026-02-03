import type { Plugin } from "@opencode-ai/plugin";
import { createConfigLoader } from "../lib/utils";

/**
 * SkillLoaderPlugin - Loads required skills for coordinator agents
 */
export const SkillLoaderPlugin: Plugin = async (ctx: any) => {
  const { client } = ctx;
  const worktree = ctx.worktree || ctx.directory;
  const injectedSessions = new Set<string>();
  const compactedSessions = new Set<string>(); // Sessions that just completed compaction
  const getConfig = createConfigLoader(worktree);

  return {
    // HOOK 1: Fires BEFORE compaction starts
    "experimental.session.compacting": async (input, output) => {
      // input.sessionID is the correct field (output is for context/prompt injection)
      const sessionID = input.sessionID;
      if (!sessionID) return;

      // Mark session for re-initialization after compaction completes
      injectedSessions.delete(sessionID);
    },

    // HOOK 2: Bus event that fires AFTER compaction completes
    event: async ({ event }) => {
      if (event.type !== "session.compacted") return;

      const sessionID = event.properties.sessionID;
      if (!sessionID) return;

      // Mark that this session just completed compaction
      // The next message transform should inject init instructions
      compactedSessions.add(sessionID);
    },

    // HOOK 3: Fires before messages sent to LLM
    "experimental.chat.messages.transform": async (input, output) => {
      if (!output.messages.length) return;

      // Get sessionID from the first message's info
      const firstMsg = output.messages[0];
      const sessionID = (firstMsg?.info as any)?.sessionID;
      if (!sessionID) return;

      // Find the last user message to determine the target agent
      const lastUserMessage = [...output.messages]
        .reverse()
        .find((m) => m.info.role === "user");

      if (!lastUserMessage) return;

      // Get agent from the user message (this is where the agent assignment is)
      const agent = (lastUserMessage.info as any)?.agent;

      // Only inject for coordinator agents
      if (agent !== "tech_lead" && agent !== "build") return;

      // Check if this is first prompt OR just after compaction
      const needsInit =
        !injectedSessions.has(sessionID) || compactedSessions.has(sessionID);

      if (!needsInit) return;

      // Mark as injected and clear compaction flag
      injectedSessions.add(sessionID);
      compactedSessions.delete(sessionID);

      const config = await getConfig();
      const skills = config.agent?.[agent]?.required_skills;
      if (!skills?.length) return;

      // Build instruction with all required skills
      const skillCalls = skills
        .map((s: string) => `skill({name: "${s}"})`)
        .join("\n");

      // Build initialization instruction
      const instruction = `

[Session Initialization]

Before responding to the user, complete these setup steps IN ORDER:

1. Load your required skills:
${skillCalls}

2. Use these skills and explicitly summarize how you'll use them to perform the user's request:
   - What constraints do the skills define?
   - What delegation patterns should you follow?
   - What tools should you use vs delegate?
   - Create a brief mental model of your approach

3. Call todoplan() to get todolist planning guidance

4. Using the guidance, create your todolist with todowrite()

5. Summarize everything learned from the above steps to the user before proceeding with their request.`;

      // Append to the last text part of the last user message
      const lastTextPart = [...lastUserMessage.parts]
        .reverse()
        .find((p) => p.type === "text");

      if (lastTextPart && lastTextPart.type === "text") {
        lastTextPart.text += instruction;
      }
    },
  };
};
