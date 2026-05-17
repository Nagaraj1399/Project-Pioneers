import React, { useState } from 'react';
import { Database, Search, Info, HelpCircle, BarChart3 } from 'lucide-react';
import { TOY_DIMENSIONS, type Toy } from '../lib/toysData';
import { projectQueryToVector, performVectorSearch } from '../lib/vectorSearch';

interface VectorExplorerProps {
  toys: Toy[];
}

export const VectorExplorer: React.FC<VectorExplorerProps> = ({ toys }) => {
  const [query, setQuery] = useState('cuddly space companion');
  const [selectedToyId, setSelectedToyId] = useState<string | null>(toys[0]?.id || null);

  const queryVector = projectQueryToVector(query);
  const searchResults = performVectorSearch(queryVector, toys);
  const selectedToy = toys.find(t => t.id === selectedToyId);

  // Perform a mock Keyword Search to compare side-by-side!
  const performKeywordSearch = (q: string): Toy[] => {
    const terms = q.toLowerCase().split(' ').filter(t => t.length > 2);
    if (terms.length === 0) return [];
    return toys.filter(toy => {
      const matchText = (toy.name + ' ' + toy.description + ' ' + toy.category + ' ' + toy.tags.join(' ')).toLowerCase();
      return terms.some(term => matchText.includes(term));
    });
  };

  const keywordResults = performKeywordSearch(query);

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400">
            <Database size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">AlloyDB pgvector Explorer</h2>
            <p className="text-sm text-gray-400">Demystifying semantic search, embeddings, and cosine similarity</p>
          </div>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">
          Traditional databases only find toys if they contain the exact words you type. 
          AlloyDB with the <code>pgvector</code> extension translates both your query and the toys into 
          high-dimensional coordinates (embeddings) and calculates the physical distance between them using Cosine Similarity!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Query Projection */}
        <div className="glass-panel p-6 lg:col-span-5 flex flex-col justify-between">
          <div>
            <h3 className="text-md font-bold mb-4 flex items-center gap-2">
              <Search size={18} className="text-purple-400" /> Vector Projection Lab
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Test Search Query
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="E.g. wood track for toddler"
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                  />
                  <Search size={18} className="absolute right-3 top-3.5 text-gray-500" />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <button onClick={() => setQuery("robot that teaches coding")} className="text-[10px] bg-white/5 hover:bg-white/10 text-gray-300 px-2 py-0.5 rounded transition">
                    "robot that teaches coding"
                  </button>
                  <button onClick={() => setQuery("eco friendly wood toddler")} className="text-[10px] bg-white/5 hover:bg-white/10 text-gray-300 px-2 py-0.5 rounded transition">
                    "eco friendly wood toddler"
                  </button>
                  <button onClick={() => setQuery("glow in dark plush dragon")} className="text-[10px] bg-white/5 hover:bg-white/10 text-gray-300 px-2 py-0.5 rounded transition">
                    "glow in dark plush dragon"
                  </button>
                </div>
              </div>

              {/* 12D Vector Visualizer */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  12D Query Coordinate Vector
                  <span title="These 12 float numbers represent the semantic fingerprint of your query text!">
                    <HelpCircle size={12} className="text-gray-500 cursor-help" />
                  </span>
                </h4>
                
                <div className="grid grid-cols-4 gap-1.5 font-mono text-[10px]">
                  {queryVector.map((val, i) => (
                    <div key={i} className="bg-slate-950/80 border border-white/5 rounded p-1.5 flex flex-col justify-center items-center text-center">
                      <span className="text-[8px] text-gray-500 truncate w-full" title={TOY_DIMENSIONS[i]}>
                        Dim {i+1}
                      </span>
                      <span className="text-cyan-400 font-semibold mt-0.5">{val.toFixed(3)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Dimension Details Bar Chart */}
          <div className="border-t border-white/5 pt-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <BarChart3 size={14} /> Cognitive Signature Weights
            </h4>
            <div className="space-y-1.5">
              {queryVector.slice(0, 6).map((val, i) => (
                <div key={i} className="text-[10px] space-y-1">
                  <div className="flex justify-between text-gray-400 font-medium">
                    <span>{TOY_DIMENSIONS[i].split(' (')[0]}</span>
                    <span>{(val * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-cyan-500 h-full"
                      style={{ width: `${val * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Similarity Rankings and Comparisons */}
        <div className="lg:col-span-7 space-y-6">
          {/* Vector Search Similarity List */}
          <div className="glass-panel p-6">
            <h3 className="text-md font-bold mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                📊 Vector Similarity Rankings (Cosine Similarity)
              </span>
              <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded uppercase font-semibold">
                AlloyDB pgvector
              </span>
            </h3>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {searchResults.map((result) => {
                const isSelected = selectedToyId === result.toy.id;
                // Color coding based on similarity score
                const scoreColor = result.similarity > 0.8 
                  ? 'text-cyan-400 border-cyan-500/30 bg-cyan-500/5' 
                  : result.similarity > 0.6 
                    ? 'text-purple-400 border-purple-500/20 bg-purple-500/5' 
                    : 'text-gray-400 border-white/5 bg-white/2';

                return (
                  <div
                    key={result.toy.id}
                    onClick={() => setSelectedToyId(result.toy.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'border-purple-500/60 bg-purple-500/10 shadow-lg' 
                        : 'border-white/5 bg-slate-950/40 hover:border-white/10 hover:bg-slate-950/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={result.toy.image} 
                        alt={result.toy.name} 
                        className="w-10 h-10 object-cover rounded-lg border border-white/5"
                      />
                      <div>
                        <h4 className="text-sm font-semibold">{result.toy.name}</h4>
                        <p className="text-xs text-gray-500">{result.toy.category}</p>
                      </div>
                    </div>

                    <div className={`flex flex-col items-end border px-2.5 py-1 rounded-lg ${scoreColor}`}>
                      <span className="text-[9px] uppercase font-bold tracking-wider opacity-85">Match Score</span>
                      <span className="text-xs font-mono font-bold mt-0.5">{(result.similarity * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Side by Side Comparison Block */}
          <div className="grid grid-cols-2 gap-4">
            {/* Vector Search Block */}
            <div className="glass-panel p-4 border-cyan-500/10">
              <h4 className="text-xs font-bold text-cyan-400 mb-2 flex items-center gap-1.5 uppercase">
                🧠 pgvector Semantic search
              </h4>
              <p className="text-[10px] text-gray-400 mb-3">
                Looks at mathematical proximity. Captures meaning.
              </p>
              <div className="space-y-1.5">
                {searchResults.slice(0, 2).map((res, i) => (
                  <div key={i} className="text-[11px] bg-cyan-500/5 border border-cyan-500/10 rounded px-2.5 py-1.5 flex justify-between">
                    <span className="truncate max-w-[130px] font-semibold text-white">{res.toy.name}</span>
                    <span className="font-mono text-cyan-300">{(res.similarity * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Keyword Search Block */}
            <div className="glass-panel p-4 border-pink-500/10">
              <h4 className="text-xs font-bold text-pink-400 mb-2 flex items-center gap-1.5 uppercase">
                🔍 Traditional Keyword Search
              </h4>
              <p className="text-[10px] text-gray-400 mb-3">
                Looks for exact word matching. Strict and literal.
              </p>
              {keywordResults.length > 0 ? (
                <div className="space-y-1.5">
                  {keywordResults.slice(0, 2).map((toy, i) => (
                    <div key={i} className="text-[11px] bg-pink-500/5 border border-pink-500/10 rounded px-2.5 py-1.5 flex justify-between">
                      <span className="truncate max-w-[130px] font-semibold text-white">{toy.name}</span>
                      <span className="text-pink-400 font-semibold">Matched</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[10px] bg-pink-500/5 border border-pink-500/10 rounded px-2 py-3 text-center text-pink-300 font-medium">
                  ❌ 0 Keyword Matches Found!
                </div>
              )}
            </div>
          </div>

          {/* Selected Toy Detailed Vector Map */}
          {selectedToy && (
            <div className="glass-panel p-5">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Vector Fingerprint Comparison: <span className="text-purple-400">{selectedToy.name}</span>
              </h4>
              
              <div className="space-y-3 font-mono text-[10.5px]">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-[9px] uppercase text-gray-500 font-bold mb-1">Toy Embedding Coordinate</h5>
                    <div className="bg-slate-950 border border-white/5 rounded p-2 text-purple-400 truncate text-[9.5px]">
                      [{selectedToy.embedding.map(v => v.toFixed(3)).join(', ')}]
                    </div>
                  </div>
                  <div>
                    <h5 className="text-[9px] uppercase text-gray-500 font-bold mb-1">Query Embedding Coordinate</h5>
                    <div className="bg-slate-950 border border-white/5 rounded p-2 text-cyan-400 truncate text-[9.5px]">
                      [{queryVector.map(v => v.toFixed(3)).join(', ')}]
                    </div>
                  </div>
                </div>

                <div className="bg-purple-500/5 border border-purple-500/10 rounded-xl p-3 flex items-start gap-2.5 mt-2">
                  <Info size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] text-gray-300 leading-relaxed font-sans">
                    <strong>AlloyDB Query Emulated:</strong> <code className="text-cyan-400 font-mono text-[9px] px-1 bg-black/30">SELECT name, description, (embedding &lt;=&gt; '{`[${queryVector.map(v => v.toFixed(3)).join(',')}]`}') as similarity FROM toys ORDER BY similarity LIMIT 3;</code>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
