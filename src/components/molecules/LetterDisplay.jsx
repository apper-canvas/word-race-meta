import { motion, AnimatePresence } from 'framer-motion';
import LetterTile from '@/components/atoms/LetterTile';

const LetterDisplay = ({ 
  letters = [], 
  usedLetters = [], 
  className = '',
  onLetterClick
}) => {
  const getLetterCount = (letter) => {
    return letters.filter(l => l === letter).length;
  };
  
  const getUsedCount = (letter) => {
    return usedLetters.filter(l => l === letter).length;
  };
  
  const isLetterUsed = (letter, index) => {
    const letterCount = getLetterCount(letter);
    const usedCount = getUsedCount(letter);
    const currentLetterIndex = letters.slice(0, index + 1).filter(l => l === letter).length;
    return currentLetterIndex <= usedCount;
  };
  
  return (
    <motion.div
      className={`p-6 bg-surface-800 rounded-xl border border-surface-600 ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="mb-4">
        <h2 className="text-xl font-heading text-white mb-2">Available Letters</h2>
        <p className="text-sm text-gray-400">
          Click letters to help form your word ({letters.length} letters total)
        </p>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={letters.join('')}
          className="flex flex-wrap gap-3 justify-center min-h-[80px] items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {letters.length > 0 ? (
            letters.map((letter, index) => (
              <motion.div
                key={`${letter}-${index}`}
                initial={{ opacity: 0, y: -20, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
                className="animate-bounce-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <LetterTile
                  letter={letter}
                  isUsed={isLetterUsed(letter, index)}
                  size="lg"
                  onClick={() => onLetterClick?.(letter, index)}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              className="text-center text-gray-400 py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-lg">Select a number to reveal letters</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default LetterDisplay;