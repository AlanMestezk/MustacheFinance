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

import {
  getUserExpenses,
  updateExpense,
} from "../../../firebase/firestore";

import styles from "./styles/NewExpenseForm.module.scss";

import { auth } from "../../../firebase/auth";
import { createExpense } from "../../../firebase/firestore";

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
export const NewExpenseForm = () => {
  
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Alimentação");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [message, setMessage] = useState("");

  const { expenseId } = useParams<{
    expenseId: string;
  }>();

  const isEditing = Boolean(expenseId);
const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setMessage("");

    if (!description.trim()) {
      setMessage("Informe uma descrição.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setMessage("Informe um valor válido.");
      return;
    }

    try {
      const user = auth.currentUser;

      if (!user) {
        setMessage(
          "Você precisa estar logado para cadastrar um gasto.",
        );

        return;
      }

      const expenseDate = new Date(
        `${date}T00:00:00`,
      );

      // EDITANDO UM GASTO
      if (isEditing && expenseId) {
        await updateExpense(
          user.uid,
          expenseId,
          description.trim(),
          Number(amount),
          category,
          expenseDate,
        );

        console.log(
          "Gasto atualizado com sucesso!",
        );

        setMessage(
          "Gasto atualizado com sucesso!",
        );

        return;
      }

      // CRIANDO UM NOVO GASTO
      await createExpense(
        user.uid,
        description.trim(),
        Number(amount),
        category,
        expenseDate,
      );

      console.log(
        "Gasto cadastrado com sucesso!",
      );

      setMessage(
        "Gasto cadastrado com sucesso!",
      );

      setDescription("");
      setAmount("");
      setCategory("Alimentação");

    } catch (error) {
      console.error(
        "Erro ao salvar gasto:",
        error,
      );

      setMessage(
        isEditing
          ? "Não foi possível atualizar o gasto."
          : "Não foi possível cadastrar o gasto.",
      );
    }
  };

  useEffect(() => {
      if (!isEditing || !expenseId) {
        return;
      }

      const loadExpense = async () => {
        const user = auth.currentUser;

        if (!user) {
          setMessage(
            "Você precisa estar logado.",
          );

          return;
        }

        try {
          const expenses =
            await getUserExpenses(
              user.uid,
            ) as Expense[];

          const expense = expenses.find(
            (item) =>
              item.id === expenseId,
          );

          if (!expense) {
            setMessage(
              "Gasto não encontrado.",
            );

            return;
          }

          setDescription(
            expense.description,
          );

          setAmount(
            String(expense.amount),
          );

          setCategory(
            expense.category,
          );

          setDate(
            new Date(
              expense.date.seconds * 1000,
            )
              .toISOString()
              .split("T")[0],
          );
        } catch (error) {
          console.error(
            "Erro ao carregar gasto:",
            error,
          );

          setMessage(
            "Não foi possível carregar o gasto.",
          );
        }
      };

      loadExpense();
    }, [
      isEditing,
      expenseId,
    ]);

  return (
    <main className={styles.page}>
      <section className={styles.form}>
        <button
          type="button"
          className={styles.form__back}
          onClick={() => navigate("/dashboard")}
        >
          <MdArrowBack />
          Voltar para o dashboard
        </button>

        <div className={styles.form__header}>
          <span>NOVO GASTO</span>

          <h1>
            Registre uma
            <strong> nova saída.</strong>
          </h1>

          <p>
            Controle seus gastos e mantenha suas
            finanças organizadas.
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

            <div className={styles.field__input}>
              <MdDescription />

              <input
                id="description"
                type="text"
                placeholder="Ex: Restaurante"
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

            <div className={styles.field__input}>
              <MdAttachMoney />

              <input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(event) =>
                  setAmount(event.target.value)
                }
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="category">
              Categoria
            </label>

            <div className={styles.field__input}>
              <MdCategory />

              <select
                id="category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
              >
                <option value="Alimentação">
                  🍔 Alimentação
                </option>

                <option value="Transporte">
                  🚗 Transporte
                </option>

                <option value="Casa">
                  🏠 Casa
                </option>

                <option value="Lazer">
                  🎮 Lazer
                </option>

                <option value="Compras">
                  🛍️ Compras
                </option>

                <option value="Saúde">
                  💊 Saúde
                </option>

                <option value="Educação">
                  📚 Educação
                </option>

                <option value="Contas">
                  💳 Contas
                </option>

                <option value="Outros">
                  📦 Outros
                </option>
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="date">
              Data do gasto
            </label>

            <div className={styles.field__input}>
              <MdCalendarToday />

              <input
                id="date"
                type="date"
                value={date}
                onChange={(event) =>
                  setDate(event.target.value)
                }
              />
            </div>
          </div>

          {message && (
            <p className={styles.form__message}>
              {message}
            </p>
          )}

          <div className={styles.form__actions}>
            <button
              type="button"
              className={styles.form__cancel}
              onClick={() =>
                navigate("/dashboard/expenses")
              }
            >
              Voltar
            </button>

            <button
              type="submit"
              className={styles.form__submit}
            >
              Salvar
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};