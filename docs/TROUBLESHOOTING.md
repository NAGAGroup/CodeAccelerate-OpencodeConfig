# Troubleshooting

Common issues and solutions when using tech_lead delegation.

## Table of Contents

- [Delegation Issues](#delegation-issues)
- [Agent-Specific Issues](#agent-specific-issues)
- [Permission Errors](#permission-errors)
- [Common Anti-Patterns](#common-anti-patterns)
- [Performance Issues](#performance-issues)

---

## Delegation Issues

### tech_lead Isn't Delegating When Expected

**Symptoms:**
- tech_lead handles tasks directly that seem complex
- No subagent invocation when you expected it
- Results feel incomplete

**Possible Causes:**

1. **Task appears simple to tech_lead**
   - Markdown edits (tech_lead can do directly)
   - Simple questions or explanations
   - Tasks that don't require code modification

2. **Request was too vague**
   - tech_lead answers conceptually instead of implementing
   - Needs more specific instructions to know what to delegate

**Solutions:**

**Be explicit about implementation:**
```
❌ Vague: "How should we handle errors in the API?"
✅ Specific: "Add error handling middleware to all API endpoints"
```

**Request concrete changes:**
```
❌ Conceptual: "Explain the auth flow"
✅ Actionable: "Document the auth flow in a new markdown file"
```

### tech_lead Delegates But Subagent Fails

**Symptoms:**
- Subagent returns error or incomplete results
- tech_lead reports subagent couldn't complete task
- Workflow stalls midway

**Common Causes & Solutions:**

**1. explore can't find what you're looking for**
- Adjust search terms (try variations)
- Broaden search scope
- Check if files/patterns actually exist in codebase

**2. junior_dev can't understand spec**
- This is GOOD - junior_dev is asking for clarification!
- Provide more specific file paths and locations
- Use code anchors instead of vague descriptions

**3. test_runner can't run tests**
- Check test commands are correct
- Verify test framework is installed
- Ensure correct working directory

**4. librarian can't find information**
- Try different search queries
- Check if web access is working
- Specify sources if you have recommendations

### tech_lead Suggests Switching to Build Agent

**Message:**
> "This task requires extensive changes across the codebase. Consider switching to the build agent using Tab."

**Why This Happens:**
- Task scope is too large for delegation workflow
- Cross-cutting changes affect many files
- Full rebuild or major refactor needed

**What To Do:**
1. Press **Tab**
2. Select **build** agent
3. Continue your conversation - context carries over!

**When To Stay With tech_lead:**
- You want to handle task in smaller chunks
- You prefer tech_lead's orchestration approach
- Task can be broken down further

---

## Agent-Specific Issues

### junior_dev Issues

#### Implementation Doesn't Match Expectations

**Symptoms:**
- Code in wrong location
- Changes not as specified
- Missing features

**Root Cause:**
- Spec provided by tech_lead (based on your request) was ambiguous

**Solution:**
- Provide more specific details in your original request
- Reference specific files or patterns
- Include examples of desired outcome

**Example:**
```
❌ Vague: "Add logging to the API"

✅ Specific: "Add debug logging to all Express route handlers in src/api/,
logging the request method, path, and response status code"
```

#### junior_dev Reports "Spec Unclear"

**This is GOOD!** junior_dev is correctly refusing to guess.

**What To Do:**
1. Read junior_dev's feedback carefully - what's unclear?
2. Provide clarification to tech_lead
3. tech_lead will re-delegate with updated spec

**Don't:**
- ❌ Tell junior_dev to "figure it out"
- ❌ Blame the agent
- ❌ Provide vague clarification

**Do:**
- ✅ Answer specific questions
- ✅ Provide file paths or line references
- ✅ Give concrete examples

### explore Issues

#### Too Many Results

**Symptoms:**
- Hundreds of matches returned
- Hard to find relevant results
- Overwhelming output

**Solutions:**

**Narrow your request:**
```
❌ Broad: "Find all files using the database"
✅ Narrow: "Find files that import the UserModel class"
```

**Add scope constraints:**
```
"Find authentication-related middleware in src/api/"
```

**Be more specific about what you're looking for:**
```
"Find where we configure the JWT secret"
```

#### No Results Found

**Possible Causes:**
1. Pattern doesn't exist (correct!)
2. Search term is misspelled
3. Wrong file type or directory
4. Code uses different naming than expected

**Solutions:**
- Try variations of search terms
- Check for typos or capitalization
- Broaden search if too specific
- Ask explore to search for related patterns first

### test_runner Issues

#### Tests Fail After Implementation

**This is normal!** Tests catching issues is their purpose.

**What To Do:**
1. **Review test output carefully** - what specifically failed?
2. **Identify root cause:**
   - Bug in implementation?
   - Missing edge case?
   - Test expectations need updating?
3. **Request fix from tech_lead** with specific details
4. **Verify with test_runner again**

**Example:**
```
"The user registration tests are failing with 'email validation error'.
Fix the validation logic to handle international domain names correctly."
```

#### Can't Run Tests

**Symptoms:**
- "Command not found" errors
- "No test framework detected"
- Build failures before tests run

**Solutions:**

**Check test commands:**
```
"Use npm test instead of jest directly"
```

**Verify environment:**
```
"Run tests from the project root directory"
```

**Check dependencies:**
```
"Run npm install before running tests"
```

### librarian Issues

#### Can't Find Documentation

**Possible Causes:**
1. Topic too niche or new
2. Using wrong search terms
3. Web access issues

**Solutions:**

**Rephrase query:**
```
❌ Too specific: "React Server Components in Next.js 15.2"
✅ Broader: "React Server Components best practices"
```

**Provide known sources:**
```
"Look up authentication patterns on the Auth0 blog"
```

**Try related topics:**
```
If "Fastify plugins" yields nothing, try "Fastify extensions"
```

---

## Permission Errors

### "Permission Denied" for Tool

**Symptoms:**
```
Error: Agent 'junior_dev' does not have permission to use 'bash'
```

**Explanation:**
Each agent has specific permissions. This is by design for security.

**Solutions:**

**Check which agent has that permission:**
- bash → test_runner only
- write/edit → junior_dev only (code), tech_lead only (markdown)
- webfetch → librarian only

**Request the right agent:**
```
❌ "junior_dev, run the tests"
✅ "tech_lead, have test_runner verify the changes"
```

### "Ask Permission" Prompts

**Symptoms:**
tech_lead asks permission before certain operations:
- Reading .env files
- Running bash commands
- Accessing external directories

**This is normal!** Sensitive operations require confirmation.

**What To Do:**
1. **Review the requested operation**
2. **Approve** if safe and intended
3. **Deny** if unexpected or concerning

**Don't:**
- ❌ Auto-approve without reading
- ❌ Get frustrated by security checks

**Do:**
- ✅ Understand why permission is needed
- ✅ Verify it aligns with your request
- ✅ Appreciate the safety mechanism

---

## Common Anti-Patterns

### Anti-Pattern 1: Over-Specifying Workflow

**Don't:**
```
"First use explore to find files, then use junior_dev to modify them,
then use test_runner to verify."
```

**Do:**
```
"Update all database query functions to use connection pooling"
```

**Why:**
Let tech_lead figure out the workflow. Micromanaging defeats the purpose of orchestration.

### Anti-Pattern 2: Vague Goals

**Don't:**
```
"Improve the code quality"
"Make it faster"
"Fix the bugs"
```

**Do:**
```
"Add input validation to all API endpoints"
"Implement database query caching for the product catalog"
"Fix the race condition in user session management"
```

**Why:**
Specificity enables effective delegation.

### Anti-Pattern 3: Expecting Mind Reading

**Don't:**
```
"Do what we discussed earlier"
"You know what I mean"
"Fix the usual issues"
```

**Do:**
```
"Add the authentication middleware we discussed - JWT validation
with token refresh, applied to all /api/ routes except /api/login"
```

**Why:**
Be explicit. Context isn't always preserved across sessions.

### Anti-Pattern 4: Blaming Agents for Spec Issues

**Don't:**
```
"junior_dev did it wrong, tell them to fix it"
"Why didn't explore find that?"
"test_runner should have caught this"
```

**Do:**
```
"I need to provide more specific instructions"
"Let me refine my search query"
"I should verify the test setup is correct"
```

**Why:**
Agents execute instructions. If results aren't right, the instructions need improvement.

### Anti-Pattern 5: Using Subagents Directly

**Don't:**
Switch to explore/librarian/junior_dev/test_runner directly for most tasks.

**Do:**
Always start with tech_lead and let it delegate.

**Why:**
Subagents expect specific context that tech_lead provides. Direct use often leads to confusion.

**Exception:**
You can use subagents directly if you understand their constraints and provide proper context, but this is an advanced use case.

---

## Performance Issues

### Delegation Feels Slow

**Symptoms:**
- Multiple subagent calls taking time
- Waiting for each step to complete

**This is normal for:**
- Complex multi-step workflows
- Tasks requiring research + implementation
- Full test suite verification

**Optimization Tips:**

**1. Use build agent for large tasks:**
Press Tab → select build for full rebuilds or major refactors.

**2. Break into smaller chunks:**
```
Instead of: "Research, implement, and test feature X"
Do: "Implement feature X using this pattern" (after researching separately)
```

**3. Skip unnecessary verification:**
```
"Update the README" (no need for testing)
vs
"Update API endpoints" (testing makes sense)
```

### Models Feel Wrong

**Symptoms:**
- Haiku agents making mistakes
- Sonnet agents too expensive

**Solutions:**

**Check current models:**
```bash
jq '.agent' opencode/opencode.json
```

**Modify if needed:**
Edit `opencode/opencode.json` to change model assignments:
```json
{
  "agent": {
    "junior_dev": {
      "model": "github-copilot/claude-sonnet-4.5"
    }
  }
}
```

**Trade-offs:**
- Sonnet: Smarter, more expensive, slower
- Haiku: Faster, cheaper, good for focused tasks

---

## Getting Help

If you're still stuck:

1. **Check configuration:**
   ```bash
   cat opencode/opencode.json
   cat opencode/agent/tech_lead.md
   ```

2. **Review related documentation:**
   - [Core Concepts](CONCEPTS.md) - Understanding architecture
   - [Usage Guide](GUIDE.md) - Practical examples
   - [Reference](REFERENCE.md) - Quick lookup

3. **Verify environment:**
   - OpenCode version compatible?
   - All dependencies installed?
   - MCP servers running (if using)?

4. **Simplify and retry:**
   - Break complex request into smaller parts
   - Test with simple task first
   - Eliminate variables

5. **Check OpenCode docs:**
   - Some issues may be OpenCode-related, not config-specific
   - Visit OpenCode documentation for platform issues

---

## Quick Diagnostic Checklist

When something goes wrong:

- [ ] Did I clearly specify what I want accomplished?
- [ ] Am I talking to the right agent (usually tech_lead)?
- [ ] Did I provide enough context (file paths, examples)?
- [ ] Did I read error messages/feedback carefully?
- [ ] Are permissions set correctly for this operation?
- [ ] Is this task better suited for build agent?
- [ ] Did I check the agent/skill source files for guidance?

Most issues resolve by being more specific or understanding agent capabilities better.

## Summary

**Remember:**
- Start with tech_lead, let it delegate
- Be specific about goals, not workflows
- Read feedback carefully before retrying
- Permission errors are features, not bugs
- Vague requests = vague results
- When in doubt, check source files (`opencode/agent/`, `opencode/skill/`)

The system works best when you provide clear goals and trust the orchestration.
