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
    
    const result = {
      agent: {
        ...global?.agent,
        ...project?.agent,
      }
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
      const instruction = `Please load your required skills before responding:\n\n${skillCalls}`;

      // Inject instruction for this session
      try {
        await client.session.prompt({
          path: { id: sessionID },
          body: {
            noReply: true,
            parts: [{ type: "text", text: instruction }],
          },
        });
      } catch (error) {
        console.error('[skill-loader] Failed to inject skills:', error);
      }
    },
  };
};
