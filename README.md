## Smart Bookmark App

Private, real-time bookmark manager built with:

- **Next.js (App Router)**
- **Supabase Auth (Google OAuth only)**
- **Supabase Postgres + RLS (bookmarks private per user)**
- **Supabase Realtime (sync across tabs without refresh)**
- **Tailwind CSS**

### Features

- **Google sign-in**: no email/password
- **Add bookmarks**: URL + title
- **Delete bookmarks**
- **Privacy**: row-level security enforces per-user visibility
- **Realtime**: inserts/deletes appear in other open tabs immediately

### Setup (Supabase)

1. In Supabase, enable **Auth → Providers → Google**
2. Add Redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://<your-vercel-domain>/auth/callback`
3. Create the database table + policies by running:
   - `supabase/schema.sql` (copy/paste into Supabase SQL Editor)

### Local dev

1. Install deps:

```bash
cd smart-bookmark-app
npm install
```

2. Add env:

```bash
cd smart-bookmark-app
copy .env.example .env.local
```

3. Run:

```bash
npm run dev
```

Open `http://localhost:3000`.

### Deploy (Vercel)

1. Import the GitHub repo in Vercel
2. Set **Root Directory** to `smart-bookmark-app`
3. Add Environment Variables (Project → Settings → Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
4. Deploy, then add your deployed callback URL in Supabase (Auth settings):
   - `https://<your-vercel-domain>/auth/callback`

### Problems I ran into (and how they were solved)

- **create-next-app failed in repo root due to npm naming rules**
  - The repository folder name contains capital letters; npm package names cannot.
  - **Fix**: scaffolded the app into a lowercase subfolder: `smart-bookmark-app/` and documented using that as Vercel’s Root Directory.

- **Windows npm install produced partial extraction errors**
  - Next’s package tar extraction can fail if an install is interrupted, leaving a broken `node_modules`.
  - **Fix**: delete `node_modules/` + `package-lock.json` and reinstall:

```bash
cd smart-bookmark-app
rd /s /q node_modules
del package-lock.json
npm install
```

