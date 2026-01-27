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

  const stats = useMemo(() => {
    const categoryStats: Record<string, number> = {};
    Object.values(MainCategory).forEach(cat => {
      categoryStats[cat] = items.filter(item => item.mainCategory === cat).length;
    });
    return categoryStats;
  }, [items]);

  const handleSave = () => {
    onUpdateBodyProfile(localProfile);
    setIsEditing(false);
  };

  const MeasurementItem = ({ label, value, field, unit }: { label: string, value?: string, field: keyof BodyProfile, unit: string }) => (
    <div className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0">
      <span className="text-gray-500 text-sm">{label}</span>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <input 
            type="text" 
            value={value || ''} 
            onChange={e => setLocalProfile({...localProfile, [field]: e.target.value})}
            className="w-16 text-right border-none outline-none bg-gray-50 rounded px-1 text-sm py-0.5"
            placeholder="-"
          />
        ) : (
          <span className="text-black text-sm">{value || '--'}</span>
        )}
        <span className="text-gray-300 text-[10px]">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto pb-24">
      {/* User Info */}
      <div className="px-6 pt-10 pb-8 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl mb-4 grayscale">👤</div>
        <h2 className="text-base text-black tracking-wide">我的衣橱主页</h2>
        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Minimal Wardrobe Management</p>
      </div>

      {/* Summary Stats */}
      <div className="px-6 grid grid-cols-2 gap-4 mb-10">
        <div className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100/50">
          <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">单品总数</p>
          <p className="text-xl text-black">{items.length}</p>
        </div>
        <div className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100/50">
          <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">搭配方案</p>
          <p className="text-xl text-black">{outfits.length}</p>
        </div>
      </div>

      {/* Body Profile Section */}
      <div className="px-6 mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs text-gray-400 uppercase tracking-widest">身材档案</h3>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="text-[10px] text-black border-b border-black pb-0.5"
          >
            {isEditing ? '保存修改' : '编辑档案'}
          </button>
        </div>
        <div className="bg-white border border-gray-50 rounded-2xl px-5 shadow-sm shadow-black/[0.02]">
          <MeasurementItem label="身高" value={localProfile.height} field="height" unit="cm" />
          <MeasurementItem label="体重" value={localProfile.weight} field="weight" unit="kg" />
          <MeasurementItem label="肩宽" value={localProfile.shoulder} field="shoulder" unit="cm" />
          <MeasurementItem label="胸围" value={localProfile.chest} field="chest" unit="cm" />
          <MeasurementItem label="腰围" value={localProfile.waist} field="waist" unit="cm" />
          <MeasurementItem label="臀围" value={localProfile.hips} field="hips" unit="cm" />
        </div>
      </div>

      {/* Categories breakdown */}
      <div className="px-6 mb-10">
        <h3 className="text-xs text-gray-400 uppercase tracking-widest mb-4">分类统计</h3>
        <div className="space-y-3">
          {CATEGORIES.map(cat => (
            <div key={cat.type} className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-xl border border-gray-50">
              <span className="text-lg">{cat.icon}</span>
              <span className="flex-1 text-xs text-gray-600">{cat.type}</span>
              <span className="text-xs text-gray-400">{stats[cat.type] || 0} 件</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};