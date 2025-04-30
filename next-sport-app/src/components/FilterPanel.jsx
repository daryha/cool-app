// FilterPanel.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Filter, ChevronDown, X } from "lucide-react";

const FilterPanel = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceMin: "",
    priceMax: "",
    sportTypes: [],
    hasParking: false,
    hasShower: false,
    hasEquipment: false,
  });

  const sportTypeOptions = [
    "Футбол",
    "Баскетбол",
    "Волейбол",
    "Теннис",
    "Хоккей",
    "Бадминтон",
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleSportTypeToggle = (type) => {
    setFilters((prev) => {
      let newSportTypes;
      if (prev.sportTypes.includes(type)) {
        newSportTypes = prev.sportTypes.filter((t) => t !== type);
      } else {
        newSportTypes = [...prev.sportTypes, type];
      }

      const newFilters = { ...prev, sportTypes: newSportTypes };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const resetFilters = () => {
    const resetValues = {
      priceMin: "",
      priceMax: "",
      sportTypes: [],
      hasParking: false,
      hasShower: false,
      hasEquipment: false,
    };
    setFilters(resetValues);
    onFilterChange(resetValues);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-gray-700 font-medium"
        >
          <Filter size={20} />
          <span>Фильтры</span>
          <ChevronDown
            size={18}
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {(filters.priceMin ||
          filters.priceMax ||
          filters.sportTypes.length > 0 ||
          filters.hasParking ||
          filters.hasShower ||
          filters.hasEquipment) && (
          <button
            onClick={resetFilters}
            className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
          >
            <X size={16} />
            <span>Сбросить все</span>
          </button>
        )}
      </div>

      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white border rounded-lg mt-4 p-6 shadow-sm overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-3 text-gray-700">Цена (₸/час)</h3>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="От"
                  value={filters.priceMin}
                  onChange={(e) =>
                    handleFilterChange("priceMin", e.target.value)
                  }
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <span>—</span>
                <input
                  type="number"
                  placeholder="До"
                  value={filters.priceMax}
                  onChange={(e) =>
                    handleFilterChange("priceMax", e.target.value)
                  }
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 text-gray-700">Виды спорта</h3>
              <div className="flex flex-wrap gap-2">
                {sportTypeOptions.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleSportTypeToggle(type)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filters.sportTypes.includes(type)
                        ? "bg-color-green text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 text-gray-700">Удобства</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasParking}
                    onChange={(e) =>
                      handleFilterChange("hasParking", e.target.checked)
                    }
                    className="w-4 h-4 rounded text-color-green focus:ring-color-green"
                  />
                  <span>Парковка</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasShower}
                    onChange={(e) =>
                      handleFilterChange("hasShower", e.target.checked)
                    }
                    className="w-4 h-4 rounded text-color-green focus:ring-color-green"
                  />
                  <span>Душевые</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasEquipment}
                    onChange={(e) =>
                      handleFilterChange("hasEquipment", e.target.checked)
                    }
                    className="w-4 h-4 rounded text-color-green focus:ring-color-green"
                  />
                  <span>Спортивный инвентарь</span>
                </label>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FilterPanel;
