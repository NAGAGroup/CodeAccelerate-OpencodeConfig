# Identify Review Scope

Your task is to **define the review scope and decompose into evaluation steps**.

## What to Do

Define:
1. **Review Boundaries** — What's in scope? What's explicitly out of scope?
2. **Coverage Areas** — Which parts of the artifact get deep review vs. spot checks?
3. **Evaluation Steps** — Break review into 3-5 steps with clear scope per step
4. **Dependencies** — Do any review steps depend on outputs from others?
5. **Success Criteria** — When is each review step complete?

Each step should be a clear assessment of specific dimensions/areas with measurable findings.

## Output

- In-scope and out-of-scope areas
- Coverage map: deep review vs. spot checks
- Numbered review steps with scope
- Dependencies between steps
- Success definition per step

Call `next_step()` to route agents.
