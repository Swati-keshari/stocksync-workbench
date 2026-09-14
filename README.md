# StockSync — Swati Keshari

Personal frontend workbench: compare shop, warehouse, and website stock lists. Built with **Next.js**, **React**, **TypeScript**, **TanStack Query**, **Zustand**, **AG Grid**, **ECharts**, and **Tailwind CSS**.

> Mock data only. No real shop, database, or password store. Log in with the demo credentials printed on `/login`.

Start at `/` (story) then `/learn` (class 10 English) then `/workbench` (the tool).

---

## Why This Project Was Built

### The Problem in the Real World

Retail and e-commerce businesses operate across **multiple inventory systems simultaneously**:

```
┌──────────┐   ┌──────────┐   ┌──────────────┐
│   POS    │   │   WMS    │   │ E-Commerce   │
│ (Cash    │   │ (Ware-   │   │ (Shopify,    │
│ Registers)│  │  house)  │   │  Amazon, etc)│
└────┬─────┘   └────┬─────┘   └──────┬───────┘
     │              │                 │
     └──────────────┼─────────────────┘
                    │
           ┌────────▼────────┐
           │  ?? Discrepancy │
           │     Nobody      │
           │      Knows      │
           └─────────────────┘
```

**Each system tracks inventory independently.** The POS says 42 units of SKU-1024 are on the shelf. The warehouse management system (WMS) says 38. The e-commerce platform says 40. **Which number is right?** Nobody knows — and until someone figures it out, the business faces:

1. **Stockout risk** — A product shows "in stock" online but the shelf is empty, leading to failed fulfillments, angry customers, and lost revenue.
2. **Shrinkage (theft/damage)** — Physical inventory is lower than any system reports, silently eating into margins.
3. **Overstocking** — Systems over-report availability, triggering unnecessary reorders that tie up capital in dead inventory.
4. **Manual reconciliation hell** — Ops teams export CSVs from 3 systems, paste them into Excel, VLOOKUP by SKU, and manually compare quantities row by row. This takes hours, is error-prone, and only captures a snapshot — not the real-time drift happening right now.
5. **No audit trail** — When discrepancies are found, there's no record of who resolved them, which source was accepted as truth, or why.

### What This Project Solves

StockSync is a **real-time inventory reconciliation dashboard** that solves all of the above:

- **Automatically detects** quantity discrepancies across POS, WMS, and E-Commerce sources
- **Classifies severity** using both percentage variance AND absolute unit delta (a 2-unit swing on 4 units is noise; the same 2 units on 400 units is real shrinkage)
- **Suggests root causes** via ML classification (timing lag, data entry error, possible shrinkage)
- **Prioritizes by dollar impact** — not raw percentage — so ops teams triage what actually costs the most
- **Provides real-time updates** — every ~7 seconds, simulated sync ticks update the reconciliation queue live
- **Supports bulk actions** — resolve multiple items at once
- **Maintains a full audit trail** — every action is logged with actor, timestamp, and outcome
- **Tracks shrinkage exposure** — dollar-value estimate of total inventory discrepancy

---

## How It Works — Full Application Flow

### Architecture Overview

```mermaid
graph TB
    subgraph "Data Sources (Mocked)"
        POS[POS System]
        WMS[Warehouse Management]
        ECOM[E-Commerce Platform]
    end

    subgraph "Next.js Backend (API Routes)"
        API_RECON["/api/reconciliation-items"]
        API_HEALTH["/api/sync-health"]
        API_SOURCES["/api/sources"]
        API_BACKFILL["/api/backfill"]
        API_NOTIF["/api/notifications"]
        API_AUDIT["/api/audit-log"]
        STORE["In-Memory Store\napp/api/_store.ts"]
    end

    subgraph "Frontend (React + TanStack Query)"
        DASH["Dashboard\nSync Health Overview"]
        RECON["Reconciliation Page\nVariance Table + Drawer"]
        BACK["Backfill Page\nJob Progress Tracker"]
        SRC["Sources Page\nIntegration Management"]
        NOTIF["Notifications Page"]
        AUDIT["Audit Log Page"]
    end

    subgraph "State Management"
        TQ["TanStack Query Cache\nServer State"]
        ZU["Zustand Store\nUI State"]
    end

    subgraph "Simulated Real-Time Layer"
        SOCK_RECON["useReconciliationSocket\n~7s tick interval"]
        SOCK_BACK["useBackfillSocket\n~2.5s tick interval"]
    end

    POS --> API_RECON
    WMS --> API_RECON
    ECOM --> API_RECON
    API_RECON --> STORE
    STORE --> TQ
    TQ --> DASH
    TQ --> RECON
    TQ --> BACK
    TQ --> SRC
    TQ --> NOTIF
    TQ --> AUDIT
    ZU --> DASH
    ZU --> RECON
    ZU --> BACK
    ZU --> SRC
    SOCK_RECON --> TQ
    SOCK_BACK --> TQ
```

### Data Flow — From Sync to Resolution

```mermaid
sequenceDiagram
    participant POS as POS System
    participant WMS as WMS
    participant ECOM as E-Commerce
    participant API as Next.js API Route
    participant STORE as In-Memory Store
    participant CACHE as TanStack Query Cache
    participant SOCKET as useReconciliationSocket
    participant UI as React UI
    participant USER as Ops Team Member

    Note over POS,ECOM: Initial Data Load
    POS->>API: GET /api/reconciliation-items
    WMS->>API: GET /api/reconciliation-items
    ECOM->>API: GET /api/reconciliation-items
    API->>STORE: Read fixtures (POS/WMS/ECOM quantities)
    STORE-->>API: Return items with variances
    API-->>CACHE: Cached via TanStack Query

    Note over SOCKET,CACHE: Simulated Real-Time Updates
    loop Every ~7 seconds
        SOCKET->>CACHE: setQueryData (nudge random item)
        Note right of SOCKET: Picks random pending item\nNudges WMS or E-Commerce\nby ±1-2 units
        SOCKET->>SOCKET: computeVariance() on new quantities
        SOCKET->>SOCKET: classifySeverity() (pct + absolute delta)
        SOCKET->>SOCKET: suggestReason() (ML mock)
        CACHE-->>UI: React re-renders with updated data
        UI-->>USER: Row updates live in the grid
    end

    Note over USER,STORE: Resolution Flow
    USER->>UI: Clicks Resolve on a reconciliation item
    UI->>CACHE: Optimistic removal (row disappears instantly)
    CACHE-->>UI: Row removed from grid
    UI->>API: POST /api/reconciliation-items {ids: [item.id]}
    API->>STORE: Remove item from store
    alt Success (90 percent)
        API-->>UI: 200 OK
        UI->>CACHE: invalidateQueries (refetch confirms removal)
        UI-->>USER: Item resolved toast
    else Failure (10 percent simulated)
        API-->>UI: 500 Error
        UI->>CACHE: Roll back to previous snapshot
        CACHE-->>UI: Row reappears in grid
        UI-->>USER: Failed after 3 attempts - restored toast
    end
```

### Reconciliation Logic — Severity Classification

The system uses a **dual-factor severity model** that considers both percentage variance AND absolute unit difference:

```mermaid
graph TD
    A["Three Source Quantities\nPOS: 42, WMS: 38, E-Com: 40"] --> B["Compute Median\nmedian = 40"]
    B --> C["Find Outlier\nWhich source deviates most?"]
    C --> D{"POS deviates\nby 2 units"}
    C --> E{"WMS deviates\nby 2 units"}
    C --> F{"E-Com deviates\nby 0 units"}
    D --> G["Outlier: POS\nUnit Delta: 2\nVariance %: 5%"]
    G --> H{"Classify Severity"}
    H --> I{"Unit Delta >= 20?"}
    I -->|Yes| J["CRITICAL"]
    I -->|No| K{"Unit Delta >= 10\nOR pct >= 15 AND delta >= 3?"}
    K -->|Yes| L["HIGH"]
    K -->|No| M{"Unit Delta >= 4\nOR pct >= 6 AND delta >= 1?"}
    M -->|Yes| N["MEDIUM"]
    M -->|No| O["LOW"]
```

**Why dual-factor?** A 50% variance on a 4-unit SKU is just 2 units — likely noise. A 5% variance on a 1,000-unit SKU is 50 units — potentially real shrinkage worth hundreds of dollars.

### Optimistic Resolution Flow

When an ops team member resolves an item, the UI uses **optimistic updates** for instant feedback:

```mermaid
stateDiagram-v2
    [*] --> Idle: User opens reconciliation page

    Idle --> OptimisticallyRemoved: User clicks Resolve
    OptimisticallyRemoved --> APIPending: POST /api/reconciliation-items

    state APIPending {
        [*] --> Attempting
        Attempting --> Attempting: Retry (up to 3x)
        Attempting --> Success: 200 OK
        Attempting --> Failure: All retries exhausted
    }

    OptimisticallyRemoved --> Success: API confirms (90%)
    OptimisticallyRemoved --> Failure: API fails (10%)

    Success --> ConfirmedRemoved: invalidateQueries
    Failure --> RolledBack: Restore previous cache
    RolledBack --> Idle: Row reappears

    ConfirmedRemoved --> [*]: Toast: Item resolved
    RolledBack --> [*]: Toast: Failed after 3 attempts
```

### Backfill Job Lifecycle

The backfill system simulates importing historical inventory data from an external system:

```mermaid
stateDiagram-v2
    [*] --> Running: Job started

    Running --> Paused: User clicks Pause
    Paused --> Running: User clicks Resume
    Running --> Cancelled: User clicks Cancel
    Paused --> Cancelled: User clicks Cancel

    Running --> Complete: itemsProcessed >= itemsTotal
    Running --> Failed: Critical error

    state Running {
        [*] --> Processing
        Processing --> Processing: ~250 items / 2.5s tick
        Processing --> Logging: Write batch log entry
        Logging --> Processing
    }

    Complete --> [*]
    Cancelled --> [*]
    Failed --> [*]
```

### State Management Architecture

```mermaid
graph LR
    subgraph "Server State - TanStack Query"
        Q_ITEMS["reconciliation-items\nLive updating via socket"]
        Q_HEALTH["sync-health\nDashboard metrics"]
        Q_SOURCES["sources\nConnected integrations"]
        Q_BACKFILL["backfill\nJob progress"]
        Q_NOTIF["notifications\nAlert feed"]
        Q_AUDIT["audit-log\nAction history"]
    end

    subgraph "UI State - Zustand"
        Z_SEL["Selection\nselectedIds"]
        Z_DRAWER["Drawer\ndrawerItemId"]
        Z_FILTER["Filters\nseverityFilter, searchQuery"]
        Z_THEME["Theme\nlight / dark"]
        Z_CONN["Connection\nconnected / reconnecting"]
        Z_TOAST["Toasts\npushToast / dismissToast"]
        Z_RULES["Reconciliation Rules\nautoResolveThresholdPct"]
    end

    Q_ITEMS -.->|"useReconciliationSocket\nwrites directly"| Q_ITEMS
    Q_BACKFILL -.->|"useBackfillSocket\nwrites directly"| Q_BACKFILL
    Z_SEL --> Z_DRAWER
    Z_SEL --> Z_FILTER
    Z_THEME --> Z_CONN
```

---

## Pages & Features

| Route | Page | Description |
|---|---|---|
| `/` | **Sync Health Dashboard** | Live overview of all connected sources, data quality score, sync activity chart, pending variance summary, and dollar exposure estimate |
| `/reconciliation` | **Reconciliation Table** | Full AG Grid table of all pending variances, sorted by dollar impact. Includes search, severity filters, detail drawer with per-source quantities, ML-suggested reason, assignment, notes, and bulk actions |
| `/backfill` | **Backfill Tracker** | Real-time progress of historical data import — progress bar, stats (records updated, variances found, errors), ETA, activity log, and pause/cancel/retry controls |
| `/sources` | **Source Management** | Configure POS, WMS, and E-Commerce integrations — API keys (masked/reveal/copy/rotate), webhook URLs, sync frequency, rate limits, scopes, and a configurable reconciliation policy panel |
| `/notifications` | **Notifications** | Alert feed with severity-colored icons, deep-links into specific reconciliation items, and mark-as-read |
| `/audit-log` | **Audit Trail** | Searchable log of every action (resolve, bulk action, manual count, source config change) with actor, timestamp, SKU, and outcome |
| `/profile` | **Profile & Settings** | User profile, theme preference (light/dark), and account actions |
| `/login`, `/signup`, `/forgot-password` | **Auth Screens** | Demo auth UI — login checks against a fake credential, shows inline errors |

---

## Architecture Deep Dive

### Simulated Real-Time Layer

Since there's no real WebSocket server, the app uses **`setInterval` hooks** that write directly into the TanStack Query cache — exactly how a real WebSocket `onmessage` handler would:

```mermaid
graph LR
    subgraph "useReconciliationSocket every 7s"
        T1["Pick random\npending item"] --> T2["Nudge WMS or\nE-Com ±1-2 units"]
        T2 --> T3{"Drifted > 20%\nfrom baseline?"}
        T3 -->|Yes| T4["Revert toward\nbaseline"]
        T3 -->|No| T5["Random step"]
        T4 --> T6["computeVariance"]
        T5 --> T6
        T6 --> T7["classifySeverity"]
        T7 --> T8["Write to Query Cache"]
    end

    subgraph "useBackfillSocket every 2.5s"
        B1["Advance itemsProcessed\nby ~200"] --> B2["Update stats"]
        B2 --> B3["Log batch entry"]
        B3 --> B4{"100% done?"}
        B4 -->|Yes| B5["Set status: complete"]
        B4 -->|No| B6["Recalculate ETA"]
    end

    subgraph "Reconnection Simulation"
        R1["Every ~9th tick"] --> R2["Set status:\nreconnecting"]
        R2 --> R3["Wait 1.8s"]
        R3 --> R4["Set status:\nconnected"]
    end
```

**Key design choices:**
- **Mean-reverting drift** — quantities nudge back toward baseline after drifting >20%, preventing unrealistic 175%+ variance percentages
- **Baseline captured lazily** — the first time an item is touched, not eagerly at mount (which would always be `undefined` since queries are async)
- **One severity formula** — `lib/severity.ts` is the single source of truth, used by both fixture data and live simulation

### Mock Backend with Mutable State

```mermaid
graph TD
    subgraph "app/api/_store.ts"
        FIXTURE["JSON Fixtures\ndata/*.json"]
        STORE2["In-Memory Mutable Store"]
        FIXTURE -->|"Loaded at startup"| STORE2
    end

    subgraph "API Routes"
        GET["GET /api/reconciliation-items"]
        POST2["POST /api/reconciliation-items"]
    end

    GET -->|"Read"| STORE2
    POST2 -->|"Write (resolve items)"| STORE2
    POST2 -->|"~10% failure rate\n+ latency"| POST2
```

The `_store.ts` module keeps a **mutable in-memory copy** of the fixture data so that resolving an item actually persists across refetches — unlike a pure stateless route that would just re-read the static JSON.

### Theme System

```mermaid
graph TD
    A["Inline script in head"] -->|"Reads localStorage\nbefore first paint"| B["data-theme attribute"]
    B -->|"No flash on load"| C["CSS Custom Properties"]
    C --> D["Light Theme: --bg: #f8fafc"]
    C --> E["Dark Theme: --bg: #0b1220"]
    F["ThemeToggle"] -->|"Toggle"| G["Update localStorage"]
    G --> H["Update data-theme"]
    H --> C
    I["ThemeSync component"] -->|"Mirrors Zustand\nto data-theme"| H
```

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | File-based routing, API routes, SSR |
| **UI Library** | React 19 | Component rendering, hooks |
| **Language** | TypeScript (strict mode) | Type safety across the entire stack |
| **Server Cache** | TanStack Query v5 | Query caching, optimistic updates, mutations, retries |
| **Client State** | Zustand | Selection, drawer, filters, theme, toasts, connection status |
| **Data Grid** | AG Grid Community 35 | Reconciliation table with sorting, selection, and custom renderers |
| **Charts** | ECharts + echarts-for-react | Sync activity time-series chart |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS with CSS custom property design tokens |
| **Icons** | lucide-react | Inline SVG icons (no icon font) |
| **Fonts** | Inter (sans) + JetBrains Mono (mono) | Loaded via `next/font/google` |

---

## Project Structure

```
stocksync-workbench/
├── app/
│   ├── (auth)/              # Auth pages (login, signup, forgot-password)
│   ├── (dashboard)/         # Main app pages
│   │   ├── page.tsx         # Dashboard — sync health overview
│   │   ├── reconciliation/  # Variance table + detail drawer
│   │   ├── backfill/        # Backfill job progress tracker
│   │   ├── sources/         # Source configuration & management
│   │   ├── notifications/   # Notification feed
│   │   ├── audit-log/       # Audit trail
│   │   └── profile/         # User profile & settings
│   ├── api/                 # Next.js API routes (mock backend)
│   │   ├── _store.ts        # In-memory mutable state
│   │   ├── reconciliation-items/
│   │   ├── sync-health/
│   │   ├── sources/
│   │   ├── backfill/
│   │   ├── notifications/
│   │   └── audit-log/
│   ├── layout.tsx           # Root layout with theme init script
│   ├── providers.tsx        # QueryClientProvider + React Query devtools
│   └── globals.css          # Design tokens (light/dark), AG Grid theme
├── components/
│   ├── backfill/            # ProgressTracker
│   ├── dashboard/           # StatusCard, SyncActivityChart, PendingSummary, ExposureCard
│   ├── reconciliation/      # ReconciliationGrid, DetailDrawer, BulkActionModal
│   ├── shared/              # Header, Footer, ThemeToggle, ThemeSync, StatusPill, HealthBar, etc.
│   └── sources/             # SourceConfigModal, ReconciliationRulesPanel
├── data/                    # JSON fixtures (mock data)
├── hooks/
│   ├── useReconciliationSocket.ts   # Simulated real-time variance updates
│   ├── useBackfillSocket.ts         # Simulated backfill progress
│   ├── useOptimisticResolve.ts      # Optimistic remove-on-resolve + rollback
│   ├── useReconciliationItems.ts    # TanStack Query hook
│   ├── useSyncHealth.ts
│   ├── useSources.ts
│   ├── useNotifications.ts
│   ├── useAuditLog.ts
│   └── useBackfill.ts
├── lib/
│   ├── api.ts               # API client (fetch wrappers)
│   ├── types.ts             # TypeScript interfaces
│   ├── severity.ts          # Variance computation & severity classification
│   └── queryClient.ts       # TanStack Query client config
├── stores/
│   └── useUiStore.ts        # Zustand store for all UI state
├── scripts/
│   └── recompute-fixtures.js  # Recompute fixture data through severity logic
├── .npmrc                   # legacy-peer-deps for Vercel builds
├── tailwind.config.ts
├── next.config.mjs
└── package.json
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Demo credentials:** The login page shows the accepted email/password. Any other credentials show an inline error.

---

## Design System

### Color Tokens

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--bg` | `#f8fafc` | `#0b1220` | Page background |
| `--surface` | `#ffffff` | `#131b2e` | Card/panel background |
| `--surface-alt` | `#f1f5f9` | `#0f172a` | Alternate surface (hover, active) |
| `--border` | `#e2e8f0` | `#27324a` | Borders |
| `--text-primary` | `#0f172a` | `#f1f5f9` | Primary text |
| `--text-secondary` | `#64748b` | `#94a3b8` | Secondary/muted text |
| `--primary` | `#3b82f6` | `#3b82f6` | Primary action color |
| `--status-low` | `#10b981` | `#10b981` | Low severity (green) |
| `--status-medium` | `#f59e0b` | `#f59e0b` | Medium severity (amber) |
| `--status-high` | `#f97316` | `#f97316` | High severity (orange) |
| `--status-critical` | `#ef4444` | `#ef4444` | Critical severity (red) |

### Accessibility

- **Keyboard navigation** — visible focus indicators using `box-shadow` (hugs element shape, unlike `outline` which fights `border-radius`)
- **Reduced motion** — all animations disabled via `prefers-reduced-motion: reduce`
- **Screen reader labels** — icon buttons include `aria-label`, toggle buttons include `aria-pressed`
- **Color contrast** — all text meets WCAG AA against its background in both themes

---

## Production-Readiness Audit

This build went through a detailed production-readiness review. Key bugs found and fixed:

| Issue | Root Cause | Fix |
|---|---|---|
| Resolved items reappeared after refetch | Stateless mock API re-read static JSON | Added in-memory mutable store (`_store.ts`) with POST endpoint |
| Duplicate checkbox columns in AG Grid | Legacy `checkboxSelection` mixed with new `rowSelection` API | Removed legacy colDef, use `rowSelection` object API only |
| Selecting a row also opened its drawer | `onRowClicked` didn't distinguish checkbox from row click | Separated selection and drawer-open handlers |
| Drawer state leaked between items | Local state not keyed to item id | Added `key={item.id}` to force remount on item switch |
| Resolve button showed wrong retry state | Shared mutation instance's `variables` not checked | Added `resolve.variables === item.id` guard |
| Selection bar count went stale | `clearSelection()` only cleared Zustand, not AG Grid | Added `api.deselectAll()` call |
| Mean-reversion never fired | Baseline captured eagerly at mount (always `undefined`) | Captured lazily on first touch per item |
| Theme flashed on load | Default theme only corrected by React effect | Added render-blocking inline script in `<head>` |
| Backfill progress bar frozen | No socket simulation for backfill page | Added `useBackfillSocket` hook |
| Copy buttons never copied | Showed "copied" toast without calling clipboard API | Added `navigator.clipboard.writeText()` |
| Profile dropdown stuck on mobile | Only closed via `onMouseLeave` (no touch events) | Added `pointerdown-outside` listener |

---

## What's Out of Scope (By Design)

Per the project spec, these features are **intentionally mocked** rather than implemented:

- **ML variance classification** — The `suggestedReason` and `confidence` fields are pre-baked into fixture data. In production, this would call an isolation-forest anomaly detector.
- **Real WebSocket server** — Simulated via `setInterval` + TanStack Query cache writes.
- **Kafka/PostgreSQL backend** — The in-memory store stands in for what would be a real database with event sourcing.

These mock boundaries are clearly documented in the code so a production team could swap them for real implementations without changing the frontend.

---

## License

Built as a frontend portfolio project. All rights reserved.
