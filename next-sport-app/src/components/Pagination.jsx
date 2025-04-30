// Pagination.jsx
import { motion } from "framer-motion";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <motion.div
      className="mt-10 flex gap-2 justify-center flex-wrap"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      {[...Array(totalPages)].map((_, idx) => (
        <button
          key={idx}
          onClick={() => onPageChange(idx + 1)}
          className={`px-4 py-2 border rounded transition ${
            currentPage === idx + 1
              ? "bg-color-green text-white"
              : "bg-white text-gray-800 hover:bg-gray-100"
          }`}
        >
          {idx + 1}
        </button>
      ))}
    </motion.div>
  );
};

export default Pagination;
