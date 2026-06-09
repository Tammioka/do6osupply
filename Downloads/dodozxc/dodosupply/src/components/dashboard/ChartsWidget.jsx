import { useState } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { playSound } from '../../utils/soundManager';

const trendData = {
  Сегодня: [
    { day: '08:00', orders: 18, deliveries: 9 },
    { day: '11:00', orders: 44, deliveries: 22 },
    { day: '14:00', orders: 73, deliveries: 41 },
    { day: '17:00', orders: 101, deliveries: 66 },
  ],
  Неделя: [
    { day: 'Пн', orders: 65, deliveries: 28 },
    { day: 'Вт', orders: 59, deliveries: 48 },
    { day: 'Ср', orders: 80, deliveries: 40 },
    { day: 'Чт', orders: 81, deliveries: 51 },
    { day: 'Пт', orders: 96, deliveries: 86 },
    { day: 'Сб', orders: 75, deliveries: 57 },
    { day: 'Вс', orders: 60, deliveries: 50 },
  ],
  Месяц: [
    { day: '1 нед', orders: 310, deliveries: 260 },
    { day: '2 нед', orders: 365, deliveries: 314 },
    { day: '3 нед', orders: 342, deliveries: 301 },
    { day: '4 нед', orders: 398, deliveries: 352 },
  ],
};

const pieData = [
  { name: 'Тесто', value: 45, color: '#4ade80' },
  { name: 'Напитки', value: 25, color: '#a855f7' },
  { name: 'Овощи', value: 20, color: '#0ea5e9' },
  { name: 'Соусы', value: 10, color: '#eab308' },
];

export default function ChartsWidget({ period = 'Сегодня' }) {
  const [activeSlice, setActiveSlice] = useState(pieData[0]);
  const data = trendData[period] || trendData.Сегодня;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.4fr] gap-4">
      <div className="pixel-panel p-4 flex flex-col h-[260px] min-w-0 border-2 border-[#3a2e4d]">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-[10px] text-white uppercase tracking-wide font-pixel-bold">Структура расходов</h2>
            <p className="text-[10px] text-[#8b859e] mt-1">{activeSlice.name}: {activeSlice.value}% бюджета</p>
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} innerRadius={42} outerRadius={76} dataKey="value" stroke="none">
                {pieData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    onClick={() => {
                      playSound('click');
                      setActiveSlice(entry);
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#181124', border: '2px solid #3a2e4d', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="pixel-panel p-4 flex flex-col h-[260px] min-w-0 border-2 border-[#3a2e4d]">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-[10px] text-white uppercase tracking-wide font-pixel-bold">Тренды поставок</h2>
            <p className="text-[10px] text-[#8b859e] mt-1">Период: {period}</p>
          </div>
          <div className="flex gap-3 text-[10px]">
            <span className="text-green">Заказы</span>
            <span className="text-purple">Доставки</span>
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="day" stroke="#8b859e" fontSize={10} tickLine={false} />
              <YAxis stroke="#8b859e" fontSize={10} tickLine={false} />
              <Line type="step" dataKey="orders" stroke="#4ade80" strokeWidth={3} dot={{ r: 3, fill: '#4ade80', stroke: '#000' }} />
              <Line type="step" dataKey="deliveries" stroke="#a855f7" strokeWidth={3} dot={{ r: 3, fill: '#a855f7', stroke: '#000' }} />
              <Tooltip contentStyle={{ backgroundColor: '#181124', border: '2px solid #3a2e4d', color: '#d1ced9' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
