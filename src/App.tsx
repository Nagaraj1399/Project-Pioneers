import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Sparkles, Database, MessageSquare, Key, 
  Search, Upload, Image as ImageIcon, SlidersHorizontal, RefreshCw, Layers 
} from 'lucide-react';
import { preSeededToys, type Toy } from './lib/toysData';
import { performVectorSearch, projectQueryToVector } from './lib/vectorSearch';
import { initializeGemini, isGeminiLive, analyzeToyImage } from './lib/geminiService';
import { ConceptLab } from './components/ConceptLab';
import { VectorExplorer } from './components/VectorExplorer';
import { GuideChat } from './components/GuideChat';

export default function App() {
  const [activeTab, setActiveTab] = useState<'store' | 'concept-lab' | 'vector-explorer' | 'guide-chat'>('store');
  const [toys, setToys] = useState<Toy[]>(preSeededToys);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // API Key state
  const [apiKey, setApiKey] = useState('');
  const [isLive, setIsLive] = useState(false);

  // Multimodal image upload state
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [isImageAnalyzing, setIsImageAnalyzing] = useState(false);
  const [detectedQuery, setDetectedQuery] = useState<string | null>(null);

  // Sync isLive state with actual service state
  useEffect(() => {
    setIsLive(isGeminiLive());
  }, [apiKey]);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setApiKey(val);
    if (val.trim() === '') {
      initializeGemini('');
      setIsLive(false);
    } else {
      const ok = initializeGemini(val);
      setIsLive(ok);
    }
  };

  const handleAddToyToInventory = (newToy: Toy) => {
    setToys(prev => [newToy, ...prev]);
  };

  // Perform semantic search query
  const getFilteredToys = () => {
    let result = [...toys];
    
    // Apply category filter first if not 'All'
    if (selectedCategory !== 'All') {
      result = result.filter(toy => toy.category === selectedCategory);
    }

    const activeQuery = detectedQuery || searchQuery;

    // Apply vector semantic search if query is present
    if (activeQuery.trim() !== '') {
      const queryVector = projectQueryToVector(activeQuery);
      const searchResults = performVectorSearch(queryVector, result);
      
      // Map similarity scores and sort
      return searchResults.map(res => ({
        ...res.toy,
        similarity: res.similarity,
        highlight: true
      }));
    }

    return result.map(toy => ({ ...toy, similarity: undefined, highlight: false }));
  };

  // Image Upload handler for Multimodal search
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64String = event.target?.result as string;
      setImageFile(base64String);
      setIsImageAnalyzing(true);
      setDetectedQuery(null);

      try {
        // Strip data prefix: "data:image/jpeg;base64,..." -> "..."
        const cleanBase64 = base64String.split(',')[1];
        const analysis = await analyzeToyImage(cleanBase64, file.type);
        
        // Use detected search query to trigger semantic search
        setDetectedQuery(analysis.queryText);
        setSearchQuery(analysis.queryText);
        alert(`🔍 Multimodal Scan Successful!\n\nGemini identified a: "${analysis.name}" (${analysis.category})\nSearch tags: "${analysis.queryText}"\n\nDatabase has updated recommendations!`);
      } catch (err: any) {
        alert(err.message || "Failed to analyze image.");
        setImageFile(null);
      } finally {
        setIsImageAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const resetImageSearch = () => {
    setImageFile(null);
    setDetectedQuery(null);
    setSearchQuery('');
  };

  const categories = ['All', 'Robotics', 'Wooden Toys', 'STEM', 'Plushies', 'Vehicles', 'Creative Play', 'Tabletop', 'Outdoor'];
  const filteredToys = getFilteredToys();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Dynamic Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

      {/* 1. Global Header Bar */}
      <header className="glass-panel mx-4 mt-4 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-purple-500 to-cyan-500 rounded-xl text-white shadow-lg animate-float">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight flex items-center gap-1.5 leading-none m-0">
              <span className="gradient-text-accent">Toy Store</span> of the Future
            </h1>
            <p className="text-[10px] md:text-xs text-gray-400 font-mono mt-1 tracking-wider uppercase flex items-center gap-1">
              <Database size={11} className="text-cyan-400" /> Code Vipassana Database & AI Codelab
            </p>
          </div>
        </div>

        {/* API Settings configuration panel */}
        <div className="flex items-center gap-3 bg-slate-950/60 border border-white/5 px-4 py-2 rounded-2xl w-full md:w-auto">
          <Key size={16} className={isLive ? "text-cyan-400" : "text-gray-500"} />
          <input
            type="password"
            placeholder={isLive ? "Gemini Key: Active" : "Paste Gemini API Key to Go Live"}
            value={apiKey}
            onChange={handleApiKeyChange}
            className="bg-transparent border-none text-xs text-white placeholder-gray-500 focus:outline-none w-full md:w-48"
          />
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]' : 'bg-amber-500 animate-pulse'}`} />
          <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">
            {isLive ? 'Live' : 'Simulation'}
          </span>
        </div>
      </header>

      {/* 2. Main Content Dashboard Container */}
      <main className="flex-1 mx-4 my-6 grid dashboard-layout z-10">
        {/* Navigation Sidebar */}
        <aside className="glass-panel p-4 flex flex-col gap-2 h-fit">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-3 mb-2">Navigation Workspace</div>
          
          <button
            onClick={() => { setActiveTab('store'); resetImageSearch(); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'store' 
                ? 'bg-purple-500/15 border border-purple-500/30 text-purple-300 shadow-md shadow-purple-500/5' 
                : 'text-gray-400 border border-transparent hover:bg-white/5 hover:text-white'
            }`}
          >
            <ShoppingBag size={18} />
            <span>Futuristic Storefront</span>
          </button>

          <button
            onClick={() => { setActiveTab('concept-lab'); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'concept-lab' 
                ? 'bg-purple-500/15 border border-purple-500/30 text-purple-300 shadow-md shadow-purple-500/5' 
                : 'text-gray-400 border border-transparent hover:bg-white/5 hover:text-white'
            }`}
          >
            <Sparkles size={18} />
            <span>Imagen Concept Lab</span>
          </button>

          <button
            onClick={() => { setActiveTab('vector-explorer'); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'vector-explorer' 
                ? 'bg-purple-500/15 border border-purple-500/30 text-purple-300 shadow-md shadow-purple-500/5' 
                : 'text-gray-400 border border-transparent hover:bg-white/5 hover:text-white'
            }`}
          >
            <Database size={18} />
            <span>pgvector Explorer</span>
          </button>

          <button
            onClick={() => { setActiveTab('guide-chat'); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'guide-chat' 
                ? 'bg-purple-500/15 border border-purple-500/30 text-purple-300 shadow-md shadow-purple-500/5' 
                : 'text-gray-400 border border-transparent hover:bg-white/5 hover:text-white'
            }`}
          >
            <MessageSquare size={18} />
            <span>Codelab AI Guide</span>
          </button>

          {/* Quick Stats Panel */}
          <div className="mt-8 border-t border-white/5 pt-4 px-3 space-y-3">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={12} /> Active Catalog Statistics
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-950/60 border border-white/5 p-2 rounded-lg text-center">
                <span className="text-[9px] text-gray-500 block">Inventory</span>
                <span className="text-cyan-400 font-bold">{toys.length} Toys</span>
              </div>
              <div className="bg-slate-950/60 border border-white/5 p-2 rounded-lg text-center">
                <span className="text-[9px] text-gray-500 block">Dimensions</span>
                <span className="text-purple-400 font-bold">12 Vectors</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Dynamic Display Panels */}
        <section className="flex-1 overflow-hidden min-h-[500px]">
          {activeTab === 'concept-lab' && (
            <ConceptLab onAddToyToInventory={handleAddToyToInventory} isLiveMode={isLive} />
          )}

          {activeTab === 'vector-explorer' && (
            <VectorExplorer toys={toys} />
          )}

          {activeTab === 'guide-chat' && (
            <GuideChat />
          )}

          {/* Core Storefront Dashboard */}
          {activeTab === 'store' && (
            <div className="space-y-6">
              {/* Dynamic Semantic Search Bar & Image Upload dock */}
              <div className="glass-panel p-6 space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  
                  {/* Semantic Text search Input */}
                  <div className="relative flex-1 w-full">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (detectedQuery) setDetectedQuery(null);
                      }}
                      placeholder="Semantic search (e.g. 'cuddly glowing space dragon for baby' or 'wood vehicle that moves')..."
                      className="w-full bg-slate-950/60 border border-white/10 rounded-2xl py-4.5 pl-5 pr-12 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all shadow-inner"
                    />
                    <Search className="absolute right-4 top-4 text-gray-500" size={20} />
                  </div>

                  {/* Multimodal Image Search Upload Button */}
                  <div className="w-full md:w-auto flex-shrink-0 flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      id="image-search-upload"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isImageAnalyzing}
                    />
                    <label
                      htmlFor="image-search-upload"
                      className={`glow-btn-secondary py-3 px-5 cursor-pointer flex items-center justify-center gap-2.5 w-full md:w-auto ${
                        isImageAnalyzing ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isImageAnalyzing ? (
                        <RefreshCw size={18} className="animate-spin text-purple-400" />
                      ) : (
                        <Upload size={18} className="text-cyan-400" />
                      )}
                      <span>{isImageAnalyzing ? "Analyzing..." : "Multimodal Image Search"}</span>
                    </label>

                    {imageFile && (
                      <button 
                        onClick={resetImageSearch}
                        className="bg-pink-500/10 border border-pink-500/30 text-pink-400 p-3.5 rounded-xl hover:bg-pink-500/20 transition"
                        title="Clear image search"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Multimodal Image Preview Dock */}
                {imageFile && (
                  <div className="flex items-center gap-4 bg-slate-950/40 border border-cyan-500/20 p-3 rounded-xl">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10">
                      <img src={imageFile} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-cyan-500/10 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
                        <ImageIcon size={12} /> Multimodal Query Loaded
                      </h4>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                        Similarity matched based on Gemini vision attributes.
                      </p>
                    </div>
                  </div>
                )}

                {/* Category Selection Filter Line */}
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-1.5">
                  <SlidersHorizontal size={14} className="text-gray-500 flex-shrink-0" />
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all duration-200 flex-shrink-0 ${
                        selectedCategory === cat 
                          ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-300' 
                          : 'bg-white/2 border border-white/5 text-gray-400 hover:bg-white/5 hover:text-gray-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Semantic Query Tag Explanation Alert */}
              {(searchQuery.trim() !== '') && (
                <div className="bg-purple-500/5 border border-purple-500/10 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                      🧬
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Semantic Vector Matching Enabled</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        AlloyDB pgvector is searching for semantic similarity score between Query Vector and Product embeddings.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setSearchQuery(''); resetImageSearch(); }}
                    className="text-[10px] text-purple-400 hover:text-purple-300 font-bold uppercase tracking-wider"
                  >
                    Clear Search
                  </button>
                </div>
              )}

              {/* Products Display Grid */}
              {filteredToys.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredToys.map((toy: any) => (
                    <div 
                      key={toy.id} 
                      className={`glass-panel overflow-hidden flex flex-col justify-between group transition-all duration-300 border-white/5 hover:border-purple-500/20 hover:shadow-lg ${
                        toy.highlight ? 'ring-1 ring-purple-500/20' : ''
                      }`}
                    >
                      <div>
                        {/* Image Header with Hover Accent */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-white/5 bg-slate-900">
                          <img 
                            src={toy.image} 
                            alt={toy.name} 
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
                          
                          {/* Emulated Match Score Bubble */}
                          {toy.similarity !== undefined && (
                            <span className="absolute top-3 right-3 bg-cyan-500/90 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-lg border border-cyan-400/20 backdrop-blur-sm">
                              Match: {(toy.similarity * 100).toFixed(0)}%
                            </span>
                          )}

                          <span className="absolute bottom-3 left-3 bg-slate-950/80 border border-white/10 text-xs px-2.5 py-0.5 rounded-lg text-gray-300 font-medium backdrop-blur-sm">
                            {toy.category}
                          </span>
                        </div>

                        {/* Card Content Info */}
                        <div className="p-5 space-y-3">
                          <div className="flex justify-between items-start gap-4">
                            <h3 className="text-md font-bold text-white group-hover:text-purple-400 transition-colors duration-200">
                              {toy.name}
                            </h3>
                            <span className="text-sm font-extrabold text-cyan-400 font-mono">
                              ${toy.price.toFixed(2)}
                            </span>
                          </div>
                          
                          <p className="text-xs text-gray-400 leading-relaxed min-h-[48px]">
                            {toy.description}
                          </p>

                          <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500 border-t border-white/5 pt-3 mt-1">
                            <div>
                              <span className="font-bold text-gray-600 block">MATERIALS</span>
                              <span className="text-gray-300 truncate block mt-0.5" title={toy.materials.join(', ')}>
                                {toy.materials.join(', ')}
                              </span>
                            </div>
                            <div>
                              <span className="font-bold text-gray-600 block">AGE GROUP</span>
                              <span className="text-gray-300 block mt-0.5">{toy.ageGroup}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer tags and buttons */}
                      <div className="px-5 pb-5 pt-0 flex flex-wrap gap-1">
                        {toy.tags.slice(0, 3).map((tag: string, idx: number) => (
                          <span key={idx} className="text-[9px] bg-white/2 border border-white/5 text-gray-400 px-2 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-panel p-12 text-center text-gray-500">
                  <p className="text-md mb-2 font-bold text-white">No Matching Toys Found</p>
                  <p className="text-xs max-w-sm mx-auto">
                    Traditional keyword indices might fail on abstract search terms. 
                    Try broadening your semantic search query or adding a custom toy in the Concept Lab!
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* 3. Global Footer Sign-off */}
      <footer className="glass-panel mx-4 mb-4 p-4 text-center text-xs text-gray-500 z-10 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          🤖 Built referencing the <a href="https://codevipassana.dev" target="_blank" rel="noreferrer" className="text-purple-400 hover:text-purple-300 font-semibold">Code Vipassana</a> Serverless Databases Codelab.
        </div>
        <div className="font-mono text-[10px] text-gray-600">
          Project Pioneers © 2026 • Live AlloyDB pgvector Simulator
        </div>
      </footer>
    </div>
  );
}
