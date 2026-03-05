import React from 'react';
import Snake from './Snake';
import TicTacToe from './TicTacToe';
import MemoryMatch from './MemoryMatch';
import Pong from './Pong';
import Breakout from './Breakout';
import FlappyBird from './FlappyBird';
import RockPaperScissors from './RockPaperScissors';
import Puzzle2048 from './Puzzle2048';
import WhackAMole from './WhackAMole';
import SimonSays from './SimonSays';
import Hangman from './Hangman';
import Minesweeper from './Minesweeper';
import Tetris from './Tetris';
import ColorMatch from './ColorMatch';
import TowerStack from './TowerStack';

export const GameComponents: Record<string, React.ComponentType> = {
  snake: Snake,
  tictactoe: TicTacToe,
  memory: MemoryMatch,
  pong: Pong,
  breakout: Breakout,
  flappy: FlappyBird,
  rps: RockPaperScissors,
  '2048': Puzzle2048,
  whackamole: WhackAMole,
  simon: SimonSays,
  hangman: Hangman,
  minesweeper: Minesweeper,
  tetris: Tetris,
  colormatch: ColorMatch,
  tower: TowerStack,
};
