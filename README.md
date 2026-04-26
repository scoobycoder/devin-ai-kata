# AI Club Kata: Devin.ai Async Error Detection

**Difficulty:** Intermediate  
**Estimated time:** 45 minutes (morning review session)  
**Devin runtime:** Overnight / async (~2–4 ACUs, ~$4.50–$9.00)

---

## What You're Learning

This kata teaches you the **reconnaissance handoff pattern** — using an async agent (Devin) to do overnight log scanning and error detection, then feeding its output into a structured Claude Code pipeline the next morning.

This is the exact pattern described in the AI Club demo: *"Kick it off at night, look at all your errors, and in the morning, have a PR ready for you."*

By the end of this kata you will:
- Understand where Devin fits relative to Claude Code (before the pipeline, not inside it)
- Know how to evaluate Devin's PR output — what to trust, verify, and push back on
- See how Devin's findings become the input to Scott's researcher → planner → engineer flow

---

## The Setup

This repo contains a small but realistic **e-commerce product listing app** — a React frontend with a mock API layer. It has been deliberately seeded with **7 real-world bugs** of the kind that appear in production logs but rarely get prioritized in sprint work.

Your job is **not** to find the bugs yourself.  
Your job is to **point Devin at the app, let it scan overnight, then review what it finds in the morning.**

---

## Repo Structure

```
devin-kata/
├── README.md                   ← You are here
├── DEVIN_INSTRUCTIONS.md       ← What to give Devin as its task prompt
├── MORNING_REVIEW_GUIDE.md     ← Discussion guide for the AI Club session
├── app/
│   ├── index.html
│   ├── styles.css
│   └── main.js                 ← React app (CDN, no build step needed)
├── api/
│   └── mock-server.js          ← Express mock API with seeded failures
├── bugs/
│   └── KNOWN_BUGS.md           ← Sealed envelope — don't open until after review
└── skills/
    └── error-scanner.md        ← Skill file Devin uses for its scan approach
```

---

## Before You Start

### What you need
- [ ] A dedicated **AI Club Devin account** (not your personal account, not Gap-provisioned)
- [ ] The app deployed to a **public URL** (Vercel free tier — instructions below)
- [ ] A **public GitHub repo** forked from this kata (not `github.gapinc.com`)

### Deploy the app (5 minutes)
1. Fork this repo to your personal GitHub account
2. Go to [vercel.com](https://vercel.com) → New Project → Import your fork
3. Vercel auto-detects the static app — click Deploy
4. Copy your public URL (e.g. `https://your-kata.vercel.app`)

> ⚠️ **Safety boundary:** Devin only ever touches this public repo and public URL.  
> No Gap infrastructure. No VPN. No internal credentials. No `github.gapinc.com`.

---

## The Exercise

### Night before (5 minutes of setup)

1. Open the AI Club Devin account
2. Open `DEVIN_INSTRUCTIONS.md` and copy the task prompt
3. Paste it into Devin, replacing `{YOUR_APP_URL}` and `{YOUR_REPO_URL}` with your actual values
4. Set a **hard spend limit of $15** in Devin's task settings
5. Hit send — let Devin run overnight

### Morning (40 minutes — the real exercise)

Open `MORNING_REVIEW_GUIDE.md` and work through it as a group.  
This is where the learning happens.

---

## The Seeded Bugs (Summary — no spoilers)

There are 7 bugs spanning three categories:

| Category | Count | Examples |
|---|---|---|
| **Broken UI flows** | 3 | A button that does nothing, a form that silently fails, a filter that returns wrong results |
| **API failures** | 2 | An endpoint that returns 500 on specific input, a missing CORS header |
| **Accessibility / silent errors** | 2 | A missing alt attribute causing console noise, an unhandled promise rejection |

Some are obvious. Some require Devin to actually interact with the app via Playwright.  
The interesting question is: **which ones does Devin catch, and which does it miss?**

---

## Connection to Your Claude Code Pipelines

After the morning review, the group will map Devin's findings to the two pipelines you already use:

**→ Research pipeline:** Devin's research brief becomes the input to the researcher agent. Instead of starting from a Jira ticket, you start from a Devin-generated bug report. The planner phases the fix. The engineer implements it in atomic commits.

**→ Testing pipeline:** Devin's overnight scan plays the role of the testing flow's "tests fail first" step — it surfaces what's broken before any engineering work begins, giving the intake flow a concrete starting point.

---

## What a Successful Run Looks Like

Devin opens 1–3 PRs on your fork. Each PR:
- Names the specific bug it found
- Includes the file and line number
- Proposes a fix with a short explanation
- May include a Playwright screenshot as evidence

In the morning review, you evaluate each PR against `bugs/KNOWN_BUGS.md` (open it now for the first time) and score Devin's output as a group.
