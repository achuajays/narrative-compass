import React, { useState } from 'react';
import { WorldEntity, EntityType, PlotAnalysis } from '../types';
import { Users, Map, Box, BookOpen, AlertTriangle, Activity, Sparkles, Eye } from 'lucide-react';
import CharacterModal from './CharacterModal';
import LoreModal from './LoreModal';

interface WorldSidebarProps {
  entities: WorldEntity[];
  analysis: PlotAnalysis | null;
  onCharacterClick: (char: WorldEntity) => void;
  storyText: string; 
}

const WorldSidebar: React.FC<WorldSidebarProps> = ({ entities, analysis, onCharacterClick, storyText }) => {
  const [activeTab, setActiveTab] = useState<'ENTITIES' | 'ANALYSIS'>('ENTITIES');
  const [selectedEntity, setSelectedEntity] = useState<WorldEntity | null>(null);
  const [selectedLore, setSelectedLore] = useState<WorldEntity | null>(null);

  const characters = entities.filter(e => e.type === EntityType.CHARACTER);
  const others = entities.filter(e => e.type !== EntityType.CHARACTER);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-300">
      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('ENTITIES')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors
            ${activeTab === 'ENTITIES' ? 'bg-slate-900 text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <BookOpen size={14} /> World Data
        </button>
        <button
          onClick={() => setActiveTab('ANALYSIS')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors
            ${activeTab === 'ANALYSIS' ? 'bg-slate-900 text-amber-400 border-b-2 border-amber-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Activity size={14} /> Compass
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
        {activeTab === 'ENTITIES' && (
          <>
            {/* Characters Section */}
            <div>
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                <Users size={14} /> Characters
              </h3>
              <div className="grid gap-3">
                {characters.length === 0 && <p className="text-slate-600 text-sm italic">No characters detected yet.</p>}
                {characters.map(char => (
                  <div
                    key={char.id}
                    onClick={() => setSelectedEntity(char)}
                    className="bg-slate-900 p-3 rounded border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all group"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-emerald-100 group-hover:text-emerald-400 transition-colors">{char.name}</span>
                      {char.status && (
                        <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 uppercase tracking-wide">{char.status}</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{char.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Lore & Objects Section */}
            <div>
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3 mt-6 flex items-center gap-2">
                <Box size={14} /> Lore & Objects
              </h3>
              <div className="grid gap-3">
                {others.length === 0 && <p className="text-slate-600 text-sm italic">The world is empty.</p>}
                {others.map(item => (
                  <div key={item.id} className="bg-slate-900 p-3 rounded border border-slate-800 opacity-80 hover:opacity-100 transition-opacity group">
                    <div className="flex items-start justify-between gap-2 mb-1">
                       <div className="flex items-center gap-2">
                        {item.type === EntityType.LOCATION && <Map size={12} className="text-blue-400" />}
                        {item.type === EntityType.OBJECT && <Box size={12} className="text-purple-400" />}
                        {item.type === EntityType.LORE && <BookOpen size={12} className="text-amber-400" />}
                        <span className="font-semibold text-slate-200 text-sm">{item.name}</span>
                       </div>
                       <button 
                         onClick={() => setSelectedLore(item)}
                         className="text-slate-500 hover:text-amber-400 hover:bg-amber-950/30 p-1.5 rounded transition-all"
                         title="Generate AI Lore Insights"
                       >
                         <Sparkles size={14} />
                       </button>
                    </div>
                    <p className="text-xs text-slate-500">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'ANALYSIS' && analysis && (
          <div className="space-y-6 animate-in fade-in duration-500">
             {/* Continuity Status */}
             <div className={`p-4 rounded-lg border flex flex-col gap-2
               ${analysis.continuityStatus === 'BROKEN' ? 'bg-red-950/30 border-red-900/50 text-red-200' : 
                 analysis.continuityStatus === 'RISK' ? 'bg-amber-950/30 border-amber-900/50 text-amber-200' :
                 'bg-emerald-950/30 border-emerald-900/50 text-emerald-200'
               }`}>
                <div className="flex items-center gap-3">
                    <AlertTriangle className={`shrink-0 ${analysis.continuityStatus === 'STABLE' ? 'hidden' : 'block'}`} size={18} />
                    <Sparkles className={`shrink-0 ${analysis.continuityStatus === 'STABLE' ? 'block' : 'hidden'}`} size={18} />
                    <h4 className="font-bold text-sm uppercase tracking-wider">
                        Continuity: {analysis.continuityStatus}
                    </h4>
                </div>
                
                {analysis.plotHoles.length > 0 ? (
                    <div className="mt-3 space-y-2 w-full">
                      {analysis.plotHoles.map((hole, i) => (
                        <div key={i} className={`p-3 rounded border font-medium leading-relaxed flex gap-3 items-start
                            ${analysis.continuityStatus === 'BROKEN' 
                                ? 'bg-red-950/50 border-red-800/50 text-red-100' 
                                : 'bg-amber-950/50 border-amber-800/50 text-amber-100'}`
                        }>
                          <div className="shrink-0 mt-1 opacity-80">
                            <AlertTriangle size={18} />
                          </div>
                          <span className="text-base leading-relaxed">{hole}</span>
                        </div>
                      ))}
                    </div>
                ) : (
                    <p className="text-xs opacity-80 pl-8">The timeline appears consistent. No contradictions detected.</p>
                )}
             </div>

             {/* Pacing */}
             <div className="bg-slate-900 p-4 rounded border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2">
                    <Activity size={14} /> Pacing Score
                  </h4>
                  <span className={`text-sm font-bold ${analysis.pacingScore > 80 ? 'text-red-400' : analysis.pacingScore > 40 ? 'text-emerald-400' : 'text-blue-400'}`}>
                    {analysis.pacingScore}/100
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mb-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${analysis.pacingScore > 80 ? 'bg-red-500' : analysis.pacingScore > 40 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    style={{ width: `${analysis.pacingScore}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-400 italic">"{analysis.pacingComment}"</p>
             </div>

             {/* Suggestions */}
             <div className="bg-slate-950 p-4 rounded border border-slate-800">
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-2">
                  <Sparkles size={14} /> Narrative Suggestions
                </h4>
                <ul className="space-y-3">
                  {analysis.narrativeSuggestions.map((sugg, i) => (
                    <li key={i} className="text-xs text-slate-300 border-l-2 border-purple-500/50 pl-3 py-0.5">
                      {sugg}
                    </li>
                  ))}
                </ul>
             </div>
          </div>
        )}

        {activeTab === 'ANALYSIS' && !analysis && (
          <div className="flex flex-col items-center justify-center h-48 text-slate-600 gap-2">
            <Activity size={24} className="opacity-50" />
            <p className="text-sm">Write something and click Sync to analyze.</p>
          </div>
        )}
      </div>

      {selectedEntity && (
        <CharacterModal
          character={selectedEntity}
          storyText={storyText}
          onClose={() => setSelectedEntity(null)}
        />
      )}

      {selectedLore && (
        <LoreModal
            entity={selectedLore}
            storyText={storyText}
            onClose={() => setSelectedLore(null)}
        />
      )}
    </div>
  );
};

export default WorldSidebar;