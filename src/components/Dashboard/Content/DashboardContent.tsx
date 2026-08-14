import styles from "./styles/DashboardContent.module.scss";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../../../firebase/auth";

import {
  getUserExpenses,
  getUserIncomes,
  getUserInvestments,
} from "../../../firebase/firestore";

import { MdAdd } from "react-icons/md";

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

interface Investment {
  id: string;
  description: string;
  amount: number;
  goalAmount?: number;
  category: string;
  date: {
    seconds: number;
    nanoseconds: number;
  };
}

export const DashboardContent = () => {
  const [recentExpenses, setRecentExpenses] =
    useState<Expense[]>([]);

  const [recentIncomes, setRecentIncomes] =
    useState<Income[]>([]);

  const [recentInvestments, setRecentInvestments] =
    useState<Investment[]>([]);

  const [totalIncome, setTotalIncome] =
    useState(0);

  const [totalExpenses, setTotalExpenses] =
    useState(0);

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
    const icons: Record<
      string,
      string
    > = {
      Alimentação: "🍔",
      Transporte: "🚗",
      Casa: "🏠",
      Lazer: "🎮",
      Compras: "🛍️",
      Saúde: "💊",
      Educação: "📚",
      Contas: "💳",

      // Planejamentos
      Veículo: "🏍️",
      Viagem: "✈️",
      Tecnologia: "💻",

      Outros: "📦",
    };

    return (
      icons[category] || "📦"
    );
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
            const [
              expenses,
              incomes,
              investments,
            ] = await Promise.all([
              getUserExpenses(
                user.uid,
              ),
              getUserIncomes(
                user.uid,
              ),
              getUserInvestments(
                user.uid,
              ),
            ]);

            const expenseData =
              expenses as Expense[];

            const incomeData =
              incomes as Income[];

            const investmentData =
              investments as Investment[];

            setRecentExpenses(
              expenseData.slice(0, 3),
            );

            setRecentIncomes(
              incomeData.slice(0, 3),
            );

            setRecentInvestments(
              investmentData.slice(0, 3),
            );

            setTotalExpenses(
              expenseData.reduce(
                (sum, expense) =>
                  sum + expense.amount,
                0,
              ),
            );

            setTotalIncome(
              incomeData.reduce(
                (sum, income) =>
                  sum + income.amount,
                0,
              ),
            );
          } catch (error) {
            console.error(
              "Erro ao carregar dados do dashboard:",
              error,
            );
          }
        },
      );

    return () => unsubscribe();
  }, []);

  const balance =
    totalIncome - totalExpenses;

  const featuredInvestment =
    recentInvestments[0];

  const featuredProgress =
    featuredInvestment?.goalAmount
      ? Math.min(
          (featuredInvestment.amount /
            featuredInvestment.goalAmount) *
            100,
          100,
        )
      : 0;

  const featuredRemaining =
    featuredInvestment?.goalAmount
      ? Math.max(
          featuredInvestment.goalAmount -
            featuredInvestment.amount,
          0,
        )
      : 0;

  return (
    <main className={styles.content}>
      {/* BOAS-VINDAS */}
      <section
        className={
          styles.content__welcome
        }
      >
        <div>
          <span>
            Visão geral
          </span>

          <h1>
            Bem vindo,{" "}
            <strong>
              Sr(a) Bigodudo!
            </strong>{" "}
            👋
          </h1>

          <p>
            Aqui está um resumo das
            suas finanças.
          </p>
        </div>

        <button
          type="button"
          className={
            styles.quickAction__income
          }
          onClick={() =>
            navigate(
              "/dashboard/incomes/new",
            )
          }
        >
          <MdAdd />

          Nova entrada
        </button>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/dashboard/expenses/new",
            )
          }
          className={
            styles.content__primaryAction
          }
        >
          + Novo gasto
        </button>
      </section>

      {/* RESUMO */}
      <section
        className={
          styles.content__summary
        }
      >
        <article
          className={styles.card}
        >
          <span
            className={
              styles.card__label
            }
          >
            Saldo disponível
          </span>

          <strong
            className={
              styles.card__value
            }
          >
            {formatCurrency(
              balance,
            )}
          </strong>

          <span
            className={
              balance >= 0
                ? styles.card__positive
                : styles.card__negative
            }
          >
            {balance >= 0
              ? "↑ Saldo positivo"
              : "↓ Saldo negativo"}
          </span>
        </article>

        <article
          className={styles.card}
        >
          <span
            className={
              styles.card__label
            }
          >
            Receitas
          </span>

          <strong
            className={
              styles.card__value
            }
          >
            {formatCurrency(
              totalIncome,
            )}
          </strong>

          <span
            className={
              styles.card__positive
            }
          >
            Entradas registradas
          </span>
        </article>

        <article
          className={styles.card}
        >
          <span
            className={
              styles.card__label
            }
          >
            Despesas
          </span>

          <strong
            className={
              styles.card__value
            }
          >
            {formatCurrency(
              totalExpenses,
            )}
          </strong>

          <span
            className={
              styles.card__negative
            }
          >
            Gastos registrados
          </span>
        </article>
      </section>

      {/* PLANEJAMENTO EM DESTAQUE + PLANEJAMENTOS RECENTES */}
      <section
        className={
          styles.content__mainGrid
        }
      >
        {/* PLANEJAMENTO EM DESTAQUE */}
        <article
          className={styles.planning}
        >
          <div
            className={
              styles.sectionHeader
            }
          >
            <div>
              <span
                className={
                  styles.sectionHeader__label
                }
              >
                Planejamento em
                destaque
              </span>

              <h2>
                {featuredInvestment
                  ? `${getCategoryIcon(
                      featuredInvestment.category,
                    )} ${
                      featuredInvestment.description
                    }`
                  : "🎯 Nenhum planejamento"}
              </h2>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/dashboard/investments",
                )
              }
            >
              Ver planejamento
            </button>
          </div>

          <div
            className={
              styles.planning__amount
            }
          >
            <strong>
              {featuredInvestment
                ? formatCurrency(
                    featuredInvestment.amount,
                  )
                : "R$ 0,00"}
            </strong>

            <span>
              {featuredInvestment?.goalAmount
                ? `de ${formatCurrency(
                    featuredInvestment.goalAmount,
                  )}`
                : "Defina uma meta"}
            </span>
          </div>

          <div
            className={styles.progress}
          >
            <div
              className={
                styles.progress__bar
              }
              style={{
                width: `${featuredProgress}%`,
              }}
            />
          </div>

          <div
            className={
              styles.planning__footer
            }
          >
            <span>
              {featuredInvestment
                ? `${featuredProgress.toLocaleString(
                    "pt-BR",
                    {
                      maximumFractionDigits: 1,
                    },
                  )}% concluído`
                : "Nenhum planejamento"}
            </span>

            <strong>
              {featuredInvestment?.goalAmount
                ? featuredRemaining >
                  0
                  ? `Faltam ${formatCurrency(
                      featuredRemaining,
                    )}`
                  : "Meta alcançada! 🎉"
                : ""}
            </strong>
          </div>
        </article>

        {/* PLANEJAMENTOS RECENTES */}
        <article
          className={
            styles.investments
          }
        >
          <div
            className={
              styles.sectionHeader
            }
          >
            <div>
              <span
                className={
                  styles.sectionHeader__label
                }
              >
                Planejamentos
              </span>

              <h2>
                Metas recentes
              </h2>
            </div>

            <div
              className={
                styles.investments__actions
              }
            >
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/dashboard/investments/new",
                  )
                }
              >
                + Novo
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/dashboard/investments",
                  )
                }
              >
                Ver todos
              </button>
            </div>
          </div>

          <div
            className={
              styles.investments__list
            }
          >
            {recentInvestments.length ===
            0 ? (
              <div
                className={
                  styles.investment
                }
              >
                <div
                  className={
                    styles.investment__icon
                  }
                >
                  🎯
                </div>

                <div
                  className={
                    styles.investment__info
                  }
                >
                  <strong>
                    Nenhum planejamento
                  </strong>

                  <span>
                    Crie uma meta para
                    começar.
                  </span>
                </div>
              </div>
            ) : (
              recentInvestments.map(
                (investment) => {
                  const progress =
                    investment.goalAmount
                      ? Math.min(
                          (investment.amount /
                            investment.goalAmount) *
                            100,
                          100,
                        )
                      : 0;

                  return (
                    <div
                      key={
                        investment.id
                      }
                      className={
                        styles.investment
                      }
                    >
                      <div
                        className={
                          styles.investment__icon
                        }
                      >
                        {getCategoryIcon(
                          investment.category,
                        )}
                      </div>

                      <div
                        className={
                          styles.investment__info
                        }
                      >
                        <strong>
                          {
                            investment.description
                          }
                        </strong>

                        <span>
                          {formatCurrency(
                            investment.amount,
                          )}

                          {investment.goalAmount
                            ? ` de ${formatCurrency(
                                investment.goalAmount,
                              )}`
                            : ""}
                        </span>
                      </div>

                      <strong
                        className={
                          styles.investment__amount
                        }
                      >
                        {progress.toLocaleString(
                          "pt-BR",
                          {
                            maximumFractionDigits: 1,
                          },
                        )}
                        %
                      </strong>
                    </div>
                  );
                },
              )
            )}
          </div>
        </article>
      </section>

      {/* ENTRADAS RECENTES */}
      <section
        className={styles.recent}
      >
        <div
          className={
            styles.sectionHeader
          }
        >
          <div>
            <span
              className={
                styles.sectionHeader__label
              }
            >
              Histórico
            </span>

            <h2>
              Entradas recentes
            </h2>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/dashboard/incomes",
              )
            }
          >
            Ver todos
          </button>
        </div>

        {recentIncomes.length ===
        0 ? (
          <div
            className={
              styles.expense
            }
          >
            <div
              className={
                styles.expense__icon
              }
            >
              💰
            </div>

            <div
              className={
                styles.expense__info
              }
            >
              <strong>
                Nenhuma entrada
              </strong>

              <span>
                Cadastre sua primeira
                entrada.
              </span>
            </div>
          </div>
        ) : (
          recentIncomes.map(
            (income) => (
              <div
                key={income.id}
                className={
                  styles.expense
                }
              >
                <div
                  className={
                    styles.expense__icon
                  }
                >
                  💰
                </div>

                <div
                  className={
                    styles.expense__info
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

                <strong
                  className={
                    styles.income__amount
                  }
                >
                  +{" "}
                  {formatCurrency(
                    income.amount,
                  )}
                </strong>
              </div>
            ),
          )
        )}
      </section>

      {/* GASTOS RECENTES */}
      <section
        className={styles.recent}
      >
        <div
          className={
            styles.sectionHeader
          }
        >
          <div>
            <span
              className={
                styles.sectionHeader__label
              }
            >
              Histórico
            </span>

            <h2>
              Gastos recentes
            </h2>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/dashboard/expenses",
              )
            }
          >
            Ver todos
          </button>
        </div>

        {recentExpenses.length ===
        0 ? (
          <div
            className={
              styles.expense
            }
          >
            <div
              className={
                styles.expense__icon
              }
            >
              💸
            </div>

            <div
              className={
                styles.expense__info
              }
            >
              <strong>
                Nenhum gasto
              </strong>

              <span>
                Seus gastos recentes
                aparecerão aqui.
              </span>
            </div>
          </div>
        ) : (
          recentExpenses.map(
            (expense) => (
              <div
                key={expense.id}
                className={
                  styles.expense
                }
              >
                <div
                  className={
                    styles.expense__icon
                  }
                >
                  {getCategoryIcon(
                    expense.category,
                  )}
                </div>

                <div
                  className={
                    styles.expense__info
                  }
                >
                  <strong>
                    {
                      expense.description
                    }
                  </strong>

                  <span>
                    {expense.category}{" "}
                    •{" "}
                    {formatDate(
                      expense.date,
                    )}
                  </span>
                </div>

                <strong
                  className={
                    styles.expense__amount
                  }
                >
                  -{" "}
                  {formatCurrency(
                    expense.amount,
                  )}
                </strong>
              </div>
            ),
          )
        )}
      </section>
    </main>
  );
};