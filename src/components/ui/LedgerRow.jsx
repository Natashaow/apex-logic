// SPEC-01: LedgerRow (Center Column) — src/docs/component-specs.md
// Tier 0/1 pass: Zone A (Human Intent Anchor + Machine Assumption Log) only.
// `humanIntent-always-visible` constraint — never behind a click or collapsed.
// Zone B metrics strip (Tier 2) lands in the next build pass.

import { type } from "../../tokens/theme";

export default function LedgerRow({ entry }) {
  return (
    <div className="space-y-2 p-4">
      <div>
        <span className={type.micro}>Human Intent Anchor</span>
        <p className={type.body}>{entry.humanIntent}</p>
      </div>
      <div>
        <span className={type.micro}>Machine Assumption Log</span>
        <p className={`${type.body} italic text-neutral-400`}>{entry.machineAssumption}</p>
      </div>
    </div>
  );
}
