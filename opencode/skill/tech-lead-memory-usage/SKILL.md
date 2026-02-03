---
name: tech-lead-memory-usage
description: Skill documentation regarding the usage of the memory tool for persistent knowledge management.
---

# Memory Tool Usage Guide

## Overview

The memory tool is a persistent knowledge management system that stores and retrieves information across conversations. It uses semantic search powered by local embedding models to help you quickly find relevant information without external API calls. Tags are critical for making memories discoverable and searchable.

> [!IMPORTANT]
> Tags are essential for memory discoverability. Memories without tags have significantly lower search rankings. Always include relevant technical keywords when adding memories.

> [!CAUTION]
> **Tag Enforcement: The system will BLOCK attempts to add memories without tags.** You must provide tags when using `mode: "add"` or the operation will fail with a reflection prompt guiding you to add tags. This enforcement ensures all memories remain discoverable.

## Memory Operations

### Adding Memories

Add new information to your memory store:

```typescript
memory({
  mode: "add",
  content:
    "OAuth2 PKCE flow implementation requires code_verifier and code_challenge for security",
  type: "security-pattern",
  tags: "oauth2, pkce, authentication, security, best-practices",
});
```

**Parameters:**

- `content` (required) → The information to store. Write clearly and descriptively so future searches can find it.
- `type` (optional) → Category or classification for organizing memories (e.g., "security-pattern", "architecture", "implementation-note").
- `tags` (REQUIRED) → Comma-separated technical keywords for search ranking. **Tags are MANDATORY** - the system will block add operations without tags. They rank highest in search results.

> [!TIP]
> Use specific, technical keywords in tags that describe the content. Multiple tags dramatically improve search ranking. Example: "authentication, jwt, token, security, nodejs"

### Searching Memories

Search for relevant memories using semantic similarity:

```typescript
memory({
  mode: "search",
  query: "authentication jwt token storage",
});
```

**How search works:**

- Uses semantic similarity on content (meaning-based search)
- Tags rank highest in search results
- Returns memories most relevant to your query
- Results are ordered by relevance

> [!IMPORTANT]
> For best search results, use specific technical keywords that match your tags. Tagged content consistently ranks higher than untagged content.

### Listing Memories

View recent memories with optional limit:

```typescript
memory({
  mode: "list",
  limit: 10,
});
```

**Parameters:**

- `limit` (optional) → Number of recent memories to display (default varies by implementation).

Shows your most recent memories in order, useful for reviewing what you've stored.

### Viewing Profile

Check your user preferences and memory profile:

```typescript
memory({
  mode: "profile",
});
```

Displays information about your account and memory usage statistics.

### Forgetting Memories

Remove a specific memory by ID:

```typescript
memory({
  mode: "forget",
  memoryId: "memory-id-12345",
});
```

**Parameters:**

- `memoryId` (required) → The unique identifier of the memory to delete.

Permanently removes a memory from your store.

### Help

Get available commands and usage guidance:

```typescript
memory({
  mode: "help",
});
```

Shows all memory operations and their syntax.

## Best Practices

### Always Use Tags

> [!IMPORTANT]
> Tags are the single most important factor for memory discoverability. Do not skip them.

- **Tags enable discoverability** → Memories with tags rank much higher in searches
- **Multiple tags improve ranking** → Use 4-6 relevant keywords per memory
- **Use technical keywords** → Keywords should match your typical search terms
- **Be specific** → "oauth2, pkce, security" is better than "auth"

**Example with good tags:**

```typescript
memory({
  mode: "add",
  content:
    "Express middleware for JWT validation checks Authorization header for Bearer token",
  type: "implementation",
  tags: "jwt, express, middleware, authentication, authorization, nodejs",
});
```

### Tag Migration

Older memories may lack tags, which significantly reduces their discoverability:

- The memory plugin UI will detect memories without tags
- You will be offered an opportunity to migrate and add tags
- **Accept migration** when prompted to improve search performance
- Adding tags retroactively restores discoverability

> [!NOTE]
> Tag migration is not automatic - you must accept the prompt. This improves search ranking for all your memories.

### List Before You Search

> [!IMPORTANT]
> Always LIST your recent memories before searching. Listing shows you what knowledge you already have stored.

**Recommended workflow:**

1. **Start with list** → See your recent memories to understand what you have
   ```typescript
   memory({ mode: "list", limit: 10 });
   ```

2. **Then search** → Find specific relevant memories with keywords
   ```typescript
   memory({ mode: "search", query: "oauth2 authentication security" });
   ```

3. **Review results** → Check similarity scores and relevance

4. **Add new memories** → Store new knowledge with 4-6 technical tags

> [!TIP]
> Listing helps you avoid duplicate memories and see patterns in what you've stored. Always list before planning or searching.

### Search Strategy

Use these techniques for effective searches:

1. **Use specific technical terms** → "jwt token refresh" not just "auth"
2. **Match your tags** → Search queries should reflect the tags you use
3. **Multiple keywords help** → "oauth2 pkce security" returns better results than single words
4. **Remember tagged content ranks higher** → Investing in tags pays off in better search results

### Content Organization

Structure your memories for better usability:

- **Use meaningful type classifications** → Helps organize and categorize knowledge
- **Write clear, descriptive content** → Future-you needs to understand the context
- **Include why it matters** → Add context about when and why you use this information
- **Be specific and concrete** → "JWT tokens expire after 1 hour by default" beats "tokens expire"

**Example with good organization:**

```typescript
memory({
  mode: "add",
  content:
    "CORS preflight requests use OPTIONS method. Browsers send preflight for cross-origin requests with custom headers. Server must respond with Access-Control headers to allow request.",
  type: "web-standard",
  tags: "cors, preflight, OPTIONS, http, security, browser, cross-origin",
});
```

## Technical Details

The memory system is designed for offline, privacy-preserving operation:

- **Local storage** → All data stored in SQLite at ~/.opencode-mem/data
- **Embedding model** → Local Xenova/nomic-embed-text-v1 (no external API calls)
- **12+ built-in models** → Multiple embedding and processing models available locally
- **No external dependencies** → No API keys, no external services, no internet required
- **Fast semantic search** → Meaning-based search powered by local embeddings

> [!NOTE]
> The memory system uses semantic embeddings to understand meaning, not just keyword matching. This means searches find conceptually related content even if exact keywords don't match.

## Examples

### Example 1: Adding a security pattern with tags

```typescript
memory({
  mode: "add",
  content:
    "OAuth2 PKCE flow implementation requires code_verifier and code_challenge for security. Code verifier is random string 43-128 characters, code challenge is base64url(SHA256(code_verifier)). Flow prevents authorization code interception attacks.",
  type: "security-pattern",
  tags: "oauth2, pkce, authentication, security, best-practices, code-flow",
});
```

### Example 2: Searching with specific keywords

```typescript
memory({
  mode: "search",
  query: "authentication jwt token storage",
});
```

Returns memories about storing JWT tokens and authentication patterns. Results ranked by relevance, with tagged content appearing first.

### Example 3: Listing recent memories

```typescript
memory({
  mode: "list",
  limit: 5,
});
```

Shows your 5 most recent memories, useful for quick review of what you've stored recently.

### Example 4: Adding an architecture decision

```typescript
memory({
  mode: "add",
  content:
    "Monorepo vs multi-repo: Chose monorepo for shared utilities and consistent dependency versions. Single CI/CD pipeline simplifies deployment. Workspace tools (npm workspaces, yarn workspaces, pnpm) manage multiple packages.",
  type: "architecture-decision",
  tags: "monorepo, architecture, npm-workspaces, ci-cd, dependency-management",
});
```

### Example 5: Searching and finding related content

```typescript
memory({
  mode: "search",
  query: "token expiration refresh",
});
```

Semantic search finds memories about token management, JWT refresh flows, session expiration, and related authentication concepts.

## Workflow Integration

The memory tool integrates seamlessly into your workflow:

1. **During implementation** → Add memories about patterns and decisions you're making
2. **Before complex tasks** → List recent memories first, then search for relevant memories to inform your approach
3. **After learning** → Store new patterns and techniques you discover
4. **In future sessions** → Find exactly what you need without starting from scratch

> [!TIP]
> Make memory addition part of your task completion routine. Store the patterns, decisions, and solutions while they're fresh in your mind.
