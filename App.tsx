import React, { useState } from 'react';
import { ClosetView } from './components/ClosetView.tsx';
import { OutfitBuilder } from './components/OutfitBuilder.tsx';
import { OutfitGallery } from './components/OutfitGallery.tsx';
import { ProfileView } from './components/ProfileView.tsx';
import { AddItemModal } from './components/AddItemModal.tsx';
import { ClosetItem, Outfit, BodyProfile } from './types.ts';
import { MOCK_ITEMS } from './constants.ts';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'closet' | 'outfit' | 'profile'>('closet');
  const [isBuildingOutfit, setIsBuildingOutfit] = useState(false);
  const [closetItems, setClosetItems] = useState<ClosetItem[]>(MOCK_ITEMS);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [focusedOutfitId, setFocusedOutfitId] = useState<string | null>(null);
  const [bodyProfile, setBodyProfile] = useState<BodyProfile>({
    height: '175',
    weight: '65',
    shoulder: '42',
    chest: '90',
    waist: '72',
    hips: '92'
  });

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
      {/* Header */}
      <header className="safe-top bg-white/80 backdrop-blur-md z-50 border-b border-gray-50">
        <div className="px-6 h-14 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {!isBuildingOutfit && (
              <div className="w-8 h-8 flex items-center justify-center bg-pink-50 rounded-full border border-pink-100 shadow-sm overflow-hidden">
                {/* 替换为稳定的粉色衣橱 SVG */}
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
        <nav className="safe-bottom bg-white/95 backdrop-blur-xl border-t border-gray-50 flex justify-around items-center h-[calc(4.5rem+env(safe-area-inset-bottom))] w-full z-50">
          <button onClick={() => setActiveTab('closet')} className={`flex flex-col items-center justify-center w-1/3 h-full transition-all ${activeTab === 'closet' ? 'text-black' : 'text-gray-300'}`}>
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d={activeTab === 'closet' ? "M12 2L4 5V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V5L12 2Z" : "M12 3L5 5.625V19C5 19.5523 5.44772 20 6 20H18C18.5523 20 19 19.5523 19 19V5.625L12 3ZM12 5.125L17 7V18H7V7L12 5.125Z"} fill="currentColor"/>
            </svg>
          </button>
          <button onClick={() => setActiveTab('outfit')} className={`flex flex-col items-center justify-center w-1/3 h-full transition-all ${activeTab === 'outfit' ? 'text-black' : 'text-gray-300'}`}>
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d={activeTab === 'outfit' ? "M12 3L14.5 9.5L21 12L14.5 14.5L12 21L9.5 14.5L3 12L9.5 9.5L12 3Z" : "M12 4.5L13.7 8.8L18.5 10.5L14.7 12.3L12 17.5L9.3 12.3L5.5 10.5L10.3 8.8L12 4.5ZM12 2L8.5 8.5L2 12L8.5 15.5L12 22L15.5 15.5L22 12L15.5 8.5L12 2Z"} fill="currentColor"/>
            </svg>
          </button>
          <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center justify-center w-1/3 h-full transition-all ${activeTab === 'profile' ? 'text-black' : 'text-gray-300'}`}>
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d={activeTab === 'profile' ? "M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12ZM12 14C9.33333 14 4 15.3333 4 18V20H20V18C20 15.3333 14.6667 14 12 14Z" : "M12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11ZM12 13C9.66667 13 5 14.1667 5 16.5V19H19V16.5C19 14.1667 14.3333 13 12 13ZM7 17C7.6 15.9 10.1 15 12 15C13.9 15 16.4 15.9 17 17H7Z"} fill="currentColor"/>
            </svg>
          </button>
        </nav>
      )}

      {showAddModal && <AddItemModal onClose={() => setShowAddModal(false)} onAdd={handleAddItem} />}
    </div>
  );
};

export default App;