import styles from "./styles/LoadingScreen.module.scss";

interface LoadScreenProps {
  title: string;
  message: string;
}

export const LoadScreen = ({
  title,
  message,
}: LoadScreenProps) => {
  return (
    <section className={styles.loading}>
      <div className={styles.loading__content}>
        <div className={styles.loading__spinner} />

        <h1>
          {title}
        </h1>

        <p>
          {message}
        </p>
      </div>
    </section>
  );
};