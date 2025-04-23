"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBooking,
  selectAllBookings,
  selectBookingLoading,
} from "../../../store/slice/bookingSlice";
import axios from "../../../axios";
import { Settings, LogOut, Trash, X, ChartBar } from "lucide-react";
import { AnimatePresence, maxGeneratorDuration, motion } from "framer-motion";
import Wrapper from "../../../components/Wrapper";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminBookingsPage = () => {
  const dispatch = useDispatch();
  const bookings = useSelector(selectAllBookings);
  const loading = useSelector(selectBookingLoading);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    dispatch(fetchAllBooking());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (confirm("Вы уверены, что хотите отменить бронирование?")) {
      try {
        await axios.delete(`/api/booking/${id}`);
        dispatch(fetchAllBooking());
      } catch {
        alert("Ошибка при удалении бронирования");
      }
    }
  };

  const coachBookings = bookings.filter((b) => b.booking.coach);
  const facilityBookings = bookings.filter((b) => b.booking.sportFacility);

  const summaryData = [
    {
      name: "Тренеры",
      bookings: coachBookings.length,
      revenue: coachBookings.reduce((s, i) => s + i.totalPrice, 0),
    },
    {
      name: "Спортзалы",
      bookings: facilityBookings.length,
      revenue: facilityBookings.reduce((s, i) => s + i.totalPrice, 0),
    },
  ];

  const openModal = (item) => {
    setSelected(item);
    setShowModal(true);
  };

  return (
    <Wrapper>
      <div className="py-12 px-6 max-w-7xl mx-auto">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-white rounded shadow flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Всего броней</p>
              <p className="text-2xl font-semibold text-blue-600">
                {bookings.length}
              </p>
            </div>
            <ChartBar className="w-8 h-8 text-blue-600" />
          </div>
          <div className="p-4 bg-white rounded shadow flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Общий доход</p>
              <p className="text-2xl font-semibold text-green-600">
                {summaryData
                  .reduce((s, d) => s + d.revenue, 0)
                  .toLocaleString("ru-RU", { maximumFractionDigits: 0 })}
                ₸
              </p>
            </div>
            <ChartBar className="w-8 h-8 text-green-600" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Charts Sidebar */}
          <aside className="lg:w-1/3 bg-white rounded shadow p-4 space-y-6">
            <h2 className="text-lg font-semibold">Аналитика</h2>
            <div className="h-40">
              <ResponsiveContainer>
                <BarChart data={summaryData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-40">
              <ResponsiveContainer>
                <BarChart data={summaryData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </aside>

          {/* Bookings Table */}
          <section className="lg:flex-1 bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Список броней</h2>
            <table className="w-full text-sm table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Тип</th>
                  <th className="p-2">Имя</th>
                  <th className="p-2">Дата</th>
                  <th className="p-2">Часы</th>
                  <th className="p-2">Сумма</th>
                  <th className="p-2">Действия</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((item) => {
                  const b = item.booking;
                  const type = b.coach ? "Тренер" : "Площадка";
                  const name = b.coach
                    ? `${b.coach.firstName} ${b.coach.lastName}`
                    : b.sportFacility.name;
                  return (
                    <motion.tr
                      key={b.id}
                      whileHover={{ backgroundColor: "#f9fafb" }}
                      className="cursor-pointer"
                      onClick={() => openModal(item)}
                    >
                      <td className="border p-2 text-center">{type}</td>
                      <td className="border p-2">{name}</td>
                      <td className="border p-2 text-center">
                        {new Date(b.bookingDate).toLocaleDateString()}
                      </td>
                      <td className="border p-2 text-center">
                        {item.totalHours.toFixed(1)}
                      </td>
                      <td className="border p-2 text-center">
                        {Number(item.totalPrice).toLocaleString("ru-RU", {
                          maximumFractionDigits: 0,
                        })}
                        ₸
                      </td>
                      <td className="border p-2 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(b.id);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        </div>

        {/* Details Modal */}
        <AnimatePresence>
          {showModal && selected && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl overflow-auto max-h-[90vh]"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowModal(false)}
                >
                  <X size={20} />
                </button>
                {(() => {
                  const item = selected;
                  const b = item.booking;
                  const isCoach = !!b.coach;
                  return (
                    <>
                      <h3 className="text-2xl font-bold mb-2">
                        {isCoach
                          ? `${b.coach.firstName} ${b.coach.lastName}`
                          : b.sportFacility.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        {new Date(b.bookingDate).toLocaleDateString()} с{" "}
                        {b.startTime} до {b.endTime}
                      </p>
                      <div className="mb-4">
                        <span className="font-medium">Часы: </span>{" "}
                        {item.totalHours.toFixed(1)}
                        <br />
                        <span className="font-medium">Сумма: </span>{" "}
                        {item.totalPrice} ₸
                      </div>
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Клиент:</h4>
                        <p>
                          {b.user.firstName} {b.user.lastName}
                        </p>
                        <p>Город: {b.user.city}</p>
                      </div>
                      {isCoach ? (
                        <div className="mb-4">
                          <h4 className="font-semibold mb-2">
                            Контакты тренера:
                          </h4>
                          <p>Тел: {b.coach.phone}</p>
                          <p>Telegram: {b.coach.telegram}</p>
                          <p>WhatsApp: {b.coach.whatsApp}</p>
                        </div>
                      ) : (
                        <div className="mb-4">
                          <h4 className="font-semibold mb-2">Площадка:</h4>
                          <p>Адрес: {b.sportFacility.address}</p>
                          <p>Вместимость: {b.sportFacility.capacity}</p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Wrapper>
  );
};

export default AdminBookingsPage;
