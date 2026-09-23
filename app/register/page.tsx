import Image from "next/image";
import DoorLink from "../_doors/DoorLink";
import Atmosphere from "./Atmosphere";
import { PLATES } from "./plates";
import SealOrb from "./SealOrb";
import s from "./landing.module.css";

/**
 * The landing frame's six card buttons carry their labels *inside* the card
 * artwork -- the lettering sits on top of a painted sigil and cannot be lifted
 * off it. So the painting ships whole and each card gets a transparent hotspot
 * positioned over it, carrying the real control and an accessible name.
 * Coordinates are measured off the 1440x1024 frame; `side` picks the plate art
 * used for the compact menu, where the composition is replaced by a readable
 * list.
 *
 * Only "Register" has a destination so far. The rest render as buttons: they
 * hover, focus and press like everything else, they just have nowhere to go
 * yet. Give an entry an `href` and it becomes a live link with no other change.
 */
type Nav = {
  label: string;
  side: "dark" | "gold";
  /** Percentages of the 1440x1024 frame: left, top, width, height. */
  box: [number, number, number, number];
  href?: string;
};

const CARD_W = (303 / 1440) * 100;
const CARD_H = (167 / 1024) * 100;
const card = (x: number, y: number): [number, number, number, number] => [
  (x / 1440) * 100,
  (y / 1024) * 100,
  CARD_W,
  CARD_H,
];

const NAV: Nav[] = [
  { label: "Rulebook", side: "dark", box: card(237, 303) },
  { label: "Pay Now", side: "dark", box: card(174, 536) },
  { label: "How to Pay", side: "dark", box: card(330, 767) },
  { label: "Queries", side: "gold", box: card(905, 303) },
  { label: "Contention", side: "gold", box: card(963, 536) },
  { label: "Moot Court", side: "gold", box: card(820, 767) },
];

/** The orb is a circle of radius 145 centred at (723, 577). */
const ORB: [number, number, number, number] = [
  (578 / 1440) * 100,
  (432 / 1024) * 100,
  (290 / 1440) * 100,
  (290 / 1024) * 100,
];

const pos = ([left, top, width, height]: [number, number, number, number]) => ({
  left: `${left}%`,
  top: `${top}%`,
  width: `${width}%`,
  height: `${height}%`,
});

/**
 * Lines a card's own crop of the plate up under its hotspot (background-size is
 * set in CSS), so the hotspot can carry the card art when it lifts on hover.
 */
const cardArt = ([left, top]: [number, number, number, number]) => ({
  backgroundPosition: `${(left / (100 - CARD_W)) * 100}% ${(top / (100 - CARD_H)) * 100}%`,
});

export default function LandingPage() {
  return (
    <main className={s.wrap}>
      <div className={s.stage}>
        <Image
          className={s.plate}
          src={PLATES.main.src}
          alt="WAVES '26 — Ashes to Ascension"
          fill
          // Served as-is (already a compact webp) so it matches, pixel for pixel, the
          // crops of the same file that the cards and seal draw over it.
          unoptimized
          sizes="(max-width: 1440px) 100vw, 1440px"
          placeholder="blur"
          blurDataURL={PLATES.main.blurDataURL}
          preload
        />

        {NAV.map((item) => {
          const className = `${s.hotspot} ${item.side === "gold" ? s.hotGold : s.hotDark}`;
          const style = { ...pos(item.box), ...cardArt(item.box) };
          return item.href ? (
            <DoorLink key={item.label} className={className} style={style} href={item.href}>
              <span className={s.srOnly}>{item.label}</span>
            </DoorLink>
          ) : (
            <button key={item.label} className={className} style={style} type="button">
              <span className={s.srOnly}>{item.label}</span>
            </button>
          );
        })}

        <SealOrb style={pos(ORB)} />

        <DoorLink className={s.home} href="/">
          Home
        </DoorLink>
      </div>

      {/* Shown instead of the composition on narrow screens, where the baked
          card lettering would be far too small to read. */}
      <nav className={s.compact} aria-label="WAVES '26">
        <DoorLink className={`${s.home} ${s.homeCompact}`} href="/">
          Home
        </DoorLink>

        <Image
          className={s.wordmark}
          src="/waves/wordmark.webp"
          alt="WAVES '26 — Ashes to Ascension"
          width={660}
          height={260}
          preload
        />

        <DoorLink className={`${s.menuItem} ${s.menuRegister}`} href="/register/individual">
          Register
        </DoorLink>

        {NAV.map((item) => {
          const className = `${s.menuItem} ${
            item.side === "gold" ? s.menuGold : s.menuDark
          }`;
          return item.href ? (
            <DoorLink key={item.label} className={className} href={item.href}>
              {item.label}
            </DoorLink>
          ) : (
            <button key={item.label} className={className} type="button">
              {item.label}
            </button>
          );
        })}
      </nav>

      <Atmosphere />
    </main>
  );
}
