import React, { useState, useMemo } from 'react';
import { BodyProfile, ClosetItem, MainCategory, Outfit } from '../types.ts';
import { CATEGORIES } from '../constants.ts';

interface ProfileViewProps {
  items: ClosetItem[];
  outfits: Outfit[];
  bodyProfile: BodyProfile;
  onUpdateBodyProfile: (profile: BodyProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ items, outfits, bodyProfile, onUpdateBodyProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localProfile, setLocalProfile] = useState<BodyProfile>(bodyProfile);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  const stats = useMemo(() => {
    const categoryStats: Record<string, { total: number; sub: Record<string, number> }> = {};
    Object.values(MainCategory).forEach(cat => {
      categoryStats[cat] = { total: 0, sub: {} };
    });
    items.forEach(item => {
      if (categoryStats[item.mainCategory]) {
        categoryStats[item.mainCategory].total += 1;
        const subCat = item.subCategory || '未分类';
        categoryStats[item.mainCategory].sub[subCat] = (categoryStats[item.mainCategory].sub[subCat] || 0) + 1;
      }
    });
    return categoryStats;
  }, [items]);

  const handleSave = () => {
    onUpdateBodyProfile(localProfile);
    setIsEditing(false);
  };

  const MeasurementItem = ({ label, value, field, unit }: { label: string, value?: string, field: keyof BodyProfile, unit: string }) => (
    <div className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0">
      <span className="text-gray-400 text-sm font-medium">{label}</span>
      {isEditing ? (
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={localProfile[field] || ''}
            onChange={(e) => setLocalProfile({ ...localProfile, [field]: e.target.value })}
            className="w-20 text-right border-b border-gray-200 py-1 text-sm focus:outline-none focus:border-black"
            placeholder="-"
          />
          <span className="text-xs text-gray-400 w-8">{unit}</span>
        </div>
      ) : (
        <span className="font-bold text-sm text-black">{value || '--'} <span className="text-[10px] text-gray-300 font-normal ml-1">{unit}</span></span>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto pb-24">
      {/* User Header */}
      <div className="p-8 flex flex-col items-center bg-white">
        <div className="relative">
          <div className="w-24 h-24 bg-gray-50 border border-gray-100 rounded-full mb-4 flex items-center justify-center overflow-hidden shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=200&auto=format&fit=crop" 
              alt="Profile Avatar"
              className="w-full h-full object-cover grayscale opacity-80"
            />
          </div>
          <button className="absolute bottom-4 right-0 bg-black text-white rounded-full w-7 h-7 flex items-center justify-center text-xs border-2 border-white shadow-md">
            ✎
          </button>
        </div>
        <h2 className="text-xl font-black text-black tracking-tight">我的衣橱主理人</h2>
        <p className="text-gray-300 text-[10px] mt-1 italic tracking-[0.2em] font-black uppercase">WARDROBE CURATOR</p>
        
        <div className="grid grid-cols-2 gap-4 mt-8 w-full">
          <div className="bg-white p-4 rounded-2xl text-center border border-gray-100 shadow-sm">
            <p className="text-2xl font-black text-black">{items.length}</p>
            <p className="text-[10px] text-gray-300 uppercase tracking-widest font-black">单品总数</p>
          </div>
          <div className="bg-white p-4 rounded-2xl text-center border border-gray-100 shadow-sm">
            <p className="text-2xl font-black text-black">{outfits.length || 0}</p>
            <p className="text-[10px] text-gray-300 uppercase tracking-widest font-black">灵感搭配</p>
          </div>
        </div>
      </div>

      {/* Wardrobe Stats Section */}
      <div className="px-6 py-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-gray-300 flex items-center gap-3">
          <span className="flex-1 h-[1px] bg-gray-50"></span>
          分类面板
          <span className="flex-1 h-[1px] bg-gray-50"></span>
        </h3>
        <div className="space-y-3">
          {CATEGORIES.map(cat => {
            const data = stats[cat.type];
            const isExpanded = expandedCat === cat.type;
            return (
              <div key={cat.type} className="flex flex-col gap-1">
                <button 
                  onClick={() => setExpandedCat(isExpanded ? null : cat.type)}
                  className="bg-white rounded-xl p-4 border border-gray-50 shadow-sm flex justify-between items-center active:bg-gray-50 transition-colors w-full"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-sm font-bold text-gray-600">{cat.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-black">{data.total} <span className="text-[9px] text-gray-300 ml-0.5 uppercase tracking-tighter">Items</span></span>
                    <span className={`text-[10px] text-gray-300 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-4 py-3 bg-gray-50/50 rounded-xl space-y-2 mb-2 border border-gray-50 mx-1 animate-fadeIn">
                    {Object.entries(data.sub).length > 0 ? Object.entries(data.sub).map(([sub, count]) => (
                      <div key={sub} className="flex justify-between items-center border-b border-gray-100/50 last:border-0 pb-1 last:pb-0">
                        <span className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">{sub}</span>
                        <span className="text-xs font-black text-black">{count}</span>
                      </div>
                    )) : (
                      <p className="text-[10px] text-gray-300 italic text-center py-1">暂无单品数据</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Body Measurements Section */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-300">身材档案</h3>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="text-[10px] font-black text-black uppercase tracking-widest border-b border-black pb-0.5"
          >
            {isEditing ? '确认保存' : '修改档案'}
          </button>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-50 shadow-sm">
          <div className="grid grid-cols-1">
            <MeasurementItem label="身高" value={bodyProfile.height} field="height" unit="CM" />
            <MeasurementItem label="体重" value={bodyProfile.weight} field="weight" unit="KG" />
            <MeasurementItem label="肩宽" value={bodyProfile.shoulder} field="shoulder" unit="CM" />
            <MeasurementItem label="胸围" value={bodyProfile.chest} field="chest" unit="CM" />
            <MeasurementItem label="腰围" value={bodyProfile.waist} field="waist" unit="CM" />
            <MeasurementItem label="臀围" value={bodyProfile.hips} field="hips" unit="CM" />
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};