import * as fs from "fs";
import type { PlanDag } from "./types";

export function readDag(planPath: string): PlanDag {
  if (!fs.existsSync(planPath)) {
    throw new Error(`plan.json not found at ${planPath}`);
  }
  try {
    return JSON.parse(fs.readFileSync(planPath, 'utf-8')) as PlanDag;
  } catch {
    throw new Error(`plan.json is not valid JSON at ${planPath}`);
  }
}

export function writeDag(planPath: string, dag: PlanDag): void {
  fs.writeFileSync(planPath, JSON.stringify(dag, null, 2), 'utf-8');
}
