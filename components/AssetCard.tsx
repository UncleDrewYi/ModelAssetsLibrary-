
import React from 'react';
import { Asset } from '../types';
import { Box, User, HardDrive, CheckCircle2, ChevronRight, Triangle } from 'lucide-react';

interface AssetCardProps {
  asset: Asset;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
  return (
    <div className="group relative bg-[#1E1E1E] rounded-2xl border border-[#2E2E2E] overflow-hidden hover:border-blue-500/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] transition-all duration-500 flex flex-col h-full">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0A0A0A]">
        <img
          src={asset.thumbnail}
          alt={asset.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-70 group-hover:opacity-100 grayscale-[20%] group-hover:grayscale-0"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
          <button className="bg-white text-black font-black text-[10px] tracking-[0.2em] py-3 px-8 rounded-full flex items-center gap-3 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 shadow-2xl hover:bg-blue-500 hover:text-white uppercase">
            Initialize 3D
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xl text-[9px] font-black text-blue-400 px-3 py-1 rounded-full border border-blue-500/30 uppercase tracking-[0.1em] shadow-lg">
          {asset.category}
        </div>
        
        {asset.sketchfabUid && (
          <div className="absolute top-4 right-4 bg-emerald-600/90 backdrop-blur-md text-[8px] font-black text-white px-2 py-0.5 rounded border border-emerald-400/30 uppercase tracking-widest shadow-lg">
            Live View
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-gray-100 font-bold text-lg mb-1 truncate leading-tight group-hover:text-white transition-colors tracking-tight">
          {asset.title}
        </h3>
        <div className="flex items-center gap-2 text-gray-500 mb-6">
          <div className="w-4 h-4 rounded-full bg-gray-700 flex items-center justify-center">
             <User className="w-2.5 h-2.5 text-gray-400" />
          </div>
          <span className="text-[11px] font-semibold hover:text-blue-400 cursor-pointer transition-colors uppercase tracking-wider">{asset.author}</span>
        </div>

        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex gap-5">
            <div className="flex flex-col">
              <span className="text-[8px] uppercase font-black text-gray-600 tracking-[0.15em] mb-0.5">Tris</span>
              <span className="text-xs font-black text-gray-300 tracking-tight">{asset.tris}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] uppercase font-black text-gray-600 tracking-[0.15em] mb-0.5">Lod</span>
              <div className="flex items-center gap-1">
                 <span className={`text-[10px] font-black ${asset.hasLOD ? 'text-emerald-500' : 'text-rose-500/50'}`}>
                  {asset.hasLOD ? "READY" : "NA"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#121212] px-3 py-1 rounded-lg text-[10px] font-black text-gray-500 border border-white/5 group-hover:border-blue-500/20 group-hover:text-blue-400 transition-all shadow-inner">
            {asset.format}
          </div>
        </div>
      </div>
    </div>
  );
};
