# Audit Findings: session-compaction.ts

## Summary

Analyzed the plugin code against documented behavior and research findings. Most functionality is correct. Found one confirmed bug and several potential improvements.

---

## Confirmed Bugs

### Bug 1: Incorrect "most recent" session selection

**Location:** `findActiveSession()` function (lines 44-62)

**Root Cause:** The code uses string-based sorting which does NOT correctly identify the most recently created session:

```typescript
return sessions.sort().reverse()[0] || null
```

- `sessions.sort()` performs lexicographic (alphabetical) sort on session directory names
- `reverse()` flips to descending alphabetical order
- Session directory names in `.opencode/sessions/` are human-readable slugs (e.g., `audit-session-compaction-plugin`), NOT timestamps or session IDs
- The slug sort has NO correlation with creation time

**Impact:** When multiple sessions exist, compaction may inject the wrong session's plan and notes into context.

**Fix Required:** Sort by the `created` timestamp in `spec.json`, descending (most recent first).

---

## Verified Correct

### 1. Session path detection ✅

**Code:** `join(directory, ".opencode", "sessions")` (line 67)

**Status:** CORRECT. Sessions live at `.opencode/sessions/` at the project root.

### 2. output.context is additive ✅

**Code:** `output.context.push(blocks.join("\n\n---\n\n"))` (line 134)

**Status:** CORRECT. The hook correctly appends to the existing context array.

### 3. session.idle event payload ✅

**Code:** `(event as any).properties?.sessionID` (line 142)

**Status:** CORRECT. The actual event payload structure is:
```json
{"payload":{"type":"session.idle","properties":{"sessionID":"ses_..."}}}
```

Verified against sample output from opencode event logs.

### 4. context.sessionID in tool execute ✅

**Code:** `context.sessionID` (line 189)

**Status:** CORRECT. The tool context type includes `sessionID: string` property.

---

## Potential Improvements (Not Bugs)

### Improvement 1: No logging when no active session found

**Location:** Compaction hook (lines 83-136)

**Behavior:** If `findActiveSession()` returns null, the hook silently does nothing.

**Impact:** Difficult to debug why compaction isn't preserving context.

**Recommendation:** Add debug log when no active session is found.

### Improvement 2: Current subtask not prominently highlighted

**Location:** Compaction hook output (lines 91-100)

**Behavior:** The full `index.md` is included, which contains the subtask table with status indicators.

**Impact:** The current subtask (marked with ⬜) may get lost in the full content.

**Recommendation:** Add a prominent callout section specifically highlighting the current subtask number and name.

### Improvement 3: No validation in compact tool

**Location:** Tool execute function (lines 186-203)

**Behavior:** No validation that `context.sessionID` is defined before queueing the compaction.

**Impact:** If sessionID is somehow undefined/null, the compaction would be queued with an invalid key and never executed, but the tool still returns success.

**Recommendation:** Add validation and return an error message if sessionID is unavailable.

---

## Test Recommendations

1. Create multiple sessions with different creation times and verify the most recent one is selected
2. Trigger compaction and verify the correct session's plan appears in the compacted context
3. Test the compact tool returns appropriate error if sessionID is missing (edge case)

---

## Next Steps

After this audit is reviewed, proceed to:
- Subtask 02: Fix session path detection (actually fix the sort bug)
- Subtask 03: Verify/fix compaction hook (add current subtask highlighting)
- Subtask 04: Fix compact tool async relay (add validation)
- Subtask 05: Integration test
