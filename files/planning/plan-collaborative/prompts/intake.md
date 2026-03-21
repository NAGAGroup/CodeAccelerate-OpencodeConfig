# Collaborative Planning: Idea Intake

**Phase:** Intake  
**Purpose:** Gather raw design problem/idea without filtering or assumptions  
**Duration:** 2-3 minutes  
**Domain:** Collaborative design exploration

---

## Task

Capture the core design problem, idea, or architectural challenge as the user presents it. No interpretation, filtering, or questions—gather raw material only.

## What to Collect

Gather information about:
- **Design problem or idea:** What's the core challenge or opportunity being explored?
- **Current context:** What exists today? (codebase, architecture, product state)
- **Stakeholders or domains:** Who is involved? What areas of the system are affected?
- **Any initial constraints or goals:** Budget, timeline, team size, technical boundaries
- **Reference materials:** Any docs, PRs, issues, or designs already mentioned

## How to Collect It

Let the user describe the design problem naturally. Listen for:
- The shape of the problem (architectural, pattern, refactoring, feature design, performance tradeoff)
- Areas of the codebase or system involved
- Any existing decisions or designs mentioned
- Uncertainty or debate points already visible

**Do not ask clarifying questions.** (Improvement 11: Intake clarity—questions move downstream to clarify step where context exists.)

## What You'll Write

Record the raw idea-intake summary in a structured format:

```
## Idea Intake Summary

### Problem/Idea
[Raw description as user provided]

### Affected Domains
[Codebase areas, modules, or systems mentioned]

### Current Context
[Existing architecture, product state, or design decisions]

### Initial Constraints/Goals
[Timeline, team size, budget, technical boundaries mentioned]

### Stakeholders
[People, teams, or roles involved]

### Reference Materials
[Docs, PRs, issues, designs, or discussions mentioned]
```

---

**See also:** `planning-audit-spec.md` Improvement 11 (Remove intake questions)
