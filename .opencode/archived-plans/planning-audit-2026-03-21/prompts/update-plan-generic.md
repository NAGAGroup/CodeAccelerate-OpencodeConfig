# Task 2: Update plan-generic

Your task is to **apply all improvements from the spec to the generic planning DAG**, the reference template for all other planning DAGs.

## Files to Modify

Location: `/home/jack/.config/opencode/profiles/*/planning/plan-generic/`

Files to update:
1. `prompts/scout.md` — Add @ContextScout parallel dispatch instruction
2. `prompts/agent-routing.md` — Add sequential thinking + @ContextInsurgent routing guidance
3. `prompts/finalize.md` — Refactor into design-plan → preview-gate → write-prompts → finalize
4. `plan.json` — Update node structure to include new nodes and gate

(Optional) `prompts/propose-decomposition.md` — Add sequential thinking encouragement

## Key Improvements to Apply (Ref: planning-audit-spec.md)

### 1. Remove Intake Questions (NEW — Improvement #11)
- Modify `task-intake.md` (and other intake prompts) to **remove all questions**
- Intake should only gather raw information: "Describe the task, goal, acceptance criteria"
- All clarifying questions move to dedicated steps (clarify.md, evaluate-understanding.md)
- Rationale: Agent has zero context at intake; questions stall and confuse; dedicated question steps exist downstream with proper context
- Example change: "What are your constraints?" → removed from intake; asked in clarify/evaluation step with context

### 2. Scout Parallel Dispatch
- Modify `scout.md` to explicitly instruct: "Use @ContextScout agents in parallel when multiple codebase areas need exploration"
- Provide example: parallel scouts for different modules, then gather findings

### 2. Sequential Thinking Integration
- Add to clarify.md, propose-decomposition.md, agent-routing.md: Mention sequential-thinking tool as optional for complex reasoning
- Example: "If decomposition is complex, you may use sequential-thinking to reason through subtask boundaries"

### 3. @ContextInsurgent Routing in Agent-Routing
- Modify agent-routing.md to explicitly mention @ContextInsurgent for deep reasoning:
  - When subtasks require deep codebase understanding across multiple files → route to @ContextInsurgent
  - When task involves refactoring or architecture changes → consider @ContextInsurgent
  - When task is high-stakes or complex → @ContextInsurgent adds reasoning depth

### 4. Web Tools Documentation
- Enhance scout.md to explicitly document exa_web_search, context7_query-docs usage
- Show when scout should dispatch these tools (already partially there; make it more explicit)
- Include decision criteria: "Dispatch web tools when task involves external APIs, libraries, frameworks"

### 5. Remove Intake Questions (NEW — Improvement #11)
- Modify `task-intake.md` to **remove all questions**
- Intake should only gather raw information: "Describe the task, goal, acceptance criteria"
- All clarifying questions move to dedicated `clarify.md` and `evaluate-understanding.md` steps
- Rationale: Agent has zero context at intake; questions stall and confuse; dedicated question steps exist downstream
- Example change: "What are your constraints?" → removed from intake; asked in clarify/evaluation step with context

### 6. Finalize Refactoring (Major Change)
- Current finalize.md: single step writes plan.json + all prompts
- **New structure:**
  - Add new node `design-plan` (before finalize): drafts plan.json structure
  - Add new node `preview-gate` (gate): shows ASCII DAG diagram, node count, branching logic
  - Rename finalize to `write-prompts` → writes all prompt files
  - Keep `finalize` as terminal node with validation + close_session
- **plan.json changes:** Add these 2 new nodes; update next references

### 7. Sequential Thinking in Generated DAGs
- Modify agent-routing.md to recommend: "Generated project DAG prompts should mention sequential-thinking tool for complex reasoning steps"
- Example wording for DAG prompts: "For this complex decomposition, consider using sequential-thinking to reason through options"

## Inputs Expected

- planning-audit-spec.md (ref for all improvements)
- Current state of plan-generic/ prompts and plan.json
- Clarity on finalize node refactoring (design-plan → preview-gate → write-prompts → finalize)

## Outputs Expected

Modified files in `/home/jack/.config/opencode/profiles/*/planning/plan-generic/`:
1. scout.md (with @ContextScout, web tools explicit)
2. agent-routing.md (with sequential thinking, @ContextInsurgent guidance)
3. finalize.md → redesigned into 3 nodes (design-plan, preview-gate, write-prompts + updated finalize)
4. plan.json (updated with new nodes and branching structure)

And optionally:
5. propose-decomposition.md (with sequential thinking mention)
6. clarify.md (with sequential thinking mention)

## How to Proceed

1. Read the current scout.md, agent-routing.md, finalize.md
2. Understand the finalize refactoring (this is the biggest change)
3. Update each file with improvements from the spec
4. Update plan.json to add new nodes if finalize is split
5. Validate plan.json syntax
6. Call `next_step()` when complete

## Notes

- This is the reference DAG; other DAGs will follow similar patterns
- The finalize split is significant but contained — it improves user experience by allowing DAG structure review before full commitment
- All improvements must reference planning-audit-spec.md for consistency
- Build verification happens later; focus on correctness here
