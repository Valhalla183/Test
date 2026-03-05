import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Trophy } from 'lucide-react';

type Grid = (number | null)[][];

export default function Puzzle2048() {
  const [grid, setGrid] = useState<Grid>(Array(4).fill(null).map(() => Array(4).fill(null)));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(Number(localStorage.getItem('2048-highscore')) || 0);
  const [gameOver, setGameOver] = useState(false);

  const initializeGrid = useCallback(() => {
    const newGrid = Array(4).fill(null).map(() => Array(4).fill(null));
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
  }, []);

  const addRandomTile = (currentGrid: Grid) => {
    const emptyCells = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (currentGrid[r][c] === null) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length > 0) {
      const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      currentGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const move = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver) return;

    let moved = false;
    const newGrid = grid.map(row => [...row]);
    let newScore = score;

    const rotate = (g: Grid) => {
      const rotated: Grid = Array(4).fill(null).map(() => Array(4).fill(null));
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          rotated[c][3 - r] = g[r][c];
        }
      }
      return rotated;
    };

    let tempGrid = newGrid;
    const rotations = { up: 1, right: 2, down: 3, left: 0 }[direction];
    for (let i = 0; i < rotations; i++) tempGrid = rotate(tempGrid);

    for (let r = 0; r < 4; r++) {
      const row = tempGrid[r].filter(val => val !== null) as number[];
      const newRow: (number | null)[] = [];
      for (let i = 0; i < row.length; i++) {
        if (row[i] === row[i + 1]) {
          const combined = row[i] * 2;
          newRow.push(combined);
          newScore += combined;
          i++;
          moved = true;
        } else {
          newRow.push(row[i]);
        }
      }
      while (newRow.length < 4) newRow.push(null);
      if (JSON.stringify(tempGrid[r]) !== JSON.stringify(newRow)) moved = true;
      tempGrid[r] = newRow;
    }

    for (let i = 0; i < (4 - rotations) % 4; i++) tempGrid = rotate(tempGrid);

    if (moved) {
      addRandomTile(tempGrid);
      setGrid(tempGrid);
      setScore(newScore);
      
      // Check for game over
      const canMove = (g: Grid) => {
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 4; c++) {
            if (g[r][c] === null) return true;
            if (c < 3 && g[r][c] === g[r][c + 1]) return true;
            if (r < 3 && g[r][c] === g[r + 1][c]) return true;
          }
        }
        return false;
      };
      if (!canMove(tempGrid)) setGameOver(true);
    }
  };

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        move(e.key.replace('Arrow', '').toLowerCase() as any);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid, gameOver]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('2048-highscore', score.toString());
    }
  }, [score, highScore]);

  const getTileColor = (val: number | null) => {
    if (!val) return 'bg-white/5';
    const colors: Record<number, string> = {
      2: 'bg-white text-black',
      4: 'bg-indigo-100 text-black',
      8: 'bg-indigo-200 text-black',
      16: 'bg-indigo-300 text-black',
      32: 'bg-indigo-400 text-white',
      64: 'bg-indigo-500 text-white',
      128: 'bg-indigo-600 text-white',
      256: 'bg-indigo-700 text-white',
      512: 'bg-indigo-800 text-white',
      1024: 'bg-indigo-900 text-white',
      2048: 'bg-rose-600 text-white shadow-lg shadow-rose-500/50',
    };
    return colors[val] || 'bg-black text-white';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 flex w-full max-w-sm items-center justify-between rounded-2xl bg-white/5 p-4 border border-white/10">
        <div className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Score</span>
          <span className="text-2xl font-bold text-white">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">High Score</span>
          <div className="flex items-center gap-2 text-2xl font-bold text-indigo-400">
            <Trophy className="h-5 w-5" />
            {highScore}
          </div>
        </div>
      </div>

      <div className="relative grid grid-cols-4 gap-3 w-full max-w-sm aspect-square p-3 rounded-2xl bg-white/5 border border-white/10 shadow-2xl">
        {grid.flat().map((val, i) => (
          <motion.div
            key={`${i}-${val}`}
            initial={val ? { scale: 0.8, opacity: 0 } : {}}
            animate={{ scale: 1, opacity: 1 }}
            className={`flex items-center justify-center rounded-xl text-2xl font-black transition-all duration-200 ${getTileColor(val)}`}
          >
            {val}
          </motion.div>
        ))}

        <AnimatePresence>
          {gameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/80 backdrop-blur-sm z-20"
            >
              <h2 className="text-4xl font-black text-white mb-2">GAME OVER</h2>
              <p className="text-gray-400 mb-6">Final Score: {score}</p>
              <button 
                onClick={initializeGrid}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 font-bold text-white transition-all hover:bg-indigo-700 active:scale-95"
              >
                <RotateCcw className="h-5 w-5" />
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-sm">
        <div className="rounded-xl bg-white/5 p-4 border border-white/10 text-center">
          <span className="block text-xs font-medium uppercase text-gray-500 mb-1">Controls</span>
          <p className="text-sm text-gray-300">Use Arrow Keys to move tiles</p>
        </div>
        <div className="rounded-xl bg-white/5 p-4 border border-white/10 text-center">
          <span className="block text-xs font-medium uppercase text-gray-500 mb-1">Goal</span>
          <p className="text-sm text-gray-300">Combine tiles to reach 2048</p>
        </div>
      </div>
    </div>
  );
}
