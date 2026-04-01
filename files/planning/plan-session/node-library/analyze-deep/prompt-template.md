# Deep Analysis

Dispatch @ContextInsurgent to answer a specific analysis question across multiple files.

**Todo:** `["task"]`

**Zone 1 — Fixed execution spec**:

> (1) Dispatch @ContextInsurgent with the analysis question and file list below
> (2) ContextInsurgent reads only the files listed and answers the specific question
> (3) Scope: Do not read `.opencode/` session directories — they contain stale artifacts
> (4) Return findings as a structured report with file-by-file evidence — no thematic summaries, no generic "Architecture Overview" sections
> (5) Output: file paths, line numbers, exact code strings — evidence only

**Zone 2 — Planning agent fills**:

{{ANALYSIS_QUESTION}}
One specific question that requires evidence (file paths, line numbers, code strings) to answer.
✓ Good: "Which kernel dispatch sites pass raw host pointers instead of USM device allocations?"
✗ Bad: "Analyze the kernel system"

{{FILE_LIST}}
Exact repo-relative file paths, comma-separated.
✓ Good: `src/kernels/matmul.cpp, src/pipeline/executor.cpp, include/kernels/common.hpp`
✗ Bad: "all kernel files" or "the compute module"

{{PRIOR_FINDINGS}}
Scout findings or prior node output that ContextInsurgent should synthesize (optional, or state "none").
✓ Good: "From scout-1: dispatch calls found in src/pipeline/executor.cpp:87 and src/pipeline/stages.cpp:134"
✗ Bad: "some previous results"

**Zone 3 — Fixed constraints**:

Dispatch blockquote when calling the task tool:

> When you call task to dispatch @ContextInsurgent, your dispatch prompt must include:
> (1) The exact analysis question: restate {{ANALYSIS_QUESTION}} verbatim
> (2) The file list: {{FILE_LIST}} — do not substitute theme descriptions
> (3) Prior synthesis: if any, {{PRIOR_FINDINGS}}
> (4) Output format: "Return file paths, line numbers, and exact code. Do not produce narrative summaries or generic sections. Answer the question directly with evidence."
> (5) Termination: "When complete, briefly summarize findings in structured format (list of file paths with line numbers and code evidence). Do not request follow-up questions."

After ContextInsurgent returns, call `next_step()` immediately.
