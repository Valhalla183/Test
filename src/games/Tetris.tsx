import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Trophy, Play, Grid } from 'lucide-react';

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const TETROMINOS = {
  I: { shape: [[1, 1, 1, 1]], color: 'bg-cyan-500' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: 'bg-blue-500' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: 'bg-orange-500' },
  O: { shape: [[1, 1], [1, 1]], color: 'bg-yellow-500' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: 'bg-green-500' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: 'bg-purple-500' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 'bg-red-500' },
};

export default function Tetris() {
  const [grid, setGrid] = useState<string[][]>(Array(ROWS).fill(null).map(() => Array(COLS).fill('')));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(Number(localStorage.getItem('tetris-highscore')) || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  const currentPiece = useRef({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOS.I,
    collided: false,
  });

  const resetGame = () => {
    setGrid(Array(ROWS).fill(null).map(() => Array(COLS).fill('')));
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    spawnPiece();
  };

  const spawnPiece = () => {
    const keys = Object.keys(TETROMINOS) as (keyof typeof TETROMINOS)[];
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const tetromino = TETROMINOS[randomKey];
    currentPiece.current = {
      pos: { x: Math.floor(COLS / 2) - 1, y: 0 },
      tetromino,
      collided: false,
    };
    if (checkCollision(0, 0)) {
      setGameOver(true);
      setIsPlaying(false);
    }
  };

  const checkCollision = (dx: number, dy: number, rotatedShape?: number[][]) => {
    const shape = rotatedShape || currentPiece.current.tetromino.shape;
    const { x, y } = currentPiece.current.pos;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] !== 0) {
          const newX = x + c + dx;
          const newY = y + r + dy;
          if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && grid[newY][newX] !== '')) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const move = (dx: number, dy: number) => {
    if (!checkCollision(dx, dy)) {
      currentPiece.current.pos.x += dx;
      currentPiece.current.pos.y += dy;
      return true;
    }
    if (dy > 0) {
      lockPiece();
      spawnPiece();
    }
    return false;
  };

  const lockPiece = () => {
    const { x, y } = currentPiece.current.pos;
    const { shape, color } = currentPiece.current.tetromino;
    const newGrid = [...grid.map(row => [...row])];
    shape.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val !== 0 && y + r >= 0) {
          newGrid[y + r][x + c] = color;
        }
      });
    });

    // Clear lines
    let linesCleared = 0;
    const filteredGrid = newGrid.filter(row => {
      const isFull = row.every(cell => cell !== '');
      if (isFull) linesCleared++;
      return !isFull;
    });
    while (filteredGrid.length < ROWS) {
      filteredGrid.unshift(Array(COLS).fill(''));
    }
    if (linesCleared > 0) setScore(s => s + linesCleared * 100);
    setGrid(filteredGrid);
  };

  const rotate = () => {
    const shape = currentPiece.current.tetromino.shape;
    const rotated = shape[0].map((_, i) => shape.map(row => row[i]).reverse());
    if (!checkCollision(0, 0, rotated)) {
      currentPiece.current.tetromino = { ...currentPiece.current.tetromino, shape: rotated };
    }
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const interval = setInterval(() => move(0, 1), 800);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, grid]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;
      if (e.key === 'ArrowLeft') move(-1, 0);
      if (e.key === 'ArrowRight') move(1, 0);
      if (e.key === 'ArrowDown') move(0, 1);
      if (e.key === 'ArrowUp') rotate();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver, grid]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('tetris-highscore', score.toString());
    }
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex w-full max-w-sm items-center justify-between rounded-2xl bg-white/5 p-4 border border-white/10">
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

      <div className="relative overflow-hidden rounded-2xl border-4 border-white/10 bg-black shadow-2xl">
        <div 
          className="grid gap-px bg-white/5" 
          style={{ 
            gridTemplateColumns: `repeat(${COLS}, ${BLOCK_SIZE}px)`, 
            gridTemplateRows: `repeat(${ROWS}, ${BLOCK_SIZE}px)` 
          }}
        >
          {grid.map((row, r) => row.map((cell, c) => {
            const { pos, tetromino } = currentPiece.current;
            let isCurrent = false;
            let currentColor = '';
            if (isPlaying && !gameOver) {
              const pr = r - pos.y;
              const pc = c - pos.x;
              if (pr >= 0 && pr < tetromino.shape.length && pc >= 0 && pc < tetromino.shape[0].length) {
                if (tetromino.shape[pr][pc] !== 0) {
                  isCurrent = true;
                  currentColor = tetromino.color;
                }
              }
            }
            return (
              <div 
                key={`${r}-${c}`} 
                className={`h-full w-full rounded-sm ${isCurrent ? currentColor : cell || 'bg-black'}`} 
              />
            );
          }))}
        </div>

        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
            {gameOver ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
                <h2 className="text-3xl font-black text-white mb-2">GAME OVER</h2>
                <p className="text-gray-400 mb-6">Final Score: {score}</p>
                <button 
                  onClick={resetGame}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 font-bold text-white transition-all hover:bg-indigo-700 active:scale-95"
                >
                  <RotateCcw className="h-5 w-5" />
                  Try Again
                </button>
              </motion.div>
            ) : (
              <button 
                onClick={resetGame}
                className="flex items-center gap-3 rounded-2xl bg-indigo-600 px-8 py-4 text-xl font-bold text-white transition-all hover:bg-indigo-700 hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/25"
              >
                <Play className="h-6 w-6 fill-current" />
                PLAY TETRIS
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-sm">
        <div className="rounded-xl bg-white/5 p-4 border border-white/10 text-center">
          <span className="block text-xs font-medium uppercase text-gray-500 mb-1">Controls</span>
          <p className="text-xs text-gray-300">Arrows: Move & Rotate</p>
        </div>
        <div className="rounded-xl bg-white/5 p-4 border border-white/10 text-center">
          <span className="block text-xs font-medium uppercase text-gray-500 mb-1">Goal</span>
          <p className="text-xs text-gray-300">Clear lines to score</p>
        </div>
      </div>
    </div>
  );
}
