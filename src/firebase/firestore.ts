
import {
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
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