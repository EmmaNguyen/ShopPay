import { JENKINS_INCIDENT } from "@/lib/demo/jenkins-incident";

export type RebookDestinationCode = keyof typeof JENKINS_INCIDENT.rebookDestinationOptions;

export const REBOOK_DESTINATIONS: RebookDestinationCode[] = ["MCI", "OMA"];

export function rebookDestinationMeta(code: RebookDestinationCode) {
  return JENKINS_INCIDENT.rebookDestinationOptions[code];
}

export function parseRebookDestination(
  raw: string | null | undefined
): RebookDestinationCode {
  const key = raw?.toUpperCase();
  if (key === "OMA" || key === "MCI") return key;
  return JENKINS_INCIDENT.canceledConnection.to;
}
