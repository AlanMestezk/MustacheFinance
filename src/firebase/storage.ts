
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";

import { app } from "./config";

const storage = getStorage(app);

export const uploadProfilePhoto = async (
  uid: string,
  file: File,
) => {
  const fileRef = ref(
    storage,
    `users/${uid}/profile.jpg`,
  );

  await uploadBytes(fileRef, file);

  return getDownloadURL(fileRef);
};