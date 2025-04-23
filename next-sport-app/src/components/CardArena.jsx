import Link from "next/link";

const CardArena = ({ id, photo, title, date, price, address }) => {
  return (
    <Link href={`full-arena/${id}`}>
      <div className="w-[270px] rounded-2xl overflow-hidden shadow-lg bg-color-white border border-color-gray">
        <div className="relative">
          <img className="w-full h-48 object-cover" src={photo} alt={title} />
        </div>

        <div className="p-4">
          <h3 className="text-lg font-bold text-color-darkGray mb-5">
            {title}
          </h3>

          <div className="text-sm text-color-darkGray mb-2 ">
            <strong>{date}</strong>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-color-blue font-bold text-lg">
              {price.toLocaleString()} ₸
            </span>
          </div>

          <div className="text-sm text-color-black">{address}</div>
        </div>
      </div>
    </Link>
  );
};

export default CardArena;
