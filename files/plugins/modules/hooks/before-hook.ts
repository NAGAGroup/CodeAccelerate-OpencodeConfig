import type { PluginDeps } from "../deps";
import { handlePlanSessionBefore } from "./tool-before-hooks/plan-session";
import { handleActivatePlanBefore } from "./tool-before-hooks/activate-plan";
import { handleNextStepBefore } from "./tool-before-hooks/next-step";
import { handlePresentPlanDiagramBefore } from "./tool-before-hooks/present-plan-diagram";
import { handleEnforcementBefore } from "./tool-before-hooks/enforcement";

type BeforeHookFn = (input: any, output: any, deps: PluginDeps) => Promise<boolean>;

/**
 * Registered before-hook handlers, executed in order.
 * Each handler returns true if it handled the input (short-circuits remaining handlers).
 *
 * Enforcement runs FIRST so that plan_session/activate_plan cannot bypass DAG blocking
 * when called mid-session. When no session is active, enforcement is a no-op (readState
 * returns null) and the tool-specific handlers run normally.
 */
const pipeline: BeforeHookFn[] = [
  handleEnforcementBefore, // must be first — gates all tool calls when a session is active
  handlePlanSessionBefore,
  handleActivatePlanBefore,
  handlePresentPlanDiagramBefore,
  handleNextStepBefore,
];

export async function beforeHook(
  input: any,
  output: any,
  deps: PluginDeps,
): Promise<void> {
  if (!input.tool || !input.sessionID) return;

  for (const fn of pipeline) {
    const handled = await fn(input, output, deps);
    if (handled) return;
  }
}
