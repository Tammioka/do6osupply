// src/App.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import IntroScreen from './components/IntroScreen';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import CassettePlayer from './components/layout/CassettePlayer';
import MobileNav from './components/layout/MobileNav';

import StatCard from './components/dashboard/StatCard';
import ChartsWidget from './components/dashboard/ChartsWidget';
import TablesWidget from './components/dashboard/TablesWidget';
import ArcadeGame from './components/game/ArcadeGame';

import SuppliersView from './components/suppliers/SuppliersView';
import PurchasesView from './components/purchases/PurchasesView';
import WarehouseView from './components/warehouse/WarehouseView';
import ReportsView from './components/reports/ReportsView';
import SettingsView from './components/settings/SettingsView';
import ProfileView from './components/profile/ProfileView';

import SmoothScroll from './components/SmoothScroll';
import { SoundConfig } from './utils/soundManager';

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } };
const itemVariants = { hidden: { opacity: 0, y: 50 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } } };

export default function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  const [isMobileMusicOpen, setIsMobileMusicOpen] = useState(false);

  const [scanlinesActive, setScanlinesActive] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    SoundConfig.enabled = soundEnabled;
  }, [soundEnabled]);

  if (!isAuthorized) {
    return <IntroScreen onLogin={() => setIsAuthorized(true)} />;
  }

  const renderDashboardContent = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-4 pb-4">
      <motion.div variants={itemVariants} className="pixel-panel p-4">
        <h2 className="font-bold text-xs text-white mb-2 uppercase tracking-wide font-pixel-bold">СВОДКА OPERATIONS</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <StatCard title="Активные Заказы" value="161" icon="/assets/мешок.png" />
          <StatCard title="Просрочка" value="19" icon="/assets/флаг.png" />
          <StatCard title="Критичный Запас" value="3" icon="/assets/сундук.png" />
          <StatCard title="Надежность" value="90%" icon="/assets/медаль.png" />
        </div>
      </motion.div>
      <motion.div variants={itemVariants}><ChartsWidget /></motion.div>
      <motion.div variants={itemVariants}><TablesWidget /></motion.div>
    </motion.div>
  );

  return (
    <div className="relative bg-body text-[#d1ced9] font-mono font-bold text-base min-h-screen flex flex-col md:grid md:grid-cols-[240px_1fr] xl:grid-cols-[240px_1fr_280px] gap-0 md:gap-4 p-0 md:p-3 z-0">
      
      {/* Зафиксированный задний фон и эффекты */}
      {scanlinesActive && (
        <div className="fixed inset-0 scanlines opacity-40 z-50 pointer-events-none"></div>
      )}
      <div className="fixed inset-0 z-[-2]" style={{ backgroundImage: "url('/assets/фон.png')", backgroundSize: 'cover', backgroundPosition: 'center', imageRendering: 'pixelated' }}></div>
      <div className="fixed inset-0 bg-[#0a050f]/85 z-[-1]"></div>

      {/* САЙДБАР: Обернут в чистый HTML-div с эффектом sticky и фиксацией высоты */}
      <div className="hidden md:flex flex-col sticky top-3 h-[calc(100vh-24px)] self-start w-full">
        <motion.div 
          className="flex flex-col h-full w-full" 
          initial={{ x: -100, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </motion.div>
      </div>

      {/* ГЛАВНЫЙ ЭКРАН: Контент свободно скроллится на уровне окна браузера */}
      <main className="flex-1 flex flex-col gap-3 md:gap-4 p-2 md:p-1 z-10 pb-[80px] md:pb-0">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} setActiveTab={setActiveTab} />
        
        <SmoothScroll>
          <div className="flex flex-col gap-3 md:gap-4">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                {activeTab === 'dashboard' && renderDashboardContent()}
                {activeTab === 'suppliers' && <SuppliersView searchTerm={searchTerm} />}
                {activeTab === 'purchases' && <PurchasesView searchTerm={searchTerm} />}
                {activeTab === 'warehouse' && <WarehouseView searchTerm={searchTerm} />}
                {activeTab === 'reports' && <ReportsView searchTerm={searchTerm} />}
                {activeTab === 'profile' && <ProfileView />}
                {activeTab === 'settings' && <SettingsView scanlinesActive={scanlinesActive} setScanlinesActive={setScanlinesActive} soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </SmoothScroll>
      </main>

      {/* АРКАДНЫЙ АВТОМАТ: Также защищен от конфликта sticky + transform */}
      <div className="hidden xl:block sticky top-3 h-[calc(100vh-24px)] z-10 self-start w-full">
        <motion.div 
          className="h-full w-full"
          initial={{ x: 100, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <ArcadeGame />
        </motion.div>
      </div>

      {/* Музыкальный плеер и навигация */}
      <CassettePlayer />
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <CassettePlayer 
        isMobileMusicOpen={isMobileMusicOpen} 
        setIsMobileMusicOpen={setIsMobileMusicOpen} 
      />
      <MobileNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        toggleMusicMenu={() => setIsMobileMusicOpen(!isMobileMusicOpen)} 
      />

    </div>
  );
}
