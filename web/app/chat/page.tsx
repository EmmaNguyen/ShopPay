import { Chat } from "@/components/Chat";
import { SiteHeader } from "@/components/SiteHeader";

export default function ChatPage() {
  return (
    <main className="min-h-screen flex flex-col bg-mist">
      <SiteHeader variant="app" />
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-6">
        <p className="text-sm text-ink/55 mb-4 text-center">
          Sandbox only · explicit confirm before payment
        </p>
        <Chat />
      </div>
    </main>
  );
}
