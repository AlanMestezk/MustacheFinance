import { useEffect, useRef, useState } from "react";

import shoppingImage from "../../../../assets/imgLifeStyle/mustacheShopping.png";

import styles from "./styles/ShoppingPreview.module.scss";

export const ShoppingPreview = () => {
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
          Comprar melhor.
          <br />
          <span>Começa antes do carrinho.</span>
        </h2>

        <p>
          Saiba quanto você pode gastar antes
          de transformar vontade em compra.
        </p>
      </div>

      <div className={styles.imageWrapper}>
        <img
          src={shoppingImage}
          alt="Planeje suas compras"
          className={styles.image}
        />
      </div>
    </div>
  );
};