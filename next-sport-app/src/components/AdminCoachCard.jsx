"use client";

import { Pencil, Trash2 } from "lucide-react";

const AdminCoachCard = ({ coach, onEdit, onDelete }) => {
  return (
    <div className="flex items-center gap-4 bg-white shadow-sm border rounded-xl p-4 hover:shadow-md transition">
      <img
        src={coach.photoUrl || "https://placehold.co/100x100?text=Coach"}
        alt="coach"
        className="w-20 h-20 rounded-lg object-cover"
      />

      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">
          {coach.firstName} {coach.lastName}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2"></p>
        <div className="text-xs text-gray-400 mt-1">
          Опыт: {coach.experience} лет · {coach.sportType}
        </div>
        <div className="text-sm font-medium text-color-blue mt-1">
          {coach.price?.toLocaleString()} ₸ / час
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => onDelete(coach)}
          className="text-red-500 hover:text-red-600"
          title="Удалить"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default AdminCoachCard;
