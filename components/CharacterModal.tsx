import React, { useState, useEffect } from 'react';
import { WorldEntity, CharacterInsight } from '../types';
import { generateCharacterDetails } from '../services/geminiService';
import { X, MessageSquare, Key, Target, Zap, ShieldAlert } from 'lucide-react';

interface CharacterModalProps {
  character: WorldEntity;
  storyText: string;
  onClose: () => void;
}

const CharacterModal: React.FC<CharacterModalProps> = ({ character, storyText, onClose }) => {
  const [insight, setInsight] = useState<CharacterInsight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchInsight = async () => {
      setLoading(true);
      const data = await generateCharacterDetails(character, storyText);
      if (mounted) {
        setInsight(data);
        setLoading(false);
      }
    };
    fetchInsight();
    return () => { mounted = false; };
  }, [character, storyText]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-slate-900 w-full max-w-lg rounded-xl border border-slate-700 shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-start bg-slate-950 rounded-t-xl">
          <div>
            <h2 className="text-2xl font-serif text-emerald-100">{character.name}</h2>
            <p className="text-slate-400 text-sm mt-1">{character.description}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto custom-scrollbar p-6 space-y-6 flex-1">
          {loading ? (
            <div className="space-y-4 animate-pulse">
               {/* Skeleton Items */}
               {[1, 2, 3, 4, 5].map((i) => (
                 <div key={i} className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/50">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-4 h-4 rounded bg-slate-800"></div>
                        <div className="h-3 w-32 bg-slate-800 rounded"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-2 w-full bg-slate-800/50 rounded"></div>
                        <div className="h-2 w-2/3 bg-slate-800/50 rounded"></div>
                    </div>
                 </div>
               ))}
            </div>
          ) : insight ? (
            <>
              {/* Motivation */}
              <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/50">
                <h3 className="text-xs font-bold uppercase text-amber-400 mb-2 flex items-center gap-2">
                  <Target size={14} /> Current Motivation
                </h3>
                <ul className="space-y-1">
                    {insight.motivations.map((m, i) => <li key={i} className="text-sm text-slate-300">{m}</li>)}
                </ul>
              </div>

              {/* Secrets */}
              <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/50">
                <h3 className="text-xs font-bold uppercase text-purple-400 mb-2 flex items-center gap-2">
                  <Key size={14} /> Hidden Secrets
                </h3>
                 <ul className="space-y-1">
                    {insight.hiddenSecrets.map((m, i) => <li key={i} className="text-sm text-slate-300 italic">"{m}"</li>)}
                </ul>
              </div>

              {/* Flaws */}
              <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/50">
                <h3 className="text-xs font-bold uppercase text-red-400 mb-2 flex items-center gap-2">
                  <ShieldAlert size={14} /> Flaws & Weaknesses
                </h3>
                 <ul className="space-y-1">
                    {insight.flaws?.length > 0 ? (
                        insight.flaws.map((m, i) => <li key={i} className="text-sm text-slate-300">{m}</li>)
                    ) : (
                        <li className="text-sm text-slate-500 italic">No obvious flaws detected.</li>
                    )}
                </ul>
              </div>

              {/* Dialogue */}
              <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/50">
                <h3 className="text-xs font-bold uppercase text-emerald-400 mb-2 flex items-center gap-2">
                  <MessageSquare size={14} /> Suggested Dialogue
                </h3>
                <div className="space-y-2">
                  {insight.dialogueSuggestions.map((line, i) => (
                    <div key={i} className="text-sm text-slate-300 pl-3 border-l-2 border-emerald-500/30 py-1 font-serif">
                      "{line}"
                    </div>
                  ))}
                </div>
              </div>

              {/* Arc */}
              <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/50">
                <h3 className="text-xs font-bold uppercase text-blue-400 mb-2 flex items-center gap-2">
                  <Zap size={14} /> Future Arc Ideas
                </h3>
                 <ul className="space-y-2">
                    {insight.futureArcIdeas.map((m, i) => <li key={i} className="text-sm text-slate-300">{m}</li>)}
                </ul>
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

export default CharacterModal;