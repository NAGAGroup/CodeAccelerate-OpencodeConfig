import { type Plugin, tool } from "@opencode-ai/plugin";
import { readFile } from "fs/promises";
import { join } from "path";
import { homedir } from "os";

/**
 * QueryRequiredSkillsPlugin - Provides a tool to query required skills for agents
 * 
 * Allows tech_lead to query which skills a subagent requires before delegating.
 */
export const QueryRequiredSkillsPlugin: Plugin = async ({ worktree }) => {
  return {
    tool: {
      query_required_skills: tool({
        description: "Query the required skills for a specific agent",
        args: {
          agent: tool.schema.string().describe("Agent name (e.g., 'junior_dev', 'test_runner', 'explore', 'librarian')"),
        },
        async execute(args) {
          // Read config inside execute, not at plugin registration
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
          
          const config = {
            agent: {
              ...global?.agent,
              ...project?.agent,
            }
          };
          
          const skills = config.agent?.[args.agent]?.required_skills || [];
          
          return JSON.stringify({
            agent: args.agent,
            required_skills: skills,
            count: skills.length,
          }, null, 2);
        },
      }),
    },
  };
};
