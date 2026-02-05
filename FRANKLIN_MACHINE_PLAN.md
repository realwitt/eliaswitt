# Franklin Machine Co. — Inventory & Business Intelligence Platform

## Technical Implementation Plan

**Tech Stack:**
- TanStack Router (file-based routing for SPA)
- TanStack Form (form validation & state)
- TanStack Query (data caching & sync)
- sql.js (WebAssembly SQLite - browser-based, no server)
- HeroUI v3 (UI component library)
- TypeScript + React 18
- Tailwind CSS (existing)

**Architecture:** Single Page Application within Astro, client-side SQLite persistence via IndexedDB backup

---

## Phase 0: Foundation & Infrastructure
**Goal:** Set up the technical foundation before building features

### 0.1 Project Setup
- [ ] Create `/src/franklin/` directory structure
- [ ] Install dependencies:
  ```bash
  npm install @tanstack/react-router @tanstack/react-form @tanstack/react-query
  npm install sql.js @heroui/react framer-motion
  ```
- [ ] Configure HeroUI provider and theme
- [ ] Set up TanStack Router with file-based routes
- [ ] Create Astro page entry point: `/src/pages/franklin.astro`

### 0.2 Database Layer
- [ ] Initialize sql.js with WebAssembly
- [ ] Create `DatabaseProvider` React context
- [ ] Implement IndexedDB persistence (save/restore SQLite db file)
- [ ] Create database schema migrations system
- [ ] Build typed query helpers with TypeScript

### 0.3 Core Schema Design
```sql
-- Core tables for Phase 1
CREATE TABLE inventory_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category_id INTEGER,
  unit TEXT DEFAULT 'each',
  quantity REAL DEFAULT 0,
  min_quantity REAL DEFAULT 0,
  location TEXT,
  cost_per_unit REAL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  parent_id INTEGER,
  color TEXT,
  FOREIGN KEY (parent_id) REFERENCES categories(id)
);

CREATE TABLE inventory_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  transaction_type TEXT NOT NULL, -- 'in', 'out', 'adjustment', 'transfer'
  quantity REAL NOT NULL,
  previous_quantity REAL NOT NULL,
  new_quantity REAL NOT NULL,
  note TEXT NOT NULL, -- Required notes per spec
  reference_id TEXT, -- Job number, PO, etc.
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES inventory_items(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'user', -- 'admin', 'user', 'viewer'
  pin TEXT, -- Quick auth for shop floor
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id INTEGER,
  old_values TEXT, -- JSON
  new_values TEXT, -- JSON
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### 0.4 Mock Data Seeding
- [ ] Create realistic steel fabrication inventory data:
  - Steel beams (W-shapes: W8, W10, W12, W14, W16, etc.)
  - Channel steel (C3, C4, C5, C6, etc.)
  - Angle iron (various sizes)
  - Plate steel (various thicknesses)
  - Pipe and tube stock
  - Hardware (bolts, nuts, washers)
  - Consumables (welding wire, gas, grinding discs)
- [ ] Seed 50-100 inventory items with realistic data
- [ ] Create 5-10 mock users (shop workers, office staff)
- [ ] Generate 200+ historical transactions

### 0.5 Base Layout & Navigation
- [ ] Create app shell with HeroUI
- [ ] Sidebar navigation component
- [ ] Top bar with user context & quick actions
- [ ] Mobile-responsive layout
- [ ] Dark/light theme toggle (steel shop = dark mode default)

**Deliverable:** Working app shell with database, routing, and UI framework ready

---

## Phase 1: Inventory Essentials ($400/mo tier)
**Goal:** Core inventory tracking that works in 10 seconds on any device

### 1.1 Quick Update Interface (Hero Feature)
The "10-second update" is the killer feature. Optimize ruthlessly.

- [ ] **Quick Search Bar** (always visible)
  - Fuzzy search by SKU, name, or description
  - Keyboard shortcut (/) to focus
  - Recent items list
  - Barcode scanner integration placeholder

- [ ] **Quick Adjust Modal**
  - Opens from search result
  - Large +/- buttons for touch
  - Quantity input with increment controls
  - **Required note field** (enforced)
  - Show current quantity prominently
  - One-tap common actions: "Used on job", "Received shipment", "Counted"

- [ ] **Mobile-First Quick Actions**
  - Bottom sheet interface on mobile
  - Swipe gestures for common operations
  - Haptic feedback on actions

### 1.2 Inventory List & Search
- [ ] **Main Inventory Table**
  - Virtual scrolling for performance (hundreds of items)
  - Column sorting (name, SKU, quantity, last updated)
  - Column visibility toggle
  - Inline editing for quick fixes

- [ ] **Advanced Filtering**
  - Category filter (multi-select)
  - Stock status (in stock, low, out)
  - Location filter
  - Date range (last updated)
  - Save filter presets

- [ ] **Search Features**
  - Full-text search across all fields
  - Filter by category while searching
  - Search within results

### 1.3 Item Management
- [ ] **Add New Item Form** (TanStack Form)
  - SKU (auto-generate option)
  - Name, description
  - Category (with quick-add new)
  - Unit of measure
  - Initial quantity
  - Minimum quantity threshold
  - Storage location
  - Cost per unit (optional in essentials)
  - Form validation with helpful errors

- [ ] **Edit Item**
  - All fields editable
  - Change history visible
  - Soft delete (archive) option

- [ ] **Item Detail View**
  - All item information
  - Transaction history for this item
  - Usage chart (simple)
  - Related items suggestion

### 1.4 User Management (Unlimited Users)
- [ ] **User List**
  - Add/edit/deactivate users
  - Role assignment (admin, user, viewer)
  - Quick PIN setup for shop floor

- [ ] **Simple Auth**
  - PIN entry for quick actions
  - Session management
  - "Who's using the terminal" selector

### 1.5 Audit Trail
- [ ] **Transaction History View**
  - Filterable by user, item, date, type
  - Shows: who, what, when, why (note)
  - Export to CSV

- [ ] **Item-Level History**
  - See all changes to a specific item
  - Quantity over time chart

### 1.6 Low Stock Alerts
- [ ] **Alert Dashboard**
  - Items below minimum quantity
  - Items at zero
  - Configurable alert thresholds

- [ ] **Visual Indicators**
  - Color coding in lists (red/yellow/green)
  - Badge counts in navigation

**Deliverable:** Fully functional inventory system matching "Essentials" tier

---

## Phase 2: Full Inventory System (+$600/mo features)
**Goal:** Price tracking, forecasting, job tracking, suppliers, invoicing, reports

### 2.1 Price Tracking
- [ ] **Cost Per Unit Tracking**
  - Record cost when receiving inventory
  - Cost history per item
  - Average cost calculation
  - Last cost vs average cost display

- [ ] **Inventory Valuation**
  - Total inventory value (FIFO, LIFO, Average)
  - Value by category
  - Value change over time

- [ ] **Price Update Interface**
  - Bulk price updates
  - Percentage adjustments
  - Import prices from CSV

### 2.2 Manual Forecasting ("What If" Scenarios)
- [ ] **Scenario Builder**
  - Create named scenarios
  - Adjust quantities manually
  - Project future needs

- [ ] **What-If Calculator**
  - "If we take this job, we'll need..."
  - "At current usage rate, we'll run out by..."
  - Material requirements input

- [ ] **Usage Trends**
  - Weekly/monthly usage rates
  - Seasonal patterns (manual tagging)
  - Reorder point suggestions

### 2.3 Job Tracking
**New Schema:**
```sql
CREATE TABLE jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_number TEXT UNIQUE NOT NULL,
  customer_id INTEGER,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'quoted', -- quoted, active, complete, cancelled
  quoted_amount REAL,
  start_date TEXT,
  due_date TEXT,
  completed_date TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE job_materials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  quantity_estimated REAL,
  quantity_used REAL DEFAULT 0,
  cost_at_time REAL, -- Snapshot cost when allocated
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id),
  FOREIGN KEY (item_id) REFERENCES inventory_items(id)
);

CREATE TABLE customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

- [ ] **Job List View**
  - Status filtering
  - Customer filter
  - Date range filter
  - Search by job number/name

- [ ] **Job Detail View**
  - Job information
  - Materials list (estimated vs used)
  - Cost tracking
  - Timeline/progress

- [ ] **Material Allocation**
  - Assign materials to jobs
  - Track actual usage vs estimated
  - Auto-update inventory when materials used

- [ ] **Quick "Use for Job"**
  - From quick adjust modal
  - Select job from list
  - Applies to transaction note automatically

### 2.4 Supplier Management
**New Schema:**
```sql
CREATE TABLE suppliers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  website TEXT,
  notes TEXT,
  payment_terms TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE supplier_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  supplier_sku TEXT,
  price REAL,
  lead_time_days INTEGER,
  min_order_qty REAL,
  last_updated TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
  FOREIGN KEY (item_id) REFERENCES inventory_items(id)
);

CREATE TABLE purchase_orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  po_number TEXT UNIQUE NOT NULL,
  supplier_id INTEGER NOT NULL,
  status TEXT DEFAULT 'draft', -- draft, sent, partial, received, cancelled
  total_amount REAL,
  notes TEXT,
  ordered_date TEXT,
  expected_date TEXT,
  received_date TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

CREATE TABLE purchase_order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  po_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  quantity_ordered REAL NOT NULL,
  quantity_received REAL DEFAULT 0,
  unit_price REAL,
  FOREIGN KEY (po_id) REFERENCES purchase_orders(id),
  FOREIGN KEY (item_id) REFERENCES inventory_items(id)
);
```

- [ ] **Supplier Directory**
  - CRUD for suppliers
  - Contact information
  - Notes and payment terms

- [ ] **Supplier-Item Relationships**
  - Which suppliers carry which items
  - Price comparison across suppliers
  - Lead time tracking

- [ ] **Purchase Orders**
  - Create PO from low stock items
  - Send PO (email/print)
  - Receive against PO
  - Partial receiving

### 2.5 Invoicing
**New Schema:**
```sql
CREATE TABLE invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_number TEXT UNIQUE NOT NULL,
  job_id INTEGER,
  customer_id INTEGER NOT NULL,
  status TEXT DEFAULT 'draft', -- draft, sent, paid, overdue, cancelled
  subtotal REAL,
  tax_rate REAL DEFAULT 0,
  tax_amount REAL DEFAULT 0,
  total REAL,
  notes TEXT,
  due_date TEXT,
  sent_date TEXT,
  paid_date TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE invoice_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id INTEGER NOT NULL,
  description TEXT NOT NULL,
  quantity REAL DEFAULT 1,
  unit_price REAL NOT NULL,
  total REAL NOT NULL,
  item_id INTEGER, -- Optional link to inventory
  FOREIGN KEY (invoice_id) REFERENCES invoices(id),
  FOREIGN KEY (item_id) REFERENCES inventory_items(id)
);
```

- [ ] **Invoice Creation**
  - From job (auto-populate materials)
  - Manual line items
  - Tax calculation
  - Notes/terms

- [ ] **Invoice Templates**
  - Professional PDF generation
  - Company branding
  - Multiple templates

- [ ] **Invoice Management**
  - Status tracking
  - Payment recording
  - Overdue alerts

- [ ] **Invoice List**
  - Filter by status, customer, date
  - Totals and summaries

### 2.6 Reports & Analytics
- [ ] **Inventory Value Report**
  - Total value by category
  - Value trends over time
  - High-value items list

- [ ] **Usage Reports**
  - Most used items
  - Usage by category
  - Usage by job
  - Seasonal trends

- [ ] **Job Profitability**
  - Material costs per job
  - Margin analysis
  - Compare estimated vs actual

- [ ] **Supplier Analysis**
  - Spending by supplier
  - Price trends
  - Lead time accuracy

- [ ] **Export Options**
  - CSV export for all reports
  - Print-friendly views

**Deliverable:** Complete inventory management system with job tracking, suppliers, invoicing

---

## Phase 3: Lead & Marketing Integration ($1,000/mo tier)
**Goal:** Lead capture, pipeline tracking, conversion analytics

### 3.1 Lead Management
**New Schema:**
```sql
CREATE TABLE leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source TEXT NOT NULL, -- 'website', 'phone', 'referral', 'walk-in', etc.
  status TEXT DEFAULT 'new', -- new, contacted, qualified, quoted, won, lost
  company_name TEXT,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  project_description TEXT,
  estimated_value REAL,
  priority TEXT DEFAULT 'medium', -- low, medium, high
  assigned_to INTEGER,
  converted_to_job_id INTEGER,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_to) REFERENCES users(id),
  FOREIGN KEY (converted_to_job_id) REFERENCES jobs(id)
);

CREATE TABLE lead_activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL,
  user_id INTEGER,
  activity_type TEXT NOT NULL, -- 'note', 'call', 'email', 'meeting', 'status_change'
  description TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

- [ ] **Lead Inbox**
  - New leads prominent
  - Quick view/triage
  - Assign to team member

- [ ] **Lead Detail View**
  - Contact information
  - Project details
  - Activity timeline
  - Convert to job button

- [ ] **Lead Pipeline**
  - Kanban board view
  - Drag-drop status changes
  - Pipeline value totals

- [ ] **Lead Form (Embeddable)**
  - For website integration
  - Customizable fields
  - Auto-creates lead in system

### 3.2 Conversion Tracking
- [ ] **Lead → Quote → Job Pipeline**
  - Track conversion rates
  - Time in each stage
  - Win/loss reasons

- [ ] **Source Attribution**
  - Which sources produce leads
  - Which sources convert best
  - ROI by source

### 3.3 Marketing Analytics Dashboard
- [ ] **Lead Metrics**
  - Leads by source (pie chart)
  - Leads over time (line chart)
  - Conversion funnel

- [ ] **Value Metrics**
  - Total pipeline value
  - Won vs lost value
  - Average deal size

- [ ] **Monthly Report View**
  - Traffic (placeholder/manual entry)
  - Leads generated
  - Conversions
  - Revenue from new leads

**Deliverable:** Lead management system with pipeline tracking and analytics

---

## Phase 4: AI Intelligence Suite ($3,000/mo tier)
**Goal:** AI-powered insights, analysis, and automation

### 4.1 AI Infrastructure
- [ ] **AI Provider Integration**
  - OpenAI API integration (or Claude API)
  - API key management
  - Usage tracking
  - Cost monitoring

- [ ] **Context Builder**
  - System that assembles relevant data for AI queries
  - Inventory context
  - Job context
  - Customer context
  - Historical data summaries

### 4.2 Conversational Business Intelligence
- [ ] **Chat Interface**
  - Natural language input
  - Query history
  - Suggested questions

- [ ] **Query Understanding**
  - Parse natural language to data queries
  - Handle questions like:
    - "Who took the last W8 beam?"
    - "What's our margin on fabrication jobs this quarter?"
    - "Which supplier has best prices on channel steel?"
    - "How much did we spend on materials for Henderson project?"

- [ ] **Response Generation**
  - Clear, formatted answers
  - Include relevant data tables
  - Link to detailed views

- [ ] **Common Query Shortcuts**
  - Pre-built queries for common questions
  - One-click access

### 4.3 Smart Lead Analysis
- [ ] **Auto Lead Research**
  - When lead comes in, AI researches:
    - Company background (if available)
    - Industry
    - Estimated project scope

- [ ] **Job Potential Estimation**
  - Analyze project description
  - Estimate complexity
  - Suggest timeline
  - Predict inventory needs

- [ ] **Margin Estimation**
  - Calculate potential materials cost
  - Estimate labor (configurable rates)
  - Show projected profit

- [ ] **Lead Summary Card**
  - AI-generated brief
  - Key insights highlighted
  - Recommended next steps

### 4.4 Market Intelligence
- [ ] **News Feed Integration**
  - Steel industry news aggregation
  - Tariff announcements
  - Supply chain alerts

- [ ] **Price Trend Monitoring**
  - Track steel price indices
  - Historical comparison
  - Trend visualization

- [ ] **AI Alerts**
  - "Steel prices expected to rise 5% next month"
  - "New tariffs announced affecting imports"
  - Source links for verification

- [ ] **Impact Analysis**
  - "This affects your inventory by X%"
  - "Consider adjusting quotes"

### 4.5 Intelligent Invoicing
- [ ] **Price Adjustment Suggestions**
  - When costs rise, suggest adjustment
  - Calculate percentage impact
  - Show affected invoices

- [ ] **AI-Written Explanations**
  - Generate professional adjustment language
  - "Due to steel tariff increases effective March 1st..."
  - Multiple tone options

- [ ] **Goodwill Tracking**
  - "We absorbed $X in cost increases"
  - Customer relationship notes

### 4.6 Job Estimation & Forecasting
- [ ] **Quick Estimate Calculator**
  - AI-assisted job quoting
  - Material requirements
  - Current inventory availability
  - Current supplier prices

- [ ] **What-If with AI**
  - "What would this job cost if steel goes up 10%?"
  - "What if we use supplier B instead?"

- [ ] **Smart Forecasting**
  - AI-predicted usage
  - Recommended reorder timing
  - Inventory optimization suggestions

**Deliverable:** AI-powered intelligence layer across all system features

---

## Phase 5: Polish & Production Readiness
**Goal:** Production-ready application with excellent UX

### 5.1 Performance Optimization
- [ ] Virtual scrolling for all large lists
- [ ] Query caching with TanStack Query
- [ ] Database query optimization
- [ ] Lazy loading for routes
- [ ] Image optimization

### 5.2 Offline Support
- [ ] Service worker for offline access
- [ ] Queue changes when offline
- [ ] Sync when back online
- [ ] Offline indicator

### 5.3 Data Management
- [ ] Database backup/restore UI
- [ ] Export full database
- [ ] Import from backup
- [ ] Data reset option

### 5.4 Settings & Configuration
- [ ] Company profile setup
- [ ] Tax rates configuration
- [ ] Invoice templates
- [ ] Notification preferences
- [ ] Theme customization

### 5.5 Onboarding
- [ ] First-run setup wizard
- [ ] Sample data option
- [ ] Feature tour
- [ ] Help tooltips

### 5.6 Testing
- [ ] Unit tests for database operations
- [ ] Integration tests for key flows
- [ ] E2E tests for critical paths
- [ ] Performance benchmarks

### 5.7 Documentation
- [ ] User guide
- [ ] Admin documentation
- [ ] API documentation (for AI layer)

**Deliverable:** Production-ready application

---

## Directory Structure

```
src/
├── franklin/
│   ├── main.tsx                    # React SPA entry
│   ├── router.tsx                  # TanStack Router config
│   ├── providers.tsx               # All providers wrapped
│   │
│   ├── db/
│   │   ├── database.ts             # sql.js initialization
│   │   ├── migrations.ts           # Schema migrations
│   │   ├── seed.ts                 # Mock data seeding
│   │   ├── persistence.ts          # IndexedDB backup
│   │   └── queries/
│   │       ├── inventory.ts
│   │       ├── transactions.ts
│   │       ├── users.ts
│   │       ├── jobs.ts
│   │       ├── suppliers.ts
│   │       ├── invoices.ts
│   │       └── leads.ts
│   │
│   ├── types/
│   │   ├── inventory.ts
│   │   ├── jobs.ts
│   │   ├── suppliers.ts
│   │   ├── invoices.ts
│   │   ├── leads.ts
│   │   └── users.ts
│   │
│   ├── hooks/
│   │   ├── useDatabase.ts
│   │   ├── useInventory.ts
│   │   ├── useJobs.ts
│   │   ├── useSuppliers.ts
│   │   ├── useInvoices.ts
│   │   ├── useLeads.ts
│   │   └── useAI.ts
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   └── MobileNav.tsx
│   │   │
│   │   ├── inventory/
│   │   │   ├── QuickSearch.tsx
│   │   │   ├── QuickAdjust.tsx
│   │   │   ├── InventoryTable.tsx
│   │   │   ├── ItemForm.tsx
│   │   │   ├── ItemDetail.tsx
│   │   │   └── LowStockAlert.tsx
│   │   │
│   │   ├── jobs/
│   │   │   ├── JobList.tsx
│   │   │   ├── JobDetail.tsx
│   │   │   ├── JobForm.tsx
│   │   │   └── MaterialAllocation.tsx
│   │   │
│   │   ├── suppliers/
│   │   │   ├── SupplierList.tsx
│   │   │   ├── SupplierDetail.tsx
│   │   │   ├── SupplierForm.tsx
│   │   │   └── PurchaseOrders.tsx
│   │   │
│   │   ├── invoices/
│   │   │   ├── InvoiceList.tsx
│   │   │   ├── InvoiceDetail.tsx
│   │   │   ├── InvoiceForm.tsx
│   │   │   └── InvoicePreview.tsx
│   │   │
│   │   ├── leads/
│   │   │   ├── LeadInbox.tsx
│   │   │   ├── LeadDetail.tsx
│   │   │   ├── LeadPipeline.tsx
│   │   │   └── LeadForm.tsx
│   │   │
│   │   ├── ai/
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── LeadAnalysis.tsx
│   │   │   ├── MarketIntel.tsx
│   │   │   └── SmartEstimate.tsx
│   │   │
│   │   ├── reports/
│   │   │   ├── InventoryValue.tsx
│   │   │   ├── UsageReports.tsx
│   │   │   ├── JobProfitability.tsx
│   │   │   └── LeadAnalytics.tsx
│   │   │
│   │   └── shared/
│   │       ├── DataTable.tsx
│   │       ├── SearchInput.tsx
│   │       ├── FilterPanel.tsx
│   │       ├── ConfirmDialog.tsx
│   │       └── FormFields.tsx
│   │
│   └── routes/
│       ├── __root.tsx              # Root layout
│       ├── index.tsx               # Dashboard
│       ├── inventory/
│       │   ├── index.tsx           # Inventory list
│       │   ├── $itemId.tsx         # Item detail
│       │   └── new.tsx             # New item
│       ├── jobs/
│       │   ├── index.tsx
│       │   ├── $jobId.tsx
│       │   └── new.tsx
│       ├── suppliers/
│       │   ├── index.tsx
│       │   ├── $supplierId.tsx
│       │   └── purchase-orders.tsx
│       ├── invoices/
│       │   ├── index.tsx
│       │   ├── $invoiceId.tsx
│       │   └── new.tsx
│       ├── leads/
│       │   ├── index.tsx
│       │   ├── $leadId.tsx
│       │   └── pipeline.tsx
│       ├── ai/
│       │   ├── chat.tsx
│       │   ├── market.tsx
│       │   └── estimates.tsx
│       ├── reports/
│       │   └── index.tsx
│       └── settings/
│           └── index.tsx
│
├── pages/
│   └── franklin.astro              # Astro entry point
│
└── styles/
    └── franklin.css                # Additional styles
```

---

## Mock Data Specification

### Steel Inventory Items (50+ items)
```typescript
const steelCategories = [
  'Wide Flange Beams',    // W8x31, W10x49, W12x65, etc.
  'Channel Steel',        // C3x4.1, C4x5.4, C6x8.2, etc.
  'Angle Iron',           // L2x2x1/4, L3x3x3/8, etc.
  'Plate Steel',          // 1/4" plate, 3/8" plate, 1/2" plate
  'Tube Steel',           // Square tube, rectangular tube
  'Pipe',                 // Schedule 40, Schedule 80
  'Flat Bar',             // 1/4x2, 3/8x3, etc.
  'Round Bar',            // 1/2" round, 3/4" round, etc.
  'Hardware',             // Bolts, nuts, washers, anchors
  'Consumables',          // Welding wire, grinding discs, gas
];
```

### Realistic Transaction History (200+ records)
- Morning receiving from suppliers
- Job material allocations throughout day
- End-of-day adjustments/counts
- Historical data spanning 3-6 months

### Sample Customers & Jobs
- 10-15 customers (construction companies, contractors, homeowners)
- 20-30 jobs at various stages
- Realistic job names: "Henderson Warehouse Expansion", "Main St Building Repairs"

### Sample Suppliers
- 5-8 steel suppliers with realistic pricing
- Lead times: 3-14 days depending on supplier/item
- Different pricing tiers

---

## Implementation Priority

**Start with Phase 0 + 1** (Foundation + Essentials)
- This is the MVP that proves the concept
- Focus on the "10-second update" flow above all else
- Get this working perfectly before moving on

**Phase 2** adds business value
- Job tracking is the key differentiator
- Invoicing makes it a complete business tool

**Phase 3** adds growth
- Lead tracking shows marketing ROI

**Phase 4** is the premium differentiator
- AI features justify the premium pricing
- Start simple (chat interface) then expand

**Phase 5** makes it shippable
- Polish, test, document

---

## Key Success Metrics

1. **Quick Update Speed** - Can a user adjust inventory in <10 seconds?
2. **Search Speed** - Can a user find any item in <3 seconds?
3. **Zero Training** - Can someone use it without instruction?
4. **Offline Reliability** - Does it work without internet?
5. **Data Integrity** - Are all changes logged and traceable?

---

## Notes

- **No server requirement** - Everything runs in browser with sql.js
- **Data persistence** - SQLite database saved to IndexedDB
- **Portable** - Can export/import database file
- **Privacy** - All data stays local unless explicitly synced
- **Future-ready** - Architecture supports future server sync if needed
