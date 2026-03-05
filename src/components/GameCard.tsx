import React from 'react';
import { motion } from 'motion/react';
import { Play, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3 transition-all hover:border-indigo-500/50 hover:bg-white/10"
    >
      <Link to={`/play/${game.id}`} className="block">
        <div className="relative aspect-video overflow-hidden rounded-xl">
          <img
            src={game.thumbnail}
            alt={game.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/50">
              <Play className="h-6 w-6 fill-current ml-1" />
            </div>
          </div>
          {game.popular && (
            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-indigo-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
              <TrendingUp className="h-3 w-3" />
              Popular
            </div>
          )}
        </div>
        
        <div className="mt-4 px-1 pb-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{game.title}</h3>
            <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
              {game.category}
            </span>
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-gray-400 leading-relaxed">
            {game.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default GameCard;
