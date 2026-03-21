<!-- DO NOT COMPACT THIS NODE — these instructions must remain in context for the entire session -->

# Node: research-execute

Dispatch multiple @DeepResearcher agents in parallel to investigate the open questions. Each iteration focuses on gathering information about ocx/opencode distribution mechanisms.

## Research Questions to Investigate

1. **What distribution mechanisms does ocx/opencode support for sharing configs?**
   - Search for official documentation on ocx config distribution
   - Look for opencode.json schema references or plugin systems
   - Find any existing GitHub repos that distribute opencode configs

2. **How do existing opencode configurations handle repo-based distribution?**
   - Search for existing "oh-my-opencode" style repos
   - Look for community patterns or templates
   - Find any official recommendations from opencode.ai

3. **What repo structure works best for a "distro" style config distribution?**
   - Research how similar tools (oh-my-zsh, chezmoi, etc.) structure their repos
   - Find best practices for distributing dotfiles/configs via GitHub

4. **How to handle installation, updates, and versioning for a config repo?**
   - Research install scripts, update mechanisms
   - Look for version tagging strategies for config distros

5. **What modifications to the current opencode directory are needed for distribution?**
   - Examine the current ./opencode structure
   - Identify what would need to change for a standalone distro repo

## Actions

1. Dispatch one @DeepResearcher agent per research question above (5 agents total, parallel)
2. Each agent should search the web for relevant information using Exa
3. After all agents return, synthesize the findings into a structured update to `research-brief.md`
4. Add an iteration log entry with:
   - Date/time
   - Focus areas investigated
   - Key findings
   - Open threads / remaining questions

## Iteration Log Format

When updating research-brief.md, add a new section:

```
### Iteration N — {date/time}

**Focus:** {what was investigated this iteration}

**Key Findings:**
- {finding 1}
- {finding 2}
- ...

**Open Threads:**
- {remaining question 1}
- {remaining question 2}
- ...
```

## Delegation

**Agent:** @DeepResearcher (parallel × 5)
**Model:** haiku-like
**Prompt structure:**
- Dispatch 5 @DeepResearcher agents simultaneously, one per research question
- Each agent uses Exa web search to find information
- Return findings to HW for synthesis

## Advance

Call `next_step()` to loop for another research iteration, or advance to synthesis-gate when the loop counter is exhausted. The DAG plugin will present the available options — do not hardcode branch IDs.
