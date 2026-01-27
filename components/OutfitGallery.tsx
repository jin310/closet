
import React, { useState, useRef, useEffect } from 'react';
import { Outfit, ClosetItem } from '../types';

interface OutfitGalleryProps {
  outfits: Outfit[];
  items: ClosetItem[];
  initialOutfitId?: string | null;
  onClearFocusedOutfit?: () => void;
  onCreateNew: () => void;
  onUpdateOutfit: (outfit: Outfit) => void;
  onReorderOutfits: (outfits: Outfit[]) => void;
  onDeleteOutfit: (id: string) => void;
}

export const OutfitGallery: React.FC<OutfitGalleryProps> = ({ 
  outfits, 
  items, 
  initialOutfitId,
  onClearFocusedOutfit,
  onCreateNew, 
  onUpdateOutfit, 
  onReorderOutfits,
  onDeleteOutfit 
}) => {
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  
  // Reordering State
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const longPressTimer = useRef<number | null>(null);

  // Auto-open detail if initialOutfitId is provided
  useEffect(() => {
    if (initialOutfitId) {
      const target = outfits.find(o => o.id === initialOutfitId);
      if (target) {
        handleOpenDetail(target);
      }
      onClearFocusedOutfit?.();
    }
  }, [initialOutfitId, outfits]);

  const getOutfitItems = (outfit: Outfit) => {
    return items.filter(i => outfit.items.includes(i.id));
  };

  const handleOpenDetail = (outfit: Outfit) => {
    setSelectedOutfit(outfit);
    setTempName(outfit.name);
    setIsEditingName(false);
  };

  const handleSaveName = () => {
    if (selectedOutfit && tempName.trim()) {
      const updated = { ...selectedOutfit, name: tempName.trim() };
      onUpdateOutfit(updated);
      setSelectedOutfit(updated);
      setIsEditingName(false);
    }
  };

  const onDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const onDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newOutfits = [...outfits];
    const [draggedItem] = newOutfits.splice(draggedIndex, 1);
    newOutfits.splice(index, 0, draggedItem);
    
    onReorderOutfits(newOutfits);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handlePointerDown = (index: number) => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    longPressTimer.current = window.setTimeout(() => {
      setDraggedIndex(index);
    }, 500);
  };

  const handlePointerUp = (outfit: Outfit) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (draggedIndex === null) {
      handleOpenDetail(outfit);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 flex justify-between items-center border-b border-gray-50">
        <h2 className="text-sm font-black uppercase tracking-widest text-violet-300">已保存的搭配 ({outfits.length})</h2>
        <button 
          onClick={onCreateNew}
          className="bg-violet-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg active:scale-95 transition-transform"
        >
          + 新建搭配
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {outfits.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-200">
            <span className="text-5xl mb-4">✨</span>
            <p className="text-sm font-medium">还没有保存任何搭配</p>
            <p className="text-[10px] mt-1 opacity-60">点击上方按钮开始创作</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {outfits.map((outfit, index) => {
              const outfitItems = getOutfitItems(outfit);
              const isDragging = draggedIndex === index;
              const isOver = dragOverIndex === index;

              return (
                <div 
                  key={outfit.id}
                  draggable={draggedIndex !== null}
                  onDragStart={() => onDragStart(index)}
                  onDragOver={(e) => onDragOver(e, index)}
                  onDrop={() => onDrop(index)}
                  onDragEnd={() => { setDraggedIndex(null); setDragOverIndex(null); }}
                  onPointerDown={() => handlePointerDown(index)}
                  onPointerUp={() => handlePointerUp(outfit)}
                  onPointerLeave={() => { if(longPressTimer.current) clearTimeout(longPressTimer.current); }}
                  className={`group relative aspect-[3/4] rounded-3xl overflow-hidden bg-white border transition-all duration-300 cursor-pointer touch-none
                    ${isDragging ? 'opacity-40 scale-90 rotate-2 border-dashed border-gray-400 z-50' : 'opacity-100 border-gray-100'}
                    ${isOver && !isDragging ? 'scale-105 border-violet-600 ring-2 ring-violet-600/10' : ''}
                    ${draggedIndex !== null ? 'shadow-xl' : 'shadow-sm active:scale-95'}
                  `}
                >
                  <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-0.5 p-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    {outfitItems.slice(0, 4).map(item => (
                      <img key={item.id} src={item.imageUrl} className="w-full h-full object-cover" />
                    ))}
                    {outfitItems.length < 4 && Array.from({ length: 4 - outfitItems.length }).map((_, i) => (
                      <div key={i} className="bg-gray-50 flex items-center justify-center text-[10px] text-violet-100 font-black italic">ITEM</div>
                    ))}
                  </div>
                  
                  {/* Updated: Light white/transparent area for text instead of dark gradient */}
                  <div className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur-sm p-3 flex flex-col justify-end">
                    <p className="text-violet-900 text-[10px] font-black uppercase italic tracking-tighter truncate">{outfit.name}</p>
                    <p className="text-violet-400 text-[8px] font-bold uppercase tracking-widest">{outfitItems.length} 件单品</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {draggedIndex !== null && (
          <p className="text-center mt-6 text-[10px] font-bold text-violet-300 uppercase tracking-widest animate-pulse">
            松手即可完成排序
          </p>
        )}
      </div>

      {/* Detail Modal */}
      {selectedOutfit && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOutfit(null)}></div>
          <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden animate-slide-up max-h-[85vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-white sticky top-0 z-10">
              <button onClick={() => setSelectedOutfit(null)} className="text-gray-400 text-sm p-2">返回</button>
              
              {isEditingName ? (
                <div className="flex-1 px-4">
                  <input 
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    autoFocus
                    onBlur={handleSaveName}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                    className="w-full font-bold text-sm border-b border-violet-600 outline-none py-1 text-violet-600"
                  />
                </div>
              ) : (
                <h3 
                  className="font-bold text-sm flex items-center gap-1 cursor-pointer text-violet-900"
                  onClick={() => setIsEditingName(true)}
                >
                  {selectedOutfit.name}
                  <span className="text-[10px] text-violet-300">✎</span>
                </h3>
              )}

              <button 
                onClick={() => {
                  if(confirm('确定删除这套搭配吗？')) {
                    onDeleteOutfit(selectedOutfit.id);
                    setSelectedOutfit(null);
                  }
                }}
                className="text-red-500 text-sm p-2"
              >删除</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="grid grid-cols-2 gap-2 aspect-[3/4] rounded-3xl overflow-hidden border border-gray-100">
                {getOutfitItems(selectedOutfit).slice(0, 4).map(item => (
                  <img key={item.id} src={item.imageUrl} className="w-full h-full object-cover" />
                ))}
              </div>
              
              <div>
                <h4 className="text-[10px] font-black text-violet-300 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                  包含单品
                  <span className="flex-1 h-[1px] bg-gray-50"></span>
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {getOutfitItems(selectedOutfit).map(item => (
                    <div key={item.id} className="space-y-2 text-center group">
                      <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-gray-100 transition-all group-hover:border-violet-200">
                        <img src={item.imageUrl} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-[8px] font-bold text-gray-500 truncate px-1 uppercase tracking-tighter group-hover:text-violet-600">{item.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};
