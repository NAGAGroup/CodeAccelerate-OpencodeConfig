# Session Overview

{{SESSION_GOAL}}

*One sentence stating what this DAG session will accomplish — the concrete objective. This orients HeadWrench at session entry. Good: "Migrate the billing module from Stripe to Square with no breaking API changes." Bad: "Update the billing system." Keep it to one sentence; do not describe phases or steps.*

---

## STOP — Do not work ahead

The DAG controls sequencing. Each node will tell you exactly what to do when you arrive at it. **Do not scout, explore, read files, search the codebase, or start any task right now.** The system will guide you step by step — trust it.

Your only action at this node is to call `next_step()` immediately.
