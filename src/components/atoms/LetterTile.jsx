import { motion } from 'framer-motion';

const LetterTile = ({ 
  letter, 
  isUsed = false, 
  isHighlighted = false,
  isDragging = false,
  size = 'md',
  className = '',
  onClick,
  ...props 
}) => {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-lg",
    lg: "w-16 h-16 text-xl",
    xl: "w-20 h-20 text-2xl"
  };
  
  return (
    <motion.div
      className={`
        ${sizes[size]}
        bg-surface border-2 rounded-lg
        flex items-center justify-center
        font-heading font-bold
        cursor-pointer select-none
        transition-all duration-200
        ${isUsed 
          ? 'border-gray-600 text-gray-500 bg-surface-700' 
          : isHighlighted
            ? 'border-accent text-accent glow-accent'
            : isDragging
              ? 'border-primary text-primary glow-primary bg-surface-600 z-50'
              : 'border-surface-400 text-white hover:border-primary hover:glow-primary'
        }
        ${isDragging ? 'shadow-2xl' : ''}
        ${className}
      `}
      whileHover={!isUsed && !isDragging ? { scale: 1.05, y: -2 } : {}}
      whileTap={!isUsed && !isDragging ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        rotateZ: isDragging ? 2 : 0,
        y: isDragging ? -5 : 0
      }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: isDragging ? 0 : Math.random() * 0.2
      }}
      onClick={!isUsed ? onClick : undefined}
      {...props}
    >
      {letter}
    </motion.div>
  );
};

export default LetterTile;