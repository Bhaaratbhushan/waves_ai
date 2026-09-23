import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import s from "./shell.module.css";

/**
 * The registration frames render in a high-contrast transitional serif. Playfair
 * is the closest widely available match; swap the import here if the source file
 * names a specific face.
 */
const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Register | WAVES '26",
  description: "Register for WAVES '26 — Ashes to Ascension.",
};

export default function RegisterLayout({ children }: LayoutProps<"/register">) {
  return (
    <div className={`${playfair.variable} ${s.shell}`}>{children}</div>
  );
}
