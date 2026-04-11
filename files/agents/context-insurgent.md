---
name: context-insurgent
description: "ContextInsurgent — deep project exploration with sequential thinking."
color: "#f59e0b"
mode: subagent
permission:
    "*": deny
    read: allow
    glob: allow
    grep: allow
    grepai_grepai_search: allow
    grepai_grepai_trace_callers: allow
    grepai_grepai_trace_callees: allow
    grepai_grepai_trace_graph: allow
    grepai_grepai_index_status: allow
    qdrant_qdrant-store: allow
    qdrant_qdrant-find: allow
    skill:
        "*": deny
        qdrant-notes: allow
        grepai: allow
        searching-deeper: allow
---
