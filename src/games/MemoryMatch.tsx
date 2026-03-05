import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Trophy, Brain } from 'lucide-react';

const EMOJIS = ['🎮', '🕹️', '👾', '🚀', '💎', '🔥', '🌈', '⚡'];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryMatch() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [bestScore, setBestScore] = useState(Number(localStorage.getItem('memory-best')) || Infinity);

  const initializeGame = () => {
    const shuffledEmojis = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledEmojis);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameOver(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards[id].isFlipped || cards[id].isMatched) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].emoji === cards[second].emoji) {
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].isMatched = true;
          matchedCards[second].isMatched = true;
          setCards(matchedCards);
          setFlippedCards([]);
          setMatches(m => m + 1);
          if (matches + 1 === EMOJIS.length) {
            setGameOver(true);
            if (moves + 1 < bestScore) {
              setBestScore(moves + 1);
              localStorage.setItem('memory-best', (moves + 1).toString());
            }
          }
        }, 600);
      } else {
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 flex w-full max-w-md items-center justify-between rounded-2xl bg-white/5 p-4 border border-white/10">
        <div className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Moves</span>
          <span className="text-2xl font-bold text-white">{moves}</span>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-500">
          <Brain className="h-7 w-7" />
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Best Score</span>
          <div className="flex items-center gap-2 text-2xl font-bold text-indigo-400">
            <Trophy className="h-5 w-5" />
            {bestScore === Infinity ? '-' : bestScore}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 w-full max-w-md">
        {cards.map((card) => (
          <div key={card.id} className="aspect-square perspective-1000">
            <motion.div
              initial={false}
              animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
              className="relative h-full w-full preserve-3d cursor-pointer"
              onClick={() => handleCardClick(card.id)}
            >
              {/* Front */}
              <div className="absolute inset-0 backface-hidden rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl hover:bg-white/10 transition-colors">
                <div className="h-8 w-8 rounded-full bg-indigo-500/20 border border-indigo-500/30" />
              </div>
              
              {/* Back */}
              <div 
                className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl flex items-center justify-center text-4xl shadow-xl ${
                  card.isMatched ? 'bg-emerald-500/20 border-emerald-500/50' : 'bg-indigo-600 border-indigo-400'
                }`}
              >
                {card.emoji}
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {gameOver && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mt-10 text-center"
          >
            <h2 className="text-4xl font-black text-white mb-2">WELL DONE!</h2>
            <p className="text-gray-400 mb-6">You finished in {moves} moves.</p>
            <button 
              onClick={initializeGame}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 font-bold text-white transition-all hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-500/25"
            >
              <RotateCcw className="h-5 w-5" />
              Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!gameOver && (
        <div className="mt-8 flex gap-2">
          {Array.from({ length: EMOJIS.length }).map((_, i) => (
            <div 
              key={i} 
              className={`h-2 w-8 rounded-full transition-all duration-500 ${
                i < matches ? 'bg-indigo-500 shadow-lg shadow-indigo-500/50' : 'bg-white/10'
              }`} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
