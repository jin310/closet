
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
    
    // 月度统计数据结构 [0-11]
    const monthlyData = Array(12).fill(0).map(() => ({ count: 0, spending: 0 }));
    
    items.forEach(item => {
      const price = parseFloat(item.price || '0') || 0;
      
      // 年度统计
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

      // 分类统计
      categoryStats[item.mainCategory] = (categoryStats[item.mainCategory] || 0) + 1;
      
      // 季节统计
      if (item.season) {
        const s = item.season.includes('春') ? '春' : 
                  item.season.includes('夏') ? '夏' : 
                  item.season.includes('秋') ? '秋' : 
                  item.season.includes('冬') ? '冬' : '四季';
        seasonStats[s]++;
      } else {
        seasonStats['四季']++;
      }
      
      // 颜色统计
      if (item.color) {
        const c = item.color.split('/')[0].trim().substring(0, 4);
        colorStats[c] = (colorStats[c] || 0) + 1;
      }
    });

    // 寻找购物峰值月
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
      totalValue, 
      categoryStats, 
      seasonStats, 
      colorStats, 
      expensiveItems,
      annualSpending,
      annualCount,
      monthlyData,
      peakMonth: peakMonthIndex !== -1 ? `${peakMonthIndex + 1}月` : '暂无数据',
      avgPrice: annualCount > 0 ? (annualSpending / annualCount).toFixed(0) : '0',
      currentYear
    };
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
      {/* 头部概览 */}
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
        {/* 年度购买洞察 */}
        <section className="bg-gray-50/50 rounded-[32px] p-8 border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[11px] text-black font-bold uppercase tracking-[0.2em]">{stats.currentYear} 年度购置洞察</h3>
            <span className="text-[9px] text-gray-300 uppercase">Analysis</span>
          </div>
          
          <div className="grid grid-cols-2 gap-8 mb-10">
            <div>
              <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider">年度总花费</p>
              <p className="text-2xl text-black font-light">¥{stats.annualSpending.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider">购物最勤月</p>
              <p className="text-2xl text-pink-400 font-light">{stats.peakMonth}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider">购入单品</p>
              <p className="text-2xl text-black font-light">{stats.annualCount} <span className="text-sm">件</span></p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider">件均单价</p>
              <p className="text-2xl text-black font-light">¥{stats.avgPrice}</p>
            </div>
          </div>

          {/* 月度趋势图 */}
          <div className="space-y-4">
            <p className="text-[9px] text-gray-300 uppercase tracking-[0.2em] mb-4">Monthly Trends (Items)</p>
            <div className="flex items-end justify-between h-20 gap-1.5 px-2">
              {stats.monthlyData.map((data, i) => {
                const maxCount = Math.max(...stats.monthlyData.map(d => d.count), 1);
                const height = (data.count / maxCount) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full bg-gray-100 rounded-t-full relative overflow-hidden flex items-end" style={{ height: '100%' }}>
                      <div 
                        className={`w-full rounded-t-full transition-all duration-1000 ${data.count === maxCount ? 'bg-pink-300' : 'bg-black'}`}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <span className="text-[8px] text-gray-300">{i + 1}月</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 季节分布 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-[11px] text-gray-300 uppercase tracking-[0.2em] whitespace-nowrap">季节分布</h3>
            <div className="h-[1px] bg-gray-50 flex-1"></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(stats.seasonStats).map(([label, count]) => (
              <div key={label} className="bg-white border border-gray-50 p-4 rounded-2xl flex justify-between items-center">
                <span className="text-xs text-gray-500">{label}季</span>
                <span className="text-sm text-black font-light">{count} 件</span>
              </div>
            ))}
          </div>
        </section>

        {/* 色彩比例 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-[11px] text-gray-300 uppercase tracking-[0.2em] whitespace-nowrap">衣橱色彩基调</h3>
            <div className="h-[1px] bg-gray-50 flex-1"></div>
          </div>
          <div className="flex flex-wrap gap-3">
            {Object.entries(stats.colorStats).sort(([, a], [, b]) => (b as number) - (a as number)).slice(0, 6).map(([color, count]) => (
              <div key={color} className="flex flex-col items-center gap-2 bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100 min-w-[70px]">
                <span className="text-xs text-black font-medium">{color}</span>
                <span className="text-[9px] text-gray-400">{count} 件</span>
              </div>
            ))}
          </div>
        </section>

        {/* 核心单品排行 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-[11px] text-gray-300 uppercase tracking-[0.2em] whitespace-nowrap">价值 TOP 3 单品</h3>
            <div className="h-[1px] bg-gray-50 flex-1"></div>
          </div>
          <div className="space-y-3">
            {stats.expensiveItems.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-4 bg-white border border-gray-50 p-3 rounded-2xl shadow-sm">
                <div className="text-[10px] font-bold text-gray-200 w-4 italic">{idx + 1}</div>
                <img src={item.imageUrl} className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-black truncate">{item.name}</p>
                  <p className="text-[9px] text-gray-400 uppercase tracking-wider">{item.brand || 'NO BRAND'}</p>
                </div>
                <div className="text-xs font-medium text-black">¥{item.price}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 身材档案 */}
        <section className="bg-white rounded-3xl p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[11px] text-gray-400 uppercase tracking-[0.2em]">身材档案</h3>
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="text-[10px] text-black border-b border-black pb-0.5"
            >
              {isEditing ? '保存' : '编辑'}
            </button>
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
