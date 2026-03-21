# Identify Review Scope & Decompose Steps

Your task is to **define the review scope and decompose the review into evaluation steps**.

## What to Do

Define:
1. **Review Boundaries** — What's in scope? What's explicitly out of scope?
2. **Coverage Areas** — Which parts of the artifact get deep review vs. spot checks?
3. **Evaluation Steps** — Break review into 3-5 steps with clear scope per step
4. **Dependencies** — Do any review steps depend on outputs from others?
5. **Success Criteria** — When is each review step complete and valid?

Each step should target specific quality dimensions or areas with measurable findings. For complex decomposition involving trade-offs between coverage and depth, you may use sequential-thinking to reason through step boundaries and dependencies.

## Output

- In-scope and out-of-scope areas
- Coverage map: deep review vs. spot checks
- Numbered review steps with scope and quality focus
- Dependencies between steps
- Success definition per step
- Any quality trade-offs and reasoning

Call `next_step()` to proceed to quality assessment.
