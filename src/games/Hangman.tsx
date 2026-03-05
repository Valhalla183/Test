import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Trophy, HelpCircle } from 'lucide-react';

const WORDS = ['GAMING', 'NEXUS', 'ARCADE', 'PIXEL', 'CONSOLE', 'JOYSTICK', 'VICTORY', 'LEVEL', 'QUEST', 'AVATAR'];

export default function Hangman() {
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [score, setScore] = useState(0);

  const initializeGame = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(randomWord);
    setGuessedLetters([]);
    setMistakes(0);
    setGameOver(false);
    setWin(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleGuess = (letter: string) => {
    if (gameOver || guessedLetters.includes(letter)) return;

    const newGuessed = [...guessedLetters, letter];
    setGuessedLetters(newGuessed);

    if (!word.includes(letter)) {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      if (newMistakes >= 6) {
        setGameOver(true);
      }
    } else {
      const isWin = word.split('').every(char => newGuessed.includes(char));
      if (isWin) {
        setWin(true);
        setGameOver(true);
        setScore(s => s + 1);
      }
    }
  };

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 flex w-full max-w-md items-center justify-between rounded-2xl bg-white/5 p-4 border border-white/10">
        <div className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Wins</span>
          <span className="text-2xl font-bold text-white">{score}</span>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-500">
          <HelpCircle className="h-7 w-7" />
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Mistakes</span>
          <span className={`text-2xl font-bold ${mistakes > 4 ? 'text-rose-500' : 'text-white'}`}>{mistakes}/6</span>
        </div>
      </div>

      <div className="mb-12 flex h-48 w-full max-w-md items-center justify-center rounded-3xl bg-white/5 border border-white/10 p-8 shadow-2xl relative overflow-hidden">
        <div className="flex gap-4">
          {word.split('').map((char, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <span className="text-4xl font-black text-white h-10">
                {guessedLetters.includes(char) || gameOver ? char : ''}
              </span>
              <div className={`h-1.5 w-8 rounded-full ${guessedLetters.includes(char) ? 'bg-indigo-500' : 'bg-white/20'}`} />
            </div>
          ))}
        </div>
        
        {/* Simple Hangman Visual */}
        <div className="absolute left-8 top-8 flex flex-col items-center opacity-20">
          <div className="h-32 w-2 bg-white/40" />
          <div className="h-2 w-16 bg-white/40" />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 w-full max-w-md">
        {alphabet.map(letter => (
          <button
            key={letter}
            disabled={guessedLetters.includes(letter) || gameOver}
            onClick={() => handleGuess(letter)}
            className={`h-12 rounded-xl font-bold transition-all ${
              guessedLetters.includes(letter)
                ? word.includes(letter) ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'
                : 'bg-white/5 text-white hover:bg-white/10 active:scale-95'
            } disabled:opacity-50`}
          >
            {letter}
          </button>
        ))}
      </div>

      {gameOver && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 text-center"
        >
          <h2 className={`text-4xl font-black mb-2 ${win ? 'text-emerald-500' : 'text-rose-500'}`}>
            {win ? 'YOU GUESSED IT!' : 'GAME OVER'}
          </h2>
          {!win && <p className="text-gray-400 mb-6">The word was: <span className="text-white font-bold">{word}</span></p>}
          <button 
            onClick={initializeGame}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 font-bold text-white transition-all hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-500/25"
          >
            <RotateCcw className="h-5 w-5" />
            Play Again
          </button>
        </motion.div>
      )}
    </div>
  );
}
