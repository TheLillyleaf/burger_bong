# cf-worker-react-template

Scaffolding template for React + Cloudflare Workers projects.

**Stack:** React 19 + Vite — Cloudflare Workers + Hono — Cloudflare D1 (SQLite) — Cloudflare Pages

---

## Start a new project

### 1. Copy the template

```bash
cp -r cf-worker-react-template my-new-project
cd my-new-project
```

### 2. Rename the app

Find and replace `my-app` with your project name across all files:

```bash
grep -rl "my-app" . --include="*.json" --include="*.toml" --include="*.yml" --include="*.jsx" --include="*.js" | xargs sed -i 's/my-app/your-project-name/g'
```

### 3. Create the D1 database

```bash
wrangler d1 create your-project-name-db
```

Copy the `database_id` from the output and paste it into `wrangler.toml`.

### 4. Run the first migration

```bash
npm run db:migrate:local
```

### 5. Set the JWT secret (if using auth)

Create `worker/.dev.vars` for local development:

```
JWT_SECRET=some-long-random-string
```

For production, set it via Wrangler:

```bash
wrangler secret put JWT_SECRET
```

### 6. Install and run

```bash
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Worker API: http://localhost:8787

---

## Project structure

```
├── src/                        # React frontend
│   ├── main.jsx
│   └── App.jsx
├── worker/
│   ├── src/
│   │   └── index.js            # Hono API entry point
│   └── migrations/
│       └── 0001_schema.sql     # Database schema
├── public/
│   └── _redirects              # SPA catch-all for Cloudflare Pages
├── wrangler.toml               # Cloudflare Worker + D1 config
├── vite.config.js              # Vite config (proxies /api to :8787)
└── .github/workflows/
    └── deploy.yml              # Auto-deploy to Cloudflare on push to main
```

---

## Deploy

### GitHub Actions (automatic)

Push to `main` and it deploys automatically. Requires these GitHub secrets:

| Secret | Where to get it |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare dashboard → My Profile → API Tokens |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → right sidebar |
| `VITE_API_URL` | Your worker URL, e.g. `https://my-app-api.yourname.workers.dev` — leave empty if same domain |

### Manual deploy

```bash
npm run build
npm run deploy:worker
```

### Run database migrations in production

```bash
npm run db:migrate
```

---

## Adding file storage (R2)

Uncomment the R2 section in `wrangler.toml`, then create the bucket:

```bash
wrangler r2 bucket create your-project-name-files
```

The bucket will be available in your worker as `context.env.MY_APP_FILES`.
