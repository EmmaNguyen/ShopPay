"use client";

import type { ReactNode } from "react";
import { TransportIcon } from "@/components/chat/transport-icons";
import {
  MOBILITY_MODE_LABELS,
  MOBILITY_MODES,
  type MobilityMode,
} from "@/lib/flights/mobility-modes";

type Props = {
  selected: MobilityMode[];
  onChange: (modes: MobilityMode[]) => void;
  onSubmit: () => void;
  loading?: boolean;
  disabled?: boolean;
  /** OMA home route has internet-sourced flights only (no bus/train to Omaha). */
  flightsOnly?: boolean;
};

const PRESETS: { label: string; modes: MobilityMode[] }[] = [
  { label: "✈︎", modes: ["flight"] },
  { label: "✈︎+", modes: ["flight", "bus", "train"] },
  { label: "All", modes: [...MOBILITY_MODES] },
];

function setsEqual(a: MobilityMode[], b: MobilityMode[]): boolean {
  if (a.length !== b.length) return false;
  const s = new Set(a);
  return b.every((m) => s.has(m));
}

export function MobilityModePicker({
  selected,
  onChange,
  onSubmit,
  loading,
  disabled,
  flightsOnly,
}: Props) {
  const toggle = (mode: MobilityMode) => {
    if (selected.includes(mode)) {
      const next = selected.filter((m) => m !== mode);
      if (next.length === 0) return;
      onChange(next);
    } else {
      onChange([...selected, mode]);
    }
  };

  const canSubmit = selected.length > 0 && !loading && !disabled;

  return (
    <section
      className="rounded-xl border border-sp-rule bg-white shadow-sm px-3 py-3 space-y-3"
      aria-label="Choose transport modes"
    >
      <PresetRow>
        {PRESETS.map((preset) => {
          const active = setsEqual(selected, preset.modes);
          return (
            <button
              key={preset.label}
              type="button"
              title={
                preset.label === "✈︎"
                  ? "Flight only"
                  : preset.label === "✈︎+"
                    ? "Flight + ground"
                    : "All modes"
              }
              onClick={() => onChange(preset.modes)}
              className={`h-9 min-w-[3rem] rounded-lg text-sm font-bold border transition ${
                active
                  ? "border-paypal-blue bg-paypal-blue/15 text-paypal-navy"
                  : "border-black/10 text-ink/55 hover:border-paypal-blue/40"
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </PresetRow>

      <ModeIconGrid>
        {MOBILITY_MODES.map((mode) => {
          const on = selected.includes(mode);
          const locked = flightsOnly && mode !== "flight";
          return (
            <button
              key={mode}
              type="button"
              aria-pressed={on}
              disabled={locked}
              onClick={() => toggle(mode)}
              className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 border-2 transition min-w-[4.5rem] ${
                on
                  ? "border-paypal-navy bg-paypal-navy text-white"
                  : "border-black/8 bg-[#f7f1e6] text-ink/65 hover:border-paypal-blue/50"
              }`}
            >
              <TransportIcon mode={mode} className="h-7 w-7" />
              <span className="text-[10px] font-semibold leading-tight text-center">
                {shortLabel(mode)}
              </span>
            </button>
          );
        })}
      </ModeIconGrid>

      <button
        type="button"
        disabled={!canSubmit}
        onClick={onSubmit}
        className="w-full rounded-lg bg-paypal-blue text-white font-bold text-sm py-2.5 disabled:opacity-45 disabled:cursor-not-allowed hover:brightness-105 transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : (
          <>
            <span className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="h-2 w-2 rounded-full bg-white/80" />
            </span>
            {loading ? null : "Show 3 picks"}
          </>
        )}
      </button>
    </section>
  );
}

function shortLabel(mode: MobilityMode): string {
  if (mode === "bus") return "Bus";
  return MOBILITY_MODE_LABELS[mode].split(" ")[0] ?? mode;
}

function PresetRow({ children }: { children: ReactNode }) {
  return <div className="flex justify-center gap-2">{children}</div>;
}

function ModeIconGrid({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap justify-center gap-2">{children}</div>;
}
