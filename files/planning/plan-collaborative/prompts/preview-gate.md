# Collaborative Planning: Preview Gate

**Phase:** FINALIZE  
**Purpose:** Display proposed DAG structure; user validates before prompts are written  
**Waiting for user input:** Gate decision  
**Domain:** Collaborative design exploration

---

## Task

Show the user the planned DAG structure as an ASCII diagram, node list, and branching logic. User approves, reconsiders, or refines before write-prompts executes. (Improvement 3: Preview gate before approval)

## Display Elements

Show the user:

1. **ASCII DAG Diagram**
   ```
   [Example]
   
   session-overview → intake → context-gather → clarify
                                                    ↓
                                         evaluate-understanding
                                                    ↓
                                        propose-success-criteria
                                                    ↓
                                       evaluate-success-criteria
                                                    ↓
                                    propose-collaboration-shape
                                                    ↓
                                     evaluate-collaboration-shape
                                                    ↓
                                      identify-output-artifact
                                                    ↓
                                          planning-gate
                                                    ↓
                                          design-plan
                                                    ↓
                                          preview-gate ← YOU ARE HERE
   ```

2. **Node Summary**
   - Node count: [N] nodes total
   - Task nodes: [N1] (execution steps)
   - Gate nodes: [N2] (decision points)
   - Branching points: [N3] gates with 2+ branches
   - Loops: [N4] refinement loops (if any)

3. **Branching Logic**
   - Gate: [Decision] → approves to [Next], reconsiders to [Refine step]

4. **Execution Notes**
   - Sequential-thinking used in nodes: [list] (Improvement B2)
   - @ContextInsurgent routing: [Yes/No; which nodes] (Improvement B3)
   - Web research steps: [Which nodes use tools] (Improvement B4)

## Gate Decision

**Does this DAG structure look right?**

- **Approve:** Proceed to write-prompts (write all node prompt files)
- **Reconsider:** Go back to design-plan and reshape the DAG

---

## Output

```
## DAG Preview

### Diagram
[ASCII tree showing full DAG flow]

### Node List
| ID | Title | Type | Purpose |
|---|---|---|---|
| [id] | [title] | task/gate | [1-line purpose] |

### Branching & Looping
- Branching points: [Gate list with branch options]
- Refinement loops: [Loop list with iteration counts]

### Sequential-Thinking & Routing
- Nodes using sequential-thinking: [list]
- Nodes routed to @ContextInsurgent: [list]
- Nodes using web research: [list]

### Ready to proceed?
[Approve / Reconsider]
```

---

**See also:**
- `planning-audit-spec.md` Improvement 3 (Preview gate before approval)
- `planning-audit-spec.md` Improvement 6 (Intermediate feedback on plan quality)
