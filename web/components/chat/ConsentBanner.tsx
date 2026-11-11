type Props = {
  onConfirm: () => void;
  disabled?: boolean;
};

export function ConsentBanner({ onConfirm, disabled }: Props) {
  return (
    <div className="rounded-2xl border-2 border-holiday-gold/50 bg-gradient-to-br from-holiday-gold/25 to-holiday-cream p-4 text-center shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink/55">
        No charge until you consent
      </p>
      <button
        type="button"
        disabled={disabled}
        onClick={onConfirm}
        className="mt-3 w-full max-w-xs mx-auto rounded-xl bg-holiday-gold text-paypal-navy py-3 text-lg font-bold hover:brightness-105 disabled:opacity-40 transition"
      >
        yes, pay
      </button>
    </div>
  );
}
