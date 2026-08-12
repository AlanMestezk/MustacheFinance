import styles from "./styles/TransactionsPreview.module.scss";

export const TransactionsPreview = () => {
  return (
    <div className={styles.preview}>
      <span className={styles.label}>
        Últimas transações
      </span>

      <div className={styles.transaction}>
        <span>Supermercado</span>

        <strong className={styles.expense}>
          - R$ 185,40
        </strong>
      </div>

      <div className={styles.transaction}>
        <span>Salário</span>

        <strong className={styles.income}>
          + R$ 4.500,00
        </strong>
      </div>

      <div className={styles.transaction}>
        <span>Streaming</span>

        <strong className={styles.expense}>
          - R$ 39,90
        </strong>
      </div>
    </div>
  );
};