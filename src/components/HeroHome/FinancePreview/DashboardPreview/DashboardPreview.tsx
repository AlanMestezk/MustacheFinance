import styles from "./styles/DashboardPreview.module.scss";

export const DashboardPreview = () => {
  return (
    <div className={styles.preview}>
      <span className={styles.label}>
        Saldo atual
      </span>

      <strong className={styles.balance}>
        R$ 4.250,00
      </strong>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>
            Receitas
          </span>

          <strong className={styles.statValuePositive}>
            R$ 6.200,00
          </strong>
        </div>

        <div className={styles.stat}>
          <span className={styles.statLabel}>
            Despesas
          </span>

          <strong className={styles.statValue}>
            R$ 1.950,00
          </strong>
        </div>
      </div>
    </div>
  );
};