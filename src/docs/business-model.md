# Business Model & Revenue Strategy: Apex Logic Control Plane
> Expected revenue streams, pricing structure, and sustainability plan. Newly authored — see provenance note below.

---

## 0. Provenance & Status

Unlike the other `src/docs/` files, this document was **not** authored upstream of the product from a locked founder decision. It was drafted to answer a competition application ("Expected Revenue Sources") and is grounded in the persona structure already locked in `product-strategy.md` and `ux-problem-framework.md`, not in a pre-existing pricing decision. **Treat the specific tiers and price points as proposed, not locked** — they require founder validation before they become canonical or land in the product. Everything below is downstream of the personas; if a persona changes, revisit this doc.

---

## 1. Model Summary

**Apex Logic is a B2B SaaS governance layer, priced on agents governed and volume audited.**

The core mechanic: revenue scales with the customer's autonomous-agent footprint. The more agent execution a customer runs, the more Rationale Void there is to close — so the governance surface Apex Logic covers grows in lockstep with the customer's own AI adoption. Expansion revenue is therefore the default growth path, not an upsell we have to manufacture.

---

## 2. Revenue Streams

| Stream | Buyer (Persona) | Basis | Rationale |
|---|---|---|---|
| **Team subscription** | The Architect-Governor (Tech Lead / AI engineering pod) — primary | Per-seat / per-team recurring | The primary buyer and daily user. Priced per governed pod. |
| **Usage-based tier** | Architect-Governor / platform teams | Scales with agents monitored + actions intercepted and logged | Aligns our revenue with the customer's agent adoption curve — the ledger's value is proportional to volume. |
| **Enterprise tier** | The Compliance Controller (AI governance / corporate finance) | Annual contract | SSO, immutable and exportable audit ledger, compliance reporting mapped to Singapore's IMDA Model AI Governance Framework. Sold on audit-readiness, not seats. |
| **Prosumer / operator tier** | The Sovereign Operator (solo founder / agency) | Flat monthly | Cost-control and profitability (AER) view for a self-funded agent fleet. Lower price, self-serve, high volume. |

---

## 3. Why This Is Defensible & Sustainable

- **Revenue tracks the trend, not against it.** Autonomous-agent adoption is accelerating industry-wide. Every new agent a customer deploys expands the void Apex Logic exists to close — so the market tailwind and our revenue growth are the same vector.
- **Governance is sticky.** Once the Intent Ledger is the system of record for *why* agents acted, it becomes the audit trail of record — expensive to rip out and re-establish elsewhere.
- **Land-and-expand is structural.** Entry is a single pod (Architect-Governor). Expansion is more agents, more pods, then the enterprise compliance contract — no change of buyer required to grow within an account, and a natural handoff to the Compliance Controller for the enterprise tier.
- **Cost-attribution is a wedge.** The COGS/AER metrics (see `product-strategy.md` §V) let a customer justify the subscription against the compute waste it surfaces — the product helps pay for itself.

---

## 4. Explicit Non-Claims

- No specific price points are committed here — tiers are structural, not numeric, until validated.
- No claim of current revenue or paying customers — the product is a working prototype (see `memory-bank/PROGRESS.md`), and this is a forward-looking model.
- This is not a go-to-market or sales-motion plan — it is the revenue-stream and sustainability layer only.
