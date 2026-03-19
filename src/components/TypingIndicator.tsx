const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-2 h-2 rounded-full bg-primary/60 animate-bounce-dot"
        style={{ animationDelay: `${i * 0.16}s` }}
      />
    ))}
  </div>
);

export default TypingIndicator;
