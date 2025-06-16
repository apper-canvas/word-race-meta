import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import NumberGrid from '@/components/molecules/NumberGrid';
import LetterDisplay from '@/components/molecules/LetterDisplay';
import WordInput from '@/components/molecules/WordInput';
import Timer from '@/components/atoms/Timer';
import PlayerScore from '@/components/molecules/PlayerScore';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { puzzleService, wordService } from '@/services';

const GameBoard = ({ 
  game, 
  onGameUpdate,
  onGameEnd,
  className = ''
}) => {
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [currentLetters, setCurrentLetters] = useState([]);
  const [usedLetters, setUsedLetters] = useState([]);
  const [timerActive, setTimerActive] = useState(false);
const [gamePhase, setGamePhase] = useState('selecting'); // selecting, playing, result
  const [currentWord, setCurrentWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [sharedPuzzleActive, setSharedPuzzleActive] = useState(false);
  
  // Both players work together - no current player concept
  const player1 = game.players[0];
  const player2 = game.players[1];
  
const handleNumberSelect = async (number) => {
    if (gamePhase !== 'selecting' || sharedPuzzleActive) return;
    
    try {
      setLoading(true);
      // Get puzzle with guaranteed scrambled letters
      const puzzle = await puzzleService.getPuzzleWithScrambledLetters(number);
      if (puzzle) {
        setSelectedNumber(number);
        setCurrentPuzzle(puzzle);
        setCurrentLetters([...puzzle.letters]);
        setUsedLetters([]);
        setGamePhase('playing');
        setTimerActive(true);
        setSharedPuzzleActive(true);
        toast.success(`Puzzle ${number} loaded! Both players work together to solve it!`);
      }
    } catch (error) {
      toast.error('Failed to load puzzle');
    } finally {
      setLoading(false);
    }
  };
  
const handleWordSubmit = async (word) => {
    if (gamePhase !== 'playing') return;
    
    try {
      setLoading(true);
      setTimerActive(false);
      
      const validation = await wordService.validateWord(word, currentLetters);
      
      if (validation.valid) {
        // Both players share the points for cooperative solving
        const pointsPerPlayer = Math.ceil(validation.points / 2);
        const updatedPlayers = game.players.map(player => ({
          ...player, 
          score: player.score + pointsPerPlayer
        }));
        
        const updatedGame = {
          ...game,
          players: updatedPlayers,
          usedNumbers: [...game.usedNumbers, selectedNumber],
          // Remove currentPlayerIndex since both players work together
        };
        
        onGameUpdate(updatedGame);
        
        toast.success(`Great teamwork! Both players get +${pointsPerPlayer} points`, {
          autoClose: 2000
        });
        
        setGamePhase('result');
        setTimeout(() => {
          if (game.usedNumbers.length + 1 >= 20) {
            onGameEnd(updatedGame);
          } else {
            resetTurn();
          }
        }, 3000);
        
      } else {
        toast.error(validation.reason);
        setTimerActive(true);
      }
    } catch (error) {
      toast.error('Failed to validate word');
      setTimerActive(true);
    } finally {
      setLoading(false);
    }
  };
  
const handleTimeUp = () => {
    setTimerActive(false);
    toast.warning("Time's up! Moving to next puzzle...");
    
    const updatedGame = {
      ...game,
      usedNumbers: [...game.usedNumbers, selectedNumber],
    };
    
    onGameUpdate(updatedGame);
    setGamePhase('result');
    
    setTimeout(() => {
      if (game.usedNumbers.length + 1 >= 20) {
        onGameEnd(updatedGame);
      } else {
        resetTurn();
      }
    }, 2000);
  };
  
  const resetTurn = () => {
    setSelectedNumber(null);
    setCurrentPuzzle(null);
    setCurrentLetters([]);
    setUsedLetters([]);
    setCurrentWord('');
    setGamePhase('selecting');
    setTimerActive(false);
    setSharedPuzzleActive(false);
  };
  
  const handleLetterClick = (letter, index) => {
    if (gamePhase !== 'playing' || usedLetters.includes(index)) return;
    
    // Add letter to current word
    setCurrentWord(prev => prev + letter);
    setUsedLetters(prev => [...prev, index]);
  };
  
  const clearWord = () => {
    setCurrentWord('');
    setUsedLetters([]);
  };
  
  return (
<div className={`max-w-7xl mx-auto p-6 space-y-6 ${className}`}>
      {/* Player Scores - Both Active in Cooperative Mode */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PlayerScore player={player1} isActive={gamePhase === 'playing' || gamePhase === 'selecting'} />
        <PlayerScore player={player2} isActive={gamePhase === 'playing' || gamePhase === 'selecting'} />
      </div>
      
      {/* Game Status */}
      <motion.div
        className="text-center p-4 bg-surface-800 rounded-xl border border-surface-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AnimatePresence mode="wait">
          {gamePhase === 'selecting' && (
            <motion.div
              key="selecting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
>
              <h2 className="text-2xl font-heading text-white mb-2">
                Team Puzzle Solving
              </h2>
              <p className="text-gray-400">
                Choose a number to reveal scrambled letters for both players to solve together
              </p>
            </motion.div>
          )}
          
          {gamePhase === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-6"
            >
<div>
                <h2 className="text-2xl font-heading text-white mb-2">
                  Work together to form a word!
                </h2>
                <p className="text-gray-400">
                  Puzzle #{selectedNumber} • {currentLetters.length} scrambled letters • Both players collaborate
                </p>
              </div>
              <Timer
                duration={30}
                isActive={timerActive}
                onTimeUp={handleTimeUp}
              />
            </motion.div>
          )}
          
          {gamePhase === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-2xl font-heading text-accent mb-2">
                Turn Complete!
              </h2>
              <p className="text-gray-400">
                Preparing next turn...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Number Grid */}
        <div className="xl:col-span-1">
<NumberGrid
            usedNumbers={game.usedNumbers}
            selectedNumber={selectedNumber}
            currentPlayerColor={player1.color}
            onNumberSelect={handleNumberSelect}
          />
        </div>
        
{/* Letters and Input */}
        <div className="xl:col-span-2 space-y-6">
          <LetterDisplay
            letters={currentLetters}
            usedLetters={usedLetters.map(index => currentLetters[index])}
            onLetterClick={handleLetterClick}
            onArrangementChange={(arrangedWord) => {
              setCurrentWord(arrangedWord);
            }}
          />
          
          {gamePhase === 'playing' && (
            <div className="space-y-4">
              <WordInput
                availableLetters={currentLetters}
                arrangedWord={currentWord}
                onSubmit={handleWordSubmit}
                onWordChange={setCurrentWord}
                onClearArrangement={clearWord}
                disabled={loading || !timerActive}
                placeholder="Form your word..."
              />
            </div>
          )}
        </div>
      </div>
      
      {loading && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-surface-800 p-8 rounded-xl border border-surface-600 text-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white">Processing...</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GameBoard;