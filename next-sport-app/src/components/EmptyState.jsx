// EmptyState.jsx
import { motion } from "framer-motion";
import { SearchX, AlertCircle, Loader } from "lucide-react";

const EmptyState = ({ type, message }) => {
  const getIcon = () => {
    switch (type) {
      case "loading":
        return <Loader size={48} className="text-gray-400 animate-spin" />;
      case "error":
        return <AlertCircle size={48} className="text-red-500" />;
      case "empty":
      default:
        return <SearchX size={48} className="text-gray-400" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case "loading":
        return "Загрузка...";
      case "error":
        return "Произошла ошибка";
      case "empty":
      default:
        return "Ничего не найдено";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="mb-4">{getIcon()}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{getTitle()}</h3>
      <p className="text-gray-500 max-w-md mx-auto">{message}</p>
    </motion.div>
  );
};

export default EmptyState;
