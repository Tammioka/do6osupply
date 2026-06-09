// src/components/purchases/PurchasesView.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PurchaseModal from './PurchaseModal';
import { playSound } from '../../utils/soundManager';

const COLUMNS = ['Ожидается', 'Доставлен', 'Отменен'];

export default function PurchasesView({ searchTerm }) {
  const [purchases, setPurchases] = useState([]);
  const [suppliersList, setSuppliersList] = useState([]); // ДОБАВЛЕНО: Список поставщиков для модалки
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  
  const [draggedId, setDraggedId] = useState(null);
  const [activeMobileColumn, setActiveMobileColumn] = useState('Ожидается');

  // --- БЭКЕНД ЛОГИКА (PHP) ---
  const loadData = async () => {
    try {
      // Загружаем закупки
      const resP = await fetch('http://localhost:8000/purchases.php');
      const dataP = await resP.json();
      if (Array.isArray(dataP)) setPurchases(dataP);

      // Загружаем поставщиков (нужно для прайс-листа в модалке)
      const resS = await fetch('http://localhost:8000/suppliers.php');
      const dataS = await resS.json();
      if (Array.isArray(dataS)) setSuppliersList(dataS);
    } catch (e) {
      console.error("Ошибка загрузки данных", e);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleOpenEdit = (purchase) => { setSelectedPurchase(purchase); setIsModalOpen(true); };
  const handleOpenCreate = () => { setSelectedPurchase(null); setIsModalOpen(true); };

  const handleSave = async (updatedPurchase) => {
    playSound('add');
    try {
      await fetch('http://localhost:8000/purchases.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', ...updatedPurchase })
      });
      loadData();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    playSound('delete');
    try {
      await fetch('http://localhost:8000/purchases.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id: id })
      });
      loadData();
    } catch (e) { console.error(e); }
  };

  const updatePurchaseStatus = async (id, newStatus) => {
    try {
      const res = await fetch('http://localhost:8000/purchases.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', id: id, status: newStatus })
      });
      if (res.ok) loadData();
    } catch (e) { console.error("Ошибка обновления статуса", e); }
  };

  // --- DRAG & DROP И МОБИЛЬНЫЕ КНОПКИ ---
  const handleDragStart = (e, id) => { 
    setDraggedId(id); 
    setTimeout(() => e.target.classList.add('opacity-50'), 0);
  };
  const handleDragEnd = (e) => { 
    e.target.classList.remove('opacity-50'); 
    setDraggedId(null); 
  };
  const handleDragOver = (e) => { e.preventDefault(); };
  
  const handleDrop = (e, status) => {
    e.preventDefault();
    if (draggedId) {
      if (status === 'Доставлен') playSound('add');
      else if (status === 'Отменен') playSound('alert');
      updatePurchaseStatus(draggedId, status);
      setDraggedId(null);
    }
  };

  const handleMobileMove = (e, id, newStatus) => {
    e.stopPropagation();
    if (newStatus === 'Доставлен') playSound('add');
    else if (newStatus === 'Отменен') playSound('alert');
    else playSound('click');
    updatePurchaseStatus(id, newStatus);
  };

  const filteredPurchases = purchases.filter(p => 
    p.item.toLowerCase().includes((searchTerm || '').toLowerCase()) || 
    p.supplier.toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    p.id.toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  // --- СТАРЫЙ КРУТОЙ ДИЗАЙН ЧЕКА ---
  const renderReceipt = (p) => (
    <div 
      key={p.id} draggable onDragStart={(e) => handleDragStart(e, p.id)} onDragEnd={handleDragEnd}
      className="bg-[#fefce8] text-black w-full p-4 flex flex-col font-mono text-xs cursor-grab active:cursor-grabbing relative border-t-4 border-b-4 border-dashed border-gray-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-shadow group mb-4"
    >
      {p.status === 'Доставлен' && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] border-4 border-green text-green font-pixel-bold text-xl p-1 opacity-60 pointer-events-none z-10 drop-shadow-[2px_2px_0_rgba(255,255,255,1)]">ПРИНЯТО</div>}
      {p.status === 'Отменен' && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[15deg] border-4 border-red text-red font-pixel-bold text-xl p-1 opacity-60 pointer-events-none z-10 drop-shadow-[2px_2px_0_rgba(255,255,255,1)]">ОТМЕНА</div>}

      <div className="flex justify-between items-start font-bold">
        <span className="font-pixel-bold text-[10px] text-purple">{p.id}</span>
        <span>{p.date}</span>
      </div>
      
      <div className="text-center font-bold text-[10px] mt-2 mb-1">{p.supplier}</div>
      <div className="border-b-2 border-dashed border-gray-400 w-full mb-2"></div>
      
      <div className="flex justify-between items-center mb-1">
        <span className="truncate pr-2">{p.item}</span>
        <span className="whitespace-nowrap">{p.quantity} шт</span>
      </div>
      <div className="flex justify-between text-[10px] text-gray-500 mb-2">
        <span>Цена за ед:</span>
        <span>{p.price} ₽</span>
      </div>

      <div className="border-b-2 border-dashed border-gray-400 w-full mb-2"></div>
      <div className="flex justify-between font-bold text-sm items-center">
        <span>ИТОГ:</span>
        <span className="font-pixel-bold text-[10px]">{(p.quantity * p.price).toLocaleString('ru-RU')} ₽</span>
      </div>

      {/* Штрихкод */}
      <div className="h-8 w-full mt-4 opacity-70" style={{ backgroundImage: 'repeating-linear-gradient(to right, #000, #000 2px, transparent 2px, transparent 4px, #000 4px, #000 5px, transparent 5px, transparent 8px, #000 8px, #000 12px, transparent 12px, transparent 14px)' }}></div>

      {/* Кнопки для мобилки */}
      <div className="flex md:hidden gap-1 mt-4 relative z-20">
        {COLUMNS.filter(col => col !== p.status).map(col => (
          <button key={col} onClick={(e) => handleMobileMove(e, p.id, col)} className="flex-1 bg-[#181124] text-white border-2 border-black text-[9px] py-2 font-pixel-bold shadow-[2px_2px_0_#000] active:translate-y-0.5 active:shadow-none uppercase cursor-pointer">
            В {col}
          </button>
        ))}
      </div>

      {/* Кнопка редактирования (ПК) */}
      <button onClick={() => handleOpenEdit(p)} className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-[8px] font-pixel-bold md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-purple cursor-pointer z-20">
        РЕД
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-3 md:gap-4 h-full">
      
      {/* ШАПКА */}
      <div className="flex w-full md:w-auto md:justify-end shrink-0">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenCreate}
          className="w-full md:w-auto bg-purple text-white text-[10px] font-pixel-bold py-3 px-6 border-2 border-black shadow-[inset_1px_1px_0_rgba(255,255,255,0.3),_2px_2px_0_#000] hover:bg-[#9333ea] transition-colors uppercase cursor-pointer"
        >
          + СОЗДАТЬ ЗАКАЗ
        </motion.button>
      </div>

      {/* МОБИЛЬНЫЕ ТАБЫ */}
      <div className="grid grid-cols-3 md:hidden gap-1 bg-[#0b0811] border-2 border-[#3a2e4d] shrink-0 p-1">
        {COLUMNS.map(col => {
          const count = filteredPurchases.filter(p => p.status === col).length;
          return (
            <button 
              key={col} onClick={() => { playSound('click'); setActiveMobileColumn(col); }}
              className={`flex flex-col items-center justify-center py-2 text-[7px] leading-tight font-pixel-bold uppercase border-2 transition-all ${activeMobileColumn === col ? 'bg-purple border-black text-white shadow-[inset_1px_1px_0_rgba(255,255,255,0.3),_1px_1px_0_#000]' : 'border-transparent text-[#8b859e]'}`}
            >
              <span className="truncate w-full text-center">{col}</span>
              <span className="mt-0.5 opacity-80">({count})</span>
            </button>
          );
        })}
      </div>

      {/* КАНБАН-ДОСКА С АНИМАЦИЯМИ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow overflow-hidden pb-[100px] md:pb-0">
        {COLUMNS.map(columnStatus => {
          const columnItems = filteredPurchases.filter(p => p.status === columnStatus);
          const isVisibleOnMobile = activeMobileColumn === columnStatus;
          
          return (
            <div 
              key={columnStatus} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, columnStatus)}
              className={`pixel-panel border-2 border-[#3a2e4d] bg-[#0b0811]/80 flex-col h-full overflow-hidden ${isVisibleOnMobile ? 'flex' : 'hidden md:flex'}`}
            >
              <div className="hidden md:flex bg-[#261d35] p-3 border-b-2 border-black justify-between items-center shrink-0">
                <h3 className="font-pixel-bold text-[10px] text-[#8b859e] uppercase">
                  {columnStatus === 'Ожидается' ? <span className="text-yellow animate-pulse">ОЖИДАЕТСЯ</span> : columnStatus === 'Доставлен' ? <span className="text-green">ДОСТАВЛЕН</span> : <span className="text-red">ОТМЕНЕН</span>}
                </h3>
                <span className="bg-black text-white px-1.5 py-0.5 text-[8px] font-pixel-bold rounded-sm border border-[#3a2e4d]">{columnItems.length}</span>
              </div>
              <div className="p-3 overflow-y-auto flex-grow h-[calc(100vh-250px)]">
                <AnimatePresence>
                  {columnItems.length > 0 ? (
                    columnItems.map(p => (
                      <motion.div key={p.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} layout>
                        {renderReceipt(p)}
                      </motion.div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center text-[#8b859e] font-pixel text-[10px] opacity-50 uppercase text-center">ПУСТО</div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {/* ДОБАВЛЕНО suppliersList={suppliersList} ЧТОБЫ РАБОТАЛ ВЫБОР ПРАЙСА */}
        {isModalOpen && <PurchaseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} purchase={selectedPurchase} onSave={handleSave} onDelete={handleDelete} suppliersList={suppliersList} />}
      </AnimatePresence>
    </div>
  );
}