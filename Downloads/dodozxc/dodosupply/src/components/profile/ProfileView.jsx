// src/components/profile/ProfileView.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { playSound } from '../../utils/soundManager';

export default function ProfileView() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Имя Администратора',
    callsign: 'NIGHTHAWK',
    role: 'Операционный Директор',
    level: 99,
    xp: 14850,
    nextLevelXp: 15000,
    shiftsCompleted: 1337,
    efficiency: '98.5%',
    clearance: 'УРОВЕНЬ 5 (МАКСИМУМ)'
  });

  // Имитация лога активности
  const [activityLog] = useState([
    { id: 1, action: 'АВТОРИЗАЦИЯ В СИСТЕМЕ', time: '08:00', status: 'OK' },
    { id: 2, action: 'ИЗМЕНЕНИЕ СТАТУСА ЗАКАЗА ORD-8432', time: '09:15', status: 'OK' },
    { id: 3, action: 'ОТКЛОНЕНИЕ ПОСТАВКИ (БРАК)', time: '11:42', status: 'WARN' },
    { id: 4, action: 'ЗАПРОС СИСТЕМНОГО ЛОГА', time: '14:05', status: 'OK' },
  ]);

  const handleSave = (e) => {
    e.preventDefault();
    playSound('add'); // Звук XP (Успех)
    setIsEditing(false);
    alert('ЛИЧНЫЕ ДАННЫЕ УСПЕШНО ОБНОВЛЕНЫ В БАЗЕ КОРПОРАЦИИ!');
  };

  const handleClearanceRequest = () => {
    playSound('alert'); // Звук ошибки/отказа
    alert('В ДОСТУПЕ ОТКАЗАНО. ВЫ УЖЕ ИМЕЕТЕ МАКСИМАЛЬНЫЙ УРОВЕНЬ ДОПУСКА.');
  };

  // Расчет полоски опыта
  const xpPercent = (userData.xp / userData.nextLevelXp) * 100;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_2fr] gap-4 select-none pb-4">
      
      {/* ЛЕВАЯ ПАНЕЛЬ: ДОСЬЕ И ID КАРТА */}
      <div className="flex flex-col gap-4">
        <div className="pixel-panel border-2 border-[#3a2e4d] bg-[#0b0811]/80 p-4 relative overflow-hidden group">
          <div className="absolute inset-0 scanlines opacity-20 pointer-events-none"></div>
          
          <div className="border-b-2 border-dashed border-[#3a2e4d] pb-2 mb-4 flex justify-between items-start">
            <span className="font-pixel-bold text-xs text-orange-400 uppercase tracking-widest">// PERSONNEL FILE</span>
            <span className="bg-red text-white text-[8px] font-pixel-bold px-1.5 py-0.5 border border-black animate-pulse">
              TOP SECRET
            </span>
          </div>

          <div className="flex flex-col items-center gap-3">
            {/* Аватар */}
            <div className="w-32 h-32 bg-orange-500 border-4 border-black flex items-center justify-center shadow-[4px_4px_0_#000] relative">
              <span className="font-pixel-bold text-5xl text-black">A</span>
              <div className="absolute bottom-1 right-1 bg-green border border-black w-3 h-3 rounded-full animate-pulse shadow-[0_0_10px_#4ade80]"></div>
            </div>

            <div className="text-center w-full">
              <h2 className="text-white font-bold text-lg uppercase">{userData.name}</h2>
              <p className="text-purple font-pixel text-[10px] uppercase tracking-widest mt-1">ПОЗЫВНОЙ: {userData.callsign}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 font-mono text-xs bg-[#181124] p-3 border border-[#3a2e4d]">
            <div className="flex justify-between"><span className="text-[#8b859e]">ДОЛЖНОСТЬ:</span> <span className="text-white font-bold">{userData.role}</span></div>
            <div className="flex justify-between"><span className="text-[#8b859e]">ДОПУСК:</span> <span className="text-red font-bold">{userData.clearance}</span></div>
            <div className="flex justify-between"><span className="text-[#8b859e]">ID КАРТЫ:</span> <span className="text-white">DODO-OP-8821</span></div>
            <div className="flex justify-between"><span className="text-[#8b859e]">СТАТУС:</span> <span className="text-green font-bold">ONLINE</span></div>
          </div>

          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => { playSound('click'); setIsEditing(!isEditing); }}
            className="w-full mt-4 bg-[#261d35] text-white font-pixel-bold text-[9px] py-3 border-2 border-black shadow-[2px_2px_0_#000] hover:bg-purple transition-colors uppercase cursor-pointer"
          >
            {isEditing ? 'ОТМЕНИТЬ РЕДАКТИРОВАНИЕ' : 'ИЗМЕНИТЬ ДАННЫЕ'}
          </motion.button>
        </div>
      </div>

      {/* ПРАВАЯ ПАНЕЛЬ: СТАТИСТИКА И ЛОГИ */}
      <div className="flex flex-col gap-4">
        
        {/* БЛОК СТАТИСТИКИ И УРОВНЯ */}
        <div className="pixel-panel border-2 border-[#3a2e4d] bg-[#0b0811]/80 p-4 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b-2 border-black pb-2">
            <h2 className="font-pixel-bold text-xs text-orange-400 uppercase tracking-wide">// БОЕВАЯ ЭФФЕКТИВНОСТЬ</h2>
            <span className="text-yellow font-pixel-bold text-xl">LVL {userData.level}</span>
          </div>

          {/* Полоска Опыта */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] font-pixel text-[#8b859e] uppercase">
              <span>ПРОГРЕСС ОПЫТА</span>
              <span>{userData.xp} / {userData.nextLevelXp} XP</span>
            </div>
            <div className="w-full h-4 bg-[#181124] border-2 border-black relative overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-green border-r-2 border-white shadow-[0_0_10px_#4ade80]"
              ></motion.div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="bg-[#181124] p-3 border border-[#3a2e4d] flex flex-col items-center justify-center">
              <span className="text-[#8b859e] font-pixel text-[8px] uppercase">Отработано смен</span>
              <span className="text-white font-bold text-xl">{userData.shiftsCompleted}</span>
            </div>
            <div className="bg-[#181124] p-3 border border-[#3a2e4d] flex flex-col items-center justify-center">
              <span className="text-[#8b859e] font-pixel text-[8px] uppercase">Эффективность</span>
              <span className="text-purple font-bold text-xl">{userData.efficiency}</span>
            </div>
          </div>
        </div>

        {/* ПЕРЕКЛЮЧЕНИЕ МЕЖДУ РЕДАКТИРОВАНИЕМ И ЛОГАМИ */}
        {isEditing ? (
          <motion.form 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSave} 
            className="pixel-panel border-2 border-purple bg-[#181124] p-4 flex flex-col gap-3 font-mono text-xs shadow-[0_0_20px_rgba(168,85,247,0.1)]"
          >
            <h2 className="font-pixel-bold text-xs text-purple uppercase mb-2">// ОБНОВЛЕНИЕ БАЗЫ ДАННЫХ</h2>
            <div className="flex flex-col gap-1">
              <label className="text-[#8b859e] uppercase text-[10px]">Отображаемое Имя</label>
              <input type="text" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} className="bg-[#0b0811] text-white border-2 border-[#3a2e4d] p-2 focus:outline-none focus:border-purple font-pixel text-xs" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[#8b859e] uppercase text-[10px]">Позывной</label>
              <input type="text" value={userData.callsign} onChange={(e) => setUserData({...userData, callsign: e.target.value})} className="bg-[#0b0811] text-white border-2 border-[#3a2e4d] p-2 focus:outline-none focus:border-purple font-pixel text-xs" />
            </div>
            <motion.button whileTap={{ scale: 0.95 }} type="submit" className="w-full bg-green text-[#0b0811] font-pixel-bold text-[10px] py-3 border-2 border-black shadow-[4px_4px_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none uppercase cursor-pointer mt-2">
              СОХРАНИТЬ ИЗМЕНЕНИЯ
            </motion.button>
          </motion.form>
        ) : (
          <div className="pixel-panel border-2 border-[#3a2e4d] bg-[#0b0811]/80 p-4 flex flex-col h-full overflow-hidden">
            <h2 className="font-pixel-bold text-xs text-orange-400 uppercase tracking-wide border-b-2 border-black pb-2 mb-3">
              // ЛОГ АКТИВНОСТИ ЗА СМЕНУ
            </h2>
            <div className="flex flex-col gap-2 overflow-y-auto pr-2 max-h-[300px]">
              {activityLog.map((log) => (
                <div key={log.id} className="bg-[#181124] p-2 border border-[#261d35] flex items-center justify-between font-mono text-xs hover:border-purple transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-[#8b859e] text-[9px]">{log.time}</span>
                    <span className="text-white">{log.action}</span>
                  </div>
                  <span className={`text-[9px] font-pixel-bold px-1.5 py-0.5 border ${log.status === 'OK' ? 'text-green border-green/30 bg-green/10' : 'text-yellow border-yellow/30 bg-yellow/10'}`}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-4 flex gap-2">
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleClearanceRequest} className="flex-1 bg-red/10 text-red border border-red/40 font-pixel-bold text-[8px] py-2 uppercase hover:bg-red hover:text-white transition-colors cursor-pointer">
                ЗАПРОСИТЬ ПОВЫШЕНИЕ ДОПУСКА
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
