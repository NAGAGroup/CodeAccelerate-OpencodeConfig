import type { Plugin } from "@opencode-ai/plugin";
import { readFile } from "fs/promises";
import { join } from "path";
import { homedir } from "os";

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
export const SkillLoaderPlugin: Plugin = async ({ client, worktree }) => {
  const injectedSessions = new Set<string>();
  let cachedConfig: any = null;

  async function getConfig() {
    if (cachedConfig) return cachedConfig;
    
    const globalPath = join(homedir(), '.config', 'opencode', 'opencode.json');
    const projectPath = join(worktree, '.opencode', 'opencode.json');
    
    const readJson = async (path: string) => {
      try {
        return JSON.parse(await readFile(path, 'utf-8'));
      } catch {
        return null;
      }
    };

    const global = await readJson(globalPath);
    const project = await readJson(projectPath);
    
    // Deep merge agent configs with special handling for required_skills arrays
    const mergedAgents: any = {};
    const allAgents = new Set([
      ...Object.keys(global?.agent || {}),
      ...Object.keys(project?.agent || {})
    ]);
    
    for (const agentName of allAgents) {
      const globalAgent = global?.agent?.[agentName] || {};
      const projectAgent = project?.agent?.[agentName] || {};
      
      mergedAgents[agentName] = {
        ...globalAgent,
        ...projectAgent,
        // Merge required_skills arrays instead of replacing
        required_skills: [
          ...(globalAgent.required_skills || []),
          ...(projectAgent.required_skills || [])
        ].filter((skill, index, arr) => arr.indexOf(skill) === index) // Remove duplicates
      };
    }
    
    const result = {
      agent: mergedAgents
    };
    
    cachedConfig = result;
    return result;
  }

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

2. Create todolist immediately (required for all work):
   - For discussions/planning: Create single stub item like "Discuss approach with user"
   - For implementation: Break down the work into actionable steps
   - Even simple tasks need a todolist for progress tracking

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
  };
};
