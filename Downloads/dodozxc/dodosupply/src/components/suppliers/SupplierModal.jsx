// src/components/suppliers/SupplierModal.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SupplierModal({ isOpen, onClose, supplier, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    id: '', name: '', category: '', rating: 0, phone: '', email: '', status: 'Активен'
  });
  
  const [catalog, setCatalog] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  
  // РЕЖИМ ПРОСМОТРА (если открыли существующего поставщика - инфа скрыта за кнопкой "Редактировать")
  const [isEditingInfo, setIsEditingInfo] = useState(false);

  useEffect(() => {
    if (supplier) {
      setFormData(supplier);
      try {
        setCatalog(typeof supplier.catalog === 'string' ? JSON.parse(supplier.catalog) : (supplier.catalog || []));
      } catch (e) { setCatalog([]); }
      setIsEditingInfo(false); // Открываем в режиме просмотра
    } else {
      setFormData({ id: '', name: '', category: '', rating: 0, phone: '', email: '', status: 'Активен' });
      setCatalog([]);
      setIsEditingInfo(true); // Для нового поставщика сразу открываем редактирование
    }
    setImageFile(null);
  }, [supplier]);

  const handleAddProduct = () => {
    setCatalog([...catalog, { name: '', category: 'Сырье', price: '', stock: '' }]);
  };

  const handleProductChange = (index, field, value) => {
    const newCatalog = [...catalog];
    newCatalog[index][field] = value;
    setCatalog(newCatalog);
  };

  const handleRemoveProduct = (index) => {
    setCatalog(catalog.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return alert("Введите имя поставщика!");
    const hasEmptyProducts = catalog.some(p => !p.name.trim());
    if (hasEmptyProducts) return alert("Заполните названия всех товаров в прайс-листе!");

    // Конвертируем строки обратно в числа при сохранении
    const cleanCatalog = catalog.map(p => ({
      ...p,
      price: Number(p.price) || 0,
      stock: Number(p.stock) || 0
    }));

    onSave({
      ...formData,
      catalog: JSON.stringify(cleanCatalog),
      imageFile: imageFile
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-2 md:p-4 z-50 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="pixel-panel bg-[#0b0811] border-2 border-purple p-4 md:p-6 w-full max-w-2xl shadow-[0_0_30px_rgba(168,85,247,0.3)] max-h-[90vh] flex flex-col">
        
        <div className="flex justify-between items-center mb-4 border-b-2 border-[#3a2e4d] pb-2 shrink-0">
          <h2 className="text-white font-pixel-bold text-base md:text-lg uppercase">
            {supplier && !isEditingInfo ? 'ДОСЬЕ КОНТРАГЕНТА' : supplier ? 'РЕДАКТИРОВАНИЕ' : 'НОВЫЙ КОНТРАГЕНТ'}
          </h2>
          <button onClick={onClose} className="text-[#8b859e] hover:text-white font-pixel-bold cursor-pointer">X</button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-mono text-xs overflow-y-auto pr-2 hide-scrollbar">
          
          {/* БЛОК ИНФОРМАЦИИ (ПРОСМОТР ИЛИ РЕДАКТИРОВАНИЕ) */}
          {!isEditingInfo ? (
            <div className="flex flex-col md:flex-row gap-4 bg-[#181124] p-4 border-2 border-[#3a2e4d]">
              {/* ИЗОБРАЖЕНИЕ СДЕЛАНО ШИРЕ */}
              <div className="w-full md:w-56 h-32 shrink-0 border-2 border-black bg-black">
                <img src={supplier.image || '/assets/фон.png'} alt="logo" className="w-full h-full object-cover" />
              </div>
              
              <div className="flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white uppercase">{formData.name}</h3>
                  <span className="text-[#8b859e] uppercase text-[10px]">{formData.category} | Рейтинг: {formData.rating}</span>
                </div>
                <div className="flex flex-col gap-1 text-[10px] text-gray-300 mt-2 md:mt-0">
                  <span>📞 {formData.phone || 'Нет телефона'}</span>
                  <span>📧 {formData.email || 'Нет email'}</span>
                </div>
                <button type="button" onClick={() => setIsEditingInfo(true)} className="mt-2 bg-[#261d35] text-white border border-[#3a2e4d] py-1 text-[9px] font-pixel-bold hover:bg-purple w-full md:w-auto self-start px-4 cursor-pointer transition-colors">
                  РЕДАКТИРОВАТЬ ПРОФИЛЬ
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#181124] p-4 border-2 border-purple">
              <div className="flex flex-col gap-1">
                <label className="text-[#8b859e] uppercase text-[10px]">Название (ООО/ИП)</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-[#0b0811] text-white border border-[#3a2e4d] p-2 focus:border-purple focus:outline-none" required />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[#8b859e] uppercase text-[10px]">Основная специализация</label>
                <input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="bg-[#0b0811] text-white border border-[#3a2e4d] p-2 focus:border-purple focus:outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[#8b859e] uppercase text-[10px]">Телефон</label>
                <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="bg-[#0b0811] text-white border border-[#3a2e4d] p-2 focus:border-purple focus:outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[#8b859e] uppercase text-[10px]">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="bg-[#0b0811] text-white border border-[#3a2e4d] p-2 focus:border-purple focus:outline-none" />
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[#8b859e] uppercase text-[10px]">Рейтинг (0-10)</label>
                <input type="number" step="0.1" value={formData.rating === 0 ? '' : formData.rating} onChange={(e) => setFormData({...formData, rating: e.target.value})} className="bg-[#0b0811] text-yellow font-bold border border-[#3a2e4d] p-2 focus:border-purple focus:outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[#8b859e] uppercase text-[10px]">Статус работы</label>
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="bg-[#0b0811] text-white border border-[#3a2e4d] p-2 focus:border-purple focus:outline-none cursor-pointer">
                  <option value="Активен">Активен</option>
                  <option value="Ожидание">Ожидание договора</option>
                  <option value="Проблема">Проблема / Блок</option>
                </select>
              </div>

              <div className="col-span-full flex flex-col gap-1">
                <label className="text-[#8b859e] uppercase text-[10px]">Фото (Оставьте пустым для сохранения старого)</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="bg-[#0b0811] text-white border border-[#3a2e4d] p-1.5 focus:border-purple focus:outline-none text-xs file:bg-purple file:text-white file:border-0 cursor-pointer" />
              </div>

              {supplier && (
                <div className="col-span-full mt-2">
                  <button type="button" onClick={() => setIsEditingInfo(false)} className="text-[#8b859e] text-[10px] font-pixel border-b border-dashed border-[#8b859e] hover:text-white cursor-pointer">Скрыть редактирование профиля</button>
                </div>
              )}
            </div>
          )}

          {/* ПРАЙС-ЛИСТ (КАТАЛОГ) ПОСТАВЩИКА - ВСЕГДА ОТКРЫТ */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex justify-between items-center bg-[#261d35] p-2 border-2 border-black">
              <h3 className="font-pixel-bold text-[10px] text-white uppercase">ПРАЙС-ЛИСТ / ДОСТУПНО ДЛЯ ЗАКАЗА</h3>
              <button type="button" onClick={handleAddProduct} className="bg-green text-black px-2 py-1 text-[8px] font-pixel-bold shadow-[1px_1px_0_#000] active:translate-y-0.5 active:shadow-none uppercase cursor-pointer">
                + ТОВАР
              </button>
            </div>

            {catalog.length === 0 ? (
              <div className="text-center p-4 border-2 border-dashed border-[#3a2e4d] text-[#8b859e] text-[10px] uppercase">
                Прайс-лист пуст. Вы не сможете делать закупки у этого контрагента.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {catalog.map((product, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-2 bg-[#181124] p-2 border border-[#3a2e4d] items-end relative group">
                    <div className="flex flex-col gap-1 w-full md:w-auto flex-grow">
                      <label className="text-[8px] text-[#8b859e] uppercase">Товар</label>
                      <input type="text" value={product.name} onChange={(e) => handleProductChange(index, 'name', e.target.value)} placeholder="Сыр Чеддер" className="bg-[#0b0811] text-white border border-[#3a2e4d] p-1.5 w-full focus:border-purple focus:outline-none" required />
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto">
                      <div className="flex flex-col gap-1 w-1/3 md:w-24">
                        <label className="text-[8px] text-[#8b859e] uppercase">Категория</label>
                        <select value={product.category} onChange={(e) => handleProductChange(index, 'category', e.target.value)} className="bg-[#0b0811] text-white border border-[#3a2e4d] p-1.5 w-full focus:outline-none cursor-pointer">
                          <option value="Сырье">Сырье</option>
                          <option value="Упаковка">Упаковка</option>
                          <option value="Напитки">Напитки</option>
                          <option value="Хозтовары">Хозтовары</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1 w-1/3 md:w-20">
                        <label className="text-[8px] text-[#8b859e] uppercase">Цена (₽)</label>
                        <input type="number" value={product.price === 0 ? '' : product.price} onChange={(e) => handleProductChange(index, 'price', e.target.value)} className="bg-[#0b0811] text-green font-bold border border-[#3a2e4d] p-1.5 w-full text-center focus:border-purple focus:outline-none" placeholder="0" />
                      </div>
                      <div className="flex flex-col gap-1 w-1/3 md:w-24">
                        <label className="text-[8px] text-[#8b859e] uppercase">В наличии</label>
                        <input type="number" value={product.stock === 0 ? '' : product.stock} onChange={(e) => handleProductChange(index, 'stock', e.target.value)} className="bg-[#0b0811] text-white border border-[#3a2e4d] p-1.5 w-full text-center focus:border-purple focus:outline-none" placeholder="0" />
                      </div>
                    </div>
                    
                    <button type="button" onClick={() => handleRemoveProduct(index)} className="bg-red/20 text-red hover:bg-red hover:text-white border border-red p-1.5 font-bold transition-colors shrink-0 w-full md:w-auto mt-2 md:mt-0 cursor-pointer">
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-4 pt-4 border-t-2 border-[#3a2e4d] shrink-0">
            {supplier && (
              <button type="button" onClick={() => { if(confirm('ТОЧНО УДАЛИТЬ?')) { onDelete(supplier.id); onClose(); } }} className="bg-red/10 text-red border-2 border-red py-2 px-4 font-pixel-bold text-[10px] hover:bg-red hover:text-white uppercase transition-colors cursor-pointer">
                УДАЛИТЬ
              </button>
            )}
            <button type="button" onClick={onClose} className="flex-1 bg-transparent text-white border-2 border-[#3a2e4d] py-2 font-pixel-bold text-[10px] hover:bg-[#261d35] uppercase cursor-pointer transition-colors">
              ОТМЕНА
            </button>
            <button type="submit" className="flex-1 bg-green text-black border-2 border-black py-2 font-pixel-bold text-[10px] hover:bg-[#22c55e] uppercase shadow-[2px_2px_0_#000] cursor-pointer transition-colors">
              СОХРАНИТЬ ВСЕ ДАННЫЕ
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}