
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MdAddAPhoto,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";

import logo from "../../assets/logo/logo.png";

import styles from "./styles/RegisterForm.module.scss";

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className={styles.form}>
      <div className={styles.form__header}>
        <img
          src={logo}
          alt="Mustache Finance"
          className={styles.form__logo}
        />

        <h1>
          Crie sua
          <span> conta.</span>
        </h1>

        <p>
          Comece a organizar suas finanças hoje.
        </p>
      </div>

      <form className={styles.form__content}>
        <div className={styles.form__photo}>
          <button
            type="button"
            className={styles.form__photoButton}
          >
            <MdAddAPhoto />

            <span>Adicionar foto</span>
          </button>
        </div>

        <div className={styles.form__field}>
          <label htmlFor="name">
            Como quer ser chamado
          </label>

          <input
            id="name"
            name="name"
            type="text"
            placeholder="Seu nome"
            autoComplete="name"
          />
        </div>

        <div className={styles.form__field}>
          <label htmlFor="email">
            E-mail
          </label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
          />
        </div>

        <div className={styles.form__field}>
          <label htmlFor="password">
            Senha
          </label>

          <div className={styles.form__password}>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha"
              autoComplete="new-password"
            />

            <button
              type="button"
              className={styles.form__passwordToggle}
              onClick={() =>
                setShowPassword((current) => !current)
              }
              aria-label={
                showPassword
                  ? "Ocultar senha"
                  : "Mostrar senha"
              }
            >
              {showPassword ? (
                <MdVisibilityOff />
              ) : (
                <MdVisibility />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className={styles.form__button}
        >
          Criar conta
        </button>
      </form>

      <div className={styles.form__login}>
        <span>
          Já possui uma conta?
        </span>

        <Link to="/login">
          Entrar
        </Link>
      </div>
    </section>
  );
};