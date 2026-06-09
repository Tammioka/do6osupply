// src/components/purchases/PurchaseModal.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PurchaseModal({ isOpen, onClose, purchase, onSave, suppliersList = [] }) {
  const [formData, setFormData] = useState({
    id: '',
    supplier: '',
    item: '',
    category: '',
    quantity: 1,
    price: 0,
  });

  const [availableProducts, setAvailableProducts] = useState([]);
  const [maxStock, setMaxStock] = useState(9999);

  // Парсим каталоги поставщиков, если они пришли из базы как строки
  const parsedSuppliers = suppliersList.map(sup => ({
    ...sup,
    catalog: typeof sup.catalog === 'string' ? JSON.parse(sup.catalog || '[]') : (sup.catalog || [])
  }));

  useEffect(() => {
    if (purchase) {
      setFormData(purchase);
    } else {
      setFormData({ id: '', supplier: '', item: '', category: '', quantity: 1, price: 0 });
      setAvailableProducts([]);
    }
  }, [purchase]);

  // 1. Выбрали поставщика -> Загружаем его прайс-лист
  const handleSupplierChange = (e) => {
    const selectedSupplierName = e.target.value;
    const foundSupplier = parsedSuppliers.find(s => s.name === selectedSupplierName);
    
    const products = foundSupplier ? foundSupplier.catalog : [];
    setAvailableProducts(products);

    setFormData({
      ...formData,
      supplier: selectedSupplierName,
      item: '', // Сбрасываем товар
      category: '',
      price: 0,
      quantity: 1
    });
    setMaxStock(9999);
  };

  // 2. Выбрали товар -> Подтягиваем цену, категорию и лимит остатков
  const handleItemChange = (e) => {
    const selectedItemName = e.target.value;
    const foundProduct = availableProducts.find(p => p.name === selectedItemName);

    if (foundProduct) {
      setFormData({
        ...formData,
        item: selectedItemName,
        category: foundProduct.category, // Авто-категория
        price: Number(foundProduct.price), // Авто-цена
        quantity: 1
      });
      setMaxStock(Number(foundProduct.stock)); // Устанавливаем лимит
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.supplier || !formData.item) return alert("Выберите поставщика и товар!");
    if (formData.quantity > maxStock) return alert(`Ошибка! У поставщика в наличии только ${maxStock} ед.`);
    
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="pixel-panel bg-[#0b0811] border-2 border-purple p-6 w-full max-w-md shadow-[0_0_30px_rgba(168,85,247,0.3)]">
        <h2 className="text-white font-pixel-bold text-lg mb-6 uppercase border-b-2 border-[#3a2e4d] pb-2">
          {purchase ? 'РЕДАКТИРОВАТЬ ЗАКАЗ' : 'НОВЫЙ ЗАКАЗ'}
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-mono text-xs">
          
          {/* ВЫБОР ПОСТАВЩИКА */}
          <div className="flex flex-col gap-1">
            <label className="text-[#8b859e] uppercase text-[10px]">Поставщик</label>
            <select value={formData.supplier} onChange={handleSupplierChange} className="bg-[#181124] text-white border-2 border-[#3a2e4d] p-2 focus:outline-none focus:border-purple cursor-pointer">
              <option value="" disabled>-- ВЫБЕРИТЕ ПОСТАВЩИКА --</option>
              {parsedSuppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>

          {/* ВЫБОР ТОВАРА ИЗ ЕГО ПРАЙСА */}
          <div className="flex flex-col gap-1">
            <label className="text-[#8b859e] uppercase text-[10px]">Товар из прайс-листа</label>
            <select value={formData.item} onChange={handleItemChange} disabled={!formData.supplier || availableProducts.length === 0} className="bg-[#181124] text-white border-2 border-[#3a2e4d] p-2 focus:outline-none focus:border-purple cursor-pointer disabled:opacity-50">
              <option value="" disabled>-- ВЫБЕРИТЕ ТОВАР --</option>
              {availableProducts.map((p, idx) => (
                <option key={idx} value={p.name}>{p.name} (В наличии: {p.stock})</option>
              ))}
            </select>
            {formData.supplier && availableProducts.length === 0 && (
              <span className="text-red text-[8px] uppercase">У этого поставщика пустой прайс-лист!</span>
            )}
          </div>

          {/* АВТО-ПОЛЯ */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[#8b859e] uppercase text-[10px]">Категория</label>
              <input type="text" value={formData.category} readOnly className="bg-[#0b0811] text-gray-500 border-2 border-[#3a2e4d] p-2 font-pixel text-[8px] uppercase cursor-not-allowed" />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[#8b859e] uppercase text-[10px]">Цена за ед. (₽)</label>
              <input type="number" value={formData.price} readOnly className="bg-[#0b0811] text-green border-2 border-[#3a2e4d] p-2 font-bold cursor-not-allowed" />
            </div>
          </div>

          {/* КОЛИЧЕСТВО С ПРОВЕРКОЙ ОСТАТКОВ */}
          {/* КОЛИЧЕСТВО С ПРОВЕРКОЙ ОСТАТКОВ */}
          <div className="flex flex-col gap-1">
            <label className="text-[#8b859e] uppercase text-[10px]">Количество заказа</label>
            <input 
              type="number" 
              min="1" 
              max={maxStock} 
              value={formData.quantity} 
              onChange={(e) => {
                const val = e.target.value;
                // Если поле пустое, ставим 1, иначе парсим число без лишних нулей в начале
                setFormData({...formData, quantity: val === '' ? '' : Math.max(1, parseInt(val))});
              }} 
              className="bg-[#181124] text-white border-2 border-[#3a2e4d] p-2 focus:outline-none focus:border-purple" 
              required 
            />
            <span className="text-[9px] text-[#8b859e]">Доступно у поставщика: {maxStock}</span>
          </div>

          <div className="flex gap-2 mt-2 pt-2 border-t-2 border-[#3a2e4d]">
            <button type="button" onClick={onClose} className="flex-1 bg-transparent text-white border-2 border-[#3a2e4d] py-2 font-pixel-bold text-[10px] hover:bg-[#261d35] uppercase">ОТМЕНА</button>
            <button type="submit" className="flex-1 bg-green text-black border-2 border-black py-2 font-pixel-bold text-[10px] hover:bg-[#22c55e] uppercase shadow-[2px_2px_0_#000]">СОХРАНИТЬ</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}