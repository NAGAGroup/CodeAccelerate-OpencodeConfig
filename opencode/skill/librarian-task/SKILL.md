---
name: librarian-task
description: Template for librarian agent task delegation
---

```jinja2
{# research_question: Specific, narrow question about external documentation (APIs, libraries, specs, standards, research papers, algorithms) #}
{# usage_context: Why you need this information - helps librarian focus the search and understand your use case #}
{# output_format: What format you want (e.g., "list of flag constants with descriptions and links", "code examples with official docs", "comparison table", "summary of research papers with citations") #}
{# specific_urls: Optional - User-provided URLs to prioritize in research (comma-separated or list). If the user did not provide any, pass an empty list [] #}

**Research Question:** {{research_question|required}}

**Usage Context:** {{usage_context|required}}

**Expected Output Format:** {{output_format|required}}

{% if specific_urls %}
**Specific URLs to Research:** {{specific_urls}}
{% endif %}
```
