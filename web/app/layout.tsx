import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "ShopPal — Delegate the cart, keep control of the payment",
  description:
    "AI shopping concierge with PayPal sandbox checkout. Built for the PayPal AI Hackathon.",
  openGraph: {
    title: "ShopPal — Agentic checkout with PayPal",
    description:
      "Compare products in chat, confirm, then pay with PayPal.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrains.variable}`}>{children}</body>
    </html>
  );
}
