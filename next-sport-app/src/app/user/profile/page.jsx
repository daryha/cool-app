"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBooking,
  selectUserBookings,
  selectBookingLoading,
} from "../../../store/slice/bookingSlice";
import axios from "../../../axios";
import { Settings, LogOut, CalendarCheck, User, Trash, X } from "lucide-react";
import { AnimatePresence, maxGeneratorDuration, motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Wrapper from "../../../components/Wrapper";

const COLORS = ["#4ADE80", "#60A5FA"];

export default function ProfilePage() {
  const dispatch = useDispatch();
  const raw = useSelector(selectUserBookings);
  const loading = useSelector(selectBookingLoading);
  const user = useSelector((state) => state.auth.data);
  const [selected, setSelected] = useState(null);
  const status = useSelector((state) => state.auth.status);

  useEffect(() => {
    dispatch(fetchBooking());
  }, [dispatch]);

  // flatten API shape
  const bookings = Array.isArray(raw)
    ? raw.map(({ booking, totalHours, totalPrice }) => ({
        ...booking,
        totalHours,
        totalPrice,
      }))
    : [];

  // split by type
  const coachBookings = bookings.filter((b) => b.coach);
  const facilityBookings = bookings.filter((b) => b.sportFacility);

  // summary stats
  const totalHours = bookings.reduce((sum, b) => sum + b.totalHours, 0);
  const totalPrice = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

  const pieData = [
    { name: "Тренеры", value: coachBookings.length },
    { name: "Площадки", value: facilityBookings.length },
  ];

  const handleDelete = async (id) => {
    if (!confirm("Вы уверены?")) return;
    try {
      await axios.delete(`/api/booking/${id}`);
      dispatch(fetchBooking());
    } catch {
      alert("Ошибка при удалении");
    }
  };

  if (status == "loading") {
    return <p>Загрузка..</p>;
  }

  return (
    <Wrapper>
      <motion.div
        className="py-12 px-6 max-w-7xl mx-auto space-y-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header & action buttons */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Привет, {user?.firstName || "Пользователь"}!
            </h1>
            <p className="text-gray-500 mt-1">Ваш кабинет</p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <motion.div
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            whileHover={{ scale: 1.03 }}
          >
            <p className="text-sm text-gray-500">Всего бронирований</p>
            <p className="text-2xl font-bold">{bookings.length}</p>
          </motion.div>
          <motion.div
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            whileHover={{ scale: 1.03 }}
          >
            <p className="text-sm text-gray-500">Всего часов</p>
            <p className="text-2xl font-bold">{totalHours.toFixed(1)}</p>
          </motion.div>
          <motion.div
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            whileHover={{ scale: 1.03 }}
          >
            <p className="text-sm text-gray-500">Потрачено ₸</p>
            <p className="text-2xl font-bold">{totalPrice.toLocaleString()}</p>
          </motion.div>
        </div>

        {/* Pie chart */}
        <div className="bg-white p-6 rounded-xl shadow flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-1/2 h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {pieData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="md:flex-1">
            <p className="text-gray-600">Распределение по типам брони</p>
            <ul className="mt-4 space-y-2">
              {pieData.map((d, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ background: COLORS[i] }}
                  />
                  <span className="font-medium">
                    {d.name}: {d.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Personal info */}
        <motion.section
          className="bg-white rounded-3xl shadow p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
            <User className="text-color-green" /> Личная информация
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Info label="Имя" value={user.firstName} />
            <Info label="Фамилия" value={user.lastName} />
            <Info label="Телефон" value={user.phone || "—"} />
            <Info label="Email" value={user.email} />
          </div>
        </motion.section>

        {/* Bookings list */}
        <motion.section
          className="bg-white rounded-3xl shadow p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
            <CalendarCheck className="text-color-green" /> Мои бронирования
          </h2>

          {loading ? (
            <p className="text-gray-400">Загрузка...</p>
          ) : bookings.length === 0 ? (
            <p className="text-gray-500">Нет активных броней</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...coachBookings, ...facilityBookings].map((b) => (
                <motion.div
                  key={b.id}
                  className="cursor-pointer bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition"
                  onClick={() => setSelected(b)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="h-44 w-full overflow-hidden">
                    <img
                      src={
                        b.coach ? b.coach.photoUrl : b.sportFacility.photoUrl
                      }
                      alt={
                        b.coach ? `${b.coach.firstName}` : b.sportFacility.name
                      }
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-1">
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                      {b.coach
                        ? `${b.coach.firstName} ${b.coach.lastName}`
                        : b.sportFacility.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(b.bookingDate).toLocaleDateString()} в{" "}
                      {b.startTime}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-color-blue font-semibold">
                        {b.totalHours.toFixed(1)} ч •{" "}
                        {b.totalPrice.toLocaleString("ru-RU", {
                          maxGeneratorDuration: 0,
                        })}{" "}
                        ₸
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(b.id);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        <AnimatePresence>
          {selected && (
            <motion.div
              className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl space-y-4 overflow-auto max-h-[90vh]"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  onClick={() => setSelected(null)}
                >
                  <X size={24} />
                </button>
                <h3 className="text-2xl font-bold">Детали бронирования</h3>
                {selected.coach ? (
                  <div className="space-y-2">
                    <p>
                      <strong>Тренер:</strong> {selected.coach.firstName}{" "}
                      {selected.coach.lastName}
                    </p>
                    <p>
                      <strong>Опыт:</strong> {selected.coach.experience} лет
                    </p>
                    <p>
                      <strong>Контакты:</strong> {selected.coach.phone},{" "}
                      {selected.coach.telegram}, {selected.coach.whatsApp}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p>
                      <strong>Арена:</strong> {selected.sportFacility.name}
                    </p>
                    <p>
                      <strong>Адрес:</strong> {selected.sportFacility.address}
                    </p>
                    <p>
                      <strong>Вместимость:</strong>{" "}
                      {selected.sportFacility.capacity}
                    </p>
                  </div>
                )}
                <div className="pt-2 border-t">
                  <p>
                    <strong>Дата:</strong>{" "}
                    {new Date(selected.bookingDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Время:</strong> {selected.startTime} —{" "}
                    {selected.endTime}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Wrapper>
  );
}

const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-base font-medium text-gray-800 truncate">{value}</p>
  </div>
);
