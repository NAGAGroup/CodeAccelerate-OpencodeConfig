import type { Plugin } from "@opencode-ai/plugin";
import { ensureOpenCodeIgnore } from "./plugin-utils";
import type { PluginDeps } from "./modules/deps";
import { createSessionTools } from "./modules/tools/session-tools";
import { createNavigationTools } from "./modules/tools/navigation-tools";
import { createPlanningTools } from "./modules/tools/planning-tools";
import { createGrepaiTools } from "./modules/tools/grepai-tools";
import { beforeHook } from "./modules/hooks/before-hook";
import { afterHook } from "./modules/hooks/after-hook";
import { createSessionHooks } from "./modules/hooks/session-hooks";

export const PlanningEnforcementPlugin: Plugin = async (_ctx) => {
  const { client } = _ctx;

  const resolveWorktree = (_ctx: { worktree?: string }) => process.cwd();

  // Per-turn flag: set by chat.params, consumed by experimental.chat.system.transform.
  let _dagActiveThisTurn = false;

  ensureOpenCodeIgnore(resolveWorktree(_ctx));

  const deps: PluginDeps = {
    client,
    resolveWorktree,
    dagActiveThisTurn: () => _dagActiveThisTurn,
    setDagActiveThisTurn: (value) => { _dagActiveThisTurn = value; },
    pluginCtx: _ctx,
  };

  const sessionHooks = createSessionHooks(deps);

  return {
    tool: {
      ...createSessionTools(deps),
      ...createNavigationTools(deps),
      ...createPlanningTools(deps),
      ...createGrepaiTools(deps),
    },

    "tool.execute.before": async (input, output) => {
      await beforeHook(input, output, deps);
    },

    "tool.execute.after": async (input, output) => {
      await afterHook(input, output, deps);
    },

    "chat.params": sessionHooks["chat.params"],

    "experimental.session.compacting": sessionHooks["experimental.session.compacting"],
  };
};
