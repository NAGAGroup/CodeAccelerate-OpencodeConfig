# Load Plan Design Guidelines

The plan design guidelines have been loaded into your context from `plan-design-guidelines.md`.

Internalize the schema structure and planning best-practices before proceeding. Pay particular attention to:
- Node granularity (one cognitive step per node)
- Required top-level fields (`schema_version`, `id`, `session_type`, `status`, `entry`, `nodes`)
- Path resolution rules for prompt files
- How to write gate nodes, loop nodes, and terminal nodes
- The requirement to generate `session-overview.md` dynamically in finalize

Call `next_step()` to proceed to `task-intake`.
