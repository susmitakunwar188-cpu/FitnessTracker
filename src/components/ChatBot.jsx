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
        className="fixed bottom-6 right-6 z-[100] flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-pink to-brand-cocoa text-white shadow-[0_12px_30px_rgba(255,46,147,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(255,46,147,0.6)] cursor-pointer"
      >
        {open ? <CloseIcon className="h-7 w-7" /> : <ChatIcon className="h-7 w-7" />}
        {!open && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-cocoa opacity-60"></span>
            <span className="relative inline-flex h-4 w-4 rounded-full bg-brand-cocoa"></span>
          </span>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-[100] flex h-[560px] max-h-[calc(100vh-8rem)] w-[380px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-[1.75rem] border border-brand-pink/30 bg-card-dark/95 shadow-[0_30px_80px_rgba(0,0,0,0.7)] backdrop-blur-2xl animate-fadeIn">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border-pink/40 bg-sidebar-gradient px-5 py-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-pink to-brand-cocoa text-white shadow-lg shadow-brand-pink/30">
              <ChatIcon className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-base font-bold text-white leading-none">Fitique AI</h3>
              <p className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-green-400">
                <span className="h-2 w-2 rounded-full bg-green-400"></span> Online · fitness coach
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-xl p-2 text-text-muted transition hover:bg-white/5 hover:text-white cursor-pointer"
              aria-label="Close chat"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={bodyRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5 custom-scrollbar">
            {messages.length === 0 && (
              <div className="text-center">
                <p className="mb-1 font-display text-sm font-bold text-white">Hey! I'm Fitique AI 💪</p>
                <p className="mb-5 text-xs leading-relaxed text-text-muted">
                  Ask me anything about workouts, nutrition, or recovery.
                </p>
                <div className="space-y-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="w-full rounded-xl border border-brand-cocoa/30 bg-brand-cocoa/10 px-4 py-2.5 text-left text-xs font-semibold text-brand-cocoa-light transition hover:border-brand-cocoa hover:bg-brand-cocoa/20 cursor-pointer"
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
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-md bg-gradient-to-br from-brand-pink to-brand-pink-hover text-white shadow-lg shadow-brand-pink/20"
                      : "rounded-bl-md border border-border-pink/40 bg-bg-dark/70 text-white"
                  }`}
                >
                  {m.content}
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
                className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder:text-text-muted/70 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-pink to-brand-cocoa text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
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
