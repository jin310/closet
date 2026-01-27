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
            {/* Small Animated Logo */}
            {!isBuildingOutfit && (
              <div className="w-6 h-6 animate-[sway_3s_infinite_ease-in-out] origin-top">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C10.8954 2 10 2.89543 10 4C10 5.10457 10.8954 6 12 6C13.1046 6 14 5.10457 14 4H16C16 6.20914 14.2091 8 12 8C11.5 8 11.02 7.91 10.58 7.74L4.34 11.49C3.51 11.99 3 12.87 3 13.84V17C3 18.1 3.9 19 5 19H19C20.1 19 21 18.1 21 17V13.84C21 12.87 20.49 11.99 19.66 11.49L13.42 7.74C12.98 7.91 12.5 8 12 8C9.79086 8 8 6.20914 8 4C8 1.79086 9.79086 0 12 0C14.2091 0 16 1.79086 16 4H14C14 2.89543 13.1046 2 12 2Z" fill="currentColor"/>
                </svg>
              </div>
            )}
            <h1 className="text-sm font-black tracking-[0.2em] text-black uppercase">
              {isBuildingOutfit ? 'Create' : 
               activeTab === 'closet' ? 'Closet' : 
               activeTab === 'outfit' ? 'Idea' : 'Me'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {activeTab === 'closet' && !isBuildingOutfit && (
              <button 
                onClick={() => setShowAddModal(true)}
                className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center active:scale-90 transition-transform shadow-lg shadow-black/10"
              >
                <span className="text-xl font-light leading-none">+</span>
              </button>
            )}
            {isBuildingOutfit && (
              <button 
                onClick={() => setIsBuildingOutfit(false)}
                className="text-[10px] font-black uppercase tracking-widest text-gray-400"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
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

      {/* Simplified Minimalist Bottom Navigation Bar */}
      {!isBuildingOutfit && (
        <nav className="safe-bottom bg-white/95 backdrop-blur-xl border-t border-gray-50 flex justify-around items-center h-[calc(4.5rem+env(safe-area-inset-bottom))] w-full z-50">
          <button 
            onClick={() => setActiveTab('closet')}
            className={`flex flex-col items-center justify-center w-1/3 h-full transition-all ${activeTab === 'closet' ? 'text-black scale-110' : 'text-gray-300'}`}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {activeTab === 'closet' ? (
                <path d="M12 2L4 5V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V5L12 2Z" fill="currentColor"/>
              ) : (
                <path d="M12 3L5 5.625V19C5 19.5523 5.44772 20 6 20H18C18.5523 20 19 19.5523 19 19V5.625L12 3ZM12 5.125L17 7V18H7V7L12 5.125Z" fill="currentColor"/>
              )}
            </svg>
          </button>
          <button 
            onClick={() => setActiveTab('outfit')}
            className={`flex flex-col items-center justify-center w-1/3 h-full transition-all ${activeTab === 'outfit' ? 'text-black scale-110' : 'text-gray-300'}`}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {activeTab === 'outfit' ? (
                <path d="M12 3L14.5 9.5L21 12L14.5 14.5L12 21L9.5 14.5L3 12L9.5 9.5L12 3Z" fill="currentColor"/>
              ) : (
                <path d="M12 4.5L13.7 8.8L18.5 10.5L14.7 12.3L12 17.5L9.3 12.3L5.5 10.5L10.3 8.8L12 4.5ZM12 2L8.5 8.5L2 12L8.5 15.5L12 22L15.5 15.5L22 12L15.5 8.5L12 2Z" fill="currentColor"/>
              )}
            </svg>
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center w-1/3 h-full transition-all ${activeTab === 'profile' ? 'text-black scale-110' : 'text-gray-300'}`}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {activeTab === 'profile' ? (
                <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12ZM12 14C9.33333 14 4 15.3333 4 18V20H20V18C20 15.3333 14.6667 14 12 14Z" fill="currentColor"/>
              ) : (
                <path d="M12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11ZM12 13C9.66667 13 5 14.1667 5 16.5V19H19V16.5C19 14.1667 14.3333 13 12 13ZM7 17C7.6 15.9 10.1 15 12 15C13.9 15 16.4 15.9 17 17H7Z" fill="currentColor"/>
              )}
            </svg>
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