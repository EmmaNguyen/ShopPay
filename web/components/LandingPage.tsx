import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

const steps = [
  {
    title: "Describe what you need",
    body: "Budget, category, plain language — no filter hunting.",
    icon: "1",
  },
  {
    title: "Compare real options",
    body: "The agent searches a catalog and explains tradeoffs — no invented products.",
    icon: "2",
  },
  {
    title: "You say yes, PayPal pays",
    body: "Nothing charges until you confirm. Checkout runs in PayPal’s sandbox UI.",
    icon: "3",
  },
];

const pillars = [
  {
    title: "Agentic commerce",
    body: "Tool-backed search, selection, and order creation — not just affiliate links.",
  },
  {
    title: "Consent by design",
    body: 'Reply "yes, pay" before any PayPal order is created. Always.',
  },
  {
    title: "PayPal sandbox",
    body: "Orders API + JavaScript Buttons. Built for the PayPal AI Hackathon.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-mist">
      <section className="relative overflow-hidden bg-gradient-to-br from-paypal-navy via-paypal-blue to-paypal-light text-white pb-20 pt-24 sm:pb-28 sm:pt-32">
        <SiteHeader variant="marketing" />
        <div
          className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-paypal-light/30 blur-2xl"
          aria-hidden
        />

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white/95 mb-6">
            PayPal AI Hackathon · Agentic checkout
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.1]">
            Delegate the cart.
            <span className="block text-white/90 mt-1">Keep control of the payment.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed">
            ShopPal is a shopping concierge that compares products in chat, asks for
            explicit approval, then completes checkout with PayPal.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/chat"
              className="w-full sm:w-auto rounded-full bg-white text-paypal-navy px-8 py-3.5 text-base font-semibold shadow-lg hover:bg-white/95 transition"
            >
              Try ShopPal — free demo
            </Link>
            <Link
              href="/#how-it-works"
              className="w-full sm:w-auto rounded-full border border-white/40 text-white px-8 py-3.5 text-base font-semibold hover:bg-white/10 transition"
            >
              See how it works
            </Link>
          </div>
        </div>

        <HeroPreview />
      </section>

      <section id="how-it-works" className="py-16 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink text-center">
            How it works
          </h2>
          <p className="text-center text-ink/65 mt-3 max-w-xl mx-auto">
            Three steps from intent to sandbox receipt — built for demos and real
            agentic commerce patterns.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.title}
                className="rounded-2xl bg-surface border border-black/5 p-6 shadow-sm"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-paypal-navy text-white font-bold text-sm">
                  {step.icon}
                </span>
                <h3 className="mt-4 font-semibold text-lg text-ink">{step.title}</h3>
                <p className="mt-2 text-sm text-ink/70 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 px-4 bg-surface border-y border-black/5">
        <div className="max-w-5xl mx-auto grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink">
              AI that acts — safely
            </h2>
            <p className="mt-4 text-ink/70 leading-relaxed">
              ShopPal uses AI tools to search, select, and prepare PayPal checkout.
              Payments only move when you confirm. Card data stays in PayPal; the agent
              never touches it.
            </p>
            <ul className="mt-6 space-y-3">
              {pillars.map((p) => (
                <li key={p.title} className="flex gap-3">
                  <span
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-paypal-blue"
                    aria-hidden
                  />
                  <div>
                    <p className="font-semibold text-ink">{p.title}</p>
                    <p className="text-sm text-ink/65">{p.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-mist border border-paypal-blue/15 p-6 sm:p-8 font-mono text-sm">
            <p className="text-ink/50 text-xs uppercase tracking-wider mb-4">
              Example session
            </p>
            <div className="space-y-3">
              <p className="text-paypal-navy">
                <span className="text-ink/40">you →</span> wireless earbuds under $80
              </p>
              <p className="text-ink/80">
                <span className="text-ink/40">ShopPal →</span> 3 options with prices…
              </p>
              <p className="text-paypal-navy">
                <span className="text-ink/40">you →</span> I&apos;ll take the second one
              </p>
              <p className="text-ink/80">
                <span className="text-ink/40">ShopPal →</span> Reply{" "}
                <strong className="text-ink">yes, pay</strong> to open PayPal
              </p>
              <p className="rounded-lg bg-white border border-success/30 text-success px-3 py-2 text-xs">
                Payment COMPLETED · sandbox order ID
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center rounded-3xl bg-gradient-to-br from-paypal-navy to-paypal-blue text-white px-6 py-12 sm:px-12">
          <h2 className="text-2xl sm:text-3xl font-bold">Ready to shop by conversation?</h2>
          <p className="mt-3 text-white/85">
            No account required for the demo. Use sandbox PayPal or simulate payment
            locally.
          </p>
          <Link
            href="/chat"
            className="inline-block mt-8 rounded-full bg-white text-paypal-navy px-8 py-3.5 font-semibold hover:bg-white/95 transition"
          >
            Launch ShopPal chat
          </Link>
        </div>
      </section>

      <footer className="mt-auto py-8 px-4 border-t border-black/5 text-center text-sm text-ink/55">
        <p>
          ShopPal — open source demo for the{" "}
          <a
            href="https://paypalaihackathon.devpost.com/"
            className="text-paypal-blue hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            PayPal AI Hackathon
          </a>
        </p>
      </footer>
    </div>
  );
}

function HeroPreview() {
  return (
    <div className="relative max-w-lg mx-auto mt-14 sm:mt-16 px-4">
      <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-4 sm:p-5 text-left shadow-2xl">
        <div className="flex gap-2 mb-3">
          <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
        </div>
        <div className="space-y-3 text-sm">
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-paypal-navy/80 px-3 py-2 text-white">
            Wireless earbuds under $80
          </div>
          <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-white px-3 py-2 text-ink shadow">
            Here are 3 options in your budget…
          </div>
          <div className="rounded-lg bg-warning/20 border border-warning/40 px-3 py-2 text-xs text-ink/90">
            Say <strong>yes, pay</strong> to continue to PayPal
          </div>
        </div>
      </div>
    </div>
  );
}
