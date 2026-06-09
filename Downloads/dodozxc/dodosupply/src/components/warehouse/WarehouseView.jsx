// src/components/warehouse/WarehouseView.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WarehouseModal from './WarehouseModal';
import { playSound } from '../../utils/soundManager';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function WarehouseView({ searchTerm }) {
  const [inventory, setInventory] = useState([]);
  const [activeTab, setActiveTab] = useState('Все');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const categories = ['Все', 'Сырье', 'Упаковка', 'Напитки', 'Хозтовары'];

  // --- БЭКЕНД ЛОГИКА ---
  const loadInventory = async () => {
    try {
      const res = await fetch('http://localhost:8000/inventory.php');
      const data = await res.json();
      if (Array.isArray(data)) setInventory(data);
    } catch (e) { console.error("Ошибка склада", e); }
  };

  useEffect(() => { loadInventory(); }, []);

  const handleOpenEdit = (item) => { setSelectedItem(item); setIsModalOpen(true); };
  const handleOpenCreate = () => { setSelectedItem(null); setIsModalOpen(true); };
  
  const handleSave = async (updatedItem) => {
    playSound('add');
    try {
      await fetch('http://localhost:8000/inventory.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', ...updatedItem })
      });
      loadInventory(); // Обновляем склад
    } catch (e) { console.error("Ошибка сохранения", e); }
  };

  const handleDelete = async (id) => {
    playSound('delete');
    try {
      await fetch('http://localhost:8000/inventory.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      });
      loadInventory();
    } catch (e) { console.error("Ошибка удаления", e); }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes((searchTerm || '').toLowerCase()) || item.id.toLowerCase().includes((searchTerm || '').toLowerCase());
    const matchesTab = activeTab === 'Все' || item.category === activeTab;
    return matchesSearch && matchesTab;
  });

  // --- КОМПОНЕНТ HEALTH BAR (Шкала остатков) ---
  const renderHealthBar = (quantity, max, critical) => {
    const percent = (quantity / max) * 100;
    const isCritical = quantity <= critical;
    const segments = 10;
    const filledSegments = Math.ceil((percent / 100) * segments);

    return (
      <div className="flex gap-0.5 h-4 mt-2 w-full bg-[#0b0811] p-0.5 border border-[#3a2e4d]">
        {[...Array(segments)].map((_, i) => {
          let bgColor = 'bg-transparent';
          if (i < filledSegments) {
            if (isCritical) bgColor = 'bg-red animate-pulse shadow-[0_0_5px_#ef4444]';
            else if (percent < 40) bgColor = 'bg-yellow shadow-[0_0_5px_#eab308]';
            else bgColor = 'bg-green shadow-[0_0_5px_#4ade80]';
          }
          return <div key={i} className={`flex-1 h-full ${bgColor} border-r border-[#0b0811]/50`}></div>;
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex justify-between items-end shrink-0">
        <div className="flex gap-1 overflow-x-auto pb-1 hide-scrollbar">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveTab(cat)} className={`px-4 py-2 font-pixel-bold text-[9px] uppercase border-2 transition-all ${activeTab === cat ? 'bg-purple border-black text-white shadow-[inset_2px_2px_0_rgba(255,255,255,0.3),_2px_2px_0_#000] translate-y-[-2px]' : 'bg-panel border-[#3a2e4d] text-[#8b859e] hover:bg-[#261d35] border-b-black'}`}>
              {cat}
            </button>
          ))}
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={handleOpenCreate} className="bg-green text-[#0b0811] text-[10px] font-pixel-bold py-2.5 px-4 border-2 border-black shadow-[inset_1px_1px_0_rgba(255,255,255,0.5),_2px_2px_0_#000] hover:bg-[#22c55e] transition-colors uppercase whitespace-nowrap ml-4">
          + ПРИХОД НА СКЛАД
        </motion.button>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 pr-2 pb-[100px] md:pb-10">
        {filteredInventory.length > 0 ? (
          filteredInventory.map(item => {
            const isCritical = item.quantity <= item.criticalLimit;
            return (
              <motion.div key={item.id} variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } }} onClick={() => handleOpenEdit(item)} className={`pixel-panel p-3 border-2 cursor-pointer transition-all hover:translate-y-[-2px] group relative overflow-hidden ${isCritical ? 'border-red/50 hover:border-red shadow-[inset_0_0_10px_rgba(239,68,68,0.1)]' : 'border-[#3a2e4d] hover:border-purple'}`}>
                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10 group-hover:animate-scan"></div>
                <div className="flex justify-between items-start mb-1">
                  <span className="font-pixel-bold text-[9px] text-[#8b859e]">{item.id}</span>
                  {isCritical && <span className="bg-red text-white px-1.5 py-0.5 text-[8px] font-pixel-bold uppercase animate-blink border border-black">ТРЕВОГА</span>}
                </div>
                <h3 className="font-bold text-sm text-white truncate mb-1">{item.name}</h3>
                <div className="flex justify-between items-end font-mono text-xs mt-3">
                  <span className="text-[#8b859e] uppercase">В НАЛИЧИИ:</span>
                  <span className={`font-pixel-bold text-lg ${isCritical ? 'text-red' : item.quantity < item.maxCapacity * 0.4 ? 'text-yellow' : 'text-green'}`}>
                    {item.quantity} <span className="text-[10px] text-[#8b859e]">{item.unit}</span>
                  </span>
                </div>
                {renderHealthBar(item.quantity, item.maxCapacity, item.criticalLimit)}
                <div className="flex justify-between text-[8px] text-[#8b859e] font-pixel uppercase mt-1">
                  <span>КРИТ: {item.criticalLimit}</span>
                  <span>МАКС: {item.maxCapacity}</span>
                </div>
              </motion.div>
            )
          })
        ) : (
          <div className="col-span-full py-20 text-center text-[#8b859e] font-pixel">ЯЧЕЙКИ НЕ НАЙДЕНЫ</div>
        )}
      </motion.div>

      <AnimatePresence>
        {isModalOpen && <WarehouseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} item={selectedItem} onSave={handleSave} onDelete={handleDelete} />}
      </AnimatePresence>
    </div>
  );
}