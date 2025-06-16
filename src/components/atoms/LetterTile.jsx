import { motion } from 'framer-motion';

const LetterTile = ({ 
  letter, 
  isUsed = false, 
  isHighlighted = false,
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
            : 'border-surface-400 text-white hover:border-primary hover:glow-primary'
        }
        ${className}
      `}
      whileHover={!isUsed ? { scale: 1.05, y: -2 } : {}}
      whileTap={!isUsed ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: Math.random() * 0.2
      }}
      onClick={!isUsed ? onClick : undefined}
      {...props}
    >
      {letter}
    </motion.div>
  );
};

export default LetterTile;