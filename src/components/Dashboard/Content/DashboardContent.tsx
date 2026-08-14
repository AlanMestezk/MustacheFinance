import styles from "./styles/DashboardContent.module.scss";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../../../firebase/auth";

import { getUserExpenses } from "../../../firebase/firestore";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: {
    seconds: number;
    nanoseconds: number;
  };
}

export const DashboardContent = () => {

    const [recentExpenses, setRecentExpenses] =
        useState<Expense[]>([]);

    const navigate = useNavigate();

    

    const formatCurrency = (
        value: number,
        ) => {
        return value.toLocaleString(
            "pt-BR",
            {
            style: "currency",
            currency: "BRL",
            },
        );
    };

    const getCategoryIcon = (
        category: string,
        ) => {
        const icons: Record<string, string> = {
            Alimentação: "🍔",
            Transporte: "🚗",
            Casa: "🏠",
            Lazer: "🎮",
            Compras: "🛍️",
            Saúde: "💊",
            Educação: "📚",
            Contas: "💳",
            Outros: "📦",
        };

        return icons[category] || "📦";
        };

    const formatDate = (
            timestamp: Expense["date"],
            ) => {
            if (!timestamp) return "";

            return new Date(
                timestamp.seconds * 1000,
            ).toLocaleDateString(
                "pt-BR",
                {
                day: "2-digit",
                month: "short",
                year: "numeric",
                },
            );
        };

    useEffect(() => {
        const unsubscribe =
            onAuthStateChanged(
            auth,
            async (user) => {
                if (!user) return;

                try {
                const expenses =
                    await getUserExpenses(
                    user.uid,
                    );

                setRecentExpenses(
                    expenses
                    .slice(0, 3) as Expense[],
                );
                } catch (error) {
                console.error(
                    "Erro ao carregar gastos recentes:",
                    error,
                );
                }
            },
        );

    return () => unsubscribe();
    }, []);

  return (
    <main className={styles.content}>
      <section className={styles.content__welcome}>
        <div>
          <span>Visão geral</span>

          <h1>
            Bom dia, <strong>Bigodudo!</strong> 👋
          </h1>

          <p>
            Aqui está um resumo das suas finanças.
          </p>
        </div>

        <button 
            type="button"
            onClick={() => navigate("/dashboard/expenses/new") }
            className={styles.content__primaryAction}>
          + Novo gasto
        </button>
      </section>

      <section className={styles.content__summary}>
        <article className={styles.card}>
          <span className={styles.card__label}>
            Saldo disponível
          </span>

          <strong className={styles.card__value}>
            R$ 4.250,00
          </strong>

          <span className={styles.card__positive}>
            ↑ 8,4% este mês
          </span>
        </article>

        <article className={styles.card}>
          <span className={styles.card__label}>
            Receitas
          </span>

          <strong className={styles.card__value}>
            R$ 6.500,00
          </strong>

          <span className={styles.card__positive}>
            ↑ 12,4% este mês
          </span>
        </article>

        <article className={styles.card}>
          <span className={styles.card__label}>
            Despesas
          </span>

          <strong className={styles.card__value}>
            R$ 2.250,00
          </strong>

          <span className={styles.card__negative}>
            ↓ 4,2% este mês
          </span>
        </article>
      </section>

      <section className={styles.content__mainGrid}>
        <article className={styles.planning}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionHeader__label}>
                Planejamento em destaque
              </span>

              <h2>✈️ Viagem para o Chile</h2>
            </div>

            <button>
              Ver planejamento
            </button>
          </div>

          <div className={styles.planning__amount}>
            <strong>
              R$ 5.240,00
            </strong>

            <span>
              de R$ 8.000,00
            </span>
          </div>

          <div className={styles.progress}>
            <div
              className={styles.progress__bar}
              style={{ width: "65%" }}
            />
          </div>

          <div className={styles.planning__footer}>
            <span>65% concluído</span>

            <strong>
              Faltam R$ 2.760,00
            </strong>
          </div>
        </article>

        <article className={styles.categories}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionHeader__label}>
                Seus gastos
              </span>

              <h2>Por categoria</h2>
            </div>

            <button>Ver todos</button>
          </div>

          <div className={styles.categories__list}>
            <div>
              <span>
                <i className={styles.categories__icon}>
                  🍔
                </i>

                Alimentação
              </span>

              <strong>R$ 620,00</strong>
            </div>

            <div>
              <span>
                <i className={styles.categories__icon}>
                  🚗
                </i>

                Transporte
              </span>

              <strong>R$ 430,00</strong>
            </div>

            <div>
              <span>
                <i className={styles.categories__icon}>
                  🎮
                </i>

                Lazer
              </span>

              <strong>R$ 280,00</strong>
            </div>

            <div>
              <span>
                <i className={styles.categories__icon}>
                  🏠
                </i>

                Casa
              </span>

              <strong>R$ 920,00</strong>
            </div>
          </div>
        </article>
      </section>

      <section className={styles.recent}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.sectionHeader__label}>
              Histórico
            </span>

            <h2>Gastos recentes</h2>
          </div>

          <button
            type="button"
            onClick={() =>
                navigate("/dashboard/expenses")
                }
                >
                Ver todos
            </button>
        </div>

       {recentExpenses.map((expense) => (
            <div
                key={expense.id}
                className={styles.expense}
            >
                <div className={styles.expense__icon}>
                {getCategoryIcon(
                    expense.category,
                )}
                </div>

                <div className={styles.expense__info}>
                <strong>
                    {expense.description}
                </strong>

                <span>
                    {formatDate(expense.date)}
                </span>
                </div>

                <strong className={styles.expense__amount}>
                -{" "}
                {formatCurrency(
                    expense.amount,
                )}
                </strong>
            </div>
            ))}
      </section>
    </main>
  );
};