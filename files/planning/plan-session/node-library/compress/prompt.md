**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** compress
**Optional Tools:** None
**Questions Allowed?:** No

# DAG Node: Compress

## Goal
Compress closed conversation sections to free context window space.

## Instructions

1. Identify sections where work is complete — investigation that produced clear findings, implementation that was finished and verified, exploration that reached a conclusion
2. Use the `compress` tool to compress each closed section into a dense summary that preserves every decision, file path, function signature, constraint, and key finding
3. Call `next_step`

## Thinking through the instructions

<|think|>
- Which sections are genuinely closed — work is done and findings are stored to Qdrant?
- Are there sections still actively referenced or needed for the immediate next step that should stay uncompressed?
- Am I preserving every decision, path, and constraint in my summaries — the original content will be gone?
