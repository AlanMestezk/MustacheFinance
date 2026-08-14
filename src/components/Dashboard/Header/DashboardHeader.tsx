import { useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth } from "../../../firebase/auth";
import { db } from "../../../firebase/firestore";

import styles from "./styles/DashboardHeader.module.scss";

import logo from "../../../assets/logo/logo.png";

interface UserProfile {
  name: string;
  photoUrl: string;
}

export const DashboardHeader = () => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (!firebaseUser) {
          setUser(null);
          return;
        }

        try {
          const userRef = doc(
            db,
            "users",
            firebaseUser.uid,
          );

          const userSnapshot =
            await getDoc(userRef);

          if (userSnapshot.exists()) {
            const data =
              userSnapshot.data();

            setUser({
              name: data.name ?? "",
              photoUrl: data.photoUrl ?? "",
            });
          }
        } catch (error) {
          console.error(
            "Erro ao carregar perfil:",
            error,
          );
        }
      },
    );

    return () => unsubscribe();
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.header__logo}>
            <img
                src={logo}
                alt="Mustache Finance"
            />
        </div>

      <div className={styles.header__user}>
        <div className={styles.header__greeting}>
          <span>Bem-vindo, Bigodudo!</span>

          <strong>
            {user?.name || "Bigodudo"}
          </strong>
        </div>

        <div className={styles.header__photo}>
          {user?.photoUrl ? (
            <img
              src={user.photoUrl}
              alt={`Foto de ${user.name}`}
            />
          ) : (
            <span>
              {user?.name?.charAt(0).toUpperCase() ||
                "B"}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};