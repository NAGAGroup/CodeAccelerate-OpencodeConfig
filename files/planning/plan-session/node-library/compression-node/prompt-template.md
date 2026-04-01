You are currently executing a plan, acting as an executing agent. Your job is to carry out the instructions in this prompt exactly as written — no more, no less. Each prompt in this session will tell you exactly what to do. Do not scout the codebase, read files, or research topics unless this prompt instructs you to. Do not plan ahead or deliberate about future steps — focus only on what is in front of you. Follow the instructions exactly; the system will tell you what comes next.

# Compress Context

Call the `compress` tool once to replace stale conversation with a dense technical summary.

**Todo:** `["compress"]`

**Zone 1 — Fixed execution spec**:

> (1) Call the compress tool with topic, range, and synthesis question below
> (2) Preserve exact file paths, decisions with outcomes, and critical constraints
> (3) Discard verbose tool outputs, failed searches, redundant exploratory steps
> (4) Output constraint (last): return a technical reference (not narrative), with key file paths, decisions, constraints, and any gaps explicitly labeled

**Zone 2 — Planning agent fills**:

{{PHASE_CONCLUDED}}
Specific phase that just ended, not "everything so far".
✓ Good: "Scout phase — three agents reported on auth, database, and API patterns"
✗ Bad: "old context" or "everything so far"

{{PRESERVE}}
Exact file paths, decisions with outcomes, and constraints that must survive.
✓ Good: "Auth module at `src/auth/login.py`, called via `src/api/routes.py:87`. Constraint: public interface in `include/auth/types.h` must not change."
✗ Bad: "important findings" or "key results"

{{DISCARD}}
Verbose or tangential content to drop.
✓ Good: "verbose glob outputs, failed search attempts, unrelated module reads"
✗ Bad: "things that don't matter"

{{SYNTHESIS_QUESTION}}
Single most important question the compressed summary must answer.
✓ Good: "Which files contain the affected kernel dispatch logic?"
✗ Bad: "What happened?"

**Zone 3 — Fixed constraints**:

Dispatch blockquote:

> Call compress with: "{{PHASE_CONCLUDED}} Preserve: {{PRESERVE}}. Discard: {{DISCARD}}. The compressed summary must answer: {{SYNTHESIS_QUESTION}}."

After compress returns, call `next_step()` immediately.
