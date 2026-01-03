
import React from 'react';
import { Search, Upload, Bell, User, Box } from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[#1A1A1A] border-b border-[#2E2E2E] flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-3 cursor-pointer group">
        <div className="bg-blue-600 p-2 rounded-xl group-hover:bg-blue-500 transition-all transform group-hover:rotate-6 shadow-lg shadow-blue-600/20">
          <Box className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
          FORGEVAULT
        </span>
      </div>

      <div className="flex-1 max-w-2xl mx-12">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
          <input
            type="text"
            placeholder="Search game assets, materials, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121212] border border-[#2E2E2E] rounded-full py-2.5 pl-11 pr-5 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder-gray-600"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase px-5 py-2.5 rounded-lg transition-all active:scale-95 shadow-lg shadow-blue-900/30 tracking-widest">
          <Upload className="w-3.5 h-3.5" />
          Ingest Asset
        </button>
        <div className="h-6 w-px bg-[#2E2E2E]"></div>
        <button className="p-2.5 text-gray-500 hover:text-white transition-all relative rounded-lg hover:bg-[#2E2E2E]">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#1A1A1A] shadow-sm"></span>
        </button>
        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-gray-200">Dev_Studio_01</span>
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Administrator</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#2E2E2E] border-2 border-[#3E3E3E] group-hover:border-blue-500 transition-all overflow-hidden p-0.5 shadow-xl">
            <img src="https://i.pravatar.cc/150?u=dev1" alt="Avatar" className="w-full h-full object-cover rounded-full" />
          </div>
        </div>
      </div>
    </nav>
  );
};
