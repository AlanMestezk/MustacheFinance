import styles from "./styles/FAQItem.module.scss";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

export const FAQItem = ({
  question,
  answer,
  isOpen,
  onToggle,
}: FAQItemProps) => {
  return (
    <article className={styles.item}>
      <button
        className={styles.question}
        onClick={onToggle}
        type="button"
      >
        <span>{question}</span>

        <span className={styles.icon}>
          {isOpen ? "−" : "+"}
        </span>
      </button>

      <div className={`${styles.answer} ${isOpen ? styles.open : ""}`}>
        <p>{answer}</p>
      </div>
    </article>
  );
};