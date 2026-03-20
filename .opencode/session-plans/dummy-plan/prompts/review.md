# Review Gate (Test Node)

This is the review gate of the dummy test plan.

**Your task:** Ask the user: "Step one is complete. Shall we finalize (advance to 'done') or repeat step one?"

- If proceed: call `next_step({ next: "done" })`
- If repeat: call `next_step({ next: "step-one" })`
