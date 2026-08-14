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
    if (
      !investment.goalAmount
    ) {
      return 0;
    }

    return Math.max(
      investment.goalAmount -
        investment.amount,
      0,
    );
  };

  const handleDelete = (
    investment: Investment,
  ) => {
    setInvestmentToDelete(
      investment,
    );
  };

  const confirmDelete =
    async () => {
      if (!investmentToDelete) {
        return;
      }

      const user =
        auth.currentUser;

      if (!user) {
        setError(
          "Você precisa estar logado para excluir um planejamento.",
        );

        setInvestmentToDelete(null);

        return;
      }

      try {
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

        setInvestmentToDelete(
          null,
        );
      } catch (error) {
        console.error(
          "Erro ao excluir planejamento:",
          error,
        );

        setError(
          "Não foi possível excluir o planejamento.",
        );
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
                                navigate(
                                  `/dashboard/investments/edit/${investment.id}`,
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
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={
                  confirmDelete
                }
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