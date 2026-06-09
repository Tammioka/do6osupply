// src/components/warehouse/WarehouseModal.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { playSound } from '../../utils/soundManager';

export default function WarehouseModal({ isOpen, onClose, item, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Сырье',
    quantity: 0,
    maxCapacity: 100,
    criticalLimit: 10,
    unit: 'кг',
  });

  useEffect(() => {
    if (item) setFormData({ ...item });
    else setFormData({ name: '', category: 'Сырье', quantity: 0, maxCapacity: 100, criticalLimit: 10, unit: 'кг' });
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const entry = {
      ...formData,
      id: item ? item.id : `WH-${Math.floor(Math.random() * 10000)}`,
      quantity: Number(formData.quantity),
      maxCapacity: Number(formData.maxCapacity),
      criticalLimit: Number(formData.criticalLimit)
    };
    if (!item) playSound('add');
    onSave(entry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="pixel-panel w-full max-w-md bg-panel border-2 border-[#3a2e4d] relative z-10 overflow-hidden text-sm"
      >
        <div className="absolute inset-0 scanlines opacity-20 pointer-events-none z-50"></div>

        <div className="bg-gradient-to-r from-[#261d35] to-panel p-3 flex justify-between items-center border-b-2 border-black">
          <h2 className="font-pixel-bold text-xs text-orange-400 uppercase tracking-wide">
            {item ? `ИНВЕНТАРИЗАЦИЯ: ${item.id}` : 'НОВАЯ ПОЗИЦИЯ СКЛАДА'}
          </h2>
          <button onClick={onClose} className="text-[#8b859e] hover:text-white font-pixel-bold text-xs cursor-pointer transition-colors relative z-20">[X]</button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3 font-mono text-xs">
          
          <div className="flex flex-col gap-1">
            <label className="text-[#8b859e] uppercase text-[10px]">Наименование</label>
            <input type="text" required name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#0b0811] text-white border-2 border-[#3a2e4d] p-2 focus:outline-none focus:border-purple font-pixel text-xs" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[#8b859e] uppercase text-[10px]">Категория</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-[#0b0811] text-white border-2 border-[#3a2e4d] p-2 focus:outline-none focus:border-purple font-pixel text-xs">
                <option>Сырье</option>
                <option>Упаковка</option>
                <option>Напитки</option>
                <option>Хозтовары</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[#8b859e] uppercase text-[10px]">Ед. измерения</label>
              <select name="unit" value={formData.unit} onChange={handleChange} className="w-full bg-[#0b0811] text-white border-2 border-[#3a2e4d] p-2 focus:outline-none focus:border-purple font-pixel text-xs">
                <option>кг</option>
                <option>шт</option>
                <option>литр</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-[#0b0811] p-3 border border-[#3a2e4d] mt-2">
            <div className="flex flex-col gap-1">
              <label className="text-white font-bold uppercase text-[10px]">Текущий<br/>остаток</label>
              <input type="number" min="0" required name="quantity" value={formData.quantity} onChange={handleChange} className="w-full bg-panel text-green font-pixel-bold border-2 border-black p-2 focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[#8b859e] uppercase text-[10px]">Максимальная<br/>вместимость</label>
              <input type="number" min="1" required name="maxCapacity" value={formData.maxCapacity} onChange={handleChange} className="w-full bg-panel text-white border-2 border-black p-2 focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-red uppercase text-[10px]">Критический<br/>лимит</label>
              <input type="number" min="0" required name="criticalLimit" value={formData.criticalLimit} onChange={handleChange} className="w-full bg-panel text-red font-bold border-2 border-black p-2 focus:outline-none" />
            </div>
          </div>

          <div className="flex gap-2 border-t border-[#3a2e4d] pt-3 mt-2 relative z-20">
            <button type="submit" className="flex-1 bg-green text-[#0b0811] text-[9px] font-pixel-bold py-2.5 border-2 border-black shadow-[2px_2px_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer">
              СОХРАНИТЬ
            </button>
            {item && (
              <button type="button" onClick={() => { playSound('delete'); onDelete(item.id); onClose(); }} className="px-4 bg-red/20 text-red border-2 border-red/40 hover:bg-red hover:text-white text-[9px] font-pixel-bold py-2.5 transition-colors cursor-pointer">
                УДАЛИТЬ
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}