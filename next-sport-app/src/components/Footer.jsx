import { Mail, Phone } from "lucide-react";
import Wrapper from "./Wrapper";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <div className="w-full h-[165px] bg-color-green mt-20">
        <Wrapper className="pt-14 text-color-white">
          <div className="flex justify-between">
            <div className="flex gap-5">
              <Link href={'/arena-list'}>
                <p>Забронировать объект</p>
              </Link>
            </div>
            <div className="flex gap-5">
              <div className="flex gap-1 items-center">
                <Mail size={20} />
                <p> Email@Danik.kz</p>
              </div>
              <div className="flex gap-1 items-center">
                <Phone size={20} />
                <p>+7 (777) 777-77-77</p>
              </div>
            </div>
          </div>
          <div className="mt-10 text-center">
            <p>© 2025 – 2025 sportsBooking.com</p>
          </div>
        </Wrapper>
      </div>
    </>
  );
};

export default Footer;
