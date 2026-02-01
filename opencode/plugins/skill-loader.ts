import { type Plugin } from "@opencode-ai/plugin";

/**
 * SkillLoaderPlugin - Auto-loads required skills for agents before their first message
 *
 * This plugin automatically loads skills that agents require, reducing manual setup.
 * It reads the opencode.json configuration file to discover which skills each agent needs,
 * then loads those skills before the agent receives its first user message.
 *
 * Configuration example in opencode.json:
 * ```json
 * {
 *   "agent": {
 *     "my_agent": {
 *       "mode": "subagent",
 *       "required_skills": ["explore-task", "librarian-task"]
 *     }
 *   }
 * }
 * ```
 *
 * Behavior:
 * - Tracks loaded sessions to avoid reloading skills for the same agent session
 * - Skips loading if no skills are required for the agent
 * - Loads all required skills concurrently using Promise.all
 * - Logs successful skill loads and warnings for failures
 * - Gracefully handles skill load failures (does not throw, allowing agent to proceed)
 * - Only processes messages from user role (skips assistant messages)
 */
export const SkillLoaderPlugin: Plugin = async ({ client, directory }) => {
  // Track which sessions have had their skills loaded to avoid reloading
  const loadedSessions = new Set<string>();

  // Lazy config loading - fetch on first access, then cache
  let cachedConfig: any = null;

  /**
   * Fetch and cache the opencode.json configuration
   * Returns empty agent/skills structure if loading fails
   */
  async function getConfig() {
    if (cachedConfig) return cachedConfig;

    try {
      const configResponse = await client.config.get({ query: { directory } });
      if (configResponse.error) {
        console.warn("[skill-loader] Failed to load config:", configResponse.error);
        cachedConfig = { agent: {}, skills: {} };
      } else {
        cachedConfig = configResponse.data ?? { agent: {}, skills: {} };
      }
    } catch (error) {
      console.warn("[skill-loader] Exception loading config:", error);
      cachedConfig = { agent: {}, skills: {} };
    }

    return cachedConfig;
  }

  /**
   * Get the required skills for an agent from config
   * @param agentName Name of the agent (e.g., "explore", "librarian")
   * @param config Configuration object
   * @returns Array of skill names, or empty array if none required
   */
  function getRequiredSkills(agentName: string, config: any): string[] {
    const agent = config?.agent?.[agentName];
    if (!agent) return [];
    return agent.required_skills ?? [];
  }

  /**
   * Load a single skill using the client API
   * @param sessionId Session ID for the skill load request
   * @param skillName Name of the skill to load (e.g., "explore-task")
   */
  async function loadSkill(sessionId: string, skillName: string): Promise<void> {
    await client.skill.load({
      body: {
        sessionID: sessionId,
        name: skillName,
      },
    });
  }

  return {
    /**
     * Hook that runs before each session message
     * Automatically loads required skills on the first user message
     */
    "session.message.before": async ({ session, message }) => {
      // Skip if not a user message
      if (message.info.role !== "user") {
        return;
      }

      // Skip if we've already loaded skills for this session
      if (loadedSessions.has(session.id)) {
        return;
      }

      // Mark this session as processed to avoid reloading
      loadedSessions.add(session.id);

      // Load config and get required skills for this agent
      const config = await getConfig();
      const requiredSkills = getRequiredSkills(session.agent?.name ?? "", config);

      // Skip if no skills required
      if (requiredSkills.length === 0) {
        return;
      }

      // Load all required skills concurrently
      const loadPromises = requiredSkills.map((skillName) =>
        loadSkill(session.id, skillName)
          .then(() => {
            console.log(`[skill-loader] Loaded skill: ${skillName} for agent ${session.agent?.name}`);
          })
          .catch((error) => {
            console.warn(
              `[skill-loader] Failed to load skill ${skillName} for agent ${session.agent?.name}:`,
              error,
            );
            // Continue gracefully - don't throw, let agent proceed without this skill
          }),
      );

       // Wait for all skill loads to complete
       await Promise.all(loadPromises);
     },
     /**
      * Hook that runs when a session ends
      * Cleans up the session from the tracking Set to prevent memory leaks
      */
     "session.end": async ({ session }) => {
       loadedSessions.delete(session.id);
       console.log(`[skill-loader] Cleaned up session: ${session.id}`);
     },
   };
 };
