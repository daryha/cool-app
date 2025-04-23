"use client";

import { useState } from "react";
import axios from "../../../../axios";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const CreateCoachPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    photoUrl: "",
    sportType: "",
    title: "",
    experience: 0,
    description: "",
    price: 0,
    phone: "",
    telegram: "",
    whatsApp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/admin/coaches", form);
      setSuccess(true);
      setTimeout(() => router.push("/admin/manage"), 1500);
    } catch (err) {
      setError("Ошибка при создании тренера");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-8 rounded-3xl shadow-2xl"
      >
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          Новый тренер
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Имя"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            />
            <InputField
              label="Фамилия"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
            />
            <InputField
              label="Вид спорта"
              name="sportType"
              value={form.sportType}
              onChange={handleChange}
            />
            <InputField
              label="Должность"
              name="title"
              value={form.title}
              onChange={handleChange}
            />
            <InputField
              label="Фото (URL)"
              name="photoUrl"
              value={form.photoUrl}
              onChange={handleChange}
            />
            <InputField
              label="Стаж (лет)"
              name="experience"
              type="number"
              value={form.experience}
              onChange={handleChange}
            />
            <InputField
              label="Цена (₸/час)"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
            />
            <InputField
              label="Телефон"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
            <InputField
              label="Telegram"
              name="telegram"
              value={form.telegram}
              onChange={handleChange}
            />
            <InputField
              label="WhatsApp"
              name="whatsApp"
              value={form.whatsApp}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Описание
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-color-green shadow-sm"
              rows={5}
              placeholder="Опишите подход тренера, достижения и особенности"
            ></textarea>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && (
            <div className="flex items-center text-green-600 gap-2">
              <Check /> Успешно создано
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-color-green text-white font-bold rounded-xl hover:bg-opacity-90 transition flex items-center justify-center shadow-lg"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Создать"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const InputField = ({ label, name, type = "text", value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-color-green shadow-sm"
      placeholder={label}
    />
  </div>
);

export default CreateCoachPage;
