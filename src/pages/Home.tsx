import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, TrendingUp, Grid, Gamepad2, Sparkles } from 'lucide-react';
import { GAMES } from '../data/games';
import GameCard from '../components/GameCard';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(GAMES.map(g => g.category));
    return Array.from(cats);
  }, []);

  const filteredGames = useMemo(() => {
    return GAMES.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const popularGames = useMemo(() => GAMES.filter(g => g.popular), []);

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/gaming/1920/1080?blur=4" 
            alt="Hero Background" 
            className="h-full w-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>
        
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-semibold text-indigo-400 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              New Games Added Weekly
            </div>
            <h1 className="mb-6 text-5xl font-black tracking-tight text-white sm:text-7xl">
              Level Up Your <span className="text-indigo-500">Gaming</span> Experience
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-300 leading-relaxed">
              Discover a curated collection of 15+ high-quality browser games. No downloads, no installs. Just pure gaming fun instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => document.getElementById('all-games')?.scrollIntoView({ behavior: 'smooth' })}
                className="group flex h-14 items-center gap-2 rounded-2xl bg-indigo-600 px-8 text-lg font-bold text-white transition-all hover:bg-indigo-700 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/25"
              >
                Start Playing Now
                <Gamepad2 className="h-5 w-5 transition-transform group-hover:rotate-12" />
              </button>
              <div className="relative w-full max-w-xs sm:w-auto">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Find your favorite game..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-6 text-white placeholder-gray-500 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Popular Section */}
        {!searchQuery && !selectedCategory && (
          <section id="popular" className="mt-20">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-500">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Popular Games</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {popularGames.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </section>
        )}

        {/* All Games Grid */}
        <section id="all-games" className="mt-24">
          <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-500">
                <Grid className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'All Games'}
              </h2>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  !selectedCategory 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredGames.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 h-20 w-20 rounded-full bg-white/5 flex items-center justify-center text-gray-600">
                <Gamepad2 className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-white">No games found</h3>
              <p className="mt-2 text-gray-400">Try adjusting your search or category filters.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
                className="mt-6 text-indigo-500 hover:text-indigo-400 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
