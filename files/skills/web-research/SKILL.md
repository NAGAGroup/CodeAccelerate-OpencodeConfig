---
name: web-research
description: Teaches how to search public information and documentation using web search, URL reading, and library documentation tools.
---
<rules>
Always read actual source material — search result snippets are not evidence.
Tag findings: verified (read from source), inferred (logical conclusion), uncertain (conflicting or insufficient evidence).
Use only public general terms — no internal names, proprietary identifiers, or confidential context.
Search from multiple angles if first results do not fully answer the question.
</rules>

<example>
General research:
  searxng_searxng_web_search(query="[focused question]")
  searxng_web_url_read(url="[relevant result URL]")  // read actual source, not just snippets
  searxng_web_url_read(url="[second relevant result]")  // search from additional angles

Library documentation:
  context7_resolve-library-id(libraryName="[official name with proper punctuation, e.g. Next.js not nextjs]", query="[task]")
  context7_query-docs(libraryId="[id from above]", query="[specific question — vague queries return poor results]")
  searxng_searxng_web_search(query="[supplement with community resources and examples]")

Tool parameters:
  searxng_searxng_web_search — query (required), time_range ("day"/"month"/"year"), language (e.g. "en"), pageno (default 1)
  searxng_web_url_read — url (required), section (heading to extract), readHeadings (headings only), paragraphRange (e.g. "1-5"), maxLength
  context7_resolve-library-id — libraryName (required), query (required)
  context7_query-docs — libraryId (required), query (required)
</example>
