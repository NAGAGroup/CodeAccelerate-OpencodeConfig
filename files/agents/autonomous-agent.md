---
name: autonomous-agent
description: "AutonomousAgent — fully autonomous execution. All tools. User-gated."
color: "#e11d48"
mode: subagent
permission:
    "*": allow
    bash:
        "*": allow
        "rm -rf *": deny
        "rm -r *": deny
        "git push --force*": deny
        "git reset --hard*": deny
    skill:
        "*": allow
---
