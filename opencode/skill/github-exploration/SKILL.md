---
name: github-exploration
description: Patterns for exploring GitHub repositories efficiently
---

# GitHub Repository Exploration

When researching GitHub repositories, follow this systematic approach:

## Quick Reference: URL Patterns

```
README (raw):
https://raw.githubusercontent.com/{owner}/{repo}/{branch}/README.md

Any file (raw):
https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}

Directory listing (API):
https://api.github.com/repos/{owner}/{repo}/contents/{path}

Releases:
https://api.github.com/repos/{owner}/{repo}/releases
```

## Exploration Strategy

### 1. Start with README
**Always fetch first:** `https://raw.githubusercontent.com/{owner}/{repo}/main/README.md`

If 404, try: `master`, `develop`, or check repo's default branch.

**Extract:**
- What the project does
- Installation/quick start
- Links to docs
- API examples

### 2. Check Common Documentation Files

Try these paths (use raw.githubusercontent.com):
- `docs/README.md` or `docs/index.md`
- `CHANGELOG.md` (for version history)
- `API.md` or `docs/api.md`
- `ARCHITECTURE.md` or `docs/architecture.md`
- `CONTRIBUTING.md`

### 3. Find Package Metadata

Depending on language:
- JavaScript: `package.json`
- Python: `setup.py` or `pyproject.toml`
- Rust: `Cargo.toml`
- Go: `go.mod`

**These tell you:** dependencies, version, entry points

### 4. Look for Examples

Try:
- `examples/` directory
- `demo/` directory  
- Files matching `example*.{ext}`

### 5. Use API for Structure

**List directory contents:**
```
GET https://api.github.com/repos/{owner}/{repo}/contents/
```

Returns JSON with file/folder listing. Navigate deeper by appending path:
```
GET https://api.github.com/repos/{owner}/{repo}/contents/src
```

### 6. Check Releases for Versions

```
GET https://api.github.com/repos/{owner}/{repo}/releases
```

**Why:** Release notes often explain features better than docs. Version-specific info.

## Common Workflows

### "How do I use this library?"
1. README → Quick start section
2. `docs/getting-started.md` or `docs/guide.md`  
3. `examples/` directory
4. Check tests for usage patterns

### "What's in version X?"
1. `CHANGELOG.md`
2. Releases API: filter by tag/version
3. Specific version README: use tag instead of `main` in URL

### "What does this API do?"
1. `docs/api.md` or `docs/reference.md`
2. README → API section
3. Package metadata for entry points
4. TypeScript: `.d.ts` files have type signatures

### "Repository structure?"
1. Use contents API: `/repos/{owner}/{repo}/contents/`
2. Navigate key directories: `src/`, `lib/`, `docs/`
3. Check for `ARCHITECTURE.md`

## Important Notes

- **Default branch:** Usually `main` or `master`. If 404, try the other.
- **Raw content:** Always use `raw.githubusercontent.com` for file contents
- **API rate limits:** GitHub API has limits; use raw URLs for files when possible
- **Citation format:** Include owner/repo, file path, commit/tag/branch, and URL

## When You're Stuck

1. README not found? Try repo description on GitHub: `https://github.com/{owner}/{repo}`
2. No docs folder? Check if README has inline documentation
3. Can't find API docs? Look at source code file headers/comments
4. Version-specific? Use tags in URL: replace `main` with `v1.2.3`

---

**Remember:** Start broad (README), follow conventions (docs/, examples/), use API to navigate, cite with specific URLs and versions.
