import Link from "next/link";
import Button from "../ui/button";
import Wrapper from "./Wrapper";

const Banner = () => {
  return (
    <>
      <section>
        <div className="bg-[url(https://findsport.ru/images/pages/siteHome/home-targets/background.jpg)] bg-cover bg-center bg-no-repeat bg-pos h-[420px] flex items-center">
          <Wrapper className="flex gap-[400px]">
            <div className="flex flex-col gap-20 ">
              <h2 className="text-5xl  text-color-white">
                Возможности <br /> для клубов
              </h2>
              <Link href={"/trainer-list"}>
                <Button text={"Нанять тренера"} className="border-0"></Button>
              </Link>
            </div>

            <div className="text-color-white grid grid-cols-2 gap-4  relative items-center  ">
              <div className="before:content-[''] before:absolute before:-top-2 before:w-10 before:h-1 before:bg-color-green">
                <p className="text-lg ">
                  Привлечение клиентов на аренду площадки
                </p>
              </div>
              <div className="before:content-[''] before:absolute before:-top-2 before:w-10 before:h-1 before:bg-color-green">
                <p className="text-lg ">
                  Привлечение клиентов на аренду площадки
                </p>
              </div>
              <div className="before:content-[''] before:absolute before:bottom-28 before:w-10 before:h-1 before:bg-color-green">
                <p className="text-lg ">
                  Привлечение клиентов на аренду площадки
                </p>
              </div>
              <div className="before:content-[''] before:absolute before:bottom-28 before:w-10 before:h-1 before:bg-color-green">
                <p className="text-lg ">
                  Привлечение клиентов на аренду площадки
                </p>
              </div>
            </div>
          </Wrapper>
        </div>
      </section>
    </>
  );
};

export default Banner;
