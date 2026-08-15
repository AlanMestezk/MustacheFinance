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

import {
  getUserIncomes,
  deleteIncome,
  updateIncome,
} from "../../../firebase/firestore";

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

  const [incomeToDelete, setIncomeToDelete] =
    useState<Income | null>(null);

  const [incomeToEdit, setIncomeToEdit] =
    useState<Income | null>(null);

  const [editDescription, setEditDescription] =
    useState("");

  const [editAmount, setEditAmount] =
    useState("");

  const [editCategory, setEditCategory] =
    useState("");

  const [editDate, setEditDate] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

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

  /* =====================================================
     EXCLUIR
  ===================================================== */

  const handleDelete = (
    income: Income,
  ) => {
    setIncomeToDelete(income);
  };

  const confirmDelete = async () => {
    if (!incomeToDelete) return;

    const user = auth.currentUser;

    if (!user) {
      setError(
        "Você precisa estar logado para excluir uma entrada.",
      );

      return;
    }

    try {
      setDeleting(true);

      await deleteIncome(
        user.uid,
        incomeToDelete.id,
      );

      setIncomes(
        (current) =>
          current.filter(
            (income) =>
              income.id !==
              incomeToDelete.id,
          ),
      );

      setIncomeToDelete(null);
    } catch (error) {
      console.error(
        "Erro ao excluir entrada:",
        error,
      );

      setError(
        "Não foi possível excluir a entrada.",
      );
    } finally {
      setDeleting(false);
    }
  };

  /* =====================================================
     EDITAR
  ===================================================== */

  const handleEdit = (
    income: Income,
  ) => {
    setIncomeToEdit(income);

    setEditDescription(
      income.description,
    );

    setEditAmount(
      String(income.amount),
    );

    setEditCategory(
      income.category,
    );

    if (income.date) {
      const date =
        new Date(
          income.date.seconds * 1000,
        );

      const year =
        date.getFullYear();

      const month =
        String(
          date.getMonth() + 1,
        ).padStart(2, "0");

      const day =
        String(
          date.getDate(),
        ).padStart(2, "0");

      setEditDate(
        `${year}-${month}-${day}`,
      );
    } else {
      setEditDate("");
    }
  };

  const cancelEdit = () => {
    setIncomeToEdit(null);

    setEditDescription("");
    setEditAmount("");
    setEditCategory("");
    setEditDate("");
  };

  const confirmEdit = async () => {
    if (!incomeToEdit) return;

    const user = auth.currentUser;

    if (!user) {
      setError(
        "Você precisa estar logado para editar uma entrada.",
      );

      return;
    }

    if (
      !editDescription.trim() ||
      !editAmount ||
      !editCategory ||
      !editDate
    ) {
      setError(
        "Preencha todos os campos da entrada.",
      );

      return;
    }

    const amount =
      Number(
        editAmount.replace(
          ",",
          ".",
        ),
      );

    if (
      Number.isNaN(amount) ||
      amount <= 0
    ) {
      setError(
        "Informe um valor válido.",
      );

      return;
    }

    try {
      setSaving(true);
      setError("");

      const date =
        new Date(
          `${editDate}T12:00:00`,
        );

      await updateIncome(
        user.uid,
        incomeToEdit.id,
        editDescription.trim(),
        amount,
        editCategory,
        date,
      );

      setIncomes(
        (current) =>
          current.map(
            (income) =>
              income.id ===
              incomeToEdit.id
                ? {
                    ...income,
                    description:
                      editDescription.trim(),
                    amount,
                    category:
                      editCategory,
                    date: {
                      seconds:
                        Math.floor(
                          date.getTime() /
                            1000,
                        ),
                      nanoseconds: 0,
                    },
                  }
                : income,
          ),
      );

      cancelEdit();
    } catch (error) {
      console.error(
        "Erro ao editar entrada:",
        error,
      );

      setError(
        "Não foi possível editar a entrada.",
      );
    } finally {
      setSaving(false);
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
            className={
              styles.list__header
            }
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
            <div
              className={styles.state}
            >
              <p>
                Carregando suas entradas...
              </p>
            </div>
          )}

          {!loading && error && (
            <div
              className={styles.state}
            >
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
                            onClick={() =>
                              handleEdit(
                                income,
                              )
                            }
                          >
                            <MdEdit />
                          </button>

                          <button
                            type="button"
                            title="Excluir entrada"
                            onClick={() =>
                              handleDelete(
                                income,
                              )
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

      {/* =================================================
          MODAL DE EXCLUSÃO
      ================================================= */}

      {incomeToDelete && (
        <div
          className={
            styles.modalOverlay
          }
        >
          <div
            className={styles.modal}
          >
            <h3>
              Excluir entrada?
            </h3>

            <p>
              Deseja excluir{" "}
              <strong>
                {
                  incomeToDelete.description
                }
              </strong>
              ?
            </p>

            <div
              className={
                styles.modal__actions
              }
            >
              <button
                type="button"
                onClick={() =>
                  setIncomeToDelete(
                    null,
                  )
                }
                disabled={deleting}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting
                  ? "Excluindo..."
                  : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          MODAL DE EDIÇÃO
      ================================================= */}

      {incomeToEdit && (
        <div
          className={
            styles.modalOverlay
          }
        >
          <div
            className={
              styles.modal
            }
          >
            <h3>
              Editar entrada
            </h3>

            <div
              className={
                styles.modal__form
              }
            >
              <label>
                Descrição

                <input
                  type="text"
                  value={
                    editDescription
                  }
                  onChange={(event) =>
                    setEditDescription(
                      event.target.value,
                    )
                  }
                />
              </label>

              <label>
                Valor

                <input
                  type="text"
                  inputMode="decimal"
                  value={
                    editAmount
                  }
                  onChange={(event) =>
                    setEditAmount(
                      event.target.value,
                    )
                  }
                />
              </label>

              <label>
                Categoria

                <select
                  value={
                    editCategory
                  }
                  onChange={(event) =>
                    setEditCategory(
                      event.target.value,
                    )
                  }
                >
                  <option value="">
                    Selecione
                  </option>

                  <option value="Salário">
                    Salário
                  </option>

                  <option value="Freelance">
                    Freelance
                  </option>

                  <option value="Investimentos">
                    Investimentos
                  </option>

                  <option value="Vendas">
                    Vendas
                  </option>

                  <option value="Presente">
                    Presente
                  </option>

                  <option value="Outros">
                    Outros
                  </option>
                </select>
              </label>

              <label>
                Data

                <input
                  type="date"
                  value={
                    editDate
                  }
                  onChange={(event) =>
                    setEditDate(
                      event.target.value,
                    )
                  }
                />
              </label>
            </div>

            <div
              className={
                styles.modal__actions
              }
            >
              <button
                type="button"
                onClick={
                  cancelEdit
                }
                disabled={saving}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={
                  confirmEdit
                }
                disabled={saving}
              >
                {saving
                  ? "Salvando..."
                  : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};