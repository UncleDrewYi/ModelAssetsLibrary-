
import React, { useState, useRef } from 'react';
import { Asset } from '../types';
import { Viewer3D } from './Viewer3D';
import { 
  ArrowLeft, Download, Share2, PlusCircle, Info, 
  Settings, Files, History, CheckCircle2, AlertCircle,
  Maximize2, RefreshCcw, Box, Eye, Bone, Grid, Send,
  Globe, Layout, User, Terminal
} from 'lucide-react';

interface AssetDetailProps {
  asset: Asset;
  onBack: () => void;
}

type TabType = 'info' | 'specs' | 'files' | 'history';

export const AssetDetail: React.FC<AssetDetailProps> = ({ asset, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [wireframe, setWireframe] = useState(false);
  const [textureView, setTextureView] = useState(true);
  const [inspectBones, setInspectBones] = useState(false);
  const [resetCount, setResetCount] = useState(0);
  const viewerContainerRef = useRef<HTMLDivElement>(null);

  const StatusIcon = asset.status === 'Approved' ? CheckCircle2 : AlertCircle;
  const statusColor = asset.status === 'Approved' ? 'text-emerald-500' : 'text-orange-500';

  const toggleFullscreen = () => {
    if (viewerContainerRef.current) {
      if (!document.fullscreenElement) {
        viewerContainerRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  // Derive active source info
  const activeSource = asset.sketchfabUid ? 'SKETCHFAB' : 'LOCAL BUFFER';
  const modelName = asset.localModelUrl ? asset.localModelUrl.split('/').pop() : (asset.sketchfabUid ? asset.title : 'None');

  return (
    <div className="flex flex-col h-full bg-[#121212] animate-in fade-in duration-500">
      <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#1A1A1A] shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="p-2.5 hover:bg-[#2E2E2E] rounded-full transition-all text-gray-400 hover:text-white border border-transparent hover:border-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-black tracking-tight text-white uppercase">{asset.title}</h2>
              <span className="text-[10px] bg-[#2E2E2E] text-gray-400 px-2 py-0.5 rounded-md font-black uppercase tracking-widest border border-white/5">
                {asset.version}
              </span>
            </div>
            <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] mt-1 ${statusColor}`}>
              <StatusIcon className="w-3 h-3" />
              {asset.status}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#2E2E2E] hover:bg-[#3E3E3E] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5">
            <Share2 className="w-3.5 h-3.5" /> Deploy
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#2E2E2E] hover:bg-[#3E3E3E] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5">
            <PlusCircle className="w-3.5 h-3.5" /> Stage
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl shadow-blue-600/30 text-white">
            <Download className="w-3.5 h-3.5" /> Pull Files
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative bg-[#0A0A0A] flex flex-col overflow-y-auto custom-scrollbar">
          <div 
            ref={viewerContainerRef}
            className="relative w-full aspect-[21/9] bg-[#000000] border-b border-white/5 overflow-hidden group/viewer shadow-2xl"
          >
            {asset.sketchfabUid ? (
              <iframe
                src={`https://sketchfab.com/models/${asset.sketchfabUid}/embed?autostart=1&internal=1&tracking=0&ui_ar=0&ui_infos=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_inspector=0&ui_annotations=0&ui_stop=0&ui_vr=0&transparent=0&dnt=1`}
                className="w-full h-full border-0 pointer-events-auto"
                allow="autoplay; fullscreen; xr-spatial-tracking"
                title="Sketchfab Viewer"
              />
            ) : (
              <Viewer3D 
                modelUrl={asset.localModelUrl || '/model.glb'}
                wireframe={wireframe} 
                textureView={textureView} 
                inspectBones={inspectBones}
                resetTrigger={resetCount}
              />
            )}
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 bg-black/80 backdrop-blur-2xl rounded-full border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20 opacity-0 group-hover/viewer:opacity-100 transition-all duration-500 translate-y-4 group-hover/viewer:translate-y-0">
              {!asset.sketchfabUid && (
                <>
                  <button 
                    onClick={() => setWireframe(!wireframe)}
                    className={`p-2.5 rounded-full transition-all ${wireframe ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                    title="Toggle Wireframe"
                  >
                    <Grid className="w-4.5 h-4.5" />
                  </button>
                  <button 
                    onClick={() => setTextureView(!textureView)}
                    className={`p-2.5 rounded-full transition-all ${textureView ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                    title="Toggle Surface"
                  >
                    <Eye className="w-4.5 h-4.5" />
                  </button>
                  <button 
                    onClick={() => setInspectBones(!inspectBones)}
                    className={`p-2.5 rounded-full transition-all ${inspectBones ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                    title="Skeleton View"
                  >
                    <Bone className="w-4.5 h-4.5" />
                  </button>
                  <div className="w-px h-5 bg-white/10 mx-1"></div>
                  <button 
                    onClick={() => setResetCount(c => c + 1)}
                    className="p-2.5 text-gray-400 hover:text-white transition-all active:rotate-180 rounded-full hover:bg-white/10" 
                    title="Recalibrate View"
                  >
                    <RefreshCcw className="w-4.5 h-4.5" />
                  </button>
                </>
              )}
              <button 
                onClick={toggleFullscreen}
                className="p-2.5 text-gray-400 hover:text-white transition-all rounded-full hover:bg-white/10" 
                title="Fullscreen Interface"
              >
                <Maximize2 className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          <div className="p-12 max-w-5xl mx-auto w-full">
            <h3 className="text-xl font-black mb-10 flex items-center gap-3 text-white uppercase tracking-widest">
              Review Protocol
              <span className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                {asset.comments.length} ENTRIES
              </span>
            </h3>
            
            <div className="space-y-8">
              {asset.comments.map(comment => (
                <div key={comment.id} className="flex gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2E2E2E] to-[#1A1A1A] border border-white/10 shrink-0 overflow-hidden p-0.5 shadow-xl">
                    <img src={comment.avatar} alt={comment.user} className="w-full h-full object-cover rounded-[14px]" />
                  </div>
                  <div className="flex-1 bg-[#1A1A1A] border border-white/5 rounded-3xl p-6 transition-all group-hover:border-blue-500/30 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-black text-gray-100 tracking-tight uppercase">{comment.user}</span>
                      <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">{comment.date}</span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed font-medium">{comment.text}</p>
                  </div>
                </div>
              ))}
              
              <div className="flex gap-6 mt-12 bg-[#1A1A1A] border border-blue-500/10 rounded-3xl p-8 shadow-inner">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black shrink-0 shadow-lg shadow-blue-600/20">
                  ADM
                </div>
                <div className="flex-1 relative">
                  <textarea 
                    placeholder="Input technical feedback or modification requests..."
                    className="w-full bg-[#0F0F0F] border border-white/5 rounded-2xl p-5 text-sm focus:outline-none focus:border-blue-500/50 min-h-[140px] resize-none text-gray-200 placeholder-gray-600 transition-all font-medium"
                  />
                  <button className="absolute bottom-4 right-4 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                    Post Log
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="w-[420px] border-l border-white/5 flex flex-col bg-[#1A1A1A] shrink-0 z-20">
          <div className="flex border-b border-white/5 p-2 gap-1 bg-[#151515]">
            {[
              { id: 'info', icon: Info, label: 'Metadata' },
              { id: 'specs', icon: Settings, label: 'Topology' },
              { id: 'files', icon: Files, label: 'Payload' },
              { id: 'history', icon: History, label: 'Changelog' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex-1 py-3.5 flex flex-col items-center gap-1.5 transition-all rounded-xl relative ${
                  activeTab === tab.id ? 'bg-[#252525] text-blue-400 shadow-xl border border-white/5' : 'text-gray-500 hover:text-gray-300 hover:bg-[#202020]'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {activeTab === 'info' && (
              <div className="space-y-10 animate-in slide-in-from-bottom-2 duration-500">
                <section>
                  <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Asset Abstract
                  </h4>
                  <p className="text-sm text-gray-300 leading-loose font-medium">{asset.description}</p>
                </section>
                
                <section>
                  <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Runtime Context
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/40 border border-white/5 p-3 rounded-xl flex flex-col">
                      <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest mb-1">Active Model</span>
                      <span className="text-[10px] text-blue-400 font-bold uppercase truncate">{modelName}</span>
                    </div>
                    <div className="bg-black/40 border border-white/5 p-3 rounded-xl flex flex-col">
                      <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest mb-1">Renderer</span>
                      <span className="text-[10px] text-white font-bold uppercase">{activeSource}</span>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                     <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Project Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {asset.tags.map(tag => (
                      <span key={tag} className="px-3 py-1.5 bg-black border border-white/5 text-gray-500 text-[10px] font-black rounded-lg hover:text-white hover:border-blue-500/30 transition-all cursor-pointer uppercase tracking-widest shadow-sm">
                        # {tag}
                      </span>
                    ))}
                  </div>
                </section>

                <div className="pt-8 border-t border-white/5">
                  <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Origin Author</span>
                    <span className="text-xs text-blue-400 font-black tracking-tight uppercase underline underline-offset-4 decoration-blue-500/30">{asset.author}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-500">
                {[
                  { label: 'Triangle Budget', value: asset.tris },
                  { label: 'UV Mapping Res', value: asset.textureRes },
                  { label: 'Binary Weight', value: asset.fileSize },
                  { label: 'Skeletal Support', value: asset.rigged ? 'L-BONE-RIG' : 'STATIC' },
                  { label: 'LOD Profile', value: asset.hasLOD ? 'DYNAMIC (0-4)' : 'LEGACY' },
                  { label: 'Runtime Target', value: 'UNREAL / UNITY' }
                ].map((spec, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-black/30 border border-white/5 rounded-2xl group hover:border-blue-500/30 transition-all">
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest group-hover:text-gray-400">{spec.label}</span>
                    <span className="text-xs font-black text-white tracking-widest uppercase">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'files' && (
              <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-500">
                {asset.files.map((file, i) => (
                  <div key={i} className="group bg-black/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between hover:border-blue-500/50 hover:bg-black transition-all cursor-pointer shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#1A1A1A] rounded-xl text-gray-500 group-hover:text-blue-400 transition-all shadow-inner">
                        <Box className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-gray-200 truncate max-w-[200px] tracking-tight">{file.name}</span>
                        <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest mt-1">{file.type} • {file.size}</span>
                      </div>
                    </div>
                    <div className="p-2 rounded-full group-hover:bg-blue-600/10 transition-all">
                      <Download className="w-4 h-4 text-gray-600 group-hover:text-blue-400 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="relative pl-8 space-y-10 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-blue-600 before:to-transparent animate-in slide-in-from-bottom-2 duration-500">
                {asset.history.map((entry, i) => (
                  <div key={i} className="relative group/step">
                    <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-[#1A1A1A] border-4 border-blue-600 z-10 shadow-[0_0_15px_rgba(37,99,235,0.4)] group-hover/step:scale-125 transition-all" />
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-black text-white bg-blue-600/20 px-2 py-0.5 rounded border border-blue-500/20 tracking-widest">{entry.version}</span>
                      <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{entry.date}</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-3 font-medium leading-relaxed">{entry.note}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center border border-white/5">
                         <User className="w-2.5 h-2.5 text-gray-500" />
                      </div>
                      <span className="text-[9px] font-black text-blue-500/70 uppercase tracking-widest">{entry.author}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
