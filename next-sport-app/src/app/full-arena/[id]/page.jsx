"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlarmClock,
  Check,
  Lightbulb,
  MapPin,
  Scaling,
  Shirt,
  ShowerHead,
  SquareParking,
  User,
  X,
} from "lucide-react";
import Wrapper from "../../../components/Wrapper";
import BookingBar from "../../../components/BookingBar";
import CardItem from "../../../components/cardItem";
import { arenaData } from "../../../data/arenaData";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import axios from "../../../axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchArenas, selectAllArenas } from "../../../store/slice/arenaSlice";

export default function ArenaPage() {
  const [data, setData] = React.useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = React.useState(true);
  const { id } = useParams();
  const userData = useSelector((state) => state.auth.data);
  const arenas = useSelector(selectAllArenas);
  const dispatch = useDispatch();

  React.useEffect(() => {
    axios
      .get(`/api/facilities/${id}`)
      .then((res) => setData(res.data))
      .catch((err) => {
        console.warn(err);
        alert("Ошибка при получении данных арены");
      })
      .finally(() => setLoading(false));
  }, [id]);

  React.useEffect(() => {
    dispatch(fetchArenas());
  }, [dispatch]);

  if (loading) return <div className="p-10 text-center">Загрузка...</div>;
  if (!data) return <div className="p-10 text-red-500">Арена не найдена</div>;

  const amenities = [
    { name: "Раздевалки", icon: <Shirt />, available: data.hasLockerRooms },
    { name: "Трибуны", available: data.hasStands },
    { name: "Душ", icon: <ShowerHead />, available: data.hasShower },
    { name: "Освещение", icon: <Lightbulb />, available: data.hasLighting },
    { name: "Парковка", icon: <SquareParking />, available: data.hasParking },
    { name: "Инвентарь", available: data.hasEquipment },
  ];

  const handleBooking = async () => {
    try {
      await axios.post("/api/booking/facility", {
        sportFacilityId: id,
        userId: userData.id,
        bookingDate,
        startTime: `${startTime}:00`,
        endTime: `${endTime}:00`,
      });
      alert("Бронирование успешно оформлено!");
      setShowBookingModal(false);
      setBookingDate("");
      setStartTime("");
      setEndTime("");
    } catch (err) {
      console.error("Ошибка при бронировании", err);
    }
  };

  const calculateTotalPrice = () => {
    if (!startTime || !endTime || !data?.price) return 0;
    const [startHour] = startTime.split(":").map(Number);
    const [endHour] = endTime.split(":").map(Number);
    const hours = endHour - startHour;
    return hours > 0 ? hours * data.price : 0;
  };

  return (
    <Wrapper>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative h-[400px] overflow-hidden rounded-lg shadow-lg mt-16"
      >
        <img
          src={data.photoUrl}
          alt={data.name}
          className="w-full h-full object-cover brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
          <div>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              {data.name}
            </h1>
            <span className="inline-block mt-2 bg-color-green text-white px-4 py-1 rounded text-lg font-semibold drop-shadow">
              {data.price} ₸/час
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10"
      >
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center gap-4 text-gray-700">
            <MapPin size={20} />
            <span className="text-lg">{data.address}</span>
          </div>

          <div className="border rounded p-5 w-full">
            <p className="text-gray-600 leading-relaxed">{data.description}</p>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Scaling size={20} />
              <span>
                {data.length}×{data.width}×{data.height} м
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User size={20} />
              <span>Вместимость: {data.capacity}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Покрытие:</span> {data.surfaceType}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Спортивные направления
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.sportTypes.length > 0 ? (
                data.sportTypes.map((s, i) => (
                  <span
                    key={i}
                    className="bg-color-green text-color-white px-3 py-1 rounded-full text-sm"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">—</span>
              )}
            </div>
          </div>

          <div>
            <div className="mt-6">
              <button
                onClick={() => setShowBookingModal(true)}
                className="bg-color-blue hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-semibold"
              >
                Забронировать площадку
              </button>
            </div>

            <AnimatePresence>
              {showBookingModal && (
                <motion.div
                  className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl relative"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowBookingModal(false)}
                    >
                      <X size={20} />
                    </button>
                    <h3 className="text-xl font-bold mb-4 text-gray-800">
                      Забронировать площадку
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Дата
                        </label>
                        <input
                          type="date"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Начало
                          </label>
                          <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Конец
                          </label>
                          <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-700 font-semibold">
                        Итого: {calculateTotalPrice()} ₸
                      </div>
                      <button
                        onClick={handleBooking}
                        className="bg-color-green hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold w-full"
                      >
                        Подтвердить
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Удобства
            </h2>
            <ul className="grid grid-cols-2 gap-4">
              {amenities.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  {item.available ? (
                    <Check className="text-green-500" />
                  ) : (
                    <X className="text-red-500" />
                  )}
                  <div
                    className={
                      item.available
                        ? "text-gray-800 flex items-center gap-2"
                        : "text-gray-400 flex items-center gap-2"
                    }
                  >
                    <span>{item.name}</span>
                    <span>{item.icon}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-16"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Смотрите также
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-[200px]">
          {arenas.slice(0, 6).map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="rounded-lg overflow-hidden shadow hover:shadow-lg transition"
            >
              <CardItem
                id={item.id}
                imgUrl={item.photoUrl}
                title={item.name}
                price={item.price}
                address={item.address}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Wrapper>
  );
}
