import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import DoorTransition from "./_doors/DoorTransition";
import "./globals.css";
import Navbar from "@/components/Navbar";

const yasharth = localFont({
  src: "../public/font/Yasharth.ttf",
  variable: "--font-yasharth",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Waves 2026",
  description: "Waves 2026",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${yasharth.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <DoorTransition>{children}</DoorTransition>
      </body>
    </html>
  );
}
