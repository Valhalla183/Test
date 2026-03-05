import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Trophy, Bomb, Flag } from 'lucide-react';

const GRID_SIZE = 10;
const MINES_COUNT = 15;

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

export default function Minesweeper() {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [minesLeft, setMinesLeft] = useState(MINES_COUNT);

  const initializeGrid = useCallback(() => {
    const newGrid: Cell[][] = Array(GRID_SIZE).fill(null).map(() => 
      Array(GRID_SIZE).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );

    // Place mines
    let placedMines = 0;
    while (placedMines < MINES_COUNT) {
      const r = Math.floor(Math.random() * GRID_SIZE);
      const c = Math.floor(Math.random() * GRID_SIZE);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        placedMines++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (!newGrid[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && newGrid[nr][nc].isMine) {
                count++;
              }
            }
          }
          newGrid[r][c].neighborMines = count;
        }
      }
    }

    setGrid(newGrid);
    setGameOver(false);
    setWin(false);
    setMinesLeft(MINES_COUNT);
  }, []);

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  const revealCell = (r: number, c: number) => {
    if (gameOver || grid[r][c].isRevealed || grid[r][c].isFlagged) return;

    const newGrid = [...grid.map(row => [...row])];
    
    if (newGrid[r][c].isMine) {
      setGameOver(true);
      revealAllMines(newGrid);
      return;
    }

    const reveal = (row: number, col: number) => {
      if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE || newGrid[row][col].isRevealed || newGrid[row][col].isFlagged) return;
      
      newGrid[row][col].isRevealed = true;
      
      if (newGrid[row][col].neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            reveal(row + dr, col + dc);
          }
        }
      }
    };

    reveal(r, c);
    setGrid(newGrid);

    // Check win
    const unrevealedNonMines = newGrid.flat().filter(cell => !cell.isMine && !cell.isRevealed);
    if (unrevealedNonMines.length === 0) {
      setWin(true);
      setGameOver(true);
    }
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || grid[r][c].isRevealed) return;

    const newGrid = [...grid.map(row => [...row])];
    const isFlagged = !newGrid[r][c].isFlagged;
    newGrid[r][c].isFlagged = isFlagged;
    setGrid(newGrid);
    setMinesLeft(prev => isFlagged ? prev - 1 : prev + 1);
  };

  const revealAllMines = (currentGrid: Cell[][]) => {
    currentGrid.forEach(row => row.forEach(cell => {
      if (cell.isMine) cell.isRevealed = true;
    }));
    setGrid(currentGrid);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 flex w-full max-w-md items-center justify-between rounded-2xl bg-white/5 p-4 border border-white/10">
        <div className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Mines</span>
          <div className="flex items-center gap-2 text-2xl font-bold text-rose-500">
            <Bomb className="h-5 w-5" />
            {minesLeft}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Status</span>
          <span className={`text-2xl font-bold ${win ? 'text-emerald-500' : gameOver ? 'text-rose-500' : 'text-white'}`}>
            {win ? 'VICTORY' : gameOver ? 'BOOM!' : 'PLAYING'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-10 gap-1 w-full max-w-md aspect-square p-2 rounded-2xl bg-white/5 border border-white/10 shadow-2xl">
        {grid.map((row, r) => row.map((cell, c) => (
          <button
            key={`${r}-${c}`}
            onClick={() => revealCell(r, c)}
            onContextMenu={(e) => toggleFlag(e, r, c)}
            className={`flex items-center justify-center rounded-md text-sm font-black transition-all ${
              cell.isRevealed 
                ? cell.isMine ? 'bg-rose-600 text-white' : 'bg-white/10 text-indigo-400'
                : 'bg-white/5 hover:bg-white/10 text-transparent'
            }`}
          >
            {cell.isRevealed 
              ? cell.isMine ? <Bomb className="h-4 w-4" /> : cell.neighborMines || '' 
              : cell.isFlagged ? <Flag className="h-4 w-4 text-rose-500" /> : ''}
          </button>
        )))}
      </div>

      {gameOver && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-10 text-center"
        >
          <button 
            onClick={initializeGrid}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 font-bold text-white transition-all hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-500/25"
          >
            <RotateCcw className="h-5 w-5" />
            {win ? 'Play Again' : 'Try Again'}
          </button>
        </motion.div>
      )}

      <div className="mt-8 text-xs text-gray-500 uppercase tracking-widest">
        Left Click to Reveal • Right Click to Flag
      </div>
    </div>
  );
}
