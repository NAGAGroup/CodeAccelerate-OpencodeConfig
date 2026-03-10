import type { Plugin } from "@opencode-ai/plugin";

/**
 * DCP Tool Recovery Plugin
 *
 * Injects a conditional reflection prompt BEFORE compress/distill execute.
 * The prompt tells the agent: if the tool fails, read the context file and
 * fix the issue. If it succeeds, ignore and move on.
 */

const CONTEXT_FILE = "~/.config/opencode/context/core/system/dcp-context-management.md";

const COMPRESS_REFLECTION = `[DCP Compress — Pre-flight Check]

If this compress call fails, you MUST:
1. Read ${CONTEXT_FILE} for correct usage — it has WRONG vs CORRECT examples
2. Verify content is a native nested JSON object with startId, endId, summary as directly-accessible properties — NOT a JSON string containing those keys
3. Verify startId/endId are real boundary IDs from <dcp-message-id> tags in your context
4. Fix the issue and retry with corrected arguments

If compress succeeded, ignore this message entirely — do not comment on it, just continue your work.`;

const DISTILL_REFLECTION = `[DCP Distill — Pre-flight Check]

If this distill call fails, you MUST:
1. Read ${CONTEXT_FILE} for correct usage
2. Verify every targets[].id is a string that appears in the <prunable-tools> list currently visible in your context
3. IDs are NOT sequential and have gaps — do not guess or extrapolate
4. Fix the issue and retry with corrected arguments

If distill succeeded, ignore this message entirely — do not comment on it, just continue your work.`;

async function injectReflection(
  client: any,
  sessionID: string,
  message: string,
  agent?: string,
) {
  await client.session.prompt({
    path: { id: sessionID },
    body: {
      noReply: true,
      ...(agent ? { agent } : {}),
      parts: [{ type: "text", text: message, synthetic: true }],
    },
  });
}

export const DCPRecoveryPlugin: Plugin = async ({ client }) => {
  const sessionAgents = new Map<string, string>();

  return {
    "chat.message": async (input, _output) => {
      const sessionID =
        input.sessionID || (_output as any).message?.sessionID;
      const agent = (_output as any).message?.agent;
      if (sessionID && agent && agent !== "compaction") {
        sessionAgents.set(sessionID, agent);
      }
    },

    "tool.execute.before": async (input, output) => {
      const { tool, sessionID } = input;
      const agent = sessionAgents.get(sessionID);

      if (tool === "compress") {
        await injectReflection(client, sessionID, COMPRESS_REFLECTION, agent);
      }

      if (tool === "distill") {
        await injectReflection(client, sessionID, DISTILL_REFLECTION, agent);
      }
    },
  };
};
