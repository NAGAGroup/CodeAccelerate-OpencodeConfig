# DAG Node: External Research
**Skills:** external-scout-delegation, sequential-thinking
**Thinking Required:** Yes
**Questions Allowed:** No
**Required Tools:** sequential-thinking_sequentialthinking, task
**Optional Tools:** None
**Delegated Subagent:** @external-scout

# Goal
Research external public information that the project depends on or that scout findings raised questions about.

## Instructions
Use sequential-thinking to identify specific research areas — frameworks, libraries, APIs, domain knowledge, assumptions to verify from the scout findings. Dispatch @external-scout with a clear research goal in public, general terms. Ask for findings categorized as verified (read from source), inferred (from summaries), or uncertain.

## Constraints
- use only public terms in the dispatch prompt
- no private project details
- always dispatch even if research need seems minimal
- ask for verification distinctions in findings
