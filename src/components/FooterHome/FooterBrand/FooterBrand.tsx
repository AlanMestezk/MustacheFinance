import logo from "../../../assets/logo/logo.png";

import styles from "./styles/FooterBrand.module.scss";

export const FooterBrand = () => {
  return (
    <div className={styles.brand}>
      <img
        src={logo}
        alt="Mustache Finance"
        className={styles.logo}
      />

      <span className={styles.copyright}>
        © 2026 Mustache Finance. Todos os direitos reservados.
      </span>

      <p>
        Organize seu dinheiro.
        <br />
        Planeje seu futuro.
      </p>
    </div>
  );
};