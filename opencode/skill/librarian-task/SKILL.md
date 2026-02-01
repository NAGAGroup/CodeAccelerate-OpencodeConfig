---
name: librarian-task
description: Template for librarian agent task delegation
---

```jinja2
{# research_question: Specific, narrow question about external documentation (APIs, libraries, specs, standards, research papers, algorithms) #}
{# usage_context: Why you need this information - helps librarian focus the search and understand your use case #}
{# output_format: What format you want (e.g., "list of flag constants with descriptions and links", "code examples with official docs", "comparison table", "summary of research papers with citations") #}
{# specific_urls: Optional - User-provided URLs to prioritize in research (comma-separated or list). If provided, librarian should fetch and analyze these first. #}
{# required_skills: REQUIRED - Array of skill names librarian should load. Get via: query_required_skills({agent: "librarian"}). Pass empty array [] if none. #}

**Research Question:** {{research_question|required}}

**Usage Context:** {{usage_context|required}}

**Expected Output Format:** {{output_format|required}}

{% if specific_urls %}
**Specific URLs to Research:** {{specific_urls}}
{% endif %}

**Required Skills:**
{{required_skills|required|list}}

**Important Guidelines:**
- Keep questions narrow and specific (not broad like "explain all of X")
- Always cite sources with links and version numbers
- Try Context7 first for library/framework docs, then use webfetch for research papers, vendor docs, or specialized content
- Focus on "what exists" not "what you should do"
- Provide factual information, not architectural recommendations
{% if specific_urls %}- PRIORITY: Start by fetching and analyzing the specific URLs provided above{% endif %}
```
