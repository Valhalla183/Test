import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Trophy, Play, Zap } from 'lucide-react';

export default function WhackAMole() {
  const [moles, setMoles] = useState(Array(9).fill(false));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(Number(localStorage.getItem('mole-highscore')) || 0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const moleTimerRef = useRef<number | null>(null);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    setGameOver(false);
    setMoles(Array(9).fill(false));
  };

  const whack = (index: number) => {
    if (!isPlaying || !moles[index]) return;
    
    setScore(s => s + 10);
    const newMoles = [...moles];
    newMoles[index] = false;
    setMoles(newMoles);
  };

  const showMole = useCallback(() => {
    if (!isPlaying || timeLeft <= 0) return;
    
    const index = Math.floor(Math.random() * 9);
    setMoles(prev => {
      const next = [...prev];
      next[index] = true;
      return next;
    });

    setTimeout(() => {
      setMoles(prev => {
        const next = [...prev];
        next[index] = false;
        return next;
      });
    }, 800 + Math.random() * 1000);
  }, [isPlaying, timeLeft]);

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);

      moleTimerRef.current = window.setInterval(showMole, 600);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
      setGameOver(true);
      if (timerRef.current) clearInterval(timerRef.current);
      if (moleTimerRef.current) clearInterval(moleTimerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (moleTimerRef.current) clearInterval(moleTimerRef.current);
    };
  }, [isPlaying, timeLeft, showMole]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('mole-highscore', score.toString());
    }
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 flex w-full max-w-md items-center justify-between rounded-2xl bg-white/5 p-4 border border-white/10">
        <div className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Score</span>
          <span className="text-2xl font-bold text-white">{score}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Time</span>
          <span className={`text-2xl font-black ${timeLeft < 10 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">High Score</span>
          <div className="flex items-center gap-2 text-2xl font-bold text-indigo-400">
            <Trophy className="h-5 w-5" />
            {highScore}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full max-w-md aspect-square p-4 rounded-3xl bg-white/5 border border-white/10 shadow-2xl">
        {moles.map((isUp, i) => (
          <div key={i} className="relative aspect-square rounded-2xl bg-black/40 border border-white/5 overflow-hidden">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-2 rounded-full bg-black/60" />
            
            <AnimatePresence>
              {isUp && (
                <motion.button
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  exit={{ y: 100 }}
                  onClick={() => whack(i)}
                  className="absolute inset-0 flex items-center justify-center text-6xl select-none"
                >
                  <motion.div whileTap={{ scale: 1.2 }}>🐹</motion.div>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {(!isPlaying || gameOver) && (
        <div className="mt-10 text-center">
          {gameOver ? (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
              <h2 className="text-4xl font-black text-white mb-2">TIME'S UP!</h2>
              <p className="text-gray-400 mb-6">You whacked {score / 10} moles.</p>
              <button 
                onClick={startGame}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 font-bold text-white transition-all hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-500/25"
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
              START GAME
            </button>
          )}
        </div>
      )}
    </div>
  );
}
