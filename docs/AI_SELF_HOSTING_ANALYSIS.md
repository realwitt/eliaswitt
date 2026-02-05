# AI Platform Architecture — Pragmatic Approach

## Hardware Context

| Component | Spec | Role in This Architecture |
|-----------|------|---------------------------|
| **GPU** | NVIDIA 2080 Ti (11GB) | Embeddings only (overkill, but free) |
| **RAM** | 64GB DDR4 | Host the application |
| **CPU** | AMD Ryzen 5 (8-core) | Run the platform, embeddings |

**Decision: Cloud-only for LLM inference. Local embeddings only.**

---

## Why Cloud-Only for AI

| Factor | Local 8B | Cloud API | Winner |
|--------|----------|-----------|--------|
| Quality | Good | Excellent | Cloud |
| Speed | 2-4s | 1-2s | Cloud |
| Maintenance | You manage it | Zero | Cloud |
| Reliability | Your uptime | 99.9% SLA | Cloud |
| Monthly cost | $15-25 | $40-80 | Local (but...) |
| **Complexity** | Medium | None | Cloud |

**For a $400-5000/month platform, saving $20-40/month isn't worth the operational overhead.**

---

## Final Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    Franklin AI Platform                           │
│                    (Pragmatic Architecture)                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│   YOUR HARDWARE (Local)                                           │
│   ┌─────────────────────────────────────────────────────────┐    │
│   │                                                          │    │
│   │   Franklin Application                                   │    │
│   │   ├── React + TanStack (frontend)                       │    │
│   │   ├── SQLite via sql.js (database)                      │    │
│   │   └── Runs in browser, no server needed                 │    │
│   │                                                          │    │
│   │   Local Embeddings (optional)                            │    │
│   │   ├── Ollama + nomic-embed-text                         │    │
│   │   ├── 300MB model, instant responses                    │    │
│   │   └── Powers semantic search                            │    │
│   │                                                          │    │
│   └─────────────────────────────────────────────────────────┘    │
│                              │                                    │
│                              │ API calls                          │
│                              ▼                                    │
│   CLOUD (Anthropic API)                                           │
│   ┌─────────────────────────────────────────────────────────┐    │
│   │                                                          │    │
│   │   Claude 3.5 Haiku ($0.25/1M input, $1.25/1M output)    │    │
│   │   ├── Inventory questions                                │    │
│   │   ├── Lead analysis                                      │    │
│   │   ├── Job estimation                                     │    │
│   │   ├── Market intelligence                                │    │
│   │   ├── Invoice text generation                            │    │
│   │   └── All conversational AI                              │    │
│   │                                                          │    │
│   │   Claude 3.5 Sonnet (if needed for complex reasoning)   │    │
│   │   └── Fallback for nuanced analysis                      │    │
│   │                                                          │    │
│   └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Cost Breakdown

### AI Costs (Cloud)

| Usage Level | Queries/Month | Avg Tokens/Query | Monthly Cost |
|-------------|---------------|------------------|--------------|
| Light | 500 | 1,000 | ~$15-25 |
| Medium | 2,000 | 1,000 | ~$40-60 |
| Heavy | 5,000 | 1,500 | ~$80-120 |

**Estimate for Franklin (small shop, 3-5 users):** $40-80/month

### What You're NOT Paying For

| Item | Cloud Cost | Your Cost |
|------|------------|-----------|
| Hosting (Vercel, Railway, etc.) | $20-50/month | $0 (runs locally) |
| Database (Supabase, PlanetScale) | $25-50/month | $0 (SQLite local) |
| Embeddings API | $10-20/month | $0 (local Ollama) |

**Net savings from local hosting: ~$55-120/month**

### Total Monthly Cost

```
AI (Claude API):        $40-80
Hosting:                $0 (local)
Database:               $0 (SQLite)
Embeddings:             $0 (local)
───────────────────────────────
Total:                  $40-80/month
```

Compare to fully cloud-hosted: $100-200/month

---

## Implementation

### 1. AI Integration (Simple)

```typescript
// src/franklin/ai/client.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function chat(
  query: string,
  context: string,
  options?: { model?: 'haiku' | 'sonnet' }
) {
  const model = options?.model === 'sonnet'
    ? 'claude-sonnet-4-20250514'
    : 'claude-3-5-haiku-20241022';

  const response = await anthropic.messages.create({
    model,
    max_tokens: 1024,
    system: `You are an AI assistant for Franklin Machine Co., a steel fabrication shop.
You have access to their inventory, jobs, and business data.
Answer questions directly and concisely. Reference specific items by SKU.
Format numbers appropriately (currency, quantities).

CURRENT DATA:
${context}`,
    messages: [{ role: 'user', content: query }],
  });

  return response.content[0].type === 'text'
    ? response.content[0].text
    : '';
}
```

### 2. Context Builder (RAG)

```typescript
// src/franklin/ai/context.ts
export async function buildContext(query: string, db: Database): Promise<string> {
  const sections: string[] = [];

  // Always include recent activity
  const recentTransactions = await db.query(`
    SELECT t.created_at, u.name as user, i.name as item,
           t.transaction_type, t.quantity, t.note
    FROM inventory_transactions t
    JOIN users u ON t.user_id = u.id
    JOIN inventory_items i ON t.item_id = i.id
    ORDER BY t.created_at DESC
    LIMIT 10
  `);
  sections.push(`## Recent Activity\n${formatTable(recentTransactions)}`);

  // Include inventory if relevant
  if (/stock|inventory|item|material|quantity/i.test(query)) {
    const inventory = await db.query(`
      SELECT sku, name, quantity, unit, location,
             CASE WHEN quantity <= min_quantity THEN 'LOW' ELSE 'OK' END as status
      FROM inventory_items
      ORDER BY name
      LIMIT 50
    `);
    sections.push(`## Current Inventory\n${formatTable(inventory)}`);
  }

  // Include jobs if relevant
  if (/job|project|customer|estimate/i.test(query)) {
    const jobs = await db.query(`
      SELECT j.job_number, j.name, c.name as customer, j.status, j.quoted_amount
      FROM jobs j
      LEFT JOIN customers c ON j.customer_id = c.id
      WHERE j.status IN ('quoted', 'active')
    `);
    sections.push(`## Active Jobs\n${formatTable(jobs)}`);
  }

  // Include leads if relevant
  if (/lead|prospect|inquiry|potential/i.test(query)) {
    const leads = await db.query(`
      SELECT company_name, contact_name, source, status, estimated_value, created_at
      FROM leads
      WHERE status NOT IN ('won', 'lost')
      ORDER BY created_at DESC
      LIMIT 10
    `);
    sections.push(`## Open Leads\n${formatTable(leads)}`);
  }

  return sections.join('\n\n');
}
```

### 3. Local Embeddings (Optional but Recommended)

```typescript
// src/franklin/ai/embeddings.ts
const OLLAMA_URL = 'http://localhost:11434';

export async function getEmbedding(text: string): Promise<number[]> {
  const response = await fetch(`${OLLAMA_URL}/api/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'nomic-embed-text',
      prompt: text,
    }),
  });

  const data = await response.json();
  return data.embedding;
}

export async function semanticSearch(
  query: string,
  items: Array<{ id: number; text: string; embedding: number[] }>,
  topK: number = 5
): Promise<Array<{ id: number; score: number }>> {
  const queryEmbedding = await getEmbedding(query);

  const scored = items.map(item => ({
    id: item.id,
    score: cosineSimilarity(queryEmbedding, item.embedding),
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
```

### 4. Setup Script

```bash
#!/bin/bash
# setup-franklin-ai.sh

echo "Setting up Franklin AI Platform..."

# 1. Install Ollama (for embeddings only)
if ! command -v ollama &> /dev/null; then
  echo "Installing Ollama..."
  curl -fsSL https://ollama.com/install.sh | sh
fi

# 2. Pull embeddings model (small, ~300MB)
echo "Pulling embeddings model..."
ollama pull nomic-embed-text

# 3. Start Ollama service
echo "Starting Ollama..."
ollama serve &

# 4. Verify
echo "Testing embeddings..."
curl -s http://localhost:11434/api/embeddings \
  -d '{"model": "nomic-embed-text", "prompt": "test"}' | head -c 100

echo ""
echo "Setup complete!"
echo "- Embeddings: Local (Ollama)"
echo "- AI Chat: Cloud (set ANTHROPIC_API_KEY)"
```

---

## Feature Implementation with Cloud AI

### Conversational Business Intelligence

```typescript
// Example queries and expected behavior

// Simple lookup → Haiku, fast, cheap
"Who took the last W8 beam?"
→ Context: recent transactions
→ Response: "John Smith took 2 W8x31 beams yesterday at 3:42 PM for the Henderson project."

// Complex analysis → Still Haiku (it's good enough)
"Should we take this lead? They want a warehouse expansion, budget around $50K"
→ Context: leads, jobs, inventory
→ Response: "Based on your current inventory and capacity:
   - You have sufficient beam stock for a project this size
   - Similar jobs (Henderson, Martinez) averaged 18% margin
   - Current lead pipeline is light, so capacity is available
   Recommendation: Worth pursuing. Request detailed specs for accurate quote."

// Market intelligence → Haiku + web context (future feature)
"What's happening with steel prices?"
→ Would need web search integration (Phase 2)
→ For now: "I don't have real-time market data. Check [steel price index source]."
```

### Smart Lead Analysis

```typescript
// src/franklin/ai/leads.ts
export async function analyzeLeadWithAI(lead: Lead, db: Database): Promise<LeadAnalysis> {
  const context = await buildContext(`analyze lead ${lead.company_name}`, db);

  const prompt = `Analyze this potential lead for a steel fabrication shop:

Company: ${lead.company_name}
Contact: ${lead.contact_name}
Project Description: ${lead.project_description}
Estimated Value: ${lead.estimated_value ? `$${lead.estimated_value}` : 'Unknown'}
Source: ${lead.source}

Based on the shop's current inventory, active jobs, and historical data, provide:
1. Job complexity estimate (simple/moderate/complex)
2. Likely materials needed
3. Estimated timeline
4. Potential margin (based on similar past jobs)
5. Recommendation (pursue/pass/need more info)

Be concise and specific.`;

  const analysis = await chat(prompt, context);

  return {
    leadId: lead.id,
    analysis,
    generatedAt: new Date().toISOString(),
  };
}
```

### Intelligent Invoicing

```typescript
// src/franklin/ai/invoicing.ts
export async function generatePriceAdjustmentNote(
  percentageIncrease: number,
  reason: string
): Promise<string> {
  const prompt = `Write a brief, professional note explaining a ${percentageIncrease}% price adjustment on an invoice.

Reason: ${reason}

The note should be:
- 1-2 sentences
- Professional but not stiff
- Clear about the reason
- Appropriate for a steel fabrication customer

Just output the note text, nothing else.`;

  return await chat(prompt, '', { model: 'haiku' });
}

// Example output:
// "Due to recent steel tariff increases effective March 1st, a 6% materials
//  adjustment has been applied to this invoice. We appreciate your understanding."
```

---

## What You're Getting

| Feature | Implementation | Cost |
|---------|----------------|------|
| **Chat interface** | Claude API | ~$0.01-0.05/query |
| **Lead analysis** | Claude API | ~$0.02-0.08/analysis |
| **Invoice text** | Claude API | ~$0.005/generation |
| **Semantic search** | Local embeddings | Free |
| **Market intelligence** | Future (needs web) | TBD |

---

## Summary

**Approach:** Cloud AI + Local Embeddings + Local Hosting

**Why this is pragmatic:**
1. **Simpler** — No local model management, no GPU drivers, no VRAM juggling
2. **More reliable** — Claude's uptime > your home server's uptime
3. **Better quality** — Haiku beats local 8B for complex reasoning
4. **Affordable** — $40-80/month for AI is noise against platform pricing
5. **Still saves money** — Local hosting + embeddings saves $55-120/month

**Your hardware's role:**
- Hosts the entire application (saves cloud hosting costs)
- Runs embeddings locally (saves API costs, better privacy)
- Development and testing playground

**Total monthly cost:** ~$40-80 (just AI API)
**vs fully cloud-hosted:** ~$150-250
