// src/components/suppliers/SupplierCard.jsx
import { motion } from 'framer-motion';

export default function SupplierCard({ supplier, onOpenDetails }) {
  const statusColor = supplier.status === 'Активен' ? 'bg-green text-[#0b0811]' : 
                      supplier.status === 'Проблема' ? 'bg-red text-white' : 'bg-yellow text-[#0b0811]';

  return (
    <div 
      onClick={() => onOpenDetails(supplier)}
      className="group relative bg-panel border-2 border-[#3a2e4d] flex flex-col rounded-sm overflow-hidden transition-all duration-300 hover:border-purple hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] cursor-pointer h-full"
    >
      {/* 1. БЛОК ФОТО */}
      <div className="relative w-full h-36 bg-black overflow-hidden shrink-0">
        <img 
          src={supplier.image || '/assets/фон.png'} 
          alt={supplier.name} 
          className="w-full h-full object-cover grayscale-[40%] transition-transform duration-700 ease-out group-hover:scale-110 group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-purple/30 mix-blend-color z-10 transition-opacity duration-500 group-hover:opacity-0"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0811] via-[#0b0811]/40 to-transparent z-10"></div>

        <div className={`absolute top-2 right-2 px-2 py-0.5 text-[8px] font-pixel-bold border border-black shadow-[1px_1px_0_#000] ${statusColor} z-20 uppercase`}>
          {supplier.status || 'Активен'}
        </div>
      </div>

      {/* 2. ИНФОРМАЦИЯ О ПОСТАВЩИКЕ */}
      <div className="p-3 flex flex-col gap-2 relative z-20 bg-panel flex-grow">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-white font-pixel-bold text-xs leading-tight line-clamp-2">{supplier.name}</h3>
          <div className="text-yellow text-xs font-pixel-bold drop-shadow-[1px_1px_0_#000] whitespace-nowrap">
            ★ {supplier.rating || '0.0'}
          </div>
        </div>
        
        <span className="text-[#8b859e] text-[10px] font-bold tracking-wider uppercase">
          {supplier.category}
        </span>

        <div className="flex flex-col gap-1 text-[10px] text-[#d1ced9] mt-2 font-mono">
          <div className="flex items-center gap-2"><span className="text-purple">☎</span> {supplier.phone || 'Нет телефона'}</div>
          <div className="flex items-center gap-2"><span className="text-green">@</span> {supplier.email || 'Нет email'}</div>
        </div>
      </div>

      {/* 3. КНОПКИ ДЕЙСТВИЙ */}
      <div className="px-3 pb-3 flex gap-2 mt-auto relative z-20 bg-panel shrink-0">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation(); // Исключаем двойной клик (по карточке и по кнопке)
            onOpenDetails(supplier);
          }}
          className="flex-1 bg-[#261d35] group-hover:bg-purple text-[#8b859e] group-hover:text-white text-[9px] font-pixel-bold py-2.5 border-2 border-black shadow-[inset_1px_1px_0_rgba(255,255,255,0.1),_2px_2px_0_#000] transition-colors duration-300 cursor-pointer"
        >
          УПРАВЛЕНИЕ И ПРАЙС
        </motion.button>
      </div>
    </div>
  );
}