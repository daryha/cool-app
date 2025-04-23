/* components/ReviewsSection.jsx */
import ReviewCard from "./ReviewCard";
import { Star } from "lucide-react";

const ReviewsSection = ({ reviews, onAdd }) => {
  const avg =
    reviews.length > 0
      ? (
          reviews.reduce((s, r) => s + (r.score || 0), 0) / reviews.length
        ).toFixed(1)
      : null;

  return (
    <section id="reviews" className="mt-12">
      {/* section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Отзывы</h2>
          {avg && (
            <span className="flex items-center gap-0.5 text-yellow-500">
              <Star className="w-5 h-5 fill-yellow-500" />
              <span className="font-semibold">{avg}</span>
            </span>
          )}
          <span className="text-gray-400 text-sm">({reviews.length})</span>
        </div>

        <button
          onClick={onAdd}
          className="px-5 py-2 rounded-xl text-sm font-semibold bg-color-green text-white hover:bg-green-600 transition-colors"
        >
          Оставить отзыв
        </button>
      </div>

      {/* grid of cards */}
      {reviews.length === 0 ? (
        <p className="text-gray-500">Отзывов пока нет. Будь первым! 😎</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <ReviewCard key={r.id} {...r} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;
