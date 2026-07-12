# Rationale Void Review Checklist
> A standing rubric to run any future design, copy, or feature decision against — so nothing drifts from the core problem while iterating quickly.

---

## Why This Exists

`ux-problem-framework.md` establishes the umbrella frame: every problem statement (`PS-01`–`PS-06`) is a different facet of the same absence — **The Rationale Void**. Autonomous agents act, and no record of why, how much, or under what authority is ever created. Apex Logic's answer is to close that void with a permanent, cost-aware record: **The Intent Ledger**, gated by **The Apex Checkpoint**.

That's easy to state once and easy to forget three decisions later. This checklist is the guardrail — a short list of questions, not a process, meant to be run in seconds against anything new: a feature idea, a line of copy, a pitch beat, a component tweak.

---

## The Checklist

1. **Does this close a piece of the Rationale Void — does it produce a recorded reason where none existed before?**
   If the answer is no, it's not solving the core problem — it's decoration.

2. **Does this turn a guess into a fact for the Tech Lead or the Finance persona?**
   "Recorded" isn't enough on its own — it has to resolve a real question one of them currently can't answer.

3. **Which problem statement (`PS-01`–`PS-06`) does this resolve — and if none, is it still in scope?**
   Every shipped thing should trace to a row in the traceability matrix (`ux-problem-framework.md` Section 6). If it can't, either write a new `PS-` first, or cut it.

4. **Does this belong inside the Intent Ledger or the Apex Checkpoint — a permanent record or a decision gate — or does it just add more raw data to sift through?**
   A ledger entry records something you need to keep. A checkpoint lets you act on it. If it's neither, it's noise inside the exact system you built to eliminate noise.

5. **Would cutting this reopen a piece of the void?**
   The sharpest single test. If removing it doesn't cost you any recorded rationale, it was never load-bearing.

6. **Does it survive contact with a skeptical outsider?**
   Could a Tech Lead or Finance lead who has never seen Apex Logic understand, in one sentence, why this exists — without you explaining the technical trace first? (Mirrors `plainenglish-before-diff` — plain English always has to carry the point on its own.)

---

## How to Use This

- **Fast gut-check:** before shipping any new component, copy line, or pitch beat, run it through questions 1, 3, and 5. If it fails two of three, don't ship it yet.
- **Full review:** for anything bigger (a new spec, a new persona treatment, a new pitch draft), run all six and write down the answers — the answers themselves become the justification, not a separate writeup.
- **As a review sub-agent prompt:** the block below is meant to be pasted directly as instructions for a reviewer (human or AI) who has not read the rest of this project's docs.

> You are reviewing a proposed change to Apex Logic, a product whose entire premise is: autonomous AI agents act inside a Rationale Void — no record of why they acted, what they assumed, or what it cost is ever created — and Apex Logic closes that void with a permanent, cost-aware Intent Ledger gated by a human Apex Checkpoint. Given the change described, answer: (1) does it close a piece of the void by producing a recorded reason that didn't exist before; (2) does it turn a guess into a fact for a Tech Lead or Finance persona; (3) which existing problem does it resolve, or is a new one needed; (4) is it a ledger entry/checkpoint or just more raw data; (5) would removing it reopen a piece of the void; (6) can a skeptical outsider understand why it exists in one plain-English sentence. Flag anything that fails more than one of these.

---

## Explicit Non-Goals

- This is not a design system audit (see `ui-spec.md` for the Thin-Lines rule and locked visual decisions) — it checks *problem alignment*, not visual consistency.
- This is not a substitute for the traceability matrix in `ux-problem-framework.md` Section 6 — it's a fast filter to run before something earns a row there.
