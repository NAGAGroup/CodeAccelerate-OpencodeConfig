# Write Prompts: Generate Research DAG Execution Prompts

## Objective

Write all **prompt files** for the research project DAG. Each prompt guides agents through one step of the research workflow.

---

## Prompt File Inventory

For each node in the planned DAG, write a prompt file:

### Entry Node

- **session-overview.md** — Introduce the research project, summarize the plan, set tone

### Investigation Nodes

For each research angle or investigation:

- **[angle-name]-investigation.md** — Guide one research angle or sub-question
  - Task: Execute investigation (search, analyze, synthesize for this angle)
  - Tools: Reference exa_web_search, context7_query-docs, sequential-thinking as appropriate
  - Output: Structured findings for this angle

### Synthesis & Integration Nodes

- **synthesize-findings.md** — Integrate findings across angles
  - Task: Cross-reference sources, identify connections, build integrated understanding
  - Consider: sequential-thinking for complex synthesis reasoning
  - Output: Cohesive summary of all findings

### Gate Nodes (if any)

- **[gate-name]-gate.md** — Decision prompt for user review
  - Task: Present findings, ask go/no-go or reconsider questions
  - Output: User decision (advance, loop back, or refine)

### Finalization Node

- **finalize-findings.md** — Consolidate research and prepare output
  - Task: Summarize research journey, present final synthesis, document gaps and future work
  - Output: Complete research deliverable

---

## Writing Guidelines

### Research-Focused Prompts

Each prompt should:

1. **Be clear on the investigation scope** — What angle or question is this step addressing?
2. **Mention available tools** — exa_web_search, context7, sequential-thinking where relevant
3. **Guide source selection** — When to prioritize academic sources vs. practical examples vs. official documentation
4. **Ask for structured output** — Findings formatted for downstream synthesis
5. **Include examples** — Show what good investigation output looks like

### Example Prompt Structure

```markdown
# [Angle Name] Investigation

## Objective

Deeply investigate [specific research angle], gathering evidence and identifying gaps.

## What to Investigate

- [Sub-question 1]
- [Sub-question 2]
- Key sources for this angle

## Tools & Resources

- **Web search:** Use exa_web_search for "[topic keywords]"
- **Documentation:** Use context7_query-docs for official "[framework/standard]"
- **Implementation examples:** Use exa_get_code_context for "[pattern examples]"

## Complex Reasoning (if needed)

If this investigation requires reasoning through multiple sources and evidence, 
consider using sequential-thinking to structure your analysis.

## Output

Structured findings:
- Key sources and their authority/relevance
- Main findings for this angle
- Identified gaps or conflicting evidence
- Confidence level (exploratory, moderate, high)

Call next_step() when complete.
```

### Agent & Tool Leverage

In generated prompts:

- **@ContextInsurgent routing:** Mention when synthesis or complex decomposition is needed
- **Sequential thinking:** Show examples of where structured reasoning helps
- **Web tools:** Document which tools fit which investigation types

Example in synthesis prompt:
```
For complex synthesis across 5+ sources, you may use sequential-thinking 
to reason through connections and conflicts before writing your integrated summary.
```

---

## Validation Before Writing

Before writing prompts:

1. **Confirm node count matches plan.json**
2. **Verify each node has a clear purpose**
3. **Check branching logic** (gates have matching prompt questions)
4. **Ensure tool references match available tools** (exa, context7, sequential-thinking)

## Output

Write all prompt files to `planning/plan-deep-research/prompts/[node-id].md`.

Each file should:
- Be clear, actionable, and research-focused
- Mention domain-appropriate tools and agents
- Guide structured output for downstream steps
- Align with the DAG's branching and gating logic

## Next Step

Once all prompts are written, advance to `finalize` for validation and activation.

---

**Note:** Well-written prompts are critical; they guide how agents execute the research DAG. Invest time in clarity and examples.

Ref: planning-audit-spec.md § Improvement 4 (Finalize Split)
