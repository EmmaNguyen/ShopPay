import type { SessionState } from "@/lib/types";

const sessions = new Map<string, SessionState>();

function emptyState(): SessionState {
  return {
    lastSearchResults: [],
    awaitingPayment: false,
  };
}

export function getSession(sessionId: string): SessionState {
  let s = sessions.get(sessionId);
  if (!s) {
    s = emptyState();
    sessions.set(sessionId, s);
  }
  return s;
}

export function updateSession(
  sessionId: string,
  patch: Partial<SessionState>
): SessionState {
  const current = getSession(sessionId);
  const next = { ...current, ...patch };
  sessions.set(sessionId, next);
  return next;
}
