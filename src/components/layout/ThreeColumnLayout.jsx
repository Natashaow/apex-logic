// The Three-Column Grid (The Law) — src/docs/branding/ui-spec.md
// 25% Audit Stream / 45% Intent Ledger / 30% Circuit Breaker Gate. Full viewport lock,
// columns scroll independently. The 1px gap IS the border (ui-spec.md Spacing Scale).

import AuditStream from "../sections/AuditStream";
import IntentLedger from "../sections/IntentLedger";
import CircuitBreakerGate from "../sections/CircuitBreakerGate";

export default function ThreeColumnLayout() {
  return (
    <div className="flex min-h-0 flex-1 gap-px overflow-hidden bg-neutral-800/60">
      <div className="flex min-w-0 flex-col overflow-hidden bg-neutral-950" style={{ width: "25%" }}>
        <AuditStream />
      </div>
      <div className="flex min-w-0 flex-col overflow-hidden bg-neutral-950" style={{ width: "45%" }}>
        <IntentLedger />
      </div>
      <div className="flex min-w-0 flex-col overflow-hidden bg-neutral-950" style={{ width: "30%" }}>
        <CircuitBreakerGate />
      </div>
    </div>
  );
}
