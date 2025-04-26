"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CardItem from "./cardItem";
import Search from "./SearchParam";
import {
  fetchArenas,
  selectAllArenas,
  selectArenasLoading,
  selectArenasError,
} from "./../store/slice/arenaSlice";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS_PER_PAGE = 10;

const  ArenaList = () => {
  const dispatch = useDispatch();
  const arenas = useSelector(selectAllArenas);
  const loading = useSelector(selectArenasLoading);
  const error = useSelector(selectArenasError);

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchArenas());
  }, [dispatch]);

  const totalPages = Math.ceil(arenas.length / ITEMS_PER_PAGE);
  const paginatedData = arenas.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (loading)
    return <div className="text-center text-gray-500">Загрузка...</div>;
  if (error)
    return <div className="text-center text-red-500">Ошибка: {error}</div>;

  return (
    <>
      <div className="mt-10">
        <section className="mt-10">
          <motion.h1
            className="mb-10 text-2xl font-bold text-gray-800 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Количество найденных площадок — {arenas.length}
          </motion.h1>

          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-10"
            >
              {paginatedData.map((arena, index) => (
                <motion.div
                  key={arena.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <CardItem
                    id={arena.id}
                    title={arena.name}
                    imgUrl={arena.photoUrl}
                    address={arena.address}
                    price={arena.price}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex gap-2 justify-center">
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setPage(idx + 1)}
                className={`px-4 py-2 border rounded transition ${
                  page === idx + 1
                    ? "bg-color-green text-white"
                    : "bg-white text-gray-800 hover:bg-gray-100"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default ArenaList;
