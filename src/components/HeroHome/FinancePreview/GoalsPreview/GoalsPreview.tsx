import styles from "./styles/GoalsPreview.module.scss";

export const GoalsPreview = () => {
  return (
    <div className={styles.preview}>
      <span className={styles.label}>
        Meta financeira
      </span>

      <strong className={styles.title}>
        Viagem
      </strong>

      <div className={styles.amount}>
        <span>R$ 3.900</span>
        <span>de R$ 5.000</span>
      </div>

      <div className={styles.progress}>
        <div className={styles.progress__bar} />
      </div>

      <span className={styles.percentage}>
        78% concluído
      </span>
    </div>
  );
};