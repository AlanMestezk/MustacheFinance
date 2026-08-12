import { useEffect, useRef, useState } from "react";

import familyImage from "../../../../assets/imgLifeStyle/mustacheQualitytime.png";

import styles from "./styles/FamilyPreview.module.scss";

export const FamilyPreview = () => {
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
          src={familyImage}
          alt="Planeje momentos em família"
          className={styles.image}
        />
      </div>

      <div className={styles.content}>
        <h2>
          Seu dinheiro também
          <br />
          <span>compra tempo.</span>
        </h2>

        <p>
          Planejar suas finanças é criar espaço
          para viver o que realmente importa.
        </p>
      </div>
    </div>
  );
};