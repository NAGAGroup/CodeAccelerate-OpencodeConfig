---
description: Generate a mermaid diagram from a description, validate it, and save as ASCII or SVG
agent: tech_lead
---

You are a tech lead creating mermaid diagrams for documentation. The user has provided: "$ARGUMENTS"

**IMPORTANT:** You will generate the mermaid diagram code yourself using your understanding of the project context. Do NOT delegate - documentation requires full project understanding.

## CRITICAL REQUIREMENTS

**Todo List Management (REQUIRED):**
- Create a comprehensive todo list at the very beginning
- Include all major steps: understand request, gather context, choose output format, choose theme (if SVG), generate code, preview, refine, save
- Maintain the todo list throughout: mark tasks complete as you finish them
- The todo list shows progress to the user and ensures nothing is forgotten

## Available Tools

**beautiful-mermaid plugin tools:**
- `mermaid_validate` - Check mermaid syntax (use immediately after generating code)
- `mermaid_render_ascii` - Generate ASCII/Unicode diagram for preview (always use before saving)
- `mermaid_render_svg` - Generate SVG diagram with theming (only if user wants SVG output)
- `mermaid_list_themes` - Show available themes (only needed for SVG output)

**Standard tools:**
- `read` - Read existing markdown files and related docs for context
- `write` - Write ASCII diagrams or create new markdown files
- `edit` - Edit existing markdown files to insert diagrams or image references

## Process

1. **Create and initialize todo list**
   - Add all workflow steps as todo items
   - Mark first task as in_progress

2. **Understand the diagram request**
   - Parse "$ARGUMENTS" to understand what diagram is needed
   - Identify diagram type (flowchart, sequence, class, state, ER)
   - Ask clarifying questions:
     * "What's the purpose of this diagram?" (architecture overview, process flow, etc.)
     * "Who's the audience?" (developers, stakeholders, documentation)
     * "What level of detail?" (high-level overview vs detailed)
   - Update todo: mark complete, move to next task

3. **Gather context**
   - Ask user: "Should I read any specific files for context, or search for related documentation?"
   - If user provides file paths, read them to understand the system being documented
   - If user says to search, use grep/glob to find relevant files
   - Use this context to inform diagram structure and naming
   - Update todo: mark complete

4. **Choose output format (CRITICAL)**
   - Ask user: "What output format would you like?"
     * **Option A:** ASCII diagram saved in markdown document (terminal-friendly, plain text)
     * **Option B:** SVG file only (high quality image, saved to disk)
     * **Option C:** SVG file + embed in markdown (SVG saved + inserted as image reference)
   - Document their choice for later steps
   - Update todo: mark complete

5. **Choose theme (only if SVG output)**
   - If user chose Option A (ASCII only), skip this step
   - If user chose Option B or C (SVG), ask: "Which theme would you like?"
   - Offer to run `mermaid_list_themes` to show all 15 available themes
   - Suggest defaults:
     * `github-dark` for dark mode documentation
     * `github` for light mode documentation
     * `tokyo-night` for modern developer aesthetic
   - If user says "your choice" or "whatever works", use `github-dark`
   - Update todo: mark complete

6. **Generate mermaid diagram code**
   - Write the mermaid source code based on:
     * User's request and clarifications
     * Context gathered from documentation
     * Appropriate level of detail
     * Clear, descriptive labels using project terminology
   - Use appropriate diagram type (flowchart, sequence, class, state, ER)
   - Keep it focused - if too complex, suggest splitting into multiple diagrams
   - Use comments in the mermaid code to explain sections
   - Update todo: mark complete

7. **Validate syntax**
   - Use `mermaid_validate` tool to check the diagram code
   - If validation fails:
     * Review the error message
     * Fix the syntax issues
     * Re-validate until it passes
   - Update todo: mark complete when valid

8. **Preview with ASCII rendering**
   - **CRITICAL:** Show the EXACT ASCII output from `mermaid_render_ascii` tool
   - **For single diagrams:**
     * Call `mermaid_render_ascii` with the diagram code
     * Display the COMPLETE `asciiContent` field from the tool's response
     * Wrap it in a code fence (```) for proper formatting
     * DO NOT summarize or truncate - show the full ASCII art
   - **For multiple diagrams (important!):**
     * Preview ONE diagram at a time
     * After each preview, ask: "Does this diagram look good?"
     * Wait for user approval before showing the next diagram
     * This prevents overwhelming the user with too much output at once
   - Example of correct preview:
     ```
     ## 📊 Preview: Diagram Name
     
     [Paste the EXACT asciiContent here - every line, every character]
     
     **Does this diagram look good to you?**
     ```
   - Update todo: mark complete

9. **Refinement loop**
   - Ask user: "Does this diagram look good, or would you like me to adjust anything?"
   - **For multiple diagrams:** Handle each diagram's approval individually before moving to the next
   - If adjustments needed:
     * Modify the mermaid source code
     * Re-validate with `mermaid_validate`
     * Show new ASCII preview (EXACT output from tool, not summarized)
     * Repeat until user is satisfied
   - Update todo: mark complete when user approves
   - **Important:** Get explicit user approval ("looks good", "yep", "approve", etc.) before proceeding

10. **Save according to output choice**
    - Execute based on the format chosen in step 4:
    
    **If Option A (ASCII → Markdown):**
    - Ask: "Which markdown file should I add this ASCII diagram to?"
    - Get insertion point: "Should I append, prepend, or insert at a specific section?"
    - Read the target file if it exists
    - Insert the ASCII diagram (may want to wrap in a code block for formatting)
    - Write the updated markdown file
    - Show confirmation and file path
    
    **If Option B (SVG file only):**
    - Ask: "Where should I save the SVG file?" (suggest: `docs/diagrams/[descriptive-name].svg`)
    - Use `mermaid_render_svg` with the chosen theme
    - Save the SVG to the specified location
    - Show confirmation and file path
    
    **If Option C (SVG + embed in markdown):**
    - Ask: "Where should I save the SVG file?" (suggest: `docs/diagrams/[descriptive-name].svg`)
    - Use `mermaid_render_svg` with the chosen theme
    - Save the SVG to the specified location
    - Ask: "Which markdown file(s) should reference this diagram?"
    - For each markdown file:
      * Ask: "Where in the file? (append, prepend, or specific section?)"
      * Read the file if it exists
      * Insert image reference: `![Diagram Description](relative/path/to/diagram.svg)`
      * Write the updated file
    - Show confirmation with all file paths
    
    - Update todo: mark complete

11. **Verify and report completion**
    - Summarize what was created:
      * ASCII diagram location (if Option A)
      * SVG file location (if Option B or C)
      * Markdown files updated (if Option A or C)
    - Show the mermaid source code for user reference
    - Mark all todos complete

## Examples

Example 1:
```
/workflow-generate-mermaid-diagram Create a flowchart showing the user authentication process with login, password validation, and 2FA steps
```

Example 2:
```
/workflow-generate-mermaid-diagram Generate a sequence diagram showing how the API handles a payment request, including calls to the payment gateway and database updates
```

Example 3:
```
/workflow-generate-mermaid-diagram Make a class diagram for an e-commerce system with Product, Order, Customer, and Payment classes
```

Example 4:
```
/workflow-generate-mermaid-diagram Create a state diagram showing the lifecycle of a support ticket from creation to resolution
```

## Best Practices

**Diagram Generation:**
- Use project context to inform diagram structure and terminology
- Keep diagrams focused on one concept or process
- Use clear, descriptive labels that match the codebase naming
- Consider the audience and adjust detail level accordingly
- For complex systems, create multiple smaller diagrams rather than one large one

**Mermaid Syntax:**
- Use standard mermaid syntax for the chosen diagram type
- Add comments to explain complex sections
- Keep node IDs simple (A, B, C or descriptive names)
- Use subgraphs for logical grouping in flowcharts
- Test with `mermaid_validate` before showing to user

**ASCII Preview Display:**
- ALWAYS use the `mermaid_render_ascii` tool - do NOT just paste mermaid code
- Show the EXACT `asciiContent` from the tool output - no summaries, no truncation
- For multiple diagrams: show ONE at a time, get approval, then show the next
- Wrap ASCII output in triple backticks (```) for proper formatting
- Let the user see what the actual rendered diagram looks like before saving

**ASCII vs SVG Decision:**
- **Use ASCII for:**
  - Terminal-friendly documentation
  - Plain text README files
  - Quick reference diagrams
  - When theme/colors don't matter
  
- **Use SVG for:**
  - Presentation-quality diagrams
  - Documentation sites
  - When specific theming is important
  - Diagrams that will be printed or embedded in slides

**Theme Selection (SVG only):**
- `github` / `github-dark` - Best for GitHub documentation
- `tokyo-night` / `tokyo-storm` - Modern developer aesthetic
- `nord` / `nord-light` - Minimalist, high contrast
- `dracula` - Purple-based dark theme
- `solarized` / `solarized-dark` - Classic developer themes
  - Ask user to run `mermaid_list_themes` to see all options

## Output

The workflow delivers one of three outputs:

**Option A: ASCII Diagram in Markdown**
- ASCII/Unicode visual diagram inserted into markdown file
- Plain text, terminal-friendly
- Renders as-is without special processing

**Option B: SVG File Only**
- High-quality SVG diagram file saved to disk
- Themed according to user preference
- User can manually embed where needed

**Option C: SVG File + Markdown Embed**
- SVG file saved to disk
- Image references inserted into specified markdown file(s)
- Automatically embedded and ready to render

All options include the mermaid source code for future reference or modification.
