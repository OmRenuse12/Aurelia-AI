import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  swayDuration: number;
  type: "petal" | "heart" | "sparkle";
  emoji: string;
}

const EMOJIS = {
  petal: ["🌸", "🩷", "🌷", "💮"],
  heart: ["💖", "💗", "💕"],
  sparkle: ["✨", "⭐", "💫"],
};

const PARTICLE_COUNT = 18;

const FloatingPetals = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const types: Particle["type"][] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      if (i < 10) types.push("petal");
      else if (i < 14) types.push("heart");
      else types.push("sparkle");
    }

    setParticles(
      types.map((type, i) => {
        const emojis = EMOJIS[type];
        return {
          id: i,
          x: Math.random() * 100,
          size: type === "sparkle" ? 10 + Math.random() * 8 : 14 + Math.random() * 14,
          duration: type === "sparkle" ? 6 + Math.random() * 8 : 14 + Math.random() * 20,
          delay: Math.random() * 20,
          opacity: 0.3 + Math.random() * 0.4,
          swayDuration: 3 + Math.random() * 4,
          type,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
        };
      })
    );
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute ${p.type === "sparkle" ? "animate-sparkle" : ""}`}
          style={{
            left: `${p.x}%`,
            fontSize: p.size,
            opacity: p.opacity,
            animation:
              p.type === "sparkle"
                ? `sparkle ${p.duration}s ${p.delay}s ease-in-out infinite`
                : `float-up ${p.duration}s ${p.delay}s linear infinite, sway ${p.swayDuration}s ease-in-out infinite`,
            top: p.type === "sparkle" ? `${Math.random() * 80}%` : undefined,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
};

export default FloatingPetals;
