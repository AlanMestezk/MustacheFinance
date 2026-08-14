import { useEffect, useState } from "react";

import {
  MdArrowBack,
  MdAttachMoney,
  MdCalendarToday,
  MdCategory,
  MdDescription,
} from "react-icons/md";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { auth } from "../../../firebase/auth";

import {
  createInvestment,
  getUserInvestments,
  updateInvestment,
} from "../../../firebase/firestore";

import styles from "./styles/NewInvestmentForm.module.scss";

interface Investment {
  id: string;
  description: string;
  amount: number;
  goalAmount: number;
  category: string;
  date: {
    seconds: number;
    nanoseconds: number;
  };
}

export const NewInvestmentForm = () => {
  const navigate = useNavigate();

  const [description, setDescription] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [goalAmount, setGoalAmount] =
    useState("");

  const [category, setCategory] =
    useState("Veículo");

  const [date, setDate] = useState(
    new Date()
      .toISOString()
      .split("T")[0],
  );

  const [message, setMessage] =
    useState("");

  const { investmentId } =
    useParams<{
      investmentId: string;
    }>();

  const isEditing =
    Boolean(investmentId);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setMessage("");

    if (!description.trim()) {
      setMessage(
        "Informe uma descrição.",
      );

      return;
    }

    if (
      !amount ||
      Number(amount) <= 0
    ) {
      setMessage(
        "Informe um valor atual válido.",
      );

      return;
    }

    if (
      !goalAmount ||
      Number(goalAmount) <= 0
    ) {
      setMessage(
        "Informe uma meta válida.",
      );

      return;
    }

    if (
      Number(goalAmount) <
      Number(amount)
    ) {
      setMessage(
        "A meta deve ser maior ou igual ao valor atual.",
      );

      return;
    }

    try {
      const user =
        auth.currentUser;

      if (!user) {
        setMessage(
          "Você precisa estar logado para cadastrar um planejamento.",
        );

        return;
      }

      const investmentDate =
        new Date(
          `${date}T00:00:00`,
        );

      if (
        isEditing &&
        investmentId
      ) {
        await updateInvestment(
          user.uid,
          investmentId,
          description.trim(),
          Number(amount),
          Number(goalAmount),
          category,
          investmentDate,
        );

        setMessage(
          "Planejamento atualizado com sucesso!",
        );

        return;
      }

      await createInvestment(
        user.uid,
        description.trim(),
        Number(amount),
        Number(goalAmount),
        category,
        investmentDate,
      );

      setMessage(
        "Planejamento cadastrado com sucesso!",
      );

      setDescription("");
      setAmount("");
      setGoalAmount("");
      setCategory("Veículo");

    } catch (error) {
      console.error(
        "Erro ao salvar planejamento:",
        error,
      );

      setMessage(
        isEditing
          ? "Não foi possível atualizar o planejamento."
          : "Não foi possível cadastrar o planejamento.",
      );
    }
  };

  useEffect(() => {
    if (
      !isEditing ||
      !investmentId
    ) {
      return;
    }

    const loadInvestment =
      async () => {
        const user =
          auth.currentUser;

        if (!user) {
          setMessage(
            "Você precisa estar logado.",
          );

          return;
        }

        try {
          const investments =
            await getUserInvestments(
              user.uid,
            ) as Investment[];

          const investment =
            investments.find(
              (item) =>
                item.id ===
                investmentId,
            );

          if (!investment) {
            setMessage(
              "Planejamento não encontrado.",
            );

            return;
          }

          setDescription(
            investment.description,
          );

          setAmount(
            String(
              investment.amount,
            ),
          );

          setGoalAmount(
            String(
              investment.goalAmount ??
                "",
            ),
          );

          setCategory(
            investment.category,
          );

          setDate(
            new Date(
              investment.date
                .seconds * 1000,
            )
              .toISOString()
              .split("T")[0],
          );

        } catch (error) {
          console.error(
            "Erro ao carregar planejamento:",
            error,
          );

          setMessage(
            "Não foi possível carregar o planejamento.",
          );
        }
      };

    loadInvestment();
  }, [
    isEditing,
    investmentId,
  ]);

  return (
    <main
      className={styles.page}
    >
      <section
        className={styles.form}
      >
        <button
          type="button"
          className={
            styles.form__back
          }
          onClick={() =>
            navigate(
              "/dashboard",
            )
          }
        >
          <MdArrowBack />

          Voltar para o dashboard
        </button>

        <div
          className={
            styles.form__header
          }
        >
          <span>
            NOVO PLANEJAMENTO
          </span>

          <h1>
            Crie um
            <strong>
              {" "}
              novo planejamento.
            </strong>
          </h1>

          <p>
            Defina uma meta e
            acompanhe seu progresso
            até alcançá-la.
          </p>
        </div>

        <form
          className={
            styles.form__content
          }
          onSubmit={
            handleSubmit
          }
        >
          <div
            className={
              styles.field
            }
          >
            <label htmlFor="description">
              Descrição
            </label>

            <div
              className={
                styles.field__input
              }
            >
              <MdDescription />

              <input
                id="description"
                type="text"
                placeholder="Ex: Comprar uma moto"
                value={
                  description
                }
                onChange={(
                  event,
                ) =>
                  setDescription(
                    event.target
                      .value,
                  )
                }
              />
            </div>
          </div>

          <div
            className={
              styles.field
            }
          >
            <label htmlFor="amount">
              Valor atual
            </label>

            <div
              className={
                styles.field__input
              }
            >
              <MdAttachMoney />

              <input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(
                  event,
                ) =>
                  setAmount(
                    event.target
                      .value,
                  )
                }
              />
            </div>
          </div>

          <div
            className={
              styles.field
            }
          >
            <label htmlFor="goalAmount">
              Meta
            </label>

            <div
              className={
                styles.field__input
              }
            >
              <MdAttachMoney />

              <input
                id="goalAmount"
                type="number"
                min="0"
                step="0.01"
                placeholder="Ex: 20000,00"
                value={
                  goalAmount
                }
                onChange={(
                  event,
                ) =>
                  setGoalAmount(
                    event.target
                      .value,
                  )
                }
              />
            </div>
          </div>

          <div
            className={
              styles.field
            }
          >
            <label htmlFor="category">
              Categoria
            </label>

            <div
              className={
                styles.field__input
              }
            >
              <MdCategory />

              <select
                id="category"
                value={
                  category
                }
                onChange={(
                  event,
                ) =>
                  setCategory(
                    event.target
                      .value,
                  )
                }
              >
                <option value="Veículo">
                  🏍️ Veículo
                </option>

                <option value="Viagem">
                  ✈️ Viagem
                </option>

                <option value="Casa">
                  🏠 Casa
                </option>

                <option value="Tecnologia">
                  💻 Tecnologia
                </option>

                <option value="Educação">
                  📚 Educação
                </option>

                <option value="Lazer">
                  🎮 Lazer
                </option>

                <option value="Outros">
                  📦 Outros
                </option>
              </select>
            </div>
          </div>

          <div
            className={
              styles.field
            }
          >
            <label htmlFor="date">
              Data do planejamento
            </label>

            <div
              className={
                styles.field__input
              }
            >
              <MdCalendarToday />

              <input
                id="date"
                type="date"
                value={date}
                onChange={(
                  event,
                ) =>
                  setDate(
                    event.target
                      .value,
                  )
                }
              />
            </div>
          </div>

          {message && (
            <p
              className={
                styles.form__message
              }
            >
              {message}
            </p>
          )}

          <div
            className={
              styles.form__actions
            }
          >
            <button
              type="button"
              className={
                styles.form__cancel
              }
              onClick={() =>
                navigate(
                  "/dashboard/investments",
                )
              }
            >
              Voltar
            </button>

            <button
              type="submit"
              className={
                styles.form__submit
              }
            >
              Salvar
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};