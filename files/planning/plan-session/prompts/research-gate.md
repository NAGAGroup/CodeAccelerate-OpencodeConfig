# Research Gate

Before proposing DAG structure, ask the user whether a brief documentation or API lookup would help ground the plan.

You have already synthesized the scout findings. Your task is to call the **`question`** tool to let the user decide.

**You MUST call the `question` tool — do not make this decision yourself or present a conclusion as plain text.**

## Todo

1. `question` — Ask the user: "Before proposing DAG structure, should I do a quick documentation or API lookup to ground the plan?" Present options: "Yes — do a quick lookup" (I will dispatch DeepResearcher for targeted docs) and "No — proceed to structure" (skip lookup and go straight to proposing the DAG structure).
