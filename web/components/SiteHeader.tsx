import Link from "next/link";

type Props = {
  variant?: "marketing" | "app";
};

export function SiteHeader({ variant = "marketing" }: Props) {
  const onDark = variant === "marketing";

  return (
    <header
      className={
        onDark
          ? "absolute top-0 left-0 right-0 z-20 px-4 py-5"
          : "bg-gradient-to-br from-paypal-navy via-paypal-blue to-paypal-light text-white px-4 py-6 shadow-md"
      }
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        <Link
          href="/"
          className={`font-bold text-xl tracking-tight ${
            onDark ? "text-white" : "text-white"
          }`}
        >
          ShopPal
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          {variant === "marketing" && (
            <Link
              href="/#how-it-works"
              className="text-white/85 hover:text-white hidden sm:inline"
            >
              How it works
            </Link>
          )}
          <Link
            href="/chat"
            className={
              onDark
                ? "rounded-full bg-white text-paypal-navy px-4 py-2 font-semibold hover:bg-white/95 transition"
                : "rounded-full bg-white/15 text-white px-4 py-2 font-semibold hover:bg-white/25 transition border border-white/30"
            }
          >
            Open chat
          </Link>
        </nav>
      </div>
    </header>
  );
}
