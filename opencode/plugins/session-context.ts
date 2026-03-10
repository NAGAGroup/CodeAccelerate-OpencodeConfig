import { tool } from "@opencode-ai/plugin/tool"
import type { Hooks, PluginInput } from "@opencode-ai/plugin"
import { mkdir, readFile, unlink, writeFile } from "fs/promises"
import { join } from "path"

let currentSessionID: string | undefined = undefined

export default async (_ctx: PluginInput): Promise<Hooks> => {
  return {
    "experimental.chat.system.transform": async (
      input: { sessionID?: string; model: unknown },
      output: { system: string[] },
    ) => {
      currentSessionID = input.sessionID

      const cwd = process.cwd()
      const sessionIDForPrompt = currentSessionID ?? "(unknown)"

      if (!currentSessionID) {
        output.system.push(`OpenCode Session ID: ${sessionIDForPrompt}`)
        return
      }

      try {
        const activeSessionPath = join(
          cwd,
          ".opencode",
          "session-ids",
          currentSessionID,
          "active-session.json"
        )
        const activeSessionRaw = await readFile(activeSessionPath, "utf-8")
        const parsed = JSON.parse(activeSessionRaw) as { sessionName?: string }
        const sessionName = parsed.sessionName

        if (!sessionName) {
          output.system.push(`OpenCode Session ID: ${currentSessionID}`)
          return
        }

        try {
          const specPath = join(cwd, ".opencode", "sessions", sessionName, "spec.json")
          const specContent = await readFile(specPath, "utf-8")

          output.system.push(
            `## Active Session State\n` +
              `OpenCode Session ID: ${currentSessionID}\n` +
              `Active Plan: ${sessionName}\n\n` +
              `\`\`\`json\n` +
              `${specContent}\n` +
              `\`\`\``
          )
          return
        } catch {
          output.system.push(`OpenCode Session ID: ${currentSessionID}`)
          return
        }
      } catch {
        output.system.push(`OpenCode Session ID: ${currentSessionID}`)
      }
    },

    tool: {
      activate_session: tool({
        description:
          "Activate a session plan for the current opencode session. Pass the session plan name (e.g. 'my-session-name'). The tool handles writing the metadata file.",
        args: {
          sessionName: tool.schema.string().describe("The name of the session plan to activate"),
        },
        execute: async ({ sessionName }) => {
          if (!currentSessionID) {
            return "Error: session ID not available (has a turn occurred yet?)"
          }

          try {
            const cwd = process.cwd()
            const sessionIDDir = join(cwd, ".opencode", "session-ids", currentSessionID)
            const activeSessionPath = join(sessionIDDir, "active-session.json")

            await mkdir(sessionIDDir, { recursive: true })
            await writeFile(activeSessionPath, JSON.stringify({ sessionName }), "utf-8")

            return `Activated session plan '${sessionName}' for opencode session ${currentSessionID}`
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error)
            return `Error activating session: ${message}`
          }
        },
      }),

      deactivate_session: tool({
        description: "Deactivate the currently active session plan for the current opencode session.",
        args: {},
        execute: async () => {
          if (!currentSessionID) {
            return "Error: session ID not available"
          }

          try {
            const cwd = process.cwd()
            const activeSessionPath = join(
              cwd,
              ".opencode",
              "session-ids",
              currentSessionID,
              "active-session.json"
            )

            await unlink(activeSessionPath)
            return `Deactivated session for opencode session ${currentSessionID}`
          } catch (error) {
            if (
              typeof error === "object" &&
              error !== null &&
              "code" in error &&
              (error as { code?: string }).code === "ENOENT"
            ) {
              return `Deactivated session for opencode session ${currentSessionID}`
            }

            const message = error instanceof Error ? error.message : String(error)
            return `Error deactivating session: ${message}`
          }
        },
      }),
    },
  }
}
