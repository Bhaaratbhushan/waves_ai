// Coordinates are in Figma design pixels (MacBook Pro 16" frame, 1728×1117).
export const DESIGN_W = 1728;
export const DESIGN_H = 1117;

// TODO: confirm the real festival start time — the Figma mock only shows a static 51:11:33.
export const EVENT_START = new Date("2026-11-08T00:00:00+05:30");

export type Box = { x: number; y: number; w: number; h: number };

// Landing-page layer positions, and where each layer starts in the intro frame
// (Figma smart-animates intro → landing over 2s).
export const LAYERS = {
  backdrop: {
    final: { x: -346, y: -180, w: 2094, h: 1178 },
    intro: { x: -164, y: -7, w: 2094, h: 1178 },
  },
  scene: {
    final: { x: -291, y: 151, w: 2256, h: 1034 },
    intro: { x: -138, y: 467, w: 2256, h: 1034 },
  },
  foreground: {
    final: { x: -88, y: -325, w: 2202, h: 1468 },
    intro: { x: -96, y: -7, w: 1866, h: 1244 },
  },
  bush: {
    final: { x: 1081, y: 770, w: 655, h: 359 },
    intro: { x: 1720, y: 778, w: 655, h: 359 },
  },
  logo: {
    final: { x: 161, y: 0, w: 845, h: 471 },
    intro: { x: 68, y: -98, w: 1578, h: 880 },
  },
  ashes: {
    final: { x: -239, y: -59, w: 2110, h: 1199 },
    intro: { x: -239, y: -59, w: 2110, h: 1199 },
  },
} satisfies Record<string, { final: Box; intro: Box }>;

export const ASSETS = {
  loadingBg: "/assets/loading-bg.webp",
  backdrop: "/assets/backdrop.webp",
  scene: "/assets/scene.webp",
  foreground: "/assets/foreground.webp",
  bush: "/assets/bush-blur.webp",
  logo: "/assets/logo.webp",
  ashes: "/assets/ashes-bg.webp",
  lanternGolden: "/assets/lantern-golden.webp",
  lanternAshes: "/assets/lantern-ashes.webp",
  hourglassGolden: "/assets/hourglass-golden.webp",
  hourglassAshes: "/assets/hourglass-ashes.webp",
};

// Only pages that exist get an href; the rest render as inert buttons until their pages are built.
export const NAV_LINKS: { label: string; href?: string }[] = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "Gallery" },
  { label: "About" },
  { label: "Sponsors" },
  { label: "Contact" },
];
