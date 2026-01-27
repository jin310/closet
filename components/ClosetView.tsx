
import React, { useState, useMemo } from 'react';
import { MainCategory, ClosetItem, Outfit } from '../types';
import { CATEGORIES } from '../constants';
import { ItemDetailModal } from './ItemDetailModal';

interface ClosetViewProps {
  items: ClosetItem[];
  outfits: Outfit[];
  onAddItem: () => void;
  onUpdateItem: (item: ClosetItem) => void;
  onDeleteItem: (id: string) => void;
  onViewOutfit: (id: string) => void;
}

export const ClosetView: React.FC<ClosetViewProps> = ({ items, outfits, onAddItem, onUpdateItem, onDeleteItem, onViewOutfit }) => {
  const [selectedMain, setSelectedMain] = useState<MainCategory | 'ALL'>('ALL');
  const [selectedItem, setSelectedItem] = useState<ClosetItem | null>(null);

  const filteredItems = useMemo(() => {
    return selectedMain === 'ALL' 
      ? items 
      : items.filter(item => item.mainCategory === selectedMain);
  }, [items, selectedMain]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CATEGORIES.forEach(cat => {
      counts[cat.type] = items.filter(item => item.mainCategory === cat.type).length;
    });
    return counts;
  }, [items]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Category Tabs */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-50 px-4 py-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="flex gap-3 items-center">
          <button 
            onClick={() => setSelectedMain('ALL')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
              selectedMain === 'ALL' ? 'bg-black text-white shadow-md' : 'bg-white text-gray-400 border border-gray-100'
            }`}
          >
            全部
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              selectedMain === 'ALL' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {items.length}
            </span>
          </button>
          
          {CATEGORIES.map(cat => {
            const count = categoryCounts[cat.type] || 0;
            const isSelected = selectedMain === cat.type;
            return (
              <button
                key={cat.type}
                onClick={() => setSelectedMain(cat.type)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                  isSelected ? 'bg-black text-white shadow-md' : 'bg-white text-gray-400 border border-gray-100'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.type}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24 bg-white">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-200">
            <span className="text-4xl mb-4 opacity-50">🧺</span>
            <p className="font-bold text-sm text-gray-300">这里还没有衣物</p>
            <button 
              onClick={onAddItem}
              className="mt-4 text-black font-black text-xs uppercase tracking-widest border-b border-black pb-1"
            >
              点击添加第一件
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                onClick={() => setSelectedItem(item)}
                className="group relative bg-white rounded-2xl overflow-hidden aspect-[3/4] border border-gray-100 shadow-sm cursor-pointer active:scale-95 transition-all hover:shadow-lg"
              >
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm p-3 flex flex-col justify-end">
                  <p className="text-black text-[10px] font-black uppercase italic tracking-tighter truncate leading-tight">{item.name}</p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-gray-400 text-[8px] font-bold uppercase tracking-widest">{item.subCategory}</p>
                    {item.brand && <p className="text-gray-300 text-[7px] font-black">{item.brand}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedItem && (
        <ItemDetailModal 
          item={selectedItem} 
          outfits={outfits}
          items={items}
          onClose={() => setSelectedItem(null)}
          onUpdate={(updated) => {
            onUpdateItem(updated);
            setSelectedItem(updated);
          }}
          onDelete={onDeleteItem}
          onViewOutfit={onViewOutfit}
        />
      )}
    </div>
  );
};
