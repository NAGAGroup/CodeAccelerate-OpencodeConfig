# INFO: Review Structure

Review DAGs are typically **linear or lightly-gated**, not heavily iterative.

## Review DAG Patterns

**1A - Linear Review:** Systematic evaluation across dimensions. No loops or gates.
```
overview → assess-correctness → assess-performance → assess-security → assess-maintainability → synthesize-report → finalize
```

**1C - Review with Gate:** Initial assessment → decision about depth or direction.
```
overview → initial-assessment → gate(deep-review or summary?) → [deep-review or summary] → report → finalize
```

**1E - Rare: Iterative Review:** Only if review findings prompt additional investigation.
```
overview → [loop: assess → findings → evaluate-sufficiency] → report → finalize
```

## Key Principle

**Review DAGs focus on coverage and accuracy, not iteration.** Each review step should produce findings and move forward. Loops in review are unusual (only if findings trigger additional assessment). Most reviews are linear sequences of evaluations synthesized into a report.

Call `next_step()` to continue.
