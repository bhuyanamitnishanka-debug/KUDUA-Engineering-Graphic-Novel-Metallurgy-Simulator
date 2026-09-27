import React, { useState, useEffect, useRef } from 'react';
import { StickyNote, PenLine, X, Trash2, Check, Sparkles, Clock } from 'lucide-react';
import { sound } from '../utils/audio';

interface PanelAnnotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  actTitle: string;
  pageNumber: number;
  initialText: string;
  updatedAt?: number;
  onSave: (text: string) => void;
  onDelete?: () => void;
}

const PRESET_TAGS = [
  '1450°C Thermal Gradient',
  'Vajra-lepa Microstructure',
  'Kinematic Gantry Clearance',
  'Optical Pyrometry Calibration',
  'Slag Viscosity Ingestion'
];

export const PanelAnnotationModal: React.FC<PanelAnnotationModalProps> = ({
  isOpen,
  onClose,
  actTitle,
  pageNumber,
  initialText,
  updatedAt,
  onSave,
  onDelete
}) => {
  const [text, setText] = useState(initialText);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setText(initialText);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    }
  }, [isOpen, initialText]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        handleSave();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, text]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(text);
  };

  const handleAddTag = (tag: string) => {
    sound.playPageFlip();
    setText(prev => {
      const prefix = prev.trim() ? `${prev.trim()}\n` : '';
      return `${prefix}[${tag}]: `;
    });
  };

  return (
    <div 
      className="fixed inset-0 z-[120] bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-stone-950 border-2 border-stone-800 rounded-2xl shadow-2xl p-5 sm:p-6 flex flex-col gap-4 relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-stone-800">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-500 shrink-0 mt-0.5">
              <PenLine className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-500 font-semibold tracking-wider">
                <span>Field Note</span>
                <span>·</span>
                <span>{actTitle} (Page {pageNumber})</span>
              </div>
              <h3 className="text-lg font-bold font-comic text-stone-100 mt-0.5">
                Panel Technical Annotation
              </h3>
              <p className="text-xs font-body text-stone-400">
                Attach engineering observations, metallurgical notes, or calculation remarks.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Insert Technical Tags */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-mono text-stone-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Quick-insert engineering prompts:</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAddTag(tag)}
                className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-400 border border-stone-800 hover:border-amber-500/40 transition-colors"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Area */}
        <div className="flex flex-col gap-1.5">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your technical annotations, observations, or hypotheses for this panel..."
            rows={5}
            className="w-full bg-stone-900/90 text-stone-100 border border-stone-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl p-3.5 text-xs sm:text-sm font-mono leading-relaxed outline-none resize-none placeholder:text-stone-500"
          />
          <div className="flex items-center justify-between text-[11px] font-mono text-stone-500">
            <div className="flex items-center gap-1.5">
              {updatedAt ? (
                <>
                  <Clock className="w-3 h-3 text-stone-500" />
                  <span>Last saved: {new Date(updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </>
              ) : (
                <span>Saves automatically to localStorage</span>
              )}
            </div>
            <span>{text.length} chars · <kbd className="text-[9px] bg-stone-900 px-1 py-0.5 rounded border border-stone-800">⌘+Enter to save</kbd></span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-800">
          <div>
            {onDelete && initialText && (
              <button
                type="button"
                onClick={onDelete}
                className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-rose-950/40 border border-stone-800 hover:border-rose-600/50 text-stone-400 hover:text-rose-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Note</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-stone-400 hover:text-stone-200 hover:bg-stone-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-comic font-bold text-xs tracking-wider flex items-center gap-1.5 transition-colors shadow-md shadow-amber-500/20"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Save Annotation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
