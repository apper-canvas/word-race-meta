import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const GameResults = ({ 
  game, 
  onNewGame, 
  onRestart,
  className = ''
}) => {
  const sortedPlayers = [...game.players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];
  const isWinner = winner.score > sortedPlayers[1].score;
  const isTie = winner.score === sortedPlayers[1].score;
  
  const getPlayerIcon = (player) => {
    return player.color === '#5B21B6' ? 'User' : 'Users';
  };
  
  const getPlayerGradient = (player) => {
    return player.color === '#5B21B6' 
      ? 'from-primary to-purple-700' 
      : 'from-secondary to-pink-600';
  };
  
  return (
    <motion.div
      className={`max-w-2xl mx-auto p-8 ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Victory Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {isTie ? (
          <>
            <motion.div
              className="text-6xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🤝
            </motion.div>
            <h1 className="text-4xl font-heading font-bold text-accent mb-2">
              It's a Tie!
            </h1>
            <p className="text-lg text-gray-400">
              Both players scored {winner.score} points
            </p>
          </>
        ) : (
          <>
            <motion.div
              className="text-6xl mb-4"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🏆
            </motion.div>
            <h1 className="text-4xl font-heading font-bold text-accent mb-2">
              Game Over!
            </h1>
            <p className="text-lg text-gray-400">
              {winner.name} wins with {winner.score} points!
            </p>
          </>
        )}
      </motion.div>
      
      {/* Final Scores */}
      <motion.div
        className="space-y-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {sortedPlayers.map((player, index) => (
          <motion.div
            key={player.id}
            className={`
              p-6 rounded-xl border-2 transition-all duration-300
              ${index === 0 && !isTie
                ? `border-accent bg-gradient-to-r ${getPlayerGradient(player)} bg-opacity-20 glow-accent`
                : 'border-surface-600 bg-surface-800'
              }
            `}
            initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <motion.div
                    className={`
                      w-16 h-16 rounded-full flex items-center justify-center
                      bg-gradient-to-r ${getPlayerGradient(player)}
                    `}
                    animate={index === 0 && !isTie ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 2, repeat: index === 0 && !isTie ? Infinity : 0 }}
                  >
                    <ApperIcon 
                      name={getPlayerIcon(player)} 
                      className="w-8 h-8 text-white" 
                    />
                  </motion.div>
                  
                  {index === 0 && !isTie && (
                    <motion.div
                      className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      <ApperIcon name="Crown" className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-heading font-bold text-white text-xl">
                    {player.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-sm">
                      #{index + 1} Place
                    </span>
                    {index === 0 && !isTie && (
                      <motion.span
                        className="text-accent text-sm font-bold"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        WINNER
                      </motion.span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <motion.div
                  className="text-4xl font-heading font-bold text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
                >
                  {player.score}
                </motion.div>
                <div className="text-sm text-gray-400">points</div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Game Stats */}
      <motion.div
        className="bg-surface-800 rounded-xl border border-surface-600 p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="font-heading font-bold text-white mb-4 flex items-center gap-2">
          <ApperIcon name="BarChart3" className="w-5 h-5" />
          Game Statistics
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-heading font-bold text-accent">
              {game.usedNumbers?.length || 20}
            </div>
            <div className="text-sm text-gray-400">Puzzles Played</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-heading font-bold text-primary">
              {Math.max(...game.players.map(p => p.score))}
            </div>
            <div className="text-sm text-gray-400">High Score</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-heading font-bold text-secondary">
              {Math.abs(game.players[0].score - game.players[1].score)}
            </div>
            <div className="text-sm text-gray-400">Point Gap</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-heading font-bold text-success">
              {game.players.reduce((sum, p) => sum + p.score, 0)}
            </div>
            <div className="text-sm text-gray-400">Total Points</div>
          </div>
        </div>
      </motion.div>
      
      {/* Action Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          variant="accent"
          size="lg"
          onClick={onNewGame}
          className="flex-1"
        >
          <ApperIcon name="Plus" size={20} />
          New Game
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={onRestart}
          className="flex-1"
        >
          <ApperIcon name="RotateCcw" size={20} />
          Rematch
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default GameResults;