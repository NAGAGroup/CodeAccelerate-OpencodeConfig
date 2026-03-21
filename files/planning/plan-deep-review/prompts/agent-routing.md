# Agent Routing for Review Project DAG

Your task is to **identify which agents and model tiers should execute each review step**.

## What to Do

For each review step identified in the previous phase, determine:
1. **Agent Type** — What reviewer expertise is needed? (code reviewer, architect, quality specialist, domain expert, compliance analyst)
2. **Model Tier** — Standard @ContextScout or elevated @ContextInsurgent?
3. **Specialization** — Any specific tool requirements or analysis patterns?

## Routing Criteria

### Standard Review Steps (@ContextScout)
Use @ContextScout for:
- Checklist-based evaluations (coding standards, naming conventions)
- Baseline quality checks (obvious bugs, dead code, simple violations)
- Metrics collection (complexity, coverage, performance baselines)
- Routine compliance verification

### Quality Assessment & Standards Reasoning (@ContextInsurgent)
Route to @ContextInsurgent for:
- **Quality assessment requiring judgment** — Evaluating code design, architecture fitness, or quality trade-offs
- **Standards alignment and interpretation** — Determining how applicable standards apply to this specific codebase
- **Best practices validation** — Assessing whether code follows domain-specific best practices or industry standards
- **Complex reasoning** — Multi-file architectural analysis, dependency reasoning, or systemic quality issues

For complex quality reasoning steps, agents may use sequential-thinking to work through architectural implications, standards trade-offs, or quality justification.

## Output

For each review step:
- Step name and scope
- Recommended agent type / expertise
- Model tier (@ContextScout or @ContextInsurgent)
- Reasoning for routing choice
- Any tool requirements or special instructions

Call `next_step()` to proceed to plan design.
