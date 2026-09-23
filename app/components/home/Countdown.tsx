"use client";

import { useSyncExternalStore } from "react";
import { EVENT_START } from "./design";
import styles from "./home.module.css";

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 1000);
  return () => window.clearInterval(id);
}

// Snapshot is whole minutes left, so React only re-renders when the display changes.
function minutesLeft() {
  return Math.max(0, Math.floor((EVENT_START.getTime() - Date.now()) / 60000));
}

export default function Countdown() {
  const total = useSyncExternalStore(subscribe, minutesLeft, () => 0);
  const days = Math.floor(total / 1440);
  const hours = String(Math.floor((total % 1440) / 60)).padStart(2, "0");
  const minutes = String(total % 60).padStart(2, "0");

  return (
    <div
      className={styles.countdown}
      role="timer"
      aria-label={`${days} days, ${hours} hours and ${minutes} minutes to go`}
    >
      <span className={`${styles.unit} ${styles.days}`}>
        {days}
        <span className={styles.label}>Days</span>
      </span>
      <span className={`${styles.unit} ${styles.colon1}`}>:</span>
      <span className={`${styles.unit} ${styles.hours}`}>
        {hours}
        <span className={styles.label}>Hours</span>
      </span>
      <span className={`${styles.unit} ${styles.colon2}`}>:</span>
      <span className={`${styles.unit} ${styles.minutes}`}>
        {minutes}
        <span className={styles.label}>Minutes</span>
      </span>
      <span className={styles.hourglass} />
    </div>
  );
}
