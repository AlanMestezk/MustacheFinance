import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  MdAdd,
  MdArrowBack,
  MdDeleteOutline,
  MdEdit,
} from "react-icons/md";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../../../firebase/auth";

import { getUserIncomes } from "../../../firebase/firestore";

import styles from "./styles/IncomeList.module.scss";

interface Income {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: {
    seconds: number;
    nanoseconds: number;
  };
}

export const IncomeList = () => {
  const navigate = useNavigate();

  const [incomes, setIncomes] =
    useState<Income[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {
          if (!user) {
            setError(
              "Você precisa estar logado para visualizar suas entradas.",
            );

            setLoading(false);

            return;
          }

          try {
            const data =
              await getUserIncomes(
                user.uid,
              );

            setIncomes(
              data as Income[],
            );
          } catch (error) {
            console.error(
              "Erro ao buscar entradas:",
              error,
            );

            setError(
              "Não foi possível carregar suas entradas.",
            );
          } finally {
            setLoading(false);
          }
        },
      );

    return () => unsubscribe();
  }, []);

  const total = incomes.reduce(
    (sum, income) =>
      sum + income.amount,
    0,
  );

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

  const formatDate = (
    timestamp: Income["date"],
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

  const getCategoryIcon = (
    category: string,
  ) => {
    const icons: Record<
      string,
      string
    > = {
      Salário: "💼",
      Freelance: "💻",
      Investimentos: "📈",
      Vendas: "🛍️",
      Presente: "🎁",
      Outros: "📦",
    };

    return (
      icons[category] || "📦"
    );
  };

  return (
    <main className={styles.page}>
      <section className={styles.content}>
        <button
          type="button"
          className={styles.back}
          onClick={() =>
            navigate("/dashboard")
          }
        >
          <MdArrowBack />

          Voltar para o dashboard
        </button>

        <header className={styles.header}>
          <div>
            <span>FINANÇAS</span>

            <h1>
              Suas
              <strong> entradas.</strong>
            </h1>

            <p>
              Acompanhe seus recebimentos e
              mantenha tudo sob controle.
            </p>
          </div>

          <button
            type="button"
            className={styles.add}
            onClick={() =>
              navigate(
                "/dashboard/incomes/new",
              )
            }
          >
            <MdAdd />

            Nova entrada
          </button>
        </header>

        <section className={styles.summary}>
          <div>
            <span>Total recebido</span>

            <strong>
              {formatCurrency(total)}
            </strong>
          </div>

          <div>
            <span>Quantidade</span>

            <strong>
              {incomes.length}
            </strong>
          </div>
        </section>

        <section className={styles.list}>
          <div
            className={styles.list__header}
          >
            <h2>Histórico</h2>

            <span>
              {incomes.length}{" "}
              {incomes.length === 1
                ? "lançamento"
                : "lançamentos"}
            </span>
          </div>

          {loading && (
            <div className={styles.state}>
              <p>
                Carregando suas entradas...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className={styles.state}>
              <p>{error}</p>
            </div>
          )}

          {!loading &&
            !error &&
            incomes.length === 0 && (
              <div
                className={
                  styles.empty
                }
              >
                <div
                  className={
                    styles.empty__icon
                  }
                >
                  💰
                </div>

                <h3>
                  Nenhuma entrada ainda
                </h3>

                <p>
                  Comece registrando seu
                  primeiro recebimento.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/dashboard/incomes/new",
                    )
                  }
                >
                  Adicionar primeira entrada
                </button>
              </div>
            )}

          {!loading &&
            !error &&
            incomes.length > 0 && (
              <div
                className={
                  styles.list__items
                }
              >
                {incomes.map(
                  (income) => (
                    <article
                      key={income.id}
                      className={
                        styles.income
                      }
                    >
                      <div
                        className={
                          styles.income__main
                        }
                      >
                        <div
                          className={
                            styles.income__icon
                          }
                        >
                          {getCategoryIcon(
                            income.category,
                          )}
                        </div>

                        <div
                          className={
                            styles.income__info
                          }
                        >
                          <strong>
                            {
                              income.description
                            }
                          </strong>

                          <span>
                            {
                              income.category
                            }{" "}
                            •{" "}
                            {formatDate(
                              income.date,
                            )}
                          </span>
                        </div>
                      </div>

                      <div
                        className={
                          styles.income__right
                        }
                      >
                        <strong>
                          +{" "}
                          {formatCurrency(
                            income.amount,
                          )}
                        </strong>

                        <div
                          className={
                            styles.income__actions
                          }
                        >
                          <button
                            type="button"
                            title="Editar entrada"
                          >
                            <MdEdit />
                          </button>

                          <button
                            type="button"
                            title="Excluir entrada"
                          >
                            <MdDeleteOutline />
                          </button>
                        </div>
                      </div>
                    </article>
                  ),
                )}
              </div>
            )}
        </section>
      </section>
    </main>
  );
};