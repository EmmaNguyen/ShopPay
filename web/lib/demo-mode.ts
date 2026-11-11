export function resolveDemoMode(): boolean {
  return (
    process.env.DEMO_MODE === "true" ||
    !process.env.PAYPAL_CLIENT_ID ||
    !process.env.PAYPAL_CLIENT_SECRET ||
    !process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  );
}
