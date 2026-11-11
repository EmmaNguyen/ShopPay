"use client";

import {
  REBOOK_DESTINATIONS,
  rebookDestinationMeta,
  type RebookDestinationCode,
} from "@/lib/flights/rebook-destination";
import { JENKINS_INCIDENT } from "@/lib/demo/jenkins-incident";

type Props = {
  value: RebookDestinationCode;
  onChange: (code: RebookDestinationCode) => void;
  disabled?: boolean;
};

export function DestinationPicker({ value, onChange, disabled }: Props) {
  const preferred = JENKINS_INCIDENT.preferredStop.code;

  return (
    <div
      className="flex gap-2 justify-center"
      role="radiogroup"
      aria-label="Rebook destination airport"
    >
      {REBOOK_DESTINATIONS.map((code) => {
        const meta = rebookDestinationMeta(code);
        const on = value === code;
        return (
          <button
            key={code}
            type="button"
            role="radio"
            aria-checked={on}
            disabled={disabled}
            onClick={() => onChange(code)}
            className={`flex flex-col items-center min-w-[7rem] rounded-xl border-2 px-3 py-2 transition ${
              on
                ? "border-paypal-navy bg-paypal-navy text-white"
                : "border-black/10 bg-white text-ink/70 hover:border-paypal-blue/50"
            }`}
          >
            <span className="text-lg font-bold font-mono">{meta.code}</span>
            <span className={`text-[10px] ${on ? "text-white/85" : "text-ink/55"}`}>
              {meta.city}
            </span>
            {"pickerSub" in meta && meta.pickerSub ? (
              <span className="text-[9px] mt-0.5 opacity-75 text-center leading-tight">
                {meta.pickerSub}
              </span>
            ) : code === preferred ? (
              <span className="text-[9px] mt-0.5 opacity-75">Preferred stop</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
