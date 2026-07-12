// Left Column — The Traceable Audit Stream. AgentBlock stack + TerminalLog.

import { useAppContext } from "../AppContext";
import AgentBlock from "../ui/AgentBlock";
import TerminalLog from "../ui/TerminalLog";
import { layout, type } from "../../tokens/theme";

export default function AuditStream() {
  const { agents } = useAppContext();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className={layout.columnHeader}>
        <span className={type.heading}>Traceable Audit Stream</span>
      </div>
      <div className="shrink-0 space-y-2 border-b border-neutral-800/60 p-3">
        {agents.map((agent) => (
          <AgentBlock key={agent.id} agent={agent} />
        ))}
      </div>
      <TerminalLog />
    </div>
  );
}
