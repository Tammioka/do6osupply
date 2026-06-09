// src/components/suppliers/SuppliersView.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react'; // Официальный хук GSAP для React

import SupplierModal from './SupplierModal';
import SupplierCard from './SupplierCard';
import { playSound } from '../../utils/soundManager';

// Регистрируем плагин (обязательно для Next/Vite)
gsap.registerPlugin(useGSAP);

export default function SuppliersView({ searchTerm }) {
  const [suppliers, setSuppliers] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const containerRef = useRef(null); // Реф для анимаций GSAP

  const loadSuppliers = async () => {
    try {
      const res = await fetch('http://localhost:8000/suppliers.php');
      const data = await res.json();
      if (Array.isArray(data)) setSuppliers(data);
    } catch (e) { console.error("Ошибка загрузки:", e); }
  };

  useEffect(() => { loadSuppliers(); }, []);

  // --- МАГИЯ GSAP: Анимация появления карточек ---
  useGSAP(() => {
    // Анимируем элементы с классом .gsap-card только когда массив suppliers не пустой
    if (suppliers.length > 0) {
      gsap.from('.gsap-card', {
        y: 100, // Выезжают снизу на 100px
        opacity: 0,
        stagger: 0.1, // Задержка между появлением каждой карточки (эффект волны)
        duration: 0.8,
        ease: "power3.out", // Крутая кривая плавности (быстро стартует, плавно тормозит)
        clearProps: "all" // Очищаем стили после анимации, чтобы не ломать hover-эффекты
      });
    }
  }, { dependencies: [suppliers], scope: containerRef }); // scope ограничивает область поиска классов

  const handleSave = async (updatedSupplier) => {
    playSound('add');
    const formData = new FormData();
    formData.append('id', updatedSupplier.id || '');
    formData.append('name', updatedSupplier.name);
    formData.append('category', updatedSupplier.category || 'Разное');
    formData.append('rating', updatedSupplier.rating || 0);
    formData.append('phone', updatedSupplier.phone || '');
    formData.append('email', updatedSupplier.email || '');
    formData.append('status', updatedSupplier.status || 'Активен');
    formData.append('catalog', updatedSupplier.catalog || '[]'); 
    formData.append('action', 'save');
    if (updatedSupplier.imageFile) formData.append('image', updatedSupplier.imageFile);

    try {
      const res = await fetch('http://localhost:8000/suppliers.php', { method: 'POST', body: formData });
      if (res.ok) loadSuppliers();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!confirm('ТОЧНО УДАЛИТЬ КОНТРАГЕНТА?')) return;
    playSound('delete');
    try {
      const res = await fetch('http://localhost:8000/suppliers.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ action: 'delete', id: id })
      });
      if (res.ok) loadSuppliers();
    } catch (e) { console.error(e); }
  };

  const filteredSuppliers = suppliers.filter(s => 
    (s.name && s.name.toLowerCase().includes((searchTerm || '').toLowerCase())) ||
    (s.category && s.category.toLowerCase().includes((searchTerm || '').toLowerCase()))
  );

  return (
    <>
      <div className="flex flex-col gap-4 pb-[100px]" ref={containerRef}>
      
      {/* ШАПКА */}
      <div className="flex justify-between items-center shrink-0 sticky top-0 z-40 bg-[#0b0811]/90 backdrop-blur-md pb-2 pt-1">
        <div className="text-white font-pixel-bold bg-panel p-2 border-2 border-[#3a2e4d]">
          БАЗА КОНТРАГЕНТОВ: <span className="text-orange-400">{filteredSuppliers.length}</span>
        </div>
        <motion.button 
          whileTap={{ scale: 0.95 }} 
          onClick={() => { playSound('click'); setIsCreateModalOpen(true); }}
          className="bg-green text-[#0b0811] text-[10px] md:text-xs font-pixel-bold py-3 px-6 border-2 border-black shadow-[inset_1px_1px_0_rgba(255,255,255,0.5),_2px_2px_0_#000] hover:bg-[#22c55e] transition-colors uppercase cursor-pointer"
        >
          + ДОБАВИТЬ
        </motion.button>
      </div>

      {/* СЕТКА С КАРТОЧКАМИ (Убрали overflow-y-auto отсюда, теперь скроллится вся страница!) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredSuppliers.map(supplier => (
            <div 
              key={supplier.id} 
              className="gsap-card h-full" // Добавили класс для GSAP
            >
              <SupplierCard supplier={supplier} onSave={handleSave} onDelete={handleDelete} />
            </div>
          ))}
        </AnimatePresence>
      </div>

    </div>

    <SupplierModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} supplier={null} onSave={handleSave} />
    </>
  );
}