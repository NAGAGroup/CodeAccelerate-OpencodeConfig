---
name: grepai
description: Teaches how to use GrepAI semantic search and code intelligence tools for project exploration.
---
<rules>
Always describe what code does in queries, not what it is called. Replace all example queries with semantic searches relevant to your task.
Always run multiple varied queries — stopping at the first result misses relevant code.
Always start with semantic searches on the README, if it exists, with compact=False
Always ask yourself if there are more queries you should run before stopping.
</rules>

<example>
Bad — keyword, too narrow:
  grepai_grepai_search(query="config")
  grepai_grepai_search(query="processor.ts")

Bad — single call
   grepai_grepai_search(query="processJob")

Good — many varied queries:
  grepai_grepai_index_status() // check the health of the index to make sure unhealthy index doesn't corrupt search quality, inform the user of unhealthy indexes
  grepai_grepai_search(query=[ semantic query of the README], path=README.md)
  grepai_grepai_search(query=[README query informs query on project as a whole], compact=True, format="toon")
  grepai_grepai_search(query=[semantic query, from the user's stated goals, on the project as a whole], compact=True, format="toon")
  grepai_grepai_search(query=[project-wide queries inform non-compact queries on specific part of the project], compact=False, path=src/)
  grepai_grepai_search(query=[non-compact query informs more focused query on module-b], path=src/module-b, compact=False)
  grepai_grepai_search(query=[non-compact query also informs more focused query on module-c], path=src/module-c, compact=False, limit=5)
  grepai_grepai_search(query=[run another compact query on src/ to see how the two modules connect], compact=True, format="toon", path=src/)
  ... // and so on, running many varied queries to get a broad understanding of the landscape instead of a narrow deep dive that misses important context.
</example>
