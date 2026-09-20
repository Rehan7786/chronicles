import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { type CSSProperties, useRef } from "react";
import type { LucideIcon } from "lucide-react";
import "./hero-parallax.css";

export type ArchiveParallaxItem = {
  id: string;
  category: string;
  title: string;
  detail: string;
  date: string;
  accent: string;
  Icon: LucideIcon;
};

type HeroParallaxProps = {
  items: ArchiveParallaxItem[];
  onSelect: (id: string) => void;
};

type ArchiveCardProps = {
  item: ArchiveParallaxItem;
  scrollProgress: MotionValue<number>;
  direction: number;
  index: number;
  onSelect: (id: string) => void;
  reduceMotion: boolean | null;
};

function ArchiveCard({
  item,
  scrollProgress,
  direction,
  index,
  onSelect,
  reduceMotion,
}: ArchiveCardProps) {
  const { Icon } = item;
  const springConfig = { stiffness: 170, damping: 26, bounce: 0 };
  const stagger = index - 1;
  const x = useSpring(
    useTransform(scrollProgress, [0, 0.22, 0.72, 1], [
      direction * (32 + stagger * 10),
      direction * -4,
      direction * (15 - stagger * 7),
      direction * -58,
    ]),
    springConfig
  );
  const y = useSpring(
    useTransform(scrollProgress, [0, 0.22, 0.72, 1], [
      28 + index * 9,
      0,
      -7 - index * 3,
      -30,
    ]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollProgress, [0, 0.22, 0.72, 1], [
      direction * (1.8 + stagger * 0.5),
      0,
      direction * -0.7,
      direction * -1.5,
    ]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollProgress, [0, 0.18, 0.82, 1], [0.15, 1, 1, 0.82]),
    springConfig
  );

  return (
    <motion.button
      type="button"
      className="archive-parallax__card"
      style={
        {
          x: reduceMotion ? 0 : x,
          y: reduceMotion ? 0 : y,
          rotateZ: reduceMotion ? 0 : rotateZ,
          opacity: reduceMotion ? 1 : opacity,
          "--archive-accent": item.accent,
        } as CSSProperties
      }
      whileHover={reduceMotion ? undefined : { y: -14, scale: 1.015 }}
      onClick={() => onSelect(item.id)}
      aria-label={`Open ${item.category} record: ${item.title}`}
    >
      <span className="archive-parallax__card-glow" />
      <span className="archive-parallax__card-topline">
        <span>
          <Icon size={15} strokeWidth={1.5} /> {item.category}
        </span>
        <span>{item.date}</span>
      </span>
      <strong>{item.title}</strong>
      <span className="archive-parallax__card-detail">{item.detail}</span>
      <span className="archive-parallax__card-link">
        Open record <span aria-hidden="true">↗</span>
      </span>
    </motion.button>
  );
}

export function HeroParallax({ items, onSelect }: HeroParallaxProps) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const springConfig = { stiffness: 180, damping: 28, bounce: 0 };
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.25], [10, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.35, 1]),
    springConfig
  );

  const rows = [items.slice(0, 3), items.slice(3, 6), items.slice(6, 9)];

  return (
    <section
      className="archive-parallax"
      ref={ref}
      aria-labelledby="archive-stream-title"
    >
      <div className="archive-parallax__sticky">
        <div className="archive-parallax__header">
          <div>
            <p className="eyebrow">Archive stream / all records</p>
            <h2 id="archive-stream-title">
              Every trace,
              <br />
              <em>in motion.</em>
            </h2>
          </div>
          <p>
            Scroll through the complete sample. Select any record to inspect its
            connected thread.
          </p>
        </div>
        <motion.div
          className="archive-parallax__plane"
          style={{
            rotateX: reduceMotion ? 0 : rotateX,
            opacity: reduceMotion ? 1 : opacity,
          }}
        >
          {rows.map((row, index) => (
            <div
              className={
                index % 2 === 0
                  ? "archive-parallax__row archive-parallax__row--reverse"
                  : "archive-parallax__row"
              }
              key={`row-${index}`}
            >
              {row.map((item, cardIndex) => (
                <ArchiveCard
                  item={item}
                  key={item.id}
                  scrollProgress={scrollYProgress}
                  direction={index % 2 === 0 ? 1 : -1}
                  index={cardIndex}
                  onSelect={onSelect}
                  reduceMotion={reduceMotion}
                />
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
