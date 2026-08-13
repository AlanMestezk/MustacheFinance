import { useState } from "react";
import { Link } from "react-router-dom";

import logo from "../../assets/logo/logo.png";

import { resetPassword } from "../../firebase/auth";

import { FirebaseError } from "firebase/app";

import styles from "./styles/ForgotPasswordForm.module.scss";

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setMessage("");
    setSuccess(false);

    try {
      await resetPassword(email);

      setSuccess(true);

      setMessage(
        "Enviamos um link para redefinir sua senha. Verifique seu e-mail.",
      );
    } catch (error) {
      console.error(
        "Erro ao redefinir senha:",
        error,
      );

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-email":
            setMessage(
              "Digite um e-mail válido.",
            );
            break;

          case "auth/user-not-found":
            setMessage(
              "Não encontramos uma conta com este e-mail.",
            );
            break;

          case "auth/too-many-requests":
            setMessage(
              "Muitas tentativas. Aguarde alguns instantes e tente novamente.",
            );
            break;

          default:
            setMessage(
              "Não foi possível enviar o e-mail. Tente novamente.",
            );
        }
      } else {
        setMessage(
          "Não foi possível enviar o e-mail. Tente novamente.",
        );
      }
    }
  };

  return (

    <main className={styles.page}>
        
        <section className={styles.form}>
      <div className={styles.form__header}>
        <img
          src={logo}
          alt="Mustache Finance"
          className={styles.form__logo}
        />

        <h1>
          Redefina sua
          <br />
          <span>senha.</span>
        </h1>

        <p>
          Informe seu e-mail e enviaremos um
          link para você criar uma nova senha.
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
              setEmail(event.target.value)
            }
          />
        </div>

        <button
          type="submit"
          className={styles.form__button}
        >
          Enviar link
        </button>

        {message && (
          <p
            className={
              success
                ? styles.form__success
                : styles.form__error
            }
          >
            {message}
          </p>
        )}
      </form>

      <div className={styles.form__login}>
        <Link to="/login">
          ← Voltar para o login
        </Link>
      </div>
    </section>

    </main>
    
  );
};