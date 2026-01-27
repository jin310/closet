
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
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-none relative overflow-hidden">
      {/* Header */}
      <header className="safe-top bg-white border-b border-gray-100 z-50">
        <div className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-black tracking-tighter text-black">
            {isBuildingOutfit ? '新建搭配' : 
             activeTab === 'closet' ? '我的衣橱' : 
             activeTab === 'outfit' ? '搭配集' : '个人中心'}
          </h1>
          <div className="flex gap-4">
            {activeTab === 'closet' && !isBuildingOutfit && (
              <button 
                onClick={() => setShowAddModal(true)}
                className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-lg shadow-gray-200 active:scale-90 transition-transform"
              >
                <span className="text-2xl leading-none">+</span>
              </button>
            )}
            {isBuildingOutfit && (
              <button 
                onClick={() => setIsBuildingOutfit(false)}
                className="text-xs font-bold text-gray-400"
              >
                取消
              </button>
            )}
            <span className="text-xl">{activeTab === 'profile' ? '👤' : '🧥'}</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative bg-white">
        {isBuildingOutfit ? (
          <OutfitBuilder items={closetItems} onSave={handleSaveOutfit} />
        ) : (
          <>
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
                bodyProfile={bodyProfile} 
                onUpdateBodyProfile={handleUpdateBodyProfile}
              />
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      {!isBuildingOutfit && (
        <nav className="safe-bottom bg-white border-t border-gray-100 flex justify-around items-center h-20 w-full max-w-md z-50">
          <button 
            onClick={() => setActiveTab('closet')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'closet' ? 'text-black scale-110' : 'text-gray-200'}`}
          >
            <span className="text-2xl">👚</span>
            <span className={`text-[10px] font-black uppercase tracking-tighter ${activeTab === 'closet' ? 'text-black' : 'text-gray-300'}`}>衣橱</span>
          </button>
          <button 
            onClick={() => setActiveTab('outfit')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'outfit' ? 'text-black scale-110' : 'text-gray-200'}`}
          >
            <span className="text-2xl">✨</span>
            <span className={`text-[10px] font-black uppercase tracking-tighter ${activeTab === 'outfit' ? 'text-black' : 'text-gray-300'}`}>搭配</span>
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'profile' ? 'text-black scale-110' : 'text-gray-200'}`}
          >
            <span className="text-2xl">👤</span>
            <span className={`text-[10px] font-black uppercase tracking-tighter ${activeTab === 'profile' ? 'text-black' : 'text-gray-300'}`}>我的</span>
          </button>
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
