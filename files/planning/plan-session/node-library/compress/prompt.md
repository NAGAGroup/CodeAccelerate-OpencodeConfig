# DAG Node: Compress
**Skills:** None
**Thinking Required:** No
**Questions Allowed:** No
**Required Tools:** compress
**Optional Tools:** None
**Delegated Subagent:** None

# Goal
Compress closed conversation sections to free context window space.

## Instructions
Identify sections where work is complete — investigation that produced clear findings, implementation that was finished and verified, exploration that reached a conclusion. Compress each closed section into a dense technical summary that preserves every decision, file path, function signature, constraint, and key finding. Prefer compressing larger ranges over many small ones. Sections that are still actively referenced or that contain content needed for the immediate next step should remain uncompressed.

## Constraints
- The summary becomes the authoritative record; the original content will be gone
- Preserve every decision, file path, function signature, constraint, and key finding in summaries
- Do not compress sections that are still actively referenced or needed for immediate next steps
