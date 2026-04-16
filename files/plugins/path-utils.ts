import * as fs from "fs";
import * as path from "path";

export function expandPath(p: string): string {
  if (p.startsWith("~/")) {
    const home = process.env.HOME || process.env.USERPROFILE || "";
    return path.join(home, p.slice(2));
  }
  return p;
}

export function readPrompt(
  promptPath: string,
  worktree: string,
  sessionPath?: string,
  vars?: { plan_name?: string; planning_session_id?: string; inject?: Record<string, string> }
): string {
  const expanded = expandPath(promptPath);
  let content: string;
  if (path.isAbsolute(expanded)) {
    content = fs.readFileSync(expanded, "utf-8");
  } else {
    content = fs.readFileSync(path.join(worktree, expanded), "utf-8");
  }
  if (sessionPath) {
    content = content.replaceAll("{{SESSION_PATH}}", sessionPath);
    content = content.replaceAll("{{SESSION_NAME}}", path.basename(sessionPath));
  }
  if (vars?.plan_name) {
    content = content.replaceAll("{{PLAN_NAME}}", vars.plan_name);
  }
  if (vars?.planning_session_id) {
    content = content.replaceAll("{{PLANNING_SESSION_ID}}", vars.planning_session_id);
  }
  if (vars?.inject) {
    for (const [key, value] of Object.entries(vars.inject)) {
      content = content.replaceAll(`{{${key}}}`, value);
    }
  }
  return content;
}

export function resolveDagPath(target: string, worktree: string): string {
  if (target.includes('/') || target.includes('\\') || target.endsWith('.jsonl') || target.endsWith('.json')) {
    const expanded = expandPath(target);
    const resolved = path.resolve(worktree, expanded);
    // If the resolved path is a directory, append plan.jsonl automatically
    if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
      return path.join(resolved, 'plan.jsonl');
    }
    return resolved;
  }
  return path.join(worktree, '.opencode', 'session-plans', target, 'plan.jsonl');
}
