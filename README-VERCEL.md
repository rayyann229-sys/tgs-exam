# TGS E-Testing LMS — Vercel + MongoDB Atlas Deploy

This folder deploys the app to **Vercel** (free, global CDN) with a **MongoDB Atlas** database (free 512 MB — plenty for an exam platform).

> Why MongoDB? Vercel serverless functions have **no filesystem** — data must live in an external database. MongoDB stores your JSON-shaped data natively.

---

## Overview (2 accounts, both free)
1. **MongoDB Atlas** — stores your data (students, questions, results).
2. **Vercel** — runs the app + API on a public URL.

---

## STEP 1 — Create a free MongoDB Atlas database

1. Go to **https://www.mongodb.com/cloud/atlas/register** and sign up (free).
2. Choose **M0 Free** (512 MB shared cluster) → any cloud (AWS/Google/Azure) → region near you → **Create Cluster** (takes ~2 min).
3. Under **Database Access** → **Add New Database User**:
   - Username: `tgsuser`
   - Password: make a strong one, **write it down**
   - Role: **Read and write to any database**
4. Under **Network Access** → **Add IP Address** → **Allow Access From Anywhere** (button `0.0.0.0/0`). This is required so Vercel can reach it.
5. Under **Database** → **Connect** → **Drivers** → **Node.js** → copy the connection string. It looks like:
   ```
   mongodb+srv://tgsuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your real password. **Keep this string** — you need it next.

---

## STEP 2 — Deploy to Vercel (easiest: via GitHub)

1. Create a **GitHub** repo and upload the entire `vercel-app` folder contents to it.
2. Go to **https://vercel.com** → **Sign Up** → **Continue with GitHub**.
3. **Add New Project** → import your repo.
4. Vercel auto-detects the settings. Before clicking **Deploy**, add the environment variable:
   - Go to **Settings → Environment Variables** → **Add**:
     - Name: `MONGODB_URI`
     - Value: paste your full connection string (with password)
   - (Optional) Add `MONGODB_DB` = `tgs_exam`
5. Click **Deploy**. Wait ~1 minute.
6. Your app is live at `https://your-project.vercel.app` 🎉

> First load takes a few seconds (serverless "cold start"). After that it's fast.

---

## STEP 3 — Open and use it
- Visit your Vercel URL.
- Log in as `admin` / `admin123`.
- **Change the admin password** immediately.

---

## Alternative: deploy with Vercel CLI (no GitHub)

```bash
npm i -g vercel          # install once
cd vercel-app
vercel                   # follow prompts (links to your account)
vercel env add MONGODB_URI        # paste your connection string
vercel --prod            # deploy to production
```

---

## Local testing (optional)

```bash
cd vercel-app
npm install
npm run dev      # opens http://localhost:3000
```
Without `MONGODB_URI`, it uses a local `/tmp` file so you can test every feature — but **data is not persisted across restarts** until you add MongoDB.

---

## Notes & limits
- **Vercel Hobby** limit: **4.5 MB** request body. Fine for normal imports; very large ZIPs may need splitting.
- **PDF import** is disabled on Vercel (no PDF library in serverless). Export PDFs to CSV/TXT first.
- **Cold starts**: the first request after idle takes ~2-3s. Exams themselves stay smooth once running.
- **MongoDB free tier**: 512 MB ≈ hundreds of thousands of questions/results. More than enough.
- To use a **custom domain** (like `exam.tgs.edu.pk`): Vercel → Settings → Domains → add it, then point your DNS.
