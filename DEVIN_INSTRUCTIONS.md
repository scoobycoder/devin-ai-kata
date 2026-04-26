# Devin Task Instructions
## AI Club Kata: Async Error Detection

> Copy everything below this line and paste it into Devin as your task prompt.  
> Replace `{YOUR_APP_URL}` and `{YOUR_REPO_URL}` before sending.

---

## Your Task

You are doing an overnight quality scan of a small e-commerce web application. Your job is to find bugs, broken flows, and errors — then open pull requests with fixes on the GitHub repository.

**App URL:** `{YOUR_APP_URL}`  
**GitHub repo:** `{YOUR_REPO_URL}`  
**Branch to work from:** `devin/bug-scan` (create it from `main`)

---

## Scan Approach

Work through these steps in order. Read the skill file at `skills/error-scanner.md` before starting.

### Step 1 — Browser scan (Playwright)
- Open the app in a browser
- Click every interactive element: buttons, filters, forms, dropdowns
- Note anything that produces no response, an error, or unexpected behavior
- Check the browser console for JavaScript errors and unhandled promise rejections
- Capture a screenshot of any broken state you find

### Step 2 — HTTP scan
- Make requests to every API endpoint you can discover from the source code in `api/mock-server.js`
- Try both happy-path inputs and edge case inputs (empty strings, special characters, numeric boundaries)
- Note any 4xx or 5xx responses, missing headers, or malformed responses

### Step 3 — Static analysis
- Review `app/main.js` for:
  - Unhandled promise rejections
  - Missing error boundaries
  - Accessibility issues (missing alt text, missing aria labels on interactive elements)
  - Console.error or console.warn calls that indicate known problems

### Step 4 — Open PRs
For each distinct bug you find, open a **separate pull request** on `{YOUR_REPO_URL}` with:
- **Title:** `[Devin] fix: <short description of bug>`
- **Body must include:**
  - What the bug is (1–2 sentences, plain English)
  - Where it is (file name and line number)
  - How you found it (browser interaction / HTTP request / static analysis)
  - What your fix does
  - A screenshot if you captured one
- **Branch name:** `devin/fix-<slug>` (e.g. `devin/fix-filter-returns-wrong-results`)

---

## Constraints

- Only work in the public GitHub repo provided. Do not access any other repositories.
- Do not modify `bugs/KNOWN_BUGS.md` — this file is sealed.
- Do not modify `DEVIN_INSTRUCTIONS.md` or `MORNING_REVIEW_GUIDE.md`.
- Keep each PR focused on a single bug. Do not batch multiple fixes into one PR.
- If you are unsure whether something is a bug or intentional behavior, open a PR anyway and flag your uncertainty in the PR body.
- Stop after opening PRs for all bugs you've found, or after 3 hours of active work — whichever comes first.

---

## Definition of Done

You are finished when:
- [ ] You have scanned the app using all three methods above
- [ ] You have opened at least one PR (even if you only found one bug)
- [ ] Each PR follows the format above
- [ ] You have left a summary comment on the repo's main branch (as a GitHub issue titled `[Devin] Scan Summary`) listing everything you checked, what you found, and what you were unable to verify
