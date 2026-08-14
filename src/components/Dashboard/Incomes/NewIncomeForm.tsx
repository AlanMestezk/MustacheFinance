import { useState } from "react";

import {
  MdArrowBack,
  MdAttachMoney,
  MdCalendarToday,
  MdCategory,
  MdDescription,
} from "react-icons/md";

import { useNavigate } from "react-router-dom";

import { auth } from "../../../firebase/auth";

import { createIncome } from "../../../firebase/firestore";

import styles from "./styles/NewIncomeForm.module.scss";

export const NewIncomeForm = () => {
  const navigate = useNavigate();

  const [description, setDescription] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [category, setCategory] =
    useState("Salário");

  const [date, setDate] = useState(
    new Date()
      .toISOString()
      .split("T")[0],
  );

  const [message, setMessage] =
    useState("");

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
        "Informe um valor válido.",
      );

      return;
    }

    try {
      const user = auth.currentUser;

      if (!user) {
        setMessage(
          "Você precisa estar logado para cadastrar uma entrada.",
        );

        return;
      }

      const incomeDate = new Date(
        `${date}T00:00:00`,
      );

      await createIncome(
        user.uid,
        description.trim(),
        Number(amount),
        category,
        incomeDate,
      );

      console.log(
        "Entrada cadastrada com sucesso!",
      );

      setMessage(
        "Entrada cadastrada com sucesso!",
      );

      setDescription("");
      setAmount("");
      setCategory("Salário");

    } catch (error) {
      console.error(
        "Erro ao cadastrar entrada:",
        error,
      );

      setMessage(
        "Não foi possível cadastrar a entrada.",
      );
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.form}>
        <button
          type="button"
          className={styles.form__back}
          onClick={() =>
            navigate("/dashboard")
          }
        >
          <MdArrowBack />

          Voltar para o dashboard
        </button>

        <div className={styles.form__header}>
          <span>NOVA ENTRADA</span>

          <h1>
            Registre uma
            <strong> nova entrada.</strong>
          </h1>

          <p>
            Registre seus recebimentos e
            mantenha suas finanças organizadas.
          </p>
        </div>

        <form
          className={styles.form__content}
          onSubmit={handleSubmit}
        >
          <div className={styles.field}>
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
                placeholder="Ex: Salário"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value,
                  )
                }
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="amount">
              Valor
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
                onChange={(event) =>
                  setAmount(
                    event.target.value,
                  )
                }
              />
            </div>
          </div>

          <div className={styles.field}>
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
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value,
                  )
                }
              >
                <option value="Salário">
                  💼 Salário
                </option>

                <option value="Freelance">
                  💻 Freelance
                </option>

                <option value="Investimentos">
                  📈 Investimentos
                </option>

                <option value="Vendas">
                  🛍️ Vendas
                </option>

                <option value="Presente">
                  🎁 Presente
                </option>

                <option value="Outros">
                  📦 Outros
                </option>
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="date">
              Data da entrada
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
                onChange={(event) =>
                  setDate(
                    event.target.value,
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
                  "/dashboard/incomes",
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
              Salvar entrada
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};