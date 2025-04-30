"use client";

import React, { useState } from "react";
import axios from "../../../../axios";
import { useRouter } from "next/navigation";
import {
  Check,
  Loader2,
  X,
  Camera,
  Home,
  DollarSign,
  Users,
  Ruler,
  ShowerHead,
  Car,
  Lightbulb,
  Package,
  Award,
  Layout,
} from "lucide-react";

const SPORT_OPTIONS = [
  { id: "football", name: "Футбольный", icon: "⚽" },
  { id: "basketball", name: "Баскетбольный", icon: "🏀" },
  { id: "volleyball", name: "Волейбольный", icon: "🏐" },
  { id: "tennis", name: "Теннисный", icon: "🎾" },
];

const FACILITY_FEATURES = [
  { id: "hasLockerRooms", name: "Раздевалки", icon: <Layout size={18} /> },
  { id: "hasStands", name: "Трибуны", icon: <Users size={18} /> },
  { id: "hasShower", name: "Душевые", icon: <ShowerHead size={18} /> },
  { id: "hasLighting", name: "Освещение", icon: <Lightbulb size={18} /> },
  { id: "hasParking", name: "Парковка", icon: <Car size={18} /> },
  { id: "hasEquipment", name: "Инвентарь", icon: <Package size={18} /> },
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
  const [activeTab, setActiveTab] = useState("basic");

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

  const isValidForm =
    form.name && form.address && form.price > 0 && form.sportTypes.length > 0;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Создать новый спортзал
            </h1>
            <p className="text-gray-500">
              Заполните форму для добавления нового спортивного объекта
            </p>
          </div>
          <button
            onClick={() => router.push("/admin/manage")}
            className="mt-4 sm:mt-0 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
          >
            <X size={16} /> Отмена
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("basic")}
              className={`flex-1 py-3 px-4 font-medium text-center transition-colors ${
                activeTab === "basic"
                  ? "border-b-2 border-green-500 text-green-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Основная информация
            </button>
            <button
              onClick={() => setActiveTab("specs")}
              className={`flex-1 py-3 px-4 font-medium text-center transition-colors ${
                activeTab === "specs"
                  ? "border-b-2 border-green-500 text-green-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Характеристики
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {activeTab === "basic" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2 md:col-span-1">
                    <InputField
                      label="Название"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      icon={<Award size={18} className="text-gray-400" />}
                    />
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <InputField
                      label="Адрес"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      icon={<Home size={18} className="text-gray-400" />}
                    />
                  </div>

                  <div className="col-span-2">
                    <InputField
                      label="Фото (URL)"
                      name="photoUrl"
                      value={form.photoUrl}
                      onChange={handleChange}
                      icon={<Camera size={18} className="text-gray-400" />}
                    />

                    {form.photoUrl && (
                      <div className="mt-2 relative w-full h-36 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={form.photoUrl}
                          alt="Предпросмотр"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/300x150?text=Ошибка+загрузки";
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <InputField
                      label="Цена (₸/час)"
                      name="price"
                      type="number"
                      value={form.price}
                      onChange={handleChange}
                      required
                      icon={<DollarSign size={18} className="text-gray-400" />}
                    />
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <InputField
                      label="Тип покрытия"
                      name="surfaceType"
                      value={form.surfaceType}
                      onChange={handleChange}
                      icon={<Ruler size={18} className="text-gray-400" />}
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-3 font-medium text-gray-700">
                    Виды спорта <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {SPORT_OPTIONS.map((sport) => (
                      <button
                        key={sport.id}
                        type="button"
                        onClick={() => toggleSportType(sport.name)}
                        className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                          form.sportTypes.includes(sport.name)
                            ? "bg-green-100 text-green-700 border border-green-300 shadow-sm"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <span>{sport.icon}</span>
                        <span>{sport.name}</span>
                        {form.sportTypes.includes(sport.name) && (
                          <Check size={16} className="text-green-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Описание
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
                    placeholder="Опишите ваш спортзал..."
                  />
                </div>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InputField
                    label="Вместимость (человек)"
                    name="capacity"
                    type="number"
                    value={form.capacity}
                    onChange={handleChange}
                    icon={<Users size={18} className="text-gray-400" />}
                  />
                  <InputField
                    label="Длина (м)"
                    name="length"
                    type="number"
                    value={form.length}
                    onChange={handleChange}
                    icon={<Ruler size={18} className="text-gray-400" />}
                  />
                  <InputField
                    label="Ширина (м)"
                    name="width"
                    type="number"
                    value={form.width}
                    onChange={handleChange}
                    icon={<Ruler size={18} className="text-gray-400" />}
                  />
                  <InputField
                    label="Высота (м)"
                    name="height"
                    type="number"
                    value={form.height}
                    onChange={handleChange}
                    icon={<Ruler size={18} className="text-gray-400" />}
                  />
                </div>

                <div>
                  <label className="block mb-3 font-medium text-gray-700">
                    Особенности и удобства
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                    {FACILITY_FEATURES.map((feature) => (
                      <label
                        key={feature.id}
                        className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          name={feature.id}
                          checked={form[feature.id]}
                          onChange={handleChange}
                          className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">{feature.icon}</span>
                          <span className="font-medium text-gray-700">
                            {feature.name}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 border-t pt-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                  <X size={18} className="text-red-500" />
                  <p>{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
                  <Check size={18} className="text-green-500" />
                  <p>Площадка успешно создана! Перенаправление...</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                {activeTab === "specs" && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("basic")}
                    className="py-3 px-6 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Назад
                  </button>
                )}

                {activeTab === "basic" ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab("specs")}
                    className="py-3 px-6 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors font-medium w-full sm:w-auto"
                  >
                    Далее
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !isValidForm}
                    className={`py-3 px-8 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-colors w-full sm:w-auto ${
                      loading || !isValidForm
                        ? "bg-green-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Создание...</span>
                      </>
                    ) : (
                      <span>Создать объект</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
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
  icon = null,
}) => (
  <div>
    <label className="block mb-2 font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all ${
          icon ? "pl-10" : "pl-4"
        } py-3`}
        placeholder={label}
      />
    </div>
  </div>
);
