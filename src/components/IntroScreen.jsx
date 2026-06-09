import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { playSound } from '../utils/soundManager';

export default function IntroScreen({ onLogin }) {
  const [login, setLogin] = useState('admin');
  const [password, setPassword] = useState('supply');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('Выберите профиль смены');

  const canEnter = useMemo(() => login.trim() && password.trim(), [login, password]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canEnter) {
      playSound('alert');
      setMessage('Заполните логин и пароль');
      return;
    }

    playSound('click');
    setIsLoading(true);
    setMessage('Подключаем складской мир...');
    window.setTimeout(() => {
      playSound('add');
      onLogin();
    }, 700);
  };

  const quickLogin = (role) => {
    playSound('click');
    setLogin(role);
    setPassword('supply');
    setMessage(`Профиль ${role.toUpperCase()} выбран`);
  };

  return (
    <main className="fixed inset-0 z-[9999] overflow-hidden bg-black text-white">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/assets/фон.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          imageRendering: 'pixelated',
          filter: 'contrast(1.1) saturate(0.9)',
        }}
      />
      <div className="absolute inset-0 bg-[#08050c]/70" />
      <div className="absolute inset-0 scanlines opacity-45 pointer-events-none" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-6 gap-4"
      >
        <motion.img
          src="/assets/logo.png"
          alt="Dodo Supply"
          className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-[5px_5px_0_#000]"
          style={{ imageRendering: 'pixelated' }}
          initial={{ y: -18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        />

        <motion.div
          className="text-center select-none"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="font-pixel-bold text-3xl md:text-6xl text-[#ff6900] uppercase leading-none drop-shadow-[5px_5px_0_#000]">
            Dodo Supply
          </h1>
          <p className="font-pixel-bold text-[10px] md:text-sm text-yellow rotate-[-8deg] mt-1 md:mt-0 drop-shadow-[2px_2px_0_#000]">
            Bringing dough to the kitchen!
          </p>
        </motion.div>

        <motion.section
          className="w-full max-w-[460px] flex flex-col gap-2 mt-3"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <label className="minecraft-field">
            <span>Логин</span>
            <input value={login} onChange={(e) => setLogin(e.target.value)} autoComplete="username" />
          </label>

          <label className="minecraft-field">
            <span>Пароль</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
            />
          </label>

          <button type="submit" disabled={isLoading} className="minecraft-button primary">
            {isLoading ? 'Загрузка мира...' : 'Войти в систему'}
          </button>
          <button type="button" onClick={() => quickLogin('manager')} className="minecraft-button">
            Профиль менеджера
          </button>
          <button type="button" onClick={() => quickLogin('operator')} className="minecraft-button">
            Профиль оператора
          </button>

          <div className="grid grid-cols-[44px_1fr_44px] gap-2 pt-2">
            <button type="button" onClick={() => setMessage('Настройки доступны внутри системы')} className="minecraft-square">
              <img src="/assets/шестиренка.png" alt="Настройки" />
            </button>
            <button type="button" onClick={() => setMessage('Смена останется на экране входа')} className="minecraft-button">
              Выйти из игры
            </button>
            <button type="button" onClick={() => setMessage('Помощник склада онлайн')} className="minecraft-square">
              <img src="/assets/управление.png" alt="Помощь" />
            </button>
          </div>

          <p className="min-h-5 text-center text-[10px] md:text-xs font-pixel-bold text-[#f8e96b] drop-shadow-[2px_2px_0_#000]">
            {message}
          </p>
        </motion.section>
      </form>
    </main>
  );
}
