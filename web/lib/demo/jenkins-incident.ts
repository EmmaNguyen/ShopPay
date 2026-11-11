/**
 * Jenkins demo — stuck at DFW hub after weather cancel (20 Nov 2026).
 * Suggested fares are the next seats out, 20–21 Nov — not a later holiday date.
 *
 * Story: Sarah is going **home to Omaha**; she **prefers the original DFW→MCI leg**
 * when it still works so she can **drop by Kansas City for Thanksgiving**, then continue home.
 */
export const JENKINS_INCIDENT = {
  rebookDates: ["2026-11-20", "2026-11-21"] as const,
  home: {
    code: "OMA",
    city: "Omaha",
  },
  /** Interrupted stop on the way home — still her preferred rebook when seats exist. */
  preferredStop: {
    code: "MCI",
    city: "Kansas City",
    label: "Thanksgiving stop",
  },
  /** Dallas/Fort Worth to Kansas City — close enough to drive instead of re-flying. */
  driveToKansasCityMiles: 519,
  driveToOmahaMiles: 635,
  rebookDestinationOptions: {
    MCI: {
      code: "MCI",
      city: "Kansas City",
      milesFromDfw: 519,
      pickerSub: "Preferred · KC stop",
      ribbonNote: "Original routing",
    },
    OMA: {
      code: "OMA",
      city: "Omaha",
      milesFromDfw: 635,
      pickerSub: "Home · direct",
      ribbonNote: "Skips KC · lands home",
    },
  } as const,
  hub: "DFW",
  terminal: "C",
  gate: "C19",
  cancelReason: "weather" as const,
  hubBanner: "Weather ground stop",
  inbound: {
    carrier: "AA",
    flightNumber: "1423",
    from: "BOS",
    to: "DFW",
    date: "2026-11-20",
    scheduledArrival: "19:43",
    actualArrival: "20:47",
    connectMinutes: 14,
  },
  canceledConnection: {
    carrier: "AA",
    carrierName: "American Airlines",
    flightNumber: "2184",
    from: "DFW",
    fromCity: "Dallas/Fort Worth",
    to: "MCI",
    toCity: "Kansas City",
    dateIso: "2026-11-20",
    dateLabel: "20 NOV 2026",
    scheduledDeparture: "22:15",
    boarding: "21:35",
    gate: "C19",
    seat: "14B",
    cabin: "MAIN",
    passenger: "JENKINS/SARAH",
    recordLocator: "QK7M2P",
    ticketNumber: "001 2148 773 902",
    status: "CXLD",
    note: "Squall line · ramp closed",
  },
  airlineAppDefault: {
    to: "MCI",
    dateLabel: "27 November 2026",
    departureLocal: "06:40",
  },
  thanksgivingUsDate: "2026-11-26",
  baggageClaim: "AA-882049",
  queueNote: "172 pax · rebook ~90m",
} as const;
