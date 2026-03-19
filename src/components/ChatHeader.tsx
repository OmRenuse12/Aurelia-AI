import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import MoodSelector, { type Mood } from "./MoodSelector";

interface ChatHeaderProps {
  isDark: boolean;
  onToggleDark: () => void;
  mood: Mood;
  onMoodChange: (mood: Mood) => void;
}

const ChatHeader = ({ isDark, onToggleDark, mood, onMoodChange }: ChatHeaderProps) => (
  <motion.header
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="glass-card sticky top-0 z-10 px-4 py-3"
  >
    <div className="flex items-center justify-between max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center glow-soft animate-pulse-glow">
          <span className="text-lg">✨</span>
        </div>
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight gradient-text">
            Aurelia AI
          </h1>
          <p className="text-[10px] text-muted-foreground -mt-0.5">your soft companion ✨</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <MoodSelector activeMood={mood} onSelect={onMoodChange} />
        <motion.button
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggleDark}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground transition-colors"
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </motion.button>
      </div>
    </div>
  </motion.header>
);

export default ChatHeader;
