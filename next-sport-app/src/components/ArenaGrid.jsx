// ArenaGrid.jsx
import { motion, AnimatePresence } from "framer-motion";
import CardItem from "./cardItem";

const ArenaGrid = ({ arenas, currentPage }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentPage}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10"
      >
        {arenas.map((arena, index) => (
          <motion.div
            key={arena.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="h-full"
          >
            <CardItem
              id={arena.id}
              title={arena.name}
              imgUrl={arena.photoUrl}
              address={arena.address}
              price={arena.price}
            />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default ArenaGrid;
