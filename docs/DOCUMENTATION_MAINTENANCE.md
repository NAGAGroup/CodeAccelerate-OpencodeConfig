# Documentation Maintenance Guide

This guide explains how to keep OpenCode configuration documentation synchronized with implementation.

---

## Documentation Structure

### Core User Documentation (4 Files)

| File | Purpose | Update When |
|------|---------|-------------|
| **README.md** | Discovery document with high-level overviews and links to detailed documentation | Add/remove agents, workflows, or major features |
| **docs/USAGE.md** | Detailed usage guide, all 9 workflows | Add/remove workflows, change agent capabilities |
| **docs/CONCEPTS.md** | Architecture, design principles | Change architecture patterns or agent roles |
| **FEATURES.md** | Authoritative feature inventory and baseline - single source of truth for counts and capabilities | ANY feature change (agents, guardrails, plugins, skills, workflows) |

### System Documentation

| File | Purpose | Update When |
|------|---------|-------------|
| **AGENTS.md** | Code style, build/test commands | Change dev guidelines or agent responsibilities |
| **opencode/agent/*.md** | Individual agent role definitions | Change agent permissions or constraints |
| **opencode/commands/workflow-*.md** | Individual workflow specifications | Add/remove/modify workflow |
| **opencode/skill/*/SKILL.md** | Skill implementations | Add/remove/modify skill |

---

## The Central Source of Truth: FEATURES.md

**FEATURES.md is your feature set baseline.** It documents:

- Complete feature inventory (agents, guardrails, plugins, skills, workflows)
- Feature interactions and dependencies
- Version history with rationale for changes
- Testing checklist
- Known issues and limitations
- Maintenance guidelines

> [!IMPORTANT]
> Update FEATURES.md FIRST when making changes, then update user-facing docs to match. FEATURES.md is the single source of truth for "what exists and why."

---

## Update Workflow

### 1. Making a Feature Change

When you add, remove, or modify a feature:

```
1. Implement the change (code, config, etc.)
2. Update FEATURES.md immediately
   - Add to relevant section
   - Update version history
   - Document interactions/dependencies
   - Add test scenarios
3. Update user-facing docs (README, USAGE, CONCEPTS)
4. Commit with clear message
5. Test the change against FEATURES.md checklist
```

### 2. Common Change Scenarios

#### Adding a New Workflow

```
Files to update:
1. FEATURES.md - Section 6 (Workflows)
   - Add workflow entry with purpose and enforcement
   - Document any new patterns
   
2. docs/USAGE.md - "Available Workflows" section
   - Add detailed workflow documentation
   - Include example usage
   - Document process steps
   - Update Quick Reference table
   - Add reference to opencode/commands/ for specifications
   
3. opencode/commands/workflow-[name].md (NEW FILE)
   - Create workflow specification
```

#### Adding a New Agent

```
Files to update:
1. FEATURES.md - Section 1 (Agents)
   - Add agent entry to the agent table with model, temperature, role, constraint
   - Add comprehensive permission matrix for new agent
   - This is the point-of-truth for agent capabilities and permissions
   
2. FEATURES.md - Feature Inventory table
   - Increment agent count (from 5 to 6, etc.)
   - This table is the authoritative source for component counts
   
3. docs/CONCEPTS.md - "Agent Roles & When to Use Them" section
   - Add detailed agent description with role explanation
   - Document when to use it and key constraints
   - Add tip box referencing FEATURES.md Section 1
   - Add to delegation flow diagram if applicable
   
4. docs/USAGE.md
   - Reference agent capabilities in relevant sections
   
5. opencode/agent/[name].md (NEW FILE)
   - Create agent role definition with detailed constraints
   
6. opencode.json
   - Add agent configuration with permissions

Note: README.md no longer needs agent count updates - it references FEATURES.md dynamically
```

#### Adding a New Guardrail

```
Files to update:
1. FEATURES.md - Section 2 (Guardrails)
   - Add guardrail entry with description
   - Update guardrail count
   - Document implementation details
   - Add test scenario in Testing section
   
2. README.md - "Guardrails" section
   - Update guardrail count if in overview
   
3. opencode/plugins/agent-guardrails.ts
   - Implement guardrail logic
   
4. opencode/plugins/reflection-prompts/[name].md (if needed)
   - Create reflection prompt for violation
```

#### Adding a New Skill

```
Files to update:
1. FEATURES.md - Section 4 (Skills)
   - Add skill to appropriate category
   - Update skill count
   - Update required_skills in agent table
   
2. README.md - "10 Auto-Loaded Skills" section
   - Update skill count and categories
   
3. docs/CONCEPTS.md - "Skills" section (only if pattern changes)
   - Document new skill category if needed
   
4. opencode/skill/[name]/ (NEW DIRECTORY)
   - Create skill directory with SKILL.md
   
5. opencode.json
   - Add to required_skills for relevant agents
```

#### Removing a Feature (Deprecation)

```
Process:
1. Update FEATURES.md
   - Move to "Removed Features" section
   - Document why removed and when
   - Update counts throughout document
   
2. Update all user-facing docs
   - Remove references
   - Update counts
   - Add deprecation note if users might look for it
   
3. Update version history in FEATURES.md
   - Document removal rationale
   
4. Delete implementation files
   
5. Commit with clear deprecation message
```

---

## Documentation Quality Checklist

Before committing documentation changes, verify:

### Accuracy
- [ ] All counts are correct (agents, workflows, skills, guardrails)
- [ ] Examples use current syntax and patterns
- [ ] File paths reference existing files
- [ ] Cross-references point to correct sections

### Completeness
- [ ] FEATURES.md updated first
- [ ] All relevant user docs updated
- [ ] Version history includes this change
- [ ] Test scenarios added if new behavior

### Consistency
- [ ] Terminology matches across all docs
- [ ] Feature descriptions align between files
- [ ] Formatting follows existing patterns
- [ ] Callout boxes used appropriately

### Cross-References
- [ ] README links to FEATURES, USAGE, CONCEPTS
- [ ] USAGE references FEATURES for complete lists
- [ ] CONCEPTS links to detailed specs
- [ ] FEATURES links to implementation files

---

## Common Documentation Pitfalls

### Pitfall 1: Updating Code But Not Docs

**Problem:** Implementation changes, docs become stale

**Solution:** Update FEATURES.md as part of the implementation PR/commit, not after

---

### Pitfall 2: Inconsistent Counts

**Problem:** README says "3 workflows" but USAGE documents 9

**Solution:** Use FEATURES.md as single source of truth, grep for counts before committing

```bash
# Check for hardcoded counts
grep -rn "workflows\|agents\|skills\|guardrails" README.md docs/
```

---

### Pitfall 3: Missing Cross-References

**Problem:** New workflow added but Quick Reference table not updated

**Solution:** Use the "Common Change Scenarios" checklist above for each change type

---

### Pitfall 4: Outdated Examples

**Problem:** Code examples use old syntax or deprecated features

**Solution:** Test examples before documenting them, reference implementation files

---

## Version History Pattern

Use this template when updating FEATURES.md version history:

```markdown
### Version X.Y (Month Year) - Brief Title

**Major Changes:**
- Change 1 with details
- Change 2 with details
- Change 3 with details

**Rationale:** Why this change was made

**Philosophy/Pattern:** If introducing new approach, document it

**Files Changed:**
- file1 (what changed)
- file2 (what changed)

**Migration Notes:** (if breaking changes)
- What users need to update
- How to adapt to new patterns
```

---

## Documentation Review Checklist

Use this before releasing major changes:

### Technical Accuracy
- [ ] Feature counts match implementation (agents, workflows, skills, guardrails)
- [ ] Permission tables match opencode.json
- [ ] Examples can be executed successfully
- [ ] File paths and references are correct

### User Experience
- [ ] New features have usage examples
- [ ] Breaking changes are clearly marked
- [ ] Migration paths documented for deprecated features
- [ ] Common use cases covered in USAGE.md

### Discoverability
- [ ] New features mentioned in README overview
- [ ] Detailed docs linked from overview
- [ ] Quick Reference table includes new commands
- [ ] FEATURES.md cross-references are complete

### Maintainability
- [ ] FEATURES.md version history updated
- [ ] Known issues documented
- [ ] Testing checklist expanded
- [ ] This guide (DOCUMENTATION_MAINTENANCE.md) still accurate

---

## Automated Checks (Future Enhancement)

Consider adding these validation scripts:

```bash
# Check for count consistency
scripts/check-counts.sh

# Validate cross-references
scripts/check-links.sh

# Test code examples
scripts/test-examples.sh

# Verify FEATURES.md checklist completeness
scripts/check-features-baseline.sh
```

---

## Getting Help

### When Docs Don't Match Implementation

1. Check FEATURES.md version history for when change occurred
2. Check git log for implementation changes
3. Use git blame to find who made the change
4. Update docs based on current implementation state

### When You're Unsure What to Document

1. Check FEATURES.md for similar features
2. Follow the pattern used there
3. Document at similar level of detail
4. Include test scenarios if behavior is enforced

### When Structure Needs Changing

1. Propose changes in an issue first
2. Update this guide (DOCUMENTATION_MAINTENANCE.md) with new structure
3. Migrate existing docs to new structure
4. Update all cross-references

---

## Document Ownership

| Document | Primary Maintainer | Update Frequency |
|----------|-------------------|------------------|
| FEATURES.md | Tech Lead / Config Owner | Every feature change |
| README.md | Tech Lead | Major releases |
| USAGE.md | Tech Lead | New workflows/patterns |
| CONCEPTS.md | Tech Lead / Architect | Architecture changes |
| DOCUMENTATION_MAINTENANCE.md | Tech Lead | Process changes |

---

## Success Metrics

Good documentation maintenance means:

- Users can find accurate information quickly
- Examples work without modification
- Counts and cross-references are correct
- Version history explains "why" not just "what"
- FEATURES.md serves as reliable baseline for changes

Track these metrics:
- Time to find information (should be <2 minutes)
- Number of "docs are wrong" issues (should be near zero)
- Documentation update lag (should be same commit as code)

---

## Next Steps

After reading this guide:

1. Bookmark FEATURES.md as your reference before making changes
2. Use the "Common Change Scenarios" checklist for updates
3. Run the Documentation Quality Checklist before committing
4. Update FEATURES.md version history with every change

Remember: **Documentation is part of the implementation, not an afterthought.**
