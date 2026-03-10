<!-- Context: project-intelligence/notes | Priority: high | Version: 1.1 | Updated: 2026-03-03 -->

# Living Notes

> Active issues, technical debt, open questions, and insights that don't fit elsewhere. Keep this alive.

## Quick Reference

- **Purpose**: Capture current state, problems, and open questions
- **Update**: When status changes
- **Archive**: Move resolved items to bottom with status

## ⚠️ Active: Repo Mid-Transition (as of 2026-03-03)

This repo recently switched from a handrolled OpenCode config to one based on [OpenAgentsControl (OAC)](https://github.com/darrenhinde/OpenAgentsControl).

**What this means**:
- `docs/`, `AGENTS.md`, and other documentation files are **stale and not yet updated**
- Do NOT rely on existing docs as accurate descriptions of the current architecture
- Treat `opencode/opencode.json`, the OAC repo, and these context files as the source of truth
- The install model changed: global config (`opencode/`) = personal overrides only; project patterns go in per-project `.opencode/` installs

**Status**: In progress — docs update is pending

## Technical Debt

| Item | Impact | Priority | Mitigation |
|------|--------|----------|------------|
| [Debt item] | [What risk it creates] | [High/Med/Low] | [How to manage] |

### Technical Debt Details

**[Debt Item]**  
*Priority*: [High/Med/Low]  
*Impact*: [What happens if not addressed]  
*Root Cause*: [Why this debt exists]  
*Proposed Solution*: [How to fix it]  
*Effort*: [Small/Medium/Large]  
*Status*: [Acknowledged | Scheduled | In Progress | Deferred]

## Open Questions

| Question | Stakeholders | Status | Next Action |
|----------|--------------|--------|-------------|
| [Question] | [Who needs to decide] | [Open/In Progress] | [What needs to happen] |

### Open Question Details

**[Question]**  
*Context*: [Why this question matters]  
*Stakeholders*: [Who needs to be involved]  
*Options*: [What are the possibilities]  
*Timeline*: [When does this need resolution]  
*Status*: [Open/In Progress/Blocked]

## Known Issues

| Issue | Severity | Workaround | Status |
|-------|----------|------------|--------|
| [Issue] | [Critical/High/Med/Low] | [Temporary fix] | [Known/In Progress/Fixed] |

### Issue Details

**[Issue Title]**  
*Severity*: [Critical/High/Med/Low]  
*Impact*: [Who/what is affected]  
*Reproduction*: [Steps to reproduce if applicable]  
*Workaround*: [Temporary solution if exists]  
*Root Cause*: [If known]  
*Fix Plan*: [How to properly fix]  
*Status*: [Known/In Progress/Fixed in vX.X]

## Insights & Lessons Learned

### What Works Well
- [Positive pattern 1] - [Why it works]
- [Positive pattern 2] - [Why it works]

### What Could Be Better
- [Area for improvement 1] - [Why it's a problem]
- [Area for improvement 2] - [Why it's a problem]

### Lessons Learned
- [Lesson 1] - [Context and implication]
- [Lesson 2] - [Context and implication]

## Patterns & Conventions

### Code Patterns Worth Preserving
- [Pattern 1] - [Where it lives, why it's good]
- [Pattern 2] - [Where it lives, why it's good]

### Gotchas for Maintainers
- [Gotcha 1] - [What to watch out for]
- [Gotcha 2] - [What to watch out for]

## Active Projects

| Project | Goal | Owner | Timeline |
|---------|------|-------|----------|
| [Project] | [What we're doing] | [Who owns it] | [When it matters] |

## Archive (Resolved Items)

Moved here for historical reference. Current team should refer to current notes above.

### Resolved: [Item]
- **Resolved**: [Date]
- **Resolution**: [What was decided/done]
- **Learnings**: [What we learned from this]

## Onboarding Checklist

- [ ] Review known technical debt and understand impact
- [ ] Know what open questions exist and who's involved
- [ ] Understand current issues and workarounds
- [ ] Be aware of patterns and gotchas
- [ ] Know active projects and timelines
- [ ] Understand the team's priorities

## Related Files

- `decisions-log.md` - Past decisions that inform current state
- `business-domain.md` - Business context for current priorities
- `technical-domain.md` - Technical context for current state
- `business-tech-bridge.md` - Context for current trade-offs
