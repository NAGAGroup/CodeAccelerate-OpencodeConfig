# Generic Node Type

## When to use

Use `generic` **only when no other node template fits your use case**. It is an escape hatch for unusual patterns:

- Single, one-off bash verification or shell command
- Custom sequence of tools not covered by standard templates (e.g., call `bash`, then ask a `question`, then call MCP directly)
- Unusual combinations of agents with custom tool sequencing
- Custom MCP server calls that don't fit the research/analyze/task pattern

**When NOT to use:**

- **If a user decision point** is needed → use `decision-gate` instead (branches on user choice)
- **If conditional routing** is needed → use `conditional-branch` instead (branches on prior context)
- **If deep multi-file analysis** is needed → use `analyze-deep` instead (@ContextInsurgent specializes in this)
- **If external research** is needed → use `research-basic` or `research-deep` instead (@ExternalScout)
- **If parallel exploration** is needed → use `scout-parallel` or `parallel-tasks` instead
- **If the todo sequence exceeds 4–5 items** → split into multiple nodes; chaining too many steps creates brittle DAGs and makes failure recovery hard

## What the planning agent must resolve

Before writing this node, you must determine and specify:

1. **Node ID** *(critical)* — What is this node's specific purpose? Rename it from `generic` to a descriptive kebab-case id (e.g., `verify-file-exists`, `confirm-and-run`, `custom-api-call`). **The ID must NOT remain `generic` in the project DAG — this is non-negotiable.**

2. **Rationale** — Why does no standard template fit? Be precise. Bad: "Need a custom node." Good: "Standard nodes don't support sequential bash + user question + bash again; this node needs that exact sequence."

3. **Todo sequence** — List the exact tools in order. Valid items:
   - `task` — dispatch a subagent (@ContextScout, @ContextInsurgent, @ExternalScout, @JuniorDev, or @QuickDoc)
   - `bash` — execute a shell command
   - `question` — ask the user a question
   - `compress` — compress context via the DCP plugin
   - `sequential-thinking_sequentialthinking` — HW does step-by-step reasoning (exact tool name: underscore between the two parts)
   - Any valid MCP tool name (e.g., `context7_query-docs`, `exa_search`)

4. **Step instructions** — For each todo item in the sequence, describe what HW does and what success looks like:
   - For `task` items: what agent is dispatched, what files they read, what return format is expected
   - For `bash` items: the command to run and success criteria (exit code, output pattern)
   - For `question` items: the exact question to ask and how the answer routes to the next step
   - For `compress` items: what context to keep and what to discard
   - For MCP items: what parameters to pass and what output to expect

5. **Success criteria** — How does HW know this node succeeded? What observable outcome indicates completion?

6. **Dispatch blockquote** *(if todo includes `task` items)* — For each `task` step, include a numbered blockquote specifying: (1) which agent, (2) exact target files or patterns, (3) return format required. See the template for structure.

## Notes

### Anti-Pattern 1: Forgetting to rename the node ID

**Mechanism:** Planning agent writes the node prompt but leaves `"id": "generic"` in plan.json. At DAG execution, if a user or HW later branches to this node or references it by ID, the generic ID has no semantic meaning and can cause silent collisions if multiple generic nodes exist.

**Prevention:** The "What the planning agent must resolve" checklist explicitly requires #1 (Node ID). The prompt template includes a `## Rename requirement` section. Before finalizing the DAG, verify every node has a descriptive, globally unique ID.

**Fix:** Always rename before saving the DAG. Example: `verify-file-exists`, `confirm-deployment`, `custom-auth-check`.

---

### Anti-Pattern 2: Leaving todo items undefined or vague

**Mechanism:** Planning agent lists tools in the sequence but does not define what HW does for each step. HW attempts to infer action from context; inference fails or defaults to over-broad behavior.

**Prevention:** Checklist item #4 (Step instructions) requires the planning agent to define HW's behavior for *each* todo item before writing the prompt. No vagueness allowed.

**Fix:** For every tool in the todo array, write a sentence: "For [step N] (`task` / `bash` / `question`), HW does X, expecting Y as success."

---

### Anti-Pattern 3: Using generic as a workaround for decision-gate or conditional-branch

**Mechanism:** Planning agent finds a decision point ("user picks option A or B") or a conditional branch ("if prior analysis found X, do Y; else do Z") and writes a generic node instead of routing properly.

**Prevention:** Checklist item #2 (Rationale) requires the planning agent to justify why standard templates don't fit. Use this to push back: if the node is really just a branching point with different paths, those are not generic patterns — they are decision-gate or conditional-branch.

**Fix:** Always ask: "Is this a user choice?" → `decision-gate`. "Is this conditional on prior output?" → `conditional-branch`. Neither? Then generic may fit.

---

## Additional Notes

- Generic nodes are **stateful** — they consume part of HW's step budget. Keep todo sequences short (ideally ≤3–4 items). Longer chains should be split into multiple nodes with explicit pass-off points.
- Every `task` item requires an explicit dispatch blockquote in step instructions. This is not optional; it ensures the subagent receives a well-formed task prompt.
- If you find yourself writing a second generic node with a similar purpose, stop and consider: should these be a parameterized node type instead? (Reach out to maintainers.)
