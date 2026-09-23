"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  type PanInfo,
} from "framer-motion";
import { useCallback, useEffect, useState } from "react";

const cards = [
  {
    src: "/gallery/card-1.png",
    alt: "WAVES gallery card one",
  },
  {
    src: "/gallery/card-2.png",
    alt: "WAVES gallery card two",
  },
  {
    src: "/gallery/card-3.png",
    alt: "WAVES gallery card three",
  },
];

const carouselSlots = [-2, -1, 0, 1, 2];

const SWIPE_DISTANCE = 56;

function wrapIndex(index: number) {
  return (index + cards.length) % cards.length;
}

export default function GalleryPage() {
  const [isBookOpened, setIsBookOpened] = useState(false);
  const [activeCard, setActiveCard] = useState(1);

  const changeCard = useCallback((direction: number) => {
    setActiveCard((current) => wrapIndex(current + direction));
  }, []);

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (Math.abs(info.offset.x) < SWIPE_DISTANCE) return;
      changeCard(info.offset.x < 0 ? 1 : -1);
    },
    [changeCard],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isBookOpened) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        changeCard(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        changeCard(-1);
      } else if (event.key === "Escape") {
        event.preventDefault();
        setIsBookOpened(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changeCard, isBookOpened]);

  return (
    <main
      className="relative isolate flex min-h-svh w-full items-center justify-center overflow-hidden bg-[#100202] text-[#f8e8c6]"
      aria-label="WAVES gallery"
    >
      <Image
        src="/gallery/bg-gallery-altar.png"
        alt=""
        fill
        priority
        quality={100}
        sizes="100vw"
        className="object-cover object-center"
      />
      <Image
        src="/gallery/bg-red-glow.png"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none object-cover object-center opacity-80 mix-blend-screen"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,transparent_20%,rgba(13,0,0,0.2)_62%,rgba(8,0,0,0.72)_100%)]" />

      <AnimatePresence mode="wait" initial={false}>
        {!isBookOpened ? (
          <motion.section
            key="closed-book"
            className="pointer-events-none absolute inset-0 z-10"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="gallery-book-glow pointer-events-none absolute h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#b51d13]/30 blur-3xl sm:h-80 sm:w-80"
              animate={{ opacity: [0.28, 0.56, 0.28], scale: [0.9, 1.08, 0.9] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            />
            <div className="gallery-book-anchor pointer-events-auto absolute h-[min(70vw,29rem)] w-[min(70vw,29rem)] -translate-x-1/2 -translate-y-1/2 sm:h-[min(20vw,20rem)] sm:w-[min(20vw,20rem)]">
              <motion.button
                type="button"
                className="group relative h-full w-full cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#f8e8c6] focus-visible:ring-offset-4 focus-visible:ring-offset-[#220505]"
                onClick={() => setIsBookOpened(true)}
                animate={{ y: [0, -12, 0], scale: 1 }}
                whileHover={{ y: 0, scale: 1.1 }}
                whileFocus={{ y: 0, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 65, damping: 9, repeat: Infinity, repeatType: "mirror", duration: 3.4 }}
                aria-label="Open the WAVES gallery grimoire"
              >
                <Image
                  src="/gallery/book-grimoire.png"
                  alt="An ornate grimoire resting on an altar"
                  fill
                  priority
                  sizes="(max-width: 640px) 70vw, 448px"
                  className="translate-x-[7.5%] translate-y-[7.5%] object-contain drop-shadow-[0_24px_24px_rgba(0,0,0,0.6)] transition-opacity duration-300 group-hover:opacity-0 group-focus-visible:opacity-0"
                />
                <Image
                  src="/gallery/book-grimoire_onhover.png"
                  alt=""
                  fill
                  sizes="(max-width: 640px) 70vw, 448px"
                  className="object-contain opacity-0 drop-shadow-[0_28px_30px_rgba(180,25,10,0.42)] transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                />
              </motion.button>
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="open-book"
            className="relative z-10 flex w-full flex-col items-center justify-center px-0 pb-7 pt-20 sm:pb-8 sm:pt-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            tabIndex={0}
            aria-label="Gallery carousel. Use left and right arrow keys to change cards."
          >
            <div className="relative h-[min(70svh,34.5rem)] w-full overflow-hidden [perspective:1200px]">
              <motion.div
                className="absolute inset-0"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={handleDragEnd}
                whileDrag={{ cursor: "grabbing" }}
              >
                {carouselSlots.map((signedOffset) => {
                  const index = wrapIndex(activeCard + signedOffset);
                  const card = cards[index];
                  const distance = Math.abs(signedOffset);
                  const isActive = distance === 0;
                  const cardScale =
                    distance === 0 ? 1 : distance === 1 ? 0.85 : 0.7;
                  const cardOpacity =
                    distance === 0 ? 1 : distance === 1 ? 0.7 : 0.4;
                  const cardZIndex =
                    distance === 0 ? 30 : distance === 1 ? 20 : 10;

                  return (
                    <motion.button
                      key={`${activeCard}-${signedOffset}-${card.src}`}
                      type="button"
                      className="absolute left-1/2 top-1/2 h-full [transform-style:preserve-3d] w-[clamp(10rem,24vw,23rem)] -translate-x-1/2 -translate-y-1/2 cursor-grab touch-pan-y rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#f8e8c6] focus-visible:ring-offset-4 focus-visible:ring-offset-[#220505] active:cursor-grabbing sm:w-[clamp(12rem,24vw,23rem)] md:w-[clamp(14rem,24vw,23rem)]"
                      animate={{
                        x: `calc(${signedOffset} * clamp(8.5rem, 18vw, 21rem))`,
                        y: distance === 0 ? "0%" : distance === 1 ? "8%" : "16%",
                        rotateY: signedOffset * -4,
                        scale: cardScale,
                        opacity: cardOpacity,
                        zIndex: cardZIndex,
                      }}
                      transition={{ type: "spring", stiffness: 260, damping: 27 }}
                      onClick={() => {
                        if (!isActive) setActiveCard(index);
                      }}
                      aria-label={`${card.alt}${isActive ? ", selected" : ""}`}
                      aria-current={isActive ? "true" : undefined}
                    >
                      <Image
                        src={card.src}
                        alt={card.alt}
                        fill
                        sizes="(max-width: 640px) 59vw, 352px"
                        className="object-contain drop-shadow-[0_18px_18px_rgba(0,0,0,0.64)]"
                      />
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>

            <div className="z-40 mt-8 flex w-[min(72%,52rem)] flex-col items-center gap-2 sm:mt-10 sm:gap-3">
              <label htmlFor="gallery-card" className="sr-only">
                Select a gallery card
              </label>
              <input
                id="gallery-card"
                className="gallery-range w-full"
                type="range"
                min="0"
                max={cards.length - 1}
                step="1"
                value={activeCard}
                onChange={(event) => setActiveCard(Number(event.target.value))}
                aria-valuetext={`Gallery card ${activeCard + 1} of ${cards.length}`}
              />
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .gallery-book-anchor, .gallery-book-glow { left: max(58.5%, calc(50% + 13.05vh)); top: 48.5%; }
        @media (max-width: 639px) {
          .gallery-book-anchor, .gallery-book-glow { left: 50%; top: 46%; }
        }
        .gallery-range {
          height: 1.5rem;
          appearance: none;
          background: transparent;
          cursor: pointer;
        }
        .gallery-range::-webkit-slider-runnable-track {
          height: 2px;
          border-radius: 999px;
          background: rgba(242, 217, 166, 0.36);
        }
        .gallery-range::-moz-range-track {
          height: 2px;
          border-radius: 999px;
          background: rgba(242, 217, 166, 0.36);
        }
        .gallery-range::-webkit-slider-thumb {
          width: 1.45rem;
          height: 1.45rem;
          margin-top: -0.6rem;
          appearance: none;
          border: 0;
          background: url("/gallery/pentagram-thumb.svg") center / contain no-repeat;
        }
        .gallery-range::-moz-range-thumb {
          width: 1.45rem;
          height: 1.45rem;
          border: 0;
          border-radius: 0;
          background: url("/gallery/pentagram-thumb.svg") center / contain no-repeat;
        }
        .gallery-range:focus-visible {
          outline: 2px solid #f8e8c6;
          outline-offset: 5px;
          border-radius: 999px;
        }
      `}</style>
    </main>
  );
}
