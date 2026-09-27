import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, BookOpen, Users, Wrench, Layers, Film, ArrowRight, CornerDownLeft, Sparkles, Hash } from 'lucide-react';
import { NOVEL_CHAPTERS } from '../data/chaptersData';
import { CHARACTERS_DATA } from '../data/charactersData';
import { TECHNOLOGIES_DATA } from '../data/technologiesData';
import { BTS_DATA } from '../data/btsData';
import { sound } from '../utils/audio';

export interface SearchResultItem {
  id: string;
  type: 'chapter' | 'panel' | 'character' | 'tech' | 'bts';
  title: string;
  subtitle: string;
  snippet: string;
  badge: string;
  badgeColor: string;
  targetChapterIndex?: number;
  targetPanelIndex?: number;
  targetId?: string;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateChapter: (chapterIdx: number, panelIdx: number) => void;
  onNavigateSection: (section: 'characters' | 'technologies' | 'bts' | 'blueprint', targetId?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateChapter,
  onNavigateSection
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'novel' | 'characters' | 'tech' | 'bts'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Build the complete search index across chapters, panels, characters, tech, BTS
  const allSearchItems = useMemo<SearchResultItem[]>(() => {
    const items: SearchResultItem[] = [];

    // 1. Chapters & Panels
    NOVEL_CHAPTERS.forEach((ch, chIdx) => {
      items.push({
        id: `ch-${ch.id}`,
        type: 'chapter',
        title: `${ch.act}: ${ch.title}`,
        subtitle: ch.subtitle,
        snippet: ch.summary,
        badge: 'Chapter',
        badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-500/40',
        targetChapterIndex: chIdx,
        targetPanelIndex: 0
      });

      ch.panels.forEach((p, pIdx) => {
        const dialogText = p.dialogue?.map(d => `${d.speaker}: ${d.text}`).join(' ') || '';
        const specsText = p.technicalCallouts.map(t => `${t.label} ${t.spec}: ${t.detail}`).join(' ');
        
        items.push({
          id: `panel-${p.id}`,
          type: 'panel',
          title: `${p.title} (${ch.act})`,
          subtitle: `Page ${pIdx + 1} · ${p.timeCode}`,
          snippet: `${p.narrativeCaption} ${dialogText} ${specsText}`,
          badge: 'Panel',
          badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40',
          targetChapterIndex: chIdx,
          targetPanelIndex: pIdx
        });
      });
    });

    // 2. Characters
    CHARACTERS_DATA.forEach((c) => {
      items.push({
        id: `char-${c.id}`,
        type: 'character',
        title: `${c.name} (${c.callsign})`,
        subtitle: `${c.role} · ${c.department}`,
        snippet: `${c.background} ${c.motivation} "${c.signatureQuote}" Contributions: ${c.keyContributions.join(', ')}`,
        badge: 'Character',
        badgeColor: 'text-purple-400 bg-purple-950/60 border-purple-500/40',
        targetId: c.id
      });
    });

    // 3. Engineered Technologies
    TECHNOLOGIES_DATA.forEach((t) => {
      const eqText = t.equations.map(e => `${e.formula} ${e.explanation}`).join(' ');
      const specText = t.specSheet.map(s => `${s.label}: ${s.value}`).join(' ');

      items.push({
        id: `tech-${t.id}`,
        type: 'tech',
        title: t.title,
        subtitle: `${t.category} Specification · ${t.ancientHeritage.slice(0, 45)}...`,
        snippet: `${t.summary} ${t.physicalPrinciples.join(' ')} ${eqText} ${specText} ${t.industrialSafetyImpact}`,
        badge: 'Technology',
        badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40',
        targetId: t.id
      });
    });

    // 4. Behind The Scenes
    BTS_DATA.forEach((b) => {
      items.push({
        id: `bts-${b.id}`,
        type: 'bts',
        title: b.title,
        subtitle: `${b.category} Archive`,
        snippet: `${b.description} ${b.details.join(' ')} ${b.specs || ''}`,
        badge: 'Behind The Scenes',
        badgeColor: 'text-rose-400 bg-rose-950/60 border-rose-500/40',
        targetId: b.id
      });
    });

    return items;
  }, []);

  // Filter items by query and category
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    
    let base = allSearchItems;
    if (filterType === 'novel') {
      base = base.filter(i => i.type === 'chapter' || i.type === 'panel');
    } else if (filterType === 'characters') {
      base = base.filter(i => i.type === 'character');
    } else if (filterType === 'tech') {
      base = base.filter(i => i.type === 'tech');
    } else if (filterType === 'bts') {
      base = base.filter(i => i.type === 'bts');
    }

    if (!q) {
      // Default recommended results (top items from each category)
      return base.slice(0, 8);
    }

    return base
      .filter((item) => {
        return (
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.snippet.toLowerCase().includes(q) ||
          item.badge.toLowerCase().includes(q)
        );
      })
      .slice(0, 20);
  }, [query, filterType, allSearchItems]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % Math.max(1, filteredResults.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = filteredResults[selectedIndex];
      if (current) {
        handleSelectResult(current);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const handleSelectResult = (item: SearchResultItem) => {
    sound.playPageFlip();
    onClose();

    if (item.type === 'chapter' || item.type === 'panel') {
      onNavigateChapter(item.targetChapterIndex ?? 0, item.targetPanelIndex ?? 0);
    } else if (item.type === 'character') {
      onNavigateSection('characters', item.targetId);
    } else if (item.type === 'tech') {
      onNavigateSection('technologies', item.targetId);
    } else if (item.type === 'bts') {
      onNavigateSection('bts', item.targetId);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 pt-12 sm:pt-20 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-stone-950 border-2 border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center gap-3 relative bg-stone-900/60">
          <Search className="w-5 h-5 text-amber-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search chapters, characters, 1450°C, Vajra-lepa, BESS, gantry, MQTT..."
            className="w-full bg-transparent text-sm sm:text-base text-stone-100 placeholder-stone-500 outline-none font-body"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-stone-500 bg-stone-950 border border-stone-800 rounded">
            ESC to close
          </kbd>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 border-b border-stone-800/80 bg-stone-950 flex items-center gap-1.5 overflow-x-auto">
          {(
            [
              { key: 'all', label: 'All Content' },
              { key: 'novel', label: 'Graphic Novel Pages' },
              { key: 'characters', label: 'Characters' },
              { key: 'tech', label: 'Engineering Tech' },
              { key: 'bts', label: 'Behind The Scenes' }
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                sound.playClank();
                setFilterType(tab.key);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors whitespace-nowrap ${
                filterType === tab.key
                  ? 'bg-amber-500 text-black font-bold'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results Stream */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3 divide-y divide-stone-900">
          {filteredResults.length > 0 ? (
            filteredResults.map((item, idx) => {
              const isSelected = selectedIndex === idx;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectResult(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 sm:p-3.5 rounded-xl transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-amber-950/25 border border-amber-500/40 text-stone-100'
                      : 'hover:bg-stone-900/60 text-stone-300'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5 shrink-0">
                      {item.type === 'chapter' || item.type === 'panel' ? (
                        <BookOpen className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-stone-500'}`} />
                      ) : item.type === 'character' ? (
                        <Users className={`w-4 h-4 ${isSelected ? 'text-purple-400' : 'text-stone-500'}`} />
                      ) : item.type === 'tech' ? (
                        <Wrench className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-stone-500'}`} />
                      ) : (
                        <Film className={`w-4 h-4 ${isSelected ? 'text-rose-400' : 'text-stone-500'}`} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-xs sm:text-sm font-bold font-comic text-stone-100 truncate">
                          {item.title}
                        </span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      </div>

                      <div className="text-[11px] font-mono text-cyan-400/90 truncate mb-1">
                        {item.subtitle}
                      </div>

                      <p className="text-xs font-body text-stone-400 line-clamp-2 leading-relaxed">
                        {item.snippet}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center text-xs font-mono text-stone-500">
                    {isSelected ? (
                      <span className="hidden sm:flex items-center gap-1 text-amber-400">
                        <span>Select</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </span>
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 text-stone-600" />
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 px-4 text-center flex flex-col items-center gap-2">
              <Hash className="w-8 h-8 text-stone-600" />
              <p className="text-sm font-mono text-stone-400">
                No matching metallurgical entries found for "{query}"
              </p>
              <p className="text-xs font-body text-stone-500">
                Try searching for "1450", "Vajra-lepa", "Gantry", "Agastya", "Priya", "Drone", or "Slag"
              </p>
            </div>
          )}
        </div>

        {/* Modal Keyboard Footer */}
        <div className="p-3 bg-stone-950 border-t border-stone-800 text-[11px] font-mono text-stone-500 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">Navigate: <kbd className="text-stone-400">↑</kbd> <kbd className="text-stone-400">↓</kbd></span>
            <span>Open: <kbd className="text-stone-400">↵</kbd></span>
          </div>
          <span>KUDUA Comprehensive Index</span>
        </div>
      </div>
    </div>
  );
};
