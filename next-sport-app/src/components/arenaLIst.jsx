// ArenaList.jsx - обновленная версия
"use client";

import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchArenas,
  selectAllArenas,
  selectArenasLoading,
  selectArenasError,
} from "./../store/slice/arenaSlice";
import { motion } from "framer-motion";

// Импортируем наши новые компоненты
import ArenaGrid from "./ArenaGrid";
import Pagination from "./Pagination";
import EmptyState from "./EmptyState";
import ArenaListHeader from "./ArenaListHeader";
import FilterPanel from "./FilterPanel";
import SearchBar from "./SearchBar";
import NoResults from "./NoResults";

const ITEMS_PER_PAGE = 9;

const ArenaList = () => {
  const dispatch = useDispatch();
  const allArenas = useSelector(selectAllArenas);
  const loading = useSelector(selectArenasLoading);
  const error = useSelector(selectArenasError);

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    priceMin: "",
    priceMax: "",
    sportTypes: [],
    hasParking: false,
    hasShower: false,
    hasEquipment: false,
  });
  const [sortOption, setSortOption] = useState("default");

  useEffect(() => {
    dispatch(fetchArenas());
  }, [dispatch]);

  // Сброс на первую страницу при изменении фильтров или поиска
  useEffect(() => {
    setPage(1);
  }, [searchQuery, filters, sortOption]);

  // Применяем фильтры, поиск и сортировку
  const filteredAndSortedArenas = useMemo(() => {
    if (!allArenas.length) return [];

    // Сначала применяем фильтры
    let result = allArenas.filter((arena) => {
      // Проверка по цене
      if (filters.priceMin && arena.price < parseInt(filters.priceMin))
        return false;
      if (filters.priceMax && arena.price > parseInt(filters.priceMax))
        return false;

      // Проверка по типам спорта
      if (filters.sportTypes.length > 0) {
        const hasMatchingSportType = filters.sportTypes.some((type) =>
          arena.sportTypes?.includes(type)
        );
        if (!hasMatchingSportType) return false;
      }

      // Проверка по удобствам
      if (filters.hasParking && !arena.hasParking) return false;
      if (filters.hasShower && !arena.hasShower) return false;
      if (filters.hasEquipment && !arena.hasEquipment) return false;

      return true;
    });

    // Затем применяем поиск
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (arena) =>
          arena.name?.toLowerCase().includes(query) ||
          arena.address?.toLowerCase().includes(query) ||
          arena.sportTypes?.some((type) => type.toLowerCase().includes(query))
      );
    }

    // Наконец, сортировка
    switch (sortOption) {
      case "price-asc":
        return [...result].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...result].sort((a, b) => b.price - a.price);
      default:
        return result;
    }
  }, [allArenas, filters, searchQuery, sortOption]);

  // Пагинация
  const paginatedData = filteredAndSortedArenas.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredAndSortedArenas.length / ITEMS_PER_PAGE);

  // Сброс всех фильтров
  const resetFilters = () => {
    setSearchQuery("");
    setFilters({
      priceMin: "",
      priceMax: "",
      sportTypes: [],
      hasParking: false,
      hasShower: false,
      hasEquipment: false,
    });
    setSortOption("default");
  };

  if (loading) {
    return (
      <EmptyState
        type="loading"
        message="Загружаем список спортивных объектов..."
      />
    );
  }

  if (error) {
    return (
      <EmptyState
        type="error"
        message={`Не удалось загрузить данные: ${error}`}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-6"
    >
      <SearchBar onSearch={setSearchQuery} />

      <FilterPanel onFilterChange={setFilters} />

      <ArenaListHeader
        totalCount={filteredAndSortedArenas.length}
        onSortChange={setSortOption}
      />

      {filteredAndSortedArenas.length === 0 ? (
        <NoResults searchQuery={searchQuery} onReset={resetFilters} />
      ) : (
        <>
          <ArenaGrid arenas={paginatedData} currentPage={page} />

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </motion.div>
  );
};

export default ArenaList;
