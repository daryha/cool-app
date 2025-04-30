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
  Star,
} from "lucide-react";
import Wrapper from "../../../components/Wrapper";
import CardItem from "../../../components/cardItem";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "../../../axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchArenas, selectAllArenas } from "../../../store/slice/arenaSlice";
import {
  fetchReviewsByFacility,
  selectReviewsFacility,
} from "../../../store/slice/reviewSlice";
import ReviewsSection from "../../../components/ReviewsSection";

export default function ArenaPage() {
  const [data, setData] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newScore, setNewScore] = useState(5);

  const status = useSelector((state) => state.review.status);
  const reviews = useSelector(selectReviewsFacility);
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const userData = useSelector((state) => state.auth.data);
  const arenas = useSelector(selectAllArenas);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`/api/facilities/${id}`)
      .then((res) => setData(res.data))
      .catch((err) => {
        console.warn(err);
        alert("Ошибка при получении данных арены");
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    dispatch(fetchArenas());
    dispatch(fetchReviewsByFacility(id));
  }, [dispatch, id]);

  const handleSubmitReview = async () => {
    try {
      await axios.post(`/api/review/facility/${id}`, {
        userId: userData.id,
        facilityId: id,
        score: newScore,
        comment: newComment,
      });
      setShowReviewModal(false);
      setNewComment("");
      setNewScore(5);
      dispatch(fetchReviewsByFacility(id));
    } catch (err) {
      console.error("Ошибка при отправке отзыва", err);
    }
  };

  if (loading) return <div className="p-10 text-center">Загрузка...</div>;
  if (!data) return <div className="p-10 text-red-500">Арена не найдена</div>;

  const amenities = [
    { name: "Раздевалки", icon: <Shirt />, available: data.hasLockerRooms },
    { name: "Трибуны", icon: <User size={18} />, available: data.hasStands },
    { name: "Душ", icon: <ShowerHead />, available: data.hasShower },
    { name: "Освещение", icon: <Lightbulb />, available: data.hasLighting },
    { name: "Парковка", icon: <SquareParking />, available: data.hasParking },
    { name: "Инвентарь", icon: <AlarmClock />, available: data.hasEquipment },
  ];

  const handleBooking = async () => {
    if (!userData) {
      alert("Пожалуйста, авторизуйтесь для бронирования");
      return;
    }

    if (!bookingDate || !startTime || !endTime) {
      alert("Пожалуйста, заполните все поля для бронирования");
      return;
    }

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
      alert("Произошла ошибка при бронировании. Попробуйте позже.");
    }
  };

  const calculateTotalPrice = () => {
    if (!startTime || !endTime || !data?.price) return 0;
    const [startHour] = startTime.split(":").map(Number);
    const [endHour] = endTime.split(":").map(Number);
    const hours = endHour - startHour;
    return hours > 0 ? hours * data.price : 0;
  };

  // Функция для вычисления средней оценки
  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.score, 0);
    return (sum / reviews.length).toFixed(1);
  };

  // Получаем только 3 рекомендуемые арены (не включая текущую)
  const recommendedArenas = arenas
    .filter((arena) => arena.id !== id)
    .slice(0, 3);

  return (
    <Wrapper>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative h-[400px] overflow-hidden rounded-lg shadow-lg mt-16"
      >
        <img
          src={data.photoUrl || "/placeholder-arena.jpg"}
          alt={data.name}
          className="w-full h-full object-cover brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
          <div>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              {data.name}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="inline-block bg-color-green text-white px-4 py-1 rounded text-lg font-semibold drop-shadow">
                {data.price} ₸/час
              </span>
              {reviews && reviews.length > 0 && (
                <span className="inline-flex items-center bg-color-blue/80 text-white px-3 py-1 rounded text-sm font-medium">
                  <Star
                    size={16}
                    className="mr-1 fill-yellow-300 text-yellow-300"
                  />
                  {calculateAverageRating()}
                </span>
              )}
            </div>
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

          <div className="border rounded-lg p-5 w-full bg-gray-50">
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
              {data.sportTypes && data.sportTypes.length > 0 ? (
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
                className="bg-color-blue hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-semibold transition-colors"
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
                  onClick={(e) => {
                    if (e.target === e.currentTarget)
                      setShowBookingModal(false);
                  }}
                >
                  <motion.div
                    className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl relative"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
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
                          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
                          min={new Date().toISOString().split("T")[0]}
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
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
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
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
                          />
                        </div>
                      </div>
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">
                            Стоимость аренды:
                          </span>
                          <span>{data.price} ₸/час</span>
                        </div>
                        <div className="flex justify-between items-center font-semibold text-lg">
                          <span>Итого:</span>
                          <span className="text-color-blue">
                            {calculateTotalPrice()} ₸
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={handleBooking}
                        disabled={!bookingDate || !startTime || !endTime}
                        className="bg-color-green hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold w-full disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        Подтвердить бронирование
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Удобства
            </h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {amenities.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  {item.available ? (
                    <Check className="text-green-500" size={18} />
                  ) : (
                    <X className="text-red-500" size={18} />
                  )}
                  <div
                    className={`flex items-center gap-2 ${
                      item.available ? "text-gray-800" : "text-gray-400"
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Секция отзывов */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Отзывы</h2>
              {userData && (
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="text-color-blue hover:underline text-sm font-medium"
                >
                  Оставить отзыв
                </button>
              )}
            </div>

            {reviews && reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review, idx) => (
                  <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                          {review.userName?.charAt(0) || "U"}
                        </div>
                        <div className="ml-3">
                          <div className="font-medium">
                            {review.userName || "Пользователь"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString(
                              "ru-RU"
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < review.score
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-6 border rounded-lg">
                Пока нет отзывов
              </div>
            )}

            {/* Модальное окно для добавления отзыва */}
            <AnimatePresence>
              {showReviewModal && (
                <motion.div
                  className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={(e) => {
                    if (e.target === e.currentTarget) setShowReviewModal(false);
                  }}
                >
                  <motion.div
                    className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl relative"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowReviewModal(false)}
                    >
                      <X size={20} />
                    </button>
                    <h3 className="text-xl font-bold mb-4 text-gray-800">
                      Оставить отзыв
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Оценка
                        </label>
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setNewScore(i + 1)}
                              className="focus:outline-none"
                            >
                              <Star
                                size={24}
                                className={`cursor-pointer ${
                                  i < newScore
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Комментарий
                        </label>
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Поделитесь своим опытом..."
                          rows={4}
                          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
                        ></textarea>
                      </div>
                      <button
                        onClick={handleSubmitReview}
                        disabled={!newComment.trim()}
                        className="bg-color-green hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold w-full disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        Отправить отзыв
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="md:col-span-1">
          <div className="sticky top-24 border rounded-xl p-5 bg-gray-50">
            <h3 className="font-semibold text-lg mb-3 text-gray-800">
              Время работы
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex justify-between">
                <span>Пн-Пт:</span>
                <span>{data.workingHours?.weekdays || "08:00-22:00"}</span>
              </li>
              <li className="flex justify-between">
                <span>Сб-Вс:</span>
                <span>{data.workingHours?.weekend || "10:00-22:00"}</span>
              </li>
            </ul>

            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-3 text-gray-800">
                Контакты
              </h3>
              <ul className="space-y-2">
                {data.phoneNumber && (
                  <li className="text-gray-600">
                    Телефон:{" "}
                    <a
                      href={`tel:${data.phoneNumber}`}
                      className="text-color-blue"
                    >
                      {data.phoneNumber}
                    </a>
                  </li>
                )}
                {data.email && (
                  <li className="text-gray-600">
                    Email:{" "}
                    <a
                      href={`mailto:${data.email}`}
                      className="text-color-blue"
                    >
                      {data.email}
                    </a>
                  </li>
                )}
                {data.website && (
                  <li className="text-gray-600">
                    Сайт:{" "}
                    <a
                      href={data.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-color-blue"
                    >
                      {data.website.replace(/^https?:\/\//, "")}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            <button
              onClick={() => setShowBookingModal(true)}
              className="mt-6 bg-color-blue hover:bg-blue-700 text-white w-full py-3 rounded-lg font-semibold transition-colors"
            >
              Забронировать
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-16 mb-20"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Смотрите также
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendedArenas.map((item) => (
            <motion.div
              key={item.id}
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
