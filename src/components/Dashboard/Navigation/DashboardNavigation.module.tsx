import {
  MdDashboard,
  MdAddCircleOutline,
  MdAssignment,
  MdReceiptLong,
  MdBarChart,
} from "react-icons/md";

import styles from "./styles/DashboardNavigation.module.scss";

export const DashboardNavigation = () => {
  return (
    <nav className={styles.navigation}>
      <a
        href="#"
        className={`${styles.navigation__item} ${styles.navigation__itemActive}`}
      >
        <MdDashboard />
        <span>Visão geral</span>
      </a>

      <a
        href="#"
        className={styles.navigation__item}
      >
        <MdAddCircleOutline />
        <span>Novo planejamento</span>
      </a>

      <a
        href="#"
        className={styles.navigation__item}
      >
        <MdAssignment />
        <span>Meus planejamentos</span>
      </a>

      <a
        href="/dashboard/expenses"
        className={styles.navigation__item}
      >
        <MdReceiptLong />
        <span>Gastos</span>
      </a>

      <a
        href="#"
        className={styles.navigation__item}
      >
        <MdBarChart />
        <span>Relatórios</span>
      </a>
    </nav>
  );
};