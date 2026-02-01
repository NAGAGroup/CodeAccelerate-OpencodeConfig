import { type Plugin, tool } from "@opencode-ai/plugin";
import * as fs from "fs/promises";
import * as path from "path";

const DESCRIPTION_TEMPLATE = `Launch a new agent to handle complex, multistep tasks autonomously using template-based instructions.

**IMPORTANT:** This tool uses skill templates. Before calling:
1. Load the skill file: skill({name: '<agent>-task'}) (e.g., skill({name: 'explore-task'}))
2. Review the required template_data fields
3. Call task with populated template_data

Available agent types and the tools they have access to:
{agents}

When NOT to use the Task tool:
- If you want to read a specific file path, use the Read or Glob tool instead of the Task tool, to find the match more quickly
- If you are searching for a specific class definition like "class Foo", use the Glob tool instead, to find the match more quickly
- If you are searching for code within a specific file or set of 2-3 files, use the Read tool instead of the Task tool, to find the match more quickly
- Other tasks that are not related to the agent descriptions above

Usage notes:
1. Launch multiple agents concurrently whenever possible, to maximize performance; to do that, use a single message with multiple tool uses
2. When the agent is done, it will return a single message back to you. The result returned by the agent is not visible to the user. To show the user the result, you should send a text message back to the user with a concise summary of the result.
3. Each agent invocation is stateless unless you provide a session_id. Your template_data should provide a highly detailed task description for the agent to perform autonomously and you should specify exactly what information the agent should return back to you in its final and only message to you.
4. The agent's outputs should generally be trusted
5. Clearly tell the agent whether you expect it to write code or just to do research (search, file reads, web fetches, etc.), since it is not aware of the user's intent
6. If the agent description mentions that it should be used proactively, then you should try your best to use it without the user having to ask for it first. Use your judgement.`;

// Track active task sessions and their metadata update callbacks
type TaskSession = {
  sessionId: string;
  parts: Record<
    string,
    { id: string; tool: string; state: { status: string; title?: string } }
  >;
  persistentTitle: string;
  updateMetadata: () => void;
};

// Store persistent titles by callID for hook retrieval
const persistentTitles = new Map<string, string>();

export const CustomTaskPlugin: Plugin = async ({ client, directory }) => {
  // Map of child sessionId -> task tracking info
  const activeTasks = new Map<string, TaskSession>();

  // Lazy config loading - fetch on first access, then cache
  let cachedConfig: any = null;

  async function getConfig() {
    if (cachedConfig) return cachedConfig;

    try {
      const configResponse = await client.config.get({ query: { directory } });
      if (configResponse.error) {
        console.warn("[delegate] Failed to load config:", configResponse.error);
        cachedConfig = { agent: {}, skills: {} };
      } else {
        cachedConfig = configResponse.data ?? { agent: {}, skills: {} };
      }
    } catch (error) {
      console.warn("[delegate] Exception loading config:", error);
      cachedConfig = { agent: {}, skills: {} };
    }

    return cachedConfig;
  }

  // Tool description uses placeholder - config loaded at execution time
  const toolDescription = DESCRIPTION_TEMPLATE.replace(
    "{agents}",
    "(agents loaded dynamically at execution time)",
  );

  /**
   * List all available task skills
   * Returns skill names from config-provided paths + defaults
   */
  async function listAvailableSkills(): Promise<string[]> {
    const config = await getConfig();
    const skills = new Set<string>();

    // Build list of paths to search (priority: Project → Custom → Global)
    const searchPaths = [
      path.join(directory, "skill"), // 1. Project skills
    ];

    // 2. Add custom skill paths from config
    if (config?.skills?.paths) {
      searchPaths.push(...config.skills.paths);
    }

    // 3. Global skills
    searchPaths.push(
      path.join(process.env.HOME || "", ".config", "opencode", "skill"),
    );

    // Scan all skill directories
    for (const skillPath of searchPaths) {
      try {
        const entries = await fs.readdir(skillPath);
        for (const entry of entries) {
          if (entry.endsWith("-task")) {
            skills.add(entry);
          }
        }
      } catch {
        // Directory doesn't exist - skip
      }
    }

    return Array.from(skills).sort();
  }

  /**
   * Find skill file for a given skill name
   * Searches in: Project → Custom (from config) → Global
   */
  async function findSkillFile(skillName: string): Promise<string | null> {
    const config = await getConfig();

    // Build list of paths to search (priority: Project → Custom → Global)
    const searchPaths = [
      path.join(directory, "skill", skillName, "SKILL.md"), // 1. Project
    ];

    // 2. Add custom skill paths from config
    if (config?.skills?.paths) {
      for (const customPath of config.skills.paths) {
        searchPaths.push(path.join(customPath, skillName, "SKILL.md"));
      }
    }

    // 3. Global
    searchPaths.push(
      path.join(
        process.env.HOME || "",
        ".config",
        "opencode",
        "skill",
        skillName,
        "SKILL.md",
      ),
    );

    // Search all paths
    for (const skillPath of searchPaths) {
      try {
        await fs.access(skillPath);
        return skillPath;
      } catch {
        // Not found, continue searching
      }
    }

    return null;
  }

  /**
   * Extract Jinja2 template from skill file
   * Looks for content between ```jinja2 and ``` markers
   */
  async function extractTemplate(skillFilePath: string): Promise<string> {
    const content = await fs.readFile(skillFilePath, "utf-8");

    // Find template block between ```jinja2 and ```
    const templateMatch = content.match(/```jinja2\s*\n([\s\S]*?)\n```/);
    if (!templateMatch) {
      throw new Error(
        `No Jinja2 template found in ${skillFilePath}. Expected \`\`\`jinja2 block.`,
      );
    }

    return templateMatch[1].trim();
  }

  /**
   * Parse template to extract required and optional fields
   */
  function parseTemplateFields(template: string): {
    required: string[];
    optional: string[];
  } {
    const required = new Set<string>();
    const optional = new Set<string>();

    // Match all {{variable|filter}} patterns
    const varRegex = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\|?\s*([a-zA-Z_]*)/g;
    let match;

    while ((match = varRegex.exec(template)) !== null) {
      const varName = match[1];
      const filter = match[2];

      if (filter === "required") {
        required.add(varName);
      } else if (filter === "optional") {
        optional.add(varName);
      } else if (!filter) {
        // No filter specified - assume required
        required.add(varName);
      }
    }

    return {
      required: Array.from(required),
      optional: Array.from(optional),
    };
  }

  /**
   * Validate template data against template requirements
   */
  function validateTemplateData(
    template: string,
    data: Record<string, any>,
  ): void {
    const { required, optional } = parseTemplateFields(template);

    // Check for missing required fields
    const missing = required.filter((field) => !(field in data));
    if (missing.length > 0) {
      throw new Error(
        `Missing required template fields: ${missing.join(", ")}\n` +
          `Required: ${required.join(", ")}\n` +
          `Provided: ${Object.keys(data).join(", ")}`,
      );
    }

    // Check for unknown fields
    const allFields = new Set([...required, ...optional]);
    const unknown = Object.keys(data).filter((key) => !allFields.has(key));
    if (unknown.length > 0) {
      throw new Error(
        `Unknown template fields: ${unknown.join(", ")}\n` +
          `Expected: ${[...allFields].join(", ")}`,
      );
    }
  }

  /**
   * Render template with data using nunjucks
   */
  async function renderTemplate(
    template: string,
    data: Record<string, any>,
  ): Promise<string> {
    // Lazy load nunjucks only when needed
    const nunjucks = await import("nunjucks");

    // Configure nunjucks with no autoescaping (we're generating prompts, not HTML)
    const env = nunjucks.configure({ autoescape: false });

    // Add custom filters
    env.addFilter("required", (val: any) => {
      if (val === undefined || val === null || val === "") {
        throw new Error("Required field is missing or empty");
      }
      return val;
    });

    env.addFilter("optional", (val: any, defaultVal = "") => {
      return val !== undefined && val !== null && val !== "" ? val : defaultVal;
    });

    env.addFilter("list", (val: any) => {
      if (!Array.isArray(val)) {
        throw new Error("Expected array for list filter");
      }
      return val.map((item, i) => `${i + 1}. ${item}`).join("\n");
    });

    env.addFilter("multiline", (val: any) => {
      if (Array.isArray(val)) {
        return val.join("\n");
      }
      return String(val);
    });

    // Render template
    return env.renderString(template, data);
  }

  return {
    // Event hook to receive real-time updates
    event: async ({ event }) => {
      // Handle tool part updates for tracked sessions
      if (event.type === "message.part.updated") {
        const part = event.properties.part;
        const task = activeTasks.get(part.sessionID);

        if (task && part.type === "tool") {
          const toolPart = part as {
            id: string;
            tool: string;
            state: { status: string; title?: string };
          };
          task.parts[toolPart.id] = {
            id: toolPart.id,
            tool: toolPart.tool,
            state: {
              status: toolPart.state.status,
              title:
                toolPart.state.status === "completed"
                  ? toolPart.state.title
                  : undefined,
            },
          };
          // Trigger metadata update in the tool
          task.updateMetadata();
        }
      }
    },

    // Hook to set persistent title after tool execution
    "tool.execute.after": async (input, output) => {
      if (input.tool === "task") {
        const storedTitle = persistentTitles.get(input.callID);
        
        if (storedTitle) {
          output.title = storedTitle;
          persistentTitles.delete(input.callID); // Clean up
        }
      }
    },

    tool: {
      task: tool({
        description: toolDescription,
        args: {
          description: tool.schema
            .string()
            .describe("A short (3-5 words) description of the task"),

          subagent_type: tool.schema
            .string()
            .describe("The type of specialized agent to use for this task"),

          template_data: tool.schema
            .record(tool.schema.string(), tool.schema.any())
            .refine((data) => Object.keys(data).length > 0, {
              message:
                "template_data cannot be empty - load skill file first to see required fields",
            })
            .describe(
              "REQUIRED non-empty object containing data for skill template. " +
                "Load skill file first using skill tool to understand required fields.",
            ),

          session_id: tool.schema
            .string()
            .describe("Existing Task session to continue")
            .optional(),

          command: tool.schema
            .string()
            .describe("The command that triggered this task")
            .optional(),
        },
        async execute(args, context) {
          // Fetch config and agents at execution time
          const config = await getConfig();
          const agentsResponse = await client.app.agents();
          const agentsData = agentsResponse.data ?? agentsResponse;
          const agents = Array.isArray(agentsData) ? agentsData : [];
          const subagents = agents.filter((a: any) => a.mode !== "primary");

          // Validate agent exists
          const agent = subagents.find(
            (a: any) => a.name === args.subagent_type,
          );
          if (!agent) {
            const availableAgents = subagents
              .map((a: any) => a.name)
              .join(", ");
            throw new Error(
              `Unknown agent type: ${args.subagent_type} is not a valid agent type. Available agents: ${availableAgents || "none"}`,
            );
          }

          // Generate consistent title format: "<Agent> Task"
          const formattedTitle = `${agent.name.charAt(0).toUpperCase()}${agent.name.slice(1)} Task`;

          // Store title for hook retrieval
          if (context.callID) {
            persistentTitles.set(context.callID, formattedTitle);
          }

          // Template processing: auto-derive skill name from subagent_type
          const skillName = `${args.subagent_type}-task`;
          const skillFile = await findSkillFile(skillName);

          if (!skillFile) {
            const available = await listAvailableSkills();
            throw new Error(
              `Skill '${skillName}' not found.\n` +
                (available.length > 0
                  ? `Available skills:\n  - ${available.join("\n  - ")}\n`
                  : `No task skills found.\n`) +
                `Searched in:\n` +
                `  - ${directory}/skill/\n` +
                (config?.skills?.paths
                  ? `  - ${config.skills.paths.join("\n  - ")}\n`
                  : "") +
                `  - ~/.config/opencode/skill/`,
            );
          }

          const template = await extractTemplate(skillFile);
          validateTemplateData(template, args.template_data);
          const renderedPrompt = await renderTemplate(
            template,
            args.template_data,
          );

          // Ask for permission before delegating
          await context.ask({
            permission: "task",
            patterns: [args.subagent_type],
            always: ["*"],
            metadata: {
              description: args.description,
              subagent_type: args.subagent_type,
            },
          });

          // Try to get existing session or create a new one
          let session: any;
          if (args.session_id) {
            try {
              const existingSession = await client.session.get({
                path: { id: args.session_id },
              });
              if (existingSession.data) {
                session = existingSession.data;
              }
            } catch {
              // Session not found, will create new one
            }
          }

          if (!session) {
            const newSession = await client.session.create({
              body: {
                parentID: context.sessionID,
                title: args.description + ` (@${agent.name} subagent)`,
              },
            });
            session = newSession.data;
          }

          if (!session) {
            throw new Error("Failed to create or retrieve session");
          }

          // Determine model to use
          const model = agent.model ?? undefined;

          // Register this task session for event tracking
          const taskSession: TaskSession = {
            sessionId: session.id,
            parts: {},
            persistentTitle: formattedTitle,
            updateMetadata: () => {
              context.metadata({
                title: taskSession.persistentTitle,
                metadata: {
                  summary: Object.values(taskSession.parts).sort((a, b) =>
                    a.id.localeCompare(b.id),
                  ),
                  sessionId: session.id,
                  model,
                },
              });
            },
          };
          activeTasks.set(session.id, taskSession);

          // Set up abort handling
          const handleAbort = () => {
            client.session.abort({ path: { id: session.id } });
            activeTasks.delete(session.id);
          };
          context.abort.addEventListener("abort", handleAbort);

          // Initial metadata
          context.metadata({
            title: formattedTitle,
            metadata: {
              sessionId: session.id,
              model,
            },
          });

          try {
            // Execute the prompt with RENDERED TEMPLATE
            const result = await client.session.prompt({
              path: { id: session.id },
              body: {
                agent: agent.name,
                parts: [{ type: "text", text: renderedPrompt }],
              },
            });

            // Small delay to let final events process
            await new Promise((resolve) => setTimeout(resolve, 100));

            // Get all messages from the session to build final summary
            const messagesResponse = await client.session.messages({
              path: { id: session.id },
            });
            const messages = messagesResponse.data ?? [];
            const summary = messages
              .filter((msg: any) => msg.info.role === "assistant")
              .flatMap((msg: any) =>
                (msg.parts ?? []).filter((p: any) => p.type === "tool"),
              )
              .map((part: any) => ({
                id: part.id,
                tool: part.tool,
                state: {
                  status: part.state.status,
                  title:
                    part.state.status === "completed"
                      ? part.state.title
                      : undefined,
                },
              }));

            // Extract text from result
            const resultParts = result.data?.parts ?? [];
            const text =
              resultParts.findLast((p: any) => p.type === "text")?.text ?? "";
            const output =
              text +
              "\n\n" +
              [
                "<task_metadata>",
                `session_id: ${session.id}`,
                "</task_metadata>",
              ].join("\n");

            // Final metadata update
            context.metadata({
              title: formattedTitle,
              metadata: {
                summary,
                sessionId: session.id,
                model,
              },
            });

            return output;
          } finally {
            // Clean up
            context.abort.removeEventListener("abort", handleAbort);
            activeTasks.delete(session.id);
            // Clean up persistent title if not already consumed by hook
            if (context.callID) {
              persistentTitles.delete(context.callID);
            }
          }
        },
      }),
    },
  };
};
