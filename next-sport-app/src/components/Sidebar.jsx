"use client";
import Link from "next/link";
import { LayoutDashboard, Users, Layers3, Plus, Eye } from "lucide-react";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const linkClass = (href) =>
    `flex items-center gap-3 px-4 py-2 rounded hover:bg-color-green hover:text-white ${
      pathname === href ? "bg-color-green text-white" : "text-gray-700"
    }`;

  return (
    <aside className="w-64 bg-white p-6 shadow-md hidden md:block">
      <h1 className="text-2xl font-bold text-color-green mb-8">Админ</h1>
      <nav className="space-y-3">
        <Link href="/admin/manage" className={linkClass("/admin/manage")}>
          <Layers3 size={18} /> Управление
        </Link>

        <Link href="/admin/viewPanel" className={linkClass("/admin/viewPanel")}>
          <Eye size={18} /> Просмотр
        </Link>

        <Link
          href="/admin/arena/create"
          className={linkClass("/admin/arena/create")}
        >
          <Plus size={18} /> Добавить арену
        </Link>
        <Link
          href="/admin/coaches/create"
          className={linkClass("/admin/coaches/create")}
        >
          <Users size={18} /> Добавить тренера
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
