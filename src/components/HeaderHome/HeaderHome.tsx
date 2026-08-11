import { Link } from "react-router-dom";
import logo from "../../assets/logo/logo.png";

import styles from "./styles/Header.module.scss";

export const HeaderHome = () => {
  return (
    <header className={styles.header}>
      <div className={styles.header__container}>

        <Link to="/" className={styles.header__logo}>
          <img
            src={logo}
            alt="Mustache Finance"
            className={styles.header__logoImage}
          />
        </Link>

        <nav className={styles.header__navigation}>
          <Link
            to="/login"
            className={styles.header__login}
          >
            Entrar
          </Link>

          <Link
            to="/register"
            className={styles.header__register}
          >
            Criar conta
          </Link>
        </nav>

      </div>
    </header>
  );
};