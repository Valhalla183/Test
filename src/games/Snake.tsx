import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Trophy, Play } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function Snake() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(Number(localStorage.getItem('snake-highscore')) || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      const isColliding = snake.some(segment => segment.x === newFood!.x && segment.y === newFood!.y);
      if (!isColliding) break;
    }
    setFood(newFood);
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (gameOver || !isPlaying) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check collision with food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPlaying, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, 150);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => { if (gameLoopRef.current) clearInterval(gameLoopRef.current); };
  }, [isPlaying, gameOver, moveSnake]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snake-highscore', score.toString());
    }
  }, [score, highScore]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    generateFood();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex w-full max-w-md items-center justify-between rounded-2xl bg-white/5 p-4 border border-white/10">
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

      <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl border-4 border-white/10 bg-black shadow-2xl">
        <div 
          className="grid h-full w-full" 
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some(s => s.x === x && s.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`h-full w-full rounded-sm transition-all duration-150 ${
                  isHead ? 'bg-indigo-500 scale-110 z-10 shadow-lg shadow-indigo-500/50' : 
                  isSnake ? 'bg-indigo-600/60' : 
                  isFood ? 'bg-rose-500 animate-pulse rounded-full scale-75 shadow-lg shadow-rose-500/50' : 
                  'bg-transparent'
                }`}
              />
            );
          })}
        </div>

        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
            {gameOver ? (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <h2 className="mb-2 text-4xl font-black text-white">GAME OVER</h2>
                <p className="mb-6 text-gray-400">Final Score: {score}</p>
                <button 
                  onClick={resetGame}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition-all hover:bg-indigo-700 active:scale-95"
                >
                  <RotateCcw className="h-5 w-5" />
                  Try Again
                </button>
              </motion.div>
            ) : (
              <button 
                onClick={() => setIsPlaying(true)}
                className="flex items-center gap-3 rounded-2xl bg-indigo-600 px-8 py-4 text-xl font-bold text-white transition-all hover:bg-indigo-700 hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/25"
              >
                <Play className="h-6 w-6 fill-current" />
                Start Game
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-md">
        <div className="rounded-xl bg-white/5 p-4 border border-white/10 text-center">
          <span className="block text-xs font-medium uppercase text-gray-500 mb-1">Controls</span>
          <p className="text-sm text-gray-300">Use Arrow Keys to move</p>
        </div>
        <div className="rounded-xl bg-white/5 p-4 border border-white/10 text-center">
          <span className="block text-xs font-medium uppercase text-gray-500 mb-1">Objective</span>
          <p className="text-sm text-gray-300">Eat apples to grow</p>
        </div>
      </div>
    </div>
  );
}
