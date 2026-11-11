import { Chat } from "@/components/Chat";
import { ThanksgivingStrip } from "@/components/ThanksgivingStrip";
import { SiteHeader } from "@/components/SiteHeader";

export default function ChatPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <ThanksgivingStrip variant="light" />
      <SiteHeader variant="app" />
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-4">
        <p className="text-center text-xs font-mono text-ink/45 mb-3 tracking-wide">
          PICK → YES, PAY → PAYPAL
        </p>
        <Chat />
      </div>
    </main>
  );
}
