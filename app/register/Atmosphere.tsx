"use client";

import { useSyncExternalStore } from "react";
import ParticleCanvas from "./ParticleCanvas";
import s from "./landing.module.css";

/*
 * The particle field and its on/off switch (both from the Bhaaratbhushan/Waves_2026
 * portal). The choice is remembered per browser; with no saved choice, visitors
 * who ask for reduced motion start with it off.
 */
const KEY = "waves-fx";
const listeners = new Set<() => void>();
let memory: boolean | null = null; // fallback when localStorage is unavailable

function read() {
  if (memory !== null) return memory;
  try {
    const saved = localStorage.getItem(KEY);
    if (saved !== null) return saved === "1";
  } catch {
    /* storage blocked -- fall through to the default */
  }
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function write(on: boolean) {
  memory = on;
  try {
    localStorage.setItem(KEY, on ? "1" : "0");
  } catch {
    /* storage blocked -- the in-memory value still applies for this visit */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export default function Atmosphere() {
  const on = useSyncExternalStore(subscribe, read, () => true);
  const label = on ? "Atmosphere On" : "Atmosphere Off";

  return (
    <>
      {on && <ParticleCanvas />}
      <button
        type="button"
        className={s.fxToggle}
        onClick={() => write(!on)}
        aria-pressed={on}
        aria-label={label}
        title={on ? "Turn off ambient particles" : "Turn on ambient particles"}
      >
        <svg className={on ? s.fxIconOn : s.fxIcon} viewBox="0 0 24 24" aria-hidden>
          <path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z" />
          <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
        </svg>
        <span className={s.fxLabel}>{label}</span>
      </button>
    </>
  );
}
