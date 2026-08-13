import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";

import logo from "../../assets/logo/logo.png";

import styles from "./styles/LoginForm.module.scss";

export const LoginForm = () => {
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
          Bem-vindo
          <br />
          <span>de volta.</span>
        </h1>

        <p>
          Entre na sua conta e continue organizando
          seus planos.
        </p>
      </div>

      <form className={styles.form__content}>
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
                autoComplete="current-password"
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

        <div className={styles.form__forgot}>
          <Link to="/forgot-password">
            Esqueci minha senha
          </Link>
        </div>

        <button
          type="submit"
          className={styles.form__button}
        >
          Entrar
        </button>
      </form>

      <div className={styles.form__register}>
        <span>
          Ainda não possui uma conta?
        </span>

        <Link to="/register">
          Criar conta
        </Link>
      </div>
    </section>
  );
};