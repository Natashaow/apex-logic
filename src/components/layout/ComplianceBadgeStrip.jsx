// SPEC-06: ComplianceBadgeStrip — src/docs/component-specs.md
// Renders the 3 IMDA compliance pillars from `complianceMatrix` (src/data/assumptions.js).
// Sits directly below SystemHeader, above the 3-column grid.

import { complianceMatrix } from "../../data/assumptions";
import { type } from "../../tokens/theme";

export default function ComplianceBadgeStrip() {
  return (
    <div className="flex shrink-0 items-center gap-4 overflow-x-auto border-b border-neutral-800/60 bg-neutral-950 px-4 py-1.5">
      <span className={`${type.micro} shrink-0`}>IMDA Compliance</span>
      {complianceMatrix.pillars.map((pillar) => (
        <span
          key={pillar.id}
          className="shrink-0 border border-neutral-800/60 px-1.5 py-0.5 text-[10px] font-mono uppercase text-neutral-500"
        >
          {pillar.focusArea}
        </span>
      ))}
    </div>
  );
}
