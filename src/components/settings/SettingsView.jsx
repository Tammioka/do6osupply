// src/components/settings/SettingsView.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { playSound } from '../../utils/soundManager';

export default function SettingsView({ 
  scanlinesActive, setScanlinesActive,
  soundEnabled, setSoundEnabled 
}) {
  const [uptime, setUptime] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => setUptime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const [backups, setBackups] = useState([
    { id: 'BK-2026-05-18', name: 'dodo_supply_2026-05-18_12-00.db', size: '1.2 MB', auto: true }
  ]);

  const handleCreateBackup = () => {
    playSound('add'); // Звук успешного действия
    const now = new Date().toISOString().split('T')[0];
    const newBackup = { id: `BK-${Date.now()}`, name: `dodo_supply_${now}_manual.db`, size: '1.2 MB', auto: false };
    setBackups([newBackup, ...backups]);
  };

  const handleDeleteCache = () => {
    if(confirm("ОЧИСТИТЬ КЭШ СИСТЕМЫ?")) {
      playSound('delete'); // Звук разрушения
      setTimeout(() => window.location.reload(), 500);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 select-none pb-4">
      
      {/* ЛЕВАЯ ПАНЕЛЬ */}
      <div className="flex flex-col gap-4">
        {/* БИОС */}
        <div className="pixel-panel border-2 border-green bg-[#050a05] p-4 font-mono text-green text-xs shadow-[inset_0_0_20px_rgba(74,222,128,0.1)] relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] opacity-30 pointer-events-none"></div>
          <div className="flex justify-between border-b border-green/30 pb-2 mb-2">
            <span className="font-pixel-bold">DODO-OS BIOS v4.11</span>
            <span>640K RAM SYSTEM GOOD</span>
          </div>
          <div className="grid grid-cols-2 gap-y-2">
            <span>PROCESSOR:</span><span>SHREDDER CORE 8-BIT</span>
            <span>BOOT DRIVE:</span><span>/dev/sda1 (SSD)</span>
            <span>NETWORK:</span><span className="animate-pulse text-purple font-bold">ONLINE</span>
            <span>SYSTEM UPTIME:</span><span>{formatUptime(uptime)}</span>
          </div>
        </div>

        {/* НАСТРОЙКИ */}
        <div className="pixel-panel border-2 border-[#3a2e4d] bg-[#0b0811]/65 p-4 flex flex-col gap-4">
          <h2 className="font-pixel-bold text-xs text-orange-400 uppercase tracking-wide border-b-2 border-black pb-2">
            // ИНТЕРФЕЙС (A/V CONFIG)
          </h2>

          <div className="flex flex-col gap-3 font-mono text-xs">
            <div className="flex justify-between items-center bg-[#0b0811] p-3 border border-[#261d35]">
              <div className="flex flex-col gap-1">
                <span className="text-white font-bold uppercase text-[10px]">CRT Эффект экрана</span>
                <span className="text-[#8b859e] text-[9px]">Горизонтальные линии монитора</span>
              </div>
              <button onClick={() => setScanlinesActive(!scanlinesActive)} className={`px-4 py-2 font-pixel-bold text-[9px] border-2 border-black shadow-[2px_2px_0_#000] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all cursor-pointer ${scanlinesActive ? 'bg-green text-[#0b0811]' : 'bg-red text-white'}`}>
                {scanlinesActive ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="flex justify-between items-center bg-[#0b0811] p-3 border border-[#261d35]">
              <div className="flex flex-col gap-1">
                <span className="text-white font-bold uppercase text-[10px]">Звуки интерфейса</span>
                <span className="text-[#8b859e] text-[9px]">Minecraft эффекты в меню</span>
              </div>
              <button onClick={() => setSoundEnabled(!soundEnabled)} className={`px-4 py-2 font-pixel-bold text-[9px] border-2 border-black shadow-[2px_2px_0_#000] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all cursor-pointer ${soundEnabled ? 'bg-green text-[#0b0811]' : 'bg-red text-white'}`}>
                {soundEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ПРАВАЯ ПАНЕЛЬ */}
      <div className="flex flex-col gap-4">
        {/* RECOVERY */}
        <div className="pixel-panel border-2 border-[#3a2e4d] bg-[#0b0811]/65 p-4 flex flex-col h-auto">
          <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-3">
            <h2 className="font-pixel-bold text-xs text-orange-400 uppercase tracking-wide">// RECOVERY ПАНЕЛЬ</h2>
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleCreateBackup} className="bg-purple text-white text-[8px] font-pixel-bold py-2 px-3 border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer hover:bg-purple-500">
              СОЗДАТЬ СЛЁТ (BACKUP)
            </motion.button>
          </div>
          <div className="flex flex-col gap-2 font-mono text-xs max-h-[220px] overflow-y-auto pr-1">
            {backups.map(b => (
              <div key={b.id} className="pixel-panel bg-[#0b0811] p-3 border border-[#3a2e4d] flex items-center justify-between hover:border-purple transition-colors">
                <div className="flex flex-col">
                  <span className="text-white text-xs font-bold truncate max-w-[240px]">{b.name}</span>
                </div>
                <button onClick={() => { playSound('alert'); alert('ОТКАТ...'); }} className="bg-panel border border-[#3a2e4d] text-yellow px-3 py-1.5 text-[8px] font-pixel-bold hover:bg-yellow hover:text-black transition-colors cursor-pointer shadow-[2px_2px_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
                  ОТКАТ
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* DEBUGGER */}
        <div className="pixel-panel border-2 border-red/30 bg-red/5 p-4 flex flex-col gap-3">
          <h2 className="font-pixel-bold text-xs text-red uppercase tracking-wide border-b border-red/20 pb-2">!! ОПАСНАЯ ЗОНА</h2>
          <div className="flex gap-2 mt-1">
            <button onClick={() => { playSound('delete'); alert("АРКАДНЫЕ РЕКОРДЫ ОБНУЛЕНЫ."); }} className="flex-1 bg-red/10 border border-red/40 text-red hover:bg-red hover:text-white font-pixel-bold text-[8px] py-3 uppercase transition-colors cursor-pointer">
              СБРОСИТЬ РЕКОРДЫ
            </button>
            <button onClick={handleDeleteCache} className="flex-1 bg-panel border border-[#3a2e4d] text-[#8b859e] hover:text-white font-pixel-bold text-[8px] py-3 uppercase transition-colors cursor-pointer">
              ОЧИСТИТЬ КЭШ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
