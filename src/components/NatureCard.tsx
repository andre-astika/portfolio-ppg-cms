"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type NatureCardProps = {
  label: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  index: number;
};

export default function NatureCard({
  label,
  title,
  description,
  image,
  alt,
  index,
}: NatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group overflow-hidden rounded-2xl border border-stone/30 bg-white-warm shadow-[0_1px_2px_rgba(92,52,72,0.06)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <span className="absolute left-4 top-4 rounded-full border border-white-warm/70 bg-ink/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cream backdrop-blur-sm">
          {label}
        </span>
      </div>
      <div className="p-6">
        <h3 className="font-display text-[16px] text-ink">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
