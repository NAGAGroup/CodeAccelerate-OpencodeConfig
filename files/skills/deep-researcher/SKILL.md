---
name: deep-researcher
description: Teaches how to dispatch deep-researcher for comprehensive investigation of novel or frontier topics.
---
<overview>
deep-researcher conducts comprehensive, multi-source investigation on novel algorithms, cutting-edge approaches, and frontier techniques where no established answer exists in a single place. Most research tasks do not need this — use external-scout for routine research. If in doubt, use external-scout.
</overview>

<what-deep-researcher-does>
Decomposes research into multiple angles and sub-questions.
Searches public sources and reads actual source material in depth.
Cross-references findings between sources and follows reference chains.
Synthesizes findings with explicit notes on agreements, disagreements, and gaps.
Tags every finding as verified, inferred, or uncertain.
Has no access to internal project files — public information only.
</what-deep-researcher-does>

<template name="delegation-prompt">
Research domain: the area to investigate — use general public terms, no internal identifiers or proprietary details

Background: what is already known so the researcher focuses on new ground

Angles to investigate:
angle 1
angle 2
angle 3

Key questions:
question 1
question 2

Plan Name: plan name to store findings under, or N/A if not working within a plan session

Tag every finding as verified, inferred, or uncertain. Cross-reference findings between sources. Include an explicit unknowns section covering contradictions, gaps, and what could not be confirmed.
</template>
