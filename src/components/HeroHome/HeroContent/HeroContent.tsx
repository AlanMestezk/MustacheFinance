import styles from "./styles/HeroContent.module.scss";

export const HeroContent = () => {
  return (
    <div className={styles.content}>
      <span className={styles.eyebrow}>
        Controle financeiro simples
      </span>

      <h1 className={styles.title}>
        Suas finanças.
        <br />
        <span>Sob seu controle.</span>
      </h1>

      <p className={styles.description}>
        Organize seu dinheiro, acompanhe seus gastos e
        planeje seus objetivos financeiros.
      </p>

      <button className={styles.button}>
        Começar agora
      </button>
    </div>
  );
};