import { motion } from "framer-motion";
import { X, Star } from "lucide-react";

const StarsInput = ({ value, onChange }) => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }).map((_, i) => {
      const filled = i < value;
      return (
        <Star
          key={i}
          size={24}
          onClick={() => onChange(i + 1)}
          className={`cursor-pointer transition-transform ${
            filled
              ? "fill-yellow-400 text-yellow-400 scale-110"
              : "text-gray-300 hover:scale-110"
          }`}
        />
      );
    })}
  </div>
);

const AddReviewModal = ({
  comment,
  setComment,
  score,
  setScore,
  onClose,
  onSubmit,
}) => (
  <motion.div
    className="fixed inset-0 z-50 flex items-center justify-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {/* fancy overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/70 backdrop-blur-sm" />

    {/* glass‑card */}
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="relative w-full max-w-md rounded-3xl bg-white/10 p-8 backdrop-blur-xl
                 ring-1 ring-white/20 shadow-2xl"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-300 hover:text-gray-100"
      >
        <X size={22} />
      </button>

      <h3 className="mb-6 text-center text-2xl font-bold text-white">
        Ваш отзыв
      </h3>

      {/* rating */}
      <div className="mb-6 flex justify-center">
        <StarsInput value={score} onChange={setScore} />
      </div>

      {/* textarea */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Поделитесь впечатлениями…"
        className="h-28 w-full resize-none rounded-xl border-0 bg-white/20 p-4
                   text-sm text-white placeholder-gray-200 focus:ring-2
                   focus:ring-color-blue focus:outline-none"
      />

      {/* submit */}
      <button
        onClick={onSubmit}
        className="mt-6 w-full rounded-xl bg-color-green px-6 py-3 font-semibold
                   text-white transition-colors hover:bg-opacity-50"
      >
        Отправить 
      </button>
    </motion.div>
  </motion.div>
);

export default AddReviewModal;
