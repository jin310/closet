import React, { useState } from 'react';
import { ClosetItem, MainCategory, Outfit } from '../types.ts';

interface ItemDetailModalProps {
  item: ClosetItem;
  outfits: Outfit[];
  items: ClosetItem[];
  onClose: () => void;
  onUpdate: (item: ClosetItem) => void;
  onDelete: (id: string) => void;
  onViewOutfit: (id: string) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, outfits, items, onClose, onUpdate, onDelete, onViewOutfit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState<ClosetItem>({ ...item });

  const relatedOutfits = outfits.filter(o => o.items.includes(item.id));

  const handleSave = () => {
    onUpdate(editedItem);
    setIsEditing(false);
  };

  const handleOutfitClick = (outfitId: string) => {
    onClose();
    onViewOutfit(outfitId);
  };

  const getOutfitPreviewItems = (outfit: Outfit) => {
    return items.filter(i => outfit.items.includes(i.id));
  };

  const DetailRow = ({ label, value, field, type = "text" }: { label: string, value: string | undefined, field: keyof ClosetItem, type?: string }) => (
    <div className="py-4 border-b border-gray-50 last:border-0">
      <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] block mb-1">{label}</label>
      {isEditing ? (
        field === 'mainCategory' ? (
          <select 
            value={editedItem[field] as string}
            onChange={e => setEditedItem({...editedItem, [field]: e.target.value as MainCategory})}
            className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
          >
            {Object.values(MainCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        ) : (
          <input 
            type={type}
            value={(editedItem[field] as string) || ''}
            onChange={e => setEditedItem({...editedItem, [field]: e.target.value})}
            className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black text-black"
            placeholder={`请输入${label}`}
          />
        )
      ) : (
        <p className="text-sm text-black font-normal">{value || '--'}</p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-white animate-fade-in">
      {/* 沉浸式头部 - 关键修复：添加安全区域适配和粘性定位 */}
      <div className="safe-top bg-white/90 backdrop-blur-xl border-b border-gray-50 sticky top-0 z-50">
        <div className="px-4 h-14 flex justify-between items-center">
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-start text-gray-400 active:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          
          <h2 className="text-sm font-normal tracking-[0.15em] text-black">单品详情</h2>
          
          <div className="w-10 flex justify-end">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-[11px] text-black tracking-widest active:opacity-50"
              >
                编辑
              </button>
            ) : (
              <button 
                onClick={() => setIsEditing(false)}
                className="text-[11px] text-gray-400 tracking-widest active:opacity-50"
              >
                取消
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        {/* 单品大图 */}
        <div className="aspect-[3/4] w-full bg-gray-50 overflow-hidden relative">
          <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-40"></div>
        </div>

        {/* 详情内容 */}
        <div className="px-6 py-6 space-y-2">
          {!isEditing && (
            <div className="mb-8">
              <h3 className="text-xl text-black tracking-tight leading-tight">{item.name}</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-black text-white text-[9px] px-2 py-0.5 rounded-full uppercase tracking-tighter">{item.mainCategory}</span>
                <span className="text-gray-300 text-[10px] uppercase tracking-[0.1em]">{item.subCategory}</span>
              </div>
            </div>
          )}
          
          {isEditing && (
            <DetailRow label="单品名称" value={editedItem.name} field="name" />
          )}
          
          <div className="grid grid-cols-2 gap-x-6">
            <DetailRow label="主分类" value={item.mainCategory} field="mainCategory" />
            <DetailRow label="细分类" value={item.subCategory} field="subCategory" />
          </div>
          
          <div className="grid grid-cols-2 gap-x-6">
            <DetailRow label="颜色" value={item.color} field="color" />
            <DetailRow label="风格" value={item.style} field="style" />
          </div>

          <div className="grid grid-cols-2 gap-x-6">
            <DetailRow label="品牌" value={item.brand} field="brand" />
            <DetailRow label="尺码" value={item.size} field="size" />
          </div>

          <DetailRow label="参考价格" value={item.price ? `¥ ${item.price}` : undefined} field="price" />

          {/* 相关穿搭展示 */}
          {!isEditing && (
            <div className="mt-12">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-[10px] text-gray-300 uppercase tracking-[0.2em] whitespace-nowrap">灵感穿搭</h3>
                <div className="h-[1px] bg-gray-50 flex-1"></div>
              </div>
              
              {relatedOutfits.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {relatedOutfits.map(outfit => {
                    const previewItems = getOutfitPreviewItems(outfit);
                    return (
                      <div 
                        key={outfit.id} 
                        onClick={() => handleOutfitClick(outfit.id)}
                        className="min-w-[140px] flex flex-col gap-2 cursor-pointer active:opacity-70 transition-all"
                      >
                        <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 p-0.5">
                          <div className="grid grid-cols-2 grid-rows-2 gap-0.5 w-full h-full">
                            {previewItems.slice(0, 4).map(pi => (
                              <img key={pi.id} src={pi.imageUrl} className="w-full h-full object-cover" />
                            ))}
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-400 truncate tracking-tight">{outfit.name}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-10 border border-dashed border-gray-100 rounded-3xl text-center">
                  <p className="text-[10px] text-gray-300 uppercase tracking-widest italic">暂无相关搭配</p>
                </div>
              )}
            </div>
          )}

          {/* 删除按钮 */}
          {!isEditing && (
            <div className="pt-10">
              <button 
                onClick={() => {
                  if(confirm('确定要从衣橱中永久移除这件单品吗？')) {
                    onDelete(item.id);
                    onClose();
                  }
                }}
                className="w-full py-4 text-red-400 text-[11px] uppercase tracking-[0.2em] border border-red-50 rounded-2xl active:bg-red-50 transition-colors"
              >
                移除此单品
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 底部保存按钮 - 仅在编辑模式下显示，且固定在底部安全区域 */}
      {isEditing && (
        <div className="safe-bottom fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-md border-t border-gray-50">
          <button
            onClick={handleSave}
            className="w-full bg-black text-white py-4 rounded-2xl text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-black/10 active:scale-[0.98] transition-all"
          >
            保存修改
          </button>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(1.05); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};