"use client";

const AuthLogin = () => {
  

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f5f5f5] px-4">
      <h1 className="text-2xl font-bold text-[#2CA67C] mb-6 text-center">
        Вход в систему
      </h1>

      <form  className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#464646] mb-1">
            Email
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-[#d9d9d9] focus:border-[#2185D0] focus:ring-[#2185D0]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#464646] mb-1">
            Пароль
          </label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-[#d9d9d9] focus:border-[#2185D0] focus:ring-[#2185D0]"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-[#2CA67C] text-white hover:bg-[#2185D0] transition-colors rounded-xl py-2"
        >
          Войти
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-[#464646]">
        Нет аккаунта?{" "}
        <a className="text-[#2185D0] hover:underline" href="#">
          Зарегистрироваться
        </a>
      </p>
    </main>
  );
};

export default AuthLogin;
