import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Trophy, Play, Layers } from 'lucide-react';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;
const BLOCK_HEIGHT = 40;
const INITIAL_WIDTH = 200;

interface Block {
  x: number;
  y: number;
  width: number;
  color: string;
}

export default function TowerStack() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [currentBlock, setCurrentBlock] = useState<Block | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(Number(localStorage.getItem('tower-highscore')) || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [direction, setDirection] = useState(1);
  
  const speed = useRef(4);

  const startGame = () => {
    const firstBlock = {
      x: (CANVAS_WIDTH - INITIAL_WIDTH) / 2,
      y: CANVAS_HEIGHT - BLOCK_HEIGHT,
      width: INITIAL_WIDTH,
      color: 'bg-indigo-600'
    };
    setBlocks([firstBlock]);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    speed.current = 4;
    spawnBlock(firstBlock);
  };

  const spawnBlock = (prevBlock: Block) => {
    setCurrentBlock({
      x: 0,
      y: prevBlock.y - BLOCK_HEIGHT,
      width: prevBlock.width,
      color: `hsl(${220 + (score + 1) * 10}, 70%, 50%)`
    });
    setDirection(1);
  };

  const placeBlock = () => {
    if (!currentBlock || !isPlaying || gameOver) return;

    const prevBlock = blocks[blocks.length - 1];
    const diff = currentBlock.x - prevBlock.x;
    const absDiff = Math.abs(diff);

    if (absDiff >= prevBlock.width) {
      setGameOver(true);
      setIsPlaying(false);
      return;
    }

    const newWidth = prevBlock.width - absDiff;
    const newX = diff > 0 ? currentBlock.x : prevBlock.x;
    
    const placedBlock = { ...currentBlock, x: newX, width: newWidth };
    const newBlocks = [...blocks, placedBlock];
    
    // Scroll view if needed
    if (newBlocks.length > 5) {
      newBlocks.forEach(b => b.y += BLOCK_HEIGHT);
    }

    setBlocks(newBlocks);
    setScore(s => s + 1);
    speed.current += 0.2;
    spawnBlock(placedBlock);
  };

  useEffect(() => {
    if (isPlaying && !gameOver && currentBlock) {
      const interval = setInterval(() => {
        setCurrentBlock(prev => {
          if (!prev) return null;
          let newX = prev.x + direction * speed.current;
          if (newX + prev.width > CANVAS_WIDTH || newX < 0) {
            setDirection(d => -d);
            newX = prev.x;
          }
          return { ...prev, x: newX };
        });
      }, 16);
      return () => clearInterval(interval);
    }
  }, [isPlaying, gameOver, currentBlock, direction]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('tower-highscore', score.toString());
    }
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 flex w-full max-w-sm items-center justify-between rounded-2xl bg-white/5 p-4 border border-white/10">
        <div className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Score</span>
          <span className="text-2xl font-bold text-white">{score}</span>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-500">
          <Layers className="h-7 w-7" />
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Best</span>
          <div className="flex items-center gap-2 text-2xl font-bold text-indigo-400">
            <Trophy className="h-5 w-5" />
            {highScore}
          </div>
        </div>
      </div>

      <div 
        className="relative w-full max-w-sm h-[500px] rounded-3xl bg-black border-4 border-white/10 shadow-2xl overflow-hidden cursor-pointer"
        onClick={placeBlock}
      >
        {/* Placed Blocks */}
        {blocks.map((block, i) => (
          <div
            key={i}
            className={`absolute rounded-sm transition-all duration-300 ${block.color} border border-white/10`}
            style={{
              left: block.x,
              top: block.y,
              width: block.width,
              height: BLOCK_HEIGHT
            }}
          />
        ))}

        {/* Moving Block */}
        {currentBlock && isPlaying && !gameOver && (
          <div
            className={`absolute rounded-sm ${currentBlock.color} border border-white/10`}
            style={{
              left: currentBlock.x,
              top: currentBlock.y,
              width: currentBlock.width,
              height: BLOCK_HEIGHT
            }}
          />
        )}

        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20">
            {gameOver ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
                <h2 className="text-4xl font-black text-white mb-2">CRASHED!</h2>
                <p className="text-gray-400 mb-6">Tower Height: {score}</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); startGame(); }}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 font-bold text-white transition-all hover:bg-indigo-700 active:scale-95"
                >
                  <RotateCcw className="h-5 w-5" />
                  Try Again
                </button>
              </motion.div>
            ) : (
              <div className="text-center">
                <button 
                  onClick={(e) => { e.stopPropagation(); startGame(); }}
                  className="flex items-center gap-3 rounded-2xl bg-indigo-600 px-10 py-5 text-2xl font-black text-white transition-all hover:bg-indigo-700 hover:scale-105 active:scale-95 shadow-2xl shadow-indigo-500/30"
                >
                  <Play className="h-8 w-8 fill-current" />
                  START STACKING
                </button>
                <p className="mt-6 text-sm text-gray-400">Click or tap to place the block</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
