import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Trophy, User, Monitor } from 'lucide-react';

type Choice = 'rock' | 'paper' | 'scissors';

const CHOICES: { id: Choice; emoji: string; color: string }[] = [
  { id: 'rock', emoji: '✊', color: 'bg-indigo-500' },
  { id: 'paper', emoji: '✋', color: 'bg-emerald-500' },
  { id: 'scissors', emoji: '✌️', color: 'bg-rose-500' }
];

export default function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [score, setScore] = useState({ player: 0, computer: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  const determineWinner = (player: Choice, computer: Choice) => {
    if (player === computer) return 'draw';
    if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'paper' && computer === 'rock') ||
      (player === 'scissors' && computer === 'paper')
    ) return 'win';
    return 'lose';
  };

  const play = (choice: Choice) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setPlayerChoice(choice);
    setComputerChoice(null);
    setResult(null);

    setTimeout(() => {
      const computer = CHOICES[Math.floor(Math.random() * 3)].id;
      setComputerChoice(computer);
      const res = determineWinner(choice, computer);
      setResult(res);
      
      if (res === 'win') setScore(s => ({ ...s, player: s.player + 1 }));
      if (res === 'lose') setScore(s => ({ ...s, computer: s.computer + 1 }));
      
      setIsAnimating(false);
    }, 1000);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-10 flex w-full max-w-md items-center justify-between rounded-2xl bg-white/5 p-4 border border-white/10">
        <div className="flex flex-col items-center gap-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-500">
            <User className="h-6 w-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">You</span>
          <span className="text-xl font-black text-white">{score.player}</span>
        </div>
        
        <div className="h-10 w-px bg-white/10" />
        
        <div className="flex flex-col items-center gap-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-600/20 text-rose-500">
            <Monitor className="h-6 w-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Computer</span>
          <span className="text-xl font-black text-white">{score.computer}</span>
        </div>
      </div>

      <div className="flex h-64 w-full max-w-md items-center justify-around rounded-3xl bg-white/5 border border-white/10 p-8 shadow-2xl">
        <div className="flex flex-col items-center gap-4">
          <span className="text-xs font-bold uppercase text-gray-500">Your Choice</span>
          <AnimatePresence mode="wait">
            {playerChoice ? (
              <motion.div
                key={playerChoice}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                className={`flex h-24 w-24 items-center justify-center rounded-2xl text-5xl shadow-xl ${CHOICES.find(c => c.id === playerChoice)?.color}`}
              >
                {CHOICES.find(c => c.id === playerChoice)?.emoji}
              </motion.div>
            ) : (
              <div className="h-24 w-24 rounded-2xl border-2 border-dashed border-white/10" />
            )}
          </AnimatePresence>
        </div>

        <div className="text-2xl font-black text-gray-700 italic">VS</div>

        <div className="flex flex-col items-center gap-4">
          <span className="text-xs font-bold uppercase text-gray-500">Computer</span>
          <AnimatePresence mode="wait">
            {computerChoice ? (
              <motion.div
                key={computerChoice}
                initial={{ scale: 0, rotate: 20 }}
                animate={{ scale: 1, rotate: 0 }}
                className={`flex h-24 w-24 items-center justify-center rounded-2xl text-5xl shadow-xl ${CHOICES.find(c => c.id === computerChoice)?.color}`}
              >
                {CHOICES.find(c => c.id === computerChoice)?.emoji}
              </motion.div>
            ) : (
              <div className={`h-24 w-24 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center ${isAnimating ? 'animate-pulse bg-white/5' : ''}`}>
                {isAnimating && <span className="text-2xl">🤔</span>}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 text-center"
        >
          <h2 className={`text-4xl font-black mb-6 ${
            result === 'win' ? 'text-emerald-500' : 
            result === 'lose' ? 'text-rose-500' : 
            'text-gray-400'
          }`}>
            {result === 'win' ? 'YOU WIN!' : result === 'lose' ? 'YOU LOSE!' : "IT'S A DRAW!"}
          </h2>
          <button 
            onClick={resetGame}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 font-bold text-white transition-all hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-500/25"
          >
            <RotateCcw className="h-5 w-5" />
            Play Again
          </button>
        </motion.div>
      )}

      {!playerChoice && (
        <div className="mt-12 flex flex-col items-center gap-6">
          <span className="text-sm font-bold uppercase tracking-widest text-gray-500">Choose your weapon</span>
          <div className="flex gap-4">
            {CHOICES.map(choice => (
              <motion.button
                key={choice.id}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => play(choice.id)}
                className={`flex h-20 w-20 items-center justify-center rounded-2xl text-4xl shadow-xl transition-all hover:shadow-indigo-500/20 ${choice.color}`}
              >
                {choice.emoji}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
