export interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: 'Arcade' | 'Puzzle' | 'Action' | 'Classic';
  popular?: boolean;
}

export interface GameState {
  score: number;
  highScore: number;
  status: 'idle' | 'playing' | 'gameover';
}
