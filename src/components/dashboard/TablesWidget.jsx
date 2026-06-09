import { useMemo, useState } from 'react';
import { playSound } from '../../utils/soundManager';

const stockRows = [
  { id: 1, item: 'Коробки 30 см', icon: '/assets/пицца.png', balance: 25, daily: 10, status: 'Критично', color: '#ef4444' },
  { id: 2, item: 'Напитки 0.5 л', icon: '/assets/кола.png', balance: 15, daily: 12, status: 'Внимание', color: '#eab308' },
  { id: 3, item: 'Мука', icon: '/assets/мука.png', balance: 125, daily: 16, status: 'Норма', color: '#4ade80' },
  { id: 4, item: 'Овощная смесь', icon: '/assets/овощи.png', balance: 44, daily: 18, status: 'Норма', color: '#4ade80' },
];

const deliveries = [
  { id: 1, date: '06.06', supplier: 'АгроКом', category: 'Мука', done: false },
  { id: 2, date: '07.06', supplier: 'УпакТорг', category: 'Упаковка', done: false },
  { id: 3, date: '08.06', supplier: 'Fresh Line', category: 'Овощи', done: true },
];

export default function TablesWidget() {
  const [selectedId, setSelectedId] = useState(stockRows[0].id);
  const [deliveryRows, setDeliveryRows] = useState(deliveries);
  const selected = useMemo(() => stockRows.find((row) => row.id === selectedId), [selectedId]);

  const toggleDelivery = (id) => {
    playSound('click');
    setDeliveryRows((rows) => rows.map((row) => (row.id === id ? { ...row, done: !row.done } : row)));
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-4">
      <div className="pixel-panel p-4 border-2 border-[#3a2e4d] overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-[10px] text-white uppercase tracking-wide font-pixel-bold">Критичные позиции склада</h2>
          <span className="text-[10px] text-[#8b859e]">Выбрано: {selected.item}</span>
        </div>
        <table className="w-full min-w-[520px] text-sm text-left border-collapse">
          <thead className="text-[#8b859e] border-b-2 border-[#3a2e4d]">
            <tr>
              <th className="pb-2 font-normal">Товар</th>
              <th className="pb-2 font-normal">Остаток</th>
              <th className="pb-2 font-normal">Расход/день</th>
              <th className="pb-2 font-normal">Статус</th>
            </tr>
          </thead>
          <tbody>
            {stockRows.map((row) => (
              <tr
                key={row.id}
                onClick={() => {
                  playSound('click');
                  setSelectedId(row.id);
                }}
                className={`cursor-pointer border-b border-[#3a2e4d] hover:bg-white/5 ${selectedId === row.id ? 'bg-purple/10' : ''}`}
              >
                <td className="py-2 flex items-center gap-2">
                  <img src={row.icon} className="w-5 h-5 object-contain" style={{ imageRendering: 'pixelated' }} alt="" />
                  {row.item}
                </td>
                <td className="py-2 text-white">{row.balance}</td>
                <td className="py-2">{row.daily}</td>
                <td className="py-2 font-bold" style={{ color: row.color }}>
                  <span className="inline-block w-2.5 h-2.5 mr-1.5 shadow-[1px_1px_0_#000]" style={{ backgroundColor: row.color }} />
                  {row.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pixel-panel p-4 border-2 border-[#3a2e4d]">
        <h2 className="font-bold text-[10px] text-white mb-4 uppercase tracking-wide font-pixel-bold">График поставок</h2>
        <div className="flex flex-col gap-2">
          {deliveryRows.map((row) => (
            <button
              key={row.id}
              onClick={() => toggleDelivery(row.id)}
              className="grid grid-cols-[56px_1fr_auto] items-center gap-2 text-left bg-[#0b0811] border border-[#3a2e4d] p-2 hover:border-purple"
            >
              <span className="text-green font-bold">{row.date}</span>
              <span>
                <span className="block text-white text-sm">{row.supplier}</span>
                <span className="block text-[#8b859e] text-[10px]">{row.category}</span>
              </span>
              <span className={`text-[9px] font-pixel-bold px-2 py-1 border ${row.done ? 'text-green border-green/40' : 'text-yellow border-yellow/40'}`}>
                {row.done ? 'OK' : 'ЖДЕМ'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
