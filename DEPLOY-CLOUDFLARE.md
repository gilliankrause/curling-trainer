# Deploy Curling Coach to Cloudflare (free tier)

This guide walks through the easiest way to publish the app using a **free Cloudflare account**, with your code already on **GitHub**.

---

## Windows: use WSL for all CLI steps

If you’re on **Windows**, run every terminal command in this guide inside **WSL** (Windows Subsystem for Linux). That avoids path, Node, and tooling issues and matches the Linux environment Cloudflare uses to build your app.

### Prerequisites

1. **Install WSL2** (if you don’t have it):
   - In PowerShell (Admin): `wsl --install`
   - Restart if prompted, then open **Ubuntu** (or another distro) from the Start menu.

2. **Use your project from inside WSL** (pick one):
   - **Option A (recommended):** Clone the repo inside WSL and work there:
     ```bash
     cd ~
     git clone https://github.com/<your-username>/<your-repo>.git
     cd <your-repo>
     ```
   - **Option B:** Keep the repo on Windows and open it in WSL:
     ```bash
     cd /mnt/c/Users/<YourWindowsUsername>/path/to/curling-trainer
     ```
     Replace with your real Windows user name and path. Node/npm will run in WSL; your editor can stay on Windows.

3. **Node.js in WSL:** Install Node 18+ inside WSL (not only on Windows):
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   node -v && npm -v
   ```

4. **Run all commands in a WSL terminal** (Ubuntu, etc.). Use the same WSL shell for `npx wrangler login` so the browser auth flow works correctly.

### Generating a secret on Windows

For `NEXTAUTH_SECRET`, in **WSL** run:

```bash
openssl rand -base64 32
```

Copy the output into your Cloudflare secrets. If you prefer PowerShell on Windows: `[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])`.

---

## Important: Your app is full-stack

This app uses **Next.js API routes**, **NextAuth**, and a **database** (Prisma + SQLite). On Cloudflare’s free tier you have two realistic options:

| Option | Best for | Database |
|--------|----------|----------|
| **Full-stack (recommended)** | This app | Cloudflare **D1** (free SQLite) or external DB (e.g. Neon, Turso) |
| Static export | Marketing sites only | N/A (no backend) |

File-based SQLite (`file:./dev.db`) **does not work** on Cloudflare Workers (no writable filesystem). You’ll need to use **D1** or a hosted database for production.

---

## Part 1: One-time setup (adapter + database)

Do this once on your machine, then commit the changes and push to GitHub. **Windows:** use a WSL terminal and run from your project root inside WSL (see above).

### 1. Add the Cloudflare adapter (OpenNext)

In your project root (in WSL on Windows):

```bash
npx @opennextjs/cloudflare migrate
```

This will:

- Install `@opennextjs/cloudflare` and `wrangler`
- Add `wrangler.jsonc`, `open-next.config.ts`, `public/_headers`, `.dev.vars`
- Update `package.json` scripts (`preview`, `deploy`, etc.)
- Add `.open-next` to `.gitignore`
- Optionally create an R2 bucket for caching (if R2 is enabled on your account)

Answer the prompts (e.g. project name like `curling-coach`).  
**Do not** commit `.dev.vars` (it’s for local secrets). Do commit the new config files and script changes.

### 2. Database: use Cloudflare D1 (free, recommended)

Your app currently uses Prisma with SQLite. On Cloudflare you should use **D1** (SQLite at the edge, free tier included). **Windows:** run these commands in WSL.

1. **Create a D1 database** (Cloudflare dashboard or CLI):

   ```bash
   npx wrangler d1 create curling-coach-db
   ```

   Note the **database id** (e.g. `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).

2. **Bind D1 in Wrangler**  
   In `wrangler.jsonc`, add a `d1_databases` binding (name it e.g. `DB`):

   ```jsonc
   "d1_databases": [
     {
       "binding": "DB",
       "database_name": "curling-coach-db",
       "database_id": "<paste-the-database-id-here>"
     }
   ]
   ```

3. **Use Prisma with D1 in production**  
   Prisma supports D1 via a driver adapter. Follow the official guide:

   - [Deploy to Cloudflare Workers & Pages | Prisma](https://docs.prisma.io/docs/orm/prisma-client/deployment/edge/deploy-to-cloudflare)

   In short you’ll:

   - Use the Prisma D1 adapter and pass the **D1 binding** (e.g. `DB`) into your server code instead of a connection string for production.
   - Keep using `file:./dev.db` (or a local D1 with `wrangler d1 execute --local`) for local development.

4. **Run migrations on D1**  
   After wiring the adapter, apply your schema to D1 (e.g. export SQL from Prisma and run it with `wrangler d1 execute`), or use Prisma’s flow for D1 if you follow the Prisma Cloudflare doc.

Until the app is wired to D1 (or another edge-compatible DB), the deploy will build but **API routes and login will fail** at runtime. Doing the Prisma + D1 steps above fixes that.

### 3. Set production environment variables

You’ll need these in production (and in the Cloudflare dashboard or via `wrangler secret put` for Workers):

- `NEXTAUTH_URL` – Your production URL, e.g. `https://curling-coach.<your-subdomain>.workers.dev`
- `NEXTAUTH_SECRET` – A long random string. In WSL: `openssl rand -base64 32` (see “Generating a secret on Windows” above if you prefer PowerShell).

For Workers deployed via Git (see Part 2), set these in the dashboard under **Workers & Pages → your project → Settings → Variables and Secrets**.

---

## Part 2: Deploy from GitHub (easiest)

After the one-time setup and pushing to GitHub:

### 1. Open Cloudflare dashboard

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) and sign in (or create a free account).
2. In the left sidebar, go to **Workers & Pages**.

### 2. Create application from Git

1. Click **Create application** → **Workers** (or **Create** → **Workers & Pages**).
2. Choose **Connect to Git** (or **Import from Git**).
3. Select **GitHub** and authorize Cloudflare if asked.
4. Pick the repo that contains Curling Coach (e.g. `your-username/curling-trainer`).
5. Click **Begin setup** (or equivalent).

### 3. Build and deploy settings

Use these so Cloudflare runs the OpenNext build and then deploys the Worker:

| Setting | Value |
|--------|--------|
| **Production branch** | `main` (or whatever your default branch is) |
| **Root directory** | Leave blank (or `/` if you’re in a monorepo and the app is at repo root) |
| **Build command** | `npx opennextjs-cloudflare build` |
| **Deploy command** | `npx wrangler deploy` |

If the UI only has one “Build command” and no separate “Deploy command”, use a single command that does both, for example:

- **Build command:** `npx opennextjs-cloudflare build && npx wrangler deploy`

The **Worker name** in the dashboard must match the `name` in your `wrangler.jsonc` (e.g. `curling-coach`), or the Git-based deploy can fail.

### 4. Environment variables (production)

In **Workers & Pages → your project → Settings → Variables and Secrets** add:

- `NEXTAUTH_URL` = `https://<your-worker>.<your-subdomain>.workers.dev`
- `NEXTAUTH_SECRET` = (your secret string)

Redeploy after changing variables so the new values are applied.

### 5. Deploy

- **Automatic:** Every push to the production branch (e.g. `main`) will trigger a build and deploy.
- **Manual:** You can also trigger a deploy from the **Deployments** tab.

When the build succeeds, the app will be live at:

`https://<name>.<your-subdomain>.workers.dev`

---

## Part 3: Deploy from your machine (optional)

If you prefer not to use Git integration, run these in your project root. **Windows:** use a WSL terminal so `wrangler login` and the build run in a Linux environment.

```bash
# Build and deploy in one go (uses scripts added by migrate)
npm run deploy
```

You must be logged in (opens a browser; use WSL so the callback works):

```bash
npx wrangler login
```

Set production secrets before deploying:

```bash
npx wrangler secret put NEXTAUTH_SECRET
npx wrangler secret put NEXTAUTH_URL
```

---

## Summary checklist

- [ ] **Windows:** WSL set up, Node in WSL, project opened in WSL (clone there or `cd /mnt/c/...`).
- [ ] Run `npx @opennextjs/cloudflare migrate` (in WSL) and commit the generated config + scripts.
- [ ] Create a D1 database and add the binding to `wrangler.jsonc`.
- [ ] Follow [Prisma’s Cloudflare/D1 guide](https://docs.prisma.io/docs/orm/prisma-client/deployment/edge/deploy-to-cloudflare) so the app uses D1 in production.
- [ ] Set `NEXTAUTH_URL` and `NEXTAUTH_SECRET` in the Cloudflare project (Variables and Secrets).
- [ ] Connect the GitHub repo in Workers & Pages and use **Build:** `npx opennextjs-cloudflare build`, **Deploy:** `npx wrangler deploy` (or the combined command if your UI has a single build step).
- [ ] Ensure the Worker name in the dashboard matches `name` in `wrangler.jsonc`.

After that, each push to your default branch will build and publish the app on Cloudflare’s free tier.
