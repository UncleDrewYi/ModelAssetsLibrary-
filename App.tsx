
import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AssetCard } from './components/AssetCard';
import { AssetDetail } from './components/AssetDetail';
import { MOCK_ASSETS } from './constants';
import { FilterState, Asset } from './types';
import { LayoutGrid, List, SlidersHorizontal, PackageSearch } from 'lucide-react';

const App: React.FC = () => {
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'All',
    format: 'All',
    maxPoly: 150000
  });

  const filteredAssets = useMemo(() => {
    return MOCK_ASSETS.filter((asset) => {
      const matchesSearch = asset.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) || 
                           asset.author.toLowerCase().includes(filters.searchQuery.toLowerCase());
      const matchesCategory = filters.category === 'All' || asset.category === filters.category;
      const matchesFormat = filters.format === 'All' || asset.format === filters.format;
      const matchesPoly = filters.maxPoly === 150000 || asset.polyCount <= filters.maxPoly;
      
      return matchesSearch && matchesCategory && matchesFormat && matchesPoly;
    });
  }, [filters]);

  const selectedAsset = useMemo(() => 
    MOCK_ASSETS.find(a => a.id === selectedAssetId), 
    [selectedAssetId]
  );

  return (
    <div className="min-h-screen bg-[#121212] text-white selection:bg-blue-500/30">
      <Navbar 
        searchQuery={filters.searchQuery} 
        setSearchQuery={(val) => setFilters(prev => ({ ...prev, searchQuery: val }))} 
      />
      
      <div className="flex pt-16">
        {!selectedAssetId && (
          <Sidebar 
            activeCategory={filters.category}
            setActiveCategory={(val) => setFilters(prev => ({ ...prev, category: val }))}
            activeFormat={filters.format}
            setActiveFormat={(val) => setFilters(prev => ({ ...prev, format: val }))}
            maxPoly={filters.maxPoly}
            setMaxPoly={(val) => setFilters(prev => ({ ...prev, maxPoly: val }))}
          />
        )}
        
        <main className={`flex-1 transition-all duration-500 ${selectedAssetId ? 'ml-0' : 'ml-64'} min-h-[calc(100vh-64px)]`}>
          {selectedAsset ? (
            <AssetDetail 
              asset={selectedAsset} 
              onBack={() => setSelectedAssetId(null)} 
            />
          ) : (
            <div className="p-8 pb-20">
              <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                  <h1 className="text-2xl font-bold mb-1">Internal Asset Library</h1>
                  <p className="text-gray-500 text-sm font-medium">
                    {filteredAssets.length} results of {MOCK_ASSETS.length} global entities
                  </p>
                </div>
                
                <div className="flex items-center gap-3 bg-[#1A1A1A] p-1.5 rounded-xl border border-[#2E2E2E]">
                  <button className="p-2 bg-[#2E2E2E] text-white rounded-lg shadow-sm">
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-300">
                    <List className="w-4 h-4" />
                  </button>
                  <div className="h-4 w-px bg-[#2E2E2E] mx-1"></div>
                  <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-tighter">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    Sort: Latest
                  </button>
                </div>
              </header>

              {filteredAssets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredAssets.map((asset) => (
                    <div key={asset.id} onClick={() => setSelectedAssetId(asset.id)} className="cursor-pointer">
                      <AssetCard asset={asset} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                  <div className="bg-[#1A1A1A] p-8 rounded-full border border-[#2E2E2E] mb-8 shadow-inner">
                    <PackageSearch className="w-16 h-16 text-gray-700" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-200 mb-2 tracking-tight">Zero Matches Found</h3>
                  <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
                    We couldn't find any internal assets matching your search criteria. Try broadening your polygon limits or checking the project tags.
                  </p>
                  <button 
                    onClick={() => setFilters({ searchQuery: '', category: 'All', format: 'All', maxPoly: 150000 })}
                    className="px-6 py-2.5 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded-full font-bold text-sm hover:bg-blue-600/20 transition-all"
                  >
                    Reset Environment Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
      
      {!selectedAssetId && (
        <footer className="fixed bottom-0 left-64 right-0 h-10 bg-[#1A1A1A]/80 backdrop-blur-md border-t border-[#2E2E2E] px-6 flex items-center justify-between text-[10px] text-gray-600 font-black uppercase tracking-widest z-40">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              Forge-Engine: Connected
            </span>
            <span>Asset API: v4.2-STABLE</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-gray-400 cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-gray-400 cursor-pointer transition-colors">API Keys</span>
            <span className="text-gray-800">© 2025 ForgeVault Inc.</span>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
