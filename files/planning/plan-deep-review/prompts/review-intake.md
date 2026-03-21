# Review Intake

Your task is to **gather raw information about the review scope and quality concerns**.

## What to Do

Collect from the user:
1. **Review Target** — What is being reviewed? (Code, design, document, system, feature)
2. **Review Context** — Where does this fit? System, module, layer, or specific area
3. **Initial Concerns** — What prompted this review? Any known quality issues or triggers
4. **Rough Scope** — Approximate size and boundaries of what may be in scope
5. **Available Context** — Links, documentation, or prior review history relevant to this target

Gather raw information only. Do not ask clarifying questions about quality standards, evaluation criteria, or scope boundaries — those come later when context exists.

## Output

Summarize what was provided:
- Review target (raw description)
- Review context and trigger
- Initial concerns or quality worries
- Rough scope description
- Available documentation or context

Call `next_step()` when gathered.
