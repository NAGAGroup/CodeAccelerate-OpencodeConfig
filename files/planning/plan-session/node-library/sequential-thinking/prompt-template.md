# Sequential Reasoning

Call `sequential-thinking_sequentialthinking` repeatedly until your conclusion is clear, then call `next_step()`.

**Todo:** `["sequential-thinking_sequentialthinking"]`

**Zone 1 — Fixed execution spec:**
> (1) Call `sequential-thinking_sequentialthinking` to reason through {{REASONING_TOPIC}}.
> (2) Consider: {{REASONING_CONTEXT}} already available from prior findings.
> (3) Call the tool repeatedly in the same turn until your conclusion is clear — do not pause between calls.
> (4) Stop reasoning when the decision resolves, not when a thought count is reached.
> (5) State your conclusion explicitly in response text before calling `next_step()` — downstream nodes reference it from your active context.

**Zone 2 — Planning agent fills:**

{{REASONING_TOPIC}}
Specific decision question with a clear yes/no, either/or, or ranked-choice answer.
✓ "Should we refactor the reduction kernel before adding work-group tiling, or add tiling first?"
✗ "How should we approach the compute pipeline?"

{{REASONING_CONTEXT}}
Specific information available from prior analysis — name exact items, not themes.
✓ "Scout found matmul.cpp has 3 tightly coupled dispatch paths (lines 12–45, 67–120, 140–180); tiling pattern in src/kernels/reduction.cpp (lines 200–250)"
✗ "Various context from prior nodes"

**Zone 3 — Fixed constraints:**

Do not dispatch agents or read files during this node. Do not ask the user for input — form your own conclusion. Do not pause between sequential-thinking calls for confirmation. If reasoning surfaces competing approaches where user preference matters, you may ask after forming a clear recommendation. Stop immediately if you are repeating already-settled points.

Call `next_step()` after your conclusion is stated and reasoning is complete.
