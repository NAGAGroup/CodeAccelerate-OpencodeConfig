# INFO: Review Decision Gates

Gates in review DAGs are **optional and rare**, appearing only when review findings trigger different evaluation paths.

## When Gates Appear in Review DAGs

- **After initial assessment** — Findings determine scope of deeper review
- **Risk-based decisions** — High-risk areas trigger additional scrutiny
- **Conditional evaluation** — Some criteria only apply if others fail

## Gate Example

If a code review discovers serious security issues, it might gate: "security-deep-dive" vs. "standard-assessment". The gate decision is based on initial findings.

```json
"initial-assessment": {
  "type": "agent",
  "prompt": "prompts/initial-assessment.md"
},
"risk-gate": {
  "type": "gate",
  "prompt": "prompts/risk-gate.md",
  "next": {
    "standard": { "desc": "Low risk; proceed to standard evaluation" },
    "deep-dive": { "desc": "High risk; deeper security/correctness review needed" }
  }
}
```

## Your Task

Review your review decomposition. **Do you need gates?** Most reviews don't. Only add if:
- Initial findings determine evaluation direction, or
- Risk areas trigger conditional deep dives

Call `next_step()` to continue.
