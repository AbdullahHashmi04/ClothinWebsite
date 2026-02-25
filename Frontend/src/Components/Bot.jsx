import { Axis3DIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function formatTime(d) {
  return new Intl.DateTimeFormat([], { hour: "2-digit", minute: "2-digit" }).format(d);
}

export default function ChatWidget({
  botName = "Shop Assistant",
  // 👇 control panel size here (Tailwind classes)
  panelWidth = "sm:w-[380px] w-[calc(100vw-2rem)]",
  panelHeight = "sm:h-[520px] h-[70vh] max-h-[640px]",
  positionClass = "bottom-4 right-4",
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => [
    {
      id: crypto.randomUUID(),
      role: "assistant",
      text: "Hi! 👋I am RAZ, I can help with orders, shipping, and product questions.",
      createdAt: new Date(),
    },
  ]);

  const listRef = useRef(null);
  const textareaRef = useRef(null);

  const canSend = useMemo(() => input.trim().length > 0, [input]);

  // Close on Escape
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  // Auto-grow textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = Math.min(140, ta.scrollHeight) + "px";
  }, [input]);

  async function sendMessage(userMessage) {
    const userMsgObj = {
      id: Date.now(),
      role: "user",
      text: userMessage,
      createdAt: new Date()
    };

    setMessages((prev) => [...prev, userMsgObj]);
    setInput("")
    try {
      const res = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await res.json();
      console.log(data)

      const aiMsgObj = {
        id: Date.now() + 1,
        role: "ai",
        text: data,
        createdAt: new Date()
      };

      setMessages((prev) => [...prev, aiMsgObj]);
    } catch (err) {
      console.error(err);
    }
  }


  function onSubmit(e) {
    e.preventDefault();
    if (!canSend) return;
    sendMessage(input);
  }

  function onKeyDownTextarea(e) {
    // Enter sends, Shift+Enter newline
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!canSend) return;
      sendMessage(input);
    }
  }

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <div className={cn("fixed z-50", positionClass)}>
      <div className="flex flex-row items-end gap-2">
        <div
          id="chat-panel"
          role="dialog"
          aria-label={`${botName} chat`}
          className={cn(
            "origin-bottom-right transition-all duration-200 ease-out",
            open
              ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
              : "opacity-0 translate-y-2 scale-95 pointer-events-none"
          )}
        >
          <div
            className={cn(
              "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
              "rounded-2xl shadow-xl overflow-hidden flex flex-col",
              panelWidth,
              panelHeight
            )}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
                <div className="leading-tight">
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {botName}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Online • Replies fast
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                aria-label="Close chat"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50/50 dark:bg-gray-950/30"
            >
              {messages.map((m) => {
                const isUser = m.role === "user";

                return (
                  <div key={m.id} className={cn("flex", isUser ? "justify-end" : "justify-start")}>
                    <div className={cn("max-w-[85%]")}>
                      <div
                        className={cn(
                          "text-sm px-4 py-2 rounded-2xl shadow-sm",
                          isUser
                            ? "bg-indigo-600 text-white rounded-tr-md"
                            : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-md"
                        )}
                      >
                        {m.text}
                      </div>
                      <div
                        className={cn(
                          "mt-1 text-[11px] text-gray-500 dark:text-gray-400",
                          isUser ? "text-right" : "text-left"
                        )}
                      >
                        {formatTime(m.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>

            {/* Input */}
            <form onSubmit={onSubmit} className="border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-end gap-3">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDownTextarea}
                  placeholder="Type your message…"
                  className="w-full resize-none rounded-2xl border border-gray-200 dark:border-gray-800 bg-white
                   dark:bg-gray-900 px-4 py-10 text-sm text-gray-900 dark:text-gray-100 
                   placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!canSend}
                  className={cn(
                    "shrink-0 rounded-2xl px-4 py-3 text-sm font-medium shadow-sm",
                    canSend
                      ? "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white"
                      : "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  )}
                >
                  Send
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* Floating button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="chat-panel"
          className={cn(
            "h-14 w-14 rounded-full shadow-lg",
            "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800",
            "text-white flex items-center justify-center",
            "focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-transparent"
          )}
          title={open ? "Close chat" : "Open chat"}
        >
          {open ? (
            // close icon
            <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            // chat icon
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h3v3l4-3h9a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm0 17H10.17L8 20.62V19H4V4h16v15z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
