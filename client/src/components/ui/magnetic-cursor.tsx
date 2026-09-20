import { useEffect, useRef, useState, type ReactNode } from "react";

import "./magnetic-cursor.css";

type MagneticCursorProps = {
  children: ReactNode;
  magneticFactor?: number;
  blendMode?: React.CSSProperties["mixBlendMode"];
  cursorSize?: number;
};

export function MagneticCursor({ children, magneticFactor = 0.55, blendMode = "exclusion", cursorSize = 40 }: MagneticCursorProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const activeTargetRef = useRef<HTMLElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const update = () => setEnabled(query.matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    const cursor = cursorRef.current;
    if (!root || !cursor) return;
    let frame: number | undefined;
    let pointer = { x: -100, y: -100 };
    let current = { x: -100, y: -100 };

    const render = () => {
      current.x += (pointer.x - current.x) * 0.22;
      current.y += (pointer.y - current.y) * 0.22;
      cursor.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(render);
    };
    const move = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-magnetic]");
      if (target === activeTargetRef.current) return;
      activeTargetRef.current?.style.removeProperty("transform");
      activeTargetRef.current = target;
    };
    const pull = (event: PointerEvent) => {
      const target = activeTargetRef.current;
      if (!target) return;
      const bounds = target.getBoundingClientRect();
      const x = (event.clientX - (bounds.left + bounds.width / 2)) * magneticFactor;
      const y = (event.clientY - (bounds.top + bounds.height / 2)) * magneticFactor;
      target.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const release = () => {
      activeTargetRef.current?.style.removeProperty("transform");
      activeTargetRef.current = null;
    };

    window.addEventListener("pointermove", move);
    root.addEventListener("pointermove", pull);
    root.addEventListener("pointerleave", release);
    frame = requestAnimationFrame(render);
    return () => {
      window.removeEventListener("pointermove", move);
      root.removeEventListener("pointermove", pull);
      root.removeEventListener("pointerleave", release);
      release();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enabled, magneticFactor]);

  return (
    <div ref={rootRef} className={enabled ? "magnetic-cursor-root magnetic-cursor-root--enabled" : "magnetic-cursor-root"}>
      {children}
      {enabled && <span ref={cursorRef} className="magnetic-cursor-dot" style={{ width: cursorSize, height: cursorSize, mixBlendMode: blendMode }} aria-hidden="true" />}
    </div>
  );
}
