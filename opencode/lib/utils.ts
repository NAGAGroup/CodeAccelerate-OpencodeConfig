import { readFile } from "fs/promises";
import * as os from "os";
import * as path from "path";

export interface AgentConfig {
  required_skills?: string[];
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
