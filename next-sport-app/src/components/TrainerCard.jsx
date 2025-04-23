"use client";

import Link from "next/link";

const TrainerCard = ({
  id,
  description,
  experience,
  firstName,
  lastName,
  photoUrl,
  price,
  sportType,
}) => {
  return (
    <div className="w-[280px] max-w-xs bg-color-white rounded-2xl shadow-md overflow-hidden  border border-gray-200 hover:shadow-xl transition">
      <div className="w-full h-56 overflow-hidden">
        <img
          src={photoUrl || "https://placehold.co/400x300?text=Тренер"}
          alt={`${firstName} ${lastName}`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="px-4 py-5  flex-col  ">
        <div className="mb-10">
          <h3 className="text-xl font-bold text-color-darkGray mb-2">
            {firstName} {lastName}
          </h3>
          <p className="text-sm text-gray-600 mb-3  h-[40px] line-clamp-3">
            {description}
          </p>

          <div className="flex flex-wrap gap-2 text-xs mb-4">
            {sportType &&
              sportType.split(",").map((type, index) => (
                <span
                  key={index}
                  className="bg-color-green text-white px-2 py-1 rounded-lg"
                >
                  {type.trim()}
                </span>
              ))}

            <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-lg">
              Опыт {experience} лет
            </span>
          </div>
        </div>

        <div className="mt-2 flex justify-between items-center">
          <span className="text-gray-700 items-center flex gap-4">
            от
            <span className="text-color-blue text-xl  font-semibold">
              {price?.toLocaleString()} ₸
            </span>
          </span>
          <Link href={`/full-trainer/${id}`}>
            <button className="bg-color-blue text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-color-green transition">
              Записаться
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrainerCard;
