---
name: external-scout
description: Teaches how to dispatch external-scout for external research on public information and documentation.
---
<overview>
external-scout handles routine research: evaluating established options, checking API documentation, verifying library behavior, scoping implementation details. For novel or frontier research requiring multi-source synthesis, use deep-researcher instead. When in doubt, use external-scout.
</overview>

<what-external-scout-does>
Searches public sources and reads actual source material — no search snippet reliance.
Tags every finding as verified (read from source), inferred (logical conclusion), or uncertain (conflicting or insufficient evidence).
Has no access to internal project files — public information only.
Includes an explicit unknowns section.
</what-external-scout-does>

<template name="delegation-prompt">
Research goal: what to find out — use general public terms, no internal identifiers or proprietary details

Background: what is already known so the scout focuses on new information

Specific questions: the questions the research should answer

Plan Name: plan name to store findings under, or N/A if not working within a plan session

Tag every finding as verified, inferred, or uncertain. Include an explicit unknowns section covering what was searched for but could not be confirmed, contradictions between sources, and gaps in available information.
</template>
