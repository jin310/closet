
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
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">{label}</label>
      {isEditing ? (
        field === 'mainCategory' ? (
          <select 
            value={editedItem[field] as string}
            onChange={e => setEditedItem({...editedItem, [field]: e.target.value as MainCategory})}
            className="w-full bg-white border-b border-gray-200 py-1 text-sm outline-none focus:border-black"
          >
            {Object.values(MainCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        ) : (
          <input 
            type={type}
            value={(editedItem[field] as string) || ''}
            onChange={e => setEditedItem({...editedItem, [field]: e.target.value})}
            className="w-full bg-white border-b border-gray-200 py-1 text-sm outline-none focus:border-black font-bold text-black"
            placeholder={`输入${label}`}
          />
        )
      ) : (
        <p className="text-sm font-bold text-black">{value || '--'}</p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden animate-slide-up max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
          <button onClick={onClose} className="text-gray-300 font-bold p-2 text-xs uppercase tracking-widest">返回</button>
          <h2 className="font-black text-black text-sm tracking-tighter uppercase">ITEM DETAILS</h2>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`font-black p-2 text-xs uppercase tracking-widest ${isEditing ? 'text-green-600' : 'text-black'}`}
          >
            {isEditing ? 'DONE' : 'EDIT'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-12">
          {/* Cover Image */}
          <div className="aspect-[3/4] w-full bg-white relative">
            <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.name} />
            <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm p-8">
              {!isEditing && (
                <div>
                  <h3 className="text-black text-2xl font-black italic uppercase tracking-tighter leading-tight">{item.name}</h3>
                  <p className="text-gray-400 text-[10px] font-black uppercase mt-1 tracking-[0.2em]">{item.subCategory}</p>
                </div>
              )}
            </div>
          </div>

          <div className="px-8 space-y-2 mt-4">
            {isEditing && (
              <DetailRow label="单品名称" value={editedItem.name} field="name" />
            )}
            
            <div className="grid grid-cols-2 gap-x-8">
              <DetailRow label="主分类" value={item.mainCategory} field="mainCategory" />
              <DetailRow label="细分类" value={item.subCategory} field="subCategory" />
            </div>
            
            <div className="grid grid-cols-2 gap-x-8">
              <DetailRow label="颜色" value={item.color} field="color" />
              <DetailRow label="风格" value={item.style} field="style" />
            </div>

            <div className="grid grid-cols-2 gap-x-8">
              <DetailRow label="品牌" value={item.brand} field="brand" />
              <DetailRow label="尺码" value={item.size} field="size" />
            </div>

            <DetailRow label="参考价格" value={item.price ? `¥ ${item.price}` : undefined} field="price" />

            {!isEditing && (
              <div className="mt-12">
                <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                  灵感搭配
                  <span className="flex-1 h-[1px] bg-gray-50"></span>
                </h3>
                {relatedOutfits.length > 0 ? (
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {relatedOutfits.map(outfit => {
                      const previewItems = getOutfitPreviewItems(outfit);
                      return (
                        <div 
                          key={outfit.id} 
                          onClick={() => handleOutfitClick(outfit.id)}
                          className="min-w-[130px] flex flex-col gap-3 cursor-pointer active:scale-95 transition-all group"
                        >
                          <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex items-center justify-center p-0.5 group-hover:border-black transition-all">
                            <div className="grid grid-cols-2 grid-rows-2 gap-0.5 w-full h-full">
                              {previewItems.slice(0, 4).map(pi => (
                                <img key={pi.id} src={pi.imageUrl} className="w-full h-full object-cover" />
                              ))}
                            </div>
                          </div>
                          <p className="text-[10px] font-black text-gray-400 truncate uppercase tracking-tighter group-hover:text-black">{outfit.name}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-8 px-4 border border-dashed border-gray-100 rounded-3xl text-center">
                    <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic">No related outfits yet</p>
                  </div>
                )}
              </div>
            )}

            {!isEditing && (
              <button 
                onClick={() => {
                  if(confirm('确定要从我的衣橱中移除这件珍藏吗？')) {
                    onDelete(item.id);
                    onClose();
                  }
                }}
                className="w-full mt-12 py-4 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] border border-red-50 rounded-2xl hover:bg-red-50 transition-colors"
              >
                移除此单品
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};
