# Morning Review Guide
## AI Club Kata: Devin.ai Async Error Detection

**Format:** Pair or small group (2–4 engineers)  
**Time:** 40 minutes  
**What you need open:** Devin's PRs on your fork, `bugs/KNOWN_BUGS.md` (open it now for the first time)

---

## Phase 1 — First Impressions (5 min)

Before looking at the known bugs list, go around the group:

1. How many PRs did Devin open?
2. Without reading the details yet — do the PR titles suggest Devin was working on the right things?
3. Did Devin open the scan summary issue? What did it say it checked?

> **Key habit:** You're forming an initial impression of Devin's output the same way you'd review any engineer's PR stack — before diving into the code.

---

## Phase 2 — PR-by-PR Review (20 min)

For each PR Devin opened, work through these questions together:

### Understand what Devin did
- What bug did it claim to find?
- How did it find it? (browser / HTTP / static analysis)
- Is the description clear enough that you'd know what to test?

### Evaluate the fix
- Open the diff. Does the fix actually address the root cause, or is it patching a symptom?
- Would you merge this as-is? If not, what would you ask Devin to change?
- Is there a screenshot? Does it help or is it noise?

### Score it (use this rubric)
| Score | Meaning |
|---|---|
| ✅ Ship it | Fix is correct, description is clear, you'd merge with minor polish |
| 🔧 Needs work | Found the right bug, fix needs revision — leave a review comment |
| ❌ Wrong call | Either not a real bug, or the fix introduces new problems |
| 🔍 Missed | Bug is real but Devin didn't flag it (you'll find these when you open the known bugs list) |

---

## Phase 3 — Open the Sealed Envelope (10 min)

Now open `bugs/KNOWN_BUGS.md`.

Work through each known bug:
- Did Devin catch it?
- If yes — did it fix it correctly?
- If no — why might Devin have missed it? (Too subtle? Required a specific interaction path? Static analysis limitation?)

**Tally your scores:**

| Category | Count |
|---|---|
| ✅ Correct catches + good fix | |
| 🔧 Correct catches + fix needs work | |
| ❌ False positives (Devin flagged a non-bug) | |
| 🔍 Missed bugs | |

---

## Phase 4 — Pipeline Connection (5 min)

This is the conceptual payoff. Discuss as a group:

**Question 1 — Scott's pipeline handoff:**  
Pick one of Devin's correct PRs. Imagine instead of merging it directly, you fed Devin's bug report into Scott's researcher agent as the starting context.  
- What would the researcher add that Devin's report is missing?  
- What would the planner phase differently than Devin's single-commit fix?  
- Is there value in running it through the full pipeline, or is Devin's direct fix good enough for this class of bug?

**Question 2 — Shalini's pipeline handoff:**  
Devin found bugs by interacting with the running app. Shalini's testing flow writes BDD tests that fail first.  
- Could you turn any of Devin's findings into a failing user journey test before applying the fix?  
- What would that test look like?  
- Does Devin's scan replace the testing flow, complement it, or expose a gap it can't fill?

**Question 3 — Where does human judgment still live?**  
Looking at the bugs Devin missed — what do they have in common?  
What does that tell you about the boundary between async autonomous scanning and the engineering judgment that has to follow it?

---

## Closing Reflection

Go around the group one more time:

> *"What's one thing you'd do differently if you were setting Devin up to scan a real production app instead of this kata?"*

Capture these answers — they're the seed for the next kata iteration and potentially the skills file that gets added to the team's shared repository.

---

## What to Bring Back to AI Club

Each participant should be ready to share:
1. Your PR scorecard (caught / missed / false positives)
2. Your answer to Pipeline Connection Question 3
3. One specific prompt change you'd make to `DEVIN_INSTRUCTIONS.md` based on what Devin missed

These feed directly into the next version of this kata.
