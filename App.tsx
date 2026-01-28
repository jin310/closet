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
    <div className="flex flex-col h-full w-full bg-white relative overflow-hidden">
      {/* Header */}
      <header className="safe-top bg-white/80 backdrop-blur-md z-50 border-b border-gray-50 flex-shrink-0">
        <div className="max-w-screen-xl mx-auto px-6 h-14 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {!isBuildingOutfit && (
              <div className="w-8 h-8 flex items-center justify-center bg-pink-50 rounded-full border border-pink-100 shadow-sm overflow-hidden">
                <img src="https://r.jina.ai/i/67be9267104b46c8bc591a27e0be3895" className="w-full h-full object-cover" alt="Closet Icon" />
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
        <div className="h-full w-full max-w-screen-xl mx-auto">
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
        </div>
      </main>

      {/* Navigation */}
      {!isBuildingOutfit && (
        <nav className="bg-white/95 backdrop-blur-md border-t border-gray-50 flex-shrink-0 safe-bottom">
          <div className="max-w-screen-sm mx-auto flex justify-around items-center h-16">
            <button 
              onClick={() => setActiveTab('closet')}
              className={`flex flex-col items-center justify-center w-full h-full transition-all ${activeTab === 'closet' ? 'text-black' : 'text-gray-300'}`}
            >
              <span className="text-2xl mb-1">{activeTab === 'closet' ? '🧥' : '📁'}</span>
            </button>
            <button 
              onClick={() => setActiveTab('outfit')}
              className={`flex flex-col items-center justify-center w-full h-full transition-all ${activeTab === 'outfit' ? 'text-black' : 'text-gray-300'}`}
            >
              <span className="text-2xl mb-1">{activeTab === 'outfit' ? '✨' : '🎨'}</span>
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center justify-center w-full h-full transition-all ${activeTab === 'profile' ? 'text-black' : 'text-gray-300'}`}
            >
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