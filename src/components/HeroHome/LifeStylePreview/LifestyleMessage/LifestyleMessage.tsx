import { useEffect, useRef, useState } from "react";

import styles from "./styles/LifestyleMessage.module.scss";

export const LifestyleMessage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.3,
      },
    );

    if (messageRef.current) {
      observer.observe(messageRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={messageRef}
      className={`${styles.message} ${
        isVisible ? styles.visible : ""
      }`}
    >
      <div className={styles.mustache}>〰〰〰</div>

      <h2>
        Tudo isso começa
        <br />
        com uma coisa:
        <span> organização financeira.</span>
      </h2>

      <p>Planeje melhor. Viva melhor.</p>

      <button type="button">
        Começar agora
      </button>
    </div>
  );
};