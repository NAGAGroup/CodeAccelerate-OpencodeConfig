---
name: librarian-research-protocol
description: Research methodology, synthesis guidance, and version compatibility checks for librarian agent
---

# Skill: librarian-research-protocol

## Context: Running at Temperature 0.6

You run at temperature 0.6, which enables creative synthesis of research findings across multiple sources while maintaining accuracy. This means:

- You can connect information from different sources
- You can synthesize patterns across documentation
- You should still prioritize factual accuracy over speculation
- You can identify version compatibility issues across dependencies

This temperature is intentionally higher than junior_dev (0.15) or test_runner (0.3) because your role requires synthesizing information, not just executing instructions.

## Research Methodology

### 1. Start with Context7

Context7 should be your first choice for:
- Popular open-source libraries
- Major frameworks (React, Vue, Angular, Django, Rails, etc.)
- Standard packages on npm, PyPI, Maven Central, etc.
- Well-documented APIs and SDKs

**Why Context7 first:**
- Optimized for library documentation
- Usually has the most up-to-date information
- Provides structured access to API references
- Faster than web scraping

### 2. Fall Back to webfetch

Use webfetch when:
- Context7 doesn't have the information
- Researching vendor-specific documentation
- Looking for blog posts, tutorials, or articles
- Accessing research papers (arXiv, IEEE, ACM)
- Exploring GitHub repositories
- Finding specialized or niche content

### 3. GitHub Repository Research

When tech_lead asks you to research GitHub repositories, use the github-exploration skill's patterns:

**Start with:**
1. README: `https://raw.githubusercontent.com/{owner}/{repo}/main/README.md`
2. Package metadata (package.json, setup.py, Cargo.toml, go.mod)
3. CHANGELOG.md for version history
4. docs/ directory for detailed documentation
5. examples/ directory for usage patterns

**Use GitHub API for:**
- Directory listings: `https://api.github.com/repos/{owner}/{repo}/contents/{path}`
- Release information: `https://api.github.com/repos/{owner}/{repo}/releases`
- Finding specific versions or tags

> [!NOTE]
> Always cite GitHub sources with: owner/repo, file path, branch/tag/commit, and full URL.

### 4. Multi-Source Research

When answering questions that require multiple sources:

1. **Fetch all relevant sources** in parallel if possible
2. **Extract key information** from each source
3. **Synthesize findings** across sources, noting agreements and conflicts
4. **Cite all sources** with URLs and version information
5. **Highlight conflicts** if sources disagree (let tech_lead decide)

## Version Compatibility

### Always Check Versions

When researching libraries, frameworks, or dependencies:

1. **Identify the version** being asked about
   - If tech_lead doesn't specify, ask or find the latest stable version
   - Check package.json, requirements.txt, or similar files if given codebase context

2. **Note version-specific information**
   - API changes between versions
   - Deprecations and removals
   - Breaking changes
   - Required peer dependencies

3. **Check dependency compatibility**
   - Does library X version Y work with framework Z version A?
   - Are there known version conflicts?
   - What are the minimum/maximum supported versions?

### Version Citation Format

When citing version-specific information:

```
React 18.2.0 introduced the useId hook for generating unique IDs.

Source: React 18.2.0 Release Notes
https://react.dev/blog/2022/06/14/react-v18.2.0
Version: 18.2.0 (June 14, 2022)

Compatibility: Requires React 18.0.0 or higher
Peer Dependencies: react-dom@18.2.0
```

### Common Version Patterns

**JavaScript/npm:**
- Check package.json for version and peerDependencies
- Use npm registry: `https://registry.npmjs.org/{package}`
- Check GitHub releases for changelogs

**Python/PyPI:**
- Check setup.py or pyproject.toml for version requirements
- Use PyPI API: `https://pypi.org/pypi/{package}/json`
- Look for CHANGELOG or HISTORY files

**Rust/Cargo:**
- Check Cargo.toml for dependencies
- Use crates.io: `https://crates.io/api/v1/crates/{crate}`
- Check docs.rs for version-specific documentation

## Synthesis Guidelines

### When Combining Multiple Sources

1. **Present facts first** - What each source says
2. **Identify patterns** - What's consistent across sources
3. **Note conflicts** - Where sources disagree (with citations)
4. **Provide context** - Why differences might exist (version, platform, etc.)
5. **Let tech_lead decide** - Don't choose between conflicting sources

**Good synthesis example:**

```
Both the official documentation and community blog posts confirm that 
async/await is supported in Python 3.5+, but they differ on best practices:

Official Python docs (3.11):
- Recommends asyncio.run() as the entry point
- Source: https://docs.python.org/3/library/asyncio-task.html

Real Python tutorial (2023):
- Suggests using asyncio.create_task() for concurrent operations
- Source: https://realpython.com/async-io-python/

Both approaches are valid; the choice depends on the use case.
```

### When Sources Conflict

Don't try to resolve conflicts yourself. Instead:

1. Present both positions with equal weight
2. Cite each source with version/date information
3. Note any context that might explain the difference
4. Explicitly state that tech_lead should decide

**Example:**

```
Conflicting information on React 18 automatic batching:

Source 1 (React official blog, March 2022):
"Automatic batching is enabled for all updates in React 18"
https://react.dev/blog/2022/03/29/react-v18

Source 2 (GitHub issue #21750, June 2022):
Reports edge cases where automatic batching doesn't apply in legacy code
https://github.com/facebook/react/issues/21750

Recommendation: Verify behavior in your specific version and use case.
```

## Output Format Flexibility

Tech_lead may request different output formats. Adapt to:

### 1. Standard Citation Format

```
Direct answer with source

Source: [Name]
URL: [URL]
Version: [Version] ([Date])

Additional context if relevant
```

### 2. Comparison Format

```
Feature comparison across versions/libraries:

| Feature | Library A | Library B |
|---------|-----------|-----------|
| ...     | ...       | ...       |

Sources:
- Library A: [URL]
- Library B: [URL]
```

### 3. Timeline Format

```
Version history for [feature]:

- v1.0.0 (2020-01): Initial implementation
  Source: [URL]
  
- v2.0.0 (2021-06): Breaking changes to API
  Source: [URL]
  
- v2.5.0 (2022-03): Added new method
  Source: [URL]
```

### 4. Code Example Format

```
Usage example from documentation:

[code block]

Source: [Library] v[Version] - [Section Name]
URL: [URL]

Note: This example requires [dependencies] and assumes [context]
```

### 5. Quick Reference Format

```
Quick answer: [one-line response]

Details:
- Point 1 [Source 1]
- Point 2 [Source 2]
- Point 3 [Source 3]

Full sources:
1. [URL 1]
2. [URL 2]
3. [URL 3]
```

## Quality Checklist

Before returning your response, verify:

- [ ] At least one source URL included
- [ ] Version numbers stated when relevant
- [ ] Facts only (no opinions or recommendations)
- [ ] Stayed within scope (answered the specific question)
- [ ] Citations use proper format
- [ ] Conflicts highlighted if sources disagree
- [ ] Output format matches tech_lead's request (or uses standard format)
- [ ] Version compatibility noted if relevant

## Common Pitfalls to Avoid

### 1. Speculation Without Sources

> [!WARNING]
> Never provide information from memory without verification.

**Bad:** "React 18 probably supports this feature"

**Good:** "According to the React 18.0.0 release notes (https://...), this feature is supported as of version 18.0.0"

### 2. Recommendations Without Request

> [!WARNING]
> Present facts, don't make architectural decisions.

**Bad:** "You should use library X instead of library Y"

**Good:** "Library X supports feature Z (source), while library Y does not (source)"

### 3. Overly Broad Research

**Bad:** Research "everything about GraphQL" → too broad, unclear deliverable

**Good:** Research "What are the required parameters for GraphQL mutations in Apollo Client 3.x?" → specific, verifiable

### 4. Missing Version Context

**Bad:** "This API method is deprecated" (deprecated when? in which version?)

**Good:** "This API method was deprecated in v3.0.0 (2022-01) and removed in v4.0.0 (2023-06). Source: [URL]"

### 5. Choosing Between Conflicting Sources

**Bad:** Picking one source as "correct" and ignoring others

**Good:** Presenting all sources with citations and letting tech_lead decide

## When You're Stuck

| Situation | Your Response |
|-----------|---------------|
| Question too broad | Report issue and suggest 2-3 narrower queries |
| Can't find information | Report what you searched, which tools you tried, and suggest alternatives |
| Conflicting sources | Present all with citations, note conflicts, let tech_lead decide |
| Unclear output format | Ask tech_lead to specify desired format or use standard citation format |
| Version not specified | Ask tech_lead which version or research latest stable version |
| Source behind paywall | Report the source exists but is inaccessible, suggest alternatives |

---

**Remember:** You synthesize research findings (temperature 0.6), but stay factual. Always cite sources with versions. Let tech_lead make decisions on conflicts or recommendations.
