---
description: Import memories from other projects via REST API
agent: tech_lead
---

Import memories from other projects to the current project.

You will query the opencode-mem REST API to discover memories from other projects, present them to the user for selection, and add the selected memories to the current project.

## Critical Requirements

**Todo List Management (REQUIRED):**
- Create a comprehensive todo list at the very beginning
- Maintain it throughout: mark tasks complete, add new tasks as needed
- Todo list shows progress and ensures nothing is forgotten

## Delegation Strategy

**You (tech_lead) will handle ALL work directly. Do NOT delegate.**

You will:
- Query the REST API using curl (you have bash access for this)
- Filter and analyze the results
- Present options using the question tool
- Add selected memories using the memory tool

## Process

1. **Create and initialize todo list**
   - Add all major workflow steps
   - Mark first task as in_progress

2. **Query REST API for all memories**
   - Use curl to query: `curl -s http://127.0.0.1:4747/api/memories`
   - Parse the JSON response
   - If API is not available (connection refused), inform user that opencode-mem web server must be running
   - Update todo: mark complete

3. **Filter memories by project**
   - Identify current project's memories (these will have tags matching current directory)
   - Group remaining memories by project (use displayName or projectPath from tags)
   - Count how many memories exist per project
   - If NO cross-project memories found, inform user and exit
   - Update todo: mark complete

4. **Present memories to user via question tool**
   - Create one or more questions using the question tool
   - Enable multiple selection (`multiple: true`)
   - For each memory, provide:
     * Label: Brief summary (first 50 chars of content)
     * Description: Full content + project source + tags
   - Group by project if there are many memories
   - If there are 20+ memories, consider asking user to filter by project first
   - Update todo: mark complete

5. **Add selected memories to current project**
   - For each selected memory, use memory tool to add it:
     ```typescript
     memory({
       mode: "add",
       content: "<memory content>",
       type: "<original type if available>",
       tags: "<original tags>"
     })
     ```
   - Track successes and failures
   - Update todo: mark complete

6. **Report results**
   - Summarize how many memories were imported
   - List the projects they came from
   - Note any failures or issues
   - Mark all todos complete

## Examples

```
/workflow-import-cross-project-memories
```

No arguments needed - the workflow discovers available memories automatically.

## Expected Output

User receives:
1. Interactive question(s) showing available memories from other projects
2. Confirmation of which memories were successfully imported
3. Summary of import results

## Notes

- opencode-mem web server must be running (default: http://127.0.0.1:4747)
- Memories are automatically tagged with current project when added
- Original tags and metadata are preserved
- This creates duplicates - the same content exists in multiple projects
