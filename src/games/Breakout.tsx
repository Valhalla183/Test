import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Trophy, Play } from 'lucide-react';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
const BALL_SIZE = 10;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 10;
const BRICK_OFFSET_TOP = 40;
const BRICK_OFFSET_LEFT = 35;

export default function Breakout() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(Number(localStorage.getItem('breakout-highscore')) || 0);

  const gameState = useRef({
    paddleX: (CANVAS_WIDTH - PADDLE_WIDTH) / 2,
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT - 30,
    ballDX: 3,
    ballDY: -3,
    bricks: Array.from({ length: BRICK_COLS }, () => 
      Array.from({ length: BRICK_ROWS }, () => ({ x: 0, y: 0, status: 1 }))
    )
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    gameState.current.paddleX = Math.max(0, Math.min(CANVAS_WIDTH - PADDLE_WIDTH, relativeX - PADDLE_WIDTH / 2));
  };

  const collisionDetection = () => {
    const state = gameState.current;
    for (let c = 0; c < BRICK_COLS; c++) {
      for (let r = 0; r < BRICK_ROWS; r++) {
        const b = state.bricks[c][r];
        if (b.status === 1) {
          if (state.ballX > b.x && state.ballX < b.x + (CANVAS_WIDTH - 2 * BRICK_OFFSET_LEFT) / BRICK_COLS - BRICK_PADDING &&
              state.ballY > b.y && state.ballY < b.y + BRICK_HEIGHT) {
            state.ballDY = -state.ballDY;
            b.status = 0;
            setScore(s => s + 10);
            if (score + 10 === BRICK_ROWS * BRICK_COLS * 10) {
              setGameOver(true);
              setIsPlaying(false);
            }
          }
        }
      }
    }
  };

  const update = () => {
    if (!isPlaying || gameOver) return;

    const state = gameState.current;
    
    if (state.ballX + state.ballDX > CANVAS_WIDTH - BALL_SIZE || state.ballX + state.ballDX < BALL_SIZE) {
      state.ballDX = -state.ballDX;
    }
    if (state.ballY + state.ballDY < BALL_SIZE) {
      state.ballDY = -state.ballDY;
    } else if (state.ballY + state.ballDY > CANVAS_HEIGHT - BALL_SIZE - PADDLE_HEIGHT) {
      if (state.ballX > state.paddleX && state.ballX < state.paddleX + PADDLE_WIDTH) {
        state.ballDY = -state.ballDY;
        // Add some angle based on where it hits the paddle
        const hitPoint = (state.ballX - (state.paddleX + PADDLE_WIDTH / 2)) / (PADDLE_WIDTH / 2);
        state.ballDX = hitPoint * 5;
      } else if (state.ballY + state.ballDY > CANVAS_HEIGHT - BALL_SIZE) {
        setGameOver(true);
        setIsPlaying(false);
      }
    }

    state.ballX += state.ballDX;
    state.ballY += state.ballDY;
    collisionDetection();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      update();
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw bricks
      const brickWidth = (CANVAS_WIDTH - 2 * BRICK_OFFSET_LEFT) / BRICK_COLS - BRICK_PADDING;
      for (let c = 0; c < BRICK_COLS; c++) {
        for (let r = 0; r < BRICK_ROWS; r++) {
          if (gameState.current.bricks[c][r].status === 1) {
            const brickX = c * (brickWidth + BRICK_PADDING) + BRICK_OFFSET_LEFT;
            const brickY = r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;
            gameState.current.bricks[c][r].x = brickX;
            gameState.current.bricks[c][r].y = brickY;
            
            ctx.beginPath();
            ctx.roundRect(brickX, brickY, brickWidth, BRICK_HEIGHT, 4);
            ctx.fillStyle = `hsl(${220 + r * 20}, 70%, 50%)`;
            ctx.fill();
            ctx.closePath();
          }
        }
      }

      // Draw ball
      ctx.beginPath();
      ctx.arc(gameState.current.ballX, gameState.current.ballY, BALL_SIZE, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.closePath();

      // Draw paddle
      ctx.beginPath();
      ctx.roundRect(gameState.current.paddleX, CANVAS_HEIGHT - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT, 8);
      ctx.fillStyle = '#6366f1';
      ctx.fill();
      ctx.closePath();

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, gameOver]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('breakout-highscore', score.toString());
    }
  }, [score, highScore]);

  const resetGame = () => {
    gameState.current = {
      paddleX: (CANVAS_WIDTH - PADDLE_WIDTH) / 2,
      ballX: CANVAS_WIDTH / 2,
      ballY: CANVAS_HEIGHT - 30,
      ballDX: 3,
      ballDY: -3,
      bricks: Array.from({ length: BRICK_COLS }, () => 
        Array.from({ length: BRICK_ROWS }, () => ({ x: 0, y: 0, status: 1 }))
      )
    };
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex w-full max-w-2xl items-center justify-between rounded-2xl bg-white/5 p-4 border border-white/10">
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

      <div className="relative overflow-hidden rounded-2xl border-4 border-white/10 bg-black shadow-2xl cursor-none">
        <canvas 
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onMouseMove={handleMouseMove}
          className="max-w-full"
        />

        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
            {gameOver ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
                <h2 className="mb-2 text-4xl font-black text-white">
                  {score === BRICK_ROWS * BRICK_COLS * 10 ? 'YOU WIN!' : 'GAME OVER'}
                </h2>
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
    </div>
  );
}
