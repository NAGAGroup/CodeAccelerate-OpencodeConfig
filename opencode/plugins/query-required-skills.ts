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
          
          const config = {
            agent: mergedAgents
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
