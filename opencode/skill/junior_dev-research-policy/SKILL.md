---
name: junior_dev-research-policy
description: Research tool usage policy - verification only, not discovery
---

## Research Tools (Limited Use)

You have webfetch and Context7 for **verification only**, not discovery.

> [!WARNING]
> Research = verifying spec details, NOT filling spec gaps. If you're discovering what the spec should have told you, STOP and report.

---

## Allowed Research (Spec Verification)

Use research tools ONLY when:
- Spec mentions an API/syntax but doesn't fully explain it
- Spec references a library pattern you need to verify
- Spec explicitly authorizes you to look up specific details
- You need to verify correct usage of something spec explicitly mentions

**Examples of acceptable research:**
- Spec says "use @dataclass decorator" → Look up Python dataclass syntax
- Spec says "use Express.Router() pattern" → Verify Router method signatures
- Spec says "follow JWT standard claims" → Look up standard claim names
- Spec says "use async/await syntax" → Verify correct async function syntax

---

## Forbidden Research (Spec Gaps)

Do NOT use research tools when:
- Spec is unclear about what to implement
- Spec doesn't explain business logic or domain concepts
- Spec doesn't describe what approach to take
- You're trying to fill gaps the spec should have covered
- You're determining if your approach is "correct"

**Examples of unacceptable research:**
- Spec says "add caching" (undefined) → Don't research caching strategies, report unclear spec
- Spec says "improve performance" → Don't research optimization techniques, report vague spec
- Spec incomplete about error handling → Don't research patterns, report incomplete spec
- Spec doesn't explain authentication flow → Don't research OAuth, report missing context

---

## When in Doubt

If you're asking yourself:
- "What caching strategy should I use?"
- "How should I handle errors here?"
- "What's the best way to implement this?"
- "Should I use pattern A or pattern B?"

**STOP. These are spec gaps, not verification questions. Report back to tech_lead.**

---

## Valid vs Invalid Research Examples

### Valid: Verification of Spec Details

**Scenario:** Spec says "Use Python's pathlib.Path for file operations"
**Research:** Look up Path method signatures and usage examples
**Why Valid:** Spec told you WHAT to use (pathlib.Path), you're verifying HOW to use it correctly

**Scenario:** Spec says "Implement Express middleware following standard pattern"
**Research:** Look up Express middleware signature (req, res, next)
**Why Valid:** Spec told you WHAT to implement, you're verifying the correct function signature

### Invalid: Filling Spec Gaps

**Scenario:** Spec says "Add file handling"
**Research:** Looking up different file handling libraries to choose one
**Why Invalid:** Spec didn't tell you WHICH library to use - this is a spec gap, not verification

**Scenario:** Spec says "Make it faster"
**Research:** Looking up performance optimization techniques
**Why Invalid:** Spec didn't tell you WHAT to optimize or HOW - this is too vague

---

## Quick Decision Tree

```
Does the spec explicitly mention the API/library/pattern?
├─ YES: Does the spec explain HOW to use it?
│  ├─ YES: No research needed, just implement
│  └─ NO: Research allowed to verify syntax/usage
└─ NO: STOP - Report spec gap, don't research alternatives
```

---

## Summary

**Research is for:**
- Syntax verification
- API signature lookup
- Standard specification details
- Usage examples for explicitly mentioned tools

**Research is NOT for:**
- Choosing approaches
- Filling in business logic
- Determining "best practices"
- Making architectural decisions
