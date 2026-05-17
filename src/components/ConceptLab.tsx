import React, { useState } from 'react';
import { Sparkles, Hammer, Cpu, CheckCircle, Plus } from 'lucide-react';
import type { Toy } from '../lib/toysData';
import { generateToyConcept } from '../lib/geminiService';

interface ConceptLabProps {
  onAddToyToInventory: (newToy: Toy) => void;
  isLiveMode: boolean;
}

export const ConceptLab: React.FC<ConceptLabProps> = ({ onAddToyToInventory, isLiveMode }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedToy, setGeneratedToy] = useState<Toy | null>(null);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { title: "Analyzing Prompt with Gemini", desc: "Understanding play style, target age, and materials." },
    { title: "Synthesizing Mockup", desc: "Invoking Imagen 3 to generate high-fidelity product rendering." },
    { title: "Vectorizing Characteristics", desc: "Generating a 12-dimensional pgvector embedding." },
    { title: "Ingesting to AlloyDB", desc: "Inserting product details and vector representation into the database." }
  ];

  const handleManufacture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setGeneratedToy(null);
    setCurrentStep(0);

    // Simulated progress steps for the visual pipeline
    const stepIntervals = [500, 1000, 1500, 1800];
    stepIntervals.forEach((time, index) => {
      setTimeout(() => setCurrentStep(index), time);
    });

    try {
      const toy = await generateToyConcept(prompt);
      setGeneratedToy(toy);
    } catch (err: any) {
      setError(err.message || "Failed to manufacture toy concept.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToInventory = () => {
    if (!generatedToy) return;
    onAddToyToInventory(generatedToy);
    // Visual alert of success
    alert(`🎉 "${generatedToy.name}" has been successfully added to your live AlloyDB catalog! You can now search for it in the store tab.`);
    setGeneratedToy(null);
    setPrompt('');
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Configuration Panel */}
      <div className="glass-panel p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400">
              <Hammer size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Imagen 3 Concept Lab</h2>
              <p className="text-sm text-gray-400">Co-create futuristic custom toys with Generative AI</p>
            </div>
          </div>

          <p className="text-sm text-gray-300 mb-6 leading-relaxed">
            Specify a custom toy concept (e.g. <i>"A wooden mechanical wind-up steam engine with bioluminescent copper gears"</i>). 
            Our pipeline will generate a photorealistic mockup, calculate structural materials, estimate a fair price, and project its 12D embedding.
          </p>

          <form onSubmit={handleManufacture} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Toy Concept Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g. A robotic companion spider made of soft velvet fabrics that glows in the dark and teaches preschool counting games..."
                className="w-full h-32 bg-slate-950/60 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 placeholder-gray-500 resize-none transition-all"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className={`w-full glow-btn justify-center py-3 ${isLoading || !prompt.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Sparkles size={18} />
              {isLoading ? "Manufacturing Toy..." : "Begin Manufacturing Pipeline"}
            </button>
          </form>
        </div>

        {/* Codelab Details Pipeline View */}
        <div className="mt-8 border-t border-white/5 pt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
            <Cpu size={16} /> Backend Architecture Pipeline
          </h3>
          
          <div className="space-y-4">
            {steps.map((step, index) => {
              const isActive = isLoading && currentStep === index;
              const isCompleted = isLoading ? currentStep > index : (generatedToy ? true : false);
              
              return (
                <div key={index} className="flex gap-3 items-start">
                  <div className="mt-0.5">
                    {isCompleted ? (
                      <CheckCircle className="text-cyan-400" size={16} />
                    ) : isActive ? (
                      <div className="w-4 h-4 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-gray-600 bg-slate-900" />
                    )}
                  </div>
                  <div>
                    <h4 className={`text-xs font-semibold ${isActive ? 'text-purple-400' : isCompleted ? 'text-cyan-400' : 'text-gray-400'}`}>
                      Step {index + 1}: {step.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Result Display Panel */}
      <div className="glass-panel p-6 flex flex-col items-center justify-center min-h-[450px] relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-10">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-purple-500/10 border-t-purple-500 animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-cyan-500/10 border-b-cyan-500 animate-spin [animation-direction:reverse]" />
              <Sparkles className="absolute inset-0 m-auto text-purple-400 animate-pulse" size={28} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{steps[currentStep].title}</h3>
            <p className="text-sm text-gray-400 max-w-xs">{steps[currentStep].desc}</p>
            <div className="w-48 bg-white/5 h-1.5 rounded-full overflow-hidden mt-6">
              <div 
                className="bg-gradient-to-r from-purple-500 to-cyan-500 h-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="text-center p-6 max-w-sm">
            <div className="w-12 h-12 rounded-full bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 mx-auto mb-4">
              ⚠️
            </div>
            <h3 className="text-md font-bold text-white mb-2">Manufacturing Failure</h3>
            <p className="text-sm text-gray-400 mb-6">{error}</p>
            <button onClick={() => setError(null)} className="glow-btn-secondary py-2 px-4">
              Reset Workbench
            </button>
          </div>
        )}

        {generatedToy ? (
          <div className="w-full flex flex-col h-full justify-between">
            <div>
              <div className="relative aspect-square w-full max-h-[280px] rounded-xl overflow-hidden mb-6 border border-white/5 bg-slate-900 shimmer-effect">
                <img 
                  src={generatedToy.image} 
                  alt={generatedToy.name} 
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 right-3 bg-purple-500/90 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-lg border border-purple-400/20 backdrop-blur-sm">
                  AI Concept Design
                </span>
                <span className="absolute bottom-3 left-3 bg-slate-950/80 text-cyan-400 font-bold text-sm px-3 py-1 rounded-lg border border-cyan-500/20 backdrop-blur-sm">
                  ${generatedToy.price.toFixed(2)} Est. Price
                </span>
              </div>

              <div className="flex justify-between items-start gap-4 mb-2">
                <h3 className="text-xl font-bold">{generatedToy.name}</h3>
                <span className="text-xs bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-gray-300">
                  {generatedToy.category}
                </span>
              </div>

              <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                {generatedToy.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Suggested Age</h4>
                  <p className="text-xs text-gray-300 font-medium mt-0.5">{generatedToy.ageGroup}</p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Materials Suggested</h4>
                  <p className="text-xs text-cyan-300 font-medium mt-0.5 truncate">
                    {generatedToy.materials.join(', ')}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {generatedToy.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddToInventory}
              className="w-full glow-btn justify-center py-3 bg-gradient-to-r from-cyan-500 to-purple-500 shadow-cyan-500/20"
            >
              <Plus size={18} />
              Add Custom Toy to Active Catalog
            </button>
          </div>
        ) : (
          !isLoading && !error && (
            <div className="text-center p-8 text-gray-500">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 mx-auto mb-4 animate-pulse">
                ⚙️
              </div>
              <p className="text-sm max-w-xs mx-auto">
                Workbench idle. Submit your toy concept prompt on the left to activate the manufacturing pipeline!
              </p>
              {!isLiveMode && (
                <span className="inline-block mt-3 text-[10px] bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded">
                  Simulation Mode Active
                </span>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};
