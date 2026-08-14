// Config-driven "analyzing" state machine for the instant-audit UI. Today
// AuditExperience.tsx just advances through these stages on a timer, since
// runAudit() in engine.ts runs synchronously server-side and there's no
// progress channel back to the client yet.
//
// Extension point: when the engine can report real progress (e.g. a
// streaming response or an SSE/WebSocket channel keyed by audit id), the
// client should call `stageIndexById()` with whatever stage id the backend
// reports rather than advancing on an interval — nothing else about this
// config, or the components that render it, needs to change.

export interface AuditProgressStage {
  id: string;
  label: string;
}

export const AUDIT_PROGRESS_STAGES: AuditProgressStage[] = [
  { id: "connecting", label: "Connecting to website" },
  { id: "mobile", label: "Checking mobile experience" },
  { id: "technical", label: "Checking technical health" },
  { id: "performance", label: "Checking page performance" },
  { id: "seo", label: "Checking on-page SEO" },
  { id: "local-seo", label: "Checking Local SEO signals" },
  { id: "accessibility", label: "Checking accessibility" },
  { id: "trust-conversion", label: "Checking trust and conversion" },
  { id: "content", label: "Reviewing content structure" },
  { id: "recommendations", label: "Preparing recommendations" },
];

export function progressPercentForStage(index: number, total: number = AUDIT_PROGRESS_STAGES.length): number {
  if (total <= 0) return 0;
  const clampedIndex = Math.max(0, Math.min(index, total - 1));
  return Math.round(((clampedIndex + 1) / total) * 100);
}

export function stageIndexById(id: string): number {
  const index = AUDIT_PROGRESS_STAGES.findIndex((stage) => stage.id === id);
  return index === -1 ? 0 : index;
}

export type AuditProgressStatus = "idle" | "running" | "complete" | "error";

export interface AuditProgressState {
  status: AuditProgressStatus;
  stageIndex: number;
}

export const INITIAL_AUDIT_PROGRESS: AuditProgressState = { status: "idle", stageIndex: 0 };

/** Advances one stage at a time — the placeholder driver until a real backend can push stage ids directly. */
export function advanceAuditProgress(state: AuditProgressState): AuditProgressState {
  if (state.status !== "running") return state;
  const nextIndex = Math.min(state.stageIndex + 1, AUDIT_PROGRESS_STAGES.length - 1);
  return { ...state, stageIndex: nextIndex };
}
