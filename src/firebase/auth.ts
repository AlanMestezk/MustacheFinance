import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { app } from "./config";

export const auth = getAuth(app);

export const registerUser = async (
  email: string,
  password: string,
) => {
  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

  return userCredential.user;
};

export const loginUser = async (
  email: string,
  password: string,
) => {
  const credential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

  return credential.user;
};

export const resetPassword = async (
  email: string,
) => {
  auth.languageCode = "pt-BR";

  await sendPasswordResetEmail(
    auth,
    email,
  );
};