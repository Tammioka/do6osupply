// src/components/game/ArcadeGame.jsx
import { useState, useEffect } from 'react';
import { useGameEngine } from '../../hooks/useGameEngine';
import { motion, AnimatePresence } from 'framer-motion';

export default function ArcadeGame() {
  const { canvasRef, handleControl } = useGameEngine();
  const [activeKey, setActiveKey] = useState(null);
  
  // Состояния для секретного эффекта Донателло
  const [clickCount, setClickCount] = useState(0); 
  const [secretUnlocked, setSecretUnlocked] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'arrowup') setActiveKey('w');
      else if (key === 'arrowleft') setActiveKey('a');
      else if (key === 'arrowdown') setActiveKey('s');
      else if (key === 'arrowright') setActiveKey('d');
      else setActiveKey(key);
    };

    const handleKeyUp = () => setActiveKey(null);
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const getPressedClass = (targetKey) => activeKey === targetKey ? 'pressed' : '';

  // Логика секретного клика по Донателло
  const handleDonatelloClick = () => {
    setClickCount((prev) => prev + 1);
    if (clickCount + 1 >= 10) {
      setSecretUnlocked(true);
      // Сбрасываем счетчик через пару секунд после разблокировки
      setTimeout(() => {
        setSecretUnlocked(false);
        setClickCount(0);
      }, 5000);
    }
  };

  return (
    <aside className="right-sidebar flex flex-col items-center gap-4 pt-5 select-none h-full z-10 sticky top-0">
      <div className="w-20 h-20 bg-panel border-2 border-[#0b0811] flex flex-col items-center justify-center text-purple text-[8px] font-pixel-bold text-center shadow-lg">
        <img src="/assets/steave.jpg" alt="Admin" className="w-10 h-10 rounded-full border-2 border-purple mb-1 object-cover" />
        <span>АДМИН</span>
      </div>
      
      <div className="text-purple text-sm tracking-widest font-pixel-bold">♥ △ □ ◯ ✕</div>

      <div className="relative w-[250px] h-[360px] flex justify-center items-center my-2" style={{ imageRendering: 'pixelated' }}>
        <img src="/assets/автомат.png" className="absolute w-full h-full object-contain z-[1] pointer-events-none" alt="Автомат" />
        <canvas ref={canvasRef} width="150" height="133" className="absolute top-[76px] bg-[#111] z-[2] border-4 border-[#333]"></canvas>
      </div>

      <div className="grid grid-cols-3 grid-rows-3 gap-1 justify-center mt-1">
        <img 
          src="/assets/управление/треугольник.png" 
          className={`btn-ctrl col-start-2 row-start-1 ${getPressedClass('w')}`}
          onPointerDown={() => handleControl('spin', true)}
          onPointerUp={() => handleControl('spin', false)}
          onPointerLeave={() => handleControl('spin', false)}
          alt="△" 
        />
        <img 
          src="/assets/управление/квадрат.png" 
          className={`btn-ctrl col-start-1 row-start-2 ${getPressedClass('a')}`}
          onPointerDown={() => handleControl('left', true)}
          onPointerUp={() => handleControl('left', false)}
          onPointerLeave={() => handleControl('left', false)}
          alt="□" 
        />
        <img 
          src="/assets/управление/круг.png" 
          className={`btn-ctrl col-start-3 row-start-2 ${getPressedClass('d')}`}
          onPointerDown={() => handleControl('right', true)}
          onPointerUp={() => handleControl('right', false)}
          onPointerLeave={() => handleControl('right', false)}
          alt="◯" 
        />
        <img 
          src="/assets/управление/крест.png" 
          className={`btn-ctrl col-start-2 row-start-3 ${getPressedClass('s')}`}
          onPointerDown={() => handleControl('shoot', true)}
          onPointerUp={() => handleControl('shoot', false)}
          onPointerLeave={() => handleControl('shoot', false)}
          alt="✕" 
        />
      </div>

      {/* --- ОБНОВЛЕННАЯ ОБЛАСТЬ С ДОНАТЕЛЛО --- */}
      <div className="relative flex items-center gap-2 mt-4 select-none h-32 w-32 justify-center">
          <motion.div
              // Анимация при наведении: прыжок и забавное раскачивание (wiggle)
              whileHover={{ 
                  y: -10, // Прыжок
                  rotate: [0, 5, -5, 5, 0], // Забавный wiggle
                  scale: 1.1 // Слегка крупнее
              }}
              // Анимация при клике: резкое сжатие
              whileTap={{ 
                  scale: 0.9, 
                  rotate: 0,
                  transition: { duration: 0.1 }
              }}
              onClick={handleDonatelloClick}
              className="cursor-pointer"
          >
              <img src="/assets/donatelo.png" className="w-full h-full object-contain drop-shadow-lg transition-shadow" alt="Черепашка" style={{ imageRendering: 'pixelated' }}/>
          </motion.div>
          
          {/* Секретный счетчик кликов (появляется после первого клика) */}
          <AnimatePresence>
            {clickCount > 0 && !secretUnlocked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="pixel-panel bg-panel border-4 border-orange-400 p-1 px-3 absolute -top-8 left-12 flex flex-col items-center z-30 shadow-2xl"
              >
                  <div className="text-[10px] text-orange-400 font-pixel-bold uppercase tracking-wide leading-none">SECRET CLICKER</div>
                  <div className="text-xl font-pixel-bold text-white drop-shadow-[2px_2px_0_#000]">{clickCount}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Панель разблокировки секрета (появляется после 10 кликов) */}
          <AnimatePresence>
            {secretUnlocked && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="pixel-panel bg-[#a855f7]/90 border-4 border-black p-2 flex flex-col items-center absolute -top-20 left-10 z-30 shadow-[0_0_60px_rgba(168,85,247,0.7)]"
              >
                  {/* Красный мигающий текст */}
                  <div className="text-[10px] text-yellow animate-blink font-pixel-bold uppercase leading-none">!!! SECRET UNLOCKED !!!</div>
                  <div className="text-xs font-pixel-bold text-white mt-1 drop-shadow-[2px_2px_0_#000]">Dodo Level: 999</div>
                  <div className="text-xs font-mono text-purple mt-1 drop-shadow-[1px_1px_0_#000]">Thanks, Donatello!</div>
              </motion.div>
            )}
          </AnimatePresence>
      </div>
    </aside>
  );
}