import { readFile } from "fs/promises";
import * as os from "os";
import * as path from "path";

export interface AgentConfig {
  required_skills?: string[];
  permission?: Record<string, any>;
  [key: string]: any;
}

export interface Config {
  agent: Record<string, AgentConfig>;
  skills?: {
    paths?: string[];
  };
  [key: string]: any;
}

export async function loadConfig(worktree: string): Promise<Config> {
  const globalPath = path.join(os.homedir(), ".config", "opencode", "opencode.json");
  const projectPath = path.join(worktree, ".opencode", "opencode.json");

  const readJson = async (filePath: string) => {
    try {
      return JSON.parse(await readFile(filePath, "utf-8"));
    } catch {
      return null;
    }
  };

  const global = await readJson(globalPath);
  const project = await readJson(projectPath);

  const mergedAgents: Record<string, AgentConfig> = {};
  const allAgents = new Set([
    ...Object.keys(global?.agent || {}),
    ...Object.keys(project?.agent || {}),
  ]);

  for (const agentName of allAgents) {
    const globalAgent = global?.agent?.[agentName] || {};
    const projectAgent = project?.agent?.[agentName] || {};

    mergedAgents[agentName] = {
      ...globalAgent,
      ...projectAgent,
      required_skills: [
        ...(globalAgent.required_skills || []),
        ...(projectAgent.required_skills || []),
      ].filter((skill, index, arr) => arr.indexOf(skill) === index),
    };
  }

  return {
    agent: mergedAgents,
    skills: project?.skills || global?.skills || {},
  };
}

/**
 * Formats agent permissions into human-readable text for injection into agent prompts.
 * Merges global and local configs automatically (same as loadConfig).
 * 
 * @param agentName - Name of the agent to format permissions for
 * @param config - Merged configuration object (from loadConfig)
 * @returns Formatted permission text showing all allowed tools and patterns
 */
export function formatPermissionsForAgent(
  agentName: string,
  config: Config
): string {
  const permissions = config.agent[agentName]?.permission || {};
  const lines: string[] = [];

  // Helper to format permission value recursively
  function formatValue(key: string, value: any, indent: string = ""): void {
    if (key === "*") {
      lines.push(`${indent}Default: ${value}`);
      return;
    }

    if (typeof value === "string") {
      lines.push(`${indent}- ${key}: ${value}`);
    } else if (typeof value === "object" && value !== null) {
      lines.push(`${indent}- ${key}:`);
      for (const [pattern, perm] of Object.entries(value)) {
        if (pattern === "*") {
          lines.push(`${indent}  Default: ${perm}`);
        } else {
          lines.push(`${indent}  - ${pattern}: ${perm}`);
        }
      }
    }
  }

  // Format all permissions
  for (const [tool, perm] of Object.entries(permissions)) {
    formatValue(tool, perm);
  }

  return lines.length > 0 ? lines.join("\n") : "No specific permissions configured";
}

export function createConfigLoader(worktree: string) {
  let cachedConfig: Config | null = null;

  return async function getConfig(): Promise<Config> {
    if (cachedConfig) return cachedConfig;
    cachedConfig = await loadConfig(worktree);
    return cachedConfig;
  };
}

export function createLazyLoader<T = any>(
  libraryName: string,
  installCommand?: string
) {
  let lib: T | null = null;

  return async function loadLibrary(): Promise<T> {
    if (!lib) {
      try {
        lib = await import(libraryName);
      } catch (error) {
        const cmd = installCommand || `npm install ${libraryName}`;
        throw new Error(
          `${libraryName} library not found. Install with: ${cmd}`
        );
      }
    }
    return lib;
  };
}

export function resolveAbsolutePath(
  filePath: string,
  baseDirectory: string
): string {
  return path.isAbsolute(filePath)
    ? filePath
    : path.join(baseDirectory, filePath);
}

export function successResponse(data: any): string {
  return JSON.stringify({ success: true, ...data }, null, 2);
}

export function errorResponse(error: any): string {
  return JSON.stringify(
    {
      success: false,
      error: error.message || String(error),
    },
    null,
    2
  );
}

export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T
): T {
  return (async (...args: any[]) => {
    try {
      const result = await fn(...args);
      return typeof result === "string" ? result : successResponse(result);
    } catch (error: any) {
      return errorResponse(error);
    }
  }) as T;
}

/**
 * Compaction Detection Utility
 * 
 * Provides a unified way for plugins to detect and respond to session compaction.
 * Uses dual-hook strategy: session.compacted (primary) + session.idle (fallback).
 * 
 * Benefits:
 * - Eliminates code duplication across plugins
 * - Ensures compaction is detected AFTER it completes (not during)
 * - Prevents double-processing with built-in deduplication
 * - Allows plugins to track per-session compaction indices
 */
export function createCompactionDetector(client: any) {
  // Deduplication: Prevent double-processing when both events fire within 5 seconds
  const recentDetections = new Set<string>();
  const DEDUP_WINDOW_MS = 5000;

  /**
   * Detects compaction and calls handler if found.
   * 
   * @param sessionID - Session to check
   * @param handler - Called with (sessionID, compactionIndex) when compaction detected
   * @param lastProcessedIndex - Optional: index of last processed compaction (for tracking)
   * @returns The index of the detected compaction, or -1 if none found
   */
  async function detectAndHandle(
    sessionID: string,
    handler: (sessionID: string, compactionIndex: number) => Promise<void>,
    lastProcessedIndex?: number
  ): Promise<number> {
    // Deduplication check: prevent double-processing
    const now = Date.now();
    const dedupKey = `${sessionID}:${Math.floor(now / DEDUP_WINDOW_MS)}`;
    
    if (recentDetections.has(dedupKey)) {
      return -1; // Already processed in this 5-second window
    }

    // Fetch session messages to detect compaction
    let messagesResp;
    try {
      messagesResp = await client.session.messages({
        path: { id: sessionID },
      });
    } catch (error) {
      return -1; // Silently fail if can't fetch messages
    }

    const messages = (messagesResp.data ?? []) as Array<{
      info?: {
        agent?: string;
      };
    }>;

    // Walk backwards to find the most recent compaction message
    let compactionIndex = -1;

    for (let i = messages.length - 1; i >= 0; i--) {
      const info = messages[i].info;

      if (info?.agent === "compaction") {
        compactionIndex = i;
        break; // Found most recent compaction
      }
    }

    // Only process if we found a NEW compaction (not already processed)
    if (compactionIndex === -1) {
      return -1; // No compaction found
    }

    const lastProcessed = lastProcessedIndex ?? -1;
    if (compactionIndex <= lastProcessed) {
      return compactionIndex; // Already processed this compaction
    }

    // Mark as processed in deduplication set
    recentDetections.add(dedupKey);

    // Call the handler
    try {
      await handler(sessionID, compactionIndex);
    } catch (error) {
      // Silently fail - don't pollute TUI
    }

    return compactionIndex;
  }

  /**
   * Creates an event handler for plugins to use.
   * Handles both session.compacted and session.idle events with proper deduplication.
   * 
   * @param handler - Called with (sessionID, compactionIndex) when compaction detected
   * @param getLastProcessedIndex - Optional: function to get last processed index for a session
   * @returns Event handler function to register in plugin
   */
  return function createEventHandler(
    handler: (sessionID: string, compactionIndex: number) => Promise<void>,
    getLastProcessedIndex?: (sessionID: string) => number
  ) {
    return async ({ event }: { event: any }) => {
      // PRIMARY: Direct compaction event (fires after compaction completes)
      if (event.type === "session.compacted") {
        const sessionID = event.properties.sessionID;
        const lastProcessed = getLastProcessedIndex?.(sessionID);
        await detectAndHandle(sessionID, handler, lastProcessed);
        return; // Early return to prevent double-processing from session.idle
      }

      // FALLBACK: Detect compaction retroactively when direct event doesn't fire
      if (event.type === "session.idle") {
        const sessionID = event.properties.sessionID;
        const lastProcessed = getLastProcessedIndex?.(sessionID);
        await detectAndHandle(sessionID, handler, lastProcessed);
      }
    };
  };
}
