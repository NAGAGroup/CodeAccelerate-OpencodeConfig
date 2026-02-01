# OpenCode Built-in LSP Tools

**Documentation Source:** https://opencode.ai/docs

This document provides comprehensive information about the built-in Language Server Protocol (LSP) tools available in OpenCode.

---

## Overview

OpenCode provides two types of LSP-related capabilities:

1. **LSP Server Integration** - Automatic support for 30+ built-in LSP servers
2. **LSP Tool (Experimental)** - Direct programmatic access to LSP capabilities

---

## 1. LSP Server Integration

**Documentation:** https://opencode.ai/docs/lsp/

OpenCode integrates with Language Server Protocol (LSP) servers to provide code intelligence and diagnostics to the LLM. The platform includes **automatic support for 30+ built-in LSP servers** covering popular programming languages.

### Complete List of Built-in LSP Servers

| LSP Server | File Extensions | Requirements |
|------------|-----------------|--------------|
| **astro** | .astro | Auto-installs for Astro projects |
| **bash** | .sh, .bash, .zsh, .ksh | Auto-installs bash-language-server |
| **clangd** | .c, .cpp, .cc, .cxx, .c++, .h, .hpp, .hh, .hxx, .h++ | Auto-installs for C/C++ projects |
| **csharp** | .cs | .NET SDK installed |
| **clojure-lsp** | .clj, .cljs, .cljc, .edn | clojure-lsp command available |
| **dart** | .dart | dart command available |
| **deno** | .ts, .tsx, .js, .jsx, .mjs | deno command available (auto-detects deno.json/deno.jsonc) |
| **elixir-ls** | .ex, .exs | elixir command available |
| **eslint** | .ts, .tsx, .js, .jsx, .mjs, .cjs, .mts, .cts, .vue | eslint dependency in project |
| **fsharp** | .fs, .fsi, .fsx, .fsscript | .NET SDK installed |
| **gleam** | .gleam | gleam command available |
| **gopls** | .go | go command available |
| **jdtls** | .java | Java SDK (version 21+) installed |
| **kotlin-ls** | .kt, .kts | Auto-installs for Kotlin projects |
| **lua-ls** | .lua | Auto-installs for Lua projects |
| **nixd** | .nix | nixd command available |
| **ocaml-lsp** | .ml, .mli | ocamllsp command available |
| **oxlint** | .ts, .tsx, .js, .jsx, .mjs, .cjs, .mts, .cts, .vue, .astro, .svelte | oxlint dependency in project |
| **php intelephense** | .php | Auto-installs for PHP projects |
| **prisma** | .prisma | prisma command available |
| **pyright** | .py, .pyi | pyright dependency installed |
| **ruby-lsp (rubocop)** | .rb, .rake, .gemspec, .ru | ruby and gem commands available |
| **rust** | .rs | rust-analyzer command available |
| **sourcekit-lsp** | .swift, .objc, .objcpp | swift installed (xcode on macOS) |
| **svelte** | .svelte | Auto-installs for Svelte projects |
| **terraform** | .tf, .tfvars | Auto-installs from GitHub releases |
| **tinymist** | .typ, .typc | Auto-installs from GitHub releases |
| **typescript** | .ts, .tsx, .js, .jsx, .mjs, .cjs, .mts, .cts | typescript dependency in project |
| **vue** | .vue | Auto-installs for Vue projects |
| **yaml-ls** | .yaml, .yml | Auto-installs Red Hat yaml-language-server |
| **zls** | .zig, .zon | zig command available |

### How LSP Integration Works

When OpenCode opens a file, it:
1. Checks the file extension against all enabled LSP servers
2. Starts the appropriate LSP server if not already running
3. Uses diagnostics to provide feedback to the LLM

LSP servers are **automatically enabled** when file extensions are detected and requirements are met.

---

## 2. LSP Tool (Experimental)

**Documentation:** https://opencode.ai/docs/tools/#lsp-experimental

OpenCode provides an **experimental `lsp` tool** that allows the LLM to directly interact with LSP servers for advanced code intelligence features.

### Tool Details

- **Tool Name:** `lsp`
- **Status:** Experimental
- **Availability:** Only available when `OPENCODE_EXPERIMENTAL_LSP_TOOL=true` or `OPENCODE_EXPERIMENTAL=true` is set
- **Requirements:** LSP servers must be configured (see https://opencode.ai/docs/lsp/)

### Purpose

Provides code intelligence features by allowing the LLM to query LSP servers programmatically during conversations.

### Supported Operations

| Operation | Description |
|-----------|-------------|
| `goToDefinition` | Navigate to symbol definitions |
| `findReferences` | Find all references to a symbol |
| `hover` | Get hover information for code |
| `documentSymbol` | Get symbols in a document |
| `workspaceSymbol` | Search for symbols across workspace |
| `goToImplementation` | Navigate to implementations |
| `prepareCallHierarchy` | Prepare call hierarchy data |
| `incomingCalls` | Get incoming calls to a function |
| `outgoingCalls` | Get outgoing calls from a function |

### Configuration Example

To enable the experimental LSP tool, configure permissions in `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "lsp": "allow"
  }
}
```

---

## Configuration Options for LSP Servers

**Documentation:** https://opencode.ai/docs/config/

OpenCode allows extensive customization of LSP servers through the `opencode.json` config file.

### Available Properties

| Property | Type | Description |
|----------|------|-------------|
| `disabled` | boolean | Set to `true` to disable the LSP server |
| `command` | string[] | The command to start the LSP server |
| `extensions` | string[] | File extensions this LSP server should handle |
| `env` | object | Environment variables to set when starting server |
| `initialization` | object | Initialization options to send to the LSP server |

### Configuration Examples

#### Setting Environment Variables

```json
{
  "$schema": "https://opencode.ai/config.json",
  "lsp": {
    "rust": {
      "env": {
        "RUST_LOG": "debug"
      }
    }
  }
}
```

#### Initialization Options

```json
{
  "$schema": "https://opencode.ai/config.json",
  "lsp": {
    "typescript": {
      "initialization": {
        "preferences": {
          "importModuleSpecifierPreference": "relative"
        }
      }
    }
  }
}
```

#### Disabling All LSP Servers

```json
{
  "$schema": "https://opencode.ai/config.json",
  "lsp": false
}
```

#### Disabling a Specific LSP Server

```json
{
  "$schema": "https://opencode.ai/config.json",
  "lsp": {
    "typescript": {
      "disabled": true
    }
  }
}
```

#### Adding Custom LSP Servers

```json
{
  "$schema": "https://opencode.ai/config.json",
  "lsp": {
    "custom-lsp": {
      "command": ["custom-lsp-server", "--stdio"],
      "extensions": [".custom"]
    }
  }
}
```

---

## Additional Notes

### Automatic Downloads

You can disable automatic LSP server downloads by setting the `OPENCODE_DISABLE_LSP_DOWNLOAD` environment variable to `true`.

### PHP Intelephense Premium

PHP Intelephense offers premium features through a license key. Place the license key in:
- **macOS/Linux:** `$HOME/intelephense/licence.txt`
- **Windows:** `%USERPROFILE%/intelephense/licence.txt`

---

## Summary

OpenCode provides two layers of LSP integration:

1. **30+ built-in LSP servers** that automatically provide diagnostics and code intelligence
2. An **experimental `lsp` tool** that gives the LLM programmatic access to 9 LSP operations (definitions, references, hover, symbols, implementations, and call hierarchy)

All LSP functionality can be customized through the `opencode.json` configuration file with support for environment variables, initialization options, disabling servers, and adding custom LSP servers.

---

## Related Documentation

- LSP Servers: https://opencode.ai/docs/lsp/
- LSP Tool: https://opencode.ai/docs/tools/#lsp-experimental
- Configuration: https://opencode.ai/docs/config/
- Main Documentation: https://opencode.ai/docs
