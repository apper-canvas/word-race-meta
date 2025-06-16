import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const PlayerScore = ({ 
  player, 
  isActive = false, 
  className = ''
}) => {
  const playerColorClass = player.color === '#5B21B6' ? 'from-primary to-purple-700' : 'from-secondary to-pink-600';
  const borderColorClass = player.color === '#5B21B6' ? 'border-primary' : 'border-secondary';
  const glowClass = player.color === '#5B21B6' ? 'glow-primary' : 'glow';
  
  return (
    <motion.div
      className={`
        p-4 rounded-xl border-2 transition-all duration-300
        ${isActive 
          ? `${borderColorClass} ${glowClass} bg-gradient-to-r ${playerColorClass} bg-opacity-10` 
          : 'border-surface-600 bg-surface-800'
        }
        ${className}
      `}
      animate={isActive ? { scale: [1, 1.02, 1] } : { scale: 1 }}
      transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className={`
              w-12 h-12 rounded-full flex items-center justify-center
              bg-gradient-to-r ${playerColorClass}
            `}
            animate={isActive ? { rotate: [0, 5, -5, 0] } : {}}
            transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
          >
            <ApperIcon 
              name={player.color === '#5B21B6' ? 'User' : 'Users'} 
              className="w-6 h-6 text-white" 
            />
          </motion.div>
          
          <div>
            <h3 className="font-heading font-bold text-white text-lg">
              {player.name}
            </h3>
            {isActive && (
              <motion.p
                className="text-accent text-sm font-medium"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Your Turn
              </motion.p>
            )}
          </div>
        </div>
        
        <motion.div
          className="text-right"
          key={player.score}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-3xl font-heading font-bold text-white">
            {player.score}
          </div>
          <div className="text-sm text-gray-400">points</div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PlayerScore;