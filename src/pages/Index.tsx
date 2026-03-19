import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import FloatingPetals from "@/components/FloatingPetals";
import ChatHeader from "@/components/ChatHeader";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import ChatSidebar from "@/components/ChatSidebar";
import DailyQuote from "@/components/DailyQuote";
import TypingIndicator from "@/components/TypingIndicator";
import { useChat } from "@/hooks/useChat";

const Index = () => {
  const {
    chats, activeChat, messages, isLoading, error,
    send, sendCompliment, newChat, selectChat, deleteChat,
    mood, setMood,
  } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDark]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, []);

  return (
    <div className="gradient-bg min-h-screen flex relative overflow-hidden">
      <FloatingPetals />

      <ChatSidebar
        chats={chats}
        activeChatId={activeChat?.id || null}
        onSelect={selectChat}
        onNew={newChat}
        onDelete={deleteChat}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
      />

      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300 ease-out"
        style={{ marginLeft: sidebarOpen ? 256 : 0 }}
      >
        <ChatHeader
          isDark={isDark}
          onToggleDark={() => setIsDark((d) => !d)}
          mood={mood}
          onMoodChange={setMood}
        />
        <DailyQuote />

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 relative z-[1]">
          <div className="max-w-3xl mx-auto">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[55vh] text-center">
                <div className="text-6xl mb-5 animate-pulse-glow rounded-full w-20 h-20 flex items-center justify-center">
                  ✨
                </div>
                <h2 className="font-display text-2xl font-bold gradient-text mb-2">
                  Hey there, lovely 💖
                </h2>
                <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                  I'm Aurelia, your soft AI companion. Tell me what's on your mind — I'm always here for you 🌸
                </p>
                <div className="flex gap-2 mt-6 flex-wrap justify-center">
                  {["How's your day? 🌸", "Tell me a fun fact ✨", "I need motivation 💪", "Make me smile 💖"].map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="glass-card px-4 py-2 rounded-full text-xs text-muted-foreground hover:text-foreground hover:glow-soft transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <AnimatePresence>
              {messages.map((msg, i) => (
                <ChatMessage key={`${activeChat?.id}-${i}`} role={msg.role} content={msg.content} />
              ))}
            </AnimatePresence>
            {isLoading && !(messages.length > 0 && messages[messages.length - 1]?.role === "assistant") && (
              <div className="flex items-start mb-3">
                <div className="w-8 h-8 rounded-full gradient-primary flex-shrink-0 flex items-center justify-center mr-2.5 glow-soft">
                  <span className="text-xs">✨</span>
                </div>
                <div className="ai-bubble rounded-2xl rounded-bl-sm">
                  <TypingIndicator />
                </div>
              </div>
            )}
            {error && (
              <div className="text-center text-sm text-destructive/80 py-2 glass-card rounded-xl mx-auto max-w-sm px-4">{error}</div>
            )}
          </div>
        </div>

        <ChatInput onSend={send} onCompliment={sendCompliment} disabled={isLoading} />
      </div>
    </div>
  );
};

export default Index;
