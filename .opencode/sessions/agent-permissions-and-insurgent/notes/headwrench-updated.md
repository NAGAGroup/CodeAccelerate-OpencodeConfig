# HeadWrench Updated — @explorer Removed

**Subtask:** 02
**Date:** 2026-03-10

## Changes Made

File: `opencode/agents/headwrench.md`

### Delegation Rules section
- Removed: `- **@explorer** — quick codebase searches during debug loops`
- Added after @ContextScout: `- **@ContextInsurgent** — complex, multi-file project exploration requiring deep analysis or sequential reasoning. **Ask-only**: always invoke the 'question' tool to get user confirmation before delegating to ContextInsurgent.`

### Build-Test-Debug Loop section
- Changed step 2 from: `Delegate to **@explorer** to locate relevant code`
- Changed to: `Delegate to **@ContextScout** (or **@ContextInsurgent** if deep analysis is needed — ask user first) to locate relevant code`

## Verification
- grep for "explorer" in headwrench.md: no matches — fully removed
- ContextInsurgent's ask-only constraint is enforced via HW instruction text ("invoke question tool first"), NOT via permissions frontmatter
