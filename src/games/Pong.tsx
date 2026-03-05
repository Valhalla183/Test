import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Trophy, Play } from 'lucide-react';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 10;

export default function Pong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState({ player: 0, computer: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  const gameState = useRef({
    playerY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    computerY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT / 2,
    ballDX: 4,
    ballDY: 4,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top - PADDLE_HEIGHT / 2;
    gameState.current.playerY = Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, y));
  };

  const update = () => {
    if (!isPlaying || gameOver) return;

    const state = gameState.current;
    
    // Move ball
    state.ballX += state.ballDX;
    state.ballY += state.ballDY;

    // Wall collision
    if (state.ballY <= 0 || state.ballY >= CANVAS_HEIGHT - BALL_SIZE) {
      state.ballDY *= -1;
    }

    // Computer AI
    const computerCenter = state.computerY + PADDLE_HEIGHT / 2;
    if (computerCenter < state.ballY - 35) {
      state.computerY += 4;
    } else if (computerCenter > state.ballY + 35) {
      state.computerY -= 4;
    }
    state.computerY = Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, state.computerY));

    // Paddle collision
    if (state.ballX <= PADDLE_WIDTH) {
      if (state.ballY + BALL_SIZE >= state.playerY && state.ballY <= state.playerY + PADDLE_HEIGHT) {
        state.ballDX *= -1.1; // Speed up
        state.ballX = PADDLE_WIDTH;
      } else {
        setScore(s => ({ ...s, computer: s.computer + 1 }));
        resetBall();
      }
    }

    if (state.ballX >= CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE) {
      if (state.ballY + BALL_SIZE >= state.computerY && state.ballY <= state.computerY + PADDLE_HEIGHT) {
        state.ballDX *= -1.1;
        state.ballX = CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE;
      } else {
        setScore(s => ({ ...s, player: s.player + 1 }));
        resetBall();
      }
    }
  };

  const resetBall = () => {
    const state = gameState.current;
    state.ballX = CANVAS_WIDTH / 2;
    state.ballY = CANVAS_HEIGHT / 2;
    state.ballDX = state.ballDX > 0 ? -4 : 4;
    state.ballDY = (Math.random() - 0.5) * 8;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      update();
      
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw middle line
      ctx.setLineDash([10, 10]);
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.beginPath();
      ctx.moveTo(CANVAS_WIDTH / 2, 0);
      ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
      ctx.stroke();

      // Draw paddles
      ctx.fillStyle = '#6366f1'; // Indigo
      ctx.fillRect(0, gameState.current.playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
      
      ctx.fillStyle = '#f43f5e'; // Rose
      ctx.fillRect(CANVAS_WIDTH - PADDLE_WIDTH, gameState.current.computerY, PADDLE_WIDTH, PADDLE_HEIGHT);

      // Draw ball
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(gameState.current.ballX + BALL_SIZE/2, gameState.current.ballY + BALL_SIZE/2, BALL_SIZE/2, 0, Math.PI * 2);
      ctx.fill();

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, gameOver]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex w-full max-w-2xl items-center justify-between rounded-2xl bg-white/5 p-4 border border-white/10">
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold uppercase text-indigo-400">Player</span>
          <span className="text-3xl font-black text-white">{score.player}</span>
        </div>
        <div className="text-xl font-bold text-gray-600">VS</div>
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold uppercase text-rose-400">Computer</span>
          <span className="text-3xl font-black text-white">{score.computer}</span>
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

        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
            <button 
              onClick={() => setIsPlaying(true)}
              className="flex items-center gap-3 rounded-2xl bg-indigo-600 px-8 py-4 text-xl font-bold text-white transition-all hover:bg-indigo-700 hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/25"
            >
              <Play className="h-6 w-6 fill-current" />
              Start Game
            </button>
            <p className="mt-4 text-sm text-gray-400">Move your mouse to control the paddle</p>
          </div>
        )}
      </div>
    </div>
  );
}
