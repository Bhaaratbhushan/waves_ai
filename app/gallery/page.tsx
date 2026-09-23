"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

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

export default function GalleryPage() {
  const [isBookOpened, setIsBookOpened] = useState(false);
  // Start at a multiple of 3 so card-1 (leftmost card, index % 3 === 0) is initial
  const [activeIndex, setActiveIndex] = useState(30);
  const [hasIntroAnimated, setHasIntroAnimated] = useState(false);

  // Mobile touch swipe tracking (does not interfere with desktop mouse clicks)
  const touchStartXRef = useRef<number | null>(null);

  const activeCard = ((activeIndex % cards.length) + cards.length) % cards.length;

  const openBook = useCallback(() => {
    setActiveIndex(30);
    setIsBookOpened(true);
    setHasIntroAnimated(false);
  }, []);

  const changeCard = useCallback((direction: number) => {
    setActiveIndex((current) => current + direction);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartXRef.current === null) return;
      const dx = e.changedTouches[0].clientX - touchStartXRef.current;
      touchStartXRef.current = null;
      if (Math.abs(dx) > 40) {
        changeCard(dx < 0 ? 1 : -1);
      }
    },
    [changeCard],
  );

  const handleOpenBookIntro = useCallback(() => {
    if (!hasIntroAnimated) {
      const timer = setTimeout(() => {
        setActiveIndex(31);
        setHasIntroAnimated(true);
      }, 240);
      return () => clearTimeout(timer);
    }
  }, [hasIntroAnimated]);

  // Guaranteed intro glide fallback if onAnimationComplete is skipped by browser/performance
  useEffect(() => {
    if (isBookOpened && !hasIntroAnimated) {
      const timer = setTimeout(() => {
        setActiveIndex((prev) => (prev % cards.length === 0 ? prev + 1 : prev));
        setHasIntroAnimated(true);
      }, 850);
      return () => clearTimeout(timer);
    }
  }, [isBookOpened, hasIntroAnimated]);

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
        setHasIntroAnimated(false);
        setActiveIndex(30);
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
      {/* Natural cavern vignette preserving deep dark shadows on the stone walls */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,transparent_35%,rgba(10,0,0,0.25)_72%,rgba(5,0,0,0.72)_100%)]" />

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
            {/* Atmospheric Crimson Smoke from bg-red-glow.png anchored directly around the book (not flooding the cavern) */}
            <div 
              className="grimoire-pedestal-anchor pointer-events-none absolute w-[min(96vw,42rem)] h-[min(96vw,42rem)] sm:w-[min(54vw,48rem)] sm:h-[min(54vw,48rem)] z-0"
              aria-hidden="true"
            >
              <Image
                src="/gallery/bg-red-glow.png"
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 800px"
                className="object-contain pointer-events-none opacity-85 mix-blend-screen"
              />
            </div>

            {/* Floating Grimoire Container Positioned Directly on Altar Podium */}
            <div className="grimoire-pedestal-anchor pointer-events-auto absolute h-[min(62vw,16.5rem)] w-[min(62vw,16.5rem)] sm:h-[min(20vw,18rem)] sm:w-[min(20vw,18rem)] z-10">
              {/* Continuous Levitating Float Wrapper (continues floating smoothly when hovered) */}
              <div className="grimoire-floating-container relative h-full w-full">
                <motion.button
                  type="button"
                  className="group relative h-full w-full cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#f8e8c6] focus-visible:ring-offset-4 focus-visible:ring-offset-[#220505]"
                  onClick={openBook}
                  whileHover={{ scale: 1.05 }}
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
            onAnimationComplete={handleOpenBookIntro}
            tabIndex={0}
            aria-label="Gallery carousel. Use left and right arrow keys, click any card, or use the slider to change cards."
          >
            {/* 3D Cards Carousel Stage:
                - Grand, prominent center card commanding the screen (scale 1.25)
                - Inward 3D tilt, z-translation, and firelight illumination
                - Guaranteed tap/click navigation to bring clicked card to center
                - Slider placed downward with generous clearance from the cards
            */}
            <div 
              className="relative h-[min(68svh,36rem)] sm:h-[min(70svh,38rem)] w-full overflow-visible [perspective:1400px] flex items-center justify-center select-none"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Soft atmospheric firelight glow behind center card with smooth radial falloff */}
              <div 
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[20%] w-[min(88vw,34rem)] h-32 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(225,120,30,0.18)_0%,rgba(180,60,15,0.06)_50%,transparent_75%)] blur-2xl z-0"
                aria-hidden="true"
              />

              <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]"
              >
                {visibleSlots.map((signedOffset) => {
                  const itemIndex = activeIndex + signedOffset;
                  const cardIdx = ((itemIndex % cards.length) + cards.length) % cards.length;
                  const card = cards[cardIdx];
                  const distance = Math.abs(signedOffset);
                  const isActive = distance === 0;

                  // 3D Scale & Depth hierarchy (all Z >= 0 so cards are never occluded by 3D hit-plane):
                  // Center card: scale 1.25, z: 60px (commanding, pulled forward)
                  // Adjacent cards (-1, +1): scale 0.80, z: 20px, rotateY ±8deg
                  // Outer cards (-2, +2): scale 0.62, z: 0px, rotateY ±13deg
                  const cardScale =
                    distance === 0 ? 1.25 : distance === 1 ? 0.80 : 0.62;
                  const cardZ =
                    distance === 0 ? 60 : distance === 1 ? 20 : 0;
                  const cardRotateY =
                    distance === 0 ? 0 : signedOffset * -8;
                  const cardOpacity =
                    distance === 0 ? 1 : distance === 1 ? 0.82 : 0.58;
                  const cardZIndex =
                    distance === 0 ? 30 : distance === 1 ? 20 : 10;
                  const cardBrightness =
                    distance === 0
                      ? "brightness(1.06) contrast(1.04)"
                      : distance === 1
                      ? "brightness(0.78) contrast(1.02)"
                      : "brightness(0.55) blur(0.5px)";

                  return (
                    <motion.button
                      key={itemIndex}
                      type="button"
                      className={`pointer-events-auto absolute left-1/2 top-1/2 [transform-style:preserve-3d] w-[clamp(11.5rem,54vw,17rem)] sm:w-[clamp(12.5rem,21.5vw,21rem)] h-[clamp(17.5rem,82vw,26rem)] sm:h-[clamp(19.5rem,34.5vw,33.5rem)] -translate-x-1/2 -translate-y-1/2 cursor-pointer touch-pan-y rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#f8e8c6] focus-visible:ring-offset-4 focus-visible:ring-offset-[#220505] ${
                        distance >= 2 ? "gallery-card-outer" : ""
                      }`}
                      animate={{
                        x: `calc(${signedOffset} * var(--gallery-card-spacing))`,
                        y: isActive ? [-3, 3, -3] : 0,
                        z: cardZ,
                        rotateY: cardRotateY,
                        scale: cardScale,
                        opacity: cardOpacity,
                        zIndex: cardZIndex,
                        filter: cardBrightness,
                      }}
                      whileHover={
                        !isActive
                          ? { scale: cardScale * 1.05, y: -6, filter: "brightness(0.95)" }
                          : { scale: 1.27 }
                      }
                      transition={
                        isActive
                          ? {
                              y: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
                              x: { type: "spring", stiffness: 280, damping: 28 },
                              scale: { type: "spring", stiffness: 280, damping: 28 },
                              z: { type: "spring", stiffness: 280, damping: 28 },
                              rotateY: { type: "spring", stiffness: 280, damping: 28 },
                              opacity: { duration: 0.25 },
                              filter: { duration: 0.25 },
                            }
                          : { type: "spring", stiffness: 280, damping: 28 }
                      }
                      onClick={() => {
                        if (signedOffset !== 0) {
                          changeCard(signedOffset);
                        }
                      }}
                      aria-label={`${card.alt}${isActive ? ", selected" : ", click to jump to this card"}`}
                      aria-current={isActive ? "true" : undefined}
                    >
                      <Image
                        src={card.src}
                        alt={card.alt}
                        fill
                        sizes="(max-width: 640px) 60vw, 420px"
                        className={`object-contain transition-all duration-300 pointer-events-none ${
                          isActive
                            ? "drop-shadow-[0_16px_28px_rgba(0,0,0,0.65)] drop-shadow-[0_0_28px_rgba(235,130,35,0.28)]"
                            : "drop-shadow-[0_10px_18px_rgba(0,0,0,0.5)]"
                        }`}
                        priority={isActive}
                      />
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Custom Golden Slider with Pentagram Thumb (placed downward so it never overlaps cards) */}
            <div className="z-40 mt-10 sm:mt-14 mb-2 flex w-[min(90vw,36rem)] sm:w-[min(82vw,46rem)] flex-col items-center">
              <label htmlFor="gallery-card-slider" className="sr-only">
                Select gallery card
              </label>

              <div className="relative w-full h-8 flex items-center">
                {/* Background track with golden border */}
                <div className="relative w-full h-[9px] rounded-full bg-[#180606]/95 border border-[#c89e48]/60 shadow-[inset_0_1px_5px_rgba(0,0,0,0.95),0_0_14px_rgba(0,0,0,0.75)] overflow-hidden">
                  {/* Glowing progress fill bar */}
                  <motion.div
                    className="h-full rounded-full"
                    animate={{
                      width: `${(activeCard / (cards.length - 1)) * 100}%`,
                    }}
                    transition={{ type: "spring", stiffness: 320, damping: 30 }}
                    style={{
                      background: "linear-gradient(90deg, #6e270c 0%, #b8621b 30%, #e5a73e 70%, #f6dc88 100%)",
                      boxShadow: "0 0 14px rgba(229, 167, 62, 0.8)",
                    }}
                  />
                </div>

                {/* Animated Pentagram Thumb Medallion with warm glowing ember aura */}
                <motion.div
                  className="absolute top-1/2 pointer-events-none z-20 group"
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
                    className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.98)] drop-shadow-[0_0_10px_rgba(240,180,60,0.75)]"
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
          --gallery-card-spacing: clamp(14rem, 26vw, 26rem);
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
      `}</style>
    </main>
  );
}
