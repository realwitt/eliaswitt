# AI Platform Self-Hosting Analysis

## Hardware Specifications

| Component | Spec | AI Relevance |
|-----------|------|--------------|
| **GPU** | NVIDIA 2080 Ti | 11GB VRAM, ~13.4 TFLOPS FP32, Tensor cores |
| **RAM** | 64GB DDR4 | Enables CPU inference of larger models |
| **CPU** | AMD 58-core | Excellent for parallel/batched CPU inference |

---

## Model Options by VRAM/RAM Budget

### Tier 1: GPU-Accelerated (11GB VRAM limit)

| Model | Quantization | VRAM Usage | Speed | Quality |
|-------|--------------|------------|-------|---------|
| **Llama 3.1 8B** | Q4_K_M | ~5GB | 40-60 tok/s | Good |
| **Llama 3.1 8B** | Q8_0 | ~9GB | 30-45 tok/s | Better |
| **Mistral 7B v0.3** | Q4_K_M | ~4.5GB | 50-70 tok/s | Good |
| **Qwen2.5 7B** | Q4_K_M | ~4.5GB | 50-70 tok/s | Good |
| **Phi-3 Medium 14B** | Q4_K_M | ~8.5GB | 25-35 tok/s | Very Good |
| **Llama 3.1 8B Instruct** | Q5_K_M | ~6GB | 35-50 tok/s | Recommended |

**Recommendation for GPU:** Llama 3.1 8B Instruct (Q5_K_M) — best balance of speed and quality for your VRAM.

### Tier 2: CPU Inference (64GB RAM)

| Model | Quantization | RAM Usage | Speed | Quality |
|-------|--------------|-----------|-------|---------|
| **Llama 3.1 70B** | Q4_K_M | ~40GB | 3-8 tok/s | Excellent |
| **Qwen2.5 32B** | Q4_K_M | ~20GB | 8-15 tok/s | Very Good |
| **Mixtral 8x7B** | Q4_K_M | ~26GB | 6-12 tok/s | Very Good |
| **Llama 3.1 70B** | Q3_K_M | ~33GB | 4-10 tok/s | Good |
| **DeepSeek-V2-Lite** | Q4_K_M | ~18GB | 10-18 tok/s | Good |

**Your 58-core CPU is actually excellent for CPU inference** — llama.cpp and similar frameworks parallelize well across cores.

### Tier 3: Hybrid GPU+CPU Offloading

Split model layers between GPU and CPU:

```
Example: Llama 3.1 70B Q4_K_M
- Load 15-20 layers on GPU (using ~10GB VRAM)
- Remaining 60+ layers on CPU/RAM
- Result: 8-15 tok/s (2-3x faster than pure CPU)
```

This is the **sweet spot for your hardware**.

---

## Recommended Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Franklin AI Platform                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐│
│  │   Fast Model    │    │  Quality Model  │    │  Embeddings  ││
│  │   (GPU-bound)   │    │ (Hybrid/CPU)    │    │    Model     ││
│  │                 │    │                 │    │              ││
│  │  Llama 3.1 8B   │    │ Qwen2.5 32B or  │    │  BGE-M3 or   ││
│  │  Q5_K_M         │    │ Llama 3.1 70B   │    │  Nomic-Embed ││
│  │                 │    │ Q4_K_M          │    │              ││
│  │  Use for:       │    │  Use for:       │    │  Use for:    ││
│  │  • Quick chat   │    │  • Lead analysis│    │  • Semantic  ││
│  │  • Simple Q&A   │    │  • Complex est. │    │    search    ││
│  │  • Formatting   │    │  • Market intel │    │  • Similar   ││
│  │                 │    │  • Reasoning    │    │    items     ││
│  └────────┬────────┘    └────────┬────────┘    └──────┬───────┘│
│           │                      │                     │        │
│           └──────────────────────┼─────────────────────┘        │
│                                  │                              │
│                    ┌─────────────▼─────────────┐                │
│                    │      Ollama / vLLM        │                │
│                    │    (Model Server)         │                │
│                    └─────────────┬─────────────┘                │
│                                  │                              │
│                    ┌─────────────▼─────────────┐                │
│                    │     Franklin Backend      │                │
│                    │   (API Gateway + RAG)     │                │
│                    └─────────────┬─────────────┘                │
│                                  │                              │
│                    ┌─────────────▼─────────────┐                │
│                    │   Franklin Frontend       │                │
│                    │   (Browser App)           │                │
│                    └───────────────────────────┘                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Feature-to-Model Mapping

| Feature | Model Tier | Why |
|---------|------------|-----|
| **Quick inventory questions** | Fast (8B GPU) | Simple lookups, speed matters |
| "Who took the last W8 beam?" | Fast | Direct DB query generation |
| "What's in stock?" | Fast | Simple aggregation |
| **Lead analysis** | Quality (32B+) | Needs reasoning about business |
| **Job estimation** | Quality | Complex multi-step calculation |
| **Market intelligence** | Quality | Nuanced analysis of news |
| **Invoice explanations** | Fast | Template-based writing |
| **Forecasting** | Quality | Statistical reasoning |
| **Semantic search** | Embeddings | Vector similarity |

---

## Software Stack Recommendation

### Option A: Ollama (Simplest)

```bash
# Install
curl -fsSL https://ollama.com/install.sh | sh

# Pull models
ollama pull llama3.1:8b-instruct-q5_K_M    # Fast model (~6GB)
ollama pull qwen2.5:32b-instruct-q4_K_M    # Quality model (~20GB)
ollama pull nomic-embed-text               # Embeddings (~300MB)

# Run with GPU layers
OLLAMA_NUM_GPU=99 ollama serve
```

**Pros:** Dead simple, auto-manages models, good defaults
**Cons:** Less control over layer offloading

### Option B: llama.cpp + llama-cpp-python (More Control)

```bash
# Build with CUDA
CMAKE_ARGS="-DLLAMA_CUDA=on" pip install llama-cpp-python

# Python usage with hybrid offloading
from llama_cpp import Llama

# Fast model - fully on GPU
fast_model = Llama(
    model_path="llama-3.1-8b-instruct.Q5_K_M.gguf",
    n_gpu_layers=-1,  # All layers on GPU
    n_ctx=8192,
)

# Quality model - hybrid
quality_model = Llama(
    model_path="qwen2.5-32b-instruct.Q4_K_M.gguf",
    n_gpu_layers=20,  # 20 layers on GPU, rest on CPU
    n_ctx=16384,
    n_threads=48,     # Use most of your 58 cores
)
```

**Pros:** Fine-grained control, better hybrid performance
**Cons:** More setup

### Option C: vLLM (Best for Throughput)

```bash
pip install vllm

# Serve model
python -m vllm.entrypoints.openai.api_server \
    --model meta-llama/Llama-3.1-8B-Instruct \
    --quantization awq \
    --gpu-memory-utilization 0.9
```

**Pros:** Best throughput, OpenAI-compatible API, batching
**Cons:** More complex, needs specific quantizations

---

## Performance Estimates for Your Hardware

### Scenario 1: Single User (You + Franklin)

| Task | Model | Expected Speed | Acceptable? |
|------|-------|----------------|-------------|
| Quick question | 8B GPU | 40-50 tok/s | Excellent |
| Lead analysis | 32B Hybrid | 12-18 tok/s | Good |
| Complex estimate | 70B Hybrid | 6-10 tok/s | Acceptable |

**Verdict:** Great for single-user. Responses in 2-15 seconds depending on complexity.

### Scenario 2: Small Team (3-5 concurrent users)

| Configuration | Throughput | Latency |
|---------------|------------|---------|
| 8B GPU only | 3-5 req/s | <2s |
| 32B Hybrid | 0.5-1 req/s | 5-15s |
| Mixed routing | 2-3 req/s | 2-8s avg |

**Verdict:** Works for small team with smart routing (fast model for simple queries).

### Scenario 3: Production (10+ users)

**Not recommended for your hardware.** You'd need:
- Multiple GPUs, or
- Cloud burst for peak load, or
- Queue system with acceptable wait times

---

## Hybrid Cloud Strategy (Best of Both Worlds)

```
┌─────────────────────────────────────────────────────────────┐
│                      Request Router                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Simple queries ──────► Local 8B (GPU)     [FREE]          │
│   (90% of traffic)       ~50 tok/s                          │
│                                                              │
│   Complex analysis ────► Local 32B (Hybrid) [FREE]          │
│   (8% of traffic)        ~15 tok/s                          │
│                                                              │
│   Peak overflow ───────► Claude API         [$0.01-0.03/req]│
│   (2% of traffic)        Instant                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘

Monthly cost estimate:
- 1000 queries/month, 2% to cloud = 20 API calls
- ~$0.50-$1.00/month in API costs
- 98% runs FREE on your hardware
```

---

## Implementation Plan for Phase 4 (AI Suite)

### Step 1: Local AI Server Setup

```typescript
// src/franklin/ai/config.ts
export const AI_CONFIG = {
  // Local Ollama server
  localEndpoint: 'http://localhost:11434',

  // Model routing
  models: {
    fast: 'llama3.1:8b-instruct-q5_K_M',
    quality: 'qwen2.5:32b-instruct-q4_K_M',
    embedding: 'nomic-embed-text',
  },

  // Fallback to cloud if local fails
  cloudFallback: {
    enabled: true,
    provider: 'anthropic', // or 'openai'
    model: 'claude-3-haiku-20240307',
  },

  // Query routing rules
  routing: {
    // Use fast model for these intents
    fast: [
      'inventory_lookup',
      'simple_question',
      'format_text',
      'invoice_template',
    ],
    // Use quality model for these
    quality: [
      'lead_analysis',
      'job_estimation',
      'market_analysis',
      'complex_reasoning',
    ],
  },
};
```

### Step 2: Intent Classification (Route to Right Model)

```typescript
// src/franklin/ai/router.ts
const INTENT_PATTERNS = {
  inventory_lookup: [
    /who (took|used|removed)/i,
    /how (much|many) .* (in stock|do we have)/i,
    /where is/i,
    /find .* (item|inventory|stock)/i,
  ],
  lead_analysis: [
    /analyze .* lead/i,
    /what .* (worth|potential|estimate)/i,
    /should (we|I) (take|quote)/i,
  ],
  job_estimation: [
    /estimate .* (job|project|cost)/i,
    /how much would .* cost/i,
    /quote for/i,
    /materials? (for|needed)/i,
  ],
  market_analysis: [
    /steel (price|market|trend)/i,
    /tariff/i,
    /supply chain/i,
    /forecast/i,
  ],
};

export function classifyIntent(query: string): 'fast' | 'quality' {
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    if (patterns.some(p => p.test(query))) {
      return AI_CONFIG.routing.fast.includes(intent) ? 'fast' : 'quality';
    }
  }
  return 'fast'; // Default to fast
}
```

### Step 3: RAG Pipeline for Business Context

```typescript
// src/franklin/ai/rag.ts
export async function buildContext(query: string, db: Database) {
  const context: string[] = [];

  // 1. Get relevant inventory items
  if (query.match(/inventory|stock|item|material/i)) {
    const items = await db.query(`
      SELECT name, sku, quantity, location
      FROM inventory_items
      WHERE quantity > 0
      LIMIT 50
    `);
    context.push(`Current Inventory:\n${formatTable(items)}`);
  }

  // 2. Get relevant transactions
  if (query.match(/who|when|took|used|history/i)) {
    const transactions = await db.query(`
      SELECT t.*, u.name as user_name, i.name as item_name
      FROM inventory_transactions t
      JOIN users u ON t.user_id = u.id
      JOIN inventory_items i ON t.item_id = i.id
      ORDER BY t.created_at DESC
      LIMIT 20
    `);
    context.push(`Recent Transactions:\n${formatTable(transactions)}`);
  }

  // 3. Get job information
  if (query.match(/job|project|customer/i)) {
    const jobs = await db.query(`
      SELECT j.*, c.name as customer_name
      FROM jobs j
      LEFT JOIN customers c ON j.customer_id = c.id
      WHERE j.status IN ('active', 'quoted')
    `);
    context.push(`Active Jobs:\n${formatTable(jobs)}`);
  }

  return context.join('\n\n---\n\n');
}
```

### Step 4: Query Execution

```typescript
// src/franklin/ai/chat.ts
export async function chat(
  query: string,
  db: Database,
  options?: { forceModel?: 'fast' | 'quality' }
) {
  // 1. Classify intent
  const modelTier = options?.forceModel ?? classifyIntent(query);
  const model = AI_CONFIG.models[modelTier];

  // 2. Build context from database
  const context = await buildContext(query, db);

  // 3. Construct prompt
  const systemPrompt = `You are an AI assistant for Franklin Machine Co., a steel fabrication shop.
You have access to their inventory, jobs, and business data.
Answer questions directly and concisely. Use the data provided.
If you need to reference specific items, include SKU numbers.
Format numbers nicely (currency, quantities).

CURRENT DATA:
${context}`;

  // 4. Call local model
  try {
    const response = await fetch(`${AI_CONFIG.localEndpoint}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query },
        ],
        stream: false,
      }),
    });

    const data = await response.json();
    return data.message.content;

  } catch (error) {
    // Fallback to cloud if local fails
    if (AI_CONFIG.cloudFallback.enabled) {
      return await cloudFallback(systemPrompt, query);
    }
    throw error;
  }
}
```

---

## Efficiency Analysis

### Cost Comparison: Self-Hosted vs Cloud

| Metric | Self-Hosted (Your HW) | Cloud (Claude API) |
|--------|----------------------|-------------------|
| **Upfront cost** | $0 (already own) | $0 |
| **Monthly (1K queries)** | ~$10-15 electricity | ~$30-100 |
| **Monthly (10K queries)** | ~$15-20 electricity | ~$300-1000 |
| **Latency** | 2-15s | 1-3s |
| **Privacy** | 100% local | Data leaves network |
| **Availability** | Depends on your uptime | 99.9% SLA |

### Power Consumption Estimate

```
2080 Ti under load: ~250W
AMD 58-core under load: ~280W (TDP varies by model)
System overhead: ~50W

Total during inference: ~580W
Idle: ~150W

Monthly estimate (8 hrs/day active):
- Active: 580W × 8h × 30 days = 139 kWh
- Idle: 150W × 16h × 30 days = 72 kWh
- Total: ~211 kWh
- Cost: ~$25-35/month (at $0.12-0.15/kWh)
```

### Efficiency Verdict

| Use Case | Self-Host Efficiency | Recommendation |
|----------|---------------------|----------------|
| **Low volume (<500 queries/mo)** | Overkill | Cloud cheaper |
| **Medium (500-5000/mo)** | Sweet spot | Self-host |
| **High volume (5000+/mo)** | Excellent ROI | Self-host |
| **Privacy-critical** | Essential | Self-host |
| **24/7 availability needed** | Challenging | Hybrid |

---

## Recommended Setup for Franklin

### Minimum Viable AI (Start Here)

```bash
# 1. Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 2. Pull just the fast model to start
ollama pull llama3.1:8b-instruct-q5_K_M

# 3. Test it
ollama run llama3.1:8b-instruct-q5_K_M "What's 2+2?"

# 4. Later, add quality model
ollama pull qwen2.5:32b-instruct-q4_K_M
```

### Production Setup

```yaml
# docker-compose.yml for Franklin AI
version: '3.8'
services:
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    environment:
      - OLLAMA_NUM_PARALLEL=4
      - OLLAMA_MAX_LOADED_MODELS=2

volumes:
  ollama_data:
```

---

## Summary

**Your hardware is well-suited for self-hosting the AI platform:**

| Component | Assessment |
|-----------|------------|
| 2080 Ti (11GB) | Good for 7-14B models at excellent speed |
| 64GB DDR4 | Enables 32B models comfortably, 70B tight |
| 58-core CPU | Excellent for CPU inference, parallelizes well |

**Recommended configuration:**
1. **Fast model (GPU):** Llama 3.1 8B Q5_K_M — handles 90% of queries
2. **Quality model (Hybrid):** Qwen2.5 32B Q4_K_M — complex analysis
3. **Smart routing:** Classify intent, route to appropriate model
4. **Cloud fallback:** 2% of queries to Claude API for edge cases

**Expected performance:**
- Simple queries: 1-3 seconds
- Complex analysis: 5-15 seconds
- Monthly cost: ~$25-35 electricity vs $100+ cloud

**Start simple:** Install Ollama, pull the 8B model, integrate with Franklin. Add the 32B model later when you need more sophisticated analysis.
