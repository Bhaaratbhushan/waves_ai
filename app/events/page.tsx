import type { Metadata } from "next";
import Image from "next/image";
import localFont from "next/font/local";
import EventsStage from "./EventsStage";
import styles from "./events.module.css";
import Navbar from "@/components/Navbar"

const yasharth = localFont({
  src: "../../public/font/Yasharth.ttf",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Events | WAVES 2026",
  description: "Fashparade, Mr & Mrs Waves, Natyanjali and Indie Rock at WAVES 2026.",
};

export default function EventsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.bg}>
        <Image src="/events/bg-marble.webp" alt="" fill preload sizes="100vw" />
      </div>
      <Navbar/>
      <h1 className={styles.title}>Events</h1>
      <EventsStage fontClass={yasharth.className} />
    </main>
  );
}
