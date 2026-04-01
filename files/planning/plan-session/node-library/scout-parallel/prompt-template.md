# Codebase Exploration — scout-parallel

Dispatch @ContextScout agents in parallel to gather context from specific file regions, with Scout 1 blocking and Scouts 2–N dispatched together.

**Todo:** `["task", "task"]`

**Zone 1 — Fixed execution spec:**
> (1) Dispatch Scout 1 first; wait for its result before writing Scouts 2+.
> (2) Scout 1 runs `glob("**/*")` unconditionally for zero-assumption project discovery.
> (3) Scouts 2+ receive targeted paths from planning placeholders, enriched with Scout 1's findings.
> (4) Do not read `.opencode/` session directories — only permitted paths are named explicitly.
> (5) Each scout returns raw findings with exact file paths and line numbers, no summaries or generic headers.

**Zone 2 — Planning agent fills:**

{{SCOUT_1_QUESTION}}
Specific discovery question for zero-context project orientation.
✓ "What functions are exported from src/api/?"
✗ "Analyze the API layer"

{{SCOUT_1_FILES}}
Explicit glob patterns for Scout 1's file search.
✓ `glob("src/api/**/*.ts")`
✗ `glob("src/api/index.ts,src/api/routes.ts")`

{{SCOUT_2_QUESTION}}
Specific discovery question for conventions and patterns.
✓ "What naming conventions do kernel functions follow in src/kernels/?"
✗ "Find the patterns"

{{SCOUT_2_FILES}}
Explicit glob patterns for Scout 2's file search.
✓ `glob("src/kernels/**/*.cpp")`
✗ "the kernel directory"

{{SCOUT_3_QUESTION}}
Specific discovery question for dependencies and integration.
✓ "What external libraries are declared in CMakeLists.txt and conanfile.txt?"
✗ "Check the dependencies"

{{SCOUT_3_FILES}}
Explicit glob patterns for Scout 3's file search.
✓ `glob("CMakeLists.txt", "conanfile.txt", "include/**/*.h")`
✗ `glob("build/,site-packages/")`

**Zone 3 — Fixed constraints:**

Scout 1 is blocking — write Scouts 2 and 3 in the same turn after Scout 1 returns. Each scout receives one dispatch `task` call with: (1) goal statement, (2) file paths as glob patterns, (3) explicit instruction to return raw findings with exact references — no thematic summaries or generic headers.

Do not read `.opencode/` at any point. Do not ask scouts to summarize, interpret, or flag ambiguities — scouts report facts and exit. Do not dispatch agents or read files during this node.

Call `next_step()` after all three scouts return.
