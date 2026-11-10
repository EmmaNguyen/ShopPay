const CONFIRM_PHRASES = [
  "yes, pay",
  "yes pay",
  "confirm purchase",
  "go ahead and pay",
  "approve payment",
  "proceed with payment",
  "charge me",
];

export function userConfirmedPayment(text: string): boolean {
  const normalized = text.toLowerCase().trim();
  return CONFIRM_PHRASES.some(
    (p) => normalized === p || normalized.includes(p)
  );
}
