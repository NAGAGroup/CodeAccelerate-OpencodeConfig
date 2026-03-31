# Ollama Model Recommendations (2026, RTX 4090 24GB VRAM)

## Executive Summary

Primary recommendation: **Qwen 2.5 14B (Q4_K_M)**
- Tool-calling F1: 0.971 (High confidence — measured on BFCL/ToolHalla circa 2024–2025; see BFCL note below)
- VRAM: 9–10 GB at Q4_K_M; 14+ GB headroom for KV cache on RTX 4090
- Context: 32K native; recommend `num_ctx 16384` in Modelfile for safe VRAM margin

## Ranked Models

**Tier 1 — Primary Candidates (High/Medium confidence, production-ready):**

| Rank | Model | Family | Quant | VRAM (GB) | Tool F1 / Evidence | Confidence | Context (K) | Install |
|------|-------|--------|-------|-----------|---------------------|------------|-------------|---------|
| 1 | Qwen 2.5 14B | Qwen | Q4_K_M | 9–10 | 0.971† | High | 32K | `ollama pull qwen2.5:14b` |
| 2 | Mistral Small 3.2 24B | Mistral | Q4_K_M | ~15.9 | N/A‡ | Medium | 128K | `ollama pull mistral-small` |
| 3 | Command-R 35B | Cohere | Q4_K_M | ~19 | Tool-use design, 1.1M pulls | High | 128K | `ollama pull command-r` |
| 4 | GLM-4.7-Flash 30B (MoE) | Zhipu | Q4_K_M | ~19 | Tools tag; 79.5 τ²-Bench§ | High | 198K | `ollama pull glm-4.7-flash` |
| 5 | Qwen3 32B | Qwen | Q4_K_M | ~20.7 | N/A | Low | 40K | `ollama pull qwen3:32b` |
| 6 | Hermes-3 8B | NousResearch | Q4_K_M | ~4.7 | Function-calling design¶ | High | 128K | `ollama pull hermes3:8b` |
| 7 | Llama 3.1 8B | Meta | Q4_K_M | 5–6 | 89%§ | Medium-High | 128K | `ollama pull llama3.1:8b` |

**Tier 2 — Lightweight / Fallback (smaller VRAM footprint):**

| Rank | Model | Family | Quant | VRAM (GB) | Tool Evidence | Confidence | Context (K) | Install |
|------|-------|--------|-------|-----------|---------------|------------|-------------|---------|
| 8 | Qwen3 30B (MoE) | Qwen | Q4_K_M | ~19–21 | N/A | Low | 40K | `ollama pull qwen3:30b` |
| 9 | Nemotron-Mini 4B | NVIDIA | Q4_K_M | ~2.7 | NVIDIA function-calling design | High | 4K | `ollama pull nemotron-mini` |
| 10 | Phi-4-mini 3.8B | Microsoft | Q4_K_M | ~2.5 | New function-calling support | High | 128K | `ollama pull phi4-mini` |

**Footnotes:**
- † F1 0.971 measured on BFCL/ToolHalla circa 2024–2025. BFCL V4 (Dec 2025) reweighted agentic tasks to 40% of total score (up from 0% in V3); direct score comparison across BFCL versions is invalid.
- ‡ Mistral Small 3.2 24B is purpose-built for function calling; qualitatively ranked "best-in-class" by multiple 2026 sources, but no BFCL V4 numeric score has been published for this model.
- § GLM-4.7-Flash: 79.5 score on τ²-Bench (agentic reasoning benchmark, Feb 2026). Separate from tool-calling F1.
- § Llama 3.1 8B: 89% measured on pre-V4 BFCL or ToolHalla; BFCL V4 equivalent score not available.
- ¶ Hermes-3 8B: NousResearch officially describes it as having "more powerful and reliable function calling and structured output capabilities" vs. base Llama 3.1.

## Installation

```bash
# === Tier 1 — Primary Candidates ===

# Rank 1 — Primary recommendation
ollama pull qwen2.5:14b

# Rank 2 — Secondary (two options; bartowski imatrix preferred for precision tasks)
ollama pull mistral-small
ollama pull hf.co/bartowski/Mistral-Small-3.2-24B-Instruct-2506-GGUF:Q4_K_M

# Rank 3 — Cohere Command-R (tool-use veteran)
ollama pull command-r

# Rank 4 — GLM-4.7-Flash (MoE, 198K context)
ollama pull glm-4.7-flash

# Rank 5 — Qwen3 32B (tight KV headroom — see caveats)
ollama pull qwen3:32b

# Rank 6 — Hermes-3 8B (function-calling fine-tune, small footprint)
ollama pull hermes3:8b

# Rank 7 — Llama 3.1 8B (proven fallback)
ollama pull llama3.1:8b

# === Tier 2 — Lightweight / Fallback ===
ollama pull qwen3:30b          # MoE, Low confidence on tool-calling
ollama pull nemotron-mini      # NVIDIA-optimized, function-calling focus
ollama pull phi4-mini          # Ultra-lightweight, new function-calling support

# === KV cache optimization (applies to all models) ===
export OLLAMA_KV_CACHE_TYPE=q8_0
export OLLAMA_FLASH_ATTENTION=1
ollama serve
```

## HuggingFace GGUF Models (Ollama Import)

HuggingFace hosts thousands of GGUF quantizations. Ollama 0.14+ supports direct HF pull via `hf.co/` syntax. Notable tool-calling fine-tunes:

### Notable HF GGUF Candidates

| Model | Params | Quant | VRAM (GB) | Tool Evidence | Confidence | Install |
|-------|--------|-------|-----------|---------------|------------|---------|
| Devstral-Small-2-24B | 24B | Q4_K_M | ~19–20 | Explicit `[TOOL_CALLS]` template; community "go-to" Feb 2026 | Medium-High | `ollama pull hf.co/ggml-org/Devstral-Small-2-24B-Instruct-2512-GGUF:Q4_K_M` |
| Ministral-3-14B | 14B | Q4_K_M | ~8.2 | Native `[TOOL_CALLS]`/`[TOOL_RESULTS]` template | Medium-High | `ollama pull hf.co/bartowski/mistralai_Ministral-3-14B-Instruct-2512-GGUF:Q4_K_M` |
| Mistral Small 3.2 24B (bartowski) | 24B | Q4_K_M | ~15.9 | Same base as Rank 2; imatrix calibration | Medium | `ollama pull hf.co/bartowski/Mistral-Small-3.2-24B-Instruct-2506-GGUF:Q4_K_M` |
| Kevin-32B (cognition-ai) | 32B | Q4_K_M | ~20.7 | HF tag: `tool-calling` — not externally benchmarked | Low | `ollama pull hf.co/bartowski/cognition-ai_Kevin-32B-GGUF:Q4_K_M` |

**Why bartowski/ggml-org?** bartowski uses imatrix calibration for K-quant formats, typically yielding 1–3% quality improvement over standard quantization at the same bit depth. ggml-org provides official GGUF conversions for select models.

**Modelfile for tool-calling GGUF — always use explicit TEMPLATE block** (auto-detect may disable tool support on Ollama ≤0.17.5):
```
FROM ./model.gguf

TEMPLATE """<|im_start|>system
{{ .System }}<|im_end|>
<|im_start|>user
{{ .Prompt }}<|im_end|>
<|im_start|>assistant
"""

PARAMETER temperature 0.7
PARAMETER num_ctx 8192
PARAMETER stop <|im_start|>
PARAMETER stop <|im_end|>

SYSTEM "You are a helpful assistant."
```

**Import notes:**
- `FROM` path: no quotes (v0.1.34+ fix)
- HuggingFace rate limiting: set `HF_TOKEN` env var for authenticated pulls
- Template format: Go templates only (not Jinja); converter at https://huggingface.co/spaces/ngxson/debug_ollama_manifest
- Tested with Ollama 0.19.0 (March 2026)

## KV Cache Configuration

`OLLAMA_KV_CACHE_TYPE=q8_0` reduces context VRAM by ~50% with perplexity impact <0.05.
`OLLAMA_FLASH_ATTENTION=1` enables flash attention for additional efficiency.

For Qwen 2.5 14B at Q4_K_M (base 9.5 GB):
- 16K context: ~8.5 GB total (15.5 GB free)
- 32K context: ~12.5 GB total (11.5 GB free) — tight but safe

For Command-R 35B and GLM-4.7-Flash (both ~19 GB model base) at Q4_K_M:
- These models leave ~5 GB for KV cache — sufficient for 8K–16K context windows
- With `OLLAMA_KV_CACHE_TYPE=q8_0`: KV memory reduced ~50%, enabling 32K+ context without overflow
- Do not run these at full native context without KV quantization

For Qwen3 32B at Q4_K_M (~20.7 GB base):
- 8K context with q8_0 KV cache: ~21.5 GB total — marginal, test before production
- 16K context with q8_0 KV cache: ~22.5 GB total — do not attempt on 24GB card

## Important Caveats

- **Do NOT use 70B+ models on RTX 4090** for agentic work — zero VRAM for KV cache; context collapses to <2K tokens
- **Functionary (meetkai):** Current Functionary-v3.2 is 71B — no smaller variants exist in 2026. Functionary is the canonical function-calling fine-tune but does not fit a single RTX 4090 at any practical quantization.
- **Qwen3 32B / Qwen3 30B:** No published tool-calling F1 benchmark (Low confidence). Validate in staging before production.
- **Mistral Small 3.2 24B:** F1 not published numerically; qualitative endorsement is consistent but unquantified. bartowski HF GGUF uses imatrix calibration for marginally better quality.
- **Command-R 35B:** ~19 GB model + KV cache is tight. Use `OLLAMA_KV_CACHE_TYPE=q8_0` for context lengths above 16K.
- **GLM-4.7-Flash:** Requires Ollama 0.14.3+. 79.5 τ²-Bench score measures agentic reasoning, not tool-calling F1 specifically.
- **Devstral-Small-2-24B:** Community-endorsed as of Feb 2026 (r/LocalLLaMA). No formal benchmark. Chat template with explicit `[TOOL_CALLS]` support is a strong signal.
- **Kevin-32B:** Tool-calling confidence is Low — HF tag only, no external benchmark. Test before production.
- **Nemotron-Mini 4B:** 4K context window limits usefulness in long agentic chains.
- **BFCL V4 scores are full-precision only** — GGUF/int4 quantization may reduce accuracy by 2–5%.
- **ToolHalla** (previously cited): HF Space returned HTTP 401 as of March 2026 — offline or restricted. Not cite-able.
- **BFCL V4 methodology** (Dec 2025, Patil et al. ICML 2025, PMLR 267:48371–48392): Agentic tasks now 40% of score (up from 0% in V3). Scores across BFCL versions are not directly comparable.
- Multi-turn agentic chains see higher error rates than single-tool benchmarks — validate your specific tool set before production.

## RTX 4090 VRAM Formula

```
VRAM (GB) = (Parameters × Bits ÷ 8) × 1.2 + 1.5
```

- Qwen 2.5 14B Q4_K_M: (14 × 4 ÷ 8) × 1.2 + 1.5 = 9–10 GB
- Mistral Small 3.2 24B Q4_K_M: (24 × 4 ÷ 8) × 1.2 + 1.5 ≈ 15.9 GB
- Command-R 35B Q4_K_M: (35 × 4 ÷ 8) × 1.2 + 1.5 ≈ 22.5 GB (Ollama reports 19 GB — MoE/architecture-specific; use reported figure)
- GLM-4.7-Flash 30B Q4_K_M: (30 × 4 ÷ 8) × 1.2 + 1.5 ≈ 19.5 GB (Ollama reports 19 GB — MoE; use reported figure)
- Qwen3 32B Q4_K_M: (32 × 4 ÷ 8) × 1.2 + 1.5 ≈ 20.7 GB
- Hermes-3 8B Q4_K_M: (8 × 4 ÷ 8) × 1.2 + 1.5 = 6.3 GB
- Llama 3.1 8B Q4_K_M: (8 × 4 ÷ 8) × 1.2 + 1.5 = 6.3 GB
- Nemotron-Mini 4B Q4_K_M: (4 × 4 ÷ 8) × 1.2 + 1.5 ≈ 3.9 GB (Ollama reports 2.7 GB)
- Phi-4-mini 3.8B Q4_K_M: (3.8 × 4 ÷ 8) × 1.2 + 1.5 ≈ 3.8 GB (Ollama reports 2.5 GB)
- Devstral-Small-2-24B Q4_K_M: (24 × 4 ÷ 8) × 1.2 + 1.5 ≈ 15.9 GB
- Ministral-3-14B Q4_K_M: (14 × 4 ÷ 8) × 1.2 + 1.5 ≈ 9.3 GB (Ollama reports 8.2 GB)
- Kevin-32B Q4_K_M: (32 × 4 ÷ 8) × 1.2 + 1.5 ≈ 20.7 GB

**Note:** Formula overestimates for MoE models (only active parameters use VRAM during inference). For MoE models, use the Ollama-reported download size as the VRAM estimate.
