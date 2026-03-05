import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Trophy, Play, Volume2 } from 'lucide-react';

const COLORS = [
  { id: 'green', bg: 'bg-emerald-500', active: 'bg-emerald-300 shadow-emerald-500/80' },
  { id: 'red', bg: 'bg-rose-500', active: 'bg-rose-300 shadow-rose-500/80' },
  { id: 'yellow', bg: 'bg-amber-400', active: 'bg-amber-200 shadow-amber-400/80' },
  { id: 'blue', bg: 'bg-indigo-500', active: 'bg-indigo-300 shadow-indigo-500/80' }
];

export default function SimonSays() {
  const [sequence, setSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(Number(localStorage.getItem('simon-highscore')) || 0);

  const startNewRound = useCallback((currentSequence: string[]) => {
    const nextColor = COLORS[Math.floor(Math.random() * 4)].id;
    const newSequence = [...currentSequence, nextColor];
    setSequence(newSequence);
    setUserSequence([]);
    showSequence(newSequence);
  }, []);

  const showSequence = async (seq: string[]) => {
    setIsShowingSequence(true);
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));
      setActiveColor(seq[i]);
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveColor(null);
    }
    setIsShowingSequence(false);
  };

  const handleColorClick = (colorId: string) => {
    if (isShowingSequence || gameOver || !isPlaying) return;

    setActiveColor(colorId);
    setTimeout(() => setActiveColor(null), 300);

    const newUserSequence = [...userSequence, colorId];
    setUserSequence(newUserSequence);

    const currentIndex = newUserSequence.length - 1;
    if (newUserSequence[currentIndex] !== sequence[currentIndex]) {
      setGameOver(true);
      setIsPlaying(false);
      return;
    }

    if (newUserSequence.length === sequence.length) {
      setScore(s => s + 1);
      setTimeout(() => startNewRound(sequence), 1000);
    }
  };

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    startNewRound([]);
  };

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('simon-highscore', score.toString());
    }
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 flex w-full max-w-sm items-center justify-between rounded-2xl bg-white/5 p-4 border border-white/10">
        <div className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Round</span>
          <span className="text-2xl font-bold text-white">{score + 1}</span>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-500">
          <Volume2 className="h-7 w-7" />
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Best</span>
          <div className="flex items-center gap-2 text-2xl font-bold text-indigo-400">
            <Trophy className="h-5 w-5" />
            {highScore}
          </div>
        </div>
      </div>

      <div className="relative grid grid-cols-2 gap-4 w-full max-w-sm aspect-square p-4 rounded-full bg-black/40 border-8 border-white/5 shadow-2xl">
        {COLORS.map((color) => (
          <motion.button
            key={color.id}
            whileTap={!isShowingSequence ? { scale: 0.95 } : {}}
            onClick={() => handleColorClick(color.id)}
            className={`h-full w-full rounded-2xl transition-all duration-300 ${
              activeColor === color.id ? color.active : color.bg + ' opacity-40'
            } ${isShowingSequence ? 'cursor-default' : 'cursor-pointer hover:opacity-100'}`}
          />
        ))}

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-24 w-24 rounded-full bg-black border-4 border-white/10 flex items-center justify-center shadow-xl">
            <span className="text-2xl font-black text-white">{score}</span>
          </div>
        </div>

        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/80 backdrop-blur-sm z-20 pointer-events-auto">
            {gameOver ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
                <h2 className="text-3xl font-black text-white mb-2">WRONG COLOR!</h2>
                <p className="text-gray-400 mb-6">You reached Round {score + 1}</p>
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
                PLAY
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-10 text-sm font-medium text-gray-400 uppercase tracking-widest text-center">
        {isShowingSequence ? "Watch the sequence..." : isPlaying ? "Your turn!" : "Press Play to start"}
      </div>
    </div>
  );
}
