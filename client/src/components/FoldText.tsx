import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./FoldText.css";

gsap.registerPlugin(ScrollTrigger);

type Hinge = "top" | "bottom" | "left" | "right";
type SplitBy = "char" | "word" | "line";
type Trigger = "mount" | "hover" | "scroll" | "loop";

type FoldTextProps = {
  text: string;
  splitBy?: SplitBy;
  hinge?: Hinge;
  duration?: number;
  stagger?: number;
  ease?: string;
  perspective?: number;
  creaseShading?: number;
  trigger?: Trigger;
  fontSize?: string | number;
  fontWeight?: string | number;
  color?: string;
  accentText?: string;
  accentColor?: string;
  className?: string;
  style?: CSSProperties;
};

const hingeConfig = {
  top: { origin: "50% 0%", rotateX: -92, rotateY: 0 },
  bottom: { origin: "50% 100%", rotateX: 92, rotateY: 0 },
  left: { origin: "0% 50%", rotateX: 0, rotateY: 92 },
  right: { origin: "100% 50%", rotateX: 0, rotateY: -92 },
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export default function FoldText({
  text,
  splitBy = "char",
  hinge = "top",
  duration = 0.65,
  stagger = 0.045,
  ease = "power3.out",
  perspective = 700,
  creaseShading = 0.55,
  trigger = "mount",
  fontSize = 80,
  fontWeight = 800,
  color = "#f7f2e8",
  accentText,
  accentColor = "#df4f55",
  className = "",
  style = {},
}: FoldTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const config = hingeConfig[hinge];
  const safeCrease = clamp(creaseShading, 0, 1);
  const safePerspective = Math.max(120, perspective);

  const segments = useMemo(() => {
    const createSegment = (
      content: string,
      key: string,
      split = splitBy,
      accent = false
    ) => (
      <span
        className="fold-text-segment"
        data-fold-split={split}
        key={key}
        style={
          { "--fold-perspective": `${safePerspective}px` } as CSSProperties
        }
      >
        <span
          className={
            accent
              ? "fold-text-piece fold-text-piece--accent"
              : "fold-text-piece"
          }
          data-fold-hinge={hinge}
          style={
            {
              transformOrigin: config.origin,
              "--fold-crease": 0,
            } as CSSProperties
          }
        >
          {content || "\u00A0"}
        </span>
      </span>
    );

    if (splitBy === "line") {
      return text.split("\n").map((line, index) => (
        <span className="fold-text-line" key={`line-${index}`}>
          {createSegment(line || "\u00A0", `segment-line-${index}`, "line")}
        </span>
      ));
    }

    if (splitBy === "word") {
      return text.split(/(\s+)/).map((part, index) => {
        if (!part) return null;
        if (/^\s+$/.test(part))
          return (
            <span className="fold-text-whitespace" key={`space-${index}`}>
              {part.replace(/ /g, "\u00A0")}
            </span>
          );
        return createSegment(
          part,
          `segment-word-${index}`,
          splitBy,
          part === accentText
        );
      });
    }

    const accentStart = accentText ? text.indexOf(accentText) : -1;
    return Array.from(text).map((char, index) =>
      char === "\n" ? (
        <br key={`br-${index}`} />
      ) : (
        createSegment(
          char === " " ? "\u00A0" : char,
          `segment-char-${index}`,
          splitBy,
          accentStart >= 0 &&
            index >= accentStart &&
            index < accentStart + accentText!.length
        )
      )
    );
  }, [text, splitBy, hinge, config.origin, safePerspective, accentText]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const pieces = Array.from(
      root.querySelectorAll<HTMLElement>(".fold-text-piece")
    );
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const fromVars = {
      opacity: 0,
      rotateX: reduceMotion ? 0 : config.rotateX,
      rotateY: reduceMotion ? 0 : config.rotateY,
      "--fold-crease": reduceMotion ? 0 : safeCrease,
      transformOrigin: config.origin,
      force3D: true,
    };
    const toVars = {
      opacity: 1,
      rotateX: 0,
      rotateY: 0,
      "--fold-crease": 0,
      duration: reduceMotion ? Math.min(duration, 0.22) : duration,
      ease: reduceMotion ? "power1.out" : ease,
      stagger: reduceMotion ? Math.min(stagger, 0.02) : stagger,
    };
    const stop = () => {
      timelineRef.current?.kill();
      gsap.killTweensOf(pieces);
    };
    const play = (repeat = false) => {
      stop();
      timelineRef.current = gsap.timeline({
        repeat: repeat ? -1 : 0,
        repeatDelay: repeat ? 0.75 : 0,
      });
      timelineRef.current.fromTo(pieces, fromVars, toVars);
    };

    let scrollTrigger: ScrollTrigger | undefined;
    let hoverHandler: (() => void) | undefined;
    if (trigger === "hover") {
      gsap.set(pieces, {
        opacity: 1,
        rotateX: 0,
        rotateY: 0,
        "--fold-crease": 0,
      });
      hoverHandler = () => play();
      root.addEventListener("mouseenter", hoverHandler);
    } else if (trigger === "scroll") {
      gsap.set(pieces, fromVars);
      scrollTrigger = ScrollTrigger.create({
        trigger: root,
        start: "top 82%",
        once: true,
        onEnter: () => play(),
      });
    } else {
      play(trigger === "loop");
    }

    return () => {
      if (hoverHandler) root.removeEventListener("mouseenter", hoverHandler);
      scrollTrigger?.kill();
      stop();
    };
  }, [
    text,
    splitBy,
    hinge,
    duration,
    stagger,
    ease,
    perspective,
    safeCrease,
    trigger,
    config,
  ]);

  return (
    <span
      ref={rootRef}
      className={`fold-text ${className}`.trim()}
      style={
        {
          "--fold-text-font-size":
            typeof fontSize === "number" ? `${fontSize}px` : fontSize,
          "--fold-text-font-weight": fontWeight,
          "--fold-text-color": color,
          "--fold-accent-color": accentColor,
          ...style,
        } as CSSProperties
      }
    >
      <span className="fold-text-sr-only">{text}</span>
      <span className="fold-text-visual" aria-hidden="true">
        {segments}
      </span>
    </span>
  );
}
