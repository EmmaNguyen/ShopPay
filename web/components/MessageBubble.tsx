type Props = {
  role: "user" | "assistant";
  content: string;
};

function renderMarkdownLite(text: string) {
  return text.split("\n").map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={i} className="block">
        {parts.map((part, j) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={j}>{part.slice(2, -2)}</strong>
            );
          }
          return <span key={j}>{part}</span>;
        })}
      </span>
    );
  });
}

export function MessageBubble({ role, content }: Props) {
  const isUser = role === "user";
  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-message-in`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
          isUser
            ? "bg-paypal-navy text-white rounded-br-md"
            : "bg-surface border border-black/5 text-ink rounded-bl-md shadow-sm"
        }`}
      >
        {renderMarkdownLite(content)}
      </div>
    </div>
  );
}
