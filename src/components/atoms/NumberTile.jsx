import { motion } from 'framer-motion';

const NumberTile = ({ 
  number, 
  isUsed = false, 
  isSelected = false,
  playerColor = null,
  onClick,
  className = '',
  ...props 
}) => {
  const getBorderColor = () => {
    if (isUsed) return 'border-gray-600';
    if (isSelected && playerColor) {
      return playerColor === '#5B21B6' ? 'border-primary glow-primary' : 'border-secondary glow';
    }
    return 'border-surface-400 hover:border-accent hover:glow-accent';
  };
  
  const getTextColor = () => {
    if (isUsed) return 'text-gray-500';
    if (isSelected && playerColor) {
      return playerColor === '#5B21B6' ? 'text-primary' : 'text-secondary';
    }
    return 'text-white';
  };
  
  return (
    <motion.div
      className={`
        w-16 h-16 bg-surface border-2 rounded-lg
        flex items-center justify-center
        font-heading font-bold text-xl
        cursor-pointer select-none
        transition-all duration-200
        transform perspective-1000
        ${getBorderColor()}
        ${getTextColor()}
        ${isUsed ? 'bg-surface-700 cursor-not-allowed' : 'hover:scale-105'}
        ${className}
      `}
      whileHover={!isUsed ? { 
        scale: 1.05, 
        y: -4,
        boxShadow: "0 8px 25px rgba(0,0,0,0.3)"
      } : {}}
      whileTap={!isUsed ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, rotateX: -90 }}
      animate={{ opacity: 1, rotateX: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: number * 0.05
      }}
      onClick={!isUsed ? onClick : undefined}
      style={{
        transformStyle: 'preserve-3d'
      }}
      {...props}
    >
      <motion.span
        animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {number}
      </motion.span>
    </motion.div>
  );
};

export default NumberTile;