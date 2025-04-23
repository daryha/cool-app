"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Settings, User, LogOut, Menu } from "lucide-react";

import Button from "../ui/button";
import { logOut, selectIsAuth } from "../store/slice/authSlice";

/* ─── основные ссылки ─── */
const NAV_LINKS = [
  { label: "Площадки", href: "/arena-list" },
  { label: "Тренера", href: "/trainer-list" },
];

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const isAuth = useSelector(selectIsAuth);
  const userData = useSelector((s) => s.auth.data);
  const isAdmin = userData?.roles?.includes("Admin");

  const [mobileOpen, setMobileOpen] = useState(false);

  /* выход */
  const handleLogout = async () => {
    if (!window.confirm("Вы действительно хотите выйти?")) return;
    try {
      router.push("/");
      dispatch(logOut());
      window.localStorage.removeItem("token");
    } catch {
      alert("Ошибка выхода");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-sm bg-white/80 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-2">
        {/* ─── logo ─── */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/img/logo.png"
            width={130}
            height={40}
            alt="logo"
            className="select-none"
            priority
          />
        </Link>

        {/* ─── desktop nav ─── */}
        <nav className="hidden md:flex md:items-center md:gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-sm font-medium text-gray-600 hover:text-color-green transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* ─── actions ─── */}
        <div className="hidden md:flex md:items-center md:gap-4">
          {isAdmin && (
            <Link href="/admin/manage">
              <Button
                text="Панель управления"
                className="flex items-center gap-2 group"
                icon={
                  <Settings
                    size={20}
                    className="transition-transform duration-500 group-hover:rotate-[360deg]"
                  />
                }
              />
            </Link>
          )}

          {isAuth ? (
            <>
              <Link href="/user/profile">
                <Button
                  text="Личный кабинет"
                  variant={1}
                  className="flex items-center gap-2 group"
                  icon={
                    <User
                      size={20}
                      className="transition-transform duration-500 group-hover:rotate-[360deg]"
                    />
                  }
                />
              </Link>
              <Button
                className="flex flex-row-reverse items-center gap-2"
                onClick={handleLogout}
                text="Выйти"
                icon={<LogOut size={20} />}
              />
            </>
          ) : (
            <>
              <Link href="/Auth/register">
                <Button text="Регистрация" />
              </Link>
              <Link href="/Auth/login">
                <Button text="Войти" variant={2} />
              </Link>
            </>
          )}
        </div>

        {/* ─── burger (mobile) ─── */}
        <button
          onClick={() => setMobileOpen((p) => !p)}
          className="rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* ─── mobile drawer ─── */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <div className="px-4 py-3 space-y-3">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-gray-700 hover:text-color-green"
              >
                {label}
              </Link>
            ))}

            <hr className="my-2" />

            {isAdmin && (
              <Link
                href="/admin/viewPanel"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-gray-700 hover:text-color-green"
              >
                Панель управления
              </Link>
            )}

            {isAuth ? (
              <>
                <Link
                  href="/user/profile"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium text-gray-700 hover:text-color-green"
                >
                  Личный кабинет
                </Link>
                <Link href={"/"}>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left text-sm font-medium text-gray-700 hover:text-red-600"
                  >
                    Выйти
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/Auth/register"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium text-gray-700 hover:text-color-green"
                >
                  Регистрация
                </Link>
                <Link
                  href="/Auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium text-gray-700 hover:text-color-green"
                >
                  Войти
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
