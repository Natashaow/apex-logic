// Center Column — The Intent-to-Asset Ledger. LedgerRow stack, newest first.

import { useAppContext } from "../AppContext";
import LedgerRow from "../ui/LedgerRow";
import { layout, type } from "../../tokens/theme";

export default function IntentLedger() {
  const { ledgerEntries } = useAppContext();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className={layout.columnHeader}>
        <span className={type.heading}>Intent-to-Asset Ledger</span>
      </div>
      <div className={`min-h-0 flex-1 divide-y divide-neutral-900 ${layout.scrollArea}`}>
        {ledgerEntries.map((entry) => (
          <LedgerRow key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
