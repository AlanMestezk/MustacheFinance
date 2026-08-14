import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";

import {
  MdAdd,
  MdArrowBack,
  MdDeleteOutline,
  MdEdit,
} from "react-icons/md";



import { auth } from "../../../firebase/auth";

import {
  getUserExpenses,
  deleteExpense,
} from "../../../firebase/firestore";

import styles from "./styles/ExpenseList.module.scss";

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

export const ExpenseList = () => {
  console.log("🔥 ExpenseList foi renderizado!");

  const navigate = useNavigate();

  const [expenses, setExpenses] = useState<Expense[]>(
    [],
  );

  const [expenseToDelete, setExpenseToDelete] =
  useState<Expense | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
  console.log(
    "🔥 useEffect do ExpenseList executou!",
  );



  const unsubscribe =
    onAuthStateChanged(
      auth,
      async (user) => {
        console.log(
          "👤 Estado de autenticação:",
          user,
        );

        if (!user) {
          console.log(
            "❌ Nenhum usuário autenticado.",
          );

          setError(
            "Você precisa estar logado para visualizar seus gastos.",
          );

          setLoading(false);

          return;
        }

        try {
          console.log(
            "🔥 Buscando gastos para:",
            user.uid,
          );

          const data =
            await getUserExpenses(
              user.uid,
            );

          console.log(
            "🔥 Gastos encontrados:",
            data,
          );

          setExpenses(
            data as Expense[],
          );
        } catch (error) {
          console.error(
            "❌ Erro ao buscar gastos:",
            error,
          );

          setError(
            "Não foi possível carregar seus gastos.",
          );
        } finally {
          console.log(
            "🔥 Finalizando carregamento.",
          );

          setLoading(false);
        }
      },
    );

  return () => unsubscribe();
}, []);

  const total = expenses.reduce(
    (sum, expense) =>
      sum + expense.amount,
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
      Outros: "📦",
    };

    return (
      icons[category] || "📦"
    );
  };

  const handleDelete = (
  expense: Expense,
) => {
  setExpenseToDelete(expense);
};
const confirmDelete = async () => {
  if (!expenseToDelete) return;

  const user = auth.currentUser;

  if (!user) {
    setError(
      "Você precisa estar logado para excluir um gasto.",
    );

    return;
  }

  try {
    await deleteExpense(
      user.uid,
      expenseToDelete.id,
    );

    setExpenses((current) =>
      current.filter(
        (expense) =>
          expense.id !==
          expenseToDelete.id,
      ),
    );

    setExpenseToDelete(null);
  } catch (error) {
    console.error(
      "Erro ao excluir gasto:",
      error,
    );

    setError(
      "Não foi possível excluir o gasto.",
    );
  }
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
              Seus
              <strong> gastos.</strong>
            </h1>

            <p>
              Acompanhe suas despesas e
              mantenha tudo sob controle.
            </p>
          </div>

          <button
            type="button"
            className={styles.add}
            onClick={() =>
              navigate(
                "/dashboard/expenses/new",
              )
            }
          >
            <MdAdd />

            Novo gasto
          </button>
        </header>

        <section className={styles.summary}>
          <div>
            <span>Total de gastos</span>

            <strong>
              {formatCurrency(total)}
            </strong>
          </div>

          <div>
            <span>Quantidade</span>

            <strong>
              {expenses.length}
            </strong>
          </div>
        </section>

        <section className={styles.list}>
          <div className={styles.list__header}>
            <h2>
              Histórico
            </h2>

            <span>
              {expenses.length}{" "}
              {expenses.length === 1
                ? "lançamento"
                : "lançamentos"}
            </span>
          </div>

          {loading && (
            <div className={styles.state}>
              <p>
                Carregando seus gastos...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className={styles.state}>
              <p>
                {error}
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            expenses.length === 0 && (
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
                  💸
                </div>

                <h3>
                  Nenhum gasto ainda
                </h3>

                <p>
                  Comece registrando sua
                  primeira despesa.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/dashboard/expenses/new",
                    )
                  }
                >
                  Adicionar primeiro gasto
                </button>
              </div>
            )}

          {!loading &&
            !error &&
            expenses.length > 0 && (
              <div
                className={
                  styles.list__items
                }
              >
                {expenses.map(
                  (expense) => (
                    <article
                      key={expense.id}
                      className={
                        styles.expense
                      }
                    >
                      <div
                        className={
                          styles.expense__main
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
                            {
                              expense.category
                            }{" "}
                            •{" "}
                            {formatDate(
                              expense.date,
                            )}
                          </span>
                        </div>
                      </div>

                      <div
                        className={
                          styles.expense__right
                        }
                      >
                        <strong>
                          -{" "}
                          {formatCurrency(
                            expense.amount,
                          )}
                        </strong>

                        <div
                          className={
                            styles.expense__actions
                          }
                        >
                          <button
                            type="button"
                            title="Editar gasto"
                            onClick={() =>
                              navigate(
                                `/dashboard/expenses/edit/${expense.id}`,
                              )
                            }
                          >
                            <MdEdit />
                          </button>

                          <button
                            type="button"
                            title="Excluir gasto"
                            onClick={() =>
                              handleDelete(expense)
                            }
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
      {expenseToDelete && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Excluir gasto?</h3>

            <p>
              Deseja excluir{" "}
              <strong>
                {expenseToDelete.description}
              </strong>
              ?
            </p>

            <div className={styles.modal__actions}>
              <button
                type="button"
                onClick={() =>
                  setExpenseToDelete(null)
                }
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmDelete}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};