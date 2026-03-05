import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Maximize2, Info, Share2, Heart } from 'lucide-react';
import { GAMES } from '../data/games';
import { GameComponents } from '../games';

export default function GamePlayer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const game = GAMES.find(g => g.id === id);
  const GameComponent = id ? GameComponents[id] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!game || !GameComponent) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold text-white mb-4">Game Not Found</h2>
        <p className="text-gray-400 mb-8">The game you are looking for doesn't exist or has been removed.</p>
        <Link to="/" className="rounded-xl bg-indigo-600 px-8 py-3 font-bold text-white hover:bg-indigo-700 transition-all">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 group-hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" />
          </div>
          Back to Games
        </button>
        
        <div className="flex items-center gap-3">
          <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all">
            <Heart className="h-5 w-5" />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600">
                  <Maximize2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">{game.title}</h1>
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">{game.category}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center py-4">
              <GameComponent />
            </div>
          </motion.div>
        </div>

        <div className="space-y-8">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="mb-4 flex items-center gap-2 text-white">
              <Info className="h-5 w-5 text-indigo-500" />
              <h2 className="text-lg font-bold">About {game.title}</h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {game.description}
            </p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Platform</span>
                <span className="text-white font-medium">Web Browser</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Rating</span>
                <span className="text-white font-medium">4.8/5.0</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Players</span>
                <span className="text-white font-medium">1.2M+</span>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-lg font-bold text-white">Related Games</h2>
            <div className="space-y-4">
              {GAMES.filter(g => g.id !== id && g.category === game.category).slice(0, 3).map(related => (
                <Link 
                  key={related.id} 
                  to={`/play/${related.id}`}
                  className="group flex items-center gap-4 rounded-2xl p-2 transition-all hover:bg-white/5"
                >
                  <img 
                    src={related.thumbnail} 
                    alt={related.title} 
                    className="h-16 w-16 rounded-xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{related.title}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{related.category}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
