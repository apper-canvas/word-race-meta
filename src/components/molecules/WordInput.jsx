import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const WordInput = ({ 
  availableLetters = [],
  onSubmit,
  onWordChange,
  disabled = false,
  placeholder = "Type your word...",
  className = ''
}) => {
  const [currentWord, setCurrentWord] = useState('');
  const [shake, setShake] = useState(false);
  
  useEffect(() => {
    if (onWordChange) {
      onWordChange(currentWord);
    }
  }, [currentWord, onWordChange]);
  
  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setCurrentWord(value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentWord.length >= 3) {
      onSubmit?.(currentWord);
      setCurrentWord('');
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };
  
  const canFormWord = (word) => {
    const wordLetters = word.split('');
    const letterCounts = {};
    
    // Count available letters
    availableLetters.forEach(letter => {
      letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    });
    
    // Check if word can be formed
    const usedLetters = {};
    for (const letter of wordLetters) {
      usedLetters[letter] = (usedLetters[letter] || 0) + 1;
      if (usedLetters[letter] > (letterCounts[letter] || 0)) {
        return false;
      }
    }
    
    return true;
  };
  
  const isValidLength = currentWord.length >= 3;
  const isValidWord = canFormWord(currentWord);
  const canSubmit = isValidLength && isValidWord && !disabled;
  
  return (
    <motion.div
      className={`p-6 bg-surface-800 rounded-xl border border-surface-600 ${className}`}
      animate={shake ? { x: [-2, 2, -2, 2, 0] } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4">
        <h2 className="text-xl font-heading text-white mb-2">Form Your Word</h2>
        <p className="text-sm text-gray-400">
          Minimum 3 letters • Use only available letters
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <motion.input
            type="text"
            value={currentWord}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full px-4 py-3 bg-surface-700 border-2 rounded-lg
              text-white font-heading font-bold text-xl text-center
              placeholder-gray-500 focus:outline-none transition-all duration-200
              ${!currentWord ? 'border-surface-600' :
                !isValidLength ? 'border-warning text-warning' :
                !isValidWord ? 'border-error text-error animate-shake' :
                'border-success text-success'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            maxLength={15}
            whileFocus={{ scale: 1.02 }}
          />
          
          {currentWord && (
            <motion.div
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <ApperIcon
                name={
                  !isValidLength ? 'AlertCircle' :
                  !isValidWord ? 'X' :
                  'Check'
                }
                className={`w-6 h-6 ${
                  !isValidLength ? 'text-warning' :
                  !isValidWord ? 'text-error' :
                  'text-success'
                }`}
              />
            </motion.div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Length: {currentWord.length}
            {currentWord.length > 0 && (
              <span className={`ml-2 ${
                !isValidLength ? 'text-warning' :
                !isValidWord ? 'text-error' :
                'text-success'
              }`}>
                {!isValidLength ? 'Too short' :
                 !isValidWord ? 'Invalid letters' :
                 'Valid!'}
              </span>
            )}
          </div>
          
          <Button
            type="submit"
            variant="accent"
            disabled={!canSubmit}
            className="min-w-[120px]"
          >
            <ApperIcon name="Send" size={16} />
            Submit Word
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default WordInput;