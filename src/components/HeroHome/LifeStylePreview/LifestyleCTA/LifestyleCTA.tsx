import { useEffect, useRef, useState } from "react";

import styles from "./styles/LifestyleCTA.module.scss";

export const LifestyleCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  const ctaRef = useRef<HTMLElement>(null);

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

    if (ctaRef.current) {
      observer.observe(ctaRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ctaRef}
      className={`${styles.cta} ${isVisible ? styles.visible : ""}`}
    >
      <h2>
        No Mustache Finance, você dá o pontapé para
        <span>Fazer seus planos acontecerem.</span>
    </h2>
    </section>
  );
};