# Collaborative Planning: Clarify Design Context

**Phase:** CORE  
**Purpose:** Ask design-context questions to resolve unknowns from idea-intake and context-gather  
**Duration:** 3-5 minutes  
**Domain:** Collaborative design exploration

---

## Task

With raw idea and scout findings in hand, ask clarifying questions to resolve design constraints, goals, and trade-off boundaries. These questions only make sense **after** gathering context. (Improvement 11: Questions move downstream with context.)

## Design-Context Questions

Ask (in conversational order):

1. **Design Scope & Constraints**
   - "What are the hard constraints for this design? (e.g., backward compatibility, performance SLAs, team size, timeline)"
   - "Are there deployment or infrastructure constraints that shape the design?"

2. **Goals & Success Criteria**
   - "What does success look like for this design? (e.g., response time under 50ms, support 1000+ concurrent users, reduce code duplication by 30%)"
   - "What trade-offs are acceptable? (e.g., complexity vs. performance, maintainability vs. throughput)"

3. **Design Boundaries**
   - "Which parts of the system are in scope? Which are off-limits?"
   - "Are there existing designs or patterns this must integrate with or extend?"

4. **Stakeholder Alignment**
   - "Who needs to approve or sign off on this design?"
   - "Are there known disagreements or alternative proposals on the table?"

5. **Unknowns & Risks**
   - "What's the biggest unknown in this design problem?"
   - "Are there edge cases, load patterns, or failure modes we should design for?"

## Sequential Thinking for Complex Reasoning (Improvement B2)

If clarifying reveals competing constraints (e.g., performance vs. maintainability, immediate deadline vs. long-term scalability):
- Suggest using **sequential-thinking** to reason through trade-offs
- Example: "For this design, consider using sequential-thinking to reason through the performance vs. maintainability trade-off before proposing solutions."

## Output

```
## Clarified Design Context

### Hard Constraints
- [Constraint 1]: Why it matters, impact on design
- [Constraint 2]: ...

### Success Criteria & Trade-Offs
- Success metric 1: [Measurable goal]
- Trade-off 1: Acceptable? (e.g., "accept 5% perf hit for 40% code reduction")

### Design Scope
- In scope: [Modules/layers/features]
- Off-limits: [What can't change, what's blocked]

### Stakeholders & Approval
- Decision makers: [Who approves]
- Known disagreements: [Alternative proposals, debates]

### Unknowns & Risks
- Biggest unknown: [What's not yet clear]
- Edge cases to design for: [Load patterns, failure modes, data scenarios]
```

---

**See also:**
- `planning-audit-spec.md` Improvement 11 (Intake clarity, downstream questions)
- `planning-audit-spec.md` Section B2 (Sequential thinking for complex reasoning)
