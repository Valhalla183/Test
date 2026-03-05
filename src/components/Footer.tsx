import React from 'react';
import { Gamepad2, Github, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                <Gamepad2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">NEXUS<span className="text-indigo-500">GAMES</span></span>
            </div>
            <p className="max-w-xs text-sm text-gray-400">
              The ultimate destination for classic and modern browser games. Play 15+ games instantly for free.
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-indigo-600 hover:text-white transition-all">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-indigo-600 hover:text-white transition-all">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-indigo-600 hover:text-white transition-all">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t border-white/5 pt-8 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Nexus Games. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
