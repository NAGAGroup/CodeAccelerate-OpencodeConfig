import type { PluginDeps } from "../deps";
import { handlePlanSessionAfter } from "./tool-after-hooks/plan-session";
import { handleActivatePlanAfter } from "./tool-after-hooks/activate-plan";
import { handleNextStepAfter } from "./tool-after-hooks/next-step";
import { handleEnforcementTrackingAfter } from "./tool-after-hooks/enforcement-tracking";

type AfterHookFn = (input: any, output: any, deps: PluginDeps) => Promise<boolean>;

/**
 * Registered after-hook handlers, executed in order.
 * Each handler returns true if it handled the input (short-circuits remaining handlers).
 * The enforcement tracking handler runs last — it's the passive catch-all.
 */
const pipeline: AfterHookFn[] = [
  handlePlanSessionAfter,
  handleActivatePlanAfter,
  handleNextStepAfter,
  handleEnforcementTrackingAfter, // must be last
];

export async function afterHook(
  input: any,
  output: any,
  deps: PluginDeps,
): Promise<void> {
  if (!input.tool || !input.sessionID) return;
  if (!output) return;
  if (output.error) return;

  for (const fn of pipeline) {
    const handled = await fn(input, output, deps);
    if (handled) return;
  }
}
