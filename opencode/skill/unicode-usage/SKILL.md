---
name: unicode-usage
description: Unicode policy - strictly prohibit emojis, allow arrows and structural Unicode
---

## The Rule

**Strictly prohibit emojis and decorative pictographs. Allow arrows and structural Unicode.**

## Prohibited Unicode (NEVER use these)

### Emojis and Pictographic Symbols (STRICTLY BANNED)
- Checkmarks/X marks: ❌, ✅, ✓, ✔, ✗, ✘
- Warning/alert: ⚠️, ⛔, 🚫
- Symbols: 📊, 🎯, 🎉, 💡, 🔧, 📝, etc.
- Faces: 😀, 😎, 🤔, etc.
- Objects: 🏠, 🚀, 📱, etc.
- **ANY pictographic emoji from Unicode blocks:**
  - Emoticons (U+1F600-U+1F64F)
  - Miscellaneous Symbols (U+2600-U+26FF) - includes ⚠️, ✓, ✔, ✗, ✘
  - Dingbats (U+2700-U+27BF) - includes ✓, ✔, ✗, ✘, ❌, ✅
  - Miscellaneous Symbols and Pictographs (U+1F300-U+1F5FF)
  - Transport and Map Symbols (U+1F680-U+1F6FF)

### Typographic Symbols
- Smart quotes: " " ' ' (use straight quotes: " ')
- Em/en dashes: — – (use -- or -)
- Ellipsis: … (use ...)
- Special bullets: •, ◦, ▪, ◘, ◙

### Mathematical Symbols
- ≠, ≤, ≥, ≈, ∞, ∑, ∏, etc.
- Use ASCII equivalents: !=, <=, >=, ~=, etc.

## Allowed Unicode (Functional Structural Set)

### All Arrow Types (Unicode U+2190-U+21FF)
Arrows are functional indicators, not decorative emojis. ALL arrow types are allowed:

**Basic Arrows:**
- Left: ← (U+2190)
- Up: ↑ (U+2191)
- Right: → (U+2192)
- Down: ↓ (U+2193)
- Left-right: ↔ (U+2194)
- Up-down: ↕ (U+2195)

**Diagonal Arrows:**
- ↖ ↗ ↘ ↙ (U+2196-U+2199)

**Double/Heavy Arrows:**
- ⇐ ⇑ ⇒ ⇓ ⇔ (U+21D0-U+21D4)

**Curved/Special Arrows:**
- ↩ ↪ ⤴ ⤵ (U+21A9, U+21AA, U+2934, U+2935)

**Use case:** Flow diagrams, process descriptions, directional indicators, mappings

**Example:**
```
User input → tech_lead → junior_dev
             ↓
        test_runner

Process flow: Start ⇒ Middle ⇒ End
Navigation: ← Back | Next →
```

### Box-Drawing Characters (U+2500-U+257F)
Render properly in terminals for structured visual content:

- Vertical: │
- Horizontal: ─
- Corners: ┌ ┐ └ ┘
- Junctions: ├ ┤ ┬ ┴ ┼
- Heavy/double variants: ═ ║ ╔ ╗ ╚ ╝ etc.

**Use case:** Directory structures, tables, ASCII art diagrams

**Example:**
```
project/
├── src/
│   ├── main.rs
│   └── lib.rs
└── tests/
    └── integration.rs
```

## Why This Matters

**Emojis are prohibited because:**
1. **LLM task adherence** - Models copy emojis into code or misinterpret context
2. **Inconsistent rendering** - Emojis look different across platforms
3. **Unprofessional** - Decorative symbols reduce technical clarity
4. **Parsing issues** - Emoji can break parsers and tools

**Arrows and box-drawing are allowed because:**
1. **Functional purpose** - Convey direction, structure, and flow
2. **Terminal support** - Modern terminals handle these well
3. **No ASCII equivalent** - Vertical arrows and box-drawing have no good ASCII alternative
4. **Structural clarity** - Improve readability of diagrams and trees

## Approved ASCII Alternatives (for prohibited Unicode)

| Prohibited Unicode | ASCII Alternative | Usage |
|---------|------------------|--------|
| ✅, ✓, ✔ | `[OK]`, `(yes)`, `+`, `PASS` | Positive indicator |
| ❌, ✗, ✘ | `[X]`, `(no)`, `-`, `FAIL` | Negative indicator |
| ⚠️ | `[!]`, `WARNING`, `!` | Warning indicator |
| 📊 | `[Chart]`, `[Data]` | Data/chart reference |
| 🎯 | `[Target]`, `[Goal]` | Goal/objective |
| • | `-`, `*` | List bullet |
| " " | `"` (straight quotes) | Quotation marks |
| — | `--` (double dash) | Em dash |
| – | `-` (single dash) | En dash |
| … | `...` | Ellipsis |

## Examples

### Wrong (Prohibited emojis):
```
- ✅ Task completed successfully
- ❌ This approach won't work
- 📊 Data shows improvement
- ⚠️ Warning: Be careful here
```

### Correct (ASCII alternatives):
```
- [OK] Task completed successfully
- [X] This approach won't work
- [Data] Data shows improvement
- [!] Warning: Be careful here
```

### Correct (Allowed arrows and structure):
```
User → tech_lead → junior_dev
             ↓
        test_runner

src/
├── agent/
│   ├── tech_lead.md
│   └── junior_dev.md
└── skill/
    └── unicode-usage/
```

## Enforcement

### For Agents with Write Permissions (tech_lead, junior_dev)

Before sending ANY output:
1. **Check** - Scan your response for prohibited Unicode (emojis)
2. **Replace** - Use ASCII alternatives for emojis and decorative symbols
3. **Verify** - Arrows and box-drawing are ALLOWED, keep them
4. **Never introduce** - Don't add new emojis

When writing or editing files:
- Replace prohibited Unicode (emojis, smart quotes, decorative symbols)
- Keep allowed Unicode (arrows, box-drawing) - these are GOOD
- Use ASCII alternatives for emojis

### For Read-Only Agents (explore, librarian, test_runner)

You cannot edit files, but you MUST report prohibited Unicode findings:

1. **Scan** - When reading files, look for prohibited Unicode (emojis)
2. **Report** - If you find prohibited Unicode, report it:
   ```
   [Prohibited Unicode Found] in /path/to/file.md:
   - Line 42: Found "✅" (U+2705 WHITE HEAVY CHECK MARK - emoji) - suggest "[OK]"
   - Line 58: Found "⚠️" (U+26A0 WARNING SIGN - emoji) - suggest "[!]"
   ```
3. **Ignore** - Don't report allowed Unicode (arrows ←↑→↓, box-drawing │├└)
4. **Prioritize** - Include prohibited Unicode findings in your summary

Even if Unicode is not directly related to your task, report prohibited Unicode when found.

## Special Cases

### Code Examples
When showing prohibited Unicode IN code as an example of what NOT to do:
```markdown
Wrong: `console.log('✅ Done')`  // Emoji in code
Correct: `console.log('[OK] Done')`  // ASCII alternative
```

### Markdown Files
- Headers: `## Section Name` (no emoji prefixes like 📊)
- Lists: Use `-` or `*` (not •)
- Flow diagrams: Arrows are ALLOWED and ENCOURAGED (→, ↓, ↑, ←)
- Directory trees: Box-drawing characters are ALLOWED (│, ├, └, ─)
- Emphasis: Use `**bold**` and `*italic*` (not Unicode emphasis)
- Indicators: Use `[OK]`, `[X]`, `[!]` instead of ✅, ❌, ⚠️

### Documentation Standards
- Use GitHub callout boxes for emphasis: `> [!NOTE]`, `> [!WARNING]`, etc.
- Don't use emojis for emphasis or decoration
- Use arrows freely for flow descriptions (→, ↑, ↓, ←, ↔)
- Use box-drawing for directory structures
- Replace checkmarks/X marks with [OK]/[X]

## Quick Reference

### PROHIBITED (Never use)
- Emojis: ✅, ❌, ✓, ⚠️, 📊, 🎯, 🎉, and ALL other pictographs
- Smart quotes: " " ' '
- Decorative bullets: •, ◦

### ALLOWED (Use freely)
- All arrows: → ← ↑ ↓ ↔ ↕ ↖ ↗ ↘ ↙ ⇒ ⇐ ↩ ↪ etc.
- Box-drawing: │ ─ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼ etc.

### WHEN IN DOUBT
If it looks like an emoji or pictograph: **DON'T USE IT**
If it's an arrow or box-drawing character: **IT'S ALLOWED**
