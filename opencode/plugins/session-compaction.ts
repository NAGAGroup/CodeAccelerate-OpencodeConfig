// .opencode/plugins/session-compaction.ts
//
// This is the ONLY plugin in the system. It does one thing:
//
// Compaction hook: When opencode auto-compacts, inject the active session's
// state and persistent context into the compaction prompt so they survive
// the context reset.

import type { Plugin } from "@opencode-ai/plugin"
import { readFileSync, readdirSync, existsSync } from "fs"
import { join } from "path"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readFileSafe(path: string): string {
  try {
    return readFileSync(path, "utf-8")
  } catch {
    return ""
  }
}

function readDirFiles(dirPath: string): { name: string; content: string }[] {
  if (!existsSync(dirPath)) return []
  try {
    return readdirSync(dirPath)
      .filter(f => f.endsWith(".md") || f.endsWith(".json"))
      .sort()
      .map(f => ({
        name: f,
        content: readFileSafe(join(dirPath, f)),
      }))
  } catch {
    return []
  }
}

function findActiveSession(sessionsDir: string): string | null {
  if (!existsSync(sessionsDir)) return null
  try {
    const sessions = readdirSync(sessionsDir).filter(d => {
      const specPath = join(sessionsDir, d, "spec.json")
      if (!existsSync(specPath)) return false
      try {
        const spec = JSON.parse(readFileSafe(specPath))
        return spec.status === "active"
      } catch {
        return false
      }
    })

    // Sort by created timestamp (most recent first)
    const withTimestamps = sessions
      .map(d => ({
        name: d,
        created: (() => {
          try {
            const spec = JSON.parse(readFileSafe(join(sessionsDir, d, "spec.json")))
            return spec.created || ""
          } catch {
            return ""
          }
        })(),
      }))
      .filter(s => s.created)
      .sort((a, b) => b.created.localeCompare(a.created)) // Descending = newest first

    return withTimestamps[0]?.name || null
  } catch {
    return null
  }
}

// ─── Plugin ──────────────────────────────────────────────────────────────────

export const SessionCompactionPlugin: Plugin = async ({ client, directory }) => {
  const sessionsDir = join(directory, ".opencode", "sessions")
  const contextDir = join(directory, ".opencode", "context")
  const globalContextDir = join(
    process.env.XDG_CONFIG_HOME || join(process.env.HOME || "~", ".config"),
    "opencode",
    "context"
  )

  return {
    // ─── Compaction Hook ──────────────────────────────────────────────
    "experimental.session.compacting": async (_input, output) => {
      const blocks: string[] = []
      let resumeInstruction = ""

      // 1. Inject active session state
      const activeSession = findActiveSession(sessionsDir)
      if (activeSession) {
        const sessionDir = join(sessionsDir, activeSession)

        // Read spec.json to get current subtask info
        let currentSubtask = "unknown"
        let totalSubtasks = 0
        let currentSubtaskName = ""
        try {
          const spec = JSON.parse(readFileSafe(join(sessionDir, "spec.json")))
          currentSubtask = spec.currentSubtask?.toString() || "unknown"
          totalSubtasks = spec.subtaskCount || 0
          // Find the name of the current subtask from the subtasks array
          const subtaskEntry = spec.subtasks?.find(
            (s: any) => s.id === currentSubtask || s.id === String(currentSubtask).padStart(2, "0")
          )
          currentSubtaskName = subtaskEntry?.name || subtaskEntry?.description || ""
        } catch {
          // ignore
        }

        // Index.md is the master reference
        const indexContent = readFileSafe(join(sessionDir, "index.md"))
        if (indexContent) {
          blocks.push(
            `## Active Session Plan\n` +
              `Session: ${activeSession}\n` +
              `Current Subtask: ${currentSubtask} of ${totalSubtasks}${currentSubtaskName ? ` — ${currentSubtaskName}` : ""}\n` +
              `Path: .opencode/sessions/${activeSession}/\n\n` +
              indexContent
          )
        }

        // Include session notes (concept-specific knowledge)
        const notes = readDirFiles(join(sessionDir, "notes"))
        if (notes.length > 0) {
          blocks.push(
            `## Session Notes\n` +
              notes
                .map(n => `### ${n.name.replace(".md", "")}\n${n.content}`)
                .join("\n\n")
          )
        }

        // Build the auto-resume instruction from session state
        const subtaskFile = join(
          sessionDir,
          `subtask-${String(currentSubtask).padStart(2, "0")}${currentSubtaskName ? `-${currentSubtaskName}` : ""}.md`
        )
        const subtaskContent = existsSync(subtaskFile) ? readFileSafe(subtaskFile) : ""

        resumeInstruction =
          `\n\n---\n\n` +
          `## IMMEDIATE NEXT ACTION (auto-resume after compaction)\n\n` +
          `You are in the middle of an active session. Do NOT wait for user input. ` +
          `Resume work immediately on:\n\n` +
          `- Session: **${activeSession}**\n` +
          `- Current subtask: **${currentSubtask} of ${totalSubtasks}**${currentSubtaskName ? ` — ${currentSubtaskName}` : ""}\n` +
          `- Spec file: \`.opencode/sessions/${activeSession}/subtask-${String(currentSubtask).padStart(2, "0")}*.md\`\n\n` +
          `Before creating any new todos, first read your current todolist — it survives compaction and contains your session orientation.\n\n` +
          `Read \`.opencode/sessions/${activeSession}/index.md\` to orient, then read the current subtask spec and continue executing it from where you left off.` +
          (subtaskContent
            ? `\n\nCurrent subtask spec:\n\`\`\`\n${subtaskContent.slice(0, 2000)}\n\`\`\``
            : "")
      } else {
        // Debug: log when no active session found (for troubleshooting)
        await client.app.log({
          body: {
            service: "session-compaction",
            level: "info",
            message: `No active session found in ${sessionsDir}`,
          },
        })
      }

      // 2. Inject persistent context (project-local)
      const localContext = readDirFiles(contextDir)
      if (localContext.length > 0) {
        blocks.push(
          `## Project Context (.opencode/context/)\n` +
            localContext.map(f => `### ${f.name}\n${f.content}`).join("\n\n")
        )
      }

      // 3. Inject persistent context (global)
      const globalContext = readDirFiles(globalContextDir)
      if (globalContext.length > 0) {
        blocks.push(
          `## Global Context\n` +
            globalContext.map(f => `### ${f.name}\n${f.content}`).join("\n\n")
        )
      }

      // Push context blocks + append resume instruction
      if (blocks.length > 0) {
        output.context.push(blocks.join("\n\n---\n\n") + resumeInstruction)
      } else if (resumeInstruction) {
        output.context.push(resumeInstruction)
      }
    },
  }
}

export default SessionCompactionPlugin
