
import React, { useState, useEffect } from 'react';
import { ClosetView } from './components/ClosetView.tsx';
import { OutfitBuilder } from './components/OutfitBuilder.tsx';
import { OutfitGallery } from './components/OutfitGallery.tsx';
import { ProfileView } from './components/ProfileView.tsx';
import { AddItemModal } from './components/AddItemModal.tsx';
import { ClosetItem, Outfit, BodyProfile } from './types.ts';
import { MOCK_ITEMS } from './constants.ts';

const STORAGE_VERSION = 'v2';
const PREVIOUS_VERSION = 'v1';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'closet' | 'outfit' | 'profile'>('closet');
  const [isBuildingOutfit, setIsBuildingOutfit] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [focusedOutfitId, setFocusedOutfitId] = useState<string | null>(null);

  const getInitialDataWithMigration = <T,>(keyPrefix: string, defaultValue: T): T => {
    try {
      const currentKey = `${keyPrefix}_${STORAGE_VERSION}`;
      const previousKey = `${keyPrefix}_${PREVIOUS_VERSION}`;
      
      const savedCurrent = localStorage.getItem(currentKey);
      if (savedCurrent) {
        return JSON.parse(savedCurrent);
      }

      const savedPrevious = localStorage.getItem(previousKey);
      if (savedPrevious) {
        console.log(`自动迁移数据: ${previousKey} -> ${currentKey}`);
        return JSON.parse(savedPrevious);
      }
    } catch (e) {
      console.warn(`读取数据失败 (${keyPrefix})，已重置为默认值`, e);
    }
    return defaultValue;
  };

  const [closetItems, setClosetItems] = useState<ClosetItem[]>(() => 
    getInitialDataWithMigration('closet_items', MOCK_ITEMS)
  );

  const [outfits, setOutfits] = useState<Outfit[]>(() => 
    getInitialDataWithMigration('outfits', [])
  );

  const [bodyProfile, setBodyProfile] = useState<BodyProfile>(() => 
    getInitialDataWithMigration('body_profile', {
      height: '175',
      weight: '65',
      shoulder: '42',
      chest: '90',
      waist: '72',
      hips: '92'
    })
  );

  // 安全保存函数，防止 QuotaExceededError 崩溃
  const safeSave = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        alert('衣橱空间已满（浏览器限制），请尝试删除不需要的旧单品。');
      } else {
        console.error('保存数据时出错', e);
      }
    }
  };

  useEffect(() => {
    safeSave(`closet_items_${STORAGE_VERSION}`, closetItems);
  }, [closetItems]);

  useEffect(() => {
    safeSave(`outfits_${STORAGE_VERSION}`, outfits);
  }, [outfits]);

  useEffect(() => {
    safeSave(`body_profile_${STORAGE_VERSION}`, bodyProfile);
  }, [bodyProfile]);

  const handleAddItem = (item: ClosetItem) => {
    setClosetItems([item, ...closetItems]);
    setShowAddModal(false);
  };

  const handleUpdateItem = (updatedItem: ClosetItem) => {
    setClosetItems(closetItems.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const handleDeleteItem = (id: string) => {
    setClosetItems(closetItems.filter(item => item.id !== id));
  };

  const handleSaveOutfit = (outfit: Outfit) => {
    setOutfits([outfit, ...outfits]);
    setIsBuildingOutfit(false);
    setActiveTab('outfit');
  };

  const handleUpdateOutfit = (updatedOutfit: Outfit) => {
    setOutfits(outfits.map(o => o.id === updatedOutfit.id ? updatedOutfit : o));
  };

  const handleReorderOutfits = (newOrder: Outfit[]) => {
    setOutfits(newOrder);
  };

  const handleDeleteOutfit = (id: string) => {
    setOutfits(outfits.filter(o => o.id !== id));
  };

  const handleViewOutfit = (outfitId: string) => {
    setFocusedOutfitId(outfitId);
    setActiveTab('outfit');
  };

  const handleUpdateBodyProfile = (profile: BodyProfile) => {
    setBodyProfile(profile);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto bg-white relative overflow-hidden">
      <header className="safe-top bg-white/80 backdrop-blur-md z-50 border-b border-gray-50 flex-shrink-0">
        <div className="px-6 h-14 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {!isBuildingOutfit && (
              <div className="w-8 h-8 flex items-center justify-center bg-pink-50 rounded-full border border-pink-100 shadow-sm overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-6 h-6">
                  <rect x="25" y="20" width="50" height="65" rx="5" fill="#FFB6C1" opacity="0.3" />
                  <rect x="25" y="20" width="50" height="65" rx="5" stroke="#FF69B4" strokeWidth="2" fill="none" />
                  <line x1="50" y1="20" x2="50" y2="85" stroke="#FF69B4" strokeWidth="2" />
                  <circle cx="45" cy="52.5" r="2" fill="#FF69B4" />
                  <circle cx="55" cy="52.5" r="2" fill="#FF69B4" />
                  <path d="M35 15 L65 15" stroke="#FF69B4" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            )}
            <h1 className="text-sm tracking-[0.1em] text-black">
              {isBuildingOutfit ? '创作搭配' : 
               activeTab === 'closet' ? '我的衣橱' : 
               activeTab === 'outfit' ? '灵感穿搭' : '个人中心'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {activeTab === 'closet' && !isBuildingOutfit && (
              <button 
                onClick={() => setShowAddModal(true)}
                className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center active:scale-90 transition-transform shadow-lg shadow-black/10"
              >
                <span className="text-xl leading-none font-light">+</span>
              </button>
            )}
            {isBuildingOutfit && (
              <button 
                onClick={() => setIsBuildingOutfit(false)}
                className="text-xs text-gray-400"
              >
                取消
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        {isBuildingOutfit ? (
          <OutfitBuilder items={closetItems} onSave={handleSaveOutfit} />
        ) : (
          <div className="h-full overflow-hidden">
            {activeTab === 'closet' && (
              <ClosetView 
                items={closetItems} 
                outfits={outfits}
                onAddItem={() => setShowAddModal(true)} 
                onUpdateItem={handleUpdateItem}
                onDeleteItem={handleDeleteItem}
                onViewOutfit={handleViewOutfit}
              />
            )}
            {activeTab === 'outfit' && (
              <OutfitGallery 
                outfits={outfits} 
                items={closetItems}
                initialOutfitId={focusedOutfitId}
                onClearFocusedOutfit={() => setFocusedOutfitId(null)}
                onCreateNew={() => setIsBuildingOutfit(true)}
                onUpdateOutfit={handleUpdateOutfit}
                onReorderOutfits={handleReorderOutfits}
                onDeleteOutfit={handleDeleteOutfit}
              />
            )}
            {activeTab === 'profile' && (
              <ProfileView 
                items={closetItems} 
                outfits={outfits}
                bodyProfile={bodyProfile}
                onUpdateBodyProfile={handleUpdateBodyProfile}
              />
            )}
          </div>
        )}
      </main>

      {!isBuildingOutfit && (
        <nav className="bg-white/95 backdrop-blur-md border-t border-gray-50 flex-shrink-0 safe-bottom">
          <div className="flex justify-around items-center h-16">
            <button onClick={() => setActiveTab('closet')} className={`flex flex-col items-center justify-center w-full h-full transition-all ${activeTab === 'closet' ? 'text-black' : 'text-gray-300'}`}>
              <span className="text-2xl mb-1">{activeTab === 'closet' ? '🧥' : '📁'}</span>
            </button>
            <button onClick={() => setActiveTab('outfit')} className={`flex flex-col items-center justify-center w-full h-full transition-all ${activeTab === 'outfit' ? 'text-black' : 'text-gray-300'}`}>
              <span className="text-2xl mb-1">{activeTab === 'outfit' ? '✨' : '🎨'}</span>
            </button>
            <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center justify-center w-full h-full transition-all ${activeTab === 'profile' ? 'text-black' : 'text-gray-300'}`}>
              <span className="text-2xl mb-1">{activeTab === 'profile' ? '👤' : '🔘'}</span>
            </button>
          </div>
        </nav>
      )}

      {showAddModal && (
        <AddItemModal 
          onClose={() => setShowAddModal(false)} 
          onAdd={handleAddItem} 
        />
      )}
    </div>
  );
};

export default App;
