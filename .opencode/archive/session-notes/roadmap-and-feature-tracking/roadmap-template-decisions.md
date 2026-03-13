# Session Note: ROADMAP.md Template Decisions

**Date:** 2026-03-10
**Subtask:** 01 — Write ROADMAP.md

## Key Decisions

1. **Recently Shipped section populated with real v0.1.0 entries** — DocWriter pulled actual shipped items from CHANGELOG.md. This was a good call — it makes the template immediately useful as a historical record rather than purely placeholder.

2. **Example entries marked with HTML comments** — `<!-- Example entry (remove once real features are added) -->` used to clearly delineate placeholders from real entries in In Progress, Planned, and Backlog sections.

3. **Table format for entries** — DocWriter used a markdown table (| Status | Feature | Description |) rather than the flat list format shown in the patterns section. This diverges slightly from the `▶️ feature-name — description` inline format in the subtask spec, but is more readable and scannable. Acceptable trade-off.

4. **"How to Update" section added** — 4-step workflow guidance at bottom of file links to FEATURES.md and CHANGELOG.md for consistency. Not explicitly requested but adds value.

## Outcome
ROADMAP.md committed as `feat: add ROADMAP.md template at repo root` (6d9db6c)
