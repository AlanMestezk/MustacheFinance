import { useEffect, useState } from "react";

import { DashboardPreview } from "./DashboardPreview/DashboardPreview";
import { GoalsPreview } from "./GoalsPreview/GoalsPreview";
import { TransactionsPreview } from "./TransactionsPreview/TransactionsPreview";

import styles from "./styles/FinancePreview.module.scss";

export const FinancePreview = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    <DashboardPreview key="dashboard" />,
    <GoalsPreview key="goals" />,
    <TransactionsPreview key="transactions" />,
  ];

  const nextSlide = () => {
    setCurrentSlide(
      (current) => (current + 1) % slides.length
    );
  };

  const previousSlide = () => {
    setCurrentSlide(
      (current) =>
        (current - 1 + slides.length) % slides.length
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(
        (current) => (current + 1) % slides.length
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [slides.length]);

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