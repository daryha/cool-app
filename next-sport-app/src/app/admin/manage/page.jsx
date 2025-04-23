"use client";

import React, { useState, useEffect } from "react";
import axios from "../../../axios";
import Link from "next/link";
import { Plus, Edit, Trash, FileText } from "lucide-react";
import { saveAs } from "file-saver";

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
      let filename = "schedule.xlsx";
      if (cd) {
        const m = /filename="?([^"]+)"?/.exec(cd);
        if (m && m[1]) filename = m[1];
      }
      saveAs(res.data, filename);
    } catch (err) {
      console.error(err);
      alert("Не удалось загрузить файл");
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

function AdminCoachCard({ coach, onEdit, onDelete }) {
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
          <button
            onClick={() => onEdit(coach)}
            className="text-gray-500 hover:text-gray-700"
            title="Редактировать"
          ></button>
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

function AdminFacilityCard({ facility, onEdit, onDelete }) {
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
        <div className="flex justify-end items-center mt-4 space-x-2">
          <button
            onClick={() => onEdit(facility)}
            className="text-gray-500 hover:text-gray-700"
            title="Редактировать"
          ></button>
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

  const handleEdit = (item) => {
    alert(
      "TODO: открыть модалку редактирования «" +
        (item.name || item.firstName) +
        "»"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7fdfc] to-[#ebf4ff] py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Управление контентом
          </h1>
        </div>

        {/* Tabs */}
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

        {/* Content */}
        {loading ? (
          <p className="text-center text-gray-500">Загрузка...</p>
        ) : tab === "coaches" ? (
          coaches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {coaches.map((c) => (
                <AdminCoachCard
                  key={c.id}
                  coach={c}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">Нет тренеров</p>
          )
        ) : facilities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {facilities.map((f) => (
              <AdminFacilityCard
                key={f.id}
                facility={f}
                onEdit={handleEdit}
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
