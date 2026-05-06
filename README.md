# Burger Bong 🍔

A lightweight burger-ordering and kitchen-display app built for a private burger party. Guests order on their phones; the cook watches a live ticket board and marks orders done.

**Stack:** React 19 + Vite — Cloudflare Workers (Hono) — Cloudflare D1 (SQLite) — Cloudflare Pages

---

## How it works

| Route | Who uses it | What it does |
|---|---|---|
| `/order` | Guests (mobile) | Pick a name, choose a burger, submit |
| `/bong`  | Cook (laptop/tablet) | See pending orders, mark them done |

The bong page polls `/api/orders` every 3 seconds — no websockets needed at this scale.

---

## Project structure

```
burger_bong/
├── src/
│   ├── pages/
│   │   ├── order_page.jsx     # Guest order flow
│   │   └── bong_page.jsx      # Kitchen display with polling
│   ├── components/
│   │   ├── burger_card.jsx    # Selectable burger card
│   │   ├── order_form.jsx     # Name input field
│   │   └── bong_ticket.jsx    # Individual order ticket
│   ├── data/
│   │   └── menu.js            # Hardcoded menu (4 burgers)
│   ├── App.jsx                # React Router setup
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles + design system
├── worker/
│   ├── src/
│   │   ├── index.js           # Hono API (all routes)
│   │   └── db.js              # D1 query helpers
│   ├── migrations/
│   │   └── 0001_schema.sql    # DB migration file
│   └── schema.sql             # Standalone schema (for manual apply)
├── public/
│   └── _redirects             # SPA catch-all for Cloudflare Pages
├── wrangler.toml              # Worker + D1 config
├── vite.config.js             # Proxies /api → localhost:8787 in dev
└── .github/workflows/
    └── deploy.yml             # Auto-deploy on push to main
```

---

## API

All routes are under `/api`. The worker validates that `burger` is one of the four known IDs before persisting.

| Method  | Route                    | Description                         |
|---------|--------------------------|-------------------------------------|
| `POST`  | `/api/orders`            | Create order `{ name, burger }`     |
| `GET`   | `/api/orders`            | Get all pending orders (oldest first) |
| `PATCH` | `/api/orders/:id/done`   | Mark an order as done               |

---

## Local development

### 1. Create the D1 database

```bash
wrangler d1 create burger_bong_db
```

Copy the `database_id` from the output into `wrangler.toml`.

### 2. Apply the schema

```bash
npm run db:migrate:local
```

Or manually:

```bash
wrangler d1 execute burger_bong_db --local --file=worker/schema.sql
```

### 3. Install and run

```bash
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Worker API: http://localhost:8787

Vite proxies all `/api` requests to the worker in development, so no CORS issues locally.

---

## Deploy

### GitHub Actions (automatic on push to `main`)

Required GitHub secrets:

| Secret | Where to get it |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare → My Profile → API Tokens |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → right sidebar |
| `VITE_API_URL` | Your worker URL, e.g. `https://burger-bong-api.yourname.workers.dev` |

### Manual deploy

```bash
npm run build
npm run deploy:worker
```

Deploy the frontend by connecting the GitHub repo to a Cloudflare Pages project (build command: `npm run build`, output directory: `dist`). Set `VITE_API_URL` as an environment variable in the Pages project settings.

### Apply schema in production

```bash
wrangler d1 execute burger_bong_db --file=worker/schema.sql
```

---

## Design decisions

**No auth** — this is a private party app. Anyone with the URL can order or view the bong screen.

**Polling over WebSockets** — the bong page fetches every 3 s. Simple, zero infrastructure overhead, perfectly adequate for a party.

**Hardcoded menu** — the 4 burgers live in `src/data/menu.js`. No admin panel needed; changing the menu means editing one file and redeploying.

**Single schema file** — `worker/schema.sql` can be applied directly with `wrangler d1 execute`. The `worker/migrations/` directory exists for compatibility with `wrangler d1 migrations apply` if needed later.

**snake_case everywhere** — files, folders, JS variables, and CSS class suffixes all use snake_case for consistency.

**`VITE_API_URL`** — set this to the full worker URL in production (e.g. `https://burger-bong-api.yourname.workers.dev`). Leave it empty or unset in local dev; Vite's proxy handles it.
