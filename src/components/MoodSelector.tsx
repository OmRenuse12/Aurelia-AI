import { motion } from "framer-motion";

export type Mood = "happy" | "sad" | "love" | "calm";

interface MoodSelectorProps {
  activeMood: Mood;
  onSelect: (mood: Mood) => void;
}

const moods: { key: Mood; emoji: string; label: string }[] = [
  { key: "happy", emoji: "😊", label: "Happy" },
  { key: "sad", emoji: "😔", label: "Sad" },
  { key: "love", emoji: "🥰", label: "Love" },
  { key: "calm", emoji: "🌙", label: "Calm" },
];

const MoodSelector = ({ activeMood, onSelect }: MoodSelectorProps) => (
  <div className="flex items-center gap-1.5">
    {moods.map(({ key, emoji, label }) => (
      <motion.button
        key={key}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onSelect(key)}
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all ${
          activeMood === key
            ? "glass-card glow-soft text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
        title={label}
      >
        <span className="text-sm">{emoji}</span>
        <span className="hidden sm:inline">{label}</span>
      </motion.button>
    ))}
  </div>
);

export default MoodSelector;
