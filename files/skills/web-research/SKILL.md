---
name: web-research
description: Teaches how to search public information and documentation using web search, URL reading, and library documentation tools.
---

# Web Research

Use web search and documentation tools to research public information, libraries, and frameworks.

## Tool Overview

**searxng_searxng_web_search** — Call with query parameter to search the public web. Optional: time_range (day/month/year), language, pageno (pagination). Returns multiple sources with relevance scores. Use to find initial information and explore topics broadly.

**searxng_web_url_read** — Call with url parameter to read full webpage content. Optional: section (extract under heading), readHeadings (list only), paragraphRange (specific paragraphs), maxLength (character limit). Use to verify information from search results by reading actual sources.

**context7_resolve-library-id** — Call with libraryName and query to resolve a library name to a Context7-compatible library ID. Returns library details including reputation, versions, and code snippets available. Use before querying library documentation.

**context7_query-docs** — Call with libraryId and query to search a library's documentation. Returns relevant sections, code examples, and API references. Use after resolving a library ID to get authoritative documentation.

## Rules

Provide complete context to tools — what you're researching and why. Use general, public terms; no private details or internal identifiers. Search multiple sources rather than accepting the first result. Read actual source content using searxng_web_url_read rather than relying on snippets. Resolve library IDs first using context7_resolve-library-id before querying documentation. Report findings with verification status: verified (from multiple authoritative sources), inferred (from summaries or single sources), or uncertain (sources conflict). Always distinguish between verified facts and inferred information. Include an uncertainties section listing what was searched but not confirmed.
