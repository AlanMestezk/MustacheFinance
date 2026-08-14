import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  MdArrowBack,
  MdTrendingUp,
  MdTrendingDown,
  MdAccountBalance,
  MdPictureAsPdf,
  MdCalendarToday,
} from "react-icons/md";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../../../firebase/auth";

import {
  getUserExpenses,
  getUserIncomes,
  getUserInvestments,
} from "../../../firebase/firestore";

import jsPDF from "jspdf";

import styles from "./styles/Reports.module.scss";

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

export const Reports = () => {
  const navigate = useNavigate();

  /*
   * DADOS DO FIREBASE
   */
  const [expenses, setExpenses] =
    useState<Expense[]>([]);

  const [incomes, setIncomes] =
    useState<Income[]>([]);

  const [investments, setInvestments] =
    useState<Investment[]>([]);

  /*
   * DADOS DO RELATÓRIO GERADO
   */
  const [reportExpenses, setReportExpenses] =
    useState<Expense[]>([]);

  const [reportIncomes, setReportIncomes] =
    useState<Income[]>([]);

  const [reportInvestments, setReportInvestments] =
    useState<Investment[]>([]);

  /*
   * FILTRO
   */
  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [generated, setGenerated] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [generating, setGenerating] =
    useState(false);

  const [error, setError] =
    useState("");

  /*
   * CARREGA OS DADOS DO FIREBASE
   */
  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {
          if (!user) {
            setError(
              "Você precisa estar logado para visualizar os relatórios.",
            );

            setLoading(false);

            return;
          }

          try {
            const [
              expenseData,
              incomeData,
              investmentData,
            ] = await Promise.all([
              getUserExpenses(user.uid),
              getUserIncomes(user.uid),
              getUserInvestments(user.uid),
            ]);

            setExpenses(
              expenseData as Expense[],
            );

            setIncomes(
              incomeData as Income[],
            );

            setInvestments(
              investmentData as Investment[],
            );
          } catch (error) {
            console.error(
              "Erro ao carregar dados:",
              error,
            );

            setError(
              "Não foi possível carregar os dados.",
            );
          } finally {
            setLoading(false);
          }
        },
      );

    return () => unsubscribe();
  }, []);

  /*
   * FORMATA MOEDA
   */
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

  /*
   * CONVERTE TIMESTAMP DO FIREBASE
   */
  const getDateFromTimestamp = (
    timestamp: {
      seconds: number;
      nanoseconds: number;
    },
  ) => {
    return new Date(
      timestamp.seconds * 1000,
    );
  };

  /*
   * FORMATA DATA
   */
  const formatDate = (
    date: string,
  ) => {
    if (!date) return "";

    const [year, month, day] =
      date.split("-");

    return `${day}/${month}/${year}`;
  };

  /*
   * ATALHO: ESTE MÊS
   */
  const setCurrentMonth = () => {
    const now = new Date();

    const firstDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    );

    const today = new Date();

    setStartDate(
      firstDay
        .toISOString()
        .split("T")[0],
    );

    setEndDate(
      today
        .toISOString()
        .split("T")[0],
    );
  };

  /*
   * ATALHO: MÊS PASSADO
   */
  const setPreviousMonth = () => {
    const now = new Date();

    const firstDay = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );

    const lastDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
    );

    setStartDate(
      firstDay
        .toISOString()
        .split("T")[0],
    );

    setEndDate(
      lastDay
        .toISOString()
        .split("T")[0],
    );
  };

  /*
   * ATALHO: ÚLTIMOS 3 MESES
   */
  const setLastThreeMonths = () => {
    const now = new Date();

    const threeMonthsAgo =
      new Date(
        now.getFullYear(),
        now.getMonth() - 2,
        1,
      );

    setStartDate(
      threeMonthsAgo
        .toISOString()
        .split("T")[0],
    );

    setEndDate(
      now
        .toISOString()
        .split("T")[0],
    );
  };

  /*
   * GERA O RELATÓRIO
   */
  const generateReport = () => {
    setError("");

    if (!startDate || !endDate) {
      setError(
        "Selecione a data inicial e a data final.",
      );

      return;
    }

    if (startDate > endDate) {
      setError(
        "A data inicial não pode ser maior que a data final.",
      );

      return;
    }

    setGenerating(true);

    /*
     * Usamos início e fim do dia
     * para não perder registros.
     */
    const start = new Date(
      `${startDate}T00:00:00`,
    );

    const end = new Date(
      `${endDate}T23:59:59.999`,
    );

    const filterByPeriod = <
      T extends {
        date: {
          seconds: number;
          nanoseconds: number;
        };
      },
    >(
      items: T[],
    ) => {
      return items.filter(
        (item) => {
          const itemDate =
            getDateFromTimestamp(
              item.date,
            );

          return (
            itemDate >= start &&
            itemDate <= end
          );
        },
      );
    };

    setReportExpenses(
      filterByPeriod(expenses),
    );

    setReportIncomes(
      filterByPeriod(incomes),
    );

    setReportInvestments(
      filterByPeriod(investments),
    );

    setGenerated(true);

    setGenerating(false);
  };

  /*
   * DADOS DO RELATÓRIO
   */
  const totalIncome =
    reportIncomes.reduce(
      (total, income) =>
        total + income.amount,
      0,
    );

  const totalExpenses =
    reportExpenses.reduce(
      (total, expense) =>
        total + expense.amount,
      0,
    );

  const balance =
    totalIncome - totalExpenses;

  const totalPlanned =
    reportInvestments.reduce(
      (total, investment) =>
        total +
        (investment.goalAmount ?? 0),
      0,
    );

  const totalSaved =
    reportInvestments.reduce(
      (total, investment) =>
        total + investment.amount,
      0,
    );

  /*
   * GASTOS POR CATEGORIA
   */
  const categoryTotals: Record<
    string,
    number
  > = {};

  reportExpenses.forEach(
    (expense) => {
      if (
        !categoryTotals[
          expense.category
        ]
      ) {
        categoryTotals[
          expense.category
        ] = 0;
      }

      categoryTotals[
        expense.category
      ] += expense.amount;
    },
  );

  const categories =
    Object.entries(
      categoryTotals,
    ).sort(
      ([, amountA], [, amountB]) =>
        amountB - amountA,
    );

  /*
   * GERA O PDF
   */
  const generatePDF = () => {
    const pdf = new jsPDF();

    let y = 20;

    const pageWidth =
      pdf.internal.pageSize.getWidth();

    const pageHeight =
      pdf.internal.pageSize.getHeight();

    const checkPage = (
      space = 10,
    ) => {
      if (
        y + space >
        pageHeight - 20
      ) {
        pdf.addPage();

        y = 20;
      }
    };

    /*
     * CABEÇALHO
     */
    pdf.setFontSize(22);

    pdf.setFont(
      "helvetica",
      "bold",
    );

    pdf.text(
      "MustacheFinance",
      20,
      y,
    );

    y += 10;

    pdf.setFontSize(15);

    pdf.setFont(
      "helvetica",
      "normal",
    );

    pdf.text(
      "Relatório Financeiro",
      20,
      y,
    );

    y += 8;

    pdf.setFontSize(10);

    pdf.text(
      `Período: ${formatDate(
        startDate,
      )} até ${formatDate(
        endDate,
      )}`,
      20,
      y,
    );

    y += 7;

    pdf.text(
      `Gerado em: ${new Date().toLocaleDateString(
        "pt-BR",
      )}`,
      20,
      y,
    );

    y += 12;

    pdf.line(
      20,
      y,
      pageWidth - 20,
      y,
    );

    y += 12;

    /*
     * RESUMO
     */
    pdf.setFontSize(14);

    pdf.setFont(
      "helvetica",
      "bold",
    );

    pdf.text(
      "Resumo financeiro",
      20,
      y,
    );

    y += 9;

    pdf.setFontSize(11);

    pdf.setFont(
      "helvetica",
      "normal",
    );

    pdf.text(
      `Entradas: ${formatCurrency(
        totalIncome,
      )}`,
      20,
      y,
    );

    y += 7;

    pdf.text(
      `Gastos: ${formatCurrency(
        totalExpenses,
      )}`,
      20,
      y,
    );

    y += 7;

    pdf.text(
      `Saldo: ${formatCurrency(
        balance,
      )}`,
      20,
      y,
    );

    y += 14;

    /*
     * CATEGORIAS
     */
    checkPage(30);

    pdf.setFontSize(14);

    pdf.setFont(
      "helvetica",
      "bold",
    );

    pdf.text(
      "Gastos por categoria",
      20,
      y,
    );

    y += 9;

    if (
      categories.length === 0
    ) {
      pdf.setFontSize(10);

      pdf.setFont(
        "helvetica",
        "normal",
      );

      pdf.text(
        "Nenhum gasto registrado no período.",
        20,
        y,
      );

      y += 8;
    } else {
      categories.forEach(
        ([category, amount]) => {
          checkPage(10);

          const percentage =
            totalExpenses > 0
              ? (amount /
                  totalExpenses) *
                100
              : 0;

          pdf.setFontSize(10);

          pdf.setFont(
            "helvetica",
            "normal",
          );

          pdf.text(
            `${category}: ${formatCurrency(
              amount,
            )} (${percentage.toFixed(
              1,
            )}%)`,
            20,
            y,
          );

          y += 7;
        },
      );
    }

    y += 7;

    /*
     * PLANEJAMENTOS
     */
    checkPage(30);

    pdf.setFontSize(14);

    pdf.setFont(
      "helvetica",
      "bold",
    );

    pdf.text(
      "Planejamentos",
      20,
      y,
    );

    y += 9;

    if (
      reportInvestments.length ===
      0
    ) {
      pdf.setFontSize(10);

      pdf.setFont(
        "helvetica",
        "normal",
      );

      pdf.text(
        "Nenhum planejamento encontrado no período.",
        20,
        y,
      );

      y += 8;
    } else {
      reportInvestments.forEach(
        (investment) => {
          checkPage(25);

          const progress =
            investment.goalAmount
              ? Math.min(
                  (investment.amount /
                    investment.goalAmount) *
                    100,
                  100,
                )
              : 0;

          pdf.setFontSize(10);

          pdf.setFont(
            "helvetica",
            "bold",
          );

          pdf.text(
            investment.description,
            20,
            y,
          );

          y += 6;

          pdf.setFont(
            "helvetica",
            "normal",
          );

          pdf.text(
            `Atual: ${formatCurrency(
              investment.amount,
            )}`,
            25,
            y,
          );

          y += 6;

          pdf.text(
            investment.goalAmount
              ? `Meta: ${formatCurrency(
                  investment.goalAmount,
                )}`
              : "Sem meta definida",
            25,
            y,
          );

          y += 6;

          pdf.text(
            `Progresso: ${progress.toFixed(
              1,
            )}%`,
            25,
            y,
          );

          y += 10;
        },
      );
    }

    /*
     * RESUMO DOS PLANEJAMENTOS
     */
    checkPage(30);

    pdf.setFontSize(14);

    pdf.setFont(
      "helvetica",
      "bold",
    );

    pdf.text(
      "Resumo dos planejamentos",
      20,
      y,
    );

    y += 9;

    pdf.setFontSize(10);

    pdf.setFont(
      "helvetica",
      "normal",
    );

    pdf.text(
      `Valor acumulado: ${formatCurrency(
        totalSaved,
      )}`,
      20,
      y,
    );

    y += 7;

    pdf.text(
      `Total das metas: ${formatCurrency(
        totalPlanned,
      )}`,
      20,
      y,
    );

    y += 7;

    const overallProgress =
      totalPlanned > 0
        ? Math.min(
            (totalSaved /
              totalPlanned) *
              100,
            100,
          )
        : 0;

    pdf.text(
      `Progresso geral: ${overallProgress.toFixed(
        1,
      )}%`,
      20,
      y,
    );

    y += 15;

    pdf.line(
      20,
      y,
      pageWidth - 20,
      y,
    );

    y += 8;

    pdf.setFontSize(8);

    pdf.text(
      "Relatório gerado pelo MustacheFinance",
      20,
      y,
    );

    pdf.save(
      `relatorio-financeiro-${startDate}-${endDate}.pdf`,
    );
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
              RELATÓRIOS
            </span>

            <h1>
              Gere seu
              <strong>
                {" "}
                relatório financeiro.
              </strong>
            </h1>

            <p>
              Escolha um período para
              analisar suas finanças.
            </p>
          </div>
        </header>

        {loading && (
          <div
            className={styles.state}
          >
            <p>
              Carregando dados...
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

        {!loading && !error && (
          <>
            {/* FILTRO */}
            <section
              className={
                styles.filter
              }
            >
              <div
                className={
                  styles.filter__header
                }
              >
                <div
                  className={
                    styles.filter__icon
                  }
                >
                  <MdCalendarToday />
                </div>

                <div>
                  <span>
                    PERÍODO DO RELATÓRIO
                  </span>

                  <h2>
                    Escolha as datas
                  </h2>
                </div>
              </div>

              <div
                className={
                  styles.filter__dates
                }
              >
                <div
                  className={
                    styles.field
                  }
                >
                  <label htmlFor="startDate">
                    Data inicial
                  </label>

                  <input
                    id="startDate"
                    type="date"
                    value={
                      startDate
                    }
                    onChange={(
                      event,
                    ) => {
                      setStartDate(
                        event.target
                          .value,
                      );

                      setGenerated(
                        false,
                      );
                    }}
                  />
                </div>

                <div
                  className={
                    styles.field
                  }
                >
                  <label htmlFor="endDate">
                    Data final
                  </label>

                  <input
                    id="endDate"
                    type="date"
                    value={
                      endDate
                    }
                    onChange={(
                      event,
                    ) => {
                      setEndDate(
                        event.target
                          .value,
                      );

                      setGenerated(
                        false,
                      );
                    }}
                  />
                </div>
              </div>

              <div
                className={
                  styles.shortcuts
                }
              >
                <span>
                  Período rápido
                </span>

                <div>
                  <button
                    type="button"
                    onClick={
                      setCurrentMonth
                    }
                  >
                    Este mês
                  </button>

                  <button
                    type="button"
                    onClick={
                      setPreviousMonth
                    }
                  >
                    Mês passado
                  </button>

                  <button
                    type="button"
                    onClick={
                      setLastThreeMonths
                    }
                  >
                    Últimos 3 meses
                  </button>
                </div>
              </div>

              <button
                type="button"
                className={
                  styles.generate
                }
                onClick={
                  generateReport
                }
                disabled={
                  generating
                }
              >
                <MdPictureAsPdf />

                {generating
                  ? "Gerando..."
                  : "Gerar relatório"}
              </button>
            </section>

            {/* RESULTADO */}
            {generated && (
              <>
                <section
                  className={
                    styles.resultHeader
                  }
                >
                  <div>
                    <span>
                      RELATÓRIO GERADO
                    </span>

                    <h2>
                      {formatDate(
                        startDate,
                      )}{" "}
                      até{" "}
                      {formatDate(
                        endDate,
                      )}
                    </h2>
                  </div>

                  <button
                    type="button"
                    className={
                      styles.download
                    }
                    onClick={
                      generatePDF
                    }
                  >
                    <MdPictureAsPdf />

                    Baixar PDF
                  </button>
                </section>

                {/* RESUMO */}
                <section
                  className={
                    styles.summary
                  }
                >
                  <article
                    className={
                      styles.card
                    }
                  >
                    <div
                      className={
                        styles.card__icon
                      }
                    >
                      <MdTrendingUp />
                    </div>

                    <span>
                      Entradas
                    </span>

                    <strong>
                      {formatCurrency(
                        totalIncome,
                      )}
                    </strong>
                  </article>

                  <article
                    className={
                      styles.card
                    }
                  >
                    <div
                      className={
                        styles.card__icon
                      }
                    >
                      <MdTrendingDown />
                    </div>

                    <span>
                      Gastos
                    </span>

                    <strong>
                      {formatCurrency(
                        totalExpenses,
                      )}
                    </strong>
                  </article>

                  <article
                    className={
                      styles.card
                    }
                  >
                    <div
                      className={
                        styles.card__icon
                      }
                    >
                      <MdAccountBalance />
                    </div>

                    <span>
                      Saldo
                    </span>

                    <strong>
                      {formatCurrency(
                        balance,
                      )}
                    </strong>
                  </article>
                </section>

                {/* DETALHES */}
                <section
                  className={
                    styles.mainGrid
                  }
                >
                  <article
                    className={
                      styles.panel
                    }
                  >
                    <div
                      className={
                        styles.panel__header
                      }
                    >
                      <div>
                        <span>
                          GASTOS
                        </span>

                        <h2>
                          Por categoria
                        </h2>
                      </div>
                    </div>

                    {categories.length ===
                    0 ? (
                      <div
                        className={
                          styles.empty
                        }
                      >
                        <p>
                          Nenhum gasto
                          registrado
                          nesse período.
                        </p>
                      </div>
                    ) : (
                      <div
                        className={
                          styles.categories
                        }
                      >
                        {categories.map(
                          ([
                            category,
                            amount,
                          ]) => {
                            const percentage =
                              totalExpenses >
                              0
                                ? (amount /
                                    totalExpenses) *
                                  100
                                : 0;

                            return (
                              <div
                                key={
                                  category
                                }
                                className={
                                  styles.category
                                }
                              >
                                <div
                                  className={
                                    styles.category__top
                                  }
                                >
                                  <span>
                                    {
                                      category
                                    }
                                  </span>

                                  <strong>
                                    {formatCurrency(
                                      amount,
                                    )}
                                  </strong>
                                </div>

                                <div
                                  className={
                                    styles.category__bar
                                  }
                                >
                                  <div
                                    className={
                                      styles.category__progress
                                    }
                                    style={{
                                      width: `${percentage}%`,
                                    }}
                                  />
                                </div>

                                <span
                                  className={
                                    styles.category__percentage
                                  }
                                >
                                  {percentage.toLocaleString(
                                    "pt-BR",
                                    {
                                      maximumFractionDigits: 1,
                                    },
                                  )}
                                  %
                                </span>
                              </div>
                            );
                          },
                        )}
                      </div>
                    )}
                  </article>

                  <article
                    className={
                      styles.panel
                    }
                  >
                    <div
                      className={
                        styles.panel__header
                      }
                    >
                      <div>
                        <span>
                          PLANEJAMENTOS
                        </span>

                        <h2>
                          Progresso das metas
                        </h2>
                      </div>
                    </div>

                    {reportInvestments.length ===
                    0 ? (
                      <div
                        className={
                          styles.empty
                        }
                      >
                        <p>
                          Nenhum planejamento
                          encontrado
                          nesse período.
                        </p>
                      </div>
                    ) : (
                      <div
                        className={
                          styles.plans
                        }
                      >
                        {reportInvestments
                          .map(
                            (
                              investment,
                            ) => {
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
                                    styles.plan
                                  }
                                >
                                  <div
                                    className={
                                      styles.plan__top
                                    }
                                  >
                                    <strong>
                                      {
                                        investment.description
                                      }
                                    </strong>

                                    <span>
                                      {progress.toLocaleString(
                                        "pt-BR",
                                        {
                                          maximumFractionDigits: 1,
                                        },
                                      )}
                                      %
                                    </span>
                                  </div>

                                  <div
                                    className={
                                      styles.plan__bar
                                    }
                                  >
                                    <div
                                      className={
                                        styles.plan__progress
                                      }
                                      style={{
                                        width: `${progress}%`,
                                      }}
                                    />
                                  </div>

                                  <div
                                    className={
                                      styles.plan__bottom
                                    }
                                  >
                                    <span>
                                      {formatCurrency(
                                        investment.amount,
                                      )}
                                    </span>

                                    <span>
                                      {investment.goalAmount
                                        ? `de ${formatCurrency(
                                            investment.goalAmount,
                                          )}`
                                        : "Sem meta"}
                                    </span>
                                  </div>
                                </div>
                              );
                            },
                          )}
                      </div>
                    )}
                  </article>
                </section>

                {/* RESUMO DOS PLANEJAMENTOS */}
                <section
                  className={
                    styles.overview
                  }
                >
                  <span>
                    PLANEJAMENTO FINANCEIRO
                  </span>

                  <h2>
                    {formatCurrency(
                      totalSaved,
                    )}{" "}
                    de{" "}
                    {formatCurrency(
                      totalPlanned,
                    )}
                  </h2>

                  <p>
                    valor acumulado nas metas
                    encontradas no período.
                  </p>

                  <div
                    className={
                      styles.overview__bar
                    }
                  >
                    <div
                      className={
                        styles.overview__progress
                      }
                      style={{
                        width:
                          totalPlanned >
                          0
                            ? `${Math.min(
                                (totalSaved /
                                  totalPlanned) *
                                  100,
                                100,
                              )}%`
                            : "0%",
                      }}
                    />
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </section>
    </main>
  );
};