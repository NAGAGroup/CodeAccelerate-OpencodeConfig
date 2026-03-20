# Subtask 04 — Synthesis

## Delegation
- **Agent:** HeadWrench-direct
- **Reason:** The synthesis subtask reads all accumulated round notes, does targeted opencode-feasibility research via exa/webfetch, and compiles a research brief and design document. No subagent invocation — HW executes directly.

---

## Objective

Read all three round findings files and compile two output documents:

1. **`notes/research-brief.md`** — A concise executive summary: session goal, research scope, key findings per round, open questions, and recommended next steps (including a pointer to creating an executable session plan via `/plan`).

2. **`notes/design-doc.md`** — A structured design document covering all 8 feature areas, with a section for each. Each section must:
   - State the recommended design (from research findings)
   - Explain the rationale (citing round findings)
   - Explicitly flag where the recommendation diverges from the current config's implementation
   - Provide a **"How we do this in opencode"** note: a brief description of how to get as close as possible to the research-backed best practice using opencode primitives (YAML agent files, Markdown protocols, slash commands, plugins/MCP). Writing plugins is acceptable. These notes should be practical options/directions, not deep specs.

**The 8 feature areas (one section each in the design doc):**
1. Planning system & planning modes
2. Session plan structure & execution design
3. Context management (lifecycle, tiers, staleness, archival)
4. Writing session-specific subagents
5. Delegation design & routing strategy
6. Speed/cost/correctness trade-off framework
7. Protocol & skills system design
8. Slash commands & general UX

> **Audience note:** This subtask file is read by HeadWrench only. HW executes it directly.

---

## Todolist

### 1. Read all round notes
- [ ] Read `notes/round-01-findings.md`
- [ ] Read `notes/round-02-findings.md`
- [ ] Read `notes/round-03-findings.md`

### 2. Targeted opencode-feasibility research (exa/webfetch)
- [ ] For each of the 8 feature areas, do targeted lookups (exa search or webfetch) to understand: what opencode supports natively (YAML agent frontmatter, MCP plugins, custom slash commands, tool permissions), and what would require a plugin. Key questions: Does opencode expose a plugin/extension API? Can custom MCP tools be written that hook into session state? What does the opencode architecture support for tiered context, dynamic skill loading, or trust gating?
- [ ] Check the opencode GitHub/docs for plugin/extension points, MCP server support, and any relevant open issues or roadmap items

### 3. Write research-brief.md
- [ ] Write `notes/research-brief.md` with: session goal, research scope summary, key findings per round (3–5 bullets each), open questions, recommended next steps

### 4. Write design-doc.md
- [ ] Write `notes/design-doc.md` with one section per feature area (8 total); each section: recommended design, rationale, divergence notes, and "How we do this in opencode" implementation note

### 5. Final review
- [ ] Verify both output files are internally consistent and cross-reference each other where appropriate
- [ ] Confirm all 8 feature areas are covered in design-doc.md

---

## Scope

- **Read:** `notes/round-01-findings.md`, `notes/round-02-findings.md`, `notes/round-03-findings.md`
- **Write:** `notes/research-brief.md`, `notes/design-doc.md`
- **Research tools allowed:** exa (exa_web_search_exa, exa_deep_search_exa, exa_crawling_exa), webfetch — for targeted opencode-feasibility lookups only
- **Excluded:** All subtask files, config files, implementation files; no subagent invocation; no new deep research rounds

---

## Constraints

- Do not invoke any subagent — HW-direct only
- Do not conduct new deep research rounds — only synthesize what is in the three round notes files, supplemented by targeted opencode feasibility lookups via exa/webfetch
- Both output files must be self-contained — a reader who hasn't seen the round notes should understand the findings and recommendations from the design-doc alone
- Flag design divergences from current implementation explicitly using `⚠️ Diverges from current:` callout in design-doc.md
- "How we do this in opencode" notes should be brief and practical — options and directions, not detailed implementation specs
- Plugin/MCP development is acceptable as an implementation option
- The design-doc is the primary deliverable; the brief is the executive summary layer

---

*At the end of this subtask, follow the checkpoint protocol in `~/.config/opencode/protocols/checkpoint.md`. This is the final subtask — use the session close commit format: `feat: complete session — config-reimplementation-research`.*
