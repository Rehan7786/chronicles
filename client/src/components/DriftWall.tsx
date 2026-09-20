import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import "./DriftWall.css";

type DriftWallItem = { image: string; title?: string };

type DriftWallProps = {
  items?: DriftWallItem[];
  columns?: number;
  tileWidth?: number;
  tileHeight?: number;
  gap?: number;
  tilt?: number;
  turn?: number;
  perspective?: number;
  depth?: number;
  speed?: number;
  variance?: number;
  parallax?: number;
  fade?: number;
  dim?: number;
  overlayColor?: string;
  className?: string;
};

const defaultItems = Array.from({ length: 15 }, (_, index) => {
  const ids = [1015, 1025, 1039, 1043, 1044, 1050, 1062, 1069, 1074, 1080, 1084, 106, 110, 133, 164];
  return { image: `https://picsum.photos/id/${ids[index]}/600/400`, title: `Archive image ${index + 1}` };
});

const columnFactor = (index: number, variance: number) => 1 + variance * ((((index * 0.6180339887 + 0.35) % 1) * 2) - 1);

export default function DriftWall({
  items = defaultItems,
  columns = 5,
  tileWidth = 200,
  tileHeight = 132,
  gap = 18,
  tilt = 16,
  turn = -14,
  perspective = 1200,
  depth = 120,
  speed = 42,
  variance = 0.45,
  parallax = 0.6,
  fade = 0.6,
  dim = 0.55,
  overlayColor = "#060010",
  className = "",
}: DriftWallProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const offsetsRef = useRef<number[]>([]);
  const velocitiesRef = useRef<number[]>([]);
  const pointerRef = useRef({ x: 0, y: 0 });
  const dampedPointerRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const [containerHeight, setContainerHeight] = useState(600);
  const [reducedMotion, setReducedMotion] = useState(false);

  const columnItems = useMemo(() => {
    const result = Array.from({ length: columns }, () => [] as DriftWallItem[]);
    items.forEach((item, index) => result[index % columns].push(item));
    return result.map((column) => column.length ? column : items.slice(0, 1));
  }, [items, columns]);
  const columnMeta = useMemo(() => {
    const unit = tileHeight + gap;
    return columnItems.map((column) => {
      const copyHeight = Math.max(unit, column.length * unit);
      return { copyHeight, copies: Math.max(2, Math.ceil((containerHeight * 1.6) / copyHeight) + 1) };
    });
  }, [columnItems, tileHeight, gap, containerHeight]);
  const velocities = useMemo(() => columnItems.map((_, index) => speed * columnFactor(index, variance) * (index % 2 === 0 ? 1 : -1)), [columnItems, speed, variance]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(([entry]) => setContainerHeight(entry.contentRect.height || 600));
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    offsetsRef.current = columnMeta.map((meta, index) => meta.copyHeight * ((index * 0.37) % 1));
    velocitiesRef.current = columnMeta.map(() => 0);
  }, [columnMeta]);

  const updatePlane = useCallback((x: number, y: number) => {
    if (planeRef.current) planeRef.current.style.transform = `translate(-50%, -50%) scale(1.18) rotateX(${tilt + y}deg) rotateY(${turn + x}deg) translateZ(${-depth}px)`;
  }, [tilt, turn, depth]);

  useEffect(() => {
    const animate = (timestamp: number) => {
      const previous = lastTsRef.current ?? timestamp;
      const delta = Math.min(0.05, Math.max(0, timestamp - previous) / 1000);
      lastTsRef.current = timestamp;
      const damping = 1 - Math.exp(-delta / 0.12);
      const maxTilt = parallax * 8;
      dampedPointerRef.current.x += (pointerRef.current.x * maxTilt - dampedPointerRef.current.x) * damping;
      dampedPointerRef.current.y += (-pointerRef.current.y * maxTilt - dampedPointerRef.current.y) * damping;
      updatePlane(dampedPointerRef.current.x, dampedPointerRef.current.y);

      columnMeta.forEach((meta, index) => {
        const target = reducedMotion ? 0 : velocities[index];
        const velocityDamping = 1 - Math.exp(-delta / 0.28);
        velocitiesRef.current[index] += (target - velocitiesRef.current[index]) * velocityDamping;
        const next = ((offsetsRef.current[index] + velocitiesRef.current[index] * delta) % meta.copyHeight + meta.copyHeight) % meta.copyHeight;
        offsetsRef.current[index] = next;
        if (trackRefs.current[index]) trackRefs.current[index]!.style.transform = `translate3d(0, ${-next}px, 0)`;
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [columnMeta, velocities, reducedMotion, parallax, updatePlane]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || reducedMotion) return;
    pointerRef.current = { x: (event.clientX - rect.left) / rect.width - 0.5, y: (event.clientY - rect.top) / rect.height - 0.5 };
  };
  const cssVars = { "--dw-tile-w": `${tileWidth}px`, "--dw-tile-h": `${tileHeight}px`, "--dw-gap": `${gap}px`, "--dw-perspective": `${perspective}px`, "--dw-dim": dim, "--dw-overlay": overlayColor, "--dw-edge": `${Math.max(0, (1 - fade) * 100)}%` } as CSSProperties;

  return (
    <div ref={containerRef} className={`drift-wall ${className}`} style={cssVars} onPointerMove={handlePointerMove} onPointerLeave={() => { pointerRef.current = { x: 0, y: 0 }; }} aria-hidden="true">
      <div ref={planeRef} className="drift-wall__plane">
        {columnItems.map((column, columnIndex) => (
          <div className="drift-wall__col" key={columnIndex}>
            <div className="drift-wall__track" ref={(element) => { trackRefs.current[columnIndex] = element; }}>
              {Array.from({ length: columnMeta[columnIndex]?.copies ?? 2 }, (_, copyIndex) => column.map((item, itemIndex) => (
                <div className="drift-wall__tile" key={`${copyIndex}-${itemIndex}`}><span className="drift-wall__inner"><img src={item.image} alt={item.title ?? ""} loading="lazy" decoding="async" draggable={false} /><span className="drift-wall__overlay" /></span></div>
              )))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
