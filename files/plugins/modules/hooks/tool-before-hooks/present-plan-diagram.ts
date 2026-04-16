import * as fs from "fs";
import * as path from "path";
import { renderMermaidASCII } from "beautiful-mermaid";
import type { PluginDeps } from "../../deps";

export async function handlePresentPlanDiagramBefore(
  input: any,
  output: any,
  deps: PluginDeps,
): Promise<boolean> {
  if (input.tool !== "present_plan_diagram") return false;

  const plan_name = output.args?.plan_name as string;
  if (!plan_name) throw new Error("plan_name is required");

  const worktree = deps.resolveWorktree(deps.pluginCtx);
  const tomlPath = path.join(
    worktree,
    ".opencode",
    "session-plans",
    plan_name,
    "phase-plan.toml",
  );

  if (!fs.existsSync(tomlPath)) {
    throw new Error(
      `Plan '${plan_name}' not found. Create it first with create_plan.`,
    );
  }

  const toml = fs.readFileSync(tomlPath, "utf-8");
  const parsed = Bun.TOML.parse(toml) as { phases: Array<Record<string, unknown>> };
  const rawPhases = parsed.phases ?? [];

  // Rebuild children map from next fields
  const childrenMap = new Map<string, string[]>();
  for (const raw of rawPhases) childrenMap.set(raw.id as string, []);
  for (const raw of rawPhases) {
    const nextArr = raw.next as string[] | undefined;
    if (nextArr) {
      const children = childrenMap.get(raw.id as string);
      if (children) {
        for (const childId of nextArr) children.push(childId);
      }
    }
  }

  // Build Mermaid flowchart
  const mermaidLines = ["flowchart TD"];
  const sanitize = (id: string) => id.replace(/-/g, "_");
  for (const raw of rawPhases) {
    const nodeId = sanitize(raw.id as string);
    const phaseType = (raw.type as string) ?? "";
    const label = `${raw.id}\n[${phaseType}]`;
    mermaidLines.push(`  ${nodeId}["${label}"]`);
    for (const child of childrenMap.get(raw.id as string) ?? []) {
      mermaidLines.push(`  ${nodeId} --> ${sanitize(child)}`);
    }
  }
  const mermaid = mermaidLines.join("\n");
  const ascii = renderMermaidASCII(mermaid, { colorMode: "none" });
  const diagramText = `Plan: ${plan_name}\n\n${ascii}`;

  deps.client.session.prompt({
    path: { id: input.sessionID },
    body: { parts: [{ type: "text", text: diagramText }], noReply: true },
  });

  return true;
}
