// src/components/layout/Sidebar.jsx
import { motion } from 'framer-motion';
import { playSound } from '../../utils/soundManager';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', name: 'Дашборд', icon: '/assets/кирка.png' },
    { id: 'suppliers', name: 'Поставщики', icon: '/assets/steave.jpg', rounded: true },
    { id: 'purchases', name: 'Закупки', icon: '/assets/мешок.png' },
    { id: 'warehouse', name: 'Склад', icon: '/assets/сундук.png' },
    { id: 'reports', name: 'Отчеты', icon: '/assets/свиток.png' },
    { id: 'settings', name: 'Настройки', icon: '/assets/шестиренка.png' }
  ];

  const handleTabClick = (id) => {
    playSound('click');
    setActiveTab(id);
  };

  return (
    <aside className="sidebar pixel-panel flex flex-col gap-4 p-4 h-full overflow-y-auto hide-scrollbar justify-between">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-2 cursor-pointer border-b border-[#3a2e4d]">
          <img src="/assets/logo.png" className="w-12 h-12" alt="Dodo Logo" />
          <h1 className="font-pixel-bold text-[10px] text-[#ff6900] leading-snug drop-shadow-[2px_2px_0_#000]">DODO<br/>PIZZA</h1>
        </div>

        <nav className="flex flex-col gap-1 grow">
          {menuItems.map((item) => (
            <motion.div 
              key={item.id} whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}
              onClick={() => handleTabClick(item.id)}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            >
              <img src={item.icon} className={`w-6 h-6 object-cover ${item.rounded ? 'rounded-full border border-black' : ''}`} style={{ imageRendering: 'pixelated' }} alt={item.name} />
              <span className="text-sm">{item.name}</span>
            </motion.div>
          ))}
        </nav>
      </div>

      {/* Пустое пространство под кассетный плеер */}
      <div className="h-[170px] shrink-0 w-full"></div>
    </aside>
  );
}
