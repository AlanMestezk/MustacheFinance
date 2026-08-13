


import { LoginForm } from "../../components/LoginForm/LoginForm";

import styles from "./styles/Login.module.scss";

export const Login = () => {
  return (
    <main className={styles.page}>
      <LoginForm />
    </main>
  );
};