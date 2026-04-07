---
name: web-research
description: Teaches how to search public information and documentation using web search, URL reading, and library documentation tools.
---

# Web Research

Use web search and documentation tools to research public information, libraries, and frameworks.

## Tools
**searxng_searxng_web_search** — Search the public web. Key params: `query` (search term), `time_range` (day/month/year), `language`, `pageno` (pagination).

**searxng_web_url_read** — Read full webpage content. Key params: `url`, `section` (extract under heading), `readHeadings` (list only), `paragraphRange` (specific paragraphs), `maxLength` (character limit).

**context7_resolve-library-id** — Resolve library name to Context7 ID. Key params: `libraryName`, `query`.

**context7_query-docs** — Search library documentation. Key params: `libraryId`, `query`.

## Rules
- Provide complete context to tools about what you're researching and why
- Use general, public terms; no private details or internal identifiers
- Search multiple sources rather than accepting the first result
- Read actual source content using searxng_web_url_read rather than relying on snippets
- Resolve library IDs first before querying documentation
- Report findings with verification status: verified (multiple authoritative sources), inferred (summaries or single sources), uncertain (conflicting sources)
- Include uncertainties section listing what was searched but not confirmed
