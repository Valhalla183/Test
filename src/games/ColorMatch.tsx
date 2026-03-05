import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Trophy, Play, Zap } from 'lucide-react';

const COLORS = [
  { name: 'RED', class: 'text-rose-500', bg: 'bg-rose-500' },
  { name: 'BLUE', class: 'text-indigo-500', bg: 'bg-indigo-500' },
  { name: 'GREEN', class: 'text-emerald-500', bg: 'bg-emerald-500' },
  { name: 'YELLOW', class: 'text-amber-400', bg: 'bg-amber-400' },
  { name: 'PURPLE', class: 'text-purple-500', bg: 'bg-purple-500' },
];

export default function ColorMatch() {
  const [target, setTarget] = useState({ name: '', color: '' });
  const [options, setOptions] = useState<typeof COLORS>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(Number(localStorage.getItem('color-highscore')) || 0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const generateRound = useCallback(() => {
    const shuffled = [...COLORS].sort(() => Math.random() - 0.5);
    const targetColor = shuffled[0];
    const displayColor = shuffled[1];
    
    setTarget({ name: targetColor.name, color: displayColor.class });
    setOptions(shuffled.slice(0, 4).sort(() => Math.random() - 0.5));
    setTimeLeft(2); // Very fast reaction needed
  }, []);

  const handleChoice = (choice: string) => {
    if (!isPlaying || gameOver) return;

    if (choice === target.name) {
      setScore(s => s + 10);
      generateRound();
    } else {
      setGameOver(true);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (isPlaying && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 0) {
            setGameOver(true);
            setIsPlaying(false);
            return 0;
          }
          return t - 0.1;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [isPlaying, gameOver]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('color-highscore', score.toString());
    }
  }, [score, highScore]);

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    generateRound();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 flex w-full max-w-sm items-center justify-between rounded-2xl bg-white/5 p-4 border border-white/10">
        <div className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Score</span>
          <span className="text-2xl font-bold text-white">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Best</span>
          <div className="flex items-center gap-2 text-2xl font-bold text-indigo-400">
            <Trophy className="h-5 w-5" />
            {highScore}
          </div>
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center w-full max-w-sm aspect-video rounded-3xl bg-white/5 border border-white/10 shadow-2xl p-8 overflow-hidden">
        <div className="absolute top-0 left-0 h-1 bg-indigo-500 transition-all duration-100" style={{ width: `${(timeLeft / 2) * 100}%` }} />
        
        <AnimatePresence mode="wait">
          {isPlaying && !gameOver && (
            <motion.h2
              key={target.name + target.color}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className={`text-6xl font-black tracking-tighter ${target.color}`}
            >
              {target.name}
            </motion.h2>
          )}
        </AnimatePresence>

        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20">
            {gameOver ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
                <h2 className="text-3xl font-black text-white mb-2">TOO SLOW!</h2>
                <p className="text-gray-400 mb-6">Final Score: {score}</p>
                <button 
                  onClick={startGame}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 font-bold text-white transition-all hover:bg-indigo-700 active:scale-95"
                >
                  <RotateCcw className="h-5 w-5" />
                  Try Again
                </button>
              </motion.div>
            ) : (
              <button 
                onClick={startGame}
                className="flex items-center gap-3 rounded-2xl bg-indigo-600 px-10 py-5 text-2xl font-black text-white transition-all hover:bg-indigo-700 hover:scale-105 active:scale-95 shadow-2xl shadow-indigo-500/30"
              >
                <Play className="h-8 w-8 fill-current" />
                START
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 w-full max-w-sm">
        {options.map((opt) => (
          <motion.button
            key={opt.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleChoice(opt.name)}
            className={`h-16 rounded-2xl font-black text-xl text-white shadow-lg transition-all ${opt.bg}`}
          >
            {opt.name}
          </motion.button>
        ))}
      </div>

      <div className="mt-8 text-sm font-medium text-gray-500 uppercase tracking-widest text-center max-w-xs">
        Match the <span className="text-white">WORD</span>, not the color!
      </div>
    </div>
  );
}
