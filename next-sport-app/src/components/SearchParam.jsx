import { Search, SlidersHorizontal } from "lucide-react";
import Button from "../ui/button";

const SearchParam = () => {
  return (
    <>
      <div className="flex justify-between items-center mt-10 mb-14 ">
        <div className="relative">
          <input
            type="text"
            placeholder="Найти площадку"
            className=" w-96 p-2  outline-none rounded-lg border border-color-gray   focus:border-color-green  "
          />
          <Search
            className="absolute top-2 right-5 text-color-green"
            strokeWidth={2}
            size={20}
          />
        </div>
        <div className="flex items-center gap-2 ">
          <SlidersHorizontal className="text-color-green" />
          <Button text={"Фильтры"}></Button>
        </div>
      </div>
    </>
  );
};

export default SearchParam;
