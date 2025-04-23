"use client"; // делаем компонент клиентским для использования состояния и эффектов

import { useState } from "react";

export default function FullArena({ params }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [error, setError] = useState("");

  const handleBooking = (event) => {
    event.preventDefault();
    if (!selectedDate || !selectedTime) {
      setError("Пожалуйста, выберите дату и время.");
      return;
    }
    setError("");
    alert(
      `Бронь оформлена: ${arenaData.name}, ${selectedDate} в ${selectedTime}`
    );
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{arenaData.name}</h1>
      <p className="text-gray-600">{arenaData.address}</p>
      <p className="text-gray-700 mt-2 mb-4">{arenaData.description}</p>
      <div className="mb-4 flex space-x-4">
        <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
          {arenaData.surfaceType}
        </span>
        <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
          {arenaData.price}
        </span>
      </div>
      <div className="mb-6">
        <h2 className="font-semibold">Удобства:</h2>
        <ul className="flex space-x-4 mt-1">
          <li className="text-gray-600 text-sm">💡 {arenaData.amenities[0]}</li>
          <li className="text-gray-600 text-sm">🅿️ {arenaData.amenities[1]}</li>
          <li className="text-gray-600 text-sm">🚿 {arenaData.amenities[2]}</li>
        </ul>
      </div>

      <form onSubmit={handleBooking} className="space-y-4">
        <div>
          <label htmlFor="date" className="block font-medium mb-1">
            Дата:
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="time" className="block font-medium mb-1">
            Время:
          </label>
          <select
            id="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="">Выберите время</option>
            <option value="08:00">08:00</option>
            <option value="10:00">10:00</option>
            <option value="12:00">12:00</option>
            <option value="14:00">14:00</option>
            <option value="16:00">16:00</option>
            <option value="18:00">18:00</option>
            <option value="20:00">20:00</option>
          </select>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
          disabled={!selectedDate || !selectedTime}
        >
          Забронировать
        </button>
      </form>
    </div>
  );
}
