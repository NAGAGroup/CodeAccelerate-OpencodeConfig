---
name: web-research
description: Teaches how to search public information and documentation using web search, URL reading, and library documentation tools.
---

# Web Research

This skill teaches how to conduct external research using web search, URL reading, and documentation query tools. Load it when you need to find public information, verify external documentation, or research third-party libraries and frameworks.

## Tool Overview

**Use searxng_searxng_web_search for broad web queries.** Call this tool with a query parameter to search the public web for articles, documentation, guides, and other resources. Optional parameters: time_range (day/month/year for recency), language, pageno for result pagination. Returns multiple sources with relevance scores. Use this to find initial information, verify facts, or explore a topic broadly.

**Use searxng_web_url_read to examine specific URLs in detail.** Call this tool with a url parameter to read the full content of a webpage. Optional parameters: section (extract content under a specific heading), readHeadings (return only headings list), paragraphRange (return specific paragraphs), maxLength (limit character count). Use this to verify information found in search results by reading the actual source.

**Use context7_resolve-library-id to find libraries by name.** Call this tool with libraryName and query parameters to resolve a library name to a Context7-compatible library ID. Returns library details including descriptions, reputation, code snippets available, and versions. Use this before querying library documentation to get the correct library ID.

**Use context7_query-docs to query library documentation.** Call this tool with a libraryId and query parameters to search documentation for a specific library. Returns relevant documentation sections, code examples, and API references. Use this after resolving a library ID to get authoritative documentation for that specific library.

## Research Strategy Pattern

**Pattern: Broad Search → Narrow Results → Read Sources**
1. Use searxng_searxng_web_search with a broad query to find initial sources
2. Identify the most relevant results by title and description
3. Use searxng_web_url_read on specific URLs to read full content and verify information
4. Repeat with refined queries if initial results are not specific enough

**Pattern: Library Research → Resolve ID → Query Docs**
1. Use context7_resolve-library-id with the library name to find the correct library ID
2. Review the result to confirm it matches what you're looking for (check reputation, version, description)
3. Use context7_query-docs with the library ID to query official documentation
4. For multiple versions, try querying different versions if your question is version-specific

**Pattern: Verification Across Multiple Sources**
1. Run web search to find multiple sources on a topic
2. Read several URLs to verify consistency across sources
3. Document which sources agree and which sources differ
4. Report findings with verification status: verified (multiple sources agree), inferred (from one source), or uncertain (sources conflict)

## Rules

Provide complete context to the tools — what you're researching and why. Use general, public terms; include no private details or internal identifiers in queries. Search multiple sources rather than accepting the first result. Read actual source content using searxng_web_url_read rather than relying on search snippets alone. When querying library documentation, resolve the library ID first using context7_resolve-library-id to ensure you're accessing the correct library. Report findings with verification status: verified (read from multiple authoritative sources), inferred (from summaries or single sources), or uncertain (sources conflict or information was not found). Include an uncertainties section listing what was searched but not confirmed. Always distinguish between what you verified from sources and what you inferred or speculated about.

## Examples

**Good:** Research question: "Does JWT specification support custom claim types?" Search: "JWT custom claims specification". Read the JWT RFC and community documentation. Report: "Verified from RFC 7519 that custom claims are supported and should use a namespace URI to avoid collisions. Multiple sources confirm this is standard practice." Include specific sources and quotes.

**Good:** Need to verify React 18 hooks API. Use context7_resolve-library-id with libraryName="React" and query="React 18 hooks". Get back the correct library ID. Use context7_query-docs with that ID to query "useEffect cleanup function patterns". Get official documentation with code examples.

**Good:** Researching multiple sources on a topic. Search web for "error handling best practices Node.js". Read three different sources from major tech sites. Compare their recommendations. Report: "Three sources agree on these patterns. Two sources mention this concern but differ on approach. One source recommends against this pattern."

**Bad — no source verification:** Return search results without reading actual sources. Search summaries can be incomplete or incorrect. Read the actual URLs to verify.

**Bad — leaks private details:** Search query includes "our authentication method" or internal project names. Use general, public terms to avoid exposing private information.

**Bad — queries library without resolving ID first:** Try to use context7_query-docs without first calling context7_resolve-library-id to get the correct library ID. This may query the wrong library or fail.

**Bad — accepts memory as verification:** Answer questions about library APIs from memory without searching and verifying against current documentation. Libraries change — verify against current sources.

**Bad — conflates verified with inferred:** Report something as "verified from sources" when you only inferred it from a search snippet. Distinguish between what you actually read and what you inferred.
