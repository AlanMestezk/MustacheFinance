import { useEffect, useRef, useState } from "react";

import { FAQItem } from "./FAQItem/FAQItem";
import styles from "./styles/FAQPreview.module.scss";

export const FAQPreview = () => {
  const [isVisible, setIsVisible] = useState(false);

  const previewRef = useRef<HTMLElement>(null);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setActiveIndex((currentIndex) =>
      currentIndex === index ? null : index,
    );
  };

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

    if (previewRef.current) {
      observer.observe(previewRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={previewRef}
      className={`${styles.preview} ${
        isVisible ? styles.visible : ""
      }`}
    >
      <FAQItem
        question="Como funciona o Mustache Finance?"
        answer="O Mustache Finance ajuda você a organizar suas finanças, acompanhar seus gastos e planejar seus objetivos."
        isOpen={activeIndex === 0}
        onToggle={() => handleToggle(0)}
      />

      <FAQItem
        question="Preciso pagar para usar?"
        answer="Não precisa pagar para começar. O Mustache Finance foi pensado para ajudar você a organizar sua vida financeira de forma simples e acessível."
        isOpen={activeIndex === 1}
        onToggle={() => handleToggle(1)}
      />

      <FAQItem
        question="Posso criar metas financeiras?"
        answer="Sim! Você pode definir objetivos e acompanhar seu progresso para transformar seus planos em realidade."
        isOpen={activeIndex === 2}
        onToggle={() => handleToggle(2)}
      />

      <FAQItem
        question="Meus dados estão seguros?"
        answer="Seus dados são tratados com segurança e utilizados apenas para oferecer as funcionalidades da plataforma."
        isOpen={activeIndex === 3}
        onToggle={() => handleToggle(3)}
      />
    </section>
  );
};