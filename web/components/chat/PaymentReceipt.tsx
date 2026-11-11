type Props = {
  orderId: string;
  status: string;
};

export function PaymentReceipt({ orderId, status }: Props) {
  return (
    <div className="rounded-2xl border border-success/30 bg-gradient-to-b from-success/10 to-surface p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success text-white text-xl font-bold">
          ✓
        </span>
        <div>
          <p className="text-lg font-bold text-success">{status}</p>
          <p className="text-xs font-mono text-ink/55 truncate max-w-[240px]">{orderId}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-ink/70">Sandbox receipt · show the family the screenshot</p>
    </div>
  );
}
