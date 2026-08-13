import { RegisterForm } from "../../components/RegisterForm/RegisterForm";

import styles from "./styles/Register.module.scss";

export const Register = () => {
  return (
    <main className={styles.page}>
      <RegisterForm />
    </main>
  );
};