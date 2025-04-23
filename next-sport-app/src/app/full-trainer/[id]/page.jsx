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
import { Star, X } from "lucide-react";

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
  const dispatch = useDispatch();
  const reviews = useSelector(selectReviewsCoach);
  const userData = useSelector((state) => state.auth.data);
  const status = useSelector((state) => state.review.status);

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const { data } = await axios.get(`/api/coaches/${id}`);
        setTrainer(data);
      } catch (err) {
        console.error("Ошибка при загрузке тренера", err);
      } finally {
        setLoading(false);
      }
    };

    console.log(reviews);

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
    }
  };

  const handleBooking = async () => {
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
    }
  };

  const calculateTotalPrice = () => {
    if (!startTime || !endTime || !trainer?.price) return 0;
    const [startHour] = startTime.split(":").map(Number);
    const [endHour] = endTime.split(":").map(Number);
    const hours = endHour - startHour;
    return hours > 0 ? hours * trainer.price : 0;
  };

  if (status == "loading") {
    return <p className="text-center text-gray-500 py-20">Загрузка...</p>;
  }

  if (loading)
    return <p className="text-center text-gray-500 py-20">Загрузка...</p>;

  if (!trainer)
    return <p className="text-center text-red-500 py-20">Тренер не найден</p>;

  return (
    <Wrapper>
      <motion.div
        className="border p-8 rounded-3xl shadow-2xl mt-10 bg-white"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row gap-x-16 gap-y-8 items-start">
          <div className="w-full max-w-sm h-[500px] bg-color-darkGray rounded-2xl overflow-hidden shadow-md">
            <img
              className="h-full w-full object-cover"
              src={
                trainer.photoUrl || "https://placehold.co/600x800?text=Trainer"
              }
              alt={trainer.firstName}
            />
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-extrabold text-gray-900">
                {trainer.firstName} {trainer.lastName}
              </h1>
              {averageRating && (
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-6 h-6 fill-yellow-500" />
                  <span className="text-xl font-bold text-gray-800">
                    {averageRating}
                  </span>
                </div>
              )}
            </div>

            <p className="text-sm text-color-darkGray uppercase tracking-wide">
              {trainer.sportType || "Специализация не указана"}
            </p>

            <div className="flex flex-wrap gap-2">
              {(trainer.title || "").split(",").map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-sm font-semibold bg-color-green text-white"
                >
                  {tag.trim()}
                </span>
              ))}
              <span className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-600">
                Опыт {trainer.experience} лет
              </span>
            </div>

            <div className="w-[600px] p-2">
              <p className="text-base w-[400px] text-gray-700 leading-relaxed">
                {trainer.description || "Описание временно недоступно."}
              </p>
            </div>

            <div className="flex justify-between items-center mt-6">
              <p className="text-xl font-bold text-color-blue">
                от {trainer.price?.toLocaleString("ru-RU")} ₸ / час
              </p>
              <button
                onClick={() => setShowBookingModal(true)}
                className="bg-color-blue hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-semibold"
              >
                Забронировать
              </button>
            </div>
          </div>
        </div>
      </motion.div>

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
                Забронировать тренировку
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Дата
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
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
                  <label className="block text-sm text-gray-600 mb-1">
                    Конец
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="text-sm font-semibold text-gray-700">
                  Итоговая сумма: {calculateTotalPrice().toLocaleString()} ₸
                </div>
                <button
                  onClick={handleBooking}
                  className="bg-color-green hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold w-full"
                >
                  Подтвердить бронь
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        <ReviewsSection
          reviews={reviews}
          onAdd={() => setShowReviewModal(true)}
        />
      </AnimatePresence>

      {showReviewModal && (
        <AddReviewModal
          comment={newComment}
          setComment={setNewComment}
          score={newScore}
          setScore={setNewScore}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleSubmitReview}
        />
      )}
    </Wrapper>
  );
};

export default Page;
