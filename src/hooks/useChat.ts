import { useState, useCallback, useEffect } from "react";
import type { Mood } from "@/components/MoodSelector";

type Message = { role: "user" | "assistant"; content: string };

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

const STORAGE_KEY = "aurelia-ai-chats";
const ACTIVE_KEY = "aurelia-ai-active";
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function loadChats(): Chat[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadActiveId(): string | null {
  return localStorage.getItem(ACTIVE_KEY);
}

function deriveTitle(messages: Message[]): string {
  const first = messages.find((m) => m.role === "user");
  if (!first) return "New Chat";
  return first.content.slice(0, 30) + (first.content.length > 30 ? "…" : "");
}

export function useChat() {
  const [chats, setChats] = useState<Chat[]>(loadChats);
  const [activeChatId, setActiveChatId] = useState<string | null>(loadActiveId);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mood, setMood] = useState<Mood>("happy");

  const activeChat = chats.find((c) => c.id === activeChatId) || null;
  const messages = activeChat?.messages || [];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (activeChatId) localStorage.setItem(ACTIVE_KEY, activeChatId);
    else localStorage.removeItem(ACTIVE_KEY);
  }, [activeChatId]);

  const updateChatMessages = useCallback((chatId: string, updater: (msgs: Message[]) => Message[]) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== chatId) return c;
        const newMsgs = updater(c.messages);
        return { ...c, messages: newMsgs, title: deriveTitle(newMsgs) };
      })
    );
  }, []);

  const ensureChat = useCallback(() => {
    let chatId = activeChatId;
    if (!chatId) {
      const chat: Chat = { id: generateId(), title: "New Chat", messages: [], createdAt: Date.now() };
      setChats((prev) => [chat, ...prev]);
      setActiveChatId(chat.id);
      chatId = chat.id;
    }
    return chatId;
  }, [activeChatId]);

  const newChat = useCallback(() => {
    const chat: Chat = { id: generateId(), title: "New Chat", messages: [], createdAt: Date.now() };
    setChats((prev) => [chat, ...prev]);
    setActiveChatId(chat.id);
  }, []);

  const selectChat = useCallback((id: string) => setActiveChatId(id), []);

  const deleteChat = useCallback((id: string) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (activeChatId === id) setActiveChatId(null);
  }, [activeChatId]);

  const streamResponse = useCallback(async (chatId: string, allMessages: Message[]) => {
    let assistantSoFar = "";
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: allMessages, mood }),
    });

    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({}));
      throw new Error(errData.error || `Error ${resp.status}`);
    }
    if (!resp.body) throw new Error("No response body");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let nl: number;
      while ((nl = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, nl);
        buffer = buffer.slice(nl + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line.startsWith("data: ")) continue;
        const json = line.slice(6).trim();
        if (json === "[DONE]") break;
        try {
          const parsed = JSON.parse(json);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            assistantSoFar += content;
            const snap = assistantSoFar;
            updateChatMessages(chatId, (msgs) => {
              const last = msgs[msgs.length - 1];
              if (last?.role === "assistant") {
                return msgs.map((m, i) => i === msgs.length - 1 ? { ...m, content: snap } : m);
              }
              return [...msgs, { role: "assistant", content: snap }];
            });
          }
        } catch {
          buffer = line + "\n" + buffer;
          break;
        }
      }
    }
  }, [mood, updateChatMessages]);

  const send = useCallback(async (input: string) => {
    const chatId = ensureChat();
    const userMsg: Message = { role: "user", content: input };
    updateChatMessages(chatId, (msgs) => [...msgs, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      await streamResponse(chatId, [...messages, userMsg]);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [ensureChat, messages, streamResponse, updateChatMessages]);

  const sendCompliment = useCallback(async () => {
    const chatId = ensureChat();
    const userMsg: Message = { role: "user", content: "Give me a sweet, uplifting compliment to brighten my day 💖" };
    updateChatMessages(chatId, (msgs) => [...msgs, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      await streamResponse(chatId, [...messages, userMsg]);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [ensureChat, messages, streamResponse, updateChatMessages]);

  return { chats, activeChat, messages, isLoading, error, send, sendCompliment, newChat, selectChat, deleteChat, mood, setMood };
}
