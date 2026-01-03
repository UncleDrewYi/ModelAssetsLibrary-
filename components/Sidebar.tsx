
import React from 'react';
import { Filter, Layers, FileCode, SlidersHorizontal, Triangle, Activity } from 'lucide-react';
import { CATEGORIES, FORMATS } from '../constants';
import { AssetCategory, FileFormat } from '../types';

interface SidebarProps {
  activeCategory: string;
  setActiveCategory: (val: any) => void;
  activeFormat: string;
  setActiveFormat: (val: any) => void;
  maxPoly: number;
  setMaxPoly: (val: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeCategory,
  setActiveCategory,
  activeFormat,
  setActiveFormat,
  maxPoly,
  setMaxPoly
}) => {
  return (
    <aside className="w-64 fixed left-0 top-16 bottom-0 bg-[#1A1A1A] border-r border-[#2E2E2E] p-6 overflow-y-auto scrollbar-hide z-40 shadow-2xl">
      <div className="flex items-center gap-2 mb-10 text-gray-500">
        <Activity className="w-3.5 h-3.5 text-blue-500" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Filter Manifest</span>
      </div>

      <section className="mb-10">
        <div className="flex items-center gap-2 mb-5 text-gray-300">
          <Layers className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-black uppercase tracking-widest">Classification</h3>
        </div>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as AssetCategory | 'All')}
              className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all group relative overflow-hidden ${
                activeCategory === cat
                  ? 'bg-blue-600/10 text-blue-400 font-bold border border-blue-600/20'
                  : 'text-gray-500 hover:bg-[#2E2E2E] hover:text-gray-200'
              }`}
            >
              <span className="relative z-10">{cat}</span>
              {activeCategory === cat && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center gap-2 mb-5 text-gray-300">
          <FileCode className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-black uppercase tracking-widest">Protocol</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {FORMATS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFormat(f as FileFormat | 'All')}
              className={`px-3 py-1.5 rounded-md text-[10px] font-black tracking-[0.1em] transition-all border ${
                activeFormat === f
                  ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                  : 'bg-[#121212] text-gray-500 border-[#2E2E2E] hover:border-gray-500'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center gap-2 mb-5 text-gray-300">
          <Triangle className="w-4 h-4 text-orange-400" />
          <h3 className="text-xs font-black uppercase tracking-widest">Topology Stress</h3>
        </div>
        <div className="space-y-5">
          <div className="relative pt-2">
             <input
              type="range"
              min="0"
              max="150000"
              step="5000"
              value={maxPoly}
              onChange={(e) => setMaxPoly(parseInt(e.target.value))}
              className="w-full h-1.5 bg-[#2E2E2E] rounded-full appearance-none cursor-pointer accent-blue-500"
            />
          </div>
          <div className="flex justify-between text-[9px] font-black text-gray-600 uppercase tracking-widest">
            <span>Low-Fi</span>
            <span className="text-blue-500 font-black">
              {maxPoly > 140000 ? 'UNLIMITED' : `${Math.round(maxPoly/1000)}k POLY MAX`}
            </span>
          </div>
        </div>
      </section>

      <div className="mt-auto pt-10 border-t border-[#2E2E2E]">
        <button 
          onClick={() => {
            setActiveCategory('All');
            setActiveFormat('All');
            setMaxPoly(150000);
          }}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#2E2E2E]/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white hover:bg-[#2E2E2E] transition-all border border-transparent hover:border-gray-700"
        >
          <SlidersHorizontal className="w-3 h-3" />
          Purge Active Filters
        </button>
      </div>
    </aside>
  );
};
