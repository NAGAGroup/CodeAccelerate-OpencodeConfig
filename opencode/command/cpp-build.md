---
description: C++ build system help — pixi, CMake, presets configuration and debugging
---

# /cpp-build

Invoke `cpp-build-engineer` for build system configuration, troubleshooting, and scaffolding.

## Usage

```
/cpp-build [description of build issue or request]
/cpp-build scaffold                    # Generate pixi+CMake+nushell project scaffold
/cpp-build preset [name]               # Add or fix a CMake preset
/cpp-build diagnose                    # Diagnose current build failure
```

## What cpp-build-engineer Handles

### Project Scaffolding
- `pixi.toml` with task runner (configure/build/test)
- `CMakePresets.json` with default/release/asan presets
- Nushell scripts (`scripts/configure.nu`, `build.nu`, `test.nu`)
- Conda sysroot (`clangxx_<platform>`) vs flexible (`clangxx`) setup

### Build Failure Diagnosis
Provide any of:
- CMake configure error output
- Compiler error or linker error
- `pixi run build` failure output
- `pixi list` output (environment snapshot)

### Common Issues Handled
- Compiler not found after `pixi install` → check env activation, `which clang++`
- CMake can't find package → `CMAKE_PREFIX_PATH` fix
- Linker errors → check `target_link_libraries`, missing dependencies in `pixi.toml`
- Sanitizer link failures → ensure both compile and link flags include `-fsanitize=...`
- `clangxx_linux-64` vs `clangxx` choice guidance

## Context Loaded

ContextScout discovers and loads context files. If `.opencode/context/cpp-systems/` exists, only local context is used. If it doesn't exist, global `~/.config/opencode/context/cpp-systems/` is the fallback. Use `/context migrate` to bring global domain context into the project permanently.
