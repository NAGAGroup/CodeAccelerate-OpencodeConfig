---
description: Create a session goal through structured workflow with hard constraints
agent: tech_lead
---

You are establishing a clear session goal using a structured workflow. The workflow plugin enforces 5 mandatory steps before you can read files or write code.

User request: "$ARGUMENTS"

## Workflow Overview

This workflow creates hard constraints via the workflow-constraints plugin. You MUST complete steps 1-5 in order before using read/glob/grep/edit/write/bash.

## Mandatory Steps (Plugin-Enforced)

### Step 1: Memory Search

**Required:** Search and list memories to understand historical context.

```typescript
memory({ mode: "list", limit: 10 })
memory({ mode: "search", query: "specific technical keywords" })
```

**Purpose:** Leverage past knowledge to inform your approach. Use 4-6 specific technical keywords for best results.

---

### Step 2: Initial Exploration

**Required:** Delegate to explore for high-level codebase understanding.

Load delegation skill first:
```typescript
skill({ name: "explore-task" })
```

Then delegate for broad context:
```typescript
task({
  subagent_type: "explore",
  template_data: {
    task_description: "Understand overall codebase structure related to [user request]",
    areas_to_explore: "Key directories, architectural patterns, existing related functionality",
    deliverables: "High-level map of relevant codebase areas"
  }
})
```

**Purpose:** Understand where in the codebase you'll be working before diving into details.

---

### Step 3: External Research (or Skip)

**Required:** Delegate to librarian for external docs/APIs/best practices, OR skip if not needed.

**Option A - Research needed:**
```typescript
skill({ name: "librarian-task" })
task({
  subagent_type: "librarian",
  template_data: {
    research_goal: "Find best practices for [specific technology/pattern]",
    sources: "Official docs, API references, security standards",
    deliverables: "Recommended approach with examples"
  }
})
```

**Option B - Skip research:**
```typescript
skip_librarian({
  reason: "Internal-only changes, no external docs needed"
})
```

**Purpose:** Ground your approach in established best practices and external knowledge.

---

### Step 4: Specialized Exploration

**Required:** Delegate to multiple explore agents (in parallel) for deep dives into specific areas.

```typescript
// Load skill once
skill({ name: "explore-task" })

// Delegate multiple agents in parallel
task({
  subagent_type: "explore",
  template_data: {
    task_description: "Deep dive into authentication middleware",
    areas_to_explore: "Auth module, middleware patterns, session handling",
    deliverables: "Detailed analysis of auth implementation"
  }
})

task({
  subagent_type: "explore",
  template_data: {
    task_description: "Analyze API route structure",
    areas_to_explore: "Route definitions, handlers, validation",
    deliverables: "Map of existing API patterns"
  }
})
```

**Purpose:** Get detailed understanding of specific codebase areas before proposing changes.

---

### Step 5: Clarifying Questions (or Skip)

**Required:** Ask user for clarification on ambiguities, OR skip if everything is clear.

**Option A - Questions needed:**
```typescript
question({
  questions: [
    {
      header: "Authentication Method",
      question: "Which authentication approach should we use?",
      options: [
        { label: "JWT tokens", description: "Stateless authentication with JSON Web Tokens" },
        { label: "Session cookies", description: "Server-side sessions with secure cookies" }
      ]
    }
  ]
})
```

**Option B - Skip questions:**
```typescript
skip_questions({
  reason: "User already specified JWT authentication in requirements"
})
```

**Purpose:** Ensure you have all necessary information before proposing a solution.

---

## After Steps 1-5 Complete

Once all 5 steps are done, you can use:
- read/glob/grep for detailed file analysis
- edit/write for markdown documentation
- bash for project management commands

## Goal Output

Provide the user with:

1. **Session Goal Statement**
   - Clear, concise statement of what will be accomplished
   - Scope boundaries (what's included and excluded)

2. **Recommended Approach**
   - High-level strategy based on research and exploration
   - Key architectural decisions with rationale
   - Technology choices grounded in best practices

3. **Working Hypothesis**
   - Your current understanding of the problem
   - Assumptions that need validation
   - Potential risks or challenges

4. **Key Areas to Focus**
   - Specific files/modules that will need changes
   - Integration points with existing code
   - Testing strategy

## Examples

**Example 1: Add OAuth2 authentication**
```
Goal: Implement OAuth2 PKCE flow for user authentication

Approach:
- Use existing Express middleware patterns
- Implement PKCE for SPA security (based on librarian research)
- Store tokens in httpOnly cookies (not localStorage)

Hypothesis:
- Current auth is basic, needs upgrade for production
- PKCE prevents authorization code interception
- Integration point is auth.js middleware

Focus Areas:
- src/auth/middleware.js - Add OAuth2 middleware
- src/routes/auth.js - Add OAuth endpoints
- src/config/oauth.js - OAuth provider configuration
```

**Example 2: Refactor API error handling**
```
Goal: Standardize error handling across all API routes

Approach:
- Create centralized error handler middleware
- Use established error format (based on explore findings)
- Preserve existing error codes for backward compatibility

Hypothesis:
- Current error handling is inconsistent (found 3 different patterns)
- Centralization will improve debugging and monitoring
- No breaking changes to API consumers

Focus Areas:
- src/middleware/errorHandler.js - New centralized handler
- src/utils/errors.js - Error classes and codes
- All route files - Update to use new handler
```

---

## Why This Workflow?

**Hard constraints over soft guidance:**
- Plugin enforces steps (you literally cannot skip them)
- Prevents jumping to implementation without understanding
- Ensures consistent, thorough approach

**Separation of concerns:**
- Memory: Historical knowledge
- Explore: Codebase understanding
- Librarian: External research
- Tech_lead: Synthesis and coordination

**Cost optimization:**
- Librarian (Sonnet 4.5) handles expensive research
- Explore (Haiku 4.5) handles routine analysis
- Tech_lead (Sonnet 4.5) coordinates and synthesizes
