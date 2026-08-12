import { useState } from "react";

import { DashboardPreview } from "./DashboardPreview/DashboardPreview";
import { GoalsPreview } from "./GoalsPreview/GoalsPreview";


import styles from "./styles/FinancePreview.module.scss";
import { TransactionsPreview } from "./TransactionsPreview/TransactionsPreview";

export const FinancePreview = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    <DashboardPreview />,
    <GoalsPreview />,
    <TransactionsPreview />,
  ];

  const nextSlide = () => {
    setCurrentSlide((current) => (current + 1) % slides.length);
  };

  const previousSlide = () => {
    setCurrentSlide(
      (current) => (current - 1 + slides.length) % slides.length
    );
  };

  return (
    <div className={styles.preview}>

      <div className={styles.carousel}>
        <button
          className={styles.carousel__arrow}
          onClick={previousSlide}
          aria-label="Slide anterior"
        >
          ‹
        </button>

        {slides[currentSlide]}

        <button
          className={styles.carousel__arrow}
          onClick={nextSlide}
          aria-label="Próximo slide"
        >
          ›
        </button>
      </div>

      <div className={styles.navigation}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={
              index === currentSlide
                ? styles.navigation__dotActive
                : styles.navigation__dot
            }
            onClick={() => setCurrentSlide(index)}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>

    </div>
  );
};