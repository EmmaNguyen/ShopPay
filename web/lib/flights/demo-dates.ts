import { JENKINS_INCIDENT } from "@/lib/demo/jenkins-incident";

/** Thanksgiving rebook departures. Override via DEMO_DEPARTURE_DATE=YYYY-MM-DD */
export function demoDepartureDate(): string {
  const fromEnv = process.env.DEMO_DEPARTURE_DATE?.trim();
  if (fromEnv && /^\d{4}-\d{2}-\d{2}$/.test(fromEnv)) return fromEnv;
  return JENKINS_INCIDENT.rebookDates[0];
}
