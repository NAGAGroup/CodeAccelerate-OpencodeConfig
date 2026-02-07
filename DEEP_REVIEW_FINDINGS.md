# OpenCode Configuration Deep Review - Findings Report

**Review Date:** 2026-02-07  
**Reviewer:** tech_lead agent  
**Scope:** Complete OpenCode configuration review following recent workflow simplification changes

---

## Executive Summary

This review examined the entire OpenCode configuration system with fresh eyes, focusing on edge cases, workflow gaps, and documentation quality after the recent shift from agent-specific skills to hard plugin-based constraints.

**Key Findings:**
- 3 CRITICAL issues requiring immediate attention (documentation-config mismatches)
- 8 medium-priority inconsistencies and gaps
- 5 edge cases in workflow enforcement (mostly intentional design trade-offs)
- Multiple positive findings confirming robust architecture

**Overall Assessment:** The plugin-based constraint system is architecturally sound and enforcement is robust. However, significant documentation drift has occurred between agent definitions and opencode.json permissions, creating confusion about what agents can actually do.

---

## CRITICAL ISSUES (Fix Immediately)

### 1. Tech_lead curl/jq Documentation Lie

**Severity:** CRITICAL  
**Impact:** Tech_lead documentation claims bash access to curl/jq for CI/CD APIs, but opencode.json DOES NOT grant these permissions

**Evidence:**
- `tech_lead.md` line 63: "CI/CD APIs: `curl` and `jq` for accessing Jenkins, Jira, and other project management APIs"
- `tech_lead.md` line 76: "CI/CD: `curl -s https://jenkins.example.com/api/json | jq .jobs` - YES, run directly"
- `opencode.json` lines 80-107: NO curl or jq bash permissions for tech_lead

**Consequence:** Tech_lead agents will attempt CI/CD research commands and receive permission denied errors, contradicting their role documentation.

**Recommended Fix:** Choose one:
1. **Option A (Recommended):** Remove curl/jq documentation from tech_lead.md - These capabilities were intentionally moved to librarian
2. **Option B:** Add curl/jq bash permissions to tech_lead in opencode.json - Reverts the permission move to librarian

**Rationale:** Based on project memory, research bash permissions (gh cli, curl, jq) were moved FROM tech_lead TO librarian. The documentation should reflect this architectural decision.

---

### 2. Librarian Bash Permissions Completely Undocumented

**Severity:** HIGH  
**Impact:** Librarian has extensive bash research capabilities but librarian.md doesn't mention ANY of them

**Evidence:**
- `opencode.json` lines 166-184 grants librarian:
  - Git operations: `git log`, `git show`, `git diff`, `git status`
  - GitHub CLI: `gh pr`, `gh issue`, `gh repo view`, `gh api`
  - Research tools: `curl`, `jq`
  - File inspection: `cat`, `grep`, `egrep`, `head`, `tail`, `wc`, `less`
- `librarian.md` lines 26-29: Only mentions "Context7" and "webfetch" - NO bash capabilities documented

**Consequence:** Librarian agents may not realize they can use these powerful research tools, limiting their effectiveness.

**Recommended Fix:** Add comprehensive bash capability section to librarian.md:

```markdown
## Research Tools

You have bash access for external research:

**GitHub Exploration:**
- `gh pr view <number>` - View pull request details
- `gh issue list` - List repository issues
- `gh repo view <owner/repo>` - View repository information
- `gh api <endpoint>` - Call GitHub API directly

**CI/CD Research:**
- `curl` - Fetch data from REST APIs
- `jq` - Parse and query JSON responses

**Git History Analysis:**
- `git log` - View commit history
- `git show <commit>` - Show commit details
- `git diff` - Compare changes
- `git status` - Check repository status

**File Inspection:**
- `cat`, `head`, `tail` - Read file contents
- `grep`, `egrep` - Search file contents
- `wc` - Count lines/words/characters
- `less` - Page through files
```

---

### 3. tech-lead-tools Skill Zombie State

**Severity:** HIGH  
**Impact:** Skill existence conflicts with stated architectural philosophy and creates confusion

**Evidence:**
- Project memory states: "Eliminated tech-lead-tools skill (redundant with plugin enforcement)"
- `tech_lead.md` line 226: Claims "tech-lead-tools" is "automatically loaded at session start"
- Skill file exists at `/opencode/skill/tech-lead-tools/SKILL.md`
- `opencode.json` lines 57-64: tech-lead-tools is NOT in required_skills list

**Philosophical Conflict:**
- Project memory: "Plugins provide hard blocks that skills cannot override - enforcement beats guidance"
- tech-lead-tools skill: Provides guidance on tool usage when hard plugin enforcement makes guidance redundant

**Consequence:** Documentation claims skill is loaded, but it's not. Skill content conflicts with "hard constraints via plugins" philosophy.

**Recommended Fix:** Choose one:
1. **Option A (Recommended):** DELETE tech-lead-tools skill entirely + remove reference from tech_lead.md
   - Rationale: Plugin enforcement makes guidance redundant
   - Permission injection via formatPermissionsForAgent() already shows agents their allowed tools
2. **Option B:** Add tech-lead-tools to required_skills in opencode.json + rewrite skill to acknowledge plugin enforcement
   - Less recommended - adds redundancy

---

## EDGE CASES IN WORKFLOW SYSTEM

### 4. Out-of-Order Step Completion Allowed

**Behavior:** Workflow steps can be marked complete in illogical order  
**Example:** `skip_librarian()` can be called BEFORE `explore_initial` completes  
**Risk Level:** MEDIUM

**Technical Details:**
- workflow-constraints.ts tracks step completion in boolean object
- No enforcement of sequential ordering
- Each step can be marked complete independently

**Assessment:** This appears to be intentional flexibility rather than a bug:
- Allows agents to skip research if not needed
- Doesn't force rigid ordering when parallel exploration makes sense
- Five-step requirement ensures minimum process, not rigid ordering

**Recommendation:** Document this flexibility explicitly in workflow command descriptions. Add note: "Steps can be completed in any order, but all 5 must complete before proceeding."

---

### 5. Compaction Destroys Workflow State

**Behavior:** Session compaction deletes workflowState, forcing workflow restart  
**Risk Level:** MEDIUM  
**Impact:** Agent loses all workflow progress and must restart from step 1

**Technical Details:**
- `workflow-constraints.ts` line 263: `workflowState.delete(sessionID)` on compaction
- No state persistence mechanism
- Fresh session = fresh workflow state

**Assessment:** This is an intentional design trade-off:
- **Pro:** Simplicity - no complex state persistence logic
- **Pro:** Fresh start ensures understanding of new context after compaction
- **Con:** Workflow progress lost mid-session
- **Con:** Agent frustration if close to completion

**Recommendation:** Add documentation warning in workflow commands:
> [!WARNING]
> If session compacts mid-workflow, all workflow progress will be lost. You'll need to restart from step 1. This ensures you understand the compacted context before proceeding.

---

### 6. Multiple Explore Calls Count Correctly But Could Be Clearer

**Behavior:** exploreCallCount increments on each explore delegation  
**Risk Level:** LOW  
**Logic:** First call = explore_initial, second+ calls = explore_specialized

**Edge Case:** If agent calls explore 5 times:
- Call 1: Sets explore_initial = true
- Call 2: Sets explore_specialized = true
- Calls 3-5: No effect on workflow state (already marked complete)

**Assessment:** Works as designed. The "2+ explore delegations" requirement is satisfied.

**Recommendation:** No code changes needed. Consider clarifying in workflow documentation that "specialized exploration" means "2 or more total explore delegations."

---

### 7. Skip Functions Can Complete Steps Out of Sequence

**Behavior:** `skip_librarian()` and `skip_questions()` can be called before earlier steps complete  
**Risk Level:** LOW  
**Example:** Agent could call skip_librarian before doing any explore work

**Technical Details:**
- Lines 277-284, 302-309 in workflow-constraints.ts
- Only checks: Is workflow active? (not: Are previous steps complete?)
- Marks step complete regardless of other step states

**Assessment:** Intentional flexibility - allows agents to declare "I don't need research" early in the process.

**Recommendation:** Accept as designed. The workflow enforces "all 5 steps complete" not "steps in rigid order."

---

## INCONSISTENCIES & CONTRADICTIONS

### 8. Explore Agent "No bash execution" Claim is False

**Severity:** MEDIUM  
**Location:** `explore.md` line 39 vs `opencode.json` lines 130-135

**Contradiction:**
- `explore.md` line 39: "No bash execution"
- `opencode.json` lines 130-135: Grants git diff/log/show/status bash access

**Impact:** Explore agents may not realize they can inspect git history for code evolution analysis.

**Recommended Fix:** Update explore.md to document git history capabilities:

```markdown
## Git History Access

You have selective bash access for git history inspection:
- `git diff` - Compare code changes
- `git log` - View commit history
- `git show` - Show specific commits
- `git status` - Check repository state

Use these to understand code evolution patterns and historical context.
```

---

### 9. "Build Agent" Terminology Confusion

**Severity:** MEDIUM  
**Locations:** tech-lead-delegation.md, callout-boxes.md, workflow commands

**Issue:** Multiple skills reference a "build agent" but agent naming is inconsistent:
- Skills say: "build agent"
- opencode.json has: "build" agent (lines 26-40)
- No "build_agent" with underscore

**Impact:** Users searching for "build agent" won't find clear guidance on when/how to use it.

**Recommended Fix:** Standardize terminology:
1. Update all skill references to say "build agent (agent name: 'build')"
2. Add brief description of build agent's purpose to tech-lead-delegation.md
3. Consider: Should it be renamed to "build_agent" for consistency with junior_dev, test_runner naming?

---

### 10. Context7 Capitalization Inconsistent

**Severity:** LOW  
**Locations:** librarian.md, librarian-research-protocol.md, opencode.json

**Inconsistency:**
- `librarian.md`: "Context7" (capitalized)
- `librarian-research-protocol.md`: "context7" (lowercase)
- `opencode.json`: "context7" (lowercase in config key)

**Recommended Fix:** Standardize to "Context7" (capitalized) in prose, "context7" in code/config references:
- "Use Context7 for research" (prose)
- `context7({ query: "..." })` (code)

---

### 11. Required Skills List Mismatch in tech_lead.md

**Severity:** MEDIUM  
**Location:** `tech_lead.md` line 226

**Issue:** Documentation claims three skills are "automatically loaded":
- tech-lead-questions ✓ (in opencode.json)
- tech-lead-tools ✗ (NOT in opencode.json)
- tech-lead-delegation ✓ (in opencode.json)

**Actual required_skills (opencode.json lines 57-64):**
- skill-invocation-policy
- unicode-usage
- callout-boxes
- tech-lead-questions
- tech-lead-delegation
- tech-lead-memory-usage
- todo-usage

**Recommended Fix:** Update tech_lead.md line 226 to match opencode.json reality, or remove the parenthetical note entirely.

---

## WORKFLOW GAPS

### 12. No Guidance on Workflow Activation Failure

**Gap:** If agent tries `skip_librarian()` or `skip_questions()` without workflow activation, receives error: "No active workflow. Use /workflow-create-session-goal or /workflow-execute-session-goal first."

**Issue:** No agent documentation explains when/how to activate workflow, or what "active workflow" means.

**Impact:** MEDIUM - Confusing for agents not following workflow commands

**Recommended Fix:** Add section to tech_lead.md:

```markdown
## Workflow Activation

The workflow-constraints plugin requires activation before workflow steps are tracked:

**Activate workflow with:**
- `/workflow-create-session-goal` - For requirement analysis and planning
- `/workflow-execute-session-goal` - For implementation work

**Without activation:**
- skip_librarian() and skip_questions() will fail
- Workflow step tracking is disabled
- Tools are available immediately (no 5-step requirement)

**With activation:**
- Must complete 5 steps before using read/glob/grep/edit/write/bash
- Workflow state tracked per session
- Compaction resets workflow state
```

---

### 13. Permission Injection Timing Not Documented

**Gap:** formatPermissionsForAgent() runs after session start and after compaction, but no agent documentation explains when they'll see permission blocks.

**Impact:** LOW - System works fine, just undocumented

**Recommended Fix:** Add note to tech_lead.md:

```markdown
## Permission Visibility

At session start and after compaction, you'll receive a permission block showing your exact allowed tools. This is auto-generated from opencode.json and makes your capabilities self-documenting.
```

---

### 14. Workflow Step Completion Not Visible to Agent

**Gap:** Agents have no way to check "which workflow steps have I completed?"

**Impact:** MEDIUM - Agents may repeat steps unnecessarily or wonder what's left

**Potential Enhancement:** Consider adding a tool:
```typescript
workflow_status() → Returns current workflow state and remaining steps
```

This would help agents understand their progress without trial-and-error.

---

## PROMPT QUALITY ASSESSMENT

### 15. Workflow Constraint Guidance Message is Excellent ✓

**Location:** workflow-constraints.ts lines 241-257

**Strengths:**
- Clear header: `[Workflow Required: Create Session Goal]`
- Lists remaining steps with checkboxes
- Explains WHY each step matters
- Tells agent exactly what to do next
- Actionable and specific

**Assessment:** This is a model for good constraint violation messaging. No changes needed.

---

### 16. tech-lead-tools Skill Reads Like Pre-Plugin Era

**Location:** `/opencode/skill/tech-lead-tools/SKILL.md`

**Issue:** Skill provides guidance on tool usage when hard plugin enforcement makes guidance redundant.

**Example:** Line 8 states "You MUST create a todolist before using ANY tools" - but agent-guardrails.ts plugin enforces this at execution time.

**Impact:** MEDIUM - Philosophical confusion (guidance vs enforcement)

**Recommended Fix:**
1. **If keeping skill:** Rewrite to acknowledge plugin enforcement:
   ```markdown
   ## Tool Access (Plugin-Enforced)
   
   The workflow-constraints plugin enforces tool access rules. You'll receive
   clear error messages if you attempt to use tools before completing workflow steps.
   
   This skill provides context on WHY these constraints exist and HOW to work within them.
   ```

2. **If deleting skill:** Remove file and references (see Critical Issue #3)

---

### 17. Agent Role Definitions Are Clear and Well-Structured ✓

**Assessment:** All five agent role definitions (tech_lead.md, explore.md, librarian.md, junior_dev.md, test_runner.md) follow consistent structure:
- Clear "Core Identity" section
- "Critical Constraints" with callout boxes
- "Core Workflow" with examples
- "Pre-Response Checklist" for self-guidance

**Minor Issues:** Documented in other sections (bash permission mismatches)

**Overall:** Strong foundation, just needs permission documentation updates.

---

## POSITIVE FINDINGS

### 18. Permission Injection System is Self-Documenting ✓

**Strength:** formatPermissionsForAgent() makes opencode.json visible to agents

**Benefits:**
- Agents see exactly what tools they can use
- No guessing about permissions
- Configuration is embedded in runtime behavior
- Automatically updates if opencode.json changes

**Assessment:** Excellent design pattern. This should be highlighted as a key architectural strength.

---

### 19. Delegation Skills Are Consistent ✓

**Assessment:** All -task skills follow same Jinja2 template pattern:
- Clear required fields with descriptions
- Consistent structure across junior_dev-task, librarian-task, explore-task, test_runner-task
- Good use of multiline for complex fields

**No issues found.**

---

### 20. No Unicode Violations Found ✓

**Assessment:** All agent definitions and skills follow unicode-usage policy:
- Proper use of [OK], [X], [!] instead of emojis
- Callout boxes used correctly throughout
- No smart quotes or decorative bullets
- Arrows and box-drawing used appropriately

**Note:** unicode-usage skill itself contains emojis IN EXAMPLES (to show what NOT to do), which is appropriate.

**No issues found.**

---

### 21. Plugin Enforcement is Robust ✓

**Assessment:** The workflow-constraints plugin provides hard blocking that cannot be bypassed:
- tool.execute.before hook intercepts before execution
- State tracking per session prevents cross-contamination
- Compaction cleanup prevents zombie states
- Error messages are clear and actionable

**Architectural Insight:** This validates the "enforcement beats guidance" philosophy stated in project memory.

---

### 22. Cost Optimization Strategy is Clear ✓

**Assessment:** Agent-model assignments in opencode.json show clear cost optimization:
- Haiku (4.5) for routine tasks: explore, junior_dev, test_runner
- Sonnet (4.5) for complex synthesis: tech_lead, librarian
- Well-documented in configuration

**No issues found.**

---

## RECOMMENDATIONS BY PRIORITY

### Immediate Action (This Week)

1. **Fix tech_lead curl/jq documentation lie** → Remove lines 63, 76 from tech_lead.md
2. **Document librarian bash capabilities** → Add comprehensive section to librarian.md
3. **Resolve tech-lead-tools zombie state** → Delete skill file + remove tech_lead.md reference

### High Priority (This Sprint)

4. **Document explore git capabilities** → Update explore.md to mention git diff/log/show/status
5. **Clarify "build agent" terminology** → Standardize references across all skills
6. **Update tech_lead required_skills documentation** → Fix line 226 mismatch

### Medium Priority (Next Sprint)

7. **Add workflow activation documentation** → Explain when/how workflow is activated
8. **Document out-of-order step completion** → Clarify that steps can complete in any order
9. **Add compaction warning** → Warn about workflow state loss on compaction
10. **Standardize Context7 capitalization** → Apply consistent convention

### Future Enhancements (Backlog)

11. **Consider workflow_status() tool** → Help agents track workflow progress
12. **Create permissions matrix document** → Single source of truth for all agent bash permissions
13. **Evaluate tech-lead-tools rewrite** → If keeping, rewrite to acknowledge plugin enforcement

---

## ARCHITECTURAL VALIDATION

### What's Working Well

1. **Plugin-based constraint enforcement** - Hard blocks are effective and cannot be bypassed
2. **Permission injection system** - Makes configuration self-documenting
3. **Cost optimization** - Haiku for routine work, Sonnet for synthesis
4. **Delegation architecture** - Clear separation of concerns across agents
5. **Workflow step enforcement** - 5-step process ensures thorough understanding before implementation
6. **Error messaging** - Constraint violations provide clear, actionable guidance

### Design Trade-offs Validated

1. **Compaction loses workflow state** - Simplicity over persistence (acceptable trade-off)
2. **Out-of-order step completion** - Flexibility over rigid ordering (intentional design)
3. **No workflow progress visibility** - Simplicity over convenience (could be enhanced later)

### Philosophy Alignment

The recent shift from "agent-specific skills to hard plugin-based constraints" is architecturally sound and well-executed. The core insight - **"Plugins provide hard blocks that skills cannot override - enforcement beats guidance"** - is validated by this review.

---

## CONCLUSION

The OpenCode configuration system is architecturally robust with effective constraint enforcement. The primary issues are **documentation drift** between agent role definitions and opencode.json permissions.

**Critical Path:**
1. Fix tech_lead curl/jq documentation (remove false claims)
2. Document librarian bash capabilities (add missing section)
3. Resolve tech-lead-tools skill status (delete or update)

After addressing these three critical issues, the configuration will be in excellent shape.

**Overall Grade: B+** (would be A- after fixing documentation drift)
