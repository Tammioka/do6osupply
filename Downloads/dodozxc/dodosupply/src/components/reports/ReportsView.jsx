// src/components/reports/ReportsView.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../../utils/soundManager';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

// Имитация базы данных отчетов
const mockReports = [
  {
    id: 'REP-2026-Q1',
    title: 'Анализ Цепи Поставок Q1',
    date: '2026-04-01',
    type: 'Квартальный',
    size: '4.2 MB',
    summary: 'Успешно оптимизирована доставка сырья от ООО АгроКомплекс. Надежность сети выросла до 92%. Выявлен перерасход в категории Упаковка.',
    chartData: [
      { name: 'Янв', затраты: 420 },
      { name: 'Фев', затраты: 380 },
      { name: 'Мар', затраты: 510 },
    ],
    radarData: [
      { subject: 'Скорость', A: 90, fullMark: 100 },
      { subject: 'Качество', A: 85, fullMark: 100 },
      { subject: 'Цена', A: 70, fullMark: 100 },
      { subject: 'Логистика', A: 95, fullMark: 100 },
      { subject: 'Запасы', A: 80, fullMark: 100 },
    ]
  },
  {
    id: 'REP-2026-M05',
    title: 'Ежемесячный Лог: Май',
    date: '2026-05-15',
    type: 'Месячный',
    size: '1.8 MB',
    summary: 'Текущий лог склада показывает критическое снижение запасов по коробкам пиццы из-за задержек УпакТорг. Запущена экстренная закупка.',
    chartData: [
      { name: 'Нед 1', затраты: 120 },
      { name: 'Нед 2', затраты: 190 },
      { name: 'Нед 3', затраты: 140 },
      { name: 'Нед 4', затраты: 210 },
    ],
    radarData: [
      { subject: 'Скорость', A: 60, fullMark: 100 },
      { subject: 'Качество', A: 90, fullMark: 100 },
      { subject: 'Цена', A: 85, fullMark: 100 },
      { subject: 'Логистика', A: 65, fullMark: 100 },
      { subject: 'Запасы', A: 40, fullMark: 100 },
    ]
  },
  {
    id: 'REP-SAFE-2026',
    title: 'Аудит Безопасности Склада',
    date: '2026-05-10',
    type: 'Инспекция',
    size: '850 KB',
    summary: 'Проверка температурного режима для Сырной Долины пройдена успешно. Сбоев оборудования в грузовом отсеке не зафиксировано.',
    chartData: [
      { name: 'Сектор А', затраты: 98 },
      { name: 'Сектор Б', затраты: 100 },
      { name: 'Сектор В', затраты: 95 },
    ],
    radarData: [
      { subject: 'Скорость', A: 80, fullMark: 100 },
      { subject: 'Качество', A: 100, fullMark: 100 },
      { subject: 'Цена', A: 50, fullMark: 100 },
      { subject: 'Логистика', A: 80, fullMark: 100 },
      { subject: 'Запасы', A: 90, fullMark: 100 },
    ]
  }
];

export default function ReportsView({ searchTerm }) {
  const [selectedReport, setSelectedReport] = useState(mockReports[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Фильтрация отчетов по поисковой строке
  const filteredReports = mockReports.filter(r =>
    r.title.toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    r.id.toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  // Симуляция генерации нового отчета (Ретро-эффект)
  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      // Звук уведомления при завершении генерации
      playSound('alert');
      alert("СИСТЕМНЫЙ ОТЧЕТ СГЕНЕРИРОВАН И ЗАПИСАН В АРХИВ!");
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1.5fr] gap-4">
      
      {/* ЛЕВАЯ ПАНЕЛЬ: АРХИВ ОТЧЕТОВ */}
      <div className="pixel-panel border-2 border-[#3a2e4d] bg-[#0b0811]/65 p-3 flex flex-col">
        <div className="flex justify-between items-center mb-3 shrink-0">
          <div className="font-pixel-bold text-[10px] text-[#8b859e] uppercase">АРХИВ СИСТЕМНЫХ ДИСКЕТ</div>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="bg-purple text-white text-[9px] font-pixel-bold py-2 px-3 border-2 border-black shadow-[2px_2px_0_#000] hover:bg-purple-600 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? 'КОМПИЛЯЦИЯ...' : 'ГЕНЕРИРОВАТЬ ОТЧЕТ'}
          </motion.button>
        </div>

        {/* Сводный список отчетов */}
        <div className="flex flex-col gap-2 overflow-y-auto flex-grow pr-1">
          {filteredReports.map((report) => {
            const isSelected = selectedReport?.id === report.id;
            return (
              <motion.div
                key={report.id}
                whileHover={{ x: 4 }}
                onClick={() => setSelectedReport(report)}
                className={`pixel-panel p-3 border-2 cursor-pointer flex items-center justify-between transition-all ${
                  isSelected ? 'border-purple bg-purple/10' : 'border-[#3a2e4d] hover:bg-[#181124]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img 
                    src="/assets/свиток.png" 
                    className={`w-8 h-8 object-contain ${isSelected ? 'animate-bounce' : ''}`} 
                    style={{ imageRendering: 'pixelated' }} 
                    alt="disk" 
                  />
                  <div>
                    <h3 className="text-white font-bold text-xs uppercase">{report.title}</h3>
                    <div className="flex gap-2 text-[9px] text-[#8b859e] mt-1 font-mono">
                      <span>ID: <span className="text-orange-400">{report.id}</span></span>
                      <span>●</span>
                      <span>{report.date}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right font-mono text-[10px]">
                  <span className="bg-[#261d35] px-1.5 py-0.5 border border-black text-purple font-bold block">{report.type}</span>
                  <span className="text-[#8b859e] block mt-1 text-[9px]">{report.size}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ПРАВАЯ ПАНЕЛЬ: ЭКРАН СИМУЛЯЦИИ И ПРЕДПРОСМОТРА */}
      <div className="pixel-panel border-2 border-[#3a2e4d] bg-[#050307] flex flex-col relative">
        <div className="absolute inset-0 scanlines opacity-25 pointer-events-none z-40"></div>
        
        <AnimatePresence mode="wait">
          {selectedReport ? (
            <motion.div
              key={selectedReport.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-4 flex flex-col"
            >
              {/* Шапка монитора */}
              <div className="border-b-2 border-dashed border-[#3a2e4d] pb-2 mb-3">
                <span className="text-green font-pixel-bold text-[10px] tracking-widest block animate-pulse">
                  &gt; СИСТЕМА ИНСТРУМЕНТАЛЬНОГО ПРЕДПРОСМОТРА ЗАГРУЖЕНА
                </span>
                <h2 className="text-white font-pixel-bold text-sm uppercase mt-1 tracking-wide">{selectedReport.title}</h2>
              </div>

              {/* Текстовая сводка логов */}
              <div className="bg-[#0b0811] p-3 border border-[#261d35] font-mono text-xs text-[#4ade80] mb-4 relative overflow-hidden">
                {/* Эффект мерцания зеленого терминала */}
                <div className="absolute inset-0 bg-green/5 pointer-events-none"></div>
                <span className="text-white font-bold block mb-1 text-[10px] uppercase text-purple">// КРАТКОЕ СОДЕРЖАНИЕ ЛОГА:</span>
                <p className="leading-relaxed">{selectedReport.summary}</p>
              </div>

              {/* Сетка двух графиков Recharts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow min-h-[220px]">
                
                {/* График 1: Столбчатый (Финансы лога) */}
                <div className="bg-[#0b0811] border border-[#3a2e4d] p-3 flex flex-col h-full">
                  <span className="text-[#8b859e] font-pixel text-[8px] uppercase mb-2">Затраты по периодам (тыс ₽)</span>
                  <div className="flex-grow w-full h-full min-h-[140px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={selectedReport.chartData}>
                        <XAxis dataKey="name" stroke="#8b859e" fontSize={10} tickLine={false} />
                        <YAxis stroke="#8b859e" fontSize={10} tickLine={false} />
                        <Bar dataKey="затраты" fill="#a855f7" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* График 2: Радар (Эффективность метрик) */}
                <div className="bg-[#0b0811] border border-[#3a2e4d] p-3 flex flex-col h-full items-center">
                  <span className="text-[#8b859e] font-pixel text-[8px] uppercase mb-2 self-start">Радар Системного Баланса</span>
                  <div className="flex-grow w-full h-full min-h-[140px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" r="80%" data={selectedReport.radarData}>
                        <PolarGrid stroke="#3a2e4d" />
                        <PolarAngleAxis dataKey="subject" stroke="#8b859e" fontSize={9} />
                        <Radar name="Метрики" dataKey="A" stroke="#4ade80" fill="#4ade80" fillOpacity={0.2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Кнопка экспорта/выгрузки */}
              <div className="mt-4 pt-3 border-t-2 border-dashed border-[#3a2e4d] flex justify-end shrink-0">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="bg-green text-[#0b0811] text-[10px] font-pixel-bold py-2.5 px-5 border-2 border-black shadow-[2px_2px_0_#000] hover:bg-[#22c55e] cursor-pointer"
                >
                  ПЕЧАТЬ ЛОГА (PDF)
                </motion.button>
              </div>

            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-[#8b859e] font-pixel text-xs gap-2">
              <span className="animate-pulse">&gt; ОЖИДАНИЕ ВЫБОРА СИСТЕМНОЙ ДИСКЕТЫ</span>
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
