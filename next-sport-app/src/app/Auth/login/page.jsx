"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  fetchAuth,
  fetchAuthMe,
  selectIsAuth,
} from "../../../store/slice/authSlice";
import React, { useEffect } from "react";

import logoImg from "../../../../public/img/Logo.png";
import Image from "next/image";

const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isAuth = useSelector(selectIsAuth);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    try {
      // 1. Логинимся
      const { token } = await dispatch(fetchAuth(values)).unwrap();

      // 2. Сохраняем токен (лучше http‑only cookie, но пусть будет LS)
      localStorage.setItem("token", token);

      // 3. Хотим тут же обновить стор (UX‑френдли)
      await dispatch(fetchAuthMe()).unwrap();

      // 4. Полный перезапуск вкладки
      window.location.reload(); // ← твой «жёсткий» restart
      //  // Если нужен мягкий вариант:
      //  // router.refresh();
    } catch (err) {
      alert("Ошибка при входе");
      console.error(err);
    }
  };

  React.useEffect(() => {
    if (isAuth) {
      router.push("/");
    }
  }, [isAuth, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-color-green to-blue-100 px-4 ">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row transition duration-300">
        <div className=" md:block md:w-1/2 bg-cover bg-center">
          <Image src={logoImg} alt="lol" />
        </div>

        <div className="w-full md:w-1/2 p-10">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2 text-center">
            С возвращением
          </h1>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Войдите, чтобы продолжить
          </p>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>

              <input
                type="email"
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.email ? "focus:ring-red-600" : "focus:ring-color-green"
                } transition`}
                placeholder="you@example.com"
                {...register("email", { required: "Укажите почту" })}
              />

              {errors.email && (
                <p className="text-red-600 mt-2">{errors.email?.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Пароль
              </label>
              <input
                type="password"
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${
                  errors.password?.message
                    ? "focus:ring-red-600"
                    : "focus:ring-color-green"
                } transition`}
                {...register("password", { required: "Укажите пароль" })}
                placeholder="••••••••"
              />

              {errors.password && (
                <p className="text-red-600 mt-2">{errors.password?.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-color-green text-white font-semibold rounded-lg hover:bg-color-green transition text-center"
            >
              Войти
            </button>
          </form>

          <p className="text-sm text-gray-600 text-center mt-6">
            Нет аккаунта?{" "}
            <Link
              href="/Auth/register"
              className="text-color-green font-medium hover:underline"
            >
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
