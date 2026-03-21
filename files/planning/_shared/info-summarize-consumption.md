# Info: Summary — Plan Spec Decisions — {{DAG_TYPE}}

Summarize the key decisions made in this informational phase. This creates explicit indication you have internalized the content.

## Your Summary

Produce a concise summary covering:

### Loops Identified
List each loop by name and decision node.

### Visit Counter Recommendations
Table of decision nodes with recommended `remaining_visits` counts.

### Gate Decisions
List of gate positions, whether each is included, and user preference (if applicable).

### Flow-Specific Notes
Key reminders for {{DAG_TYPE}} sessions that you will apply.

### Validity Status
Confirm all invariants are satisfied, or note any issues.

## Format

```markdown
## Plan Spec Summary — {{DAG_TYPE}}

**Loops**: [list]
**Visit Counts**: [table]
**Gates**: [list with yes/no]
**Flow Notes**: [bullet points]
**Validity**: ✓ All passed / ⚠ Issues noted: [describe]
```

## Purpose

This summary:
1. Creates a record of your planning decisions
2. Confirms you consumed the informational content
3. Provides a reference during plan execution

## Advance

Call `next_step()` to proceed to the review gate.
