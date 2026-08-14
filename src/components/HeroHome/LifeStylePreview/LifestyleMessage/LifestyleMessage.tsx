import { useEffect, useRef, useState } from "react";

import icon from "../../../../assets/logo/icon.png";

import styles from "./styles/LifestyleMessage.module.scss";
import { Link } from "react-router-dom";

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
      <img
        src={icon}
        alt=""
        className={styles.mustache}
      />

      <h2>
        Tudo isso começa
        <br />
        com uma coisa:
        <span> organização financeira.</span>
      </h2>

      <p>Planeje melhor. Viva melhor.</p>

      <Link  
        to="/register" 
        className={styles.button}
      >
        Começar agora
      </Link>
    </div>
  );
};