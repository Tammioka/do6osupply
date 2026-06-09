import { motion } from 'framer-motion';

export default function StatCard({ title, value, icon }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
      className="pixel-panel flex items-center gap-3 p-3 cursor-pointer"
    >
      <img src={icon} alt={title} className="w-8 h-8" style={{ imageRendering: 'pixelated' }} />
      <div>
        <h3 className="text-[10px] text-[#8b859e] leading-tight mb-1 uppercase">{title}</h3>
        <div className="text-xl font-pixel-bold text-green">{value}</div>
      </div>
    </motion.div>
  );
}