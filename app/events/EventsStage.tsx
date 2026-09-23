"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { EVENTS, type WavesEvent } from "./events-data";
import styles from "./events.module.css";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

function slugFromHash() {
  const slug = window.location.hash.slice(1);
  return EVENTS.some((e) => e.slug === slug) ? slug : null;
}

export default function EventsStage({ fontClass }: { fontClass: string }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const open = EVENTS.find((e) => e.slug === openSlug) ?? null;

  // keep the selected event in the URL so it can be shared and Back closes it
  useEffect(() => {
    const sync = () => setOpenSlug(slugFromHash());
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const select = useCallback((slug: string) => {
    setOpenSlug(slug);
    history.pushState(null, "", `#${slug}`);
  }, []);

  const close = useCallback(() => {
    if (openSlug) cardRefs.current[openSlug]?.focus({ preventScroll: true });
    setOpenSlug(null);
    history.pushState(null, "", window.location.pathname + window.location.search);
    // on phones the opened event scrolls; bring the grid back into view
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [openSlug]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <div
      className={`${styles.frame} ${styles.stage} ${fontClass}`}
      data-open={open ? "" : undefined}
      onClick={(e) => {
        if (open && e.target === e.currentTarget) close();
      }}
    >
      {EVENTS.map((event, i) => {
        const selected = event.slug === openSlug;
        return (
          <button
            key={event.slug}
            ref={(el) => {
              cardRefs.current[event.slug] = el;
            }}
            type="button"
            className={styles.card}
            data-selected={selected ? "" : undefined}
            style={
              {
                "--x": event.x,
                "--y": event.y,
                "--mx": event.mx,
                "--my": event.my,
                "--i": i,
                "--pad": event.pad,
              } as Vars
            }
            aria-label={selected ? `Close ${event.name}` : `Open ${event.name}`}
            aria-expanded={selected}
            aria-controls="event-details"
            inert={open !== null && !selected}
            onClick={() => (selected ? close() : select(event.slug))}
          >
            <span className={styles.rise}>
              <span className={styles.lift}>
                <span className={styles.glow} aria-hidden="true">
                  <Image src={event.card} alt="" fill sizes="(max-width: 767px) 60vw, (min-width: 1728px) 420px, 24vw" />
                </span>
                <span className={styles.art}>
                  <Image
                    src={event.card}
                    alt=""
                    fill
                    sizes="(max-width: 767px) 60vw, (min-width: 1728px) 420px, 24vw"
                    loading="eager"
                    draggable={false}
                  />
                </span>
              </span>
            </span>
          </button>
        );
      })}

      <Details event={open ?? EVENTS[0]} visible={open !== null} onClose={close} />
    </div>
  );
}

function Details({
  event,
  visible,
  onClose,
}: {
  event: WavesEvent;
  visible: boolean;
  onClose: () => void;
}) {
  // keep showing the last event while the cards fold away on close
  const [shown, setShown] = useState(event);
  if (visible && shown.slug !== event.slug) setShown(event);

  return (
    <section
      id="event-details"
      aria-label={`${shown.name} details`}
      aria-hidden={!visible}
      inert={!visible}
      style={{ display: "contents" }}
    >
      <div className={`${styles.detail} ${styles.detailLeft}`}>
        <BlankCard />
        <div className={styles.photo}>
          <Image src={shown.photo} alt={`${shown.name} at WAVES`} fill sizes="(max-width: 767px) 60vw, 240px" />
        </div>
        <dl className={styles.facts}>
          <div>
            <dt>Date</dt>
            <dd>{shown.date}</dd>
          </div>
          <div>
            <dt>Time</dt>
            <dd>{shown.time}</dd>
          </div>
          <div>
            <dt>Venue</dt>
            <dd>{shown.venue}</dd>
          </div>
        </dl>
      </div>

      <div className={`${styles.detail} ${styles.detailRight}`}>
        <BlankCard />
        <p className={styles.description}>{shown.description}</p>
        <div className={styles.photo}>
          <Image src={shown.photo} alt="" fill sizes="(max-width: 767px) 60vw, 240px" />
        </div>
      </div>

      {visible && (
        <button type="button" className={styles.close} onClick={onClose}>
          Back to all events
        </button>
      )}
    </section>
  );
}

function BlankCard() {
  return (
    <span className={styles.detailArt} aria-hidden="true">
      <Image src="/events/card-blank.png" alt="" fill sizes="(max-width: 767px) 90vw, (min-width: 1728px) 400px, 22vw" />
    </span>
  );
}
