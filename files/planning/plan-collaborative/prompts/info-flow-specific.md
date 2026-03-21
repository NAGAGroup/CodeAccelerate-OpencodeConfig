# INFO: Collaboration-Specific Principles

These principles apply specifically to **collaborative project DAGs**:

## 1. Turn-Taking is Explicit

Each step in the collaboration should be a clear "turn" — designer proposes, user reviews, feedback given, next turn begins. Don't blur the boundaries.

## 2. User Gates Reflect Real Decisions

Gates are not formalities; they're genuine decision points where the user validates, approves, or redirects. The prompt should explain what's being decided and offer real choices.

## 3. Feedback Loops Handle Iteration

If multiple rounds of refinement are expected, use a dialogue loop with `remaining_visits`. This prevents endless iteration while accommodating real design work.

## 4. Artifact Evolution is Tracked

Each turn should show progress toward the final artifact. Users should see their design getting more detailed, refined, or complete.

## 5. Collaboration Respects Constraints

Design decisions should stay within the constraints identified at the start: timeline, budget, technical limits, brand guidelines. The DAG should help enforce them.

Call `next_step()` to summarize your decisions.
