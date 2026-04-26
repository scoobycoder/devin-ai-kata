# Skill: Error Scanner
## For use by Devin in the AI Club Kata

This skill defines how to conduct a structured quality scan of a web application and produce actionable pull requests.

---

## Scan Philosophy

You are not doing a full code review. You are doing **signal detection** — finding things that are observably broken, silently failing, or missing required attributes. Prioritize findings you can demonstrate with evidence (a screenshot, a console error, a failing HTTP response) over findings that are purely theoretical.

---

## Step-by-Step Scan Protocol

### 1. Inventory the codebase first (5 min)
Before touching the browser, read:
- All frontend JS/JSX files
- All API route files
- Cross-reference: does the frontend call any endpoints that don't exist in the API file?
- Look for: undefined function references, missing error handling, accessibility attributes

### 2. Browser interaction scan (10–15 min)
Open the app URL. Work through this checklist:
- [ ] Click every button — does it do something observable?
- [ ] Submit every form — does the user receive feedback (success or error)?
- [ ] Use every filter and sort control — do results change as expected?
- [ ] Check browser console after each interaction — any errors or warnings?
- [ ] Capture a screenshot whenever you find a broken state

### 3. HTTP endpoint scan (5–10 min)
For each API endpoint you identified in step 1:
- [ ] Make a valid request — does it return 200 with expected shape?
- [ ] Make an edge case request (empty input, zero quantity, special characters) — does it return a proper 400 or does it 500?
- [ ] Check response headers — is CORS configured?
- [ ] Note any endpoints the frontend calls that aren't in the server file

### 4. Triage your findings
Before opening PRs, classify each finding:
- **High confidence:** You can demonstrate it breaks (screenshot, console error, failed request)
- **Medium confidence:** The code looks wrong but you didn't observe a failure
- **Low confidence / uncertain:** Flag in the PR body but don't claim it's definitely a bug

---

## PR Format (Required)

Every PR must include in the body:

```
## What
[1–2 sentences describing the bug in plain English]

## Where
File: [filename]
Line: [approximate line number]

## How I found it
[browser interaction / HTTP request / static analysis]

## Evidence
[Screenshot if available, or paste the console error / HTTP response]

## Fix
[What the fix does and why]

## Confidence
[High / Medium / Uncertain — and why]
```

---

## What Not to Do
- Do not open a single PR with multiple bug fixes — one PR per bug
- Do not modify `bugs/KNOWN_BUGS.md`, `DEVIN_INSTRUCTIONS.md`, or `MORNING_REVIEW_GUIDE.md`
- Do not refactor working code — only fix observable bugs
- Do not spend more than 3 hours of active compute time on this scan
