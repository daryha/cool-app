"use client";

import React, { useState, useEffect } from "react";
import axios from "../../../axios";
import Link from "next/link";
import { Plus, Trash, FileText } from "lucide-react";
import { saveAs } from "file-saver";

// Кнопка экспорта бронирований тренера
function ExportCoachScheduleButton({ coachId }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/admin/coach/${coachId}/bookings/excel`,
        {
          responseType: "blob",
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        }
      );
      const cd = res.headers["content-disposition"];
      let filename = "coach_schedule.xlsx";
      if (cd) {
        const m = /filename="?([^"]+)"?/.exec(cd);
        if (m && m[1]) filename = m[1];
      }
      saveAs(res.data, filename);
    } catch (err) {
      console.error(err);
      alert("Не удалось загрузить файл бронирований тренера");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
    >
      <FileText size={16} /> {loading ? "..." : "Экспорт"}
    </button>
  );
}

// Кнопка экспорта бронирований площадки
function ExportFacilityScheduleButton({ facilityId }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/admin/facility/${facilityId}/bookings/excel`,
        {
          responseType: "blob",
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        }
      );
      const cd = res.headers["content-disposition"];
      let filename = "facility_schedule.xlsx";
      if (cd) {
        const m = /filename="?([^"]+)"?/.exec(cd);
        if (m && m[1]) filename = m[1];
      }
      saveAs(res.data, filename);
    } catch (err) {
      console.error(err);
      alert("Не удалось загрузить файл бронирований площадки");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
    >
      <FileText size={16} /> {loading ? "..." : "Экспорт"}
    </button>
  );
}

function AdminCoachCard({ coach, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      <div className="h-48 bg-gray-100">
        <img
          src={coach.photoUrl || "/placeholder.png"}
          alt={`${coach.firstName} ${coach.lastName}`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold">
          {coach.firstName} {coach.lastName}
        </h3>
        <p className="text-sm text-gray-600">{coach.sportType}</p>
        <div className="flex justify-between items-center mt-4 space-x-2">
          <ExportCoachScheduleButton coachId={coach.id} />
          <button
            onClick={() => onDelete(coach, "coaches")}
            className="text-red-500 hover:text-red-700"
            title="Удалить"
          >
            <Trash size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminFacilityCard({ facility, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      <div className="h-48 bg-gray-100">
        <img
          src={facility.photoUrl || "/placeholder.png"}
          alt={facility.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold">{facility.name}</h3>
        <p className="text-sm text-gray-600">{facility.address}</p>
        <div className="flex justify-between items-center mt-4 space-x-2">
          <ExportFacilityScheduleButton facilityId={facility.id} />
          <button
            onClick={() => onDelete(facility, "facilities")}
            className="text-red-500 hover:text-red-700"
            title="Удалить"
          >
            <Trash size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminManagePage() {
  const [coaches, setCoaches] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("coaches");

  useEffect(() => {
    (async () => {
      try {
        const [cRes, fRes] = await Promise.all([
          axios.get("/api/admin/coaches"),
          axios.get("/api/admin/facilities"),
        ]);
        setCoaches(cRes.data);
        setFacilities(fRes.data);
      } catch (e) {
        console.error("Ошибка загрузки", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (item, type) => {
    if (!confirm("Вы точно хотите удалить?")) return;
    try {
      await axios.delete(`/api/admin/${type}/${item.id}`);
      if (type === "coaches") {
        setCoaches((prev) => prev.filter((c) => c.id !== item.id));
      } else {
        setFacilities((prev) => prev.filter((f) => f.id !== item.id));
      }
    } catch (err) {
      console.error(err);
      alert("Ошибка при удалении");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7fdfc] to-[#ebf4ff] py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="mb-10 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Управление контентом
          </h1>
          <div className="flex gap-4">
            <Link href="/admin/arena/create">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center gap-2">
                <Plus size={16} /> Добавить арену
              </button>
            </Link>
            <Link href="/admin/coaches/create">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2">
                <Plus size={16} /> Добавить тренера
              </button>
            </Link>
          </div>
        </div>

        {/* Вкладки */}
        <div className="flex gap-4 mb-6">
          {["coaches", "facilities"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                tab === t
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border"
              }`}
            >
              {t === "coaches" ? "Тренеры" : "Площадки"}
            </button>
          ))}
        </div>

        {/* Содержимое */}
        {loading ? (
          <p className="text-center text-gray-500">Загрузка...</p>
        ) : tab === "coaches" ? (
          coaches.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {coaches.map((c) => (
                <AdminCoachCard key={c.id} coach={c} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">Нет тренеров</p>
          )
        ) : facilities.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {facilities.map((f) => (
              <AdminFacilityCard
                key={f.id}
                facility={f}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">Нет площадок</p>
        )}
      </div>
    </div>
  );
}
