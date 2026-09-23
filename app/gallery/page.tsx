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
    id: "card-1",
    src: "/gallery/card-1.png",
    alt: "The Horned Guardian",
  },
  {
    id: "card-2",
    src: "/gallery/card-2.png",
    alt: "The Ascension Angel",
  },
  {
    id: "card-3",
    src: "/gallery/card-3.png",
    alt: "The Flame Awakening",
  },
];

const visibleSlots = [-2, -1, 0, 1, 2];
const SWIPE_DISTANCE = 48;

export default function GalleryPage() {
  const [isBookOpened, setIsBookOpened] = useState(false);
  // Start at a large multiple of 3 + 1 so card-2 is initially active (matches video)
  const [activeIndex, setActiveIndex] = useState(30 + 1);

  const activeCard = ((activeIndex % cards.length) + cards.length) % cards.length;

  const changeCard = useCallback((direction: number) => {
    setActiveIndex((current) => current + direction);
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
      {/* Altar & Cavern Background (aligned on mobile to center the stone altar podium) */}
      <Image
        src="/gallery/bg-gallery-altar.png"
        alt=""
        fill
        priority
        quality={100}
        sizes="100vw"
        className="object-cover object-[60%_center] sm:object-center"
      />
      <Image
        src="/gallery/bg-red-glow.png"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none object-cover object-[60%_center] sm:object-center opacity-80 mix-blend-screen"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,transparent_20%,rgba(13,0,0,0.2)_62%,rgba(8,0,0,0.72)_100%)]" />

      <AnimatePresence mode="wait" initial={false}>
        {!isBookOpened ? (
          <motion.section
            key="closed-book"
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.25 } }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Ambient Red Glow Centered over Altar Podium */}
            <div
              className="grimoire-pedestal-anchor pointer-events-none absolute h-64 w-64 rounded-full bg-[#b51d13]/40 blur-3xl sm:h-84 sm:w-84 grimoire-glow-pulse"
              aria-hidden="true"
            />

            {/* Floating Grimoire Container Positioned Directly on Altar Podium */}
            <div className="grimoire-pedestal-anchor pointer-events-auto absolute h-[min(62vw,16.5rem)] w-[min(62vw,16.5rem)] sm:h-[min(20vw,18rem)] sm:w-[min(20vw,18rem)]">
              {/* Continuous Levitating Float Wrapper (always floats up and down) */}
              <div className="grimoire-floating-container relative h-full w-full">
                <motion.button
                  type="button"
                  className="group relative h-full w-full cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#f8e8c6] focus-visible:ring-offset-4 focus-visible:ring-offset-[#220505]"
                  onClick={() => setIsBookOpened(true)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  aria-label="Open the WAVES gallery grimoire"
                >
                  <Image
                    src="/gallery/book-grimoire.png"
                    alt="An ornate grimoire resting on the altar podium"
                    fill
                    priority
                    sizes="(max-width: 640px) 60vw, 360px"
                    className="object-contain drop-shadow-[0_24px_28px_rgba(0,0,0,0.7)] transition-opacity duration-300 group-hover:opacity-0 group-focus-visible:opacity-0"
                  />
                  <Image
                    src="/gallery/book-grimoire_onhover.png"
                    alt=""
                    fill
                    sizes="(max-width: 640px) 60vw, 360px"
                    className="object-contain opacity-0 drop-shadow-[0_28px_34px_rgba(200,30,10,0.55)] transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                  />
                </motion.button>
              </div>
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="open-book"
            className="relative z-10 flex w-full flex-col items-center justify-center px-0 pb-6 pt-16 sm:pb-8 sm:pt-20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            tabIndex={0}
            aria-label="Gallery carousel. Use left and right arrow keys or slider to change cards."
          >
            {/* 3D Cards Carousel Stage matching MacBook reference:
                - Clear spacing between cards (no overlap)
                - Last cards in stack are half hidden at the screen edges
            */}
            <div className="relative h-[min(68svh,34rem)] w-full overflow-hidden [perspective:1200px] flex items-center justify-center">
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                whileDrag={{ cursor: "grabbing" }}
              >
                {visibleSlots.map((signedOffset) => {
                  const itemIndex = activeIndex + signedOffset;
                  const cardIdx = ((itemIndex % cards.length) + cards.length) % cards.length;
                  const card = cards[cardIdx];
                  const distance = Math.abs(signedOffset);
                  const isActive = distance === 0;

                  // Scale & opacity matching MacBook reference:
                  // Center card: scale 1.0, opacity 1
                  // Adjacent cards (-1, +1): scale 0.85, opacity 0.85 (clear visible gap between cards)
                  // Outer cards (-2, +2): scale 0.70, opacity 0.60 (half hidden beyond left and right screen borders)
                  const cardScale =
                    distance === 0 ? 1 : distance === 1 ? 0.85 : 0.70;
                  const cardOpacity =
                    distance === 0 ? 1 : distance === 1 ? 0.85 : 0.60;
                  const cardZIndex =
                    distance === 0 ? 30 : distance === 1 ? 20 : 10;

                  return (
                    <motion.button
                      key={itemIndex}
                      type="button"
                      className={`absolute left-1/2 top-1/2 [transform-style:preserve-3d] w-[clamp(11rem,52vw,16rem)] sm:w-[clamp(10.5rem,19.5vw,18.5rem)] h-[clamp(17rem,80vw,25rem)] sm:h-[clamp(16.5rem,30.5vw,29rem)] -translate-x-1/2 -translate-y-1/2 cursor-grab touch-pan-y rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#f8e8c6] focus-visible:ring-offset-4 focus-visible:ring-offset-[#220505] active:cursor-grabbing ${
                        distance >= 2 ? "gallery-card-outer" : ""
                      }`}
                      animate={{
                        x: `calc(${signedOffset} * var(--gallery-card-spacing))`,
                        y: "0%",
                        rotateY: 0,
                        scale: cardScale,
                        opacity: cardOpacity,
                        zIndex: cardZIndex,
                      }}
                      transition={{ type: "spring", stiffness: 280, damping: 28 }}
                      onClick={() => {
                        if (!isActive) {
                          setActiveIndex(itemIndex);
                        }
                      }}
                      aria-label={`${card.alt}${isActive ? ", selected" : ""}`}
                      aria-current={isActive ? "true" : undefined}
                    >
                      <Image
                        src={card.src}
                        alt={card.alt}
                        fill
                        sizes="(max-width: 640px) 55vw, 360px"
                        className="object-contain drop-shadow-[0_22px_28px_rgba(0,0,0,0.85)]"
                        priority={isActive}
                      />
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>

            {/* Custom Golden Slider with Pentagram Thumb (wider track matching MacBook frame) */}
            <div className="z-40 mt-5 sm:mt-8 flex w-[min(90vw,36rem)] sm:w-[min(82vw,46rem)] flex-col items-center">
              <label htmlFor="gallery-card-slider" className="sr-only">
                Select gallery card
              </label>

              <div className="relative w-full h-8 flex items-center">
                {/* Background track with golden border */}
                <div className="relative w-full h-[9px] rounded-full bg-[#180606]/90 border border-[#c89e48]/55 shadow-[inset_0_1px_4px_rgba(0,0,0,0.9),0_0_12px_rgba(0,0,0,0.7)] overflow-hidden">
                  {/* Glowing progress fill bar */}
                  <motion.div
                    className="h-full rounded-full"
                    animate={{
                      width: `${(activeCard / (cards.length - 1)) * 100}%`,
                    }}
                    transition={{ type: "spring", stiffness: 320, damping: 30 }}
                    style={{
                      background: "linear-gradient(90deg, #6e270c 0%, #b8621b 30%, #e5a73e 70%, #f6dc88 100%)",
                      boxShadow: "0 0 12px rgba(229, 167, 62, 0.75)",
                    }}
                  />
                </div>

                {/* Animated Pentagram Thumb Medallion */}
                <motion.div
                  className="absolute top-1/2 pointer-events-none z-20"
                  animate={{
                    left: `calc(${(activeCard / (cards.length - 1)) * 100}% - ${(activeCard / (cards.length - 1)) * 36}px)`,
                    y: "-50%",
                  }}
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  style={{
                    width: "36px",
                    height: "36px",
                  }}
                >
                  <Image
                    src="/gallery/pentagram-thumb.svg"
                    alt=""
                    width={36}
                    height={36}
                    priority
                    className="w-full h-full object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] drop-shadow-[0_0_8px_rgba(229,167,62,0.6)]"
                  />
                </motion.div>

                {/* Range input for accessible keyboard, click & drag */}
                <input
                  id="gallery-card-slider"
                  type="range"
                  min="0"
                  max={cards.length - 1}
                  step="1"
                  value={activeCard}
                  onChange={(e) => {
                    const targetVal = Number(e.target.value);
                    const currentCycle = Math.floor(activeIndex / cards.length);
                    setActiveIndex(currentCycle * cards.length + targetVal);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                  aria-valuetext={`Card ${activeCard + 1} of ${cards.length}: ${cards[activeCard].alt}`}
                />
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <style jsx global>{`
        :root {
          --gallery-card-spacing: clamp(13rem, 25vw, 24rem);
        }
        @media (max-width: 639px) {
          :root {
            --gallery-card-spacing: clamp(12rem, 58vw, 18rem);
          }
          .gallery-card-outer {
            opacity: 0 !important;
            pointer-events: none;
          }
        }
        .grimoire-pedestal-anchor {
          left: max(58.5%, calc(50% + 13vh));
          top: 51.5%;
          transform: translate(-50%, -50%);
        }
        @media (max-width: 639px) {
          .grimoire-pedestal-anchor {
            left: 55%;
            top: 51%;
            transform: translate(-50%, -50%);
          }
        }
        @keyframes grimoire-levitate {
          0%, 100% {
            transform: translateY(-13px);
          }
          50% {
            transform: translateY(7px);
          }
        }
        .grimoire-floating-container {
          animation: grimoire-levitate 3.4s ease-in-out infinite;
          will-change: transform;
        }
        @keyframes grimoire-glow-pulse {
          0%, 100% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(0.92);
          }
          50% {
            opacity: 0.65;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }
        .grimoire-glow-pulse {
          animation: grimoire-glow-pulse 3.8s ease-in-out infinite;
          will-change: transform, opacity;
        }
      `}</style>
    </main>
  );
}
