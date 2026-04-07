import { Glob } from "bun";
import { readFileSync } from "fs";
import { join } from "path";

export type ArtifactType = "agents" | "node-library" | "catalogue";

export interface ArtifactFile {
  type: ArtifactType;
  path: string;
  name: string;
  agentId?: string;           // for agents: the agentID to pass to the OpenCode API
  prompts?: string[];         // for agents: pool of varied dispatch prompts to select from
  successDescription?: string; // for agents: description of correct behavioral pattern
  content?: string;           // for node-library/catalogue: the prompt content
  enforcementArray?: string[]; // for node-library: expected tool sequence
}

const projectRoot = import.meta.dir + "/..";

async function globFiles(pattern: string, cwd: string): Promise<string[]> {
  const g = new Glob(pattern);
  const files: string[] = [];
  for await (const file of g.scan({ cwd })) {
    files.push(file);
  }
  return files;
}

export async function discoverArtifacts(
  type: ArtifactType
): Promise<ArtifactFile[]> {
  const artifacts: ArtifactFile[] = [];

  if (type === "agents") {
    // Import per-agent test prompts
    const { AGENT_TESTS } = await import("./agent-prompts");

    for (const agentTest of AGENT_TESTS) {
      artifacts.push({
        type: "agents",
        path: `files/agents/${agentTest.agentId}.md`,
        name: agentTest.agentId,
        agentId: agentTest.agentId,
        prompts: agentTest.prompts,
        successDescription: agentTest.successDescription,
      });
    }
  } else if (type === "node-library") {
    const files = await globFiles(
      "files/planning/plan-session/node-library/*/prompt.md",
      projectRoot
    );

    for (const file of files) {
      const fullPath = join(projectRoot, file);
      const name = file.split("/")[5];
      const content = readFileSync(fullPath, "utf-8");

      const specPath = join(projectRoot, `files/planning/plan-session/node-library/${name}/node-spec.json`);
      const specContent = readFileSync(specPath, "utf-8");
      const spec = JSON.parse(specContent);
      const enforcementArray = spec.enforcement || [];

      artifacts.push({
        type: "node-library",
        path: file,
        name,
        content,
        enforcementArray,
      });
    }
  } else if (type === "catalogue") {
    const cataloguePath = join(
      projectRoot,
      "files/planning/plan-session/node-library/CATALOGUE.md"
    );
    artifacts.push({
      type: "catalogue",
      path: "files/planning/plan-session/node-library/CATALOGUE.md",
      name: "CATALOGUE",
      content: readFileSync(cataloguePath, "utf-8"),
    });

    const guidePath = join(
      projectRoot,
      "files/planning/plan-session/dag-design-guide.md"
    );
    artifacts.push({
      type: "catalogue",
      path: "files/planning/plan-session/dag-design-guide.md",
      name: "dag-design-guide",
      content: readFileSync(guidePath, "utf-8"),
    });
  }

  return artifacts;
}
