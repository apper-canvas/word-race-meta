import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const Timer = ({ 
  duration = 30, 
  isActive = false, 
  onTimeUp,
  onTick,
  className = ''
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);
  
  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          const newTime = time - 1;
          if (onTick) onTick(newTime);
          if (newTime === 0 && onTimeUp) {
            onTimeUp();
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onTimeUp, onTick]);
  
  const progress = (timeLeft / duration) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  const isLowTime = timeLeft <= 10;
  const isVeryLowTime = timeLeft <= 5;
  
  return (
    <div className={`relative ${className}`}>
      <motion.div
        className={`relative w-24 h-24 ${isVeryLowTime ? 'animate-pulse-glow' : ''}`}
        animate={isLowTime ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 1, repeat: isLowTime ? Infinity : 0 }}
      >
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-surface-600"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-colors duration-200 ${
              isVeryLowTime ? 'text-error glow' : 
              isLowTime ? 'text-warning glow-accent' : 
              'text-accent'
            }`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span 
            className={`text-2xl font-heading font-bold ${
              isVeryLowTime ? 'text-error' : 
              isLowTime ? 'text-warning' : 
              'text-white'
            }`}
            animate={isVeryLowTime ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5, repeat: isVeryLowTime ? Infinity : 0 }}
          >
            {timeLeft}
          </motion.span>
        </div>
      </motion.div>
      
      <div className="text-center mt-2">
        <span className="text-sm text-gray-400">seconds</span>
      </div>
    </div>
  );
};

export default Timer;