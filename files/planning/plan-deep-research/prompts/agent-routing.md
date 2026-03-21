# Agent Routing: Knowledge Synthesis & Deep Reasoning

## Objective

Route complex research decomposition and synthesis tasks to specialized research agents.

---

## Routing Decision Criteria

### Route to @ContextInsurgent

Use **@ContextInsurgent** for research tasks requiring deep reasoning across multiple knowledge domains:

- **Synthesis across multiple sources** — Integrating findings from papers, documentation, and practical examples into coherent understanding
- **Gap analysis** — Identifying and prioritizing knowledge gaps across the research landscape
- **Source prioritization** — Understanding which sources are authoritative and how they interrelate
- **Complex decomposition** — Breaking down multi-faceted research questions into independent sub-investigations
- **Methodological choices** — Deciding between research strategies, shapes, and evidence evaluation approaches
- **Quality assessment** — Evaluating research findings for rigor, relevance, and applicability

**Example routing:**
- *User research question spans 5+ academic domains* → @ContextInsurgent (multi-domain synthesis reasoning)
- *Identifying which 3 of 50 papers are most critical* → @ContextInsurgent (authority and relevance assessment)
- *Designing a research DAG with 4+ parallel sub-investigations and complex gates* → @ContextInsurgent (complex decomposition)

### When to Use Sequential Thinking

For non-trivial reasoning within your own analysis, consider using **sequential-thinking**:

- **Before proposing research angles** — Reason through what aspects of the topic matter most
- **When evaluating source quality** — Think through authority, recency, and relevance criteria
- **During research shape selection** — Reason through which structure (exploratory, comparative, systematic) best fits the question
- **For gap analysis** — Systematically identify what's missing and why it matters

This ensures your planning decisions are well-reasoned and defensible.

---

## Generated DAG Prompts

When generated research DAGs include complex steps, prompts should show:

```
Example: For this synthesis step, consider using sequential-thinking 
to reason through how findings from sources A, B, and C interrelate 
before writing your synthesis.
```

This teaches agents that structured reasoning is available for non-obvious decisions.

---

## Implementation Notes

- Document @ContextInsurgent routing explicitly in planning prompts
- Show examples of reasoning-heavy tasks
- Encourage sequential-thinking in DAG execution prompts when appropriate
- Validate that complex research decomposition leverages both @ContextInsurgent (for planning) and sequential-thinking (for execution)

Ref: planning-audit-spec.md § B3, B2
