# Propose Investigation Shape

Your task is to **define the investigation structure and decompose into diagnosis steps**.

## Critical: Branch vs. Loop Decision

Before decomposing, understand the difference and **decide which applies to this investigation:**

### Looping
**Definition:** Refining **ONE hypothesis** with multiple test iterations (test-refine-test cycles)
- Use when: Primary hypothesis is clear; uncertainty is about execution details
- Pattern: hypothesis → test → refine → test → confirm
- Example: "We think it's a race condition in the connection pool; we need 2-3 iterations to confirm exact timing"

### Branching  
**Definition:** Testing **MULTIPLE different root causes** sequentially or in parallel
- Use when: Multiple plausible causes; evidence needed to rule out alternatives
- Pattern: hypothesis-A test → results guide hypothesis-B test (or test both in parallel)
- Example: "Could be memory leak OR incorrect connection cleanup OR database timeout; test each"

### Both
**Definition:** Some hypotheses loop for refinement; others are tested as alternatives
- Use when: High complexity (e.g., primary hypothesis needs refinement AND alternatives exist)

## What to Do

1. **Decide NOW:** Will this investigation **branch (multiple hypotheses), loop (refine one), or both?**
   - Ask yourself: "Do we test multiple competing root causes, or refine one?"
   
2. **Decompose the investigation into 3-7 diagnosis steps:**
   - Clear names (e.g., "reproduce-locally", "trace-execution", "check-logs")
   - What will be tested and why
   - Which hypothesis each step tests
   
3. **Identify structure:**
   - Branching points: at which steps do we decide between hypotheses?
   - Loops: which steps need test-refine iteration?
   
4. **Define success criteria:** when does a step confirm or falsify a hypothesis?

5. **Architecture Complexity:** If this investigation requires understanding how multiple modules interact (3+ layers or components), consider routing to @ContextInsurgent for investigation shape reasoning. (Decision made at agent-routing step.)

## Output

- **Branch/Loop/Both decision** (state clearly upfront)
- Numbered list of diagnosis steps
- Description of each step
- Hypothesis each step tests
- Branching and looping points
- Success criteria (evidence that confirms/falsifies)

Call `next_step()` to evaluate.
