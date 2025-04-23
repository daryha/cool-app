import { Star } from "lucide-react";

const Stars = ({ score }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < score ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ))}
  </div>
);

const ReviewCard = ({ userName, comment, score, createdAt }) => (
  <article className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-100 hover:shadow-xl transition-shadow duration-200">
    {/* header */}
    <header className="flex items-center justify-between mb-3">
      <h3 className="font-semibold text-gray-800">{userName}</h3>
      <Stars score={score} />
    </header>

    {/* text */}
    <p className="text-gray-700 leading-relaxed">{comment}</p>

    {/* footer */}
    <footer className="mt-4 text-xs text-gray-400">
      {new Date(createdAt).toLocaleDateString("ru-RU")}
    </footer>
  </article>
);

export default ReviewCard;
