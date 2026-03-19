import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const quotes = [
  "You are doing better than you think 💖",
  "Your feelings are valid and beautiful ✨",
  "Be gentle with yourself today 🌸",
  "You deserve all the love in the world 💕",
  "Every small step counts, darling ✨",
  "You're stronger than you know 🌷",
  "Take a deep breath — you're enough 💗",
  "The world is brighter with you in it 🌸",
  "You're writing a beautiful story 💖",
  "Shine bright, you're amazing ✨",
];

const DailyQuote = () => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const dayIndex = new Date().getDate() % quotes.length;
    setQuote(quotes[dayIndex]);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-center py-2 px-4"
      >
        <p className="text-xs text-muted-foreground italic tracking-wide">
          ✨ {quote}
        </p>
      </motion.div>
    </AnimatePresence>
  );
};

export default DailyQuote;
