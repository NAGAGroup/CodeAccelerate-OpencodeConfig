---
topic: docwriter-format-autonomy
tier: global
promoted_from: inbox
session: roadmap-and-feature-tracking
created: 2026-03-10
last_reviewed: 2026-03-15
supersedes: ~
superseded_by: ~
---

# DocWriter: Format Autonomy

When DocWriter is given a format pattern (e.g., `▶️ feature-name — description` inline list), it may upgrade to a richer format (e.g., a table with Status/Feature/Description columns) if it determines that's more scannable based on reference files it reads.

## Pattern

DocWriter makes reasonable format upgrades when reading reference files (FEATURES.md, CHANGELOG.md) and finding a consistent richer style. It will deviate from inline examples in specs if a richer format is available in the reference material.

## Implication

If you need a specific format (e.g., flat list, not table), say so **explicitly in the spec constraints**. Otherwise, DocWriter may choose a richer format based on reference material — which is often a good outcome.
