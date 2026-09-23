"use client";

import { useEffect, useState, useSyncExternalStore, type CSSProperties } from "react";
import { ASSETS, DESIGN_H, DESIGN_W, LAYERS } from "./design";
import LoadingScreen from "./LoadingScreen";
import Landing from "./Landing";
import styles from "./home.module.css";

export type Phase = "loading" | "intro" | "landing";

const MIN_LOADING_MS = 1600;
// Loading fades to black (0.5s), the intro fades up (0.45s delay + 0.6s, see home.module.css),
// then holds for Figma's 0.8s before animating into the landing page.
const INTRO_HOLD_MS = 1050 + 800;
const LOGO_CENTER_X = LAYERS.logo.final.x + LAYERS.logo.final.w / 2;

// Survives client-side navigation: once the intro has played, returning home goes straight to the landing page.
let introPlayed = false;

function subscribe(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

function useViewport() {
  const w = useSyncExternalStore(subscribe, () => window.innerWidth, () => DESIGN_W);
  const h = useSyncExternalStore(subscribe, () => window.innerHeight, () => DESIGN_H);
  return { w, h };
}

export default function HomeExperience() {
  const { w, h } = useViewport();
  const [progress, setProgress] = useState(0);
  const [bgReady, setBgReady] = useState(false);
  const [phase, setPhase] = useState<Phase>(() => (introPlayed ? "landing" : "loading"));

  useEffect(() => {
    if (introPlayed) return;
    let cancelled = false;
    const timers: number[] = [];
    const start = performance.now();
    const sources = Object.values(ASSETS).filter((src) => src !== ASSETS.loadingBg);
    const total = sources.length + 1; // + fonts
    let done = 0;

    // The bar never runs ahead of real progress, and never fills faster than MIN_LOADING_MS.
    const update = () => {
      const timeCap = Math.min(1, (performance.now() - start) / MIN_LOADING_MS);
      if (!cancelled) setProgress(Math.min(done / total, timeCap));
    };
    const ticker = window.setInterval(update, 100);

    const load = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new window.Image();
        img.onload = img.onerror = () => resolve();
        img.src = src;
      });

    // Load the loading screen's own background first so it isn't competing with the big layers.
    const everything = load(ASSETS.loadingBg).then(() => {
      if (!cancelled) setBgReady(true);
      return Promise.all([
        ...sources.map((src) => load(src).then(() => void (done += 1))),
        document.fonts.ready.then(() => void (done += 1)),
      ]);
    });
    const minDelay = new Promise((r) => timers.push(window.setTimeout(r, MIN_LOADING_MS)));

    Promise.all([everything, minDelay]).then(() => {
      if (cancelled) return;
      clearInterval(ticker);
      setProgress(1);
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const toLanding = () => {
        introPlayed = true;
        setPhase("landing");
      };
      timers.push(
        window.setTimeout(() => {
          if (reduceMotion) return toLanding();
          setPhase("intro");
          timers.push(window.setTimeout(toLanding, INTRO_HOLD_MS));
        }, 300),
      );
    });

    return () => {
      cancelled = true;
      clearInterval(ticker);
      timers.forEach(clearTimeout);
    };
  }, []);

  // On viewports narrower than the design, pan the cropped stage toward the logo
  // instead of the centre, and shrink the logo if it still can't fit.
  const cover = Math.max(w / DESIGN_W, h / DESIGN_H);
  const visibleW = w / cover;
  const focusX = Math.min(Math.max(LOGO_CENTER_X, visibleW / 2), DESIGN_W - visibleW / 2);
  const vars = {
    "--cover": cover,
    "--ui": Math.min(w / DESIGN_W, h / DESIGN_H),
    "--stage-x": `${(DESIGN_W / 2 - focusX) * cover}px`,
    "--stage-top": `${(h - DESIGN_H * cover) / 2}px`,
    "--logo-fit": Math.min(1, (visibleW - 40) / LAYERS.logo.final.w),
  } as CSSProperties;

  return (
    <main className={styles.root} style={vars}>
      <Landing phase={phase} />
      {phase !== "landing" && (
        <LoadingScreen progress={progress} bgReady={bgReady} hidden={phase !== "loading"} />
      )}
    </main>
  );
}
