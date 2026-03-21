# INFO: Review-Specific Principles

These principles apply specifically to **quality review project DAGs**:

## 1. Coverage is Comprehensive

Each review criterion and risk area should have a dedicated assessment step. Don't skip dimensions; be systematic.

## 2. Findings are Actionable

Review output should include clear findings, severity levels, and recommendations. Reviewers should produce specific, actionable output—not vague impressions.

## 3. Assessment Methods Match Criteria

Different criteria need different evaluation approaches. Code correctness (code inspection) differs from performance (metrics/testing). Match method to criterion.

## 4. Risk-Based Focus Doesn't Skip Safety Checks

Risk-based reviews can prioritize high-risk areas, but don't skip checking low-risk areas entirely. Proportional coverage, not zero coverage.

## 5. Synthesis Produces Actionable Output

The final review step should integrate findings and produce a report that stakeholders can act on. What decisions will people make based on this review?

Call `next_step()` to summarize your decisions.
