import React from 'react';

interface EditorProps {
  value: string;
  onChange: (val: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const Editor: React.FC<EditorProps> = ({ value, onChange, onAnalyze, isAnalyzing }) => {
  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
        <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Manuscript</h2>
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-sm transition-all
            ${isAnalyzing 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50 border border-emerald-800/50 hover:border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
            }`}
        >
          {isAnalyzing ? 'Syncing World...' : 'Sync & Analyze'}
        </button>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <textarea
          className="w-full h-full bg-slate-900 text-slate-300 p-8 resize-none focus:outline-none font-serif text-lg leading-relaxed custom-scrollbar placeholder-slate-700"
          placeholder="Start writing your story here... The Compass is watching."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Editor;