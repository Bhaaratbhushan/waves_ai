"use client";

import type { CSSProperties, MouseEvent } from "react";
import DoorLink from "../_doors/DoorLink";
import s from "./landing.module.css";

/**
 * The REGISTER seal. The orb is painted into the plate, so `.orbArt` redraws the
 * same patch of the plate on top of it; that copy can then tilt toward the
 * pointer (up to 8deg, as in the Bhaaratbhushan/Waves_2026 medallion), swell,
 * and catch a sheen, with a gold/ember aura behind it.
 */
export default function SealOrb({ style }: { style: CSSProperties }) {
  const tilt = (event: MouseEvent<HTMLAnchorElement>) => {
    const el = event.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (event.clientX - r.left) / r.width - 0.5;
    const py = (event.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${-py * 16}deg`);
    el.style.setProperty("--ry", `${px * 16}deg`);
  };

  const reset = (event: MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.removeProperty("--rx");
    event.currentTarget.style.removeProperty("--ry");
  };

  return (
    <DoorLink
      className={s.orb}
      style={style}
      href="/register/individual"
      onMouseMove={tilt}
      onMouseLeave={reset}
    >
      <span className={s.orbAura} aria-hidden />
      <span className={s.orbArt} aria-hidden>
        <span className={s.orbSheen} />
      </span>
      <span className={s.srOnly}>Register</span>
    </DoorLink>
  );
}
