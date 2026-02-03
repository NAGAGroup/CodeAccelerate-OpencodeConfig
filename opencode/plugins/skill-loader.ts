import type { Plugin } from "@opencode-ai/plugin";
import { createConfigLoader } from "../lib/utils";

/**
 * SkillLoaderPlugin - Loads required skills for coordinator agents
 * 
 * Uses chat.message hook to inject skill loading instructions once per session.
 * Only applies to tech_lead and build agents.
 * 
 * Note: -task skills (explore-task, librarian-task, junior_dev-task, test_runner-task)
 * are delegation templates FOR coordinators to load when delegating, not for
 * subagents themselves. Subagents receive populated template_data directly.
 */
export const SkillLoaderPlugin: Plugin = async (ctx: any) => {
  const { client } = ctx;
  const worktree = ctx.worktree || ctx.directory;
  const injectedSessions = new Set<string>();
  const getConfig = createConfigLoader(worktree);

  return {
    "chat.message": async (input, output) => {
      // Get agent name from output.message context (guaranteed to exist)
      const agent = output.message?.agent;
      
      // Only inject for coordinator agents
      if (agent !== "tech_lead" && agent !== "build") return;

      // Get sessionID from input or output
      const sessionID = input.sessionID || output.sessionID;
      if (!sessionID) return;

      // Skip if this session already had skills injected
      if (injectedSessions.has(sessionID)) return;

      // Mark this session as injected
      injectedSessions.add(sessionID);

      const config = await getConfig();
      const skills = config.agent?.[agent]?.required_skills;
      if (!skills?.length) return;

      // Build instruction with all required skills
      const skillCalls = skills.map((s: string) => `skill({name: "${s}"})`).join('\n');
      
       // Build startup instruction
       const instruction = `[Session Initialization]

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

Once setup is complete, respond naturally to the user's request.`;

      // Inject instruction for this session
      // Uses synthetic: true so agent sees it but user doesn't (cleaner UX)
      try {
        await client.session.prompt({
          path: { id: sessionID },
          body: {
            noReply: true,  // Don't trigger AI response yet - just add to context
            parts: [
              { 
                type: "text", 
                text: instruction,
                synthetic: true  // Agent sees it, user doesn't
              }
            ],
          },
        });
      } catch (error) {
        // Silently fail - don't pollute TUI
      }
    },
    
    // Re-inject after compaction on session.idle
    event: async ({ event }) => {
      if (event.type === "session.idle") {
        const sessionID = event.properties.sessionID;
        
        // Fetch session messages to detect compaction
        let messagesResp;
        try {
          messagesResp = await client.session.messages({
            path: { id: sessionID }
          });
        } catch (error) {
          return; // Silently fail if can't fetch messages
        }
        
        const messages = (messagesResp.data ?? []) as Array<{
          info?: {
            agent?: string;
            model?: { providerID: string; modelID: string };
          };
        }>;
        
        // Walk backwards to detect compaction and find pre-compaction agent
        let hasCompactionMessage = false;
        let preCompactionAgent: string | undefined;
        
        for (let i = messages.length - 1; i >= 0; i--) {
          const info = messages[i].info;
          
          if (info?.agent === "compaction") {
            hasCompactionMessage = true;
            continue; // Skip compaction message, keep looking
          }
          
          if (info?.agent) {
            preCompactionAgent = info.agent;
            break; // Found the agent that was active before compaction
          }
        }
        
        // Only proceed if compaction occurred for coordinator agents
        if (!hasCompactionMessage) return;
        if (preCompactionAgent !== "tech_lead" && preCompactionAgent !== "build") return;
        
         // Clear session from injected tracking - treat as brand new session
         injectedSessions.delete(sessionID);
        
        const config = await getConfig();
        const skills = config.agent?.[preCompactionAgent]?.required_skills;
        if (!skills?.length) return;
        
        const skillCalls = skills.map((s: string) => `skill({name: "${s}"})`).join('\n');
        
        const instruction = `[Session Re-initialization After Compaction]

The session was recently compacted. Re-initialize:

1. Load your required skills:
${skillCalls}

2. Call todoplan() to review todolist guidance

3. Create a new todolist for continuing work

Your previous context has been summarized. Continue with full agent capabilities.`;
        
        // Inject instruction and trigger immediate response
        try {
          await client.session.prompt({
            path: { id: sessionID },
            body: {
              agent: preCompactionAgent, // Preserve agent context
              parts: [
                { 
                  type: "text", 
                  text: instruction,
                  synthetic: true
                }
              ],
            },
          });
        } catch (error) {
          // Silently fail - don't pollute TUI
        }
      }
    },
  };
};
