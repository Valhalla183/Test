import React from 'react';
import { Gamepad2, Search, TrendingUp, Grid, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 transition-transform group-hover:scale-110">
            <Gamepad2 className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">NEXUS<span className="text-indigo-500">GAMES</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Home</Link>
          <Link to="/#popular" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Popular</Link>
          <Link to="/#all" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">All Games</Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search games..." 
              className="h-9 w-64 rounded-full border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors md:hidden">
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
