import { useEffect, useRef, useState } from "react";

import futureImage from "../../../../assets/imgLifeStyle/mustachePlanning.png";

import styles from "./styles/FuturePreview.module.scss";

export const FuturePreview = () => {
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
      <div className={styles.content}>
        <h2>
          Seu futuro começa
          <br />
          <span>com uma meta.</span>
        </h2>

        <p>
          Pequenos passos hoje podem construir
          grandes conquistas amanhã.
        </p>
      </div>

      <div className={styles.imageWrapper}>
        <img
          src={futureImage}
          alt="Planeje seu futuro"
          className={styles.image}
        />
      </div>
    </div>
  );
};