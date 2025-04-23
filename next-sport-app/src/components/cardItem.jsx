import { MapPin, Star } from "lucide-react";
import Link from "next/link";

const CardItem = ({ id, imgUrl, title, date, price, address }) => {
  return (
    <>
      <Link href={`/full-arena/${id}`}>
        <div className="flex w-full rounded-2xl shadow-lg overflow-hidden transition border border-color-gray bg-color-white max-w-4xl h-[200px] hover:cursor-pointer hover:shadow-2xl hover:shadow-color-green hover:border-color-green ">
          <div className="relative w-1/3">
            <img
              src={imgUrl}
              alt="Arena"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-2/3 p-5 flex flex-col justify-between ">
            <div>
              <h3 className="text-lg font-bold text-color-darkGray mb-5 h-14">
                {title}
              </h3>

              <div className="flex gap-2 items-center mb-5 ">
                <MapPin size={20} className="text-color-darkGray" />
                <p className="text-sm text-color-darkGray  ">{address}</p>
              </div>

              <div className="flex gap-2 justify-between items-center">
                <span className=" bg-color-green text-white text-sm font-semibold px-3 py-1 rounded ">
                  {price.toLocaleString("ru-RU")} ₸
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default CardItem;
