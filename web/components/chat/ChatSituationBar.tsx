import { JENKINS_INCIDENT } from "@/lib/demo/jenkins-incident";

/** Split-flap / FIDS style situation — almost no sentences. */
export function ChatSituationBar() {
  const { inbound, canceledConnection, airlineAppDefault } = JENKINS_INCIDENT;

  const rows = [
    {
      flt: `American ${inbound.flightNumber}`,
      to: "Dallas/Fort Worth",
      time: inbound.actualArrival,
      status: "Arrived",
      hot: false,
    },
    {
      flt: `American ${canceledConnection.flightNumber}`,
      to: "Kansas City",
      time: canceledConnection.scheduledDeparture,
      status: "Cancelled",
      hot: true,
    },
    {
      flt: "Airline app",
      to: "Kansas City",
      time: "27 Nov",
      status: airlineAppDefault.departureLocal,
      hot: false,
    },
  ];

  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-black/40 bg-[#0b1220]">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#071018] text-[10px] tracking-[0.2em] text-amber-200/80 font-mono">
        <span>Dallas/Fort Worth · Terminal C · Gate C19</span>
        <span className="text-red-300 font-semibold">Weather ground stop</span>
        <span className="text-amber-100">From Boston · seat 14B</span>
      </div>
      <div className="grid grid-cols-[1fr_1fr_1fr_1.1fr] px-3 py-1 text-[9px] tracking-widest text-white/35 font-mono">
        <span>Flight</span>
        <span>To</span>
        <span>Time</span>
        <span>Status</span>
      </div>
      {rows.map((r) => (
        <div
          key={`${r.flt}-${r.status}`}
          className="grid grid-cols-[1fr_1fr_1fr_1.1fr] px-3 py-2 font-mono text-sm border-t border-white/10"
        >
          <span className="text-amber-100">{r.flt}</span>
          <span className="text-amber-50">{r.to}</span>
          <span className="text-amber-100/90">{r.time}</span>
          <span
            className={
              r.hot ? "text-red-400 font-bold" : r.status === "WX" ? "text-red-400" : "text-amber-300"
            }
          >
            {r.status}
          </span>
        </div>
      ))}
      <div className="flex items-end gap-0.5 px-3 py-2 bg-black/30" aria-hidden>
        {Array.from({ length: 28 }).map((_, i) => (
          <span
            key={i}
            className="w-1.5 rounded-t-sm bg-amber-100/70"
            style={{ height: 6 + ((i * 17) % 14) }}
          />
        ))}
        <span className="ml-2 text-[10px] text-amber-100/50 font-mono">
          🧳 {JENKINS_INCIDENT.baggageClaim}
        </span>
      </div>
    </div>
  );
}
