# Build and Verify

Run the registry build and confirm both new profiles appear in the output.

## Delegation

**Agent:** HW (direct)
**Reason:** Requires shell access to run `bun run build` and inspect build output.

## Steps

1. Run `bun run build` in the workspace root
2. If the build fails, inspect the error output and fix the issue directly (likely a malformed `registry.jsonc` entry or missing file path)
3. After a successful build, verify that `dist/index.json` contains entries for both `ocx-haiku` and `ocx-haiku-copilot`
4. Also verify that `dist/components/ocx-haiku.json` and `dist/components/ocx-haiku-copilot.json` exist

## Success Criteria

- Build exits with code 0
- `dist/index.json` lists `ocx-haiku` and `ocx-haiku-copilot`
- Both component JSON files exist in `dist/components/`

## Advance

Once verified, call `next_step()`.
