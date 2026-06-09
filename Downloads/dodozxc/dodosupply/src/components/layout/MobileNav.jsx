// src/components/layout/MobileNav.jsx
import { playSound } from '../../utils/soundManager';

export default function MobileNav({ activeTab, setActiveTab, toggleMusicMenu }) {
  const menuItems = [
    { id: 'dashboard', icon: '/assets/кирка.png' },
    { id: 'suppliers', icon: '/assets/steave.jpg', rounded: true },
    { id: 'purchases', icon: '/assets/мешок.png' },
    { id: 'warehouse', icon: '/assets/сундук.png' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0b0811]/95 backdrop-blur-md border-t-2 border-purple z-[100] flex justify-around items-center p-2 pb-4 shadow-[0_-5px_20px_rgba(168,85,247,0.2)]">
      <div className="absolute inset-0 scanlines opacity-20 pointer-events-none"></div>
      
      {menuItems.map(item => (
        <button
          key={item.id}
          onClick={() => { playSound('click'); setActiveTab(item.id); }}
          className={`relative p-2 transition-transform active:scale-90 flex flex-col items-center gap-1 ${activeTab === item.id ? 'opacity-100 translate-y-[-4px]' : 'opacity-40 filter grayscale'}`}
        >
          <img src={item.icon} className={`w-7 h-7 object-cover ${item.rounded ? 'rounded-full border border-black' : ''}`} style={{ imageRendering: 'pixelated' }} alt={item.id} />
          {activeTab === item.id && <div className="absolute -bottom-1 w-1.5 h-1.5 bg-purple rounded-full shadow-[0_0_5px_#a855f7]"></div>}
        </button>
      ))}

      {/* КНОПКА МУЗЫКИ (Открывает полноэкранную кассету на телефоне) */}
      <button
        onClick={() => { playSound('click'); toggleMusicMenu(); }}
        className="relative p-2 transition-transform active:scale-90 flex flex-col items-center gap-1 opacity-100"
      >
        <div className="w-7 h-7 bg-purple border-2 border-black shadow-[2px_2px_0_#000] flex items-center justify-center text-white text-xs">
          🎵
        </div>
      </button>

    </div>
  );
}
