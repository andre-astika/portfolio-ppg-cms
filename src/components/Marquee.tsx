type MarqueeProps = {
  items: string[];
  reverse?: boolean;
};

export default function Marquee({ items, reverse = false }: MarqueeProps) {
  // Repeat the list enough times so one set is always wider than the
  // viewport, then duplicate that set once more for a seamless loop.
  const repeatCount = Math.max(1, Math.ceil(12 / items.length));
  const set = Array.from({ length: repeatCount }, () => items).flat();
  const doubled = [...set, ...set];

  return (
    <div className="relative flex overflow-hidden border-y border-stone/30 bg-ink py-2">
      <div
        className={`flex shrink-0 items-center gap-10 whitespace-nowrap pr-10 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-10 font-display text-[16px] tracking-wide text-cream/90 md:text-2xl"
          >
            {item}
            <span className="text-clay">&#10022;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
