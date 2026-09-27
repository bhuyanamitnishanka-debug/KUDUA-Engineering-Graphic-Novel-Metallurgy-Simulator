import React, { useState } from 'react';
import { NarrativeChoice } from '../types/novel';
import { GitBranch, ShieldAlert, CheckCircle2, ChevronRight, Sparkles, X } from 'lucide-react';
import { sound } from '../utils/audio';

interface BranchingNarrativeModalProps {
  choice: NarrativeChoice;
  selectedOptionId?: string;
  onSelectOption: (optionId: string) => void;
  onClose: () => void;
}

export const BranchingNarrativeModal: React.FC<BranchingNarrativeModalProps> = ({
  choice,
  selectedOptionId,
  onSelectOption,
  onClose,
}) => {
  const [activeChoiceId, setActiveChoiceId] = useState<string | null>(selectedOptionId || null);

  const handlePick = (id: string) => {
    sound.playClank();
    setActiveChoiceId(id);
    onSelectOption(id);
  };

  const chosenOption = choice.options.find(o => o.id === activeChoiceId);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-stone-950 border-2 border-amber-500 rounded-2xl p-6 sm:p-8 shadow-2xl relative flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col gap-1.5 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-500 font-semibold tracking-widest">
            <GitBranch className="w-4 h-4" />
            <span>Operational Directive · Branching Narrative Decision</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-epic text-stone-100">
            {choice.prompt}
          </h3>
        </div>

        {/* Options Stack */}
        <div className="flex flex-col gap-3">
          {choice.options.map((opt) => {
            const isSelected = activeChoiceId === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => handlePick(opt.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-2 ${
                  isSelected
                    ? 'bg-amber-950/30 border-amber-500 ring-2 ring-amber-400/20 shadow-lg'
                    : 'bg-stone-900/80 border-stone-800 hover:border-stone-700 hover:bg-stone-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-comic font-bold text-stone-100 tracking-wide">
                    {opt.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      opt.riskScore === 'Low'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        : opt.riskScore === 'Moderate'
                        ? 'bg-amber-950 text-amber-300 border border-amber-700'
                        : 'bg-rose-950 text-rose-300 border border-rose-700'
                    }`}>
                      Risk: {opt.riskScore}
                    </span>
                    <span className="text-[11px] font-mono text-cyan-400 hidden sm:inline">
                      {opt.techFocus}
                    </span>
                  </div>
                </div>

                <p className="text-xs font-body text-stone-300">
                  {opt.description}
                </p>

                {isSelected && (
                  <div className="mt-2 pt-2 border-t border-amber-500/30 flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold">
                      Executed Kinematic Outcome:
                    </span>
                    <p className="text-xs font-body text-emerald-300 italic">
                      "{opt.consequenceText}"
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs font-mono text-stone-500">
            {activeChoiceId ? 'Directive confirmed in telemetry log' : 'Select a tactical path to continue'}
          </span>
          <button
            onClick={() => {
              sound.playPageFlip();
              onClose();
            }}
            className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-comic font-bold text-xs tracking-wider transition-colors shadow-md"
          >
            Apply & Return to Novel
          </button>
        </div>
      </div>
    </div>
  );
};
