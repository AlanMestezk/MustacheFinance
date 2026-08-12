import styles from "./FooterNavigation.module.scss";

export const FooterNavigation = () => {
  return (
    <nav className={styles.navigation}>
      <div className={styles.column}>
        <h3>Contato</h3>

        <a
          href="https://github.com/AlanMestezk"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>

        <a
          href="https://www.linkedin.com/in/alan-mestezk/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>

        <a
          href="https://wa.me/5501175034997"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
      </div>
    </nav>
  );
};