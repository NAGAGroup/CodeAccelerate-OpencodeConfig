<!-- Context: core/system/dcp-context-management | Priority: critical | Version: 1.2 | Updated: 2026-03-08 -->

# DCP Context Management Tools

**Priority**: compress (critical — parameter structure failures) > distill/prune (high — ID hallucination failures)

**Core rule**: All three DCP tools use the same parameter passing as every other tool (edit, read, bash, etc.). There is nothing special about DCP tool parameters. If you can call `edit` correctly, you can call `compress` correctly.

---

## compress — HOW TO CALL IT CORRECTLY

The `compress` tool has two parameters: `topic` (string) and `content` (object with 3 string properties).

### THIS IS 100% WITHIN YOUR CONTROL

If compress fails with `content.startId is required`, **you caused this and you can fix it**. This is NOT a serializer bug, NOT a tool limitation, NOT something outside your control. You are passing `content` wrong. Other agents fix this on every call. You will fix it too.

### The ONE thing you must get right

`content` is an **object parameter with 3 properties**. You pass it the same way you pass any structured parameter — each property is a separate named field inside the object. You do NOT compose a JSON string and pass it as the value.

Compare with the `edit` tool: you pass `filePath`, `oldString`, `newString` as separate parameter fields. You would never write `oldString: '{"filePath": "x", "oldString": "y"}'`. The `compress` tool works identically — `content` is an object, and `startId`, `endId`, `summary` are its individual fields.

### WRONG — every field crammed into content as a string:
```
topic: "My summary"
content: '{"startId": "m0000", "endId": "m0012", "summary": "..."}'
```
This WILL fail. The runtime receives a string, not an object. `content.startId` → undefined.

### WRONG — flat text:
```
topic: "My summary"
content: "startId=m0000, endId=m0012, summary=..."
```

### CORRECT — content is an object, each field is a separate property:
```json
{
  "topic": "My summary",
  "content": {
    "startId": "m0000",
    "endId": "m0012",
    "summary": "Complete technical summary here..."
  }
}
```

### If compress fails

1. **Do NOT say "this is a serializer issue" or "I cannot fix this"** — you CAN fix it and you HAVE fixed it before.
2. **Do NOT retry with the same parameter structure** — if it failed, your structure was wrong.
3. **Do NOT give up and skip compression** — fix the call and retry.
4. Look at how you passed `content`. If it was one big string value, break it apart so `startId`, `endId`, and `summary` are each a separate named property of the `content` object.

### Parameter Schema

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `topic` | string | yes | 3-5 word label (e.g. "Auth system exploration") |
| `content` | **object** | yes | **JSON object** — never a string |
| `content.startId` | string | yes | Boundary ID: `mNNNN` or `bN` from `<dcp-message-id>` tags |
| `content.endId` | string | yes | Boundary ID: `mNNNN` or `bN` from `<dcp-message-id>` tags |
| `content.summary` | string | yes | Exhaustive technical summary replacing the range |

### Boundary ID Rules

- IDs come **only** from `<dcp-message-id>` tags visible in current context. Never fabricate IDs.
- Format: `mNNNN` (4-digit zero-padded, e.g. `m0000`) or `bN` (compressed block, e.g. `b3`)
- `startId` must appear before `endId` in the conversation
- If compressed blocks (`bN`) exist within the range, include `(bN)` placeholders in the summary — one per block, exactly once

### Summary Quality

The summary replaces everything in the range. Capture: file paths, function signatures, decisions made, constraints discovered, key findings. This is a complete technical substitute — the original should add no value after compression.

### When to Compress

- Phase of work is **complete** (research concluded, implementation finished)
- Natural breakpoint — user has moved on to a new topic
- Noise accumulated that would be better as a summary

### When NOT to Compress

- You plan to edit files or reference exact content from the range
- Work is still active in that area
- You're uncertain whether you'll need the raw content

---

## distill — Condense Tool Outputs

Transforms specific tool outputs into preserved knowledge. The raw output is removed; the distillation replaces it.

### Parameter Schema

```json
{
  "targets": [
    {
      "id": "42",
      "distillation": "Complete technical substitute for that output"
    }
  ]
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `targets` | **array** | yes | **JSON array** of target objects |
| `targets[].id` | string | yes | Numeric ID from the `<prunable-tools>` list |
| `targets[].distillation` | string | yes | Comprehensive substitute — signatures, types, logic, constraints |

### ID Validation (MANDATORY)

**Before calling distill, locate the `<prunable-tools>` list in your current context. Only IDs listed there are valid.** IDs are NOT sequential — they have gaps. Do not guess, extrapolate, or use IDs you remember from earlier in the conversation. If the list shows IDs `3, 7, 12`, then ONLY `"3"`, `"7"`, `"12"` are valid.

**If distill fails with "Invalid IDs" error**: re-read the `<prunable-tools>` list and verify every ID you're passing actually appears in it. Do not retry with the same IDs.

### Guidelines

- Distillation must be thorough enough that re-fetching the original adds no value
- Best for: exploration outputs you've fully processed but whose knowledge you need to retain

---

## prune — Remove Tool Outputs

Deletes tool outputs entirely with no preservation. Last resort.

### Parameter Schema

```json
{
  "ids": ["42", "43", "47"]
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ids` | **array** | yes | **JSON array** of numeric ID strings from `<prunable-tools>` list |

### ID Validation (MANDATORY)

**Before calling prune, locate the `<prunable-tools>` list in your current context. Only IDs listed there are valid.** Do not guess, extrapolate, or reuse IDs from earlier in the conversation.

**If prune fails with "Invalid IDs" error**: re-read the `<prunable-tools>` list and verify every ID. Do not retry with the same IDs.

### Guidelines

- No preservation — content is gone
- Use for: noise, irrelevant results, superseded outputs
- Never prune outputs you may need later

---

## General Timing

- Prefer managing context at the **start** of a new turn (after receiving a user message), not at the end
- Parallelize context management with other tool calls — don't use management tools as the only calls in a response
