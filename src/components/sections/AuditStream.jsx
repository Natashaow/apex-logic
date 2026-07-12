// Left Column — The Traceable Audit Stream. AgentBlock stack + TerminalLog.
// TerminalLog (Tier 2) lands in the next build pass.

import { useAppContext } from "../AppContext";
import AgentBlock from "../ui/AgentBlock";
import { layout, type } from "../../tokens/theme";

export default function AuditStream() {
  const { agents } = useAppContext();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className={layout.columnHeader}>
        <span className={type.heading}>Traceable Audit Stream</span>
      </div>
      <div className={`min-h-0 flex-1 space-y-2 ${layout.scrollArea} p-3`}>
        {agents.map((agent) => (
          <AgentBlock key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}
