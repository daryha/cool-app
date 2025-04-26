"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAuthRegister,
  selectIsAuth,
} from "../../../store/slice/authSlice";
import { useState } from "react";
import Button from "../../../ui/button";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isAuth = useSelector(selectIsAuth);

  console.log(isAuth);

  const [isCityModalOpen, setCityModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Астана");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    const data = await dispatch(
      fetchAuthRegister({ ...values, city: selectedCity })
    );

    if (!data.payload) {
      alert(`Ошибка ври регистрации`);
    } else {
      router.push("/");
      alert("Вы успешно зарегистрировались!");
    }

    console.log(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-color-green to-blue-100 px-4">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row transition duration-300">
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center"
          style={{
            backgroundImage: "url('')",
          }}
        ></div>

        <div className="w-full md:w-1/2 p-10">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2 text-center">
            Создайте аккаунт
          </h1>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Регистрация для начала занятий
          </p>

          <div>
            <p className="mb-2 text-sm">Укажите ваш город:</p>
            <Button
              type="button"
              onClick={() => setCityModalOpen(true)}
              className="w-full mb-10"
              text={`${selectedCity}`}
            />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Имя
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-color-green placeholder:text-gray-400"
                  placeholder="Введите ваше имя"
                  {...register("firstName", { required: "Укажите ваше имя" })}
                />
                {errors.name && (
                  <p className="text-red-600 mt-2">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Фамилия
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-color-green placeholder:text-gray-400"
                  placeholder="Введите вашу фамилию"
                  {...register("lastName", {
                    required: "Укажите вашу фамилию",
                  })}
                />
                {errors.lastName && (
                  <p className="text-red-600 mt-2">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-color-green placeholder:text-gray-400"
                placeholder="you@example.com"
                {...register("email", { required: "Укажите почту" })}
              />
              {errors.email && (
                <p className="text-red-600 mt-2">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Придумайте пароль
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-color-green placeholder:text-gray-400"
                placeholder="Придумайте пароль"
                {...register("password", { required: "Укажите пароль" })}
              />
              {errors.password && (
                <p className="text-red-600 mt-2">{errors.password.message}</p>
              )}
            </div>

            {isCityModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-xl w-80 space-y-4">
                  <h2 className="text-xl font-semibold text-center">
                    Выберите город
                  </h2>
                  <ul className="space-y-2">
                    {["Алматы", "Астана", "Шымкент", "Караганда"].map(
                      (city) => (
                        <li key={city}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCity(city);
                              setCityModalOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 rounded hover:bg-gray-100"
                          >
                            {city}
                          </button>
                        </li>
                      )
                    )}
                  </ul>
                  <button
                    type="button"
                    onClick={() => setCityModalOpen(false)}
                    className="w-full text-center text-sm text-gray-500 hover:underline mt-4"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={!isValid}
              className="w-full py-3 bg-color-green text-white font-semibold rounded-lg hover:bg-color-green transition text-center"
              text="Зарегистрироваться"
            />
          </form>

          <p className="text-sm text-gray-600 text-center mt-6">
            Уже есть аккаунт?{" "}
            <Link
              href="/Auth/login"
              className="text-color-green font-medium hover:underline"
            >
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
