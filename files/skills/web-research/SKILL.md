---
name: web-research
description: Teaches how to search public information and documentation using web search, URL reading, and library documentation tools.
---
<tools>
searxng_searxng_web_search — web search. Parameters: query (required), time_range ("day", "month", "year" — optional), language (e.g. "en" — optional), pageno (default 1 — optional).

searxng_web_url_read — reads the content of a URL. Parameters: url (required), section (extract content under a specific heading — optional), readHeadings (return only headings — optional), paragraphRange (e.g. "1-5" — optional), maxLength (optional), startChar (optional).

context7_resolve-library-id — resolves a library name to a Context7 ID. Parameters: libraryName (official name with proper punctuation, e.g. "Next.js" not "nextjs" — required), query (the task you need help with — required).

context7_query-docs — queries library documentation. Parameters: libraryId (from context7_resolve-library-id — required), query (specific question — required).
</tools>

<procedure name="general-research">
1. Run searxng_searxng_web_search with a focused query.
2. Read actual source content with searxng_web_url_read for each relevant result — do not rely on search snippets alone.
3. Search from additional angles if the first results do not fully answer the question.
</procedure>

<procedure name="library-research">
1. Call context7_resolve-library-id to get the correct library ID — use the official library name.
2. Call context7_query-docs with a specific question — vague queries return poor results.
3. Supplement with searxng_searxng_web_search for community resources, examples, and edge cases.
</procedure>

<rules>
Use general public terms only — no internal names, proprietary identifiers, or confidential context.
Read actual source material — search snippets are not evidence.
Tag findings: verified (read from source), inferred (logical conclusion), uncertain (conflicting or insufficient evidence).
</rules>
