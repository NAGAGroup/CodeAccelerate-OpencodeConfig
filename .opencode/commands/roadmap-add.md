---
description: "Add one or more feature entries to ROADMAP.md and commit the change."
agent: headwrench
---

## Usage

### Mode A — With Arguments
Provide section name and feature(s) directly:
```
/roadmap-add planned "custom agent hot-reload — reload agent defs without restart"
/roadmap-add planned "feature one" "feature two" "feature three"
```

### Mode B — Interactive
No arguments — you will be prompted:
```
/roadmap-add
```

## Behavior

### If arguments provided:
1. Parse the section name (first argument) — must be one of: **In Progress**, **Planned**, **Backlog**, **Recently Shipped**
2. Parse feature string(s) (remaining arguments) — format: `"feature-name — description"`
3. Skip interactive prompts and proceed directly to inserting entries

### If no arguments:
1. Ask: "What feature(s) do you want to add? (Enter name — description, one per line, or type DONE when finished)"
2. Ask: "Which section? (In Progress / Planned / Backlog / Recently Shipped)"
3. Accept user input for both

### For both modes:
1. **Read** `ROADMAP.md` from repo root
2. **Parse** the target section (find the table in that section)
3. **Build** new table rows matching existing format:
   - `| ▶️ | feature-name | description |` for In Progress
   - `| 🔲 | feature-name | description |` for Planned or Backlog
   - `| ✅ | feature-name | description |` for Recently Shipped
4. **Show preview** to user: the new entries and where they'll be inserted
5. **Ask confirmation**: "Add these N feature(s) to [Section]? (yes/no)"
6. **On yes**: 
   - Insert entries into the table
   - Run: `git add ROADMAP.md`
   - Commit with:
     - Single feature: `git commit -m "roadmap: add feature-name"`
     - Multiple: `git commit -m "roadmap: add N features"`
   - Report success with commit hash
7. **On no**: Cancel without changes

## Error Handling

- **Invalid section name**: Show the user the valid sections and ask them to choose again
- **Parse error**: If a feature string doesn't contain " — " separator, ask user to re-enter it in format: `"name — description"`
- **Git error**: Report the error clearly and ask if user wants to retry

## Notes

- Feature name and description must be separated by ` — ` (space-dash-space)
- Section names are case-sensitive and must match ROADMAP.md exactly
- Always get user confirmation before committing
- After commit, show the commit hash for verification
