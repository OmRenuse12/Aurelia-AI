import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, MicOff, Heart } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  onCompliment: () => void;
  disabled: boolean;
}

const ChatInput = ({ onSend, onCompliment, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [sendAnim, setSendAnim] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    setSendAnim(true);
    setTimeout(() => setSendAnim(false), 300);
    onSend(trimmed);
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  const toggleVoice = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const hasSpeech = typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  return (
    <div className="sticky bottom-0 z-10 p-3 sm:p-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card rounded-2xl flex items-end gap-2 p-2 max-w-3xl mx-auto input-glow transition-shadow duration-300"
      >
        {/* Compliment button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.85 }}
          onClick={onCompliment}
          disabled={disabled}
          className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors disabled:opacity-40 flex-shrink-0"
          title="Get a compliment 💖"
        >
          <Heart size={16} />
        </motion.button>

        <textarea
          ref={inputRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Tell me what's on your mind... 💭"
          rows={1}
          className="flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />

        {/* Voice button */}
        {hasSpeech && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.85 }}
            onClick={toggleVoice}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
              isListening
                ? "gradient-primary text-primary-foreground glow-primary"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {isListening ? <MicOff size={15} /> : <Mic size={15} />}
          </motion.button>
        )}

        {/* Send button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.85 }}
          animate={sendAnim ? { scale: [1, 1.2, 1] } : {}}
          onClick={handleSubmit}
          disabled={disabled || !input.trim()}
          className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground disabled:opacity-40 transition-opacity flex-shrink-0 glow-soft"
        >
          <Send size={15} />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ChatInput;
