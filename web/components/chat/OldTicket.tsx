import { JENKINS_INCIDENT } from "@/lib/demo/jenkins-incident";

export function OldTicket() {
  const c = JENKINS_INCIDENT.canceledConnection;
  const app = JENKINS_INCIDENT.airlineAppDefault;
  const bag = JENKINS_INCIDENT.baggageClaim;

  return (
    <div>
      <article
        className="relative overflow-hidden rounded-md bg-[#f4efe4] text-[#1a1a1a] shadow-md border border-[#c9bba4]"
        aria-label={`Canceled boarding pass AA ${c.flightNumber}`}
      >
        <div className="flex items-center justify-between px-4 py-2 bg-[#c41e3a] text-white">
          <p className="text-[11px] font-semibold tracking-[0.14em] uppercase">
            {c.carrierName}
          </p>
          <p className="text-[11px] font-mono tracking-widest">BOARDING PASS</p>
        </div>
        <div className="flex">
          <div className="flex-1 px-4 py-3 space-y-3">
            <div>
              <p className="text-[9px] tracking-[0.2em] text-black/45">PASSENGER</p>
              <p className="font-semibold tracking-wide">Sarah Jenkins</p>
            </div>
            <div className="flex items-end justify-between gap-2">
              <div>
                <p className="text-[9px] tracking-[0.2em] text-black/45">FROM</p>
                <p className="text-lg font-bold leading-tight">{c.fromCity}</p>
              </div>
              <p className="text-xs text-black/50 mb-1 text-center">
                American Airlines {c.flightNumber}
              </p>
              <div className="text-right">
                <p className="text-[9px] tracking-[0.2em] text-black/45">TO</p>
                <p className="text-lg font-bold leading-tight">{c.toCity}</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 text-[11px] font-mono">
              <Field k="Date" v="20 November 2026" />
              <Field k="Departs" v={c.scheduledDeparture} />
              <Field k="Boarding" v={c.boarding} />
              <Field k="Gate" v={c.gate} />
              <Field k="Seat" v={c.seat} />
              <Field k="Cabin" v="Main Cabin" />
              <Field k="Confirmation" v={c.recordLocator} />
              <Field k="Bag tag" v={bag} />
            </div>
            <p className="text-[10px] text-black/45">Ticket {c.ticketNumber}</p>
            <p className="text-sm font-bold text-red-700">Status: Cancelled (weather)</p>
            <Barcode />
          </div>
          <div className="w-[72px] shrink-0 border-l border-dashed border-[#c9bba4] bg-[#efe6d4] flex flex-col items-center justify-between py-3">
            <p className="text-[9px] tracking-widest text-black/45 [writing-mode:vertical-rl] rotate-180">
              SEAT {c.seat}
            </p>
            <p className="text-[11px] font-bold text-red-700 [writing-mode:vertical-rl] rotate-180">
              CANCELLED
            </p>
            <p className="text-[9px] font-mono text-black/50 [writing-mode:vertical-rl] rotate-180">
              {c.from}–{c.to}
            </p>
          </div>
        </div>
      </article>
      <p className="mt-2 text-xs text-ink/60 text-center">
        <strong className="text-ink">Home:</strong> {JENKINS_INCIDENT.home.city} (
        {JENKINS_INCIDENT.home.code}) · this canceled leg was the{" "}
        <strong className="text-ink">{JENKINS_INCIDENT.preferredStop.label}</strong> in Kansas City
        on the way home — she still wants that stop when the original trip makes sense.
      </p>
      <p className="mt-1 text-xs text-ink/50 text-center">
        DFW is about {JENKINS_INCIDENT.driveToKansasCityMiles} miles from KC — drive or shuttle is
        viable. The app’s next <em>flight</em> is {app.departureLocal} on {app.dateLabel} (after
        Thanksgiving) — skip it.
      </p>
    </div>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="text-[8px] tracking-widest text-black/40">{k}</p>
      <p className="font-semibold text-[11px]">{v}</p>
    </div>
  );
}

function Barcode() {
  const bars = [2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 3, 2, 4, 1, 2];
  return (
    <div className="flex items-end gap-px h-8" aria-hidden>
      {bars.map((w, i) => (
        <span
          key={i}
          className="bg-black/80"
          style={{ width: w, height: i % 5 === 0 ? "100%" : "82%" }}
        />
      ))}
    </div>
  );
}
