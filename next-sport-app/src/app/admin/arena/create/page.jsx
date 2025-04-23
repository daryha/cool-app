"use client";

import React, { useState } from "react";
import axios from "../../../../axios";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";

const SPORT_OPTIONS = [
  "Футбольный",
  "Баскетбольный",
  "Волейбольный",
  "Теннисный",
];

export default function CreateFacilityPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    photoUrl: "",
    address: "",
    description: "",
    price: 0,
    surfaceType: "",
    capacity: 0,
    length: 0,
    width: 0,
    height: 0,
    hasLockerRooms: false,
    hasStands: false,
    hasShower: false,
    hasLighting: false,
    hasParking: false,
    hasEquipment: false,
    sportTypes: [],
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val;
    if (type === "checkbox") {
      val = checked;
    } else if (type === "number") {
      val = parseFloat(value) || 0;
    } else {
      val = value;
    }
    setForm((prev) => ({ ...prev, [name]: val }));
    setError("");
  };

  const toggleSportType = (type) => {
    setForm((prev) => {
      const exists = prev.sportTypes.includes(type);
      const next = exists
        ? prev.sportTypes.filter((t) => t !== type)
        : [...prev.sportTypes, type];
      return { ...prev, sportTypes: next };
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.address ||
      form.price <= 0 ||
      form.sportTypes.length === 0
    ) {
      setError(
        "Заполните название, адрес, цену и выберите хотя бы один вид спорта."
      );
      return;
    }

    console.log("Отправляем форму:", form);
    setLoading(true);
    try {
      const { data } = await axios.post("/api/admin/facilities", form);
      console.log("Ответ сервера:", data);
      setSuccess(true);
      setTimeout(() => router.push("/admin/manage"), 1200);
    } catch (e) {
      console.error(e);
      const msg = e.response?.data?.message || "Не удалось создать площадку.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Создать новый спортзал</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-xl shadow-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Название"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <InputField
            label="Адрес"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
          />
          <InputField
            label="Фото (URL)"
            name="photoUrl"
            value={form.photoUrl}
            onChange={handleChange}
          />
          <InputField
            label="Тип покрытия"
            name="surfaceType"
            value={form.surfaceType}
            onChange={handleChange}
          />
          <InputField
            label="Цена (₸/час)"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
          />
          <InputField
            label="Вместимость"
            name="capacity"
            type="number"
            value={form.capacity}
            onChange={handleChange}
          />
          <InputField
            label="Длина (м)"
            name="length"
            type="number"
            value={form.length}
            onChange={handleChange}
          />
          <InputField
            label="Ширина (м)"
            name="width"
            type="number"
            value={form.width}
            onChange={handleChange}
          />
          <InputField
            label="Высота (м)"
            name="height"
            type="number"
            value={form.height}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            ["hasLockerRooms", "Раздевалки"],
            ["hasStands", "Трибуны"],
            ["hasShower", "Душевые"],
            ["hasLighting", "Освещение"],
            ["hasParking", "Парковка"],
            ["hasEquipment", "Инвентарь"],
          ].map(([name, label]) => (
            <label key={name} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name={name}
                checked={form[name]}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 border-gray-300 rounded"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <div>
          <label className="block mb-1 font-medium">Описание</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400"
            placeholder="Опишите ваш спортзал"
          />
        </div>

        <div>
          <p className="mb-2 font-medium">Виды спорта (обязательно):</p>
          <div className="flex flex-wrap gap-4">
            {SPORT_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => toggleSportType(opt)}
                className={`px-3 py-1 rounded-full border transition ${
                  form.sportTypes.includes(opt)
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {success && (
          <div className="flex items-center text-green-600 gap-2">
            <Check /> Площадка успешно создана!
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition ${
            loading
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? <Loader2 className="animate-spin mr-2" /> : "Создать"}
        </button>
      </form>
    </div>
  );
}

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
}) => (
  <div>
    <label className="block mb-1 font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400"
      placeholder={label}
    />
  </div>
);
