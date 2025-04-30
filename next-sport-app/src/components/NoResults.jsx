// NoResults.jsx
import { motion } from "framer-motion";
import { SearchX } from "lucide-react";

const NoResults = ({ searchQuery, onReset }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="rounded-full bg-gray-100 p-5 mb-4">
        <SearchX size={40} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Объекты не найдены
      </h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6">
        {searchQuery
          ? `По запросу "${searchQuery}" ничего не найдено. Попробуйте изменить параметры поиска.`
          : "Не найдено спортивных объектов, соответствующих заданным фильтрам."}
      </p>
      <button
        onClick={onReset}
        className="px-4 py-2 bg-color-green text-white rounded-lg hover:bg-green-600 transition"
      >
        Сбросить фильтры
      </button>
    </motion.div>
  );
};

export default NoResults;
