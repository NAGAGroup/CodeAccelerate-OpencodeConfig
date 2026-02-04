# Core Concepts

This document explains the fundamental concepts and architecture of OpenCode, including how agents coordinate, what roles they play, and how you interact with the system.

---

## Orchestration Architecture

OpenCode uses a **multi-agent coordination model** where specialized agents work together under central coordination. This architecture enables complex tasks to be decomposed, executed reliably, and verified systematically.

### Multi-Agent Coordination

OpenCode's orchestration follows a coordinator-and-specialists pattern:

**Central Coordinator:**
- **tech_lead** acts as your primary interface and the system's coordinator
- Analyzes requests, plans approach, asks clarifying questions
- Never executes tasks directly - instead delegates to appropriate specialists
- Synthesizes results and reports back to you

**Specialized Subagents:**
- **junior_dev** - Implements code changes following precise specifications
- **test_runner** - Executes tests, builds, and diagnoses failures
- **explore** - Maps codebases and discovers patterns quickly
- **librarian** - Researches external APIs, libraries, and documentation

**Why This Matters:**

The coordinator-and-specialists pattern provides:

1. **Separation of Concerns** - Each agent excels at its specific role without distraction
2. **Reliability** - Constraints force proper handoffs and reduce mistakes
3. **Scalability** - New specialists can be added without changing core coordination
4. **Auditability** - Each agent's responsibilities are clear and bounded
5. **Recovery** - If one agent fails, others can retry or take alternative paths

---

## Agent Roles & When to Use Them

### tech_lead (Primary Agent - Always Active)

**Role:** Coordinator, strategic planner, questioner, and your direct interface

**Can do:**
- Read and analyze codebases
- Edit markdown documentation
- Execute project management commands (git, gh cli, pixi, package installation, curl/jq for CI/CD APIs)
- Ask clarifying questions
- Delegate tasks to specialized agents
- Synthesize results and make recommendations

**Cannot do:**
- Use bash for codebase exploration (must use built-in grep/glob/read tools)
- Edit code files directly (must delegate to junior_dev)
- Run tests or builds (must delegate to test_runner)
- Make architectural decisions without understanding context

**When active:**
ALWAYS - This is your main interface to OpenCode. tech_lead is always present in your conversation.

**Example:**
```
User: "Add authentication to the API"
tech_lead: Analyzes existing auth patterns → identifies requirements
          → delegates to junior_dev for implementation
          → delegates to test_runner for verification
          → synthesizes results and reports findings
```

### junior_dev (Implementation Agent - On Demand)

**Role:** Precise code implementation following detailed specifications

**Can do:**
- Edit any code or configuration file
- Perform file operations (cp, mv, rm, ln) via bash
- Follow multi-step implementation specs exactly
- Read codebase to understand current state

**Cannot do:**
- Run tests or build commands (must delegate to test_runner)
- Install packages (tech_lead handles this)
- Improvise solutions or interpret vague requirements
- Make architectural decisions
- Fix issues beyond the specification

**When active:**
Activated by tech_lead when code implementation is needed. Requires clear, detailed specifications. Will report if spec is unclear rather than guess.

**Example:**
```
tech_lead: "Please add JWT validation middleware to Express server"
Specification: 
- Create middleware at src/middleware/auth.js
- Implement JWT verification with secret from env
- Add error handling with 401 responses

junior_dev: Reads current code → implements exact changes → reports completion
```

### test_runner (Verification Agent - On Demand)

**Role:** Execute tests, builds, diagnostics, and verification

**Can do:**
- Run test suites (npm test, pytest, pixi run, etc.)
- Execute build processes
- Run diagnostic commands
- Check code quality and linting
- Save large output to /tmp for analysis
- Provide detailed failure analysis

**Cannot do:**
- Install packages (tech_lead handles this)
- Fix code or edit files (junior_dev handles this)
- Modify git state (tech_lead handles this)
- Make architectural changes
- Interpret test failures for you (will provide details but tech_lead analyzes)

**When active:**
Activated by tech_lead when verification is needed. Runs after implementation to ensure quality.

**Example:**
```
tech_lead: "Run tests to verify the new authentication implementation"

test_runner: Executes: npm test
            Provides: Test output, pass/fail status, detailed failures
            Reports: "3 tests passing, 1 failing due to missing env variable JWT_SECRET"
```

### explore (Discovery Agent - On Demand)

**Role:** Fast codebase analysis and pattern discovery

**Can do:**
- Read files and search for patterns
- Map codebase structure and relationships
- Identify existing implementations and patterns
- Find code examples and references

**Cannot do:**
- Edit anything
- Make architectural decisions
- Import external information

**When active:**
Activated by tech_lead when understanding the codebase is needed before planning implementation.

**Example:**
```
tech_lead: "I need to understand the current auth patterns in this codebase"

explore: Searches for auth-related code → identifies 3 patterns
         Maps imports and dependencies → reports findings
         Shows: "Found JWT middleware in auth/ and legacy session in legacy/"
```

### librarian (Research Agent - On Demand)

**Role:** External research for APIs, libraries, and documentation

**Can do:**
- Fetch and review online documentation
- Research library APIs and patterns
- Look up standard specifications
- Verify external tool usage

**Cannot do:**
- Read local files
- Edit anything
- Make implementation decisions

**When active:**
Activated by tech_lead when external research is needed (verifying API details, library patterns, standard specs).

**Example:**
```
tech_lead: "I need to verify the correct JWT standard claims to use"

librarian: Fetches JWT RFC documentation
           Reports: "Standard claims are: iss, sub, aud, exp, iat, nbf"
           tech_lead uses this to guide junior_dev
```

---

## Delegation Flow

The coordination flow is straightforward and intentional:

```
User Request
    ↓
tech_lead (Analysis & Planning)
    ├─ Asks clarifying questions if needed
    ├─ Executes project management commands (git, package installation)
    ├─ Analyzes current state (delegates to explore)
    ├─ Plans approach and checks external info (delegates to librarian)
    └─ Delegates implementation (to junior_dev) and verification (to test_runner)
    ↓
Specialized Agent Execution
    ├─ junior_dev: Implements changes
    ├─ test_runner: Verifies quality
    ├─ explore: Discovers patterns
    └─ librarian: Researches details
    ↓
tech_lead (Synthesis)
    └─ Collects results
    └─ Synthesizes findings
    └─ Provides final report to user
    ↓
User Receives Report
```

> [!IMPORTANT]
> This flow ensures proper separation of concerns. tech_lead never implements directly, and specialist agents never try to coordinate - they focus on their specific role.

---

## Skills as a Concept

### What Skills Are

**Skills are pre-loaded knowledge packages** that guide agent behavior without hard-coding constraints into the system. Each skill contains:

- **Behavioral guidelines** - How agents should approach their work
- **Decision trees** - When to take different paths
- **Policy enforcement** - What's allowed and forbidden
- **Best practices** - Proven patterns for common situations

Skills are automatically loaded based on which agent is active. You never need to think about individual skill names - they're loaded behind the scenes.

### Why Skills Matter

1. **Consistency** - All agents follow the same guidance without duplicating code
2. **Extensibility** - New skills can be added without changing agent implementation
3. **Separation of Concerns** - Behavioral guidance is separate from core logic
4. **Evolutionary** - Skills improve over time and all agents benefit immediately
5. **Transparency** - Skills make decision-making visible and auditable

### Skill Categories (High-Level)

OpenCode uses four categories of skills:

**Template Skills** - Define how agents interact and respond
- Agent-specific interaction patterns
- Response formats and structures

**Protocol Skills** - Enforce execution patterns
- How to approach work tasks
- When to stop and report vs. continue
- Verification and quality standards

**Policy Skills** - Set boundaries and constraints
- What tools are allowed/forbidden
- When to ask for clarification
- Unicode and formatting standards

**Delegation Skills** - Guide coordination
- When to delegate
- How to frame requests to other agents
- How to handle results

> [!NOTE]
> Users don't need to know individual skill names or manage them. They're auto-loaded based on which agent is working. Think of them as "agent instincts" that guide behavior.

---

## Workflows as a Concept

### What Workflows Are

**Workflows are pre-defined sequences of commands for common, repeatable tasks.** They're invoked with `/workflow-name` syntax and orchestrate multiple steps automatically.

A workflow combines multiple agent actions into a single, bounded operation. Instead of coordinating each step manually, you invoke the workflow once and it handles the delegation and sequencing.

### Why Workflows Matter

1. **Repeatable** - Same steps every time, no variation
2. **Efficient** - Multiple steps in one command vs. separate requests
3. **Bounded** - Workflow has clear entry/exit and success criteria
4. **Documented** - Every workflow has built-in documentation
5. **Testable** - Workflows can be validated and improved

### How Workflows Work

```
User Input: /workflow-deploy-api

    ↓

tech_lead Execution:
    ├─ Run tests (delegate to test_runner)
    ├─ Check code quality (delegate to test_runner)
    ├─ Build application (delegate to test_runner)
    ├─ Verify no errors
    └─ Report results
    
    ↓

Workflow Complete
```

> [!TIP]
> Available workflows are documented in USAGE.md. See that file for the complete list and how to invoke each workflow.

---

## Configuration & Permissions

### Permission System

OpenCode enforces a **permission system** where each agent has specific allowed and forbidden tools. This isn't arbitrary - it's intentional architecture:

- **tech_lead** can read code, write documentation, and run project management commands (git, package installation) but cannot edit code directly or use bash for exploration
- **junior_dev** can edit code and perform file operations but not run tests or install packages
- **test_runner** can run test/build/diagnostic commands and write to /tmp but not edit files, install packages, or modify git state
- **explore** can read files but not edit anything
- **librarian** can fetch external info but not access local files

### Why Constraints Matter

Constraints force proper delegation and prevent anti-patterns:

1. **Prevents Shortcuts** - Can't skip verification or planning steps
2. **Forces Specialization** - Agents stay focused on their role
3. **Ensures Quality** - Complex tasks go through proper channels
4. **Enables Recovery** - When one agent fails, others can retry appropriately

These constraints are defined in `opencode/opencode.json` and are enforced at the framework level.

### Build Agent Fallback

Sometimes the tech_lead delegation workflow isn't sufficient for a task. For those situations, OpenCode includes a **build agent** with comprehensive permissions to implement any task directly.

> [!NOTE]
> The build agent has all permissions necessary to complete tasks end-to-end without delegation. It's designed for cases where the coordination overhead of the delegation model doesn't fit the task at hand.

**When to use build agent:**
- Rapid prototyping where delegation overhead slows you down
- Tasks requiring tight integration across many files simultaneously
- Situations where you want a single agent to handle everything
- When delegation has failed multiple times and you need a different approach

**When to use tech_lead delegation (default):**
- Most standard development tasks
- When you want clear separation of concerns
- When verification and quality checks matter
- When you benefit from specialized agent expertise

---

## Interaction Patterns

### How You Interact With OpenCode

Your interaction with OpenCode is always through **tech_lead**. You're not managing individual agents - you're having a conversation with a coordinator who will handle delegation.

**Typical interaction pattern:**

```
You: "I need to add caching to the API responses"

tech_lead responds:
1. Clarifying Questions: "Which endpoints need caching? How long should items stay cached?"
2. Analysis: "I'll explore the current code structure and see how responses are handled"
3. Planning: "I'll need to verify Redis patterns in the codebase before implementing"
4. Delegation: "I'll implement the changes once I understand current patterns"
5. Verification: "After implementation, tests will ensure nothing broke"
6. Report: "Here's what was implemented and test results"
```

You never need to say "delegate to junior_dev" or "run tests" - tech_lead decides when delegation is appropriate.

### What Happens When tech_lead Delegates

When tech_lead delegates to a specialist agent:

1. **Clear Spec** - tech_lead provides detailed, step-by-step instructions
2. **Focused Execution** - Specialist agent executes only that spec, nothing more
3. **Results** - Specialist reports back what was done or what went wrong
4. **Integration** - tech_lead collects results and continues coordinating
5. **Transparency** - You see what each agent did and their results

> [!NOTE]
> Each agent handoff is visible to you. When junior_dev runs, you see the spec they received and what they report back. This maintains full transparency while keeping coordination logic centralized.

---

## Common Patterns & Best Practices

### When tech_lead Asks Questions

tech_lead will ask clarifying questions when your request is ambiguous. This is normal and expected:

```
You: "Optimize the database queries"

tech_lead: "This could mean several things:
1. Add indexes to slow queries
2. Implement query caching
3. Restructure queries to fetch less data
4. All of the above

Which approach would you prefer, or should I analyze current bottlenecks first?"
```

**Why this matters:** Specificity prevents incorrect implementation and wasted effort.

### When Spec Is Incomplete

If tech_lead delegates to junior_dev and the spec is unclear, junior_dev will stop and report rather than guess:

```
junior_dev report to tech_lead:
"Cannot proceed - spec unclear.

Step 3 says 'Add error handling' but doesn't specify:
- Which errors to catch
- What response format to use
- Whether to log errors

Current finding: 3 different error handling patterns in codebase.

Need: Clarification on which approach to use."
```

This is success - it prevents incorrect changes.

### When Tests Fail

If test_runner finds failures, tech_lead will analyze and plan next steps:

```
test_runner: "2 tests failing:
- test_auth_redirect: Expected 302, got 200
- test_expired_token: Expected 401, got 200"

tech_lead: "The issue is clear - middleware isn't being applied to those routes.
I'll ask junior_dev to check the implementation against the spec."
```

This is how issues are caught and fixed properly.

---

## Mental Model Summary

Think of OpenCode as a **coordinated team with clear roles**:

- **tech_lead** is your direct interface and team coordinator
- **Specialists** (junior_dev, test_runner, explore, librarian) each handle their domain
- **Constraints** force proper coordination and prevent shortcuts
- **Skills** guide behavior without hard-coding it
- **Workflows** handle common repeatable tasks automatically

This structure enables complex multi-step work to be decomposed, executed reliably, and verified systematically - all while keeping you in control through tech_lead.

---

## Next Steps

For detailed instructions on how to use OpenCode, see:
- **[USAGE.md](USAGE.md)** - How to invoke agents and workflows
- **Agent directories** - /opencode/agent/ for detailed agent specifications
- **opencode.json** - Configuration and permission details
