# Naadi Election Dashboard

> A real-time Tamil Nadu 2026 election results broadcast dashboard built for YouTube Live streams, powered by React, Supabase, and the Claude AI API.

---

## Overview

Naadi Election Dashboard is a full-stack broadcast graphics system designed to display live Tamil Nadu Legislative Assembly 2026 election results on YouTube. It is built to be used as a **browser source in OBS Studio**, with each panel (top bar, left panel, center view, bottom bar) served on its own route so streamers can compose them independently in their scene layout.

Beyond live results, the dashboard includes a suite of standalone **YouTube Shorts-optimized pages** for publishing election analysis content — including an alliance seat comparison, a "What If" scenario explorer, an SVG parliament semicircle chart, and a Tamil Nadu Cabinet minister list.

Results data is sourced from the Election Commission of India (ECI) website. A broadcaster pastes the raw ECI text into the admin panel, and **Claude AI parses it automatically** into structured data that is stored in Supabase and pushed to all connected dashboards in real time.

---

## Core Features

- **Live OBS Broadcast Panels** — Four composable panels (top ticker, left scoreboard, center view, bottom bar) served on separate routes for flexible OBS scene building
- **Real-Time Results** — Supabase Realtime subscriptions push seat count updates to all viewers instantly, with a 5-second polling fallback
- **Claude AI Data Parser** — Paste raw ECI website text; Claude Haiku parses it into structured constituency-level JSON and bulk-upserts it to Supabase in one click
- **Alliance & What-If Analysis** — Side-by-side alliance seat totals with a toggle to model alternative coalition scenarios (e.g., parties switching alliances)
- **Parliament Dot Chart** — Accurate SVG semicircle of all 234 Tamil Nadu assembly seats, colored by alliance or individual party, with live seat counts and annotated special-case dots
- **Cabinet Minister Page** — YouTube Shorts-formatted (1080×1920) minister roster with photo, portfolio, constituency, and party badge — pre-populated from Wikipedia data
- **Admin Panel** — Password-protected control panel for updating party leader photos, constituency results, tally overrides, and all visual settings
- **Animated Seat Counters** — Smooth number roll-up animations on seat count changes across all views
- **Multi-font & Theming** — Admin-configurable font family and size scales across all panels

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Create React App |
| Real-time DB | Supabase (PostgreSQL + Realtime) |
| AI / Parsing | Claude Haiku (`claude-haiku-4-5-20251001`) via Anthropic API |
| Animations | Framer Motion |
| Charts | Custom SVG (parliament semicircle), inline React |
| Styling | Inline React styles (no CSS framework) |
| Deployment | Vercel |
| OBS Integration | Browser Source (each route = one panel) |

---

## Claude API Integration

The Claude API is used in **three places** inside the admin panel (`src/Admin.jsx`), all calling `claude-haiku-4-5-20251001`:

### 1. Constituency-Level ECI Data Parser
The broadcaster copies raw results text from the ECI website and pastes it into the admin panel. Claude extracts each constituency's leading party, lead margin, and result status, returning a structured JSON array. The app then bulk-upserts those records into the `constituencies` Supabase table.

```
Raw ECI text → Claude Haiku → JSON array → Supabase upsert → Live dashboard update
```

### 2. Overall Tally Parser
For the top-level seat tally (won + leading per party), the broadcaster pastes ECI aggregate data. Claude normalises party names (e.g., "திமுக" → "DMK+") and returns total won/leading counts per party.

### 3. VIP Candidate Result Parser
For tracking results of named VIP candidates (Chief Minister, party presidents, etc.), Claude parses candidate-level text into structured records keyed by constituency name.

**Model choice:** Haiku is used for its low latency and cost — these are structured extraction tasks with deterministic output formats, not open-ended generation.

---

## Dashboard Routes

| Route | Purpose | Format |
|---|---|---|
| `/` | Full dashboard (alliance mode) | OBS |
| `/top` | Top ticker bar | OBS panel |
| `/left` | Left scoreboard panel | OBS panel |
| `/center` | Center rotating view | OBS panel |
| `/bottom` | Bottom results ticker | OBS panel |
| `/admin` | Admin control panel | Web |
| `/winners` | Individual party seat winners | Fullscreen |
| `/partywise` | Party-wise seat breakdown | Fullscreen |
| `/alliance` | Alliance seat comparison | YouTube Short |
| `/whatif` | What-if coalition scenario | YouTube Short |
| `/dot` | Parliament semicircle dot chart | YouTube Short |
| `/minister` | Cabinet minister roster | YouTube Short |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project with the following tables:
  - `constituencies` — 234 TN constituency records
  - `overall_tally` — per-party won/leading counts
  - `settings` — key-value store for admin-configurable values
- An [Anthropic API key](https://console.anthropic.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/naadipulse/naadi-dashboard.git
cd naadi-dashboard

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Fill in your values (see Environment Variables section below)

# Start the development server
npm start
```

The app will open at `http://localhost:3000`.

### Supabase Table Schema

```sql
-- Constituencies table
create table constituencies (
  id serial primary key,
  name text,
  name_tamil text,
  leading_party text,
  lead_margin integer default 0,
  status text default 'pending',
  won integer default 0,
  updated_at timestamptz default now()
);

-- Overall tally table
create table overall_tally (
  party text primary key,
  won integer default 0,
  leadingg integer default 0,
  vote_share numeric default 0
);

-- Settings key-value store
create table settings (
  key text primary key,
  value text
);
```

Enable **Realtime** on all three tables in the Supabase dashboard.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in these values:

```env
# Supabase — from supabase.com → Project → Settings → API
REACT_APP_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
REACT_APP_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE

# Admin panel password
REACT_APP_ADMIN_PASSWORD=your_secure_password

# Anthropic API key — from console.anthropic.com
REACT_APP_ANTHROPIC_KEY=sk-ant-...
```

> **Note:** The Anthropic key is used client-side with the `anthropic-dangerous-direct-browser-access` header. This is acceptable for a private broadcast tool but should not be exposed in a public-facing production app.

---

## Deployment

The app is deployed on **Vercel**. To deploy your own instance:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard or via CLI:
vercel env add REACT_APP_SUPABASE_URL
vercel env add REACT_APP_SUPABASE_ANON_KEY
vercel env add REACT_APP_ADMIN_PASSWORD
vercel env add REACT_APP_ANTHROPIC_KEY
```

Vercel auto-deploys on every push to `main`.

---

## Usage with OBS

1. Add a **Browser Source** for each panel in OBS:
   - Top bar: `https://your-app.vercel.app/top` — Height: 120px
   - Left panel: `https://your-app.vercel.app/left` — Width: 400px
   - Center: `https://your-app.vercel.app/center`
   - Bottom bar: `https://your-app.vercel.app/bottom` — Height: 120px
2. Set each browser source background to **transparent**
3. Open `/admin` in a separate browser tab to push live updates
4. Paste ECI data → click **Parse with Claude** → all panels update in real time

---

## Known Limitations

- **Client-side API key** — The Anthropic API key is sent from the browser. Suitable for a private/internal broadcast tool; for public deployment, move the Claude calls to a backend serverless function.
- **ECI data format dependency** — The Claude prompts are tuned for the ECI 2026 website's specific text format. Format changes may require prompt updates.
- **234 TN constituencies only** — The constituency database is seeded for Tamil Nadu; adapting for another state requires a new seed and updated party/alliance configs.
- **No authentication** — The admin panel is protected only by a client-side password check. For production use, add proper auth (Supabase Auth recommended).
- **OBS browser source caching** — Occasionally OBS caches the browser source; use the **Refresh** option in OBS if panels stop updating.

---

## Project Structure

```
src/
├── App.jsx            # All page components + routing
├── shared.jsx         # Hooks (useSettings, useTally), party configs, AnimNum
├── Admin.jsx          # Admin panel with Claude-powered data parsers
├── TopBar.jsx         # OBS top ticker component
├── LeftPanel.jsx      # OBS left scoreboard component
├── BottomBar.jsx      # OBS bottom ticker component
├── CenterViews.jsx    # OBS center rotating views (video/parliament/flash)
├── RightPanel.jsx     # OBS right panel component
└── supabaseClient.js  # Supabase client initialisation
```

---

## License

MIT — free to use, adapt, and build upon for your own election coverage projects.

---

_Built for NaadiPulse Tamil YouTube channel · [@naadipulse](https://youtube.com/@naadipulse)_
