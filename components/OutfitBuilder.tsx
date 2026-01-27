
import React, { useState, useEffect, useRef } from 'react';
import { ClosetItem, Outfit, OutfitItemPosition, MainCategory } from '../types.ts';
import { CATEGORIES } from '../constants.ts';

interface OutfitBuilderProps {
  items: ClosetItem[];
  onSave: (outfit: Outfit) => void;
}

export const OutfitBuilder: React.FC<OutfitBuilderProps> = ({ items, onSave }) => {
  const [selectedItems, setSelectedItems] = useState<ClosetItem[]>([]);
  const [outfitName, setOutfitName] = useState<string>(`我的搭配 ${new Date().toLocaleDateString()}`);
  const [positions, setPositions] = useState<OutfitItemPosition[]>([]);
  const [filterCat, setFilterCat] = useState<MainCategory>(MainCategory.TOPS);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPositions(prev => {
      const updated = selectedItems.map((item, index) => {
        const existing = prev.find(p => p.itemId === item.id);
        if (existing) return existing;

        let x = 50, y = 50, scale = 1, rotation = (Math.random() - 0.5) * 10;
        if (item.mainCategory === MainCategory.TOPS) { x = 50; y = 35; scale = 1.3; rotation = -2; }
        else if (item.mainCategory === MainCategory.BOTTOMS) { x = 50; y = 65; scale = 1.2; rotation = 3; }
        else if (item.mainCategory === MainCategory.SHOES) { x = 30; y = 85; scale = 0.8; rotation = 15; }
        else if (item.mainCategory === MainCategory.BAGS) { x = 75; y = 75; scale = 1.0; rotation = -10; }

        return { itemId: item.id, x, y, scale, rotation, zIndex: index + 1 };
      });
      return updated.filter(p => selectedItems.some(i => i.id === p.itemId));
    });
  }, [selectedItems]);

  const toggleItem = (item: ClosetItem) => {
    if (selectedItems.find(i => i.id === item.id)) {
      setSelectedItems(selectedItems.filter(i => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleSave = () => {
    const outfit: Outfit = {
      id: Math.random().toString(36).substr(2, 9),
      name: outfitName || `我的搭配 ${new Date().toLocaleDateString()}`,
      items: selectedItems.map(i => i.id),
      positions: positions,
      createdAt: Date.now(),
    };
    onSave(outfit);
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div className="relative h-[45%] bg-white overflow-hidden border-b border-gray-50">
        <div ref={canvasRef} className="absolute inset-0">
          {selectedItems.map(item => {
            const pos = positions.find(p => p.itemId === item.id);
            if (!pos) return null;
            return (
              <div
                key={item.id}
                className="absolute transition-all duration-700 ease-out"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: `translate(-50%, -50%) scale(${pos.scale}) rotate(${pos.rotation}deg)`,
                  zIndex: pos.zIndex,
                }}
              >
                <img src={item.imageUrl} alt={item.name} className="w-32 h-auto drop-shadow-xl" />
              </div>
            );
          })}
          
          {selectedItems.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-200">
              <span className="text-5xl mb-2 opacity-50">🧥</span>
              <p className="text-xs font-black uppercase tracking-[0.2em]">挑选单品开始搭配</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-3 border-b border-gray-50 bg-white">
          <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-1">搭配名称</label>
          <input 
            type="text"
            value={outfitName}
            onChange={(e) => setOutfitName(e.target.value)}
            className="w-full text-sm font-bold text-black border-none outline-none focus:ring-0 placeholder-gray-100"
            placeholder="为这套穿搭起个名字..."
          />
        </div>

        <div className="flex border-b border-gray-50 bg-white overflow-x-auto scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.type}
              onClick={() => setFilterCat(cat.type)}
              className={`flex-1 min-w-[70px] py-3 text-xs font-bold border-b-2 transition-all ${
                filterCat === cat.type ? 'border-black text-black' : 'border-transparent text-gray-300'
              }`}
            >
              <span className="block text-lg mb-0.5">{cat.icon}</span>
              {cat.type}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-white">
          <div className="grid grid-cols-4 gap-2.5">
            {items.filter(i => i.mainCategory === filterCat).map(item => {
              const isSelected = selectedItems.some(si => si.id === item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item)}
                  className={`aspect-square rounded-xl overflow-hidden relative border transition-all active:scale-90 ${
                    isSelected ? 'border-black shadow-sm' : 'border-gray-100'
                  }`}
                >
                  <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.name} />
                  {isSelected && (
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <div className="bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] border border-white">✓</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-50 bg-white">
        <button
          onClick={handleSave}
          disabled={selectedItems.length === 0}
          className="w-full bg-black text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest disabled:opacity-30 active:scale-[0.98] transition-all"
        >
          保存这套搭配
        </button>
      </div>
    </div>
  );
};
