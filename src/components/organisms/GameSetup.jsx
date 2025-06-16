import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const GameSetup = ({ onGameStart, className = '' }) => {
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');
  const [gameMode, setGameMode] = useState('two-player'); // two-player, single-player
  
  const handleStartGame = () => {
    if (!player1Name.trim() || !player2Name.trim()) {
      toast.error('Please enter names for both players');
      return;
    }
    
    if (player1Name.trim() === player2Name.trim()) {
      toast.error('Players must have different names');
      return;
    }
    
    const gameData = {
      players: [
        {
          id: 'p1',
          name: player1Name.trim(),
          score: 0,
          color: '#5B21B6'
        },
        {
          id: 'p2',
          name: player2Name.trim(),
          score: 0,
          color: '#EC4899'
        }
      ],
      gameMode
    };
    
    onGameStart(gameData);
  };
  
  return (
    <motion.div
      className={`max-w-2xl mx-auto p-8 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
          Word Race
        </h1>
        <p className="text-lg text-gray-400 max-w-md mx-auto">
          Compete to form the best words from scrambled letters in 30 seconds!
        </p>
      </motion.div>
      
      {/* Game Setup Form */}
      <motion.div
        className="bg-surface-800 rounded-xl border border-surface-600 p-6 space-y-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div>
          <h2 className="text-2xl font-heading text-white mb-4">Setup Game</h2>
          
          {/* Game Mode Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Game Mode
            </label>
            <div className="grid grid-cols-1 gap-3">
              <motion.button
                className={`
                  p-4 rounded-lg border-2 text-left transition-all duration-200
                  ${gameMode === 'two-player'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-surface-600 text-gray-300 hover:border-surface-400'
                  }
                `}
                onClick={() => setGameMode('two-player')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <ApperIcon name="Users" className="w-6 h-6" />
                  <div>
                    <div className="font-heading font-bold">Two Players</div>
                    <div className="text-sm opacity-75">
                      Take turns competing against each other
                    </div>
                  </div>
                </div>
              </motion.button>
            </div>
          </div>
          
          {/* Player Names */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Player 1 Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={player1Name}
                  onChange={(e) => setPlayer1Name(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-700 border-2 border-surface-600 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="Enter name..."
                  maxLength={20}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 bg-primary rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Player 2 Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={player2Name}
                  onChange={(e) => setPlayer2Name(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-700 border-2 border-surface-600 rounded-lg text-white focus:outline-none focus:border-secondary transition-colors"
                  placeholder="Enter name..."
                  maxLength={20}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 bg-secondary rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Game Rules */}
          <div className="bg-surface-700 rounded-lg p-4 mb-6">
            <h3 className="font-heading font-bold text-white mb-2 flex items-center gap-2">
              <ApperIcon name="BookOpen" className="w-5 h-5" />
              How to Play
            </h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Players take turns selecting numbers 1-20</li>
              <li>• Each number reveals a unique set of 8-15 letters</li>
              <li>• Form the best word possible in 30 seconds</li>
              <li>• Longer words earn more points (bonus for 6+ letters)</li>
              <li>• Game ends when all numbers are used</li>
            </ul>
          </div>
          
          {/* Start Button */}
          <Button
            variant="accent"
            size="lg"
            onClick={handleStartGame}
            className="w-full"
          >
            <ApperIcon name="Play" size={20} />
            Start Game
          </Button>
        </div>
      </motion.div>
      
      {/* Features Preview */}
      <motion.div
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {[
          { icon: 'Timer', title: '30-Second Rounds', desc: 'Fast-paced gameplay' },
          { icon: 'Award', title: 'Score System', desc: 'Points for word length' },
          { icon: 'Shuffle', title: '20 Puzzles', desc: 'Unique letter sets' }
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            className="bg-surface-800 rounded-lg p-4 text-center border border-surface-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <ApperIcon name={feature.icon} className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="font-heading font-bold text-white text-sm">
              {feature.title}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {feature.desc}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default GameSetup;