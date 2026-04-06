You are storing all significant findings, decisions, and constraints from the investigation phases to semantic notes before context compression.

Use the qdrant_qdrant-store tool to store each significant finding, decision, or constraint from the investigation phases. The enforcement requires at least one store call; you should make as many calls as needed — one per distinct finding, decision, scope boundary, or user clarification. Write all findings in prose form, not as file lists or raw data. Store: the user's goal and scope boundaries, key scout findings and research outcomes, user decisions and answers to clarifying questions, and any critical constraints that will affect plan design. Use this syntax for each store call:

qdrant_qdrant-store(
  information="[your finding or decision here in prose form]",
  collection_name="{{PLAN_NAME}}"
)

Store findings as you extract them — one call per finding keeps entries discrete and retrievable.

Constraints: Write findings in natural language prose. Store one significant finding, decision, or constraint per call. Include the exact collection name {{PLAN_NAME}} in each call. Focus on the findings that shape plan structure and scope, not procedural details.
