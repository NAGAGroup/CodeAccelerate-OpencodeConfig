# Collaborative Planning: Write Prompts

**Phase:** FINALIZE  
**Purpose:** Write all node prompt files (task instructions, gate prompts) from the approved DAG structure  
**Duration:** 10-15 minutes  
**Domain:** Collaborative design exploration

---

## Task

Given the approved plan.json structure from preview-gate, write all prompt files that will guide execution of each DAG node. Each prompt is specific to its task and context.

## Prompt File Structure

For each node in plan.json, create a prompt file at `prompts/[node-id].md`:

**Task Nodes (`agent` type):**
```markdown
# [Node Title]

**Purpose:** [What this task accomplishes in the design journey]  
**Domain:** Collaborative design exploration  
**Complexity:** [Simple / Moderate / Complex]  

---

## Task Description

[Clear, actionable instructions for what to do in this step]

### Key Deliverables
- [Output 1]
- [Output 2]

### Design Patterns to Follow
[If relevant: patterns from approved design; constraints to respect]

### Sequential-Thinking Opportunity
[If marked: suggest when/how to use sequential-thinking]
Example: "For [decision point], consider sequential-thinking to reason through [options]."

### Web Research References
[If marked: suggest tools and what to search for]
Example: "Use exa_web_search to find patterns for [topic]."

### Success Criteria
[How will we know this task is done well?]
- Criterion 1: [Measurable outcome]
- Criterion 2: ...
```

**Gate Nodes (`gate` type):**
```markdown
# [Gate Title]

**Purpose:** [What decision this gate makes]  
**Branches:** [List the options]  
**Domain:** Collaborative design exploration

---

## Gate Decision

[Context from prior nodes; what the decision is about]

### Decision Options

**Option 1: [Branch A]**
- Proceed to: [Next node]
- Reasoning: [When should user choose this?]

**Option 2: [Branch B]**
- Proceed to: [Next node]
- Reasoning: [When should user choose this?]

**Reconsider:** [If available—go back to which node?]
- Go back to: [Earlier node]
- Reason: [When would user reconsider?]
```

## Prompt Writing Principles

1. **Design-focused language** (Domain emphasis)
   - Use architecture, patterns, trade-offs, constraints language
   - Not: "implement the task"
   - Yes: "implement the pattern with these trade-offs in mind"

2. **Context carriage**
   - Each prompt can reference prior steps' outputs
   - Example: "Based on the approved design option from clarify, now implement..."

3. **Agent guidance** (Improvements B2, B3, B4)
   - Mention sequential-thinking for complex reasoning steps
   - Mention @ContextInsurgent routing if needed
   - Reference web research tools where applicable
   - Example: "If this step requires deep understanding of [module interaction], consider routing to @ContextInsurgent."

4. **Clear success criteria**
   - What's the minimum viable output?
   - What makes this step "done"?

## Output

```
## Prompts Writing Summary

### Task Nodes Created
- [node-id]: [title] → `prompts/[node-id].md`

### Gate Nodes Created
- [gate-id]: [title] → `prompts/gates/[gate-id].md`

### Sequential-Thinking Integration
- Nodes using sequential-thinking: [list]
- Complex reasoning points explained: [summary]

### Web Research Integration
- Nodes using exa_web_search: [list]
- Nodes using context7_query-docs: [list]
- Nodes using exa_get_code_context: [list]

### @ContextInsurgent Routing
- Nodes routed to @ContextInsurgent: [list]
- Reasoning for routing: [Summary of design trade-off or complexity triggers]

### File Manifest
- Total prompt files: [N]
- All files location: `prompts/`
- plan.json references: [All verified]
```

---

**See also:**
- `planning-audit-spec.md` Improvement 4 (Finalize split)
- `planning-audit-spec.md` Section B2 (Sequential thinking in generated DAG prompts)
- `planning-audit-spec.md` Section B3 (@ContextInsurgent routing)
