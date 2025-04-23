"use client";

import React, { useRef, useState, useCallback } from "react";
import { Calendar, Clock } from "lucide-react";
import axios from "../axios";

export default function BookingBar({ facilityId, userId }) {
  const dateRef = useRef(null);
  const startRef = useRef(null);
  const endRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleBooking = useCallback(async () => {
    const date = dateRef.current.value;
    const startTime = startRef.current.value;
    const endTime = endRef.current.value;

    if (!date || !startTime || !endTime) {
      setErrorMsg("Пожалуйста, выберите дату и время бронирования.");
      return;
    }

    setErrorMsg("");
    setLoading(true);
    try {
      await axios.post("/api/booking", {
        userId,
        sportFacilityId: facilityId,
        bookingDate: date,
        startTime,
        endTime,
      });
      dateRef.current.value = "";
      startRef.current.value = "";
      endRef.current.value = "";
      alert("✅ Бронирование успешно создано!");
    } catch (e) {
      console.error(e);
      setErrorMsg("Ошибка при бронировании. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }, [facilityId, userId]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-color-white  border-t-8 border-color-green  e shadow-xl p-6 z-50">
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-gray-600" />
          <input
            ref={dateRef}
            type="date"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-gray-600" />
          <input
            ref={startRef}
            type="time"
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <span className="text-gray-500">—</span>
          <input
            ref={endRef}
            type="time"
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <button
          onClick={handleBooking}
          disabled={loading}
          className={`w-full sm:w-auto bg-color-green hover:bg-opacity-90 text-white font-semibold py-2 px-6 rounded-md transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Бронирование..." : "Забронировать"}
        </button>

        {errorMsg && (
          <div className="sm:col-span-3 text-center text-red-600 mt-2">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}
