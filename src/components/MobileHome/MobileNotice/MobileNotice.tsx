import { useEffect, useRef, useState } from "react";

import logo from "../../../assets/logo/logo.png";

import styles from "./styles/MobileNotice.module.scss";

export const MobileNotice = () => {
  const [isVisible, setIsVisible] = useState(false);
  const noticeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
      },
    );

    if (noticeRef.current) {
      observer.observe(noticeRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <main
      ref={noticeRef}
      className={`${styles.notice} ${
        isVisible ? styles.visible : ""
      }`}
    >
      <header className={styles.noticeHeader}>
        <img
          src={logo}
          alt="Mustache Finance"
          className={styles.logo}
        />
      </header>

      <h1>
        Uma experiência
        <br />
        melhor está <span>chegando.</span>
      </h1>

      <p className={styles.description}>
        O Mustache Finance está disponível atualmente
        apenas para computadores.
      </p>

      <div className={styles.desktopIcon}>
        <span>🖥️</span>
      </div>

      <p className={styles.future}>
        Estamos preparando uma experiência mobile
        para você acessar seus planos onde estiver.
      </p>

      <strong className={styles.comingSoon}>
        EM BREVE
      </strong>
    </main>
  );
};