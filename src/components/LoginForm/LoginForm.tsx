import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";

import logo from "../../assets/logo/logo.png";

import { loginUser } from "../../firebase/auth";

import { FirebaseError } from "firebase/app";

import { LoadScreen } from "../LoadScreen/LoadScreen";

import styles from "./styles/LoginForm.module.scss";

export const LoginForm = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setMessage("");

    try {
      // 1. Faz login no Firebase Authentication
      const user = await loginUser(
        email,
        password,
      );

      console.log(
        "Usuário autenticado:",
        user.uid,
      );

      // 2. Mostra tela de carregamento
      setIsLoading(true);

      // 3. Aguarda um pouco e entra no sistema
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (error) {
      console.error(
        "Erro ao fazer login:",
        error,
      );

      if (
        error instanceof FirebaseError
      ) {
        switch (error.code) {
          case "auth/invalid-email":
            setMessage(
              "Digite um e-mail válido.",
            );
            break;

          case "auth/user-not-found":
            setMessage(
              "E-mail ou senha incorretos.",
            );
            break;

          case "auth/wrong-password":
            setMessage(
              "E-mail ou senha incorretos.",
            );
            break;

          case "auth/invalid-credential":
            setMessage(
              "E-mail ou senha incorretos.",
            );
            break;

          case "auth/too-many-requests":
            setMessage(
              "Muitas tentativas. Aguarde alguns instantes e tente novamente.",
            );
            break;

          case "auth/user-disabled":
            setMessage(
              "Esta conta foi desativada.",
            );
            break;

          case "auth/network-request-failed":
            setMessage(
              "Erro de conexão. Verifique sua internet e tente novamente.",
            );
            break;

          default:
            setMessage(
              "Não foi possível entrar. Tente novamente.",
            );
        }
      } else {
        setMessage(
          "Não foi possível entrar. Tente novamente.",
        );
      }
    }
  };

  if (isLoading) {
    return (
      <LoadScreen
        title="Entrando na sua conta..."
        message="Só um momento. Estamos preparando tudo para você."
      />
    );
  }

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
          Entre na sua conta e continue
          organizando seus planos.
        </p>
      </div>

      <form
        className={styles.form__content}
        onSubmit={handleSubmit}
      >
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
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value,
              )
            }
          />
        </div>

        <div className={styles.form__field}>
          <label htmlFor="password">
            Senha
          </label>

          <div
            className={
              styles.form__password
            }
          >
            <input
              id="password"
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Digite sua senha"
              autoComplete="current-password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value,
                )
              }
            />

            <button
              type="button"
              className={
                styles.form__passwordToggle
              }
              onClick={() =>
                setShowPassword(
                  (current) => !current,
                )
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

        {message && (
          <p>{message}</p>
        )}
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