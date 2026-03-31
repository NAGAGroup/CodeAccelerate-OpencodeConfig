import * as fs from "fs";
import * as path from "path";

export function ensureOpenCodeIgnore(worktree: string): void {
  try {
    const ignorePath = path.join(worktree, ".opencodeignore");
    const patterns = ["!.opencode/", "!.opencode/**"];
    if (fs.existsSync(ignorePath)) {
      const content = fs.readFileSync(ignorePath, "utf-8");
      const lines = content.split('\n').map(l => l.trim());
      for (const pattern of patterns) {
        if (!lines.includes(pattern)) {
          fs.appendFileSync(ignorePath, `${pattern}\n`);
        }
      }
    } else {
      fs.writeFileSync(ignorePath, `${patterns.join('\n')}\n`);
    }
  } catch {
    // Non-fatal: silently continue if .opencodeignore cannot be written
  }
}
