# Write Prompts & Finalize Artifacts

Your task is to **write all prompt files and finalize the review project DAG**.

## What You Write

Based on the approved plan, create:

### 1. plan.json
The executable DAG configuration with all nodes, types, and routing defined.

### 2. prompts/session-overview.md
Context for the reviewing agent. Include:
- Review target and scope
- Review purpose and stakeholder context
- Quality criteria and applicable standards
- Assessment step overview
- Coverage map and depth expectations
- Note: "Conduct systematic evaluation against defined quality standards. Findings should be specific, actionable, and tied to best practices and standards."

### 3. prompts/{assessment-step}.md
One prompt per review step. For each:
- Clear instruction on what quality dimension/area to evaluate
- Applicable criteria and standards for this step
- What findings format is needed (violations, scores, narrative)
- How to present results (structured, linked to standards)
- How to advance to next node

### 4. Updated prompts/finalize.md
The review's terminal node:
- Compile all findings
- Generate review report
- Highlight standards violations and best practice gaps
- Close the session

## Writing Guidelines

**Quality-Focused Prompts:**
- Reference applicable standards and best practices for each step
- Ask agents to tie findings to quality criteria
- For @ContextInsurgent steps: emphasize judgment calls, standards trade-offs, architectural implications
- Suggest sequential-thinking for complex reasoning (e.g., determining if quality gap is critical vs. minor)

**Plan.json Validation:**
- Confirm all node references in `next` fields exist in `nodes`
- Confirm all prompt file paths are correct
- Ensure terminal node (finalize) has no `next` field
- Valid JSON syntax (will be checked in finalize step)

## Output

Create:
```
.opencode/session-plans/{review-name}/
  plan.json
  prompts/
    session-overview.md
    {assessment-step-1}.md
    {assessment-step-2}.md
    ...
    finalize.md
```

Call `next_step()` to proceed to finalize validation.
