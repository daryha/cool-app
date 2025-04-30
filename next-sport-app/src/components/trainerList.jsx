"use client";

import React, { useState, useEffect, useMemo } from "react";
import { fetchCouch, selectAllCouch } from "../store/slice/couchSlice";
import { useSelector, useDispatch } from "react-redux";
import TrainerCard from "./TrainerCard";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  SortAsc,
  SortDesc,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS_PER_PAGE = 8;

const TrainerList = () => {
  const dispatch = useDispatch();
  const coachList = useSelector(selectAllCouch) || [];
  const status = useSelector((state) => state.couch.status);

  // Состояния UI
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState("default");
  const [showSortOptions, setShowSortOptions] = useState(false);

  // Фильтры
  const [filters, setFilters] = useState({
    priceMin: "",
    priceMax: "",
    experienceMin: "",
    sportTypes: [],
    rating: 0,
  });

  // Список спортивных направлений для фильтра
  const sportTypes = [
    "Футбол",
    "Баскетбол",
    "Теннис",
    "Волейбол",
    "Фитнес",
    "Бокс",
    "Йога",
    "Плавание",
  ];

  // Загрузка данных при монтировании
  useEffect(() => {
    dispatch(fetchCouch());
  }, [dispatch]);

  // Сброс страницы при изменении фильтров, поиска или сортировки
  useEffect(() => {
    setPage(1);
  }, [searchQuery, filters, sortOption]);

  // Функция для обработки изменений фильтров
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Обработка выбора спортивного типа
  const toggleSportType = (type) => {
    setFilters((prev) => {
      const newSportTypes = prev.sportTypes.includes(type)
        ? prev.sportTypes.filter((t) => t !== type)
        : [...prev.sportTypes, type];
      return { ...prev, sportTypes: newSportTypes };
    });
  };

  // Сброс всех фильтров
  const resetFilters = () => {
    setFilters({
      priceMin: "",
      priceMax: "",
      experienceMin: "",
      sportTypes: [],
      rating: 0,
    });
    setSearchQuery("");
    setSortOption("default");
  };

  // Применение фильтров, поиска и сортировки к списку тренеров
  const filteredAndSortedCoaches = useMemo(() => {
    if (!coachList.length) return [];

    // Фильтрация
    let result = coachList.filter((coach) => {
      // По цене
      if (filters.priceMin && coach.price < parseInt(filters.priceMin))
        return false;
      if (filters.priceMax && coach.price > parseInt(filters.priceMax))
        return false;

      // По опыту
      if (
        filters.experienceMin &&
        coach.experience < parseInt(filters.experienceMin)
      )
        return false;

      // По типам спорта
      if (filters.sportTypes.length > 0) {
        if (!coach.sportType) return false;

        const coachSportTypes = coach.sportType
          .split(",")
          .map((type) => type.trim().toLowerCase());
        const hasMatchingType = filters.sportTypes.some((type) =>
          coachSportTypes.includes(type.toLowerCase())
        );
        if (!hasMatchingType) return false;
      }

      // По рейтингу
      if (filters.rating > 0) {
        const coachRating = coach.rating || 0;
        if (coachRating < filters.rating) return false;
      }

      return true;
    });

    // Поиск
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (coach) =>
          (coach.firstName && coach.firstName.toLowerCase().includes(query)) ||
          (coach.lastName && coach.lastName.toLowerCase().includes(query)) ||
          (coach.sportType && coach.sportType.toLowerCase().includes(query)) ||
          (coach.description && coach.description.toLowerCase().includes(query))
      );
    }

    // Сортировка
    switch (sortOption) {
      case "price-asc":
        return [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-desc":
        return [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
      case "experience-desc":
        return [...result].sort(
          (a, b) => (b.experience || 0) - (a.experience || 0)
        );
      case "rating-desc":
        return [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return result;
    }
  }, [coachList, filters, searchQuery, sortOption]);

  // Пагинация
  const totalItems = filteredAndSortedCoaches.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedData = filteredAndSortedCoaches.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Рендер состояний загрузки и ошибок
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-color-green rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">Загрузка списка тренеров...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-red-100 p-3 mb-4">
          <X size={32} className="text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Ошибка загрузки данных
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Произошла ошибка при загрузке списка тренеров. Пожалуйста, попробуйте
          обновить страницу или повторите попытку позже.
        </p>
      </div>
    );
  }

  return (
    <div className="my-8">
      {/* Поисковая строка */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск тренера по имени, направлению или описанию..."
            className="w-full bg-white border border-gray-200 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-color-green shadow-sm"
          />
          <Search
            size={20}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Панель фильтров и сортировки */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition"
          >
            <Filter size={18} />
            <span>Фильтры</span>
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-gray-500">
            {totalItems > 0 ? (
              <span>
                Найдено тренеров:{" "}
                <span className="font-medium text-gray-800">{totalItems}</span>
              </span>
            ) : (
              <span>Тренеры не найдены</span>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowSortOptions(!showSortOptions)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition"
            >
              <SortAsc size={18} />
              <span>Сортировка</span>
            </button>

            {showSortOptions && (
              <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg overflow-hidden z-10 w-56">
                <button
                  className={`flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-50 transition ${
                    sortOption === "default" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => {
                    setSortOption("default");
                    setShowSortOptions(false);
                  }}
                >
                  <span>По умолчанию</span>
                </button>
                <button
                  className={`flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-50 transition ${
                    sortOption === "price-asc" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => {
                    setSortOption("price-asc");
                    setShowSortOptions(false);
                  }}
                >
                  <SortAsc size={16} />
                  <span>По возрастанию цены</span>
                </button>
                <button
                  className={`flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-50 transition ${
                    sortOption === "price-desc" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => {
                    setSortOption("price-desc");
                    setShowSortOptions(false);
                  }}
                >
                  <SortDesc size={16} />
                  <span>По убыванию цены</span>
                </button>
                <button
                  className={`flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-50 transition ${
                    sortOption === "experience-desc" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => {
                    setSortOption("experience-desc");
                    setShowSortOptions(false);
                  }}
                >
                  <SortDesc size={16} />
                  <span>По опыту</span>
                </button>
                <button
                  className={`flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-50 transition ${
                    sortOption === "rating-desc" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => {
                    setSortOption("rating-desc");
                    setShowSortOptions(false);
                  }}
                >
                  <Star size={16} />
                  <span>По рейтингу</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Панель фильтров */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-lg text-gray-800">Фильтры</h3>
                {(filters.priceMin ||
                  filters.priceMax ||
                  filters.experienceMin ||
                  filters.sportTypes.length > 0 ||
                  filters.rating > 0) && (
                  <button
                    onClick={resetFilters}
                    className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <X size={16} />
                    <span>Сбросить все</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Фильтр по цене */}
                <div>
                  <h4 className="font-medium mb-2 text-gray-700">
                    Цена (₸/час)
                  </h4>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      placeholder="От"
                      value={filters.priceMin}
                      onChange={(e) =>
                        handleFilterChange("priceMin", e.target.value)
                      }
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <span>—</span>
                    <input
                      type="number"
                      placeholder="До"
                      value={filters.priceMax}
                      onChange={(e) =>
                        handleFilterChange("priceMax", e.target.value)
                      }
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                </div>

                {/* Фильтр по опыту */}
                <div>
                  <h4 className="font-medium mb-2 text-gray-700">Опыт</h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Минимальный опыт (лет)"
                      value={filters.experienceMin}
                      onChange={(e) =>
                        handleFilterChange("experienceMin", e.target.value)
                      }
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <span className="text-gray-500">лет</span>
                  </div>
                </div>

                {/* Фильтр по рейтингу */}
                <div>
                  <h4 className="font-medium mb-2 text-gray-700">
                    Минимальный рейтинг
                  </h4>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() =>
                          handleFilterChange(
                            "rating",
                            rating === filters.rating ? 0 : rating
                          )
                        }
                        className="p-1"
                      >
                        <Star
                          size={24}
                          className={`${
                            rating <= filters.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Фильтр по спортивным направлениям */}
              <div className="mt-4">
                <h4 className="font-medium mb-2 text-gray-700">
                  Спортивные направления
                </h4>
                <div className="flex flex-wrap gap-2">
                  {sportTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => toggleSportType(type)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.sportTypes.includes(type)
                          ? "bg-color-green text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Список тренеров */}
      <AnimatePresence mode="wait">
        {totalItems > 0 ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {paginatedData.map((coach, index) => (
                <motion.div
                  key={coach.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <TrainerCard {...coach} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="rounded-full bg-gray-100 p-5 mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Тренеры не найдены
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {searchQuery
                ? `По запросу "${searchQuery}" ничего не найдено. Попробуйте изменить параметры поиска.`
                : "Не найдено тренеров, соответствующих заданным фильтрам."}
            </p>
            {(searchQuery ||
              filters.priceMin ||
              filters.priceMax ||
              filters.experienceMin ||
              filters.sportTypes.length > 0 ||
              filters.rating > 0) && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-color-green text-white rounded-lg hover:bg-green-600 transition"
              >
                Сбросить фильтры
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Пагинация */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-2 mt-12 mb-8"
        >
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition flex items-center gap-1"
          >
            <ChevronUp className="rotate-90" size={16} />
            <span>Назад</span>
          </button>

          <div className="flex gap-2 mx-2 items-center">
            {totalPages <= 7 ? (
              // Показываем все страницы, если их не более 7
              Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`min-w-[40px] h-10 rounded-lg transition ${
                    page === i + 1
                      ? "bg-color-green text-white"
                      : "bg-white text-gray-800 border hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))
            ) : (
              // Показываем первую, последнюю и несколько страниц вокруг текущей
              <>
                <button
                  onClick={() => setPage(1)}
                  className={`min-w-[40px] h-10 rounded-lg transition ${
                    page === 1
                      ? "bg-color-green text-white"
                      : "bg-white text-gray-800 border hover:bg-gray-100"
                  }`}
                >
                  1
                </button>

                {page > 3 && <span className="text-gray-500">...</span>}

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(
                    2,
                    Math.min(page - 2 + i, totalPages - 1)
                  );
                  return pageNum <= 1 || pageNum >= totalPages ? null : (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`min-w-[40px] h-10 rounded-lg transition ${
                        page === pageNum
                          ? "bg-color-green text-white"
                          : "bg-white text-gray-800 border hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }).filter(Boolean)}

                {page < totalPages - 2 && (
                  <span className="text-gray-500">...</span>
                )}

                <button
                  onClick={() => setPage(totalPages)}
                  className={`min-w-[40px] h-10 rounded-lg transition ${
                    page === totalPages
                      ? "bg-color-green text-white"
                      : "bg-white text-gray-800 border hover:bg-gray-100"
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition flex items-center gap-1"
          >
            <span>Далее</span>
            <ChevronDown className="rotate-90" size={16} />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default TrainerList;
