import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { app } from "./config";

export const db = getFirestore(app);

export const createUserProfile = async (
  uid: string,
  name: string,
  photoUrl: string = "",
) => {
  await setDoc(doc(db, "users", uid), {
    name,
    photoUrl,
    createdAt: serverTimestamp(),
  });
};

export const createExpense = async (
  uid: string,
  description: string,
  amount: number,
  category: string,
  date: Date,
) => {
  await addDoc(
    collection(
      db,
      "users",
      uid,
      "expenses",
    ),
    {
      description,
      amount,
      category,
      date,
      createdAt: serverTimestamp(),
    },
  );
};

export const getUserExpenses = async (
  uid: string,
) => {
  const expensesRef = collection(
    db,
    "users",
    uid,
    "expenses",
  );

  const expensesQuery = query(
    expensesRef,
    orderBy("date", "desc"),
  );

  const snapshot = await getDocs(
    expensesQuery,
  );

  console.log(
    "DOCUMENTOS ENCONTRADOS:",
    snapshot.docs,
  );

  const expenses = snapshot.docs.map(
    (expense) => ({
      id: expense.id,
      ...expense.data(),
    }),
  );

  console.log(
    "GASTOS RETORNADOS:",
    expenses,
  );

  return expenses;
};

export const deleteExpense = async (
  uid: string,
  expenseId: string,
) => {
  await deleteDoc(
    doc(
      db,
      "users",
      uid,
      "expenses",
      expenseId,
    ),
  );
};

export const updateExpense = async (
  uid: string,
  expenseId: string,
  description: string,
  amount: number,
  category: string,
  date: Date,
) => {
  await updateDoc(
    doc(
      db,
      "users",
      uid,
      "expenses",
      expenseId,
    ),
    {
      description,
      amount,
      category,
      date,
    },
  );
};