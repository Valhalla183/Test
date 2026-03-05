import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Trophy, Play } from 'lucide-react';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const BIRD_SIZE = 30;
const GRAVITY = 0.25;
const JUMP = -5;
const PIPE_WIDTH = 60;
const PIPE_GAP = 160;
const PIPE_SPEED = 2.5;

export default function FlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(Number(localStorage.getItem('flappy-highscore')) || 0);

  const gameState = useRef({
    birdY: CANVAS_HEIGHT / 2,
    birdVelocity: 0,
    pipes: [] as { x: number; height: number; passed: boolean }[],
    frameCount: 0
  });

  const handleJump = () => {
    if (!isPlaying && !gameOver) {
      setIsPlaying(true);
    }
    if (isPlaying && !gameOver) {
      gameState.current.birdVelocity = JUMP;
    }
  };

  const update = () => {
    if (!isPlaying || gameOver) return;

    const state = gameState.current;
    state.frameCount++;

    // Bird physics
    state.birdVelocity += GRAVITY;
    state.birdY += state.birdVelocity;

    // Pipe generation
    if (state.frameCount % 100 === 0) {
      const minHeight = 50;
      const maxHeight = CANVAS_HEIGHT - PIPE_GAP - 50;
      const height = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
      state.pipes.push({ x: CANVAS_WIDTH, height, passed: false });
    }

    // Pipe movement and collision
    state.pipes.forEach((pipe, index) => {
      pipe.x -= PIPE_SPEED;

      // Collision detection
      if (
        (state.birdY < pipe.height || state.birdY + BIRD_SIZE > pipe.height + PIPE_GAP) &&
        (CANVAS_WIDTH / 4 + BIRD_SIZE > pipe.x && CANVAS_WIDTH / 4 < pipe.x + PIPE_WIDTH)
      ) {
        setGameOver(true);
        setIsPlaying(false);
      }

      // Score tracking
      if (!pipe.passed && pipe.x + PIPE_WIDTH < CANVAS_WIDTH / 4) {
        pipe.passed = true;
        setScore(s => s + 1);
      }
    });

    // Remove off-screen pipes
    state.pipes = state.pipes.filter(pipe => pipe.x + PIPE_WIDTH > 0);

    // Ground/Ceiling collision
    if (state.birdY < 0 || state.birdY + BIRD_SIZE > CANVAS_HEIGHT) {
      setGameOver(true);
      setIsPlaying(false);
    }
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

      // Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw pipes
      state.pipes.forEach(pipe => {
        ctx.fillStyle = '#10b981'; // Emerald
        // Top pipe
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.height);
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.height + PIPE_GAP, PIPE_WIDTH, CANVAS_HEIGHT - (pipe.height + PIPE_GAP));
      });

      // Draw bird
      ctx.fillStyle = '#f59e0b'; // Amber
      ctx.beginPath();
      ctx.roundRect(CANVAS_WIDTH / 4, state.birdY, BIRD_SIZE, BIRD_SIZE, 8);
      ctx.fill();
      ctx.closePath();

      animationId = requestAnimationFrame(render);
    };

    const state = gameState.current;
    render();
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, gameOver]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('flappy-highscore', score.toString());
    }
  }, [score, highScore]);

  const resetGame = () => {
    gameState.current = {
      birdY: CANVAS_HEIGHT / 2,
      birdVelocity: 0,
      pipes: [],
      frameCount: 0
    };
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex w-full max-w-sm items-center justify-between rounded-2xl bg-white/5 p-4 border border-white/10">
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

      <div 
        className="relative overflow-hidden rounded-2xl border-4 border-white/10 bg-black shadow-2xl cursor-pointer"
        onClick={handleJump}
      >
        <canvas 
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="max-w-full"
        />

        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
            {gameOver ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
                <h2 className="mb-2 text-4xl font-black text-white">GAME OVER</h2>
                <p className="mb-6 text-gray-400">Final Score: {score}</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); resetGame(); }}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition-all hover:bg-indigo-700 active:scale-95"
                >
                  <RotateCcw className="h-5 w-5" />
                  Try Again
                </button>
              </motion.div>
            ) : (
              <div className="text-center">
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsPlaying(true); }}
                  className="flex items-center gap-3 rounded-2xl bg-indigo-600 px-8 py-4 text-xl font-bold text-white transition-all hover:bg-indigo-700 hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/25"
                >
                  <Play className="h-6 w-6 fill-current" />
                  Start Game
                </button>
                <p className="mt-6 text-sm text-gray-400">Click or tap to jump</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
