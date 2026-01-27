
import React, { useState, useRef } from 'react';
import { ClosetItem, MainCategory } from '../types.ts';
import { analyzeClothingImage } from '../services/geminiService.ts';
import { CATEGORIES } from '../constants.ts';

interface AddItemModalProps {
  onClose: () => void;
  onAdd: (item: ClosetItem) => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({ onClose, onAdd }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<ClosetItem>>({
    name: '',
    mainCategory: MainCategory.TOPS,
    subCategory: '',
    color: '',
    style: '',
    brand: '',
    price: '',
    size: '',
    purchaseChannel: '',
    purchaseDate: new Date().toISOString().split('T')[0]
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setImage(base64);
      
      setIsAnalyzing(true);
      try {
        const result = await analyzeClothingImage(base64);
        if (result) {
          setFormData(prev => ({
            ...prev,
            name: result.suggestedName || prev.name,
            mainCategory: (result.mainCategory as MainCategory) || prev.mainCategory,
            subCategory: result.subCategory || prev.subCategory,
            color: result.color || prev.color,
            style: result.style || prev.style
          }));
        }
      } catch (err) {
        console.error("Analysis failed", err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!image || !formData.name) return;
    
    const newItem: ClosetItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name!,
      mainCategory: formData.mainCategory as MainCategory,
      subCategory: formData.subCategory || '未分类',
      imageUrl: image,
      color: formData.color,
      style: formData.style,
      brand: formData.brand,
      price: formData.price,
      size: formData.size,
      purchaseChannel: formData.purchaseChannel,
      purchaseDate: formData.purchaseDate,
      createdAt: Date.now(),
    };
    
    onAdd(newItem);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center bg-white sticky top-0 z-10">
          <button onClick={onClose} className="text-gray-400 p-2 text-sm">取消</button>
          <h2 className="font-bold">添加单品</h2>
          <button onClick={handleSubmit} disabled={!image || isAnalyzing} className="text-black font-bold p-2 disabled:opacity-30 text-sm">完成</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div onClick={() => fileInputRef.current?.click()} className="aspect-[4/5] w-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer">
            {image ? (
              <img src={image} className="w-full h-full object-contain" alt="Preview" />
            ) : (
              <div className="text-center">
                <span className="text-4xl mb-2 block">📸</span>
                <p className="text-sm text-gray-400 font-medium">点击拍摄或上传</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            {isAnalyzing && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xs font-black uppercase tracking-widest animate-pulse text-black">识别中...</p>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="space-y-1"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">单品名称</label><input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="例如: 简约白色衬衫" className="w-full border-b border-gray-100 py-2 outline-none text-sm font-medium"/></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">主分类</label><select value={formData.mainCategory} onChange={e => setFormData({...formData, mainCategory: e.target.value as MainCategory})} className="w-full bg-gray-50 rounded-lg p-2 text-sm outline-none">{Object.values(MainCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
              <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">细分类</label><input value={formData.subCategory} onChange={e => setFormData({...formData, subCategory: e.target.value})} className="w-full bg-gray-50 rounded-lg p-2 text-sm outline-none"/></div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } } .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1); }`}</style>
    </div>
  );
};
