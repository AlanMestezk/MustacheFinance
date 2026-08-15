import {
  MdDashboard,
  MdAddCircleOutline,
  MdAssignment,
  MdReceiptLong,
  MdBarChart,
  MdTrendingUp,
  MdLogout,
} from "react-icons/md";

import styles from "./styles/DashboardNavigation.module.scss";

import { useNavigate } from "react-router-dom";

import { signOut } from "firebase/auth";

import { auth } from "../../../firebase/auth";

export const DashboardNavigation = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);

      navigate("/");
    } catch (error) {
      console.error(
        "Erro ao sair:",
        error,
      );
    }
  };

  return (
    <nav className={styles.navigation}>
      <a
        href="/dashboard"
        className={`${styles.navigation__item} ${styles.navigation__itemActive}`}
      >
        <MdDashboard />

        <span>
          Visão geral
        </span>
      </a>

      <button
        type="button"
        className={styles.navigation__item}
        onClick={() =>
          navigate(
            "/dashboard/investments/new",
          )
        }
      >
        <MdAddCircleOutline />

        <span>
          Novo planejamento
        </span>
      </button>

      <button
        type="button"
        className={styles.navigation__item}
        onClick={() =>
          navigate(
            "/dashboard/investments",
          )
        }
      >
        <MdAssignment />

        <span>
          Meus planejamentos
        </span>
      </button>

      <a
        href="/dashboard/incomes"
        className={styles.navigation__item}
      >
        <MdTrendingUp />

        <span>
          Entradas
        </span>
      </a>

      <a
        href="/dashboard/expenses"
        className={styles.navigation__item}
      >
        <MdReceiptLong />

        <span>
          Gastos
        </span>
      </a>

      <button
        type="button"
        className={styles.navigation__item}
        onClick={() =>
          navigate(
            "/dashboard/reports",
          )
        }
      >
        <MdBarChart />

        <span>
          Relatórios
        </span>
      </button>

      {/* ESPAÇO ATÉ O FINAL DA SIDEBAR */}
      <div
        className={
          styles.navigation__spacer
        }
      />

      {/* SAIR */}
      <button
        type="button"
        className={`${styles.navigation__item} ${styles.navigation__logout}`}
        onClick={handleLogout}
      >
        <MdLogout />

        <span>
          Sair
        </span>
      </button>
    </nav>
  );
};