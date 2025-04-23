"use client";

import React, { useState } from "react";
import { fetchCouch, selectAllCouch } from "../store/slice/couchSlice";
import { useSelector, useDispatch } from "react-redux";
import Search from "./SearchParam";
import TrainerCard from "./TrainerCard";

const ITEMS_PER_PAGE = 8;

const TrainerList = () => {
  const dispatch = useDispatch();
  const coachList = useSelector(selectAllCouch) || [];
  const status = useSelector((state) => state.couch.status);

  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(coachList.length / ITEMS_PER_PAGE);
  const paginatedData = coachList.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  React.useEffect(() => {
    dispatch(fetchCouch());
  }, [dispatch]);

  if (status === "loading") {
    return <p className="text-center mt-10 text-gray-500">Загрузка...</p>;
  }

  if (status === "error") {
    return (
      <p className="text-center mt-10 text-red-500">Ошибка загрузки данных</p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 mt-10 ">
        {paginatedData.length > 0 ? (
          paginatedData.map((coach) => (
            <TrainerCard key={coach.id} {...coach} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400">
            Тренеров пока нет
          </p>
        )}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-20 mb-20">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Назад
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => {
                setPage(i + 1);
              }}
              className={`px-4 py-2 rounded ${
                page === i + 1
                  ? "bg-color-green text-white"
                  : "bg-white text-gray-800 border"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Далее
          </button>
        </div>
      )}
    </>
  );
};

export default TrainerList;
