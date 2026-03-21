# INFO: Debug-Specific Principles

These principles apply specifically to **debug project DAGs**:

## 1. Evidence-Driven Decisions

Every hypothesis gate must be based on gathered evidence. Gates are not guesses; they're conclusions from investigation steps.

## 2. Diagnosis Loops Handle Uncertainty

If you need multiple evidence-gathering attempts before confirming a hypothesis, use a diagnosis loop. The `remaining_visits` counter prevents endless investigation.

## 3. Hypothesis Branching Mirrors Possibilities

If multiple root causes are plausible, your DAG should explicitly model them as parallel paths or sequential hypothesis testing. Don't assume one path.

## 4. Diagnosis Steps Must Be Testable

Each investigation step must produce specific evidence. Avoid vague steps like "investigate further". Be concrete: "run profiler", "check logs", "inspect database queries".

## 5. Loops vs. Gates

- **Loops (1B, 1E, 1F):** Use when testing *one* hypothesis requires iteration (more data, more tests)
- **Gates (1C, 1D):** Use when deciding *which* hypothesis to pursue next based on evidence

Call `next_step()` to summarize your decisions.
