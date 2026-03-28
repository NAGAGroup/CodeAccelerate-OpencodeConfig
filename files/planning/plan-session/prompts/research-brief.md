# Brief Web Research

Gather targeted online documentation before proposing the DAG structure. This is a single, brief research pass — not a deep investigation. If the topic requires more thorough research, that should be incorporated into the generated project DAG as a dedicated research node.

Based on your scout findings and the task description, you should have a good sense of where to look. Propose specific URLs or documentation sites as options.

## Todo

1. `question` — Use the **`question`** tool to ask the user where to focus the research. Based on your understanding of the task, propose specific documentation sites, library docs, or URLs as options (e.g. the official library docs page, a relevant GitHub repo, a specific API reference). Allow the user to type their own answer if none of the options fit.

2. `task` — Dispatch one **@DeepResearcher** with the research target from the user's answer. Tell the researcher: what the overall planning task is, exactly where to look (the URL or docs site the user specified), and that the output should be a brief structured summary (key findings, relevant APIs or patterns, caveats). Instruct the researcher that this is a one-shot pass — no follow-up dispatches.

## Important

- Research is brief and targeted. Do not dispatch multiple researchers or iterate.
- If the findings suggest deeper research is needed, note this in the `propose-structure` node — it can be incorporated into the generated project DAG as a proper research node.
- The researcher's output feeds directly into your `propose-structure` reasoning alongside the scout findings.
