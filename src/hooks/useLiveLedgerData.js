// DECISION-9 (2026-08-15) — local-only live data poll.
// See src/docs/app-context-contract.md §1 and §4 for the contract this implements.
//
// Polls public/generated/ledger-state.json (written by
// scripts/sync-activity-log.mjs --watch) on an interval. Only active in local
// dev builds (import.meta.env.DEV) — a production build (what Vercel runs)
// never attempts this fetch, so the public deployment is unaffected and keeps
// using mockLedgerData.json exactly as before. If the generated file doesn't
// exist yet (sync script hasn't run), fetch fails silently and the caller
// should fall back to mock data — this is expected during local dev before
// `npm run watch-activity` has been started, not an error state.
//
// Takes an onSnapshot(data) callback rather than returning state to sync via
// a downstream effect — the caller's setState calls happen directly inside
// this hook's fetch callback (an external-system update), not in a separate
// effect reacting to a `data` dependency (see react-hooks/set-state-in-effect:
// "calling setState in a callback function when external state changes").

import { useEffect, useRef, useState } from "react";

const POLL_INTERVAL_MS = 3000;
const LEDGER_STATE_URL = "/generated/ledger-state.json";

export function useLiveLedgerData(onSnapshot) {
  const [isLive, setIsLive] = useState(false);
  const onSnapshotRef = useRef(onSnapshot);
  useEffect(() => {
    onSnapshotRef.current = onSnapshot;
  }, [onSnapshot]);

  useEffect(() => {
    if (!import.meta.env.DEV) return undefined;

    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(LEDGER_STATE_URL, { cache: "no-store" });
        if (!res.ok) throw new Error(`${res.status}`);
        const json = await res.json();
        if (cancelled) return;
        onSnapshotRef.current(json);
        setIsLive(true);
      } catch {
        // Sync script not running yet, or file not present — expected during
        // local dev before `npm run watch-activity` starts. Fall back to mock.
        if (cancelled) return;
        setIsLive(false);
      }
    }

    poll();
    const intervalId = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  return { isLive };
}
