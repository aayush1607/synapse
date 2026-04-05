# Synapse — Technical Architecture

**Version**: 1.0 | **Date**: 2026-04-04
**Summary**: A neuroscience-inspired habit tracker built as a local-first PWA with React + TypeScript.

---

## 1. Recommended Tech Stack

### Core

| Layer            | Choice                        | Justification                                                                                                     |
|------------------|-------------------------------|-------------------------------------------------------------------------------------------------------------------|
| **Bundler**      | Vite 6+                       | Sub-second HMR, native ESM, built-in PWA plugin (`vite-plugin-pwa`). Fastest DX for a small team.                |
| **Framework**    | React 18 + TypeScript 5       | Concurrent rendering for smooth animations during check-in. Strict TS for data model safety.                      |
| **Styling**      | Tailwind CSS 4                | Utility-first for rapid iteration on the dark neon theme. JIT keeps bundle small.                                 |
| **Animation**    | Framer Motion 11              | Declarative gesture support (swipe, long-press) + spring physics for the Synaptic Spark. GPU-accelerated.         |
| **Visualization**| SVG (inline React components) | Neural pathway streaks are low-node-count line art — SVG is ideal. Canvas adds complexity with no perf gain here. |
| **Storage**      | Dexie.js 4 (IndexedDB)       | Promise-based, typed IndexedDB wrapper. Supports live queries (reactive). No server required.                     |
| **PWA**          | vite-plugin-pwa (Workbox)     | Auto-generates service worker + manifest. Precaching for instant load. Background sync hook for future cloud.     |
| **Haptics**      | Navigator Vibration API       | Direct browser API — no library needed. Pattern: `[50, 30, 80]` for the double-thump.                            |
| **Routing**      | React Router 7 (minimal)      | Only 3 routes needed. Could even skip routing entirely, but keeps URL state shareable.                            |
| **Date/Time**    | date-fns 4 (tree-shakeable)   | Only import `startOfDay`, `differenceInCalendarDays`, `format`. Avoids Moment/Luxon bloat.                        |
| **Testing**      | Vitest + Testing Library      | Same Vite pipeline — no config friction. Testing Library enforces accessibility-first queries.                     |
| **Linting**      | ESLint 9 + Prettier           | Flat config. `eslint-plugin-react-hooks` catches stale closures in gesture handlers.                              |

### Intentionally Excluded

| Technology      | Reason                                                                                          |
|-----------------|-------------------------------------------------------------------------------------------------|
| Redux / Zustand | Dexie `useLiveQuery` provides reactive state from IndexedDB directly. Adding a store is indirection with no benefit for this data shape. |
| React Query     | No server. All data is local. React Query's cache/refetch model adds conceptual weight for zero gain. |
| Canvas API      | Neural pathways are low-complexity SVG paths (5-10 nodes). Canvas requires manual hit-testing and accessibility is harder. |
| Next.js / Remix | No SSR needed — this is a client-only PWA. Vite is lighter by an order of magnitude.            |
| Firebase        | Violates local-first principle. Cloud sync is Phase 3 and should be provider-agnostic.           |
| Chakra / MUI    | Component libraries add 50-100KB+ and fight the custom neon dark theme. Tailwind is sufficient.  |

---

## 2. Folder / File Structure

```
synapse/
├── public/
│   ├── icons/                    # PWA icons (192x192, 512x512, maskable)
│   ├── manifest.webmanifest      # PWA manifest (generated/overridden by vite-plugin-pwa)
│   └── robots.txt
├── src/
│   ├── main.tsx                  # React root + service worker registration
│   ├── App.tsx                   # Route shell + theme provider
│   ├── vite-env.d.ts
│   │
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx          # Main screen — renders HabitCard list
│   │   │   ├── HabitCard.tsx          # Single habit — swipe/long-press to complete
│   │   │   └── EmptyState.tsx         # Shown when no habits configured
│   │   ├── spark/
│   │   │   ├── SynapticSpark.tsx      # Burst animation overlay (Framer Motion)
│   │   │   └── spark-particles.ts     # Particle config / spring constants
│   │   ├── pathways/
│   │   │   ├── NeuralPathway.tsx      # SVG streak visualization for one habit
│   │   │   ├── PathwayDashboard.tsx   # All pathways view
│   │   │   └── pathway-math.ts        # Thickness, fraying, branching calculations
│   │   ├── heatmap/
│   │   │   └── WeeklyHeatmap.tsx      # Weekly success % grid
│   │   ├── onboarding/
│   │   │   ├── OnboardingFlow.tsx     # 2-screen wizard
│   │   │   └── WhyInput.tsx           # "Define your Why" screen
│   │   ├── habits/
│   │   │   ├── HabitEditor.tsx        # Add / edit habit (minimal form)
│   │   │   └── HabitList.tsx          # Manage active/archived habits
│   │   └── shared/
│   │       ├── Button.tsx
│   │       ├── SwipeableCard.tsx      # Reusable swipe gesture wrapper
│   │       ├── LongPressable.tsx      # Reusable long-press gesture wrapper
│   │       └── PageShell.tsx          # Layout wrapper with safe-area insets
│   │
│   ├── db/
│   │   ├── database.ts               # Dexie database class + schema versions
│   │   ├── habits.ts                  # Habit CRUD operations
│   │   ├── completions.ts            # Completion log operations
│   │   └── preferences.ts            # User preferences operations
│   │
│   ├── hooks/
│   │   ├── useHabits.ts              # Live query: active habits for today
│   │   ├── useCompletions.ts         # Live query: completions for a date range
│   │   ├── useStreak.ts              # Derived: streak length, fraying state, buffer status
│   │   ├── useHaptics.ts             # Vibration API wrapper with feature detection
│   │   ├── useSwipeGesture.ts        # Pointer event handler for swipe-to-complete
│   │   └── useLongPress.ts           # Pointer event handler for long-press-to-complete
│   │
│   ├── lib/
│   │   ├── streak-engine.ts          # Pure functions: streak calculation, emergency buffer logic
│   │   ├── notification-scheduler.ts # Variable-time notification scheduling
│   │   ├── haptic-patterns.ts        # Vibration patterns (double-thump, etc.)
│   │   └── constants.ts              # App-wide constants (max habits, buffer rules, etc.)
│   │
│   ├── types/
│   │   └── models.ts                 # All TypeScript interfaces (see Section 3)
│   │
│   ├── styles/
│   │   ├── theme.ts                  # Neon color tokens, glow effects
│   │   └── tailwind.css              # Tailwind directives + custom utilities
│   │
│   └── sw/
│       └── service-worker.ts         # Custom SW extensions (notification handling)
│
├── index.html
├── tailwind.config.ts
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── package.json
├── .eslintrc.cjs
├── .prettierrc
├── ARCHITECTURE.md                    # This file
└── README.md
```

**Key structural decisions:**
- `db/` isolates all IndexedDB operations behind typed functions — components never call Dexie directly.
- `lib/` contains pure, testable business logic (streak math, notification scheduling) with zero React dependencies.
- `hooks/` is the bridge: each hook composes `db/` queries with `lib/` logic and exposes reactive state.
- `types/models.ts` is the single source of truth for all data shapes.

---

## 3. Data Model

```typescript
// src/types/models.ts

// ─── Core Entities ───────────────────────────────────────────────

/** A habit the user is tracking. */
export interface Habit {
  /** Auto-increment primary key. */
  id?: number;

  /** User-chosen label, e.g. "Meditate". Max 30 chars enforced in UI. */
  name: string;

  /** The user's stated motivation — captured during onboarding or edit. */
  why: string;

  /** Emoji or icon identifier for the habit card. */
  icon: string;

  /** Position in the dashboard (0-indexed). Supports drag-to-reorder. */
  sortOrder: number;

  /** Active habits appear on the dashboard. Archived ones are hidden but data preserved. */
  status: "active" | "archived";

  /** ISO 8601 date string (YYYY-MM-DD) of when the habit was created. */
  createdAt: string;

  /** ISO 8601 date string of when the habit was archived, if applicable. */
  archivedAt?: string;
}

/** A single completion event — one per habit per day (binary). */
export interface Completion {
  /** Auto-increment primary key. */
  id?: number;

  /** Foreign key to Habit.id. */
  habitId: number;

  /** ISO 8601 date string (YYYY-MM-DD). Indexed for range queries. */
  date: string;

  /** ISO 8601 datetime string. Used for analytics, not streak logic. */
  completedAt: string;
}

// ─── Derived / Computed (not stored — calculated from Completions) ─────

/** Streak state for a single habit, computed by streak-engine.ts */
export interface StreakState {
  /** The habit this streak belongs to. */
  habitId: number;

  /** Current consecutive-day count (including buffer days). */
  currentLength: number;

  /** Longest streak ever achieved for this habit. */
  longestLength: number;

  /** Whether the emergency buffer is currently active (missed yesterday, can recover today). */
  bufferActive: boolean;

  /** Whether the emergency buffer was already used in this streak cycle. */
  bufferUsed: boolean;

  /**
   * Visual "strength" of the neural pathway: 0.0 (new) to 1.0 (strong).
   * Drives SVG stroke-width and opacity.
   *
   * Formula: min(1.0, currentLength / 66)
   * Rationale: 66 days is the median habit formation time (Lally et al., 2010).
   */
  strength: number;

  /**
   * Fraying level: 0.0 (solid) to 1.0 (nearly dissolved).
   * Increases when buffer is active. Resets when habit is completed.
   * Drives SVG dash-array and noise displacement.
   */
  fraying: number;

  /** Date of the most recent completion in this streak. */
  lastCompletedDate: string | null;
}

// ─── Pathway Visualization ─────────────────────────────────────

/** A point along the neural pathway SVG. */
export interface PathwayNode {
  x: number;
  y: number;
}

/** Full visual state for rendering one neural pathway. */
export interface PathwayVisual {
  habitId: number;
  /** Cubic bezier control points for the main trunk. */
  nodes: PathwayNode[];
  /** Stroke width derived from StreakState.strength (1px to 6px). */
  strokeWidth: number;
  /** Dash array for fraying effect. Empty array = solid line. */
  dashArray: number[];
  /** Glow intensity (CSS filter blur radius in px). */
  glowRadius: number;
  /** Neon color from the habit's assigned palette slot. */
  color: string;
}

// ─── User Preferences ──────────────────────────────────────────

export interface UserPreferences {
  /** Singleton row — always id=1. */
  id?: number;

  /** Whether onboarding has been completed. */
  onboardingComplete: boolean;

  /** Notification permission state as known to the app. */
  notificationsEnabled: boolean;

  /** Earliest hour (0-23) for variable notifications. Default: 8. */
  notificationWindowStart: number;

  /** Latest hour (0-23) for variable notifications. Default: 21. */
  notificationWindowEnd: number;

  /** Theme override. Currently only 'dark' is implemented. */
  theme: "dark";

  /** User's global "Why" statement from onboarding. */
  globalWhy: string;

  /** ISO 8601 datetime of first app launch. */
  installedAt: string;
}

// ─── Notification Scheduling ────────────────────────────────────

/** A scheduled notification (stored so we can cancel/reschedule). */
export interface ScheduledNotification {
  id?: number;
  habitId: number;
  /** ISO 8601 datetime when the notification should fire. */
  scheduledFor: string;
  /** Whether this notification has been delivered. */
  delivered: boolean;
}

// ─── Heatmap ────────────────────────────────────────────────────

/** Pre-computed weekly summary for the heatmap view. */
export interface WeekSummary {
  /** ISO week start date (Monday). */
  weekStart: string;
  /** Number of possible completions (active habits x days). */
  possible: number;
  /** Number of actual completions. */
  actual: number;
  /** actual / possible, 0.0 to 1.0. */
  rate: number;
}
```

### Dexie Schema

```typescript
// src/db/database.ts
import Dexie, { type EntityTable } from "dexie";
import type { Habit, Completion, UserPreferences, ScheduledNotification } from "../types/models";

export class SynapseDB extends Dexie {
  habits!: EntityTable<Habit, "id">;
  completions!: EntityTable<Completion, "id">;
  preferences!: EntityTable<UserPreferences, "id">;
  notifications!: EntityTable<ScheduledNotification, "id">;

  constructor() {
    super("synapse");

    this.version(1).stores({
      // Only indexed/searchable fields listed. All fields are stored.
      habits: "++id, status, sortOrder",
      completions: "++id, habitId, date, [habitId+date]",
      preferences: "++id",
      notifications: "++id, habitId, scheduledFor, delivered",
    });
  }
}

export const db = new SynapseDB();
```

**Index design rationale:**
- `[habitId+date]` compound index on `completions` is the critical query: "did user complete habit X on date Y?" This is the hot path for both dashboard rendering and streak calculation.
- `status` index on `habits` supports the `where({ status: 'active' })` query that powers the dashboard.
- `scheduledFor` on notifications enables efficient "what's due in the next hour?" queries.

---

## 4. Component Hierarchy

```
App
├── OnboardingFlow                    (conditional: shown if !prefs.onboardingComplete)
│   ├── Screen 1: Welcome + "Define Your Why"
│   │   └── WhyInput
│   └── Screen 2: Add 1-3 Habits
│       └── HabitEditor (inline)
│
├── PageShell                         (safe-area insets, dark theme wrapper)
│   ├── Dashboard                     (default route: "/")
│   │   ├── HabitCard[]               (3-5 cards, each swipeable/long-pressable)
│   │   │   ├── SwipeableCard         (gesture layer)
│   │   │   │   └── LongPressable     (gesture layer)
│   │   │   │       └── Card Content  (icon, name, streak badge)
│   │   │   └── SynapticSpark        (overlay, rendered on completion via portal)
│   │   ├── EmptyState                (when no active habits)
│   │   └── Mini Pathway Preview      (small inline streak indicator per card)
│   │
│   ├── PathwayDashboard              (route: "/pathways")
│   │   └── NeuralPathway[]           (one SVG per active habit)
│   │
│   ├── WeeklyHeatmap                 (route: "/stats")
│   │   └── HeatmapGrid
│   │
│   └── HabitList                     (route: "/habits")
│       └── HabitEditor               (add/edit/archive)
│
└── BottomNav                         (fixed: Dashboard | Pathways | Stats | Habits)
```

### Data Flow

```
┌──────────────────────────────────────────────────────┐
│                    IndexedDB (Dexie)                  │
│  ┌──────────┐  ┌─────────────┐  ┌───────────────┐   │
│  │  habits   │  │ completions │  │  preferences  │   │
│  └────┬─────┘  └──────┬──────┘  └───────┬───────┘   │
└───────┼────────────────┼────────────────┼────────────┘
        │                │                │
   useLiveQuery     useLiveQuery     useLiveQuery
        │                │                │
   ┌────▼─────┐    ┌─────▼──────┐   ┌────▼─────┐
   │useHabits │    │useCompletions│  │usePrefs  │
   └────┬─────┘    └─────┬──────┘   └──────────┘
        │                │
        └───────┬────────┘
                │
         ┌──────▼──────┐
         │  useStreak   │  ← calls streak-engine.ts (pure functions)
         └──────┬──────┘
                │
    ┌───────────┼───────────────┐
    ▼           ▼               ▼
HabitCard  NeuralPathway  WeeklyHeatmap
    │
    ▼ (on completion)
    ├── db.completions.add(...)   ← write to IndexedDB
    ├── useHaptics().fire()       ← Vibration API
    └── <SynapticSpark />         ← Framer Motion overlay
```

**Key points:**
- Dexie's `useLiveQuery` provides reactive subscriptions. When a completion is written, all consuming components re-render automatically. No manual state management, no event bus, no Redux.
- `streak-engine.ts` is a pure function module. It takes an array of `Completion` records and returns `StreakState`. This is trivially unit-testable with no mocking.
- The Synaptic Spark is rendered via a React portal to escape the card's overflow clipping.

---

## 5. Key Architectural Decisions & Trade-offs

### Decision 1: SVG over Canvas for Neural Pathways

**Choice**: Inline SVG rendered as React components.

**Rationale**: The neural pathway visualization involves 5-10 bezier curves with variable stroke-width and dash-array. This is well within SVG's performance sweet spot. SVG gives us:
- Native accessibility (each path can carry `aria-label`)
- CSS transitions for fraying/strengthening animations
- No pixel-density headaches — resolution-independent
- React component composition — a `<NeuralPathway />` is just JSX

**Trade-off**: If we ever need 100+ animated particles simultaneously (e.g., a "neural network" background), we would need a Canvas layer for that specific effect. The Synaptic Spark particle burst is small enough (20-30 particles, 500ms duration) that Framer Motion handles it fine.

### Decision 2: Computed Streaks (not stored)

**Choice**: Streaks are calculated on-the-fly from the `completions` table, not stored as a separate entity.

**Rationale**:
- Single source of truth — no sync bugs between completions and streak records.
- The computation is O(n) where n = number of completions for one habit. Even for a 2-year daily habit, n = 730. This runs in under 1ms.
- Emergency buffer logic is cleaner when computed: "is there a gap of exactly 1 day in the last 2 entries?"

**Trade-off**: If we add cloud sync later, streak calculation must run client-side after sync completes. This is fine — the sync payload is completions, and streak is derived.

### Decision 3: No Global State Manager

**Choice**: Dexie `useLiveQuery` hooks as the sole reactive state layer.

**Rationale**: This app has exactly one data flow: IndexedDB -> hooks -> components. There is no server state, no optimistic updates against a remote API, no cross-cutting auth state. A state manager would add:
- A synchronization problem (keep store in sync with IndexedDB)
- Bundle size (~5-15KB)
- Conceptual overhead for contributors

**Trade-off**: If we add cloud sync (Phase 3), we will need to handle conflict resolution. At that point, we may introduce a thin sync coordinator — but it would sit between Dexie and the remote API, not as a React state manager.

### Decision 4: Binary Completions Only

**Choice**: A habit is either done or not done for a given day. No partial credit, no quantities, no durations.

**Rationale**: This is a core UX principle, not a technical shortcut. Binary reduces decision fatigue and supports the "under 5 seconds" goal. The data model enforces this: a `Completion` record exists or it doesn't. There is no `progress` field.

**Trade-off**: Users who want "drink 8 glasses of water" must reframe as "did I drink enough water today? Yes/No." This is intentional — the neuroscience literature (Clear, 2018; Fogg, 2019) supports identity-based binary tracking over quantity tracking for habit formation.

### Decision 5: Emergency Buffer — "Never Miss Twice"

**Choice**: One rest day is tolerated per streak cycle. The visual pathway shows "fraying" (dashed line, reduced glow) but does not break.

**Implementation**:
```
Day 1: Complete  → streak = 1, fraying = 0.0
Day 2: Complete  → streak = 2, fraying = 0.0
Day 3: MISSED    → streak = 2 (held), fraying = 0.6, bufferActive = true
Day 4: Complete  → streak = 3, fraying = 0.0, bufferUsed = true
Day 5: MISSED    → streak BROKEN (buffer already used this cycle)
```

**Trade-off**: This is more forgiving than most habit trackers, which aligns with the neuroscience framing (resilience over perfection). The risk is that users game the system with alternating days. Mitigation: the fraying visual is designed to feel uncomfortable — it should motivate recovery, not complacency.

### Decision 6: Variable Notification Timing

**Choice**: Notifications are scheduled at random times within the user's configured window, with a minimum 2-hour gap from the previous day's notification time.

**Rationale**: Fixed-time notifications habituate (the brain stops noticing them). Variable-ratio reinforcement schedules are more effective at maintaining attention (Skinner, 1957; adapted for notification design by Eyal, 2014).

**Implementation**: The `notification-scheduler.ts` module runs once daily (on app open or via the service worker's `periodicsync` event). It picks a random time within `[windowStart, windowEnd]` constrained by `|newTime - yesterdayTime| >= 2 hours`.

**Trade-off**: Users who prefer predictable reminders may find this frustrating. We could add a "fixed time" toggle in preferences as a Phase 2 escape hatch.

### Decision 7: Local-First Architecture

**Choice**: All data lives in IndexedDB. No server, no account, no login.

**Rationale**:
- Zero friction onboarding (no signup wall)
- Works offline by default (PWA + local storage)
- Privacy by design — no data leaves the device
- Simplifies the architecture enormously — no auth, no API layer, no CORS, no rate limiting

**Trade-off**: No cross-device sync, no data backup (beyond what the browser provides). Phase 3 introduces optional cloud sync, which will require:
- A sync protocol (CRDTs or last-write-wins with vector clocks)
- An auth layer (likely passkey/WebAuthn for passwordless)
- A backend (likely Cloudflare Workers + D1 for cost efficiency)

---

## 6. Phased Implementation Plan

### Phase 1: Core Loop (Week 1-2)
> Goal: A user can add a habit, see it on the dashboard, complete it, and see the streak increment.

| Task                          | Details                                                         |
|-------------------------------|-----------------------------------------------------------------|
| Project scaffolding           | Vite + React + TS + Tailwind + ESLint + Prettier                |
| PWA setup                     | `vite-plugin-pwa`, manifest, icons, service worker registration |
| Dexie database + schema       | `database.ts`, `habits.ts`, `completions.ts`, `preferences.ts` |
| Data model types              | `models.ts` — all interfaces                                   |
| Dashboard + HabitCard         | Render active habits, tap to complete                           |
| Streak engine                 | `streak-engine.ts` — pure function, unit tested                 |
| Emergency buffer logic        | Integrated into streak engine, unit tested                      |
| Haptic feedback               | `useHaptics` hook, double-thump pattern                         |
| Dark theme                    | Tailwind config with neon color tokens, global CSS              |
| Basic completion flow         | Tap card -> write completion -> update streak badge             |

**Exit criteria**: User can install PWA, add habits, complete them, see streak count. Works offline. Under 5 seconds from open to check-in.

### Phase 2: Visual Polish + Gamification (Week 3-4)
> Goal: The app feels rewarding and looks distinctive.

| Task                          | Details                                                          |
|-------------------------------|------------------------------------------------------------------|
| Synaptic Spark animation      | Framer Motion particle burst on completion                       |
| Neural Pathway visualization  | SVG streak paths with strength/fraying                           |
| Swipe-to-complete gesture     | Horizontal swipe on HabitCard                                    |
| Long-press-to-complete        | Alternative gesture for accessibility                            |
| Onboarding flow               | 2-screen wizard: Why + Add Habits                                |
| Weekly heatmap                 | Success rate grid                                                |
| Bottom navigation              | Dashboard / Pathways / Stats / Habits                           |
| Habit management               | Add, edit, reorder (drag), archive                              |

**Exit criteria**: Full UI complete. Animations run at 60fps. Pathway visualization renders correctly for streaks of 1-100+ days.

### Phase 3: Notifications + Refinement (Week 5-6)
> Goal: The app proactively nudges users and handles edge cases.

| Task                          | Details                                                          |
|-------------------------------|------------------------------------------------------------------|
| Notification permission flow  | Request with context ("we'll remind you at varying times")       |
| Variable notification scheduler| `notification-scheduler.ts` + service worker push               |
| Periodic background sync      | Reschedule notifications even when app is closed                 |
| Habit archiving UX            | Archive instead of delete, with confirmation                     |
| Error boundaries              | Graceful fallback for IndexedDB failures                         |
| Performance audit             | Lighthouse PWA audit, bundle analysis, LCP optimization          |
| Accessibility audit           | Screen reader testing, focus management, reduced-motion support   |

**Exit criteria**: Notifications fire reliably. Lighthouse PWA score 95+. WCAG 2.1 AA compliance.

### Phase 4: Cloud Sync (Future — not in initial scope)
> Goal: Optional cross-device sync without compromising local-first architecture.

| Task                          | Details                                                          |
|-------------------------------|------------------------------------------------------------------|
| Auth (WebAuthn/Passkey)       | Passwordless, device-native                                      |
| Sync protocol                 | CRDT-based merge for completions (commutative — add-only set)    |
| Backend                       | Cloudflare Workers + D1 (SQLite at the edge)                     |
| Conflict resolution           | Last-write-wins for preferences, union-merge for completions     |
| Export/import                  | JSON export for data portability                                 |

---

## 7. Performance Budget

| Metric                  | Target        | Enforcement                                    |
|-------------------------|---------------|------------------------------------------------|
| JS bundle (gzipped)     | < 80KB        | `vite-bundle-analyzer` in CI                   |
| First Contentful Paint  | < 1.0s        | Lighthouse CI                                  |
| Time to Interactive     | < 1.5s        | Lighthouse CI                                  |
| Time to check-in        | < 5.0s        | Manual test: cold open to completion confirmed |
| Animation frame rate    | 60fps         | Chrome DevTools Performance panel              |
| IndexedDB query (hot)   | < 5ms         | `performance.mark()` instrumentation           |
| Service worker cache    | < 2MB         | Workbox config `maximumFileSizeToCacheInBytes`  |

### How "under 5 seconds" is achieved

1. **PWA precaching**: The service worker caches the entire app shell. Return visits load from cache — zero network dependency.
2. **Minimal JS**: No state library, no component library, no heavy dependencies. The critical path is: render Dashboard -> query 3-5 active habits from IndexedDB -> render 3-5 cards.
3. **IndexedDB is fast**: A compound index query `completions.where({ habitId, date })` returns in under 1ms for typical data volumes.
4. **No navigation**: The dashboard IS the app. One tap/swipe completes a habit. No drill-down, no sub-menus, no modals in the critical path.
5. **Deferred non-critical work**: Streak calculation, pathway rendering, and heatmap computation happen after the dashboard cards are visible (via `useEffect` or `startTransition`).

---

## 8. Neon Dark Theme Specification

```typescript
// src/styles/theme.ts
export const theme = {
  colors: {
    // Backgrounds
    bgPrimary:   "#0A0A0F",    // Near-black with blue undertone
    bgCard:      "#12121A",    // Slightly lifted card surface
    bgCardHover: "#1A1A26",    // Card hover / active state

    // Neon accents (one per habit slot, cycling)
    neon: [
      "#00F0FF",  // Cyan (electric blue)
      "#BF00FF",  // Violet
      "#00FF94",  // Mint green
      "#FF006E",  // Hot pink
      "#FFB800",  // Amber
    ],

    // Semantic
    textPrimary:   "#E8E8F0",  // Off-white
    textSecondary: "#6B6B80",  // Muted
    textMuted:     "#3A3A4A",  // Very dim
    success:       "#00FF94",  // Completion confirmed
    warning:       "#FFB800",  // Buffer active / fraying
    danger:        "#FF006E",  // Streak broken

    // Glow
    glowCyan:   "0 0 20px rgba(0, 240, 255, 0.4)",
    glowViolet: "0 0 20px rgba(191, 0, 255, 0.4)",
  },

  // Haptic patterns (milliseconds: vibrate, pause, vibrate, ...)
  haptics: {
    complete:   [50, 30, 80],         // Double-thump: short, pause, strong
    streakMilestone: [30, 20, 30, 20, 80],  // Triple-tap + strong
    error:      [200],                 // Single long buzz
  },
} as const;
```

---

## Appendix A: Streak Engine — Core Algorithm

```typescript
// src/lib/streak-engine.ts (simplified)

import { differenceInCalendarDays, parseISO } from "date-fns";
import type { Completion, StreakState } from "../types/models";

const HABIT_FORMATION_DAYS = 66; // Lally et al., 2010

export function calculateStreak(
  habitId: number,
  completions: Completion[], // sorted by date DESC
  today: string              // ISO date, injected for testability
): StreakState {
  if (completions.length === 0) {
    return {
      habitId,
      currentLength: 0,
      longestLength: 0,
      bufferActive: false,
      bufferUsed: false,
      strength: 0,
      fraying: 0,
      lastCompletedDate: null,
    };
  }

  let streak = 0;
  let bufferActive = false;
  let bufferUsed = false;
  let fraying = 0;

  const todayDate = parseISO(today);
  let cursor = todayDate;

  for (let i = 0; i < completions.length; i++) {
    const completionDate = parseISO(completions[i].date);
    const gap = differenceInCalendarDays(cursor, completionDate);

    if (gap === 0) {
      // Completed on this day
      streak++;
      cursor = parseISO(completions[i].date);
      // Move cursor to previous day for next iteration
      cursor = new Date(cursor.getTime() - 86400000);
    } else if (gap === 1 && !bufferUsed) {
      // One day gap — use emergency buffer
      bufferActive = true;
      bufferUsed = true;
      fraying = 0.6;
      // Don't increment streak, but don't break it either
      // Re-check this completion on the next iteration
      cursor = new Date(cursor.getTime() - 86400000);
      i--; // Re-examine this completion
    } else {
      // Gap too large or buffer already used — streak breaks
      break;
    }
  }

  // Check if today is not yet completed — adjust buffer state
  const lastCompleted = completions[0].date;
  const daysSinceLast = differenceInCalendarDays(todayDate, parseISO(lastCompleted));

  if (daysSinceLast === 1 && !bufferUsed) {
    bufferActive = true;
    fraying = 0.6;
  } else if (daysSinceLast > 1) {
    if (daysSinceLast === 2 && bufferUsed) {
      // Buffer was used and another day missed — streak is broken
      streak = 0;
      fraying = 1.0;
    }
  }

  // Calculate all-time longest (would scan all completions in production)
  const longestLength = streak; // Simplified — full impl tracks historical max

  return {
    habitId,
    currentLength: streak,
    longestLength,
    bufferActive,
    bufferUsed,
    strength: Math.min(1.0, streak / HABIT_FORMATION_DAYS),
    fraying,
    lastCompletedDate: completions[0]?.date ?? null,
  };
}
```
