# Subtask 01 — context-management-upgrades

## Delegation
**Agent:** @config-implementer  
**Reason:** File editing task requiring targeted additions to an existing protocol document — standard implementation work.

---

## Objective

Update `opencode/protocols/context-management.md` to incorporate three research findings from the config-reimplementation-research session:

1. **Add `freshness_sla` and `context_type` fields** to the YAML front-matter schema for both inbox items and context files (Tier 2/3). These fields support the SLA-based staleness model from research Round 3.
2. **Add 60% utilization cliff guidance** — Liu et al. "Lost in the Middle" finding: performance drops 30%+ for mid-context info at 60-70% utilization. Add a callout in the relevant section advising agents to trigger compaction before reaching 60% context utilization, and to place critical information at start/end of context (position-aware placement).
3. **Add `active: false` skip rule** to the ContextScout Reading Scope section — currently the section lists what's in scope but doesn't explicitly tell ContextScout to skip files where `active: false` or `superseded_by:` is set. This skip rule should be explicit.

---

## Scope

### In Scope
- `opencode/protocols/context-management.md` — sole target file

### Out of Scope
- All other files
- Restructuring or reorganizing existing sections
- Changing existing field definitions (only adding new fields)

---

## Patterns

- Follow existing YAML table format for field definitions (| Field | Files | Required | Description |)
- Follow existing callout/note style (`>` blockquotes for important guidance)
- New fields go in the "Metadata Headers" section alongside existing fields
- 60% cliff guidance belongs in a new subsection or callout within the "Staleness Rules" section
- Keep additions minimal and precise — do not rewrite existing content

---

## Constraints

- Do NOT commit any files. HeadWrench owns all git commits.
- Do NOT restructure existing sections — only add new content
- `freshness_sla` should accept a duration string (e.g., `"7d"`, `"30d"`, `"never"`) or null
- `context_type` should accept one of: `"pattern"`, `"decision"`, `"convention"`, `"reference"`, `"finding"` or null
- The 60% cliff is from Liu et al. (2023) — cite this in the callout
- `active` field skip rule: "Skip files where `active: false` or `superseded_by:` is set to a non-null value"

---

## Success Criteria

- `context-management.md` contains `freshness_sla` and `context_type` in the field definitions table
- Both fields have clear descriptions of accepted values
- A 60% cliff callout exists in the Staleness Rules section with the Liu et al. reference
- The ContextScout Reading Scope section explicitly states to skip `active: false` and `superseded_by:` files

---

## Todolist

- [ ] Read `opencode/protocols/context-management.md` in full
- [ ] Add `freshness_sla` and `context_type` to the YAML schema field definitions table (both inbox and context file headers)
- [ ] Add example values for both new fields to the existing header examples
- [ ] Add 60% utilization cliff callout to the Staleness Rules section
- [ ] Add explicit skip rule for `active: false` / `superseded_by:` in ContextScout Reading Scope
- [ ] [⏸ PAUSE] — Summarize all changes made, show key additions, wait for user sign-off before checkpoint
