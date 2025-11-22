import React, { useState, useEffect } from 'react';
import Editor from './components/Editor';
import WorldSidebar from './components/WorldSidebar';
import { WorldEntity, PlotAnalysis } from './types';
import { updateWorldKnowledge, analyzeNarrative } from './services/geminiService';
import { Feather, Info } from 'lucide-react';

export default function App() {
  const [text, setText] = useState<string>("");
  const [entities, setEntities] = useState<WorldEntity[]>([]);
  const [analysis, setAnalysis] = useState<PlotAnalysis | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  // Initial prompt
  useEffect(() => {
    // A small delay to feel like "booting up"
    const timer = setTimeout(() => {
        // Can auto-load from localstorage here if needed
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSync = async () => {
    if (!text.trim()) return;
    setIsProcessing(true);

    try {
        // Run parallel operations for speed
        const [newEntities, newAnalysis] = await Promise.all([
            updateWorldKnowledge(text, entities),
            analyzeNarrative(text, entities)
        ]);

        setEntities(newEntities);
        setAnalysis(newAnalysis);
    } catch (e) {
        console.error("Sync failed", e);
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-100">
      
      {/* Welcome Modal / Overlay */}
      {showWelcome && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md">
           <div className="max-w-md bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl text-center">
              <div className="mx-auto w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4">
                <Feather size={24} />
              </div>
              <h1 className="text-3xl font-serif text-white mb-2">The Narrative Compass</h1>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Welcome to your AI-assisted writing environment. Start writing a scene on the left, and the Compass will track your characters, detect continuity errors, and offer creative prompts.
              </p>
              <button 
                onClick={() => setShowWelcome(false)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg font-medium transition-all"
              >
                Start Writing
              </button>
           </div>
        </div>
      )}

      {/* Main Layout */}
      <main className="flex w-full h-full">
        {/* Left: Editor (60%) */}
        <div className="w-full md:w-3/5 lg:w-2/3 h-full">
          <Editor 
            value={text} 
            onChange={setText} 
            onAnalyze={handleSync}
            isAnalyzing={isProcessing}
          />
        </div>

        {/* Right: Compass (40%) */}
        <div className="hidden md:flex md:w-2/5 lg:w-1/3 h-full border-l border-slate-800">
           <WorldSidebar 
             entities={entities} 
             analysis={analysis}
             onCharacterClick={() => {}} // Handled internally by sidebar mostly
             storyText={text}
           />
        </div>
      </main>

      {/* Mobile Sidebar Toggle - Hidden on desktop */}
      <div className="md:hidden fixed bottom-4 right-4 z-40">
        <button 
            className="bg-emerald-600 text-white p-3 rounded-full shadow-lg"
            onClick={() => alert("Please use a larger screen for the full Compass experience.")}
        >
            <Info size={24} />
        </button>
      </div>

    </div>
  );
}