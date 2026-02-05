# AI Platform Self-Hosting Analysis

## Hardware Specifications (Corrected)

| Component | Spec | AI Relevance |
|-----------|------|--------------|
| **GPU** | NVIDIA 2080 Ti | 11GB VRAM, ~13.4 TFLOPS FP32, Tensor cores |
| **RAM** | 64GB DDR4 | Can load large models, but CPU is bottleneck |
| **CPU** | AMD Ryzen 5 (8-core) | Limited parallelization for CPU inference |

---

## The Reality Check

**With 8 cores, the GPU is your only viable inference engine for acceptable speeds.**

CPU inference scales roughly linearly with core count. Here's what that means:

| Model | 58-core Speed | 8-core Speed | Verdict |
|-------|---------------|--------------|---------|
| 70B Q4 | 6-10 tok/s | **0.8-1.4 tok/s** | Unusable (45-75s per response) |
| 32B Q4 | 12-18 tok/s | **1.6-2.5 tok/s** | Painful (25-40s per response) |
| 14B Q4 | 20-30 tok/s | **2.7-4 tok/s** | Marginal (15-25s per response) |

**Bottom line:** Forget CPU-only inference for anything over 8B parameters.

---

## Revised Model Options

### Your Sweet Spot: GPU-Only (11GB VRAM)

| Model | Quantization | VRAM | Speed | Quality | Use Case |
|-------|--------------|------|-------|---------|----------|
| **Llama 3.1 8B** | Q4_K_M | ~5GB | 45-60 tok/s | Good | General queries |
| **Llama 3.1 8B** | Q5_K_M | ~6GB | 40-50 tok/s | Better | **Recommended** |
| **Llama 3.1 8B** | Q8_0 | ~9GB | 30-40 tok/s | Best 8B | Quality priority |
| **Mistral 7B v0.3** | Q5_K_M | ~5GB | 50-65 tok/s | Good | Fast responses |
| **Qwen2.5 7B** | Q5_K_M | ~5GB | 50-65 tok/s | Good | Good at structured |
| **Phi-3 Medium 14B** | Q4_K_M | ~8.5GB | 25-35 tok/s | Very Good | Smarter, slower |

### Hybrid GPU+CPU (Marginal Gains)

With only 8 cores, hybrid offloading helps less than you'd hope:

| Model | Config | Speed | Worth It? |
|-------|--------|-------|-----------|
| **Qwen2.5 14B** | 28 layers GPU, rest CPU | 12-18 tok/s | Maybe |
| **Llama 3.1 70B** | 15 layers GPU, rest CPU | 2-4 tok/s | No |
| **Mixtral 8x7B** | Partial GPU | 4-8 tok/s | Borderline |

**Verdict:** Stick to models that fit entirely on GPU unless you can tolerate 10-20+ second responses.

---

## Revised Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Franklin AI Platform                          │
│                    (8-core optimized)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────┐    ┌──────────────────────────┐│
│  │      Primary Model          │    │     Cloud Fallback       ││
│  │      (GPU-bound)            │    │    (Complex queries)     ││
│  │                             │    │                          ││
│  │   Llama 3.1 8B Q5_K_M       │    │   Claude 3.5 Haiku or    ││
│  │   or Phi-3 Medium 14B       │    │   GPT-4o-mini            ││
│  │                             │    │                          ││
│  │   Handles:                  │    │   Handles:               ││
│  │   • Inventory lookups       │    │   • Lead analysis        ││
│  │   • Simple Q&A              │    │   • Complex estimation   ││
│  │   • Transaction queries     │    │   • Market intelligence  ││
│  │   • Invoice formatting      │    │   • Multi-step reasoning ││
│  │   • Basic forecasting       │    │                          ││
│  │                             │    │                          ││
│  │   ~85% of queries           │    │   ~15% of queries        ││
│  │   FREE                      │    │   ~$0.01-0.05/query      ││
│  └──────────────┬──────────────┘    └────────────┬─────────────┘│
│                 │                                 │              │
│                 └─────────────┬──────────────────┘              │
│                               │                                  │
│                 ┌─────────────▼─────────────┐                   │
│                 │     Smart Router          │                   │
│                 │  (Classify → Route)       │                   │
│                 └─────────────┬─────────────┘                   │
│                               │                                  │
│                 ┌─────────────▼─────────────┐                   │
│                 │   Franklin Application    │                   │
│                 └───────────────────────────┘                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## What Can an 8B Model Actually Do?

**Good at (handle locally):**
- "Who took the last W8 beam?" → Direct DB query, format answer
- "What's in stock for channel steel?" → Filter and list
- "How many items are below minimum?" → Aggregation query
- "Write an invoice note about price increase" → Template generation
- "Summarize today's transactions" → Data formatting
- "What did we use on the Henderson job?" → Lookup and format

**Struggles with (send to cloud):**
- "Analyze this lead and estimate if the job is worth taking" → Multi-factor reasoning
- "Based on market trends, should we stock up on plate steel?" → Complex analysis
- "What would this job cost if steel goes up 15% and we use supplier B?" → Multi-variable calculation
- "Research this company and estimate their project scope" → Web search + reasoning

**The 8B model is actually fine for 80-90% of Franklin's daily queries** — most are lookups, not analysis.

---

## Revised Feature Mapping

| Feature | Where to Run | Why |
|---------|--------------|-----|
| **Inventory questions** | Local 8B | Simple lookups |
| **Transaction history** | Local 8B | Data formatting |
| **Invoice text generation** | Local 8B | Template-based |
| **Stock alerts summary** | Local 8B | Aggregation |
| **Basic "what if"** | Local 8B | Simple math |
| **Lead analysis** | **Cloud API** | Needs reasoning |
| **Job estimation (complex)** | **Cloud API** | Multi-variable |
| **Market intelligence** | **Cloud API** | Analysis + web |
| **Forecasting** | **Cloud API** | Statistical reasoning |

---

## Cost Analysis (Revised)

### Scenario: 1,000 queries/month

| Split | Local Cost | Cloud Cost | Total |
|-------|------------|------------|-------|
| 100% cloud | $0 | $30-100 | $30-100 |
| 85% local / 15% cloud | ~$8-12 | $5-15 | **$13-27** |
| 100% local (8B only) | ~$8-12 | $0 | $8-12* |

*Quality suffers on complex queries

### Power Consumption (Revised for 8-core)

```
2080 Ti under load: ~250W
AMD Ryzen 5 under load: ~65W (vs 280W for 58-core)
System overhead: ~50W

Total during inference: ~365W (was 580W)
Idle: ~80W (was 150W)

Monthly estimate (8 hrs/day active):
- Active: 365W × 8h × 30 days = 87.6 kWh
- Idle: 80W × 16h × 30 days = 38.4 kWh
- Total: ~126 kWh
- Cost: ~$15-20/month (at $0.12-0.15/kWh)
```

Actually **cheaper to run** than the 58-core system!

---

## Revised Efficiency Verdict

| Use Case | Self-Host Viability | Recommendation |
|----------|---------------------|----------------|
| **Low volume (<300/mo)** | Overkill | Cloud only (~$10-30) |
| **Medium (300-2000/mo)** | Good hybrid | Local + cloud fallback |
| **High volume (2000+/mo)** | Good for simple queries | Local primary, cloud complex |
| **Privacy-critical** | Works for simple queries | Accept quality tradeoff |
| **Need complex analysis** | Not viable locally | Must use cloud |

---

## Recommended Strategy for Franklin

### Option A: Hybrid (Recommended)

```
Local (Ollama + Llama 3.1 8B):
├── Handles 85% of queries
├── Inventory lookups: instant
├── Transaction queries: instant
├── Simple questions: 2-3 seconds
└── Cost: ~$15-20/month electricity

Cloud (Claude 3.5 Haiku or GPT-4o-mini):
├── Handles 15% of queries
├── Lead analysis: 2-3 seconds
├── Complex estimation: 2-3 seconds
├── Market intelligence: 3-5 seconds
└── Cost: ~$5-25/month API

Total: $20-45/month for full AI capability
```

### Option B: Cloud-Primary (Simpler)

```
Cloud (Claude 3.5 Haiku):
├── Handles 100% of queries
├── Consistent 1-3 second responses
├── No local maintenance
└── Cost: ~$30-100/month

Use local for:
├── Embeddings only (for semantic search)
└── Privacy-sensitive queries (rare)
```

### Option C: Local-Only (Budget)

```
Local (Llama 3.1 8B Q5_K_M):
├── Handles all queries locally
├── Simple queries: excellent
├── Complex queries: "good enough"
└── Cost: ~$15-20/month electricity

Tradeoff:
├── Lead analysis less sophisticated
├── No web-based market intelligence
└── Complex reasoning limited
```

---

## Setup Instructions

### Quick Start (Option A - Hybrid)

```bash
# 1. Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 2. Pull 8B model (fits entirely on GPU)
ollama pull llama3.1:8b-instruct-q5_K_M

# 3. Optional: Pull 14B for slightly smarter responses (slower)
ollama pull phi3:14b-medium-4k-instruct-q4_K_M

# 4. Pull embeddings model for semantic search
ollama pull nomic-embed-text

# 5. Verify GPU is being used
ollama run llama3.1:8b-instruct-q5_K_M "Hello" --verbose
# Should show "using GPU" in output
```

### Application Config

```typescript
// src/franklin/ai/config.ts
export const AI_CONFIG = {
  local: {
    endpoint: 'http://localhost:11434',
    model: 'llama3.1:8b-instruct-q5_K_M',
    embedding: 'nomic-embed-text',
  },

  cloud: {
    provider: 'anthropic',
    model: 'claude-3-5-haiku-20241022',
    apiKey: process.env.ANTHROPIC_API_KEY,
  },

  routing: {
    // Queries matching these patterns → local
    local: [
      /who (took|used|removed)/i,
      /what.*(in stock|do we have|inventory)/i,
      /how many/i,
      /list .*(items|transactions|jobs)/i,
      /summarize/i,
      /format|write.*(invoice|note)/i,
    ],
    // Everything else → cloud
    cloud: [
      /analyze/i,
      /estimate.*worth/i,
      /should (we|I)/i,
      /market|trend|forecast/i,
      /research/i,
      /complex|calculate.*if/i,
    ],
  },
};
```

### Smart Router Implementation

```typescript
// src/franklin/ai/router.ts
export function routeQuery(query: string): 'local' | 'cloud' {
  // Check for cloud patterns first (more specific)
  for (const pattern of AI_CONFIG.routing.cloud) {
    if (pattern.test(query)) return 'cloud';
  }

  // Check for local patterns
  for (const pattern of AI_CONFIG.routing.local) {
    if (pattern.test(query)) return 'local';
  }

  // Default: try local first, it's free
  return 'local';
}

export async function executeQuery(query: string, context: string) {
  const route = routeQuery(query);

  if (route === 'local') {
    try {
      return await localInference(query, context);
    } catch (error) {
      console.warn('Local inference failed, falling back to cloud');
      return await cloudInference(query, context);
    }
  }

  return await cloudInference(query, context);
}
```

---

## Performance Expectations (Realistic)

### Single User Experience

| Query Type | Engine | Response Time | Quality |
|------------|--------|---------------|---------|
| "Who took the W8?" | Local 8B | 2-4 seconds | Good |
| "What's low stock?" | Local 8B | 2-4 seconds | Good |
| "Summarize this week" | Local 8B | 4-6 seconds | Good |
| "Analyze this lead" | Cloud | 2-3 seconds | Excellent |
| "Estimate this job" | Cloud | 3-5 seconds | Excellent |

### Multi-User (Shop Floor)

| Concurrent Users | Local 8B Throughput | Latency |
|------------------|---------------------|---------|
| 1 | ~25-35 tok/s | 2-4s |
| 2 | ~15-20 tok/s each | 4-6s |
| 3+ | Starts queuing | 6-10s |

**For a small shop (3-5 people asking occasional questions), this is fine.**

---

## Summary: What Changed with 8 Cores

| Aspect | 58-Core Assumption | 8-Core Reality |
|--------|-------------------|----------------|
| CPU inference | Viable for 32B+ | Not viable |
| Hybrid offloading | Effective | Marginal benefit |
| Primary strategy | Local everything | Local simple + cloud complex |
| Model ceiling | 70B hybrid | 8-14B GPU only |
| Monthly cost | $25-35 | $20-45 (including cloud) |
| Complex queries | Local 32B | Must use cloud |

### Final Recommendation

**Go hybrid:**
1. **Local 8B** for 85% of queries (inventory, transactions, simple Q&A)
2. **Cloud API** for 15% of queries (analysis, estimation, market intel)
3. **Total cost:** ~$25-45/month
4. **User experience:** Fast for common tasks, excellent for complex ones

Your hardware is still useful — the 2080 Ti runs 8B models at excellent speeds. You just can't self-host the heavy reasoning locally. That's what cloud APIs are for.
