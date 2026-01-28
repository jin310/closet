
import React, { useState, useRef } from 'react';
import { ClosetItem, MainCategory } from '../types.ts';
import { analyzeClothingImage } from '../services/geminiService.ts';

interface AddItemModalProps {
  onClose: () => void;
  onAdd: (item: ClosetItem) => void;
}

const InputField = ({ label, value, onChange, placeholder, type = "text" }: { label: string, value: string | undefined, onChange: (v: string) => void, placeholder?: string, type?: string }) => (
  <div className="space-y-1.5 border-b border-gray-50 py-3 group">
    <label className="text-[10px] font-normal text-gray-400 uppercase tracking-widest">{label}</label>
    <input 
      type={type}
      value={value || ''} 
      onChange={e => onChange(e.target.value)} 
      placeholder={placeholder} 
      className="w-full text-sm font-normal text-black outline-none placeholder:text-gray-200 bg-transparent py-1"
    />
  </div>
);

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
    season: '四季',
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
            style: result.style || prev.style,
            season: result.season || prev.season
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
      season: formData.season,
      purchaseChannel: formData.purchaseChannel,
      purchaseDate: formData.purchaseDate,
      createdAt: Date.now(),
    };
    
    onAdd(newItem);
  };

  const SEASONS = ['春', '夏', '秋', '冬', '四季'];

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-white animate-fade-in overflow-hidden">
      <div className="safe-top bg-white/90 backdrop-blur-xl border-b border-gray-50 sticky top-0 z-50">
        <div className="px-4 h-14 flex justify-between items-center">
          <button onClick={onClose} className="text-gray-400 text-xs tracking-widest px-2">取消</button>
          <h2 className="text-sm font-normal tracking-[0.15em] text-black">录入单品</h2>
          <button onClick={handleSubmit} disabled={!image || isAnalyzing || !formData.name} className="text-black text-xs font-normal tracking-widest px-2 disabled:opacity-20">完成</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-40 scrollbar-hide">
        <div onClick={() => fileInputRef.current?.click()} className="aspect-square w-full bg-gray-50 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer">
          {image ? (
            <img src={image} className="w-full h-full object-cover" alt="Preview" />
          ) : (
            <div className="text-center p-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                <span className="text-2xl">📸</span>
              </div>
              <p className="text-[11px] text-gray-400 uppercase tracking-[0.2em]">点击拍摄或上传照片</p>
            </div>
          )}
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          {isAnalyzing && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
              <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-[10px] font-normal uppercase tracking-widest animate-pulse text-black">AI 智能属性分析中...</p>
            </div>
          )}
        </div>

        <div className="px-6 py-8 space-y-8">
          <InputField label="单品名称" value={formData.name} onChange={v => setFormData({...formData, name: v})} placeholder="例如: 极简白色衬衫" />

          {/* 季节选择器 */}
          <div className="space-y-3">
            <label className="text-[10px] font-normal text-gray-400 uppercase tracking-widest">适用季节</label>
            <div className="flex gap-2">
              {SEASONS.map(s => (
                <button
                  key={s}
                  onClick={() => setFormData({...formData, season: s})}
                  className={`flex-1 py-2 text-[10px] rounded-xl border transition-all ${
                    formData.season === s ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6">
            <div className="space-y-1.5 border-b border-gray-50 py-3">
              <label className="text-[10px] font-normal text-gray-400 uppercase tracking-widest">主分类</label>
              <select value={formData.mainCategory} onChange={e => setFormData({...formData, mainCategory: e.target.value as MainCategory})} className="w-full text-sm bg-transparent outline-none py-1 h-8">
                {Object.values(MainCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <InputField label="细分类" value={formData.subCategory} onChange={v => setFormData({...formData, subCategory: v})} placeholder="如: T恤" />
          </div>

          <div className="grid grid-cols-2 gap-x-6">
            <InputField label="颜色" value={formData.color} onChange={v => setFormData({...formData, color: v})} placeholder="白色 / 米色" />
            <InputField label="风格" value={formData.style} onChange={v => setFormData({...formData, style: v})} placeholder="极简 / 街头" />
          </div>

          <div className="grid grid-cols-2 gap-x-6">
            <InputField label="品牌" value={formData.brand} onChange={v => setFormData({...formData, brand: v})} placeholder="品牌名称" />
            <InputField label="参考价格" value={formData.price} onChange={v => setFormData({...formData, price: v})} placeholder="¥ 0.00" type="number" />
          </div>

          <div className="grid grid-cols-2 gap-x-6">
            <InputField label="尺码" value={formData.size} onChange={v => setFormData({...formData, size: v})} placeholder="S / M / L" />
            <InputField label="购买日期" value={formData.purchaseDate} onChange={v => setFormData({...formData, purchaseDate: v})} type="date" />
          </div>
        </div>
      </div>

      <div className="safe-bottom fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-md border-t border-gray-50 z-[90]">
        <button onClick={handleSubmit} disabled={!image || isAnalyzing || !formData.name} className="w-full bg-black text-white py-4 rounded-2xl text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-black/10 active:scale-[0.98] transition-all disabled:opacity-20">
          确认添加至衣橱
        </button>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};
