import { motion } from 'framer-motion';
import NumberTile from '@/components/atoms/NumberTile';

const NumberGrid = ({ 
  usedNumbers = [], 
  selectedNumber = null,
  currentPlayerColor = null,
  onNumberSelect,
  className = ''
}) => {
  const numbers = Array.from({ length: 20 }, (_, i) => i + 1);
  
  return (
    <motion.div
      className={`grid grid-cols-5 gap-3 p-6 bg-surface-800 rounded-xl border border-surface-600 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="col-span-5 mb-4">
        <h2 className="text-xl font-heading text-white mb-2">Choose a Number</h2>
        <p className="text-sm text-gray-400">
          Each number contains a unique set of letters
        </p>
      </div>
      
      {numbers.map((number, index) => (
        <motion.div
          key={number}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            delay: index * 0.03,
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
        >
          <NumberTile
            number={number}
            isUsed={usedNumbers.includes(number)}
            isSelected={selectedNumber === number}
            playerColor={selectedNumber === number ? currentPlayerColor : null}
            onClick={() => onNumberSelect?.(number)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default NumberGrid;