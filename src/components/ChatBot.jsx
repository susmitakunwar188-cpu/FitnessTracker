import { useState, useRef, useEffect } from "react";
import { api } from "../utils/api";

const ChatIcon = ({ className = "h-6 w-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const CloseIcon = ({ className = "h-6 w-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SendIcon = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const SUGGESTIONS = [
  "Give me a beginner leg workout",
  "How much protein do I need daily?",
  "Tips to improve sleep & recovery",
  "How should I start a cutting diet?"
];

const formatInline = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-bold text-brand-pink">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i} className="rounded bg-white/10 px-1 py-0.5 font-mono text-[12px] text-accent-cocoa-light">{part.slice(1, -1)}</code>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i} className="italic">{part.slice(1, -1)}</em>;
    }
    return part;
  });
};

const renderMessage = (content) => {
  const lines = content.split("\n");
  const blocks = [];
  let list = [];

  const flushList = (key) => {
    if (list.length > 0) {
      blocks.push(
        <ul key={key} className="mb-1.5 space-y-1 pl-1">
          {list.map((item, li) => (
            <li key={li} className="flex items-start gap-1.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-pink"></span>
              <span className="flex-1">{formatInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      list = [];
    }
  };

  lines.forEach((line, idx) => {
    const heading = line.match(/^(#{1,3})\s+(.*)/);
    if (heading) {
      flushList(`ul-${idx}`);
      blocks.push(
        <p key={idx} className="mb-1 mt-2 font-display font-bold text-text-primary">
          {formatInline(heading[2])}
        </p>
      );
      return;
    }
    const bullet = line.match(/^[-*]\s+(.*)/);
    if (bullet) {
      list.push(bullet[1]);
      return;
    }
    if (line.trim() === "") {
      flushList(`ul-${idx}`);
      return;
    }
    flushList(`ul-${idx}`);
    blocks.push(
      <p key={idx} className="mb-1">{formatInline(line)}</p>
    );
  });
  flushList("ul-end");
  return blocks;
};

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  const sendMessage = async (text) => {
    const trimmed = (text || "").trim();
    if (!trimmed || loading) return;

    const userMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const data = await api.sendChat(trimmed, history);
      setMessages([...nextMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages([
        ...nextMessages,
        { role: "assistant", content: `⚠️ ${err.message || "Something went wrong. Please try again."}` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating launcher */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open Fitique AI chat"
        className="fixed bottom-6 right-6 z-[100] flex h-16 w-16 items-center justify-center rounded-full bg-brand-pink text-white shadow-lg transition duration-300 hover:bg-brand-pink-hover cursor-pointer"
      >
        {open ? <CloseIcon className="h-7 w-7" /> : <ChatIcon className="h-7 w-7" />}
      </button>

      {/* Chat window */}
      {open && (
          <div className="fixed bottom-24 right-6 z-[100] flex h-[560px] max-h-[calc(100vh-8rem)] w-[380px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-brand-pink/25 bg-card-dark/95 backdrop-blur-2xl animate-fadeIn">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border-pink/40 bg-sidebar-gradient px-5 py-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-pink text-white">
              <ChatIcon className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-base font-bold text-text-primary leading-none">Fitique AI</h3>
              <p className="mt-1 flex items-center gap-1.5 text-[12px] font-semibold text-green-400">
                <span className="h-2 w-2 rounded-full bg-green-400"></span> Online · fitness coach
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-xl p-2 text-text-muted transition hover:bg-white/10 hover:text-text-primary cursor-pointer"
              aria-label="Close chat"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={bodyRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5 custom-scrollbar">
            {messages.length === 0 && (
              <div className="text-center">
                <p className="mb-1 font-display text-sm font-bold text-text-primary">Hey! I'm Fitique AI 💪</p>
                <p className="mb-5 text-xs leading-relaxed text-text-muted">
                  Ask me anything about workouts, nutrition, or recovery.
                </p>
                <div className="space-y-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="w-full rounded-xl border border-brand-cocoa/30 bg-brand-cocoa/10 px-4 py-2.5 text-left text-xs font-semibold text-accent-cocoa-light transition hover:border-brand-cocoa hover:bg-brand-cocoa/20 cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-md whitespace-pre-wrap bg-brand-pink text-white"
                      : "rounded-bl-md border border-border-pink/40 bg-bg-dark/70 text-text-primary"
                  }`}
                >
                  {m.role === "user" ? m.content : renderMessage(m.content)}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-border-pink/40 bg-bg-dark/70 px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-brand-pink" style={{ animationDelay: "0ms" }}></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-brand-pink" style={{ animationDelay: "150ms" }}></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-brand-pink" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="border-t border-border-pink/40 bg-bg-dark/60 p-3"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-border-pink/60 bg-bg-dark/80 p-1.5 focus-within:border-brand-pink">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about workouts, nutrition..."
                className="flex-1 bg-transparent px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/70 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-pink text-white transition hover:bg-brand-pink-hover disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                aria-label="Send message"
              >
                <SendIcon />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default ChatBot;
