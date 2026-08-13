import { useState } from "react";
import type { ChangeEvent } from "react";

import { Link } from "react-router-dom";

import {
  MdAddAPhoto,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";

import logo from "../../assets/logo/logo.png";

import { registerUser } from "../../firebase/auth";

import { createUserProfile } from "../../firebase/firestore";

import styles from "./styles/RegisterForm.module.scss";

import { FirebaseError } from "firebase/app";

import { useNavigate } from "react-router-dom";
import {LoadScreen} from '../LoadScreen/LoadScreen'

const convertImageToBase64 = (
  file: File,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(
          new Error(
            "Não foi possível converter a imagem.",
          ),
        );
      }
    };

    reader.onerror = () => {
      reject(
        new Error("Erro ao ler a imagem."),
      );
    };

    reader.readAsDataURL(file);
  });
};

const resizeImage = (
  file: File,
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      const maxSize = 800;

      let width = image.width;
      let height = image.height;

      if (width > height && width > maxSize) {
        height =
          (height * maxSize) / width;
        width = maxSize;
      }

      if (height > width && height > maxSize) {
        width =
          (width * maxSize) / height;
        height = maxSize;
      }

      const canvas = document.createElement(
        "canvas",
      );

      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");

      if (!context) {
        URL.revokeObjectURL(objectUrl);

        reject(
          new Error(
            "Não foi possível processar a imagem.",
          ),
        );

        return;
      }

      context.drawImage(
        image,
        0,
        0,
        width,
        height,
      );

      URL.revokeObjectURL(objectUrl);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(
              new Error(
                "Não foi possível comprimir a imagem.",
              ),
            );
          }
        },
        "image/jpeg",
        0.7,
      );
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);

      reject(
        new Error(
          "Não foi possível carregar a imagem.",
        ),
      );
    };

    image.src = objectUrl;
  });
};

const prepareProfilePhoto = async (
  file: File,
): Promise<string> => {
  const resizedImage = await resizeImage(file);

  return convertImageToBase64(
    new File(
      [resizedImage],
      "profile.jpg",
      {
        type: "image/jpeg",
      },
    ),
  );
};

export const RegisterForm = () => {
  const [showPassword, setShowPassword] =
    useState(false);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [photoPreview, setPhotoPreview] =
    useState("");

  const [photo, setPhoto] =
    useState<File | null>(null);

  const handlePhotoChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setPhoto(file);

    setPhotoPreview(
      URL.createObjectURL(file),
    );
  };

  const handleSubmit = async (
  event: React.FormEvent<HTMLFormElement>,
) => {
  event.preventDefault();

  setMessage("");

  try {
    // 1. Cria o usuário no Authentication
    const user = await registerUser(
      email,
      password,
    );

    console.log(
      "1. Usuário criado:",
      user.uid,
    );

    // 2. Converte e comprime a foto
    let photoUrl = "";

    if (photo) {
      console.log(
        "2. Processando foto...",
      );

      photoUrl =
        await prepareProfilePhoto(photo);

      console.log(
        "3. Foto preparada com sucesso!",
      );
    }

    // 3. Cria o perfil no Firestore
    await createUserProfile(
      user.uid,
      name,
      photoUrl,
    );

    console.log(
      "4. Perfil criado no Firestore!",
    );

    // 4. Mostra a tela de carregamento
    setIsLoading(true);

    // 5. Aguarda 1,5 segundo e vai para o login
    setTimeout(() => {
      navigate("/login");
    }, 1500);

  } catch (error) {
  console.error(
    "Erro ao criar conta:",
    error,
  );

  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/email-already-in-use":
        setMessage(
          "Este e-mail já está cadastrado.",
        );
        break;

      case "auth/invalid-email":
        setMessage(
          "Digite um e-mail válido.",
        );
        break;

      case "auth/weak-password":
        setMessage(
          "A senha é muito fraca. Escolha uma senha mais forte.",
        );
        break;

      case "auth/missing-email":
        setMessage(
          "Digite seu e-mail.",
        );
        break;

      case "auth/missing-password":
        setMessage(
          "Digite sua senha.",
        );
        break;

      case "auth/invalid-credential":
        setMessage(
          "Os dados informados são inválidos.",
        );
        break;

      default:
        setMessage(
          "Não foi possível criar a conta. Tente novamente.",
        );
    }
  } else {
    setMessage(
      "Não foi possível criar a conta.",
    );
  }
}
};

if (isLoading) {
  return (
    <LoadScreen
      title="Criando sua conta..."
      message="Só um momento. Estamos preparando tudo para você."
    />
  );
}
  return (
    <section className={styles.form}>
      <div className={styles.form__header}>
        <img
          src={logo}
          alt="Mustache Finance"
          className={styles.form__logo}
        />

        <h1>
          Crie sua
          <span> conta.</span>
        </h1>

        <p>
          Comece a organizar suas
          finanças hoje.
        </p>
      </div>

      <form
        className={styles.form__content}
        onSubmit={handleSubmit}
      >
        <div className={styles.form__photo}>
          <label
            className={
              styles.form__photoButton
            }
          >
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Prévia da foto de perfil"
              />
            ) : (
              <>
                <MdAddAPhoto />

                <span>
                  Adicionar foto
                </span>
              </>
            )}

            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handlePhotoChange}
            />
          </label>
        </div>

        <div className={styles.form__field}>
          <label htmlFor="name">
            Como quer ser chamado
          </label>

          <input
            id="name"
            name="name"
            type="text"
            placeholder="Seu nome"
            autoComplete="name"
            value={name}
            onChange={(event) =>
              setName(
                event.target.value,
              )
            }
          />
        </div>

        <div className={styles.form__field}>
          <label htmlFor="email">
            E-mail
          </label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value,
              )
            }
          />
        </div>

        <div className={styles.form__field}>
          <label htmlFor="password">
            Senha
          </label>

          <div
            className={
              styles.form__password
            }
          >
            <input
              id="password"
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Digite sua senha"
              autoComplete="new-password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value,
                )
              }
            />

            <button
              type="button"
              className={
                styles.form__passwordToggle
              }
              onClick={() =>
                setShowPassword(
                  (current) => !current,
                )
              }
              aria-label={
                showPassword
                  ? "Ocultar senha"
                  : "Mostrar senha"
              }
            >
              {showPassword ? (
                <MdVisibilityOff />
              ) : (
                <MdVisibility />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className={styles.form__button}
        >
          Criar conta
        </button>

        {message && (
          <p>{message}</p>
        )}
      </form>

      <div className={styles.form__login}>
        <span>
          Já possui uma conta?
        </span>

        <Link to="/login">
          Entrar
        </Link>
      </div>
    </section>
  );
};