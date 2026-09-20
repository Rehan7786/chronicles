import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  CircleDot,
  Clock3,
  Compass,
  Headphones,
  MapPin,
  MoreHorizontal,
  Music2,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Sun,
  Moon,
  X,
} from "lucide-react";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DriftWall from "@/components/DriftWall";
import { MagneticCursor } from "@/components/ui/magnetic-cursor";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { useTheme } from "@/contexts/ThemeContext";

const FoldText = lazy(() => import("@/components/FoldText"));

type Category = "All" | "Music" | "Household" | "Transactions";

type Moment = {
  id: string;
  category: Exclude<Category, "All">;
  title: string;
  detail: string;
  time: string;
  date: string;
  place: string;
  x: number;
  y: number;
  accent: string;
  Icon: typeof Music2;
};

const categoryMeta: Record<
  Category,
  { accent: string; Icon: typeof Music2; short: string }
> = {
  All: { accent: "#d9c7ff", Icon: CircleDot, short: "All traces" },
  Music: { accent: "#a98cff", Icon: Music2, short: "Music" },
  Household: { accent: "#f1a35e", Icon: ShoppingBag, short: "Household" },
  Transactions: { accent: "#61d8df", Icon: Compass, short: "Transactions" },
};

const moments: Moment[] = [
  {
    id: "on-the-way-home",
    category: "Music",
    title: "On The Way Home",
    detail: "John Mayer · Paradise Valley · 1 second played",
    time: "11:06 PM",
    date: "15 December 2024",
    place: "Spotify listening history",
    x: 145,
    y: 118,
    accent: categoryMeta.Music.accent,
    Icon: Music2,
  },
  {
    id: "magical-mystery-tour",
    category: "Music",
    title: "Magical Mystery Tour",
    detail: "The Beatles · Remastered 2009 · 2 seconds played",
    time: "11:06 PM",
    date: "15 December 2024",
    place: "Spotify listening history",
    x: 285,
    y: 172,
    accent: categoryMeta.Music.accent,
    Icon: Music2,
  },
  {
    id: "stop-this-train",
    category: "Music",
    title: "Stop This Train — Live",
    detail: "John Mayer · Where the Light Is · 1 second played",
    time: "11:06 PM",
    date: "15 December 2024",
    place: "Spotify listening history",
    x: 544,
    y: 108,
    accent: categoryMeta.Music.accent,
    Icon: Music2,
  },
  {
    id: "dont-trust-myself",
    category: "Music",
    title: "I Don't Trust Myself",
    detail: "John Mayer · Continuum · 1 second played",
    time: "11:06 PM",
    date: "15 December 2024",
    place: "Spotify listening history",
    x: 254,
    y: 333,
    accent: categoryMeta.Music.accent,
    Icon: Music2,
  },
  {
    id: "god-only-knows",
    category: "Music",
    title: "God Only Knows — Mono",
    detail: "The Beach Boys · Pet Sounds · 2 seconds played",
    time: "11:06 PM",
    date: "15 December 2024",
    place: "Spotify listening history",
    x: 514,
    y: 319,
    accent: categoryMeta.Music.accent,
    Icon: Music2,
  },
  {
    id: "train",
    category: "Household",
    title: "Train fare",
    detail: "Transportation · ₹30 expense",
    time: "12:04 PM",
    date: "20 September 2018",
    place: "Daily household transactions",
    x: 86,
    y: 273,
    accent: categoryMeta.Household.accent,
    Icon: ShoppingBag,
  },
  {
    id: "idli",
    category: "Household",
    title: "Idli medu vada",
    detail: "Food · ₹60 expense",
    time: "12:03 PM",
    date: "20 September 2018",
    place: "Daily household transactions",
    x: 617,
    y: 241,
    accent: categoryMeta.Household.accent,
    Icon: ShoppingBag,
  },
  {
    id: "netflix",
    category: "Household",
    title: "Netflix subscription",
    detail: "Subscription · ₹199 expense",
    time: "All day",
    date: "19 September 2018",
    place: "Daily household transactions",
    x: 369,
    y: 408,
    accent: categoryMeta.Household.accent,
    Icon: ShoppingBag,
  },
  {
    id: "entertainment-transaction",
    category: "Transactions",
    title: "Entertainment transaction",
    detail: "₹9,139.49 recorded in the augmented India transaction dataset",
    time: "7:02 AM",
    date: "7 July 2023",
    place: "India transaction dataset",
    x: 694,
    y: 396,
    accent: categoryMeta.Transactions.accent,
    Icon: Compass,
  },
];

const edges: [string, string][] = [
  ["on-the-way-home", "magical-mystery-tour"],
  ["magical-mystery-tour", "stop-this-train"],
  ["stop-this-train", "dont-trust-myself"],
  ["dont-trust-myself", "god-only-knows"],
  ["train", "idli"],
  ["idli", "netflix"],
  ["netflix", "entertainment-transaction"],
];

const storyMoments = moments.filter(moment =>
  [
    "on-the-way-home",
    "magical-mystery-tour",
    "stop-this-train",
    "dont-trust-myself",
    "god-only-knows",
  ].includes(moment.id)
);

gsap.registerPlugin(ScrollTrigger);

const memoryPoints = [
  [8, 16],
  [18, 74],
  [28, 36],
  [39, 82],
  [51, 18],
  [62, 68],
  [76, 27],
  [89, 77],
  [94, 42],
  [68, 47],
  [11, 48],
  [83, 12],
];

function MemoryField({ dense = false }: { dense?: boolean }) {
  return (
    <div
      className={dense ? "memory-field memory-field--dense" : "memory-field"}
      aria-hidden="true"
    >
      {memoryPoints.map(([left, top], index) => (
        <motion.span
          className="memory-point"
          key={`${left}-${top}`}
          style={{ left: `${left}%`, top: `${top}%` }}
          animate={{
            opacity: [0.18, 0.54, 0.2],
            scale: [0.86, 1.14, 0.9],
            y: [0, index % 2 === 0 ? -10 : 8, 0],
          }}
          transition={{
            duration: 5.5 + (index % 3) * 1.2,
            delay: index * 0.23,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <span className="memory-line memory-line--one" />
      <span className="memory-line memory-line--two" />
      <span className="memory-line memory-line--three" />
    </div>
  );
}

function AmbientBackdrop({ className = "" }: { className?: string }) {
  return (
    <div className={`ambient-backdrop ${className}`.trim()} aria-hidden="true">
      <span className="ambient-backdrop__orb ambient-backdrop__orb--one" />
      <span className="ambient-backdrop__orb ambient-backdrop__orb--two" />
      <span className="ambient-backdrop__orb ambient-backdrop__orb--three" />
      <span className="ambient-backdrop__grid" />
    </div>
  );
}

/** A GSAP-only backdrop for the archive; the landing page keeps its own art direction. */
function ArchiveMotionBackground({ reducedMotion }: { reducedMotion: boolean }) {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || !backgroundRef.current) return;

    const context = gsap.context(() => {
      const orbit = (selector: string, x: number, y: number, duration: number) => {
        gsap.to(selector, {
          xPercent: x,
          yPercent: y,
          scale: 1.08,
          duration,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      };

      orbit(".app-motion-bg__orb--violet", 18, 12, 13);
      orbit(".app-motion-bg__orb--cyan", -15, 18, 16);
      orbit(".app-motion-bg__orb--rose", 12, -16, 15);

      gsap.to(".app-motion-bg__line", {
        strokeDashoffset: -180,
        duration: 18,
        ease: "none",
        repeat: -1,
      });
      gsap.to(".app-motion-bg__particle", {
        keyframes: [
          { y: -18, opacity: 0.8, duration: 2.4 },
          { y: 12, opacity: 0.2, duration: 2.4 },
        ],
        stagger: 0.18,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, backgroundRef);

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <div ref={backgroundRef} className="app-motion-bg" aria-hidden="true">
      <span className="app-motion-bg__orb app-motion-bg__orb--violet" />
      <span className="app-motion-bg__orb app-motion-bg__orb--cyan" />
      <span className="app-motion-bg__orb app-motion-bg__orb--rose" />
      <svg className="app-motion-bg__constellation" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <path className="app-motion-bg__line" d="M-80 648 C236 492 388 768 640 552 S1070 292 1520 472" />
        <path className="app-motion-bg__line app-motion-bg__line--fine" d="M-40 246 C302 418 476 174 738 350 S1132 582 1480 236" />
      </svg>
      <div className="app-motion-bg__particles">
        {Array.from({ length: 12 }, (_, index) => (
          <span className="app-motion-bg__particle" key={index} />
        ))}
      </div>
    </div>
  );
}

function ArchiveScrollEffects({ reducedMotion }: { reducedMotion: boolean }) {
  const effectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || !effectsRef.current) return;

    const context = gsap.context(() => {
      gsap.to(".archive-scroll-progress__fill", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".app-shell",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35,
        },
      });

      const reveal = (target: string, y = 42) => {
        gsap.fromTo(
          target,
          { autoAlpha: 0, y, clipPath: "inset(0 0 100% 0)" },
          {
            autoAlpha: 1,
            y: 0,
            clipPath: "inset(0 0 0% 0)",
            duration: 1,
            ease: "power4.out",
            scrollTrigger: { trigger: target, start: "top 82%", once: true },
          }
        );
      };

      reveal(".section-intro", 28);
      reveal(".graph-layout", 54);
      reveal(".archive-parallax__header", 48);
      reveal(".discoveries-section .section-heading");
      reveal(".about-section .section-heading");
      reveal(".faq-section .section-heading");
      reveal(".app-footer", 34);

      gsap.from(".discoveries-grid .discovery-card", {
        autoAlpha: 0,
        y: 52,
        duration: 0.8,
        stagger: 0.14,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".discoveries-grid",
          start: "top 84%",
          once: true,
        },
      });
      gsap.from(".about-grid > *", {
        autoAlpha: 0,
        y: 36,
        duration: 0.75,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ".about-grid", start: "top 84%", once: true },
      });
      gsap.from(".faq-item", {
        autoAlpha: 0,
        x: -24,
        duration: 0.6,
        stagger: 0.09,
        ease: "power3.out",
        scrollTrigger: { trigger: ".faq-list", start: "top 84%", once: true },
      });
      gsap.to(".sidebar", {
        backgroundColor: "rgba(122, 96, 181, 0.055)",
        scrollTrigger: {
          trigger: ".content-column",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });
    }, effectsRef);

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <div ref={effectsRef} className="archive-scroll-progress" aria-hidden="true">
      <span className="archive-scroll-progress__label">Scroll / archive</span>
      <span className="archive-scroll-progress__track">
        <span className="archive-scroll-progress__fill" />
      </span>
    </div>
  );
}

function Mark() {
  return (
    <div className="brand-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

const rise = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

function Home() {
  const { theme, toggleTheme } = useTheme();
  const reduceMotion = useReducedMotion();
  const [entered, setEntered] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [selectedId, setSelectedId] = useState("magical-mystery-tour");
  const [query, setQuery] = useState("");
  const [storyActive, setStoryActive] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);
  const [storyPaused, setStoryPaused] = useState(false);
  const [activeView, setActiveView] = useState<"graph" | "discoveries">(
    "graph"
  );
  const storyDialogRef = useRef<HTMLDivElement>(null);
  const storyBackRef = useRef<HTMLButtonElement>(null);
  const storyTriggerRef = useRef<HTMLElement | null>(null);

  const selected =
    moments.find(moment => moment.id === selectedId) ?? moments[1];
  const SelectedIcon = selected.Icon;

  const connectedIds = useMemo(() => {
    const connected = new Set<string>();
    edges.forEach(([from, to]) => {
      if (from === selected.id) connected.add(to);
      if (to === selected.id) connected.add(from);
    });
    return connected;
  }, [selected.id]);

  const queryMatches = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return new Set(moments.map(moment => moment.id));
    return new Set(
      moments
        .filter(moment =>
          [moment.title, moment.detail, moment.place, moment.category]
            .join(" ")
            .toLowerCase()
            .includes(trimmed)
        )
        .map(moment => moment.id)
    );
  }, [query]);

  const visibleCount = moments.filter(
    moment =>
      (activeCategory === "All" || moment.category === activeCategory) &&
      queryMatches.has(moment.id)
  ).length;

  useEffect(() => {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#07080d" : "#f6f4fb");
  }, [theme]);

  useEffect(() => {
    if (!entered) return;

    const sections: [string, "graph" | "discoveries"][] = [
      ["memory-graph", "graph"],
      ["discoveries", "discoveries"],
    ];
    const observer = new IntersectionObserver(
      entries => {
        const activeEntry = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const matchingSection = sections.find(
          ([id]) => id === activeEntry?.target.id
        );
        if (matchingSection) setActiveView(matchingSection[1]);
      },
      { rootMargin: "-22% 0px -58%", threshold: [0.05, 0.25, 0.6] }
    );

    sections.forEach(([id]) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [entered]);

  useEffect(() => {
    if (!storyActive || storyPaused) return;
    if (storyIndex >= storyMoments.length) return;
    const timer = window.setTimeout(
      () => setStoryIndex(index => index + 1),
      2100
    );
    return () => window.clearTimeout(timer);
  }, [storyActive, storyIndex, storyPaused]);

  useEffect(() => {
    if (!storyActive) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => storyBackRef.current?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeStory();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = storyDialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [storyActive]);

  const enter = () => {
    setEntered(true);
    window.setTimeout(
      () => document.getElementById("memory-graph")?.focus(),
      500
    );
  };

  const openStory = () => {
    storyTriggerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setStoryIndex(0);
    setStoryPaused(false);
    setStoryActive(true);
  };

  const closeStory = () => {
    setStoryActive(false);
    setStoryIndex(0);
    setStoryPaused(false);
    window.requestAnimationFrame(() => storyTriggerRef.current?.focus());
  };

  const jumpTo = (view: "graph" | "discoveries") => {
    setActiveView(view);
    document
      .getElementById(view === "graph" ? "memory-graph" : "discoveries")
      ?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
  };

  if (!entered) {
    return (
      <MagneticCursor
        magneticFactor={0.55}
        blendMode="exclusion"
        cursorSize={40}
      >
        <main className="landing-page">
          <MemoryField />
          <AmbientBackdrop className="ambient-backdrop--landing" />
          <DriftWall
            className="landing-drift-wall"
            speed={26}
            dim={0.32}
            fade={0.72}
            tilt={12}
            turn={-10}
          />
          <div className="landing-vignette" />
          <header className="landing-header">
            <div className="wordmark" data-magnetic>
              <Mark />
              <span>CHRONICLES</span>
            </div>
            <div className="landing-header-actions">
              <span className="landing-index">ARCHIVE / 01</span>
              <button
                className="theme-toggle"
                type="button"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "dark" ? "bright" : "dark"} theme`}
                title={`Switch to ${theme === "dark" ? "bright" : "dark"} theme`}
              >
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
                <span>{theme === "dark" ? "Bright" : "Dark"}</span>
              </button>
            </div>
          </header>
          <motion.div
            className="landing-content"
            initial="hidden"
            animate="visible"
            transition={{
              staggerChildren: reduceMotion ? 0 : 0.16,
              delayChildren: 0.15,
            }}
          >
            <motion.p className="eyebrow" variants={rise}>
              A multi-source data atlas
            </motion.p>
            <motion.h1 variants={rise}>
              <Suspense
                fallback={
                  <>
                    Every record
                    <br />
                    leaves a trace.
                  </>
                }
              >
                <FoldText
                  text={"Every record\nleaves a trace."}
                  splitBy="char"
                  hinge="top"
                  trigger="scroll"
                  duration={0.65}
                  stagger={0.045}
                  ease="power3.out"
                  perspective={700}
                  creaseShading={0.55}
                  fontSize="clamp(3rem, 10vw, 7rem)"
                  fontWeight={800}
                  color={theme === "dark" ? "#f7f2e8" : "#211b30"}
                  accentText="trace"
                  accentColor="#df4f55"
                  className="landing-fold-text"
                />
              </Suspense>
            </motion.h1>
            <motion.p className="landing-copy" variants={rise}>
              Explore connections across your listening history and transaction
              datasets.
            </motion.p>
            <motion.button
              className="begin-button"
              variants={rise}
              onClick={enter}
            >
              <span>Begin exploring</span>
              <ArrowRight size={16} strokeWidth={1.5} />
            </motion.button>
          </motion.div>
        </main>
      </MagneticCursor>
    );
  }

  return (
    <MagneticCursor magneticFactor={0.55} blendMode="exclusion" cursorSize={40}>
      <main className="app-shell">
        <MemoryField dense />
        <ArchiveMotionBackground reducedMotion={Boolean(reduceMotion)} />
        <ArchiveScrollEffects reducedMotion={Boolean(reduceMotion)} />
        <header className="topbar">
          <div className="wordmark" data-magnetic>
            <Mark />
            <span>CHRONICLES</span>
          </div>
          <div className="topbar-center">
            <span className="topbar-rule" /> <span>PERSONAL ARCHIVE</span>{" "}
            <span className="topbar-rule" />
          </div>
          <div className="topbar-actions">
            <button
              className="theme-toggle"
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "bright" : "dark"} theme`}
              title={`Switch to ${theme === "dark" ? "bright" : "dark"} theme`}
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              <span>{theme === "dark" ? "Bright" : "Dark"}</span>
            </button>
            <label className="search-box">
              <Search size={15} strokeWidth={1.5} />
              <input
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Search traces"
                aria-label="Search traces"
              />
              {query && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </label>
          </div>
        </header>

        <div className="mobile-context">
          <span>2013–2024</span>
          <span className="mobile-context-dot" />{" "}
          <span>{visibleCount} traces in view</span>
        </div>

        <div className="app-layout">
          <aside className="sidebar" aria-label="Archive navigation">
            <div className="sidebar-label">Navigate</div>
            <button
              type="button"
              className={
                activeView === "graph"
                  ? "nav-item nav-item--active"
                  : "nav-item"
              }
              onClick={() => jumpTo("graph")}
              aria-current={activeView === "graph" ? "page" : undefined}
            >
              <Compass size={16} strokeWidth={1.5} />
              <span>Memory graph</span>
              <span className="nav-count">09</span>
            </button>
            <button
              type="button"
              className={
                activeView === "discoveries"
                  ? "nav-item nav-item--active"
                  : "nav-item"
              }
              onClick={() => jumpTo("discoveries")}
              aria-current={activeView === "discoveries" ? "page" : undefined}
            >
              <Sparkles size={16} strokeWidth={1.5} />
              <span>Discoveries</span>
              <span className="nav-count">03</span>
            </button>
            <button type="button" className="nav-item" onClick={openStory}>
              <Clock3 size={16} strokeWidth={1.5} />
              <span>Story mode</span>
              <span className="nav-count">01</span>
            </button>
            <div className="sidebar-divider" />
            <div className="sidebar-label">This archive</div>
            <div className="archive-date">
              2013
              <br />
              <strong>2024</strong>
            </div>
            <p className="sidebar-note">
              Listening and transaction records, connected.
            </p>
            <div className="sidebar-bottom">
              <span className="live-dot" /> <span>Local / private</span>
            </div>
          </aside>

          <section className="content-column">
            <div className="section-intro">
              <div>
                <p className="eyebrow">The memory graph / 01</p>
                <h2>
                  Source records,
                  <br />
                  <em>connected.</em>
                </h2>
              </div>
              <div className="intro-meta">
                <span>03 sources</span>
                <span>{moments.length} records sampled</span>
              </div>
            </div>

            <div className="stats-row" aria-label="Archive overview">
              {[
                ["03", "source datasets", "Spotify + transaction data"],
                [String(moments.length), "records", "shown in this view"],
                ["03", "data types", "music, household, payments"],
                [String(edges.length), "connections", "between nearby records"],
              ].map(([value, label, note], index) => (
                <motion.div
                  className="stat-item"
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + index * 0.06 }}
                >
                  <span className="stat-value">{value}</span>
                  <span className="stat-label">{label}</span>
                  <span className="stat-note">{note}</span>
                </motion.div>
              ))}
            </div>

            <div className="filter-row" role="toolbar" aria-label="Filter by record type">
              <span className="filter-label">Show</span>
              <div className="filter-scroll">
                {(Object.keys(categoryMeta) as Category[]).map(category => {
                  const { Icon, accent, short } = categoryMeta[category];
                  return (
                    <button
                      type="button"
                      key={category}
                      className={
                        activeCategory === category
                          ? "filter-chip filter-chip--active"
                          : "filter-chip"
                      }
                      style={{ "--chip-accent": accent } as React.CSSProperties}
                      onClick={() => setActiveCategory(category)}
                      aria-pressed={activeCategory === category}
                    >
                      <Icon size={13} strokeWidth={1.6} />
                      {short}
                    </button>
                  );
                })}
              </div>
            </div>

            {query && (
              <motion.div
                className="search-summary"
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div>
                  <Search size={13} />
                  <span>
                    Showing traces matching <strong>“{query}”</strong>
                  </span>
                </div>
                <span>
                  {queryMatches.size}{" "}
                  {queryMatches.size === 1 ? "match" : "matches"} · related
                  traces remain visible
                </span>
              </motion.div>
            )}

            <section className="graph-layout" id="memory-graph" tabIndex={-1}>
              <div className="graph-panel">
                <div className="panel-header">
                  <div>
                    <span className="panel-kicker">
                      Constellation / 2013–2024
                    </span>
                    <span className="panel-title">
                      A map of the supplied data
                    </span>
                  </div>
                  <div className="panel-actions">
                    <span className="view-state">
                      <span className="live-dot" /> Live view
                    </span>
                    <button
                      className="icon-button"
                      aria-label="More graph options"
                    >
                      <MoreHorizontal size={17} />
                    </button>
                  </div>
                </div>
                <div className="graph-stage">
                  <div className="graph-axis graph-axis--top">
                    <span>01</span>
                    <span>15</span>
                    <span>31</span>
                  </div>
                  <div className="graph-axis graph-axis--side">
                    <span>AM</span>
                    <span>PM</span>
                  </div>
                  <svg
                    className="graph-lines"
                    viewBox="0 0 720 480"
                    role="img"
                    aria-label="Constellation graph of connected digital memories"
                  >
                    {edges.map(([from, to], index) => {
                      const start = moments.find(moment => moment.id === from)!;
                      const end = moments.find(moment => moment.id === to)!;
                      const related =
                        from === selected.id ||
                        to === selected.id ||
                        (connectedIds.has(from) && connectedIds.has(to));
                      return (
                        <motion.line
                          key={`${from}-${to}`}
                          x1={start.x}
                          y1={start.y}
                          x2={end.x}
                          y2={end.y}
                          className={
                            related
                              ? "graph-edge graph-edge--related"
                              : "graph-edge"
                          }
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{
                            pathLength: 1,
                            opacity: related ? 0.75 : 0.25,
                          }}
                          transition={{
                            delay: 0.35 + index * 0.08,
                            duration: 0.65,
                            ease: "easeOut",
                          }}
                        />
                      );
                    })}
                  </svg>
                  {moments.map((moment, index) => {
                    const { Icon } = moment;
                    const active = moment.id === selected.id;
                    const matched = queryMatches.has(moment.id);
                    const inCategory =
                      activeCategory === "All" ||
                      moment.category === activeCategory;
                    const related = connectedIds.has(moment.id);
                    const dimmed = !inCategory || (!matched && !related);
                    return (
                      <motion.button
                        type="button"
                        key={moment.id}
                        className={`graph-node ${active ? "graph-node--active" : ""} ${dimmed ? "graph-node--dimmed" : ""}`}
                        style={
                          {
                            left: `${(moment.x / 720) * 100}%`,
                            top: `${(moment.y / 480) * 100}%`,
                            "--node-accent": moment.accent,
                          } as React.CSSProperties
                        }
                        onClick={() => setSelectedId(moment.id)}
                        initial={{ opacity: 0, scale: 0.82 }}
                        animate={{
                          opacity: dimmed ? 0.22 : 1,
                          scale: active ? 1.08 : 1,
                        }}
                        transition={{
                          delay: 0.18 + index * 0.07,
                          duration: 0.5,
                          ease: "easeOut",
                        }}
                        aria-label={`Open ${moment.category} receipt: ${moment.title}`}
                      >
                        <span className="node-orbit" />
                        <span className="node-core">
                          <Icon size={15} strokeWidth={1.5} />
                        </span>
                        <span className="node-label">{moment.title}</span>
                        <span className="node-type">{moment.category}</span>
                      </motion.button>
                    );
                  })}
                  <div className="graph-empty-note">
                    Select a trace
                    <br />
                    to follow its thread
                  </div>
                </div>
                <div className="graph-footer">
                  <span>
                    <Star size={13} /> Brighter threads identify related
                    records.
                  </span>
                  <span>
                    Scroll to explore <ChevronRight size={13} />
                  </span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.aside
                  className="detail-panel"
                  key={selected.id}
                  initial={{ opacity: 0, x: 22 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                >
                  <div className="detail-topline">
                    <span
                      className="detail-category"
                      style={{ color: selected.accent }}
                    >
                      <SelectedIcon size={13} /> {selected.category}
                    </span>
                    <button
                      className="icon-button"
                      onClick={() => setSelectedId("magical-mystery-tour")}
                      aria-label="Reset selected receipt"
                    >
                      <X size={15} />
                    </button>
                  </div>
                  <div
                    className="detail-icon"
                    style={
                      {
                        "--detail-accent": selected.accent,
                      } as React.CSSProperties
                    }
                  >
                    <SelectedIcon size={23} strokeWidth={1.3} />
                  </div>
                  <p className="eyebrow">{selected.date}</p>
                  <h3>{selected.title}</h3>
                  <p className="detail-description">{selected.detail}.</p>
                  <div className="detail-meta">
                    <span>
                      <Clock3 size={14} /> {selected.time}
                    </span>
                    <span>
                      <MapPin size={14} /> {selected.place}
                    </span>
                  </div>
                  <div className="connected-header">
                    <span>Connected moments</span>
                    <span>{connectedIds.size} nearby</span>
                  </div>
                  <div className="connected-list">
                    {moments
                      .filter(moment => connectedIds.has(moment.id))
                      .slice(0, 4)
                      .map(moment => {
                        const { Icon } = moment;
                        return (
                          <button
                            key={moment.id}
                            className="connected-item"
                            onClick={() => setSelectedId(moment.id)}
                          >
                            <span
                              className="connected-icon"
                              style={{ color: moment.accent }}
                            >
                              <Icon size={14} />
                            </span>
                            <span>
                              <strong>{moment.title}</strong>
                              <small>{moment.time}</small>
                            </span>
                            <ChevronRight size={14} />
                          </button>
                        );
                      })}
                  </div>
                  <button className="story-button" onClick={openStory}>
                    <span>Reveal this story</span>
                    <ArrowRight size={15} />
                  </button>
                </motion.aside>
              </AnimatePresence>
            </section>

            <HeroParallax
              items={moments}
              onSelect={id => {
                setSelectedId(id);
                jumpTo("graph");
              }}
            />

            <section className="discoveries-section" id="discoveries">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Patterns hiding in the ordinary</p>
                  <h2>Discoveries</h2>
                </div>
                <span className="section-number">02 / 03</span>
              </div>
              <div className="discoveries-grid">
                <motion.button
                  className="discovery-card discovery-card--violet"
                  whileHover={{ y: -3 }}
                  onClick={() => {
                    setActiveCategory("Music");
                    jumpTo("graph");
                  }}
                >
                  <span className="discovery-number">01</span>
                  <div className="discovery-icon">
                    <Headphones size={18} />
                  </div>
                  <span className="discovery-title">Listening trail</span>
                  <strong>05</strong>
                  <p>recent Spotify plays form a short listening sequence.</p>
                  <span className="discovery-link">
                    Follow the trace <ArrowRight size={14} />
                  </span>
                </motion.button>
                <motion.button
                  className="discovery-card discovery-card--cyan"
                  whileHover={{ y: -3 }}
                  onClick={() => {
                    setActiveCategory("Household");
                    jumpTo("graph");
                  }}
                >
                  <span className="discovery-number">02</span>
                  <div className="discovery-icon">
                    <ShoppingBag size={18} />
                  </div>
                  <span className="discovery-title">Household activity</span>
                  <strong>03</strong>
                  <p>expenses are sampled from the household ledger.</p>
                  <span className="discovery-link">
                    Follow the trace <ArrowRight size={14} />
                  </span>
                </motion.button>
                <motion.button
                  className="discovery-card discovery-card--orange"
                  whileHover={{ y: -3 }}
                  onClick={() => {
                    setActiveCategory("Transactions");
                    jumpTo("graph");
                  }}
                >
                  <span className="discovery-number">03</span>
                  <div className="discovery-icon">
                    <Compass size={18} />
                  </div>
                  <span className="discovery-title">Payments data</span>
                  <strong>01</strong>
                  <p>
                    an augmented India transaction is included without personal
                    identifiers.
                  </p>
                  <span className="discovery-link">
                    Follow the trace <ArrowRight size={14} />
                  </span>
                </motion.button>
              </div>
            </section>

            <section
              className="about-section"
              id="about"
              aria-labelledby="about-title"
            >
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Why this archive exists</p>
                  <h2 id="about-title">About Chronicles</h2>
                </div>
                <span className="section-number">03 / 04</span>
              </div>
              <div className="about-grid">
                <p className="about-lede">
                  Chronicles turns separate records into a quieter, more human
                  way to revisit the patterns they hold.
                </p>
                <div className="about-copy">
                  <p>
                    This sample connects listening history, household activity,
                    and transaction records in one exploratory view. Each trace
                    stays grounded in its source while its nearby relationships
                    remain easy to follow.
                  </p>
                  <p>
                    It is designed as a local-first archive: a space to notice
                    sequences and context without treating personal data as a
                    feed.
                  </p>
                </div>
                <div
                  className="about-principles"
                  aria-label="Chronicles principles"
                >
                  <span>
                    <strong>01</strong> Source-aware
                  </span>
                  <span>
                    <strong>02</strong> Local-minded
                  </span>
                  <span>
                    <strong>03</strong> Human-readable
                  </span>
                </div>
              </div>
            </section>

            <section
              className="faq-section"
              id="faq"
              aria-labelledby="faq-title"
            >
              <div className="section-heading">
                <div>
                  <p className="eyebrow">A few useful details</p>
                  <h2 id="faq-title">
                    Frequently asked
                    <br />
                    <em>questions.</em>
                  </h2>
                </div>
                <span className="section-number">04 / 04</span>
              </div>
              <div className="faq-list">
                {[
                  [
                    "What does a connection mean?",
                    "A brighter thread marks records intentionally grouped in this sample. Connections are shown to make related moments easier to inspect; they are not an automated conclusion about you.",
                  ],
                  [
                    "Where does the information come from?",
                    "This view combines supplied listening-history, household, and transaction sample records. The source for each item is shown in its detail panel.",
                  ],
                  [
                    "Can I search the archive?",
                    "Yes. Use Search traces in the top bar to match titles, descriptions, sources, and categories. Related records remain visible to preserve context.",
                  ],
                  [
                    "Is this data shared?",
                    "The interface is presented as a local, private archive. This prototype does not connect to a remote data service or send archive records anywhere.",
                  ],
                ].map(([question, answer], index) => (
                  <details
                    className="faq-item"
                    key={question}
                    open={index === 0}
                  >
                    <summary>
                      <span>
                        <small>0{index + 1}</small>
                        {question}
                      </span>
                      <ChevronRight
                        size={18}
                        strokeWidth={1.4}
                        aria-hidden="true"
                      />
                    </summary>
                    <p>{answer}</p>
                  </details>
                ))}
              </div>
            </section>
            <footer className="app-footer">
              <div className="app-footer__main">
                <div className="app-footer__brand">
                  <div className="wordmark">
                    <Mark />
                    <span>CHRONICLES</span>
                  </div>
                  <p>
                    A quieter way to revisit the records and patterns that make
                    up a life.
                  </p>
                </div>
                <nav className="app-footer__nav" aria-label="Footer navigation">
                  <a href="#memory-graph">Memory graph</a>
                  <a href="#discoveries">Discoveries</a>
                  <a href="#about">About</a>
                  <a href="#faq">FAQ</a>
                </nav>
              </div>
              <div className="app-footer__meta">
                <span>CHRONICLES / PERSONAL ARCHIVE</span>
                <span className="app-footer__privacy">
                  <i className="live-dot" /> Local-first / private by design
                </span>
                <span>2013–2024 / Archive 01</span>
              </div>
            </footer>
          </section>
        </div>

        <AnimatePresence>
          {storyActive && (
            <motion.div
              ref={storyDialogRef}
              className="story-overlay"
              role="dialog"
              aria-modal="true"
              aria-labelledby="story-mode-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <MemoryField dense />
              <AmbientBackdrop />
              <div className="story-topbar">
                <button
                  ref={storyBackRef}
                  className="story-back"
                  onClick={closeStory}
                >
                  <ArrowLeft size={16} /> Back to graph
                </button>
                <span>CHRONICLES / STORY MODE</span>
                <span>15 DECEMBER 2024</span>
              </div>
              <div className="story-content">
                {storyIndex < storyMoments.length ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={storyMoments[storyIndex].id}
                      className="story-moment"
                      initial={{ opacity: 0, y: 20, filter: "blur(9px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -14, filter: "blur(7px)" }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                      <span className="story-step">0{storyIndex + 1} / 05</span>
                      <div
                        className="story-symbol"
                        style={{ color: storyMoments[storyIndex].accent }}
                      >
                        {(() => {
                          const StoryIcon = storyMoments[storyIndex].Icon;
                          return <StoryIcon size={32} strokeWidth={1.2} />;
                        })()}
                      </div>
                      <p className="eyebrow">
                        {storyMoments[storyIndex].time} ·{" "}
                        {storyMoments[storyIndex].category}
                      </p>
                      <h2 id="story-mode-title">
                        {storyMoments[storyIndex].title}
                      </h2>
                      <p>
                        {storyMoments[storyIndex].detail} at{" "}
                        <em>{storyMoments[storyIndex].place}</em>.
                      </p>
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <motion.div
                    className="story-complete"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span className="story-step">THE THREAD, REVEALED</span>
                    <div className="story-stats">
                      <div>
                        <strong>05</strong>
                        <span>records</span>
                      </div>
                      <div>
                        <strong>07</strong>
                        <span>seconds played</span>
                      </div>
                      <div>
                        <strong>01</strong>
                        <span>source</span>
                      </div>
                    </div>
                    <h2 id="story-mode-title">
                      Some moments only
                      <br />
                      <em>make sense together.</em>
                    </h2>
                    <p>
                      Five Spotify listening records gathered within a few
                      seconds.
                    </p>
                    <div className="story-actions">
                      <button
                        className="story-button story-button--light"
                        onClick={closeStory}
                      >
                        Back to graph <ArrowRight size={15} />
                      </button>
                      <button
                        className="story-link"
                        onClick={() => {
                          setSelectedId("on-the-way-home");
                          closeStory();
                        }}
                      >
                        Explore another record <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
              <div className="story-progress">
                <span
                  style={{
                    width: `${Math.min(100, ((storyIndex + 1) / (storyMoments.length + 1)) * 100)}%`,
                  }}
                />
              </div>
              {storyIndex < storyMoments.length && (
                <button
                  className="story-control"
                  onClick={() => setStoryPaused(paused => !paused)}
                >
                  {storyPaused ? "Resume story" : "Pause story"}
                </button>
              )}
              <button
                className="story-skip"
                onClick={() => setStoryIndex(storyMoments.length)}
              >
                Skip to end <ChevronRight size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </MagneticCursor>
  );
}

export default Home;
