"use client";

import { useState } from "react";
import axios from "../../../../axios";
import { useRouter } from "next/navigation";
import {
  Check,
  Loader2,
  User,
  Mail,
  Phone,
  Award,
  Dumbbell,
  Clock,
  DollarSign,
  Camera,
  MessageCircle,
  FileText,
  X,
  ArrowLeft,
  Save,
} from "lucide-react";
import { motion } from "framer-motion";

const SPORT_TYPES = [
  { value: "football", label: "Футбол" },
  { value: "basketball", label: "Баскетбол" },
  { value: "volleyball", label: "Волейбол" },
  { value: "tennis", label: "Теннис" },
  { value: "swimming", label: "Плавание" },
  { value: "fitness", label: "Фитнес" },
  { value: "yoga", label: "Йога" },
  { value: "boxing", label: "Бокс" },
];

const CreateCoachPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("personal");

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
    achievements: "",
    specializations: [],
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let finalValue = value;

    if (type === "number") {
      finalValue = value === "" ? 0 : parseFloat(value);
    }

    setForm((prev) => ({ ...prev, [name]: finalValue }));
    setError("");
  };

  const toggleSpecialization = (spec) => {
    setForm((prev) => {
      const exists = prev.specializations.includes(spec);
      if (exists) {
        return {
          ...prev,
          specializations: prev.specializations.filter((s) => s !== spec),
        };
      } else {
        return {
          ...prev,
          specializations: [...prev.specializations, spec],
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.firstName || !form.lastName || !form.sportType) {
      setError(
        "Пожалуйста, заполните обязательные поля (имя, фамилия, вид спорта)"
      );
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/admin/coaches", form);
      setSuccess(true);
      setTimeout(() => router.push("/admin/manage"), 1500);
    } catch (err) {
      console.error(err);
      setError(
        "Ошибка при создании тренера. Пожалуйста, проверьте введенные данные."
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = form.firstName && form.lastName && form.sportType;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -5 }}
            onClick={() => router.push("/admin/manage")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Назад к управлению</span>
          </motion.button>
          <h1 className="text-3xl font-bold text-gray-800">Новый тренер</h1>
          <div className="w-24"></div> {/* Пустой блок для выравнивания */}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Табы */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("personal")}
              className={`flex-1 py-4 px-6 font-medium text-center transition-colors ${
                activeTab === "personal"
                  ? "border-b-2 border-color-green text-color-green"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Личная информация
            </button>
            <button
              onClick={() => setActiveTab("professional")}
              className={`flex-1 py-4 px-6 font-medium text-center transition-colors ${
                activeTab === "professional"
                  ? "border-b-2 border-color-green text-color-green"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Профессиональная информация
            </button>
            <button
              onClick={() => setActiveTab("contacts")}
              className={`flex-1 py-4 px-6 font-medium text-center transition-colors ${
                activeTab === "contacts"
                  ? "border-b-2 border-color-green text-color-green"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Контакты
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {/* Личная информация */}
            {activeTab === "personal" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Имя"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    icon={<User size={18} className="text-gray-400" />}
                  />
                  <InputField
                    label="Фамилия"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    icon={<User size={18} className="text-gray-400" />}
                  />
                </div>

                <div>
                  <InputField
                    label="Фото (URL)"
                    name="photoUrl"
                    value={form.photoUrl}
                    onChange={handleChange}
                    icon={<Camera size={18} className="text-gray-400" />}
                  />

                  {form.photoUrl && (
                    <div className="mt-4 flex justify-center">
                      <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-color-green border-opacity-20">
                        <img
                          src={form.photoUrl}
                          alt="Предпросмотр"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/150x150?text=Фото+тренера";
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveTab("professional")}
                    className="px-6 py-3 bg-color-green text-white font-medium rounded-xl hover:bg-opacity-90 transition-colors shadow-sm"
                  >
                    Далее
                  </button>
                </div>
              </motion.div>
            )}

            {/* Профессиональная информация */}
            {activeTab === "professional" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Вид спорта <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Dumbbell size={18} className="text-gray-400" />
                      </div>
                      <select
                        name="sportType"
                        value={form.sportType}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-color-green shadow-sm"
                        required
                      >
                        <option value="">Выберите вид спорта</option>
                        {SPORT_TYPES.map((sport) => (
                          <option key={sport.value} value={sport.label}>
                            {sport.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <InputField
                    label="Должность"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    icon={<Award size={18} className="text-gray-400" />}
                    placeholder="Например: Главный тренер"
                  />

                  <InputField
                    label="Стаж (лет)"
                    name="experience"
                    type="number"
                    value={form.experience}
                    onChange={handleChange}
                    icon={<Clock size={18} className="text-gray-400" />}
                  />

                  <InputField
                    label="Цена (₸/час)"
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    icon={<DollarSign size={18} className="text-gray-400" />}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Специализации
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {[
                      "Персональные тренировки",
                      "Групповые занятия",
                      "Детский тренер",
                      "Реабилитация",
                      "Силовой тренинг",
                      "Кардио",
                      "Профессиональный спорт",
                    ].map((spec) => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => toggleSpecialization(spec)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          form.specializations.includes(spec)
                            ? "bg-color-green text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Описание
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 text-gray-400">
                      <FileText size={18} />
                    </div>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-color-green shadow-sm"
                      rows={5}
                      placeholder="Опишите подход тренера, методики и особенности"
                    ></textarea>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Достижения
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 text-gray-400">
                      <Award size={18} />
                    </div>
                    <textarea
                      name="achievements"
                      value={form.achievements}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-color-green shadow-sm"
                      rows={3}
                      placeholder="Награды, сертификаты, спортивные результаты"
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveTab("personal")}
                    className="px-6 py-3 text-gray-600 bg-gray-100 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Назад
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("contacts")}
                    className="px-6 py-3 bg-color-green text-white font-medium rounded-xl hover:bg-opacity-90 transition-colors shadow-sm"
                  >
                    Далее
                  </button>
                </div>
              </motion.div>
            )}

            {/* Контакты */}
            {activeTab === "contacts" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Телефон"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    icon={<Phone size={18} className="text-gray-400" />}
                    placeholder="+7 (XXX) XXX-XX-XX"
                  />

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telegram
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 bg-gray-100 text-gray-500 border border-r-0 border-gray-300 rounded-l-xl">
                        @
                      </span>
                      <input
                        type="text"
                        name="telegram"
                        value={form.telegram}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-r-xl px-4 py-3 focus:ring-2 focus:ring-color-green shadow-sm"
                        placeholder="username"
                      />
                    </div>
                  </div>

                  <InputField
                    label="WhatsApp"
                    name="whatsApp"
                    value={form.whatsApp}
                    onChange={handleChange}
                    icon={<MessageCircle size={18} className="text-gray-400" />}
                    placeholder="+7XXXXXXXXXX"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center gap-2">
                    <X size={18} />
                    <p>{error}</p>
                  </div>
                )}

                {success && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 flex items-center gap-2">
                    <Check size={18} />
                    <p>Тренер успешно создан! Перенаправление...</p>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab("professional")}
                    className="px-6 py-3 text-gray-600 bg-gray-100 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Назад
                  </button>

                  <button
                    type="submit"
                    disabled={loading || !isFormValid}
                    className={`px-6 py-3 font-medium rounded-xl shadow-md flex items-center gap-2 ${
                      loading || !isFormValid
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-color-green text-white hover:bg-opacity-90"
                    } transition-colors`}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Создание...</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        <span>Сохранить тренера</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </form>
        </motion.div>

        {/* Предпросмотр карточки тренера */}
        {form.firstName && form.lastName && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-10"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Предпросмотр карточки тренера
            </h2>
            <div className="bg-white p-6 rounded-2xl shadow-md flex">
              <div className="w-24 h-24 rounded-full overflow-hidden mr-6 shrink-0">
                <img
                  src={
                    form.photoUrl ||
                    "https://via.placeholder.com/100x100?text=Тренер"
                  }
                  alt={`${form.firstName} ${form.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{`${form.firstName} ${form.lastName}`}</h3>
                <p className="text-color-green font-medium">
                  {form.title || form.sportType}
                </p>
                {form.experience > 0 && (
                  <p className="text-gray-600 text-sm mt-1">
                    Опыт: {form.experience} лет
                  </p>
                )}
                {form.price > 0 && (
                  <p className="text-gray-800 font-semibold mt-2">
                    {form.price.toLocaleString()} ₸/час
                  </p>
                )}
                {form.specializations.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {form.specializations.slice(0, 3).map((spec) => (
                      <span
                        key={spec}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                    {form.specializations.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{form.specializations.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  icon = null,
  placeholder = "",
  required = false,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
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
        className={`w-full border border-gray-300 rounded-xl ${
          icon ? "pl-10" : "pl-4"
        } px-4 py-3 focus:ring-2 focus:ring-color-green shadow-sm`}
        placeholder={placeholder || label}
        required={required}
      />
    </div>
  </div>
);

export default CreateCoachPage;
