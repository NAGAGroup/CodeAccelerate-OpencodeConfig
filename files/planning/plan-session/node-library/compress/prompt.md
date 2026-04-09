**Plan Name:** {{PLAN_NAME}}
**Required Skills:** None
**Required Tools:** compress
**Optional Tools:** None
**Questions Allowed?:** No

<goal>
Compress closed conversation sections to free context window space.
</goal>

<instructions>
1. Identify sections where work is complete — investigation that produced clear findings, implementation that was finished and verified, exploration that reached a conclusion.
2. Use the compress tool to compress each closed section into a dense summary that preserves every decision, constraint, and key finding.
3. Call next_step.
</instructions>

<check>
1. Which sections are genuinely closed — work is done and findings are stored to qdrant?
2. Are there sections still actively referenced or needed for the immediate next step that should stay uncompressed?
3. Am I preserving every decision and constraint in my summaries — the original content will be gone?
</check>
