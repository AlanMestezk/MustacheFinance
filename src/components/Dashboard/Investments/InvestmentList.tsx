import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  MdAdd,
  MdArrowBack,
  MdDeleteOutline,
  MdEdit,
} from "react-icons/md";

import { auth } from "../../../firebase/auth";

import {
  deleteInvestment,
  getUserInvestments,
  updateInvestment,
} from "../../../firebase/firestore";

import styles from "./styles/InvestmentList.module.scss";

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

export const InvestmentList = () => {
  const navigate = useNavigate();

  const [investments, setInvestments] =
    useState<Investment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    investmentToDelete,
    setInvestmentToDelete,
  ] = useState<Investment | null>(null);

  const [
    investmentToEdit,
    setInvestmentToEdit,
  ] = useState<Investment | null>(null);

  const [editDescription, setEditDescription] =
    useState("");

  const [editAmount, setEditAmount] =
    useState("");

  const [editGoalAmount, setEditGoalAmount] =
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
    const loadInvestments = async () => {
      const user = auth.currentUser;

      if (!user) {
        setError(
          "Você precisa estar logado para visualizar seus planejamentos.",
        );

        setLoading(false);

        return;
      }

      try {
        const data =
          await getUserInvestments(
            user.uid,
          );

        setInvestments(
          data as Investment[],
        );
      } catch (error) {
        console.error(
          "Erro ao buscar planejamentos:",
          error,
        );

        setError(
          "Não foi possível carregar seus planejamentos.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadInvestments();
  }, []);

  const totalPlanned = investments.reduce(
    (sum, investment) =>
      sum + (investment.goalAmount ?? 0),
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
    timestamp: Investment["date"],
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

  const getInvestmentIcon = (
    category: string,
  ) => {
    const icons: Record<
      string,
      string
    > = {
      Veículo: "🏍️",
      Viagem: "✈️",
      Casa: "🏠",
      Tecnologia: "💻",
      Educação: "📚",
      Lazer: "🎮",
      Outros: "📦",
    };

    return (
      icons[category] || "📦"
    );
  };

  const getProgress = (
    investment: Investment,
  ) => {
    if (
      !investment.goalAmount ||
      investment.goalAmount <= 0
    ) {
      return 0;
    }

    return Math.min(
      (investment.amount /
        investment.goalAmount) *
        100,
      100,
    );
  };

  const getRemaining = (
    investment: Investment,
  ) => {
    if (!investment.goalAmount) {
      return 0;
    }

    return Math.max(
      investment.goalAmount -
        investment.amount,
      0,
    );
  };

  /* =====================================================
     EXCLUIR
  ===================================================== */

  const handleDelete = (
    investment: Investment,
  ) => {
    setInvestmentToDelete(
      investment,
    );
  };

  const confirmDelete = async () => {
    if (!investmentToDelete) {
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      setError(
        "Você precisa estar logado para excluir um planejamento.",
      );

      setInvestmentToDelete(null);

      return;
    }

    try {
      setDeleting(true);

      await deleteInvestment(
        user.uid,
        investmentToDelete.id,
      );

      setInvestments(
        (current) =>
          current.filter(
            (investment) =>
              investment.id !==
              investmentToDelete.id,
          ),
      );

      setInvestmentToDelete(null);
    } catch (error) {
      console.error(
        "Erro ao excluir planejamento:",
        error,
      );

      setError(
        "Não foi possível excluir o planejamento.",
      );
    } finally {
      setDeleting(false);
    }
  };

  /* =====================================================
     EDITAR
  ===================================================== */

  const handleEdit = (
    investment: Investment,
  ) => {
    setInvestmentToEdit(
      investment,
    );

    setEditDescription(
      investment.description,
    );

    setEditAmount(
      String(investment.amount),
    );

    setEditGoalAmount(
      String(
        investment.goalAmount ?? "",
      ),
    );

    setEditCategory(
      investment.category,
    );

    if (investment.date) {
      const date =
        new Date(
          investment.date.seconds *
            1000,
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
    setInvestmentToEdit(null);

    setEditDescription("");
    setEditAmount("");
    setEditGoalAmount("");
    setEditCategory("");
    setEditDate("");
    setError("");
  };

  const confirmEdit = async () => {
    if (!investmentToEdit) {
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      setError(
        "Você precisa estar logado para editar um planejamento.",
      );

      return;
    }

    if (
      !editDescription.trim() ||
      !editAmount ||
      !editGoalAmount ||
      !editCategory ||
      !editDate
    ) {
      setError(
        "Preencha todos os campos do planejamento.",
      );

      return;
    }

    const amount = Number(
      editAmount.replace(",", "."),
    );

    const goalAmount = Number(
      editGoalAmount.replace(",", "."),
    );

    if (
      Number.isNaN(amount) ||
      amount < 0
    ) {
      setError(
        "Informe um valor atual válido.",
      );

      return;
    }

    if (
      Number.isNaN(goalAmount) ||
      goalAmount <= 0
    ) {
      setError(
        "Informe uma meta válida.",
      );

      return;
    }

    if (amount > goalAmount) {
      setError(
        "O valor atual não pode ser maior que a meta.",
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

      await updateInvestment(
        user.uid,
        investmentToEdit.id,
        editDescription.trim(),
        amount,
        goalAmount,
        editCategory,
        date,
      );

      setInvestments(
        (current) =>
          current.map(
            (investment) =>
              investment.id ===
              investmentToEdit.id
                ? {
                    ...investment,
                    description:
                      editDescription.trim(),
                    amount,
                    goalAmount,
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
                : investment,
          ),
      );

      cancelEdit();
    } catch (error) {
      console.error(
        "Erro ao editar planejamento:",
        error,
      );

      setError(
        "Não foi possível editar o planejamento.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className={styles.page}>
      <section
        className={styles.content}
      >
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

        <header
          className={styles.header}
        >
          <div>
            <span>
              PLANEJAMENTOS
            </span>

            <h1>
              Seus
              <strong>
                {" "}
                planejamentos.
              </strong>
            </h1>

            <p>
              Defina suas metas e
              acompanhe seu progresso
              até alcançá-las.
            </p>
          </div>

          <button
            type="button"
            className={styles.add}
            onClick={() =>
              navigate(
                "/dashboard/investments/new",
              )
            }
          >
            <MdAdd />

            Novo planejamento
          </button>
        </header>

        <section
          className={styles.summary}
        >
          <div>
            <span>
              Total planejado
            </span>

            <strong>
              {formatCurrency(
                totalPlanned,
              )}
            </strong>
          </div>

          <div>
            <span>
              Quantidade
            </span>

            <strong>
              {investments.length}
            </strong>
          </div>
        </section>

        <section
          className={styles.list}
        >
          <div
            className={
              styles.list__header
            }
          >
            <h2>
              Meus planejamentos
            </h2>

            <span>
              {investments.length}{" "}
              {investments.length ===
              1
                ? "planejamento"
                : "planejamentos"}
            </span>
          </div>

          {loading && (
            <div
              className={
                styles.state
              }
            >
              <p>
                Carregando seus
                planejamentos...
              </p>
            </div>
          )}

          {!loading && error && (
            <div
              className={
                styles.state
              }
            >
              <p>{error}</p>
            </div>
          )}

          {!loading &&
            !error &&
            investments.length ===
              0 && (
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
                  🎯
                </div>

                <h3>
                  Nenhum planejamento
                  ainda
                </h3>

                <p>
                  Crie uma meta e
                  acompanhe seu
                  progresso.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/dashboard/investments/new",
                    )
                  }
                >
                  Criar primeiro
                  planejamento
                </button>
              </div>
            )}

          {!loading &&
            !error &&
            investments.length >
              0 && (
              <div
                className={
                  styles.list__items
                }
              >
                {investments.map(
                  (investment) => {
                    const progress =
                      getProgress(
                        investment,
                      );

                    const remaining =
                      getRemaining(
                        investment,
                      );

                    return (
                      <article
                        key={
                          investment.id
                        }
                        className={
                          styles.investment
                        }
                      >
                        <div
                          className={
                            styles.investment__main
                          }
                        >
                          <div
                            className={
                              styles.investment__icon
                            }
                          >
                            {getInvestmentIcon(
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
                              {
                                investment.category
                              }{" "}
                              •{" "}
                              {formatDate(
                                investment.date,
                              )}
                            </span>

                            {investment.goalAmount ? (
                              <>
                                <div
                                  className={
                                    styles.investment__values
                                  }
                                >
                                  <span>
                                    Atual:{" "}
                                    <strong>
                                      {formatCurrency(
                                        investment.amount,
                                      )}
                                    </strong>
                                  </span>

                                  <span>
                                    Meta:{" "}
                                    <strong>
                                      {formatCurrency(
                                        investment.goalAmount,
                                      )}
                                    </strong>
                                  </span>
                                </div>

                                <div
                                  className={
                                    styles.investment__progress
                                  }
                                >
                                  <div
                                    className={
                                      styles.investment__progressBar
                                    }
                                    style={{
                                      width: `${progress}%`,
                                    }}
                                  />
                                </div>

                                <div
                                  className={
                                    styles.investment__footer
                                  }
                                >
                                  <span>
                                    {progress.toLocaleString(
                                      "pt-BR",
                                      {
                                        maximumFractionDigits: 1,
                                      },
                                    )}
                                    % concluído
                                  </span>

                                  <strong>
                                    {remaining >
                                    0
                                      ? `Faltam ${formatCurrency(
                                          remaining,
                                        )}`
                                      : "Meta alcançada! 🎉"}
                                  </strong>
                                </div>
                              </>
                            ) : (
                              <span
                                className={
                                  styles.investment__oldData
                                }
                              >
                                Defina uma meta
                                para
                                acompanhar o
                                progresso.
                              </span>
                            )}
                          </div>
                        </div>

                        <div
                          className={
                            styles.investment__right
                          }
                        >
                          <div
                            className={
                              styles.investment__actions
                            }
                          >
                            <button
                              type="button"
                              title="Editar planejamento"
                              onClick={() =>
                                handleEdit(
                                  investment,
                                )
                              }
                            >
                              <MdEdit />
                            </button>

                            <button
                              type="button"
                              title="Excluir planejamento"
                              onClick={() =>
                                handleDelete(
                                  investment,
                                )
                              }
                            >
                              <MdDeleteOutline />
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  },
                )}
              </div>
            )}
        </section>
      </section>

      {/* =================================================
          MODAL DE EXCLUSÃO
      ================================================= */}

      {investmentToDelete && (
        <div
          className={
            styles.modalOverlay
          }
        >
          <div
            className={styles.modal}
          >
            <h3>
              Excluir planejamento?
            </h3>

            <p>
              Deseja excluir{" "}
              <strong>
                {
                  investmentToDelete.description
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
                  setInvestmentToDelete(
                    null,
                  )
                }
                disabled={deleting}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={
                  confirmDelete
                }
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

      {investmentToEdit && (
        <div
          className={
            styles.modalOverlay
          }
        >
          <div
            className={styles.modal}
          >
            <h3>
              Editar planejamento
            </h3>

            <div
              className={
                styles.modal__form
              }
            >
              <label>
                Nome do planejamento

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
                Valor atual

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
                Meta

                <input
                  type="text"
                  inputMode="decimal"
                  value={
                    editGoalAmount
                  }
                  onChange={(event) =>
                    setEditGoalAmount(
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

                  <option value="Veículo">
                    Veículo
                  </option>

                  <option value="Viagem">
                    Viagem
                  </option>

                  <option value="Casa">
                    Casa
                  </option>

                  <option value="Tecnologia">
                    Tecnologia
                  </option>

                  <option value="Educação">
                    Educação
                  </option>

                  <option value="Lazer">
                    Lazer
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