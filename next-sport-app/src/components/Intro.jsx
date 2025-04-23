import Wrapper from "./Wrapper";
import { ArrowRight, Dumbbell, LandPlot, UserSearch } from "lucide-react";

const features = [
  {
    icon: (
      <LandPlot size={40} strokeWidth={1.4} className="text-color-darkGray" />
    ),
    title: "Арендовать площадку",
  },
  {
    icon: (
      <Dumbbell size={40} strokeWidth={1.4} className="text-color-darkGray" />
    ),
    title: "Записаться в зал",
  },
  {
    icon: (
      <UserSearch size={40} strokeWidth={1.4} className="text-color-darkGray" />
    ),
    title: "Найти тренера",
  },
];

const Intro = () => {
  return (
    <>
      {/* Видео-секция */}
      <section className="relative h-[600px] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover z-[-1]"
          autoPlay
          loop
          muted
          playsInline
          poster="/fallback.jpg"
        >
          <source src="/video/Clipchamp.mp4" type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>

        <div className="absolute inset-0 bg-color-blue bg-opacity-50 z-0"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
          <h1 className="text-5xl font-bold">Занимайтесь спортом</h1>
          <p className="mt-4 text-lg max-w-[600px]">
            Бронируйте площадки, записывайтесь на занятия
          </p>
        </div>
      </section>

      {/* Карточки */}
    </>
  );
};

export default Intro;
