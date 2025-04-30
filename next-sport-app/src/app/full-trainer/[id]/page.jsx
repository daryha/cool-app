"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "../../../axios";
import Wrapper from "../../../components/Wrapper";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReviewsCoach,
  selectReviewsCoach,
} from "../../../store/slice/reviewSlice";
import {
  Star,
  X,
  Award,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ChevronDown,
  Instagram,
  Facebook,
  Dumbbell,
  Users,
  Shield,
  CheckCircle,
} from "lucide-react";

import ReviewsSection from "../../../components/ReviewsSection";
import AddReviewModal from "../../../components/AddReviewModal";

const Page = () => {
  const { id } = useParams();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newScore, setNewScore] = useState(5);
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [activeTab, setActiveTab] = useState("about");
  const [expandedSections, setExpandedSections] = useState({});

  const dispatch = useDispatch();
  const reviews = useSelector(selectReviewsCoach);
  const userData = useSelector((state) => state.auth.data);
  const status = useSelector((state) => state.review.status);

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/coaches/${id}`);
        setTrainer(data);
      } catch (err) {
        console.error("Ошибка при загрузке тренера", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTrainer();
  }, [id]);

  useEffect(() => {
    if (id) dispatch(fetchReviewsCoach(id));
  }, [id, dispatch]);

  const averageRating = reviews?.length
    ? (
        reviews.reduce((sum, r) => sum + (r.score || 0), 0) / reviews.length
      ).toFixed(1)
    : null;

  const handleSubmitReview = async () => {
    if (!userData) {
      alert("Пожалуйста, авторизуйтесь для отправки отзыва");
      return;
    }

    if (!newComment.trim()) {
      alert("Пожалуйста, добавьте комментарий к вашему отзыву");
      return;
    }

    try {
      await axios.post(`/api/review/coach/${id}`, {
        userId: userData.id,
        coachId: id,
        score: newScore,
        comment: newComment,
      });
      setShowReviewModal(false);
      setNewComment("");
      setNewScore(5);
      dispatch(fetchReviewsCoach(id));
    } catch (err) {
      console.error("Ошибка при отправке отзыва", err);
      alert("Не удалось отправить отзыв. Пожалуйста, попробуйте позже.");
    }
  };

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
      await axios.post("/api/booking/coach", {
        coachId: id,
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
      alert("Не удалось оформить бронирование. Пожалуйста, попробуйте позже.");
    }
  };

  const calculateTotalPrice = () => {
    if (!startTime || !endTime || !trainer?.price) return 0;
    const [startHour] = startTime.split(":").map(Number);
    const [endHour] = endTime.split(":").map(Number);
    const hours = endHour - startHour;
    return hours > 0 ? hours * trainer.price : 0;
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (loading || status === "loading") {
    return (
      <Wrapper>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-gray-200 h-24 w-24 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </Wrapper>
    );
  }

  if (!trainer) {
    return (
      <Wrapper>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="text-red-500 text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Тренер не найден
          </h2>
          <p className="text-gray-600 mb-6">
            Информация о запрашиваемом тренере отсутствует в нашей базе данных
          </p>
          <Link
            href="/trainers"
            className="bg-color-blue hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-semibold transition-colors"
          >
            Вернуться к списку тренеров
          </Link>
        </div>
      </Wrapper>
    );
  }

  // Определяем основные данные тренера
  const trainerTags = (trainer.title || "")
    .split(",")
    .filter((tag) => tag.trim() !== "");
  const achievements = (trainer.achievements || "")
    .split(",")
    .filter((ach) => ach.trim() !== "");
  const specializations = (
    trainer.specializations || "Общая физическая подготовка"
  )
    .split(",")
    .filter((spec) => spec.trim() !== "");

  return (
    <Wrapper>
      <motion.div
        className="mt-10 mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Основная информация о тренере */}
        <motion.div
          className="bg-white border rounded-3xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            {/* Фоновый баннер */}
            <div className="h-48 bg-gradient-to-r from-color-blue to-color-green"></div>

            {/* Аватар и основная информация */}
            <div className="px-8 pb-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Аватар */}
                <div className="rounded-2xl overflow-hidden h-48 w-48 -mt-24 border-4 border-white shadow-lg">
                  <img
                    className="h-full w-full object-cover"
                    src={
                      trainer.photoUrl ||
                      "https://placehold.co/400x400?text=Тренер"
                    }
                    alt={`${trainer.firstName} ${trainer.lastName}`}
                  />
                </div>

                {/* Имя, рейтинг и основная информация */}
                <div className="flex-1 pt-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">
                        {trainer.firstName} {trainer.lastName}
                      </h1>
                      <p className="text-gray-600 font-medium">
                        {trainer.sportType || "Персональный тренер"}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      {averageRating && (
                        <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={18}
                                className={
                                  star <= Math.round(averageRating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }
                              />
                            ))}
                          </div>
                          <span className="font-bold text-gray-800 ml-1">
                            {averageRating}
                          </span>
                          <span className="text-gray-500 text-sm">
                            ({reviews?.length || 0})
                          </span>
                        </div>
                      )}

                      <button
                        onClick={() => setShowBookingModal(true)}
                        className="bg-color-blue hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-semibold transition-colors"
                      >
                        Забронировать
                      </button>
                    </div>
                  </div>

                  {/* Теги и опыт */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {trainerTags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm font-medium bg-color-green/10 text-color-green"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 flex items-center gap-1">
                      <Clock size={14} />
                      Опыт {trainer.experience} лет
                    </span>
                  </div>

                  {/* Короткая информация */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {trainer.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={18} className="text-gray-400" />
                        <a
                          href={`tel:${trainer.phone}`}
                          className="text-color-blue hover:underline"
                        >
                          {trainer.phone}
                        </a>
                      </div>
                    )}
                    {trainer.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={18} className="text-gray-400" />
                        <a
                          href={`mailto:${trainer.email}`}
                          className="text-color-blue hover:underline"
                        >
                          {trainer.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Вкладки с информацией */}
          <div className="border-t">
            <div className="px-8">
              <div className="flex space-x-6 overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setActiveTab("about")}
                  className={`py-4 font-medium border-b-2 transition-colors ${
                    activeTab === "about"
                      ? "border-color-blue text-color-blue"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  О тренере
                </button>
                <button
                  onClick={() => setActiveTab("achievements")}
                  className={`py-4 font-medium border-b-2 transition-colors ${
                    activeTab === "achievements"
                      ? "border-color-blue text-color-blue"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Достижения
                </button>
                <button
                  onClick={() => setActiveTab("schedule")}
                  className={`py-4 font-medium border-b-2 transition-colors ${
                    activeTab === "schedule"
                      ? "border-color-blue text-color-blue"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Расписание
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`py-4 font-medium border-b-2 transition-colors ${
                    activeTab === "reviews"
                      ? "border-color-blue text-color-blue"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Отзывы
                </button>
              </div>
            </div>

            {/* Содержимое вкладок */}
            <div className="p-8">
              {/* О тренере */}
              {activeTab === "about" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        Обо мне
                      </h3>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {trainer.description || "Описание временно недоступно."}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        Специализация
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {specializations.map((spec, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle
                              size={16}
                              className="text-color-green"
                            />
                            <span className="text-gray-700">{spec.trim()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {achievements.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">
                          Основные достижения
                        </h3>
                        <div className="space-y-2">
                          {achievements.slice(0, 3).map((ach, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <Award size={16} className="text-color-blue" />
                              <span className="text-gray-700">
                                {ach.trim()}
                              </span>
                            </div>
                          ))}
                          {achievements.length > 3 && (
                            <button
                              className="text-color-blue hover:underline text-sm font-medium mt-2"
                              onClick={() => setActiveTab("achievements")}
                            >
                              Показать все достижения
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="border rounded-xl p-6 bg-gray-50">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Информация о тренере
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex justify-between">
                          <span className="text-gray-500">Стоимость:</span>
                          <span className="font-medium">
                            {trainer.price?.toLocaleString("ru-RU")} ₸ / час
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-500">Опыт работы:</span>
                          <span className="font-medium">
                            {trainer.experience} лет
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-500">Направление:</span>
                          <span className="font-medium">
                            {trainer.sportType || "Не указано"}
                          </span>
                        </li>

                        <li className="flex justify-between">
                          <span className="text-gray-500">Сертификаты:</span>
                          <span className="font-medium">
                            {trainer.certificates ? "Есть" : "Нет"}
                          </span>
                        </li>
                      </ul>
                      <button
                        onClick={() => setShowBookingModal(true)}
                        className="w-full mt-6 bg-color-green hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                      >
                        Записаться на тренировку
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Достижения */}
              {activeTab === "achievements" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Достижения и сертификаты
                  </h3>

                  {achievements.length > 0 ? (
                    <div className="space-y-4">
                      {achievements.map((ach, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-4 border rounded-lg"
                        >
                          <Award size={20} className="text-color-blue mt-1" />
                          <div>
                            <p className="text-gray-700">{ach.trim()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      Информация о достижениях пока не добавлена.
                    </p>
                  )}

                  {/* Сертификаты */}
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      Образование и лицензии
                    </h3>
                    <div className="space-y-4">
                      {trainer.education && (
                        <div className="flex items-start gap-3 p-4 border rounded-lg">
                          <Shield size={20} className="text-gray-600 mt-1" />
                          <div>
                            <h4 className="font-medium">Образование</h4>
                            <p className="text-gray-700">{trainer.education}</p>
                          </div>
                        </div>
                      )}

                      {trainer.certificates && (
                        <div className="flex items-start gap-3 p-4 border rounded-lg">
                          <Shield size={20} className="text-color-green mt-1" />
                          <div>
                            <h4 className="font-medium">Сертификаты</h4>
                            <p className="text-gray-700">
                              {trainer.certificates}
                            </p>
                          </div>
                        </div>
                      )}

                      {!trainer.education && !trainer.certificates && (
                        <p className="text-gray-500">
                          Информация об образовании и лицензиях пока не
                          добавлена.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Расписание */}
              {activeTab === "schedule" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Расписание и запись
                    </h3>
                    <button
                      onClick={() => setShowBookingModal(true)}
                      className="bg-color-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                    >
                      <Calendar size={16} />
                      Забронировать
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 border">
                    <p className="text-gray-600 mb-4">
                      Для бронирования занятия с тренером, нажмите на кнопку
                      "Забронировать" и выберите удобные для вас дату и время.
                    </p>

                    <div className="mt-6">
                      <h4 className="font-medium text-gray-800 mb-2">
                        Рабочие часы:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex justify-between p-3 border rounded bg-white">
                          <span className="text-gray-600">
                            Понедельник - Пятница:
                          </span>
                          <span className="font-medium">
                            {trainer.workingHours?.weekdays || "08:00 - 20:00"}
                          </span>
                        </div>
                        <div className="flex justify-between p-3 border rounded bg-white">
                          <span className="text-gray-600">Суббота:</span>
                          <span className="font-medium">
                            {trainer.workingHours?.saturday || "10:00 - 18:00"}
                          </span>
                        </div>
                        <div className="flex justify-between p-3 border rounded bg-white">
                          <span className="text-gray-600">Воскресенье:</span>
                          <span className="font-medium">
                            {trainer.workingHours?.sunday || "Выходной"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium text-gray-800 mb-2">
                        Продолжительность тренировок:
                      </h4>
                      <div className="p-3 border rounded bg-white">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Стандартная тренировка:
                          </span>
                          <span className="font-medium">60 минут</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Отзывы */}
              {activeTab === "reviews" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Отзывы клиентов
                    </h3>
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="text-color-blue hover:underline text-sm font-medium flex items-center gap-1"
                    >
                      <Star size={16} />
                      Оставить отзыв
                    </button>
                  </div>

                  {reviews && reviews.length > 0 ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <div className="text-4xl font-bold text-gray-800 mb-1">
                            {averageRating}
                          </div>
                          <div className="flex justify-center mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={18}
                                className={
                                  star <= Math.round(averageRating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }
                              />
                            ))}
                          </div>
                          <div className="text-gray-500 text-sm">
                            {reviews.length} отзывов
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <div className="space-y-1">
                            {[5, 4, 3, 2, 1].map((rating) => {
                              const count = reviews.filter(
                                (r) => Math.round(r.score) === rating
                              ).length;
                              const percentage =
                                reviews.length > 0
                                  ? Math.round((count / reviews.length) * 100)
                                  : 0;

                              return (
                                <div
                                  key={rating}
                                  className="flex items-center gap-2"
                                >
                                  <div className="w-12 text-gray-600 text-sm">
                                    {rating} звезд
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-color-blue h-2 rounded-full"
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                  <div className="w-8 text-gray-600 text-sm">
                                    {percentage}%
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {reviews.map((review, idx) => (
                          <div
                            key={idx}
                            className="border rounded-lg p-4 bg-white"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center mb-2">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                                  {review.userName?.charAt(0) || "У"}
                                </div>
                                <div className="ml-3">
                                  <div className="font-medium">
                                    {review.userName || "Пользователь"}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {new Date(
                                      review.createdAt
                                    ).toLocaleDateString("ru-RU")}
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
                            <p className="text-gray-600 mt-2">
                              {review.comment}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 border rounded-lg bg-gray-50">
                      <div className="text-4xl mb-3">🤔</div>
                      <h4 className="text-lg font-medium text-gray-800 mb-2">
                        Пока нет отзывов
                      </h4>
                      <p className="text-gray-600 mb-4">
                        Будьте первым, кто оставит отзыв о тренере
                      </p>
                      <button
                        onClick={() => setShowReviewModal(true)}
                        className="bg-color-blue hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-semibold transition-colors"
                      >
                        Оставить отзыв
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Модальное окно для бронирования */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowBookingModal(false);
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
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowBookingModal(false)}
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Забронировать тренировку
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
                    <span className="text-gray-600">Стоимость тренировки:</span>
                    <span>{trainer.price?.toLocaleString("ru-RU")} ₸/час</span>
                  </div>
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>Итого:</span>
                    <span className="text-color-blue">
                      {calculateTotalPrice().toLocaleString("ru-RU")} ₸
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

      {/* Модальное окно для отзыва */}
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
    </Wrapper>
  );
};

export default Page;
