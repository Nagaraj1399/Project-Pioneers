import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, Send, BookOpen, MessageSquare, Award } from 'lucide-react';
import { chatWithGuide } from '../lib/geminiService';

export const GuideChat: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { 
      role: 'model', 
      text: `👋 **Welcome to the Code Vipassana Dev-Workspace!**
I am your interactive cloud architecture guide. I can explain the advanced backend and database layers that power the **Toy Store of the Future**.

Choose a quick question below, or type your own question to learn about:
* **AlloyDB & pgvector** indexing configurations.
* **Vector Embeddings** and Cosine Similarity equations.
* **Gemini 2.5 & Imagen 3** multimodal pipelines.
* **Open Source DB Orchestration** (GenAI Toolbox).`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickQuestions = [
    { label: "🗄️ How does AlloyDB do semantic search?", query: "How does AlloyDB and pgvector perform semantic search?" },
    { label: "📐 Explain Vector Embeddings math", query: "What are Vector Embeddings and Cosine Similarity?" },
    { label: "👁️ How do Gemini & Imagen interact?", query: "How do Gemini and Imagen 3 co-create toys?" }
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, text: text };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const guideHistory = messages.map(msg => ({ role: msg.role, text: msg.text }));
      const response = await chatWithGuide(text, guideHistory);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "❌ **Connectivity Timeout**: I had trouble contacting the live Gemini API. Please make sure your API key is correct or try again in a few moments!" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)] min-h-[500px]">
      {/* Sidebar: Codelab Overview */}
      <div className="glass-panel p-6 lg:col-span-4 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400">
              <BookOpen size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Study Workbook</h2>
              <p className="text-sm text-gray-400">Code Vipassana reference</p>
            </div>
          </div>

          <div className="bg-white/2 border border-white/5 rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <Award size={14} /> Codelab Objectives
            </div>
            <ul className="text-xs text-gray-300 space-y-2 list-disc pl-4 leading-relaxed">
              <li><strong>Setup AlloyDB</strong> with PostgreSQL-compatible database cluster.</li>
              <li><strong>Enable pgvector</strong>, creating 12D vectors representation for product listings.</li>
              <li><strong>Orchestrate LangChain4j</strong> / Toolbox APIs for price forecasting.</li>
              <li><strong>Serve Client-side RAG</strong> through serverless Cloud Run Functions.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Frequently Asked Questions</h4>
            <div className="flex flex-col gap-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q.query)}
                  className="w-full text-left bg-slate-950/60 hover:bg-slate-950 border border-white/5 hover:border-purple-500/30 p-3 rounded-xl text-xs text-gray-300 transition-all duration-200 flex items-start gap-2.5"
                >
                  <MessageSquare size={14} className="text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-[10px] text-gray-500 border-t border-white/5 pt-4 mt-6">
          💡 <strong>Tip:</strong> In the active application, you can dynamically configure your Gemini API key inside the settings panel in the top header.
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="glass-panel lg:col-span-8 flex flex-col justify-between h-full overflow-hidden">
        {/* Chat Header */}
        <div className="border-b border-white/5 p-4 bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <div>
              <h3 className="text-sm font-bold">Code Vipassana AI Mentor</h3>
              <p className="text-[10px] text-gray-500 font-mono">Model: gemini-2.5-flash-guide</p>
            </div>
          </div>
          <HelpCircle size={16} className="text-gray-500" />
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => {
            const isGuide = msg.role === 'model';
            return (
              <div 
                key={i} 
                className={`flex gap-4 max-w-[85%] ${isGuide ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold border text-xs ${
                  isGuide 
                    ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' 
                    : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                }`}>
                  {isGuide ? 'CV' : 'ME'}
                </div>
                
                <div className={`rounded-2xl p-4 text-sm leading-relaxed border ${
                  isGuide 
                    ? 'bg-slate-950/40 border-white/5 text-gray-300' 
                    : 'bg-purple-500/15 border-purple-500/20 text-white'
                }`}>
                  {/* Handle primitive rendering of markdown structures */}
                  <div className="space-y-3 whitespace-pre-line text-xs md:text-sm">
                    {msg.text.split('\n\n').map((paragraph, pIdx) => {
                      if (paragraph.startsWith('###')) {
                        return <h4 key={pIdx} className="text-sm font-bold text-white mt-4 border-b border-white/5 pb-1">{paragraph.replace('###', '').trim()}</h4>;
                      }
                      if (paragraph.startsWith('*') || paragraph.startsWith('-')) {
                        return (
                          <ul key={pIdx} className="list-disc pl-4 space-y-1">
                            {paragraph.split('\n').map((item, itemIdx) => (
                              <li key={itemIdx}>{item.replace(/^[\*\-\s]+/, '')}</li>
                            ))}
                          </ul>
                        );
                      }
                      return <p key={pIdx} className="text-gray-300">{paragraph}</p>;
                    })}
                  </div>
                </div>
              </div>
            );
          })}
          
          {isLoading && (
            <div className="flex gap-4 max-w-[85%] mr-auto items-center">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center text-xs font-bold">
                CV
              </div>
              <div className="bg-slate-950/40 border border-white/5 rounded-2xl px-4 py-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="border-t border-white/5 p-4 bg-slate-950/20 flex gap-3 items-center"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about AlloyDB indexing, vector math, or how to setup the codelab..."
            className="flex-1 bg-slate-950/60 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-purple-500/50"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className={`glow-btn py-3 px-4 ${isLoading || !inputText.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
