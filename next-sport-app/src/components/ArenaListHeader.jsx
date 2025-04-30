// ArenaListHeader.jsx
import { motion } from "framer-motion";
import { Filter, SortAsc, SortDesc } from "lucide-react";
import { useState } from "react";

const ArenaListHeader = ({ totalCount, onSortChange }) => {
  const [showSortOptions, setShowSortOptions] = useState(false);

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Найдено спортивных объектов:{" "}
          <span className="text-color-green">{totalCount}</span>
        </h1>

        <div className="relative">
          <button
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition px-4 py-2 rounded-lg text-gray-700"
            onClick={() => setShowSortOptions(!showSortOptions)}
          >
            <Filter size={18} />
            <span>Сортировка</span>
          </button>

          {showSortOptions && (
            <motion.div
              className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg overflow-hidden z-10 w-56"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button
                className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-gray-50 transition border-b"
                onClick={() => {
                  onSortChange("price-asc");
                  setShowSortOptions(false);
                }}
              >
                <SortAsc size={16} />
                <span>Цена: по возрастанию</span>
              </button>
              <button
                className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-gray-50 transition"
                onClick={() => {
                  onSortChange("price-desc");
                  setShowSortOptions(false);
                }}
              >
                <SortDesc size={16} />
                <span>Цена: по убыванию</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <div className="h-1 w-24 bg-color-green my-4"></div>
    </motion.div>
  );
};

export default ArenaListHeader;
