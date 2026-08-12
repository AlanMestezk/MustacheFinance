import { useEffect, useRef, useState } from "react";

import travelImage from "../../../../assets/imgLifeStyle/mustacheTraveler.png";

import styles from "./styles/TravelPreview.module.scss";

export const TravelPreview = () => {
  const [isVisible, setIsVisible] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.25,
      },
    );

    if (previewRef.current) {
      observer.observe(previewRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={previewRef}
      className={`${styles.preview} ${
        isVisible ? styles.visible : ""
      }`}
    >
      <div className={styles.imageWrapper}>
        <img
          src={travelImage}
          alt="Planeje suas viagens"
          className={styles.image}
        />
      </div>

      <div className={styles.content}>
        <h2>
          Planeje hoje.
          <br />
          <span>Viaje tranquilo.</span>
        </h2>

        <p>
          Organize seus recursos antes de escolher
          o próximo destino.
        </p>
      </div>
    </div>
  );
};