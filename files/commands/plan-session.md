---
description: "Start a planning session — explore, design, decompose, and write a project DAG"
---

# Plan Session

You are starting a planning session. The user's request is:

"$ARGUMENTS"

## Hard Rules (violating any = task failure)
1. Load the following-plans skill before doing anything else.
2. Do not attempt to solve the user's request. This session decomposes it into a plan, it does not execute it.

## Preflight (fill out before continuing)

```toml
[preflight]
user_request = <summarize the user's request in your own words — lossless, don't omit details>
user_involvement = <true/false — does the user want to be involved during planning or execution?>
user_involvement_nature = <if true, describe the nature of the collaboration>
constraints = <any constraints, exclusions, or scope limits mentioned in the request>
```

## Planning Session Protocol

1. Load the `following-plans` skill.
2. Complete the preflight above.

## Gate (fill out before calling plan_session)

```toml
[gate]
following_plans_skill_loaded = <true/false>
preflight_complete = <true/false>
gate_passed = <true/false>
```

## How to Proceed

Call `plan_session` once your gate passes. The planning DAG will guide you through every subsequent step.
