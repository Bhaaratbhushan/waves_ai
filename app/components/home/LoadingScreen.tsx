import Image from "next/image";
import { ASSETS } from "./design";
import styles from "./home.module.css";

export default function LoadingScreen({
  progress,
  bgReady,
  hidden,
}: {
  progress: number;
  bgReady: boolean;
  hidden: boolean;
}) {
  return (
    <div
      className={`${styles.loading} ${hidden ? styles.loadingHidden : ""}`}
      role="progressbar"
      aria-label="Loading Waves '26"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      aria-hidden={hidden}
    >
      <div className={styles.stage}>
        <Image
          src={ASSETS.loadingBg}
          alt=""
          fill
          unoptimized
          preload
          className={`${styles.loadingBg} ${bgReady ? styles.loadingBgReady : ""}`}
        />
        <p className={styles.loadingText}>
          Loading<span className={styles.dots}> . . .</span>
        </p>
        <div className={styles.loadingTrack}>
          <div className={styles.loadingFill} style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
