// src/components/layout/Header.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../../utils/soundManager';

export default function Header({ searchTerm, setSearchTerm, setActiveTab }) { 
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', text: 'КРИТИЧЕСКИЙ ОСТАТОК: Коробки для пиццы 30см', time: '2 мин назад', read: false },
    { id: 2, type: 'success', text: 'Заказ ORD-8432 успешно доставлен на склад', time: '15 мин назад', read: false },
    { id: 3, type: 'info', text: 'Смена менеджера #42 началась', time: '2 часа назад', read: true }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setIsNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleNotif = () => { playSound('click'); setIsNotifOpen(!isNotifOpen); if (isProfileOpen) setIsProfileOpen(false); };
  const toggleProfile = () => { playSound('click'); setIsProfileOpen(!isProfileOpen); if (isNotifOpen) setIsNotifOpen(false); };

  const markAllAsRead = () => { playSound('add'); setNotifications(prev => prev.map(n => ({ ...n, read: true }))); };
  const clearNotifications = () => { playSound('delete'); setNotifications([]); };

  const handleOpenProfile = () => {
    playSound('click');
    setActiveTab('profile'); 
    setIsProfileOpen(false); 
  };

  return (
    <header className="flex justify-between items-center bg-[#0b0811]/80 border-2 border-[#3a2e4d] p-2 md:p-3 shrink-0 relative z-40 backdrop-blur-sm">
      
      {/* ПОИСК (Адаптивный размер) */}
      <div className="flex-1 max-w-md">
        <div className="relative flex items-center">
          <span className="absolute left-2 md:left-3 text-[#8b859e] font-pixel-bold text-[10px] mt-0.5">&gt;</span>
          <input 
            type="text" 
            placeholder="ПОИСК..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full bg-[#181124] text-white border-2 border-[#3a2e4d] pl-6 md:pl-8 pr-2 md:pr-3 py-2 text-[10px] md:text-xs font-mono focus:outline-none focus:border-purple transition-colors placeholder:text-[#3a2e4d]" 
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 ml-2">
        
        {/* КНОПКА УВЕДОМЛЕНИЙ */}
        <div className="relative" ref={notifRef}>
          <button onClick={toggleNotif} className={`w-8 h-8 md:w-10 md:h-10 border-2 border-[#3a2e4d] flex items-center justify-center transition-colors shadow-[2px_2px_0_#000] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none cursor-pointer ${isNotifOpen ? 'bg-purple border-black' : 'bg-[#181124] hover:bg-[#261d35]'}`}>
            <span className="text-white font-pixel text-xs md:text-sm relative">
              🔔
              {unreadCount > 0 && <span className="absolute -top-2 -right-2 bg-red border border-black text-white text-[8px] font-pixel-bold px-1 py-0.5 animate-pulse">{unreadCount}</span>}
            </span>
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute right-0 top-10 md:top-12 w-72 md:w-80 bg-[#0b0811] border-2 border-purple shadow-[4px_4px_0_#000,_0_0_30px_rgba(168,85,247,0.2)] flex flex-col z-50 overflow-hidden">
                <div className="absolute inset-0 scanlines opacity-20 pointer-events-none"></div>
                <div className="bg-purple text-white p-2 border-b-2 border-black flex justify-between items-center relative z-10">
                  <span className="font-pixel-bold text-[10px] uppercase">СИСТЕМНЫЕ ЛОГИ</span>
                  <button onClick={markAllAsRead} className="text-[8px] font-pixel bg-black/30 px-2 py-1 hover:bg-black/50 transition-colors cursor-pointer border border-white/20">ПРОЧИТАТЬ ВСЕ</button>
                </div>
                <div className="max-h-64 overflow-y-auto flex flex-col relative z-10">
                  {notifications.length > 0 ? notifications.map(n => (
                    <div key={n.id} className={`p-3 border-b border-[#261d35] flex flex-col gap-1 transition-colors hover:bg-[#181124] ${!n.read ? 'bg-purple/5' : ''}`}>
                      <div className="flex justify-between items-start">
                        <span className={`text-[8px] font-pixel-bold uppercase border px-1 py-0.5 ${n.type === 'alert' ? 'text-red border-red/50 bg-red/10' : n.type === 'success' ? 'text-green border-green/50 bg-green/10' : 'text-[#8b859e] border-[#3a2e4d]'}`}>{n.type}</span>
                        <span className="text-[#8b859e] font-mono text-[8px]">{n.time}</span>
                      </div>
                      <p className={`font-mono text-[10px] md:text-xs mt-1 ${!n.read ? 'text-white' : 'text-[#8b859e]'}`}>{n.text}</p>
                    </div>
                  )) : <div className="p-6 text-center text-[#8b859e] font-pixel text-[10px]">НОВЫХ ЛОГОВ НЕТ</div>}
                </div>
                <button onClick={clearNotifications} className="w-full bg-[#181124] text-red font-pixel-bold text-[9px] py-2 border-t border-[#3a2e4d] hover:bg-red hover:text-white transition-colors cursor-pointer relative z-10">ОЧИСТИТЬ АРХИВ</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* КНОПКА ПРОФИЛЯ */}
        <div className="relative" ref={profileRef}>
          <button onClick={toggleProfile} className={`flex items-center gap-2 border-2 border-[#3a2e4d] px-2 py-1 md:px-3 md:py-1.5 transition-colors shadow-[2px_2px_0_#000] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none cursor-pointer ${isProfileOpen ? 'bg-purple border-black' : 'bg-[#181124] hover:bg-[#261d35]'}`}>
            <div className="w-5 h-5 md:w-6 md:h-6 bg-orange-500 border border-black flex items-center justify-center">
              <span className="font-pixel-bold text-[8px] md:text-[10px] text-black">A</span>
            </div>
            {/* Текст профиля скрыт на мобилках для экономии места */}
            <div className="hidden sm:flex flex-col items-start leading-none">
              <span className="text-white font-pixel text-[10px] uppercase">Admin</span>
              <span className="text-[#8b859e] font-mono text-[8px]">LVL 99</span>
            </div>
            <span className="text-[#8b859e] text-[8px] md:ml-1">▼</span>
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute right-0 top-10 md:top-12 w-56 bg-[#0b0811] border-2 border-purple shadow-[4px_4px_0_#000,_0_0_30px_rgba(168,85,247,0.2)] flex flex-col z-50 overflow-hidden">
                <div className="absolute inset-0 scanlines opacity-20 pointer-events-none"></div>
                
                <div className="p-4 border-b-2 border-[#3a2e4d] flex flex-col items-center gap-2 bg-[#181124] relative z-10">
                  <div className="w-12 h-12 bg-orange-500 border-2 border-black flex items-center justify-center shadow-[2px_2px_0_#000]">
                    <span className="font-pixel-bold text-lg text-black">A</span>
                  </div>
                  <div className="text-center">
                    <h3 className="text-white font-bold text-sm uppercase">Имя Администратора</h3>
                    <p className="text-purple font-pixel text-[9px] mt-1 uppercase tracking-widest">Операционный Директор</p>
                  </div>
                </div>

                <div className="flex flex-col p-2 relative z-10 font-mono text-xs">
                  <button onClick={handleOpenProfile} className="text-left px-3 py-2 text-[#d1ced9] hover:bg-[#261d35] hover:text-white transition-colors cursor-pointer border border-transparent hover:border-[#3a2e4d]">
                    👤 Личные данные
                  </button>
                  <div className="border-t border-[#3a2e4d] my-1"></div>
                  <button onClick={() => { playSound('alert'); if(confirm('ЗАВЕРШИТЬ СМЕНУ И ВЫЙТИ ИЗ СИСТЕМЫ?')) window.location.reload(); }} className="text-left px-3 py-2 text-red font-bold hover:bg-red/10 transition-colors cursor-pointer">
                    ОТКЛЮЧИТЬСЯ (LOGOUT)
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}
