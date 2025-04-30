// SearchBar.jsx
import { useState } from "react";
import { Search, X } from "lucide-react";

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по названию, адресу или типу спорта..."
          className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-10 focus:outline-none focus:ring-2 focus:ring-color-green focus:border-transparent shadow-sm"
        />
        <Search
          size={20}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
