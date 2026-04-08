---
name: web-research
description: Teaches how to search public information and documentation using web search, URL reading, and library documentation tools.
---

# What does this skill teach?

In this skill, you learn how to research public information, libraries, and frameworks using web search, URL reading, and library documentation tools.

## Related Tools

### `searxng_searxng_web_search`

| Parameter | Description |
|-----------|-------------|
| `query` | Search query (required) |
| `time_range` | Restrict results by recency: `'day'`, `'month'`, or `'year'` (optional) |
| `language` | Language code for results, e.g. `'en'` (optional) |
| `pageno` | Page number for pagination, default 1 (optional) |
| `safesearch` | Safe search level: 0 (none), 1 (moderate), 2 (strict), default 0 (optional) |

### `searxng_web_url_read`

| Parameter | Description |
|-----------|-------------|
| `url` | Full URL to fetch and read (required) |
| `section` | Extract content under a specific heading (optional) |
| `readHeadings` | Return only a list of headings instead of full content (optional) |
| `paragraphRange` | Return specific paragraph ranges, e.g. `'1-5'` or `'10-'` (optional) |
| `maxLength` | Maximum number of characters to return (optional) |
| `startChar` | Starting character position for extraction (optional) |

### `context7_resolve-library-id`

| Parameter | Description |
|-----------|-------------|
| `libraryName` | Official library name to resolve, e.g. `'Next.js'` not `'nextjs'` (required) |
| `query` | The question or task you need help with — used to rank results by relevance (required) |

### `context7_query-docs`

| Parameter | Description |
|-----------|-------------|
| `libraryId` | Context7-compatible library ID from `context7_resolve-library-id`, e.g. `'/vercel/next.js'` (required) |
| `query` | The specific question or task to find documentation for (required) |

## How to research a topic

1. Run `searxng_searxng_web_search` with a focused query to find relevant sources
2. Read actual source content with `searxng_web_url_read` for each relevant result — do not rely on search snippets alone
3. Run additional searches from different angles if the first results don't fully answer the question

## How to research a library or framework

1. Call `context7_resolve-library-id` to get the correct library ID — use the official name with proper punctuation
2. Call `context7_query-docs` with a specific question — vague queries return poor results
3. Supplement with `searxng_searxng_web_search` for community resources, examples, and edge cases not covered in official docs

## How to think through this skill

<|think|>
- Am I using general, public terms — no internal names, proprietary identifiers, or confidential context?
- Have I read actual source material, or am I drawing conclusions from search snippets alone?
- Have I searched from multiple angles — official docs, community resources, recent discussions?
- For library research, have I resolved the library ID before querying docs?
- Am I tagging findings with confidence levels — verified (read from source), inferred (from summaries), uncertain (conflicting or insufficient evidence)?
