import React, { useState, useEffect } from 'react';
import { WorldEntity, LoreInsight } from '../types';
import { generateLoreDetails } from '../services/geminiService';
import { X, Book, Sparkles, Hourglass } from 'lucide-react';

interface LoreModalProps {
  entity: WorldEntity;
  storyText: string;
  onClose: () => void;
}

const LoreModal: React.FC<LoreModalProps> = ({ entity, storyText, onClose }) => {
  const [insight, setInsight] = useState<LoreInsight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchInsight = async () => {
      setLoading(true);
      const data = await generateLoreDetails(entity, storyText);
      if (mounted) {
        setInsight(data);
        setLoading(false);
      }
    };
    fetchInsight();
    return () => { mounted = false; };
  }, [entity, storyText]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-slate-900 w-full max-w-lg rounded-xl border border-slate-700 shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-start bg-slate-950 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-900/30 flex items-center justify-center text-amber-400 border border-amber-800/30">
                <Book size={20} />
            </div>
            <div>
                <h2 className="text-xl font-serif text-amber-100">{entity.name}</h2>
                <p className="text-slate-400 text-xs uppercase tracking-wider mt-1">{entity.type}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto custom-scrollbar p-6 space-y-6 flex-1">
          {loading ? (
            <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/50">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-4 h-4 rounded bg-slate-800"></div>
                            <div className="h-3 w-24 bg-slate-800 rounded"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-2 w-full bg-slate-800/50 rounded"></div>
                            <div className="h-2 w-full bg-slate-800/50 rounded"></div>
                            <div className="h-2 w-3/4 bg-slate-800/50 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
          ) : insight ? (
            <>
              {/* History */}
              <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/50">
                <h3 className="text-xs font-bold uppercase text-amber-400 mb-2 flex items-center gap-2">
                  <Hourglass size={14} /> History & Origin
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                    {insight.detailedHistory}
                </p>
              </div>

              {/* Cultural Sig */}
              <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/50">
                <h3 className="text-xs font-bold uppercase text-blue-400 mb-2 flex items-center gap-2">
                  <Book size={14} /> Significance
                </h3>
                <p className="text-sm text-slate-300">
                    {insight.culturalSignificance}
                </p>
              </div>

              {/* Hidden Props */}
              <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/50">
                <h3 className="text-xs font-bold uppercase text-purple-400 mb-2 flex items-center gap-2">
                  <Sparkles size={14} /> Hidden Properties
                </h3>
                {insight.hiddenProperties.length > 0 ? (
                    <ul className="space-y-2">
                        {insight.hiddenProperties.map((prop, i) => (
                            <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                <span className="text-purple-500 mt-1">•</span>
                                <span>{prop}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-slate-500 italic">No known hidden properties.</p>
                )}
              </div>
            </>
          ) : (
             <p className="text-center text-slate-500">No data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoreModal;