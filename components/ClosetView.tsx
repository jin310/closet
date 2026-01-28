import React, { useState, useMemo } from 'react';
import { MainCategory, ClosetItem, Outfit } from '../types.ts';
import { CATEGORIES } from '../constants.ts';
import { ItemDetailModal } from './ItemDetailModal.tsx';

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
      {/* Category Stats Summary - 新增统计概览 */}
      <div className="px-6 py-4 bg-gray-50/50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[10px] text-gray-400 tracking-[0.2em] uppercase">衣橱分布统计</h2>
          <span className="text-[10px] text-black bg-white px-2 py-0.5 rounded-full border border-gray-100">共 {items.length} 件</span>
        </div>
        <div className="flex gap-1 h-1 rounded-full overflow-hidden bg-gray-100">
          {CATEGORIES.map(cat => {
            const count = categoryCounts[cat.type] || 0;
            const percentage = items.length > 0 ? (count / items.length) * 100 : 0;
            if (count === 0) return null;
            return (
              <div 
                key={cat.type} 
                className="h-full transition-all duration-500"
                style={{ 
                  width: `${percentage}%`, 
                  backgroundColor: cat.type === MainCategory.TOPS ? '#000' : 
                                  cat.type === MainCategory.BOTTOMS ? '#444' : 
                                  cat.type === MainCategory.SHOES ? '#888' : 
                                  cat.type === MainCategory.BAGS ? '#AAA' : '#CCC' 
                }}
              />
            );
          })}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
          {CATEGORIES.map(cat => {
            const count = categoryCounts[cat.type] || 0;
            if (count === 0) return null;
            return (
              <div key={cat.type} className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.type === MainCategory.TOPS ? '#000' : '#888' }} />
                <span className="text-[10px] text-gray-400">{cat.type} {count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-50 px-4 py-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="flex gap-2 items-center">
          <button 
            onClick={() => setSelectedMain('ALL')}
            className={`px-4 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 ${
              selectedMain === 'ALL' ? 'bg-black text-white' : 'bg-white text-gray-400 border border-gray-100'
            }`}
          >
            全部
            <span className={`text-[10px] px-1 py-0.5 rounded-md ${
              selectedMain === 'ALL' ? 'bg-white/20 text-white' : 'bg-gray-50 text-gray-300'
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
                className={`px-4 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 ${
                  isSelected ? 'bg-black text-white' : 'bg-white text-gray-400 border border-gray-100'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.type}</span>
                <span className={`text-[10px] px-1 py-0.5 rounded-md ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-gray-50 text-gray-300'
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
            <span className="text-4xl mb-4 opacity-30">🧺</span>
            <p className="text-xs text-gray-300">还没有添加单品</p>
            <button 
              onClick={onAddItem}
              className="mt-4 text-black text-[10px] border-b border-black pb-0.5"
            >
              点击开始添加
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                onClick={() => setSelectedItem(item)}
                className="group relative bg-white rounded-xl overflow-hidden aspect-[3/4] border border-gray-50 cursor-pointer active:scale-98 transition-all"
              >
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur-sm p-2 flex flex-col justify-end">
                  <p className="text-black text-[10px] truncate leading-tight">{item.name}</p>
                  <p className="text-gray-400 text-[8px] mt-0.5">{item.subCategory}</p>
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