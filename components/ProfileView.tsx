
import React, { useState, useMemo } from 'react';
import { BodyProfile, ClosetItem, MainCategory, Outfit } from '../types.ts';

interface ProfileViewProps {
  items: ClosetItem[];
  outfits: Outfit[];
  bodyProfile: BodyProfile;
  onUpdateBodyProfile: (profile: BodyProfile) => void;
  onImportData: (data: { closetItems: ClosetItem[], outfits: Outfit[], bodyProfile: BodyProfile }) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ 
  items, 
  outfits, 
  bodyProfile, 
  onUpdateBodyProfile,
  onImportData
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localProfile, setLocalProfile] = useState<BodyProfile>(bodyProfile);

  const stats = useMemo(() => {
    const currentYear = new Date().getFullYear();
    let annualSpending = 0;
    let annualCount = 0;
    
    const totalValue = items.reduce((sum: number, item) => {
      const p = parseFloat(item.price || '0');
      return sum + (isNaN(p) ? 0 : p);
    }, 0);
    
    const categoryStats: Record<string, number> = {};
    const seasonStats: Record<string, number> = { '春': 0, '夏': 0, '秋': 0, '冬': 0, '四季': 0 };
    const colorStats: Record<string, number> = {};
    const monthlyData = Array(12).fill(0).map(() => ({ count: 0, spending: 0 }));
    
    items.forEach(item => {
      const price = parseFloat(item.price || '0') || 0;
      if (item.purchaseDate) {
        const date = new Date(item.purchaseDate);
        const year = date.getFullYear();
        const month = date.getMonth();
        if (year === currentYear) {
          annualSpending += price;
          annualCount++;
          monthlyData[month].count++;
          monthlyData[month].spending += price;
        }
      }
      categoryStats[item.mainCategory] = (categoryStats[item.mainCategory] || 0) + 1;
      if (item.season) {
        const s = item.season.includes('春') ? '春' : 
                  item.season.includes('夏') ? '夏' : 
                  item.season.includes('秋') ? '秋' : 
                  item.season.includes('冬') ? '冬' : '四季';
        seasonStats[s]++;
      } else {
        seasonStats['四季']++;
      }
      if (item.color) {
        const c = item.color.split('/')[0].trim().substring(0, 4);
        colorStats[c] = (colorStats[c] || 0) + 1;
      }
    });

    let peakMonthIndex = -1;
    let maxMonthCount = 0;
    monthlyData.forEach((data, index) => {
      if (data.count > maxMonthCount) {
        maxMonthCount = data.count;
        peakMonthIndex = index;
      }
    });

    const expensiveItems = [...items].sort((a, b) => {
      const priceA = parseFloat(a.price || '0') || 0;
      const priceB = parseFloat(b.price || '0') || 0;
      return priceB - priceA;
    }).slice(0, 3);

    return { 
      totalValue, categoryStats, seasonStats, colorStats, expensiveItems,
      annualSpending, annualCount, monthlyData,
      peakMonth: peakMonthIndex !== -1 ? `${peakMonthIndex + 1}月` : '暂无数据',
      avgPrice: annualCount > 0 ? (annualSpending / annualCount).toFixed(0) : '0',
      currentYear, maxMonthCount
    };
  }, [items]);

  const handleExport = () => {
    const data = {
      version: 'v2',
      exportDate: new Date().toISOString(),
      closetItems: items,
      outfits,
      bodyProfile
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart_closet_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        if (data.closetItems && Array.isArray(data.closetItems)) {
          onImportData(data);
        } else {
          alert('无效的数据文件');
        }
      } catch (err) {
        alert('解析文件失败，请确保选择的是有效的备份 JSON 文件。');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // 重置 input
  };

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
          />
        ) : (
          <span className="text-black text-sm">{value || '--'}</span>
        )}
        <span className="text-gray-300 text-[10px]">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto pb-32 scrollbar-hide">
      <div className="px-6 pt-12 pb-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center text-2xl shadow-inner">👤</div>
          <div>
            <h2 className="text-lg text-black font-normal tracking-tight">数字衣橱报告</h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mt-0.5">Updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black text-white rounded-3xl p-6 shadow-xl">
            <p className="text-[9px] uppercase tracking-[0.2em] opacity-50 mb-1">衣橱总量</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-light">{items.length}</span>
              <span className="text-[10px] opacity-70">ITEMS</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
            <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] mb-1">资产估值</p>
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] text-gray-400">¥</span>
              <span className="text-2xl text-black font-light">{stats.totalValue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-12">
        <section className="bg-gray-50/50 rounded-[32px] p-8 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[11px] text-black font-bold uppercase tracking-[0.2em]">{stats.currentYear} 年度购置洞察</h3>
            <span className="text-[9px] text-gray-300 uppercase">Analysis</span>
          </div>
          <div className="grid grid-cols-2 gap-8 mb-10">
            <div className="group">
              <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider group-hover:text-black transition-colors">年度总花费</p>
              <p className="text-2xl text-black font-light">¥{stats.annualSpending.toLocaleString()}</p>
            </div>
            <div className="group">
              <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider group-hover:text-black transition-colors">购物最勤月</p>
              <p className="text-2xl text-pink-400 font-light">{stats.peakMonth}</p>
            </div>
            <div className="group">
              <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider group-hover:text-black transition-colors">购入单品</p>
              <p className="text-2xl text-black font-light">{stats.annualCount} <span className="text-sm">件</span></p>
            </div>
            <div className="group">
              <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider group-hover:text-black transition-colors">件均单价</p>
              <p className="text-2xl text-black font-light">¥{stats.avgPrice}</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100/80">
            <div className="flex justify-between items-end mb-6">
              <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em]">月度购买分布</p>
              <div className="flex gap-4">
                 <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-black"></div><span className="text-[8px] text-gray-400 uppercase">常规</span></div>
                 <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-pink-300"></div><span className="text-[8px] text-gray-400 uppercase">最高</span></div>
              </div>
            </div>
            <div className="relative h-32 flex items-end justify-between gap-1 px-1">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
                 {[...Array(4)].map((_, i) => (<div key={i} className="w-full border-t border-gray-100/60 h-0"></div>))}
              </div>
              {stats.monthlyData.map((data, i) => {
                const max = Math.max(stats.maxMonthCount, 1);
                const height = (data.count / max) * 100;
                const isPeak = data.count === stats.maxMonthCount && data.count > 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center group relative z-10 h-full justify-end">
                    <div className="absolute -top-6 opacity-0 group-active:opacity-100 group-hover:opacity-100 transition-all duration-300 bg-black text-white text-[8px] px-1.5 py-0.5 rounded shadow-lg pointer-events-none transform -translate-y-1">{data.count}件</div>
                    <div className="w-full bg-gray-100/40 rounded-t-full relative overflow-hidden flex items-end h-24">
                      <div className={`w-full rounded-t-full transition-all duration-1000 ease-out ${isPeak ? 'bg-pink-300' : 'bg-black'}`} style={{ height: `${height}%` }} />
                    </div>
                    <span className={`text-[8px] mt-2 transition-colors ${isPeak ? 'text-pink-400 font-bold' : 'text-gray-300'}`}>{i + 1}月</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[11px] text-black font-bold uppercase tracking-[0.2em]">数据备份与恢复</h3>
            <span className="text-[9px] text-gray-300 uppercase">Portability</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleExport}
              className="flex items-center justify-center gap-2 py-3 border border-gray-100 rounded-2xl text-[10px] text-black uppercase tracking-widest active:bg-gray-50 transition-colors"
            >
              📤 备份数据
            </button>
            <label className="flex items-center justify-center gap-2 py-3 border border-gray-100 rounded-2xl text-[10px] text-black uppercase tracking-widest active:bg-gray-50 transition-colors cursor-pointer">
              📥 导入数据
              <input type="file" className="hidden" accept=".json" onChange={handleFileImport} />
            </label>
          </div>
          <p className="text-[9px] text-gray-400 mt-4 text-center leading-relaxed">
            建议定期备份，避免浏览器清理缓存导致数据丢失。<br/>
            在 iOS 上添加到主屏后，如果数据未同步，可使用导入功能。
          </p>
        </section>

        <section className="bg-white rounded-3xl p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[11px] text-gray-400 uppercase tracking-[0.2em]">身材档案</h3>
            <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className="text-[10px] text-black border-b border-black pb-0.5">{isEditing ? '保存' : '编辑'}</button>
          </div>
          <div className="grid grid-cols-2 gap-x-8">
            <MeasurementItem label="身高" value={localProfile.height} field="height" unit="cm" />
            <MeasurementItem label="体重" value={localProfile.weight} field="weight" unit="kg" />
            <MeasurementItem label="肩宽" value={localProfile.shoulder} field="shoulder" unit="cm" />
            <MeasurementItem label="胸围" value={localProfile.chest} field="chest" unit="cm" />
            <MeasurementItem label="腰围" value={localProfile.waist} field="waist" unit="cm" />
            <MeasurementItem label="臀围" value={localProfile.hips} field="hips" unit="cm" />
          </div>
        </section>
      </div>
    </div>
  );
};
