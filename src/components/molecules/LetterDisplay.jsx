import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import LetterTile from '@/components/atoms/LetterTile';
import ApperIcon from '@/components/ApperIcon';

const LetterDisplay = ({ 
  letters = [], 
  usedLetters = [], 
  className = '',
  onLetterClick,
  onArrangementChange
}) => {
  const [arrangedLetters, setArrangedLetters] = useState([]);
  
  const getLetterCount = (letter) => {
    return letters.filter(l => l === letter).length;
  };
  
  const getUsedCount = (letter) => {
    return usedLetters.filter(l => l === letter).length;
  };
  
  const isLetterUsed = (letter, index) => {
    const letterCount = getLetterCount(letter);
    const usedCount = getUsedCount(letter);
    const arrangedCount = arrangedLetters.filter(l => l.letter === letter).length;
    const currentLetterIndex = letters.slice(0, index + 1).filter(l => l === letter).length;
    return currentLetterIndex <= (usedCount + arrangedCount);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (source.droppableId === 'available-letters' && destination.droppableId === 'arrangement-zone') {
      // Moving from available to arrangement
      const letterIndex = parseInt(source.index);
      const letter = letters[letterIndex];
      
      if (!isLetterUsed(letter, letterIndex)) {
        const newArrangedLetters = [...arrangedLetters];
        newArrangedLetters.splice(destination.index, 0, {
          id: `${letter}-${Date.now()}`,
          letter: letter,
          originalIndex: letterIndex
        });
        
        setArrangedLetters(newArrangedLetters);
        onArrangementChange?.(newArrangedLetters.map(l => l.letter).join(''));
      }
    } else if (source.droppableId === 'arrangement-zone' && destination.droppableId === 'arrangement-zone') {
      // Reordering within arrangement
      const newArrangedLetters = [...arrangedLetters];
      const [reorderedItem] = newArrangedLetters.splice(source.index, 1);
      newArrangedLetters.splice(destination.index, 0, reorderedItem);
      
      setArrangedLetters(newArrangedLetters);
      onArrangementChange?.(newArrangedLetters.map(l => l.letter).join(''));
    } else if (source.droppableId === 'arrangement-zone' && destination.droppableId === 'available-letters') {
      // Moving back to available (remove from arrangement)
      const newArrangedLetters = [...arrangedLetters];
      newArrangedLetters.splice(source.index, 1);
      
      setArrangedLetters(newArrangedLetters);
      onArrangementChange?.(newArrangedLetters.map(l => l.letter).join(''));
    }
  };

  const clearArrangement = () => {
    setArrangedLetters([]);
    onArrangementChange?.('');
  };
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <motion.div
        className={`p-6 bg-surface-800 rounded-xl border border-surface-600 ${className}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="mb-4">
          <h2 className="text-xl font-heading text-white mb-2">Available Letters</h2>
          <p className="text-sm text-gray-400">
            Drag letters to arrange your word or click to add • {letters.length} letters total
          </p>
        </div>

        {/* Word Arrangement Zone */}
        <div className="mb-6 p-4 bg-surface-700 rounded-lg border-2 border-dashed border-surface-500">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-heading text-white">Word Arrangement</h3>
            {arrangedLetters.length > 0 && (
              <button
                onClick={clearArrangement}
                className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
              >
                <ApperIcon name="X" size={14} />
                Clear
              </button>
            )}
          </div>
          
          <Droppable droppableId="arrangement-zone" direction="horizontal">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex gap-2 min-h-[80px] items-center justify-center p-3 rounded-lg transition-colors ${
                  snapshot.isDraggingOver ? 'bg-accent/10 border-accent border-2' : 'bg-surface-600'
                }`}
              >
                {arrangedLetters.length > 0 ? (
                  arrangedLetters.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <LetterTile
                            letter={item.letter}
                            size="lg"
                            isDragging={snapshot.isDragging}
                            className={snapshot.isDragging ? 'rotate-3 shadow-xl' : ''}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-6">
                    <ApperIcon name="MousePointer2" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Drag letters here to build your word</p>
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
        
        {/* Available Letters */}
        <AnimatePresence mode="wait">
          <motion.div
            key={letters.join('')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {letters.length > 0 ? (
              <Droppable droppableId="available-letters" direction="horizontal">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex flex-wrap gap-3 justify-center min-h-[80px] items-center p-3 rounded-lg transition-colors ${
                      snapshot.isDraggingOver ? 'bg-surface-700' : ''
                    }`}
                  >
                    {letters.map((letter, index) => {
                      const isUsed = isLetterUsed(letter, index);
                      return (
                        <Draggable
                          key={`${letter}-${index}`}
                          draggableId={`available-${letter}-${index}`}
                          index={index}
                          isDragDisabled={isUsed}
                        >
                          {(provided, snapshot) => (
                            <motion.div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              initial={{ opacity: 0, y: -20, rotateX: -90 }}
                              animate={{ opacity: 1, y: 0, rotateX: 0 }}
                              transition={{ 
                                delay: index * 0.1,
                                type: "spring",
                                stiffness: 260,
                                damping: 20
                              }}
                              className="animate-bounce-in"
                              style={{ 
                                animationDelay: `${index * 0.1}s`,
                                ...provided.draggableProps.style
                              }}
                            >
                              <LetterTile
                                letter={letter}
                                isUsed={isUsed}
                                size="lg"
                                isDragging={snapshot.isDragging}
                                onClick={() => !isUsed && onLetterClick?.(letter, index)}
                                className={snapshot.isDragging ? 'rotate-2 shadow-xl' : ''}
                              />
                            </motion.div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
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
    </DragDropContext>
  );
};

export default LetterDisplay;