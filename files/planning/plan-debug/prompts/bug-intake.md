# Bug Intake

Your first task is to **gather and confirm the bug details**.

## What to Do

Interview the user to capture:
1. **Bug Symptoms** — What is the user observing? What went wrong? How is it manifesting?
2. **Reproduction Steps** — Can the bug be reliably reproduced? What triggers it?
3. **Impact** — How severe is it? Does it block users, cause data loss, or affect performance?
4. **Environment** — What system/version/configuration? When was it first noticed?
5. **Context** — Recent changes? Does it happen consistently or intermittently?

Don't solve yet. Establish clear symptoms and reproduction path.

## Output

Summarize back:
- Bug symptoms (clear, observable behavior)
- Reliable reproduction steps (if available)
- Impact assessment (severity and scope)
- Environment details (system, version, timing)

Call `next_step()` when captured.
