
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

import logo from "../../../assets/logo/logo.png";

import styles from "./styles/MobileFooter.module.scss";

export const MobileFooter = () => {
  return (
    <footer className={styles.footer}>
      <img
        src={logo}
        alt="Mustache Finance"
        className={styles.logo}
      />

      <p className={styles.description}>
        Organize seu dinheiro.
        <br />
        Planeje seu futuro.
      </p>

      <div className={styles.links}>
        <a
          href="mailto:contato@mustachefinance.com"
          aria-label="Contato"
        >
          <MdEmail />
        </a>

        <a
          href="https://github.com/AlanMestezk"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        >
          <FaGithub />
        </a>

        <a
          href="https://www.linkedin.com/in/alan-mestezk/"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedin />
        </a>

        <a
          href="https://wa.me/5501175034997"
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp"
        >
          <FaWhatsapp />
        </a>
      </div>

      <span className={styles.copyright}>
        © 2026 Mustache Finance.
        <br />
        Todos os direitos reservados.
      </span>
    </footer>
  );
};