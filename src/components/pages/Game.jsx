import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import GameSetup from '@/components/organisms/GameSetup';
import GameBoard from '@/components/organisms/GameBoard';
import GameResults from '@/components/organisms/GameResults';
import { gameService } from '@/services';

const Game = () => {
  const [gameState, setGameState] = useState('setup'); // setup, playing, finished
  const [currentGame, setCurrentGame] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleGameStart = async (gameData) => {
    try {
      setLoading(true);
      const newGame = await gameService.create(gameData);
      setCurrentGame(newGame);
      setGameState('playing');
      toast.success('Game started! Good luck!');
    } catch (error) {
      toast.error('Failed to start game');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGameUpdate = async (updatedGame) => {
    try {
      const updated = await gameService.update(updatedGame.id, updatedGame);
      setCurrentGame(updated);
    } catch (error) {
      toast.error('Failed to update game');
    }
  };
  
  const handleGameEnd = async (finalGame) => {
    try {
      const endedGame = await gameService.endGame(finalGame.id, finalGame);
      setCurrentGame(endedGame);
      setGameState('finished');
      
      const winner = finalGame.players.reduce((prev, current) => 
        prev.score > current.score ? prev : current
      );
      
      if (finalGame.players[0].score === finalGame.players[1].score) {
        toast.success("It's a tie! Great game!");
      } else {
        toast.success(`${winner.name} wins! 🏆`);
      }
    } catch (error) {
      toast.error('Failed to end game');
    }
  };
  
  const handleNewGame = () => {
    setCurrentGame(null);
    setGameState('setup');
  };
  
  const handleRematch = async () => {
    if (currentGame) {
      const rematchData = {
        players: currentGame.players.map(player => ({
          ...player,
          score: 0
        })),
        gameMode: currentGame.gameMode
      };
      
      await handleGameStart(rematchData);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {gameState === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
            >
              <GameSetup onGameStart={handleGameStart} />
            </motion.div>
          )}
          
          {gameState === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
            >
              <GameBoard
                game={currentGame}
                onGameUpdate={handleGameUpdate}
                onGameEnd={handleGameEnd}
              />
            </motion.div>
          )}
          
          {gameState === 'finished' && (
            <motion.div
              key="finished"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
            >
              <GameResults
                game={currentGame}
                onNewGame={handleNewGame}
                onRestart={handleRematch}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {loading && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-surface-800 p-8 rounded-xl border border-surface-600 text-center">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white font-heading">Setting up game...</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Game;