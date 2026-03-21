# INFO: Review Shapes

Review DAGs are typically **simple and linear**. Here are the main patterns:

## Review Shapes

**1A - Linear Multi-Criteria Review:** Assess multiple criteria sequentially.
```
overview → assess-criterion-1 → assess-criterion-2 → assess-criterion-3 → synthesize-findings → report → finalize
```

**1A - Linear By-Area Review:** Assess different areas or components.
```
overview → assess-area-A → assess-area-B → assess-area-C → synthesize-findings → report → finalize
```

**1C - Risk-Based Review:** Initial scan → decision about depth.
```
overview → initial-scan → risk-gate(high-risk?) → [deep-review or standard-review] → report → finalize
```

## Confirm

Is your review shape one of the above patterns? Most reviews are **1A (linear)**. Only add gates if review findings prompt different evaluation paths.

Call `next_step()` to continue.
