# Node: hypothesis-form — /plan-debug

Your role in this node is to produce a ranked list of hypotheses about the root cause of the bug.

## Steps

1. Using the context gathered so far, generate 2–4 candidate hypotheses. For each hypothesis:
   - **Statement** — One sentence: what is the suspected root cause?
   - **Evidence** — What in the codebase or context supports this hypothesis?
   - **Test** — What targeted check, log, or code inspection would confirm or refute it?
   - **Confidence** — High / Medium / Low

2. Rank the hypotheses by confidence (highest first).

3. Present the ranked list to the user.

4. Ask: "Do any of these look right to you, or should I dig deeper on a specific area?"

## Constraints

- Hypotheses must be grounded in evidence from the codebase — no speculation without backing.
- Maximum 4 hypotheses per iteration. If you have more, rank and cut to the top 4.
- Do not propose fixes yet — only diagnoses.

## Advance

- If the hypotheses need refinement or the user has new information: call `next_step({ next: "hypothesis-form" })` to loop (note: this node has a `remaining_visits` limit — do not loop unnecessarily).
- If the user and you are aligned on the top hypothesis/hypotheses: call `next_step({ next: "hypothesis-gate" })`.
