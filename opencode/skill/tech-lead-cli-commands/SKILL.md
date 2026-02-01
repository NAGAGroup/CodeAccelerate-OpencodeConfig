---
name: tech-lead-cli-commands
description: Guidance for tech_lead on when to run CLI commands vs delegate to test_runner
---

## Tech_lead CLI Command Responsibilities

> [!IMPORTANT]
> **Command Split:** You run SETUP/CONFIG commands. Test_runner runs BUILD/TEST commands. This distinction is critical.

### You Run Directly

**Setup/Initialization:**
- `pixi init`, `npm init`, `cargo new`, `go mod init`
- Project scaffolding and initialization commands

**Dependency Management:**
- `pixi add cmake`, `npm install express`, `pip install requests`
- `yarn add`, `cargo add`, `go get`
- Adding or installing dependencies

**Git Operations:**
- `git init`, `git checkout -b feature/name`, `git add .`, `git commit`
- `git branch`, `git merge`, `git pull`, `git push`
- All version control operations

**Code Generation:**
- `protoc`, scaffolding tools, code generators
- Commands that create source files

**User-Requested Commands:**
- Any command the user explicitly asks you to run

### Delegate to test_runner

**Build Commands:**
- `pixi run build`, `npm run build`, `make`, `cargo build`
- `gradle build`, `mvn compile`, `go build`
- ANY command that compiles or builds the project

**Test Commands:**
- `pixi run test`, `npm test`, `pytest`, `cargo test`
- `jest`, `mocha`, `go test`, `mvn test`
- ANY command that runs tests

**Verification/Diagnostics:**
- Commands to verify builds worked
- Commands to check test results
- Commands to diagnose failures

### Key Principle

**If it's about SETTING UP infrastructure** → You run it  
**If it's about VERIFYING what was built** → test_runner runs it

### Examples

**You run:**
```bash
# Setting up a new pixi project
pixi init
pixi add cmake gcc libgl-dev

# Installing dependencies
npm install
pip install -r requirements.txt

# Git operations
git checkout -b feature/auth
git add .
git commit -m "Add authentication"

# User requests
# User: "Create a new git branch called feature/ui"
git checkout -b feature/ui
```

**test_runner runs:**
```bash
# Building the project
pixi run build
npm run build
cargo build --release

# Running tests
pixi run test
npm test
pytest tests/

# Verifying behavior
./build/app --version
```

### Workflow Pattern

Typical flow when adding a feature:

1. **You run:** `pixi add new-library` (setup dependency)
2. **Delegate to junior_dev:** Implement feature using the library
3. **Delegate to test_runner:** `pixi run build && pixi run test` (verify)
4. **You run:** `git add . && git commit -m "..."` (commit the working code)

### Common Mistakes to Avoid

❌ **Don't do this:**
```bash
# Running build/test yourself
pixi run build  # This should go to test_runner
npm test        # This should go to test_runner
```

✅ **Do this instead:**
```typescript
// Delegate build/test to test_runner
skill({name: 'test_runner-task'})
task({
  description: "Build and test the project",
  subagent_type: "test_runner",
  template_data: {
    task: "Verify build and tests pass",
    context: "Just added new feature",
    build_commands: "pixi run build",
    test_commands: "pixi run test",
    expected_results: "All tests pass"
  }
})
```

### Quick Reference

| Command Type | Who Runs It | Examples |
|--------------|-------------|----------|
| Init/Setup | **You** | `pixi init`, `npm init`, `cargo new` |
| Dependencies | **You** | `npm install`, `pip install`, `pixi add` |
| Git | **You** | `git checkout`, `git add`, `git commit` |
| Code Gen | **You** | `protoc`, scaffolding tools |
| User Request | **You** | Any command user explicitly asks for |
| Build | **test_runner** | `make`, `npm run build`, `cargo build` |
| Test | **test_runner** | `npm test`, `pytest`, `cargo test` |
| Verify | **test_runner** | Running app, checking output |

---

Remember: **You set up, test_runner verifies.** This keeps responsibilities clear and prevents confusion about who runs what.
