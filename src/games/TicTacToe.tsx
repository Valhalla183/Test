import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Trophy, User, Monitor } from 'lucide-react';

type Player = 'X' | 'O' | null;

export default function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<Player | 'Draw'>(null);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const calculateWinner = (squares: Player[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diags
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (squares.every(square => square !== null)) return 'Draw';
    return null;
  };

  const handleClick = (i: number) => {
    if (winner || board[i]) return;
    const newBoard = [...board];
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  useEffect(() => {
    const result = calculateWinner(board);
    if (result) {
      setWinner(result);
      if (result === 'X') setScores(s => ({ ...s, X: s.X + 1 }));
      if (result === 'O') setScores(s => ({ ...s, O: s.O + 1 }));
    }
  }, [board]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 flex w-full max-w-sm items-center justify-between rounded-2xl bg-white/5 p-4 border border-white/10">
        <div className={`flex flex-col items-center gap-1 transition-all ${isXNext && !winner ? 'scale-110' : 'opacity-50'}`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-500">
            <User className="h-6 w-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Player X</span>
          <span className="text-xl font-black text-white">{scores.X}</span>
        </div>
        
        <div className="h-10 w-px bg-white/10" />
        
        <div className={`flex flex-col items-center gap-1 transition-all ${!isXNext && !winner ? 'scale-110' : 'opacity-50'}`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-600/20 text-rose-500">
            <Monitor className="h-6 w-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Player O</span>
          <span className="text-xl font-black text-white">{scores.O}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-sm aspect-square p-3 rounded-3xl bg-white/5 border border-white/10 shadow-2xl">
        {board.map((square, i) => (
          <motion.button
            key={i}
            whileHover={!square && !winner ? { scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' } : {}}
            whileTap={!square && !winner ? { scale: 0.95 } : {}}
            onClick={() => handleClick(i)}
            className={`flex items-center justify-center rounded-2xl text-5xl font-black transition-all ${
              square === 'X' ? 'text-indigo-500 bg-indigo-500/10' : 
              square === 'O' ? 'text-rose-500 bg-rose-500/10' : 
              'bg-white/5'
            }`}
          >
            {square && (
              <motion.span
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
              >
                {square}
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      {winner && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center"
        >
          <h2 className="text-3xl font-black text-white mb-4">
            {winner === 'Draw' ? "It's a Draw!" : `${winner} Wins!`}
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

      {!winner && (
        <div className="mt-8 text-sm font-medium text-gray-400 uppercase tracking-widest animate-pulse">
          {isXNext ? "Player X's Turn" : "Player O's Turn"}
        </div>
      )}
    </div>
  );
}
