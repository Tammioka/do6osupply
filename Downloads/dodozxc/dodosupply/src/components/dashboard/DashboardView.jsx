import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { playSound } from '../../utils/soundManager';
import ChartsWidget from './ChartsWidget';
import TablesWidget from './TablesWidget';

const stats = [
  { id: 'orders', title: 'Активные заказы', value: 161, suffix: '', icon: '/assets/мешок.png', detail: '34 поставки прибудут сегодня до 18:00.' },
  { id: 'late', title: 'Просрочка', value: 19, suffix: '', icon: '/assets/флаг.png', detail: '7 позиций требуют ручного подтверждения.' },
  { id: 'stock', title: 'Критичный запас', value: 3, suffix: '', icon: '/assets/сундук.png', detail: 'Коробки, сыр и соусы ниже страхового остатка.' },
  { id: 'reliability', title: 'Надежность', value: 90, suffix: '%', icon: '/assets/медаль.png', detail: 'Показатель вырос на 4% после переноса маршрутов.' },
];

const initialTasks = [
  { id: 1, text: 'Подтвердить поставку муки от АгроКом', done: false },
  { id: 2, text: 'Проверить температуру сырного склада', done: true },
  { id: 3, text: 'Согласовать срочную закупку коробок', done: false },
];

export default function DashboardView() {
  const [selectedStat, setSelectedStat] = useState(stats[0]);
  const [tasks, setTasks] = useState(initialTasks);
  const [priority, setPriority] = useState('Сегодня');

  const completed = useMemo(() => tasks.filter((task) => task.done).length, [tasks]);

  const toggleTask = (id) => {
    playSound('click');
    setTasks((items) => items.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4 pb-4">
      <section className="pixel-panel p-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4">
          <div>
            <p className="font-pixel-bold text-[10px] text-[#8b859e] uppercase">Operations center</p>
            <h2 className="font-pixel-bold text-sm text-white uppercase mt-1">Сводка поставок</h2>
          </div>
          <div className="flex gap-2">
            {['Сегодня', 'Неделя', 'Месяц'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  playSound('click');
                  setPriority(item);
                }}
                className={`px-3 py-2 border-2 border-black text-[9px] font-pixel-bold shadow-[2px_2px_0_#000] ${
                  priority === item ? 'bg-green text-[#0b0811]' : 'bg-[#261d35] text-white hover:bg-[#3a2e4d]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {stats.map((stat) => (
            <motion.button
              key={stat.id}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                playSound('click');
                setSelectedStat(stat);
              }}
              className={`pixel-panel text-left flex items-center gap-3 p-3 cursor-pointer border-2 ${
                selectedStat.id === stat.id ? 'border-green bg-green/10' : 'border-transparent'
              }`}
            >
              <img src={stat.icon} alt="" className="w-8 h-8 shrink-0" style={{ imageRendering: 'pixelated' }} />
              <span className="min-w-0">
                <span className="block text-[10px] text-[#8b859e] leading-tight mb-1 uppercase">{stat.title}</span>
                <span className="block text-xl font-pixel-bold text-green">{stat.value}{stat.suffix}</span>
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="pixel-panel p-4 border-2 border-[#3a2e4d]">
          <div className="flex items-start gap-3">
            <img src={selectedStat.icon} alt="" className="w-10 h-10" style={{ imageRendering: 'pixelated' }} />
            <div>
              <p className="font-pixel-bold text-[10px] uppercase text-purple">Выбранный показатель</p>
              <h3 className="text-white text-lg font-bold">{selectedStat.title}: {selectedStat.value}{selectedStat.suffix}</h3>
              <p className="text-sm text-[#d1ced9] mt-1">{selectedStat.detail}</p>
            </div>
          </div>
        </div>

        <div className="pixel-panel p-4 border-2 border-[#3a2e4d]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-pixel-bold text-[10px] text-white uppercase">Задачи смены</h3>
            <span className="text-green font-pixel-bold text-[10px]">{completed}/{tasks.length}</span>
          </div>
          <div className="flex flex-col gap-2">
            {tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className="flex items-center gap-2 text-left bg-[#0b0811] border border-[#3a2e4d] p-2 hover:border-purple"
              >
                <span className={`w-4 h-4 border-2 border-black shadow-[1px_1px_0_#000] ${task.done ? 'bg-green' : 'bg-[#261d35]'}`} />
                <span className={`text-xs ${task.done ? 'line-through text-[#8b859e]' : 'text-white'}`}>{task.text}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <ChartsWidget period={priority} />
      <TablesWidget />
    </motion.div>
  );
}
