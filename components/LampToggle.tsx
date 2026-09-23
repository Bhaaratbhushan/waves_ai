"use client";
import { useState } from "react";
import Image from "next/image";

// Component 1 frames (lamp state A — off)
const LAMP_A_FRAMES = [
  "/navbar/lamp-c1-default.png",
  "/navbar/lamp-c1-v2.png",
  "/navbar/lamp-c1-v3.png",
];

// Component 2 frames (lamp state B — on)
const LAMP_B_FRAMES = [
  "/navbar/lamp-c2-default.png",
  "/navbar/lamp-c2-v2.png",
  "/navbar/lamp-c2-v3.png",
];

export default function LampToggle() {
  const [isOn, setIsOn] = useState(false);

  const currentFrames = isOn ? LAMP_B_FRAMES : LAMP_A_FRAMES;

  return (
    <button
      onClick={() => setIsOn(!isOn)}
      className="lamp-container focus:outline-none flex items-center justify-center cursor-pointer relative w-[160px] h-[214px] md:w-[286px] md:h-[383px] transition-all"
      aria-label="Toggle Lamp"
    >
      {currentFrames.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt="Lamp Toggle"
          width={286}
          height={383}
          className={`absolute inset-0 w-full h-full object-contain lamp-crossfade lamp-crossfade--${i + 1} ${
            isOn && i > 0 ? "translate-x-[15px]" : ""
          }`}
          suppressHydrationWarning
        />
      ))}
    </button>
  );
}
