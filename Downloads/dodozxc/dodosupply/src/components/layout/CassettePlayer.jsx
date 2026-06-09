// src/components/layout/CassettePlayer.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../../utils/soundManager';

const rawAudioFiles = import.meta.glob('/src/assets/music/**/*.{mp3,wav,ogg}', { eager: true, query: '?url', import: 'default' });

const generatePlaylists = () => {
  const playlists = {};
  const allTracks = [];
  for (const path in rawAudioFiles) {
    const fileUrl = rawAudioFiles[path];
    const parts = path.split('/');
    const rawFileName = parts.pop(); 
    const folderName = parts.pop().toUpperCase(); 
    let cleanName = decodeURIComponent(rawFileName).replace(/\.(mp3|wav|ogg)$/i, '').replace(/_/g, ' ').replace(/([a-zа-я0-9])-([a-zа-я0-9])/ig, '$1 - $2'); 
    if (!playlists[folderName]) playlists[folderName] = [];
    const trackObj = { name: cleanName, url: fileUrl, originPlaylist: folderName };
    playlists[folderName].push(trackObj);
    allTracks.push(trackObj);
  }
  if (allTracks.length > 0) return { 'ALL MUSIC': allTracks, ...playlists };
  return playlists;
};

const DYNAMIC_PLAYLISTS = generatePlaylists();
if (Object.keys(DYNAMIC_PLAYLISTS).length === 0) DYNAMIC_PLAYLISTS['NO MUSIC'] = [{ name: 'PLEASE ADD MP3 FILES', url: '', originPlaylist: 'NONE' }];

// ДОБАВИЛИ ПРОПСЫ ДЛЯ МОБИЛЬНОГО МЕНЮ
export default function CassettePlayer({ isMobileMusicOpen, setIsMobileMusicOpen }) {
  const playlistNames = Object.keys(DYNAMIC_PLAYLISTS);
  const [currentPlaylistIdx, setCurrentPlaylistIdx] = useState(0);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2); 
  const [showVolume, setShowVolume] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  const audioRef = useRef(null);
  const activePlaylistName = playlistNames[currentPlaylistIdx];
  const tracksList = DYNAMIC_PLAYLISTS[activePlaylistName] || [];
  const activeTrack = tracksList[currentTrackIdx];

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);
  useEffect(() => {
    if (audioRef.current && activeTrack?.url) {
      audioRef.current.load();
      if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIdx, currentPlaylistIdx, activeTrack]);

  const togglePlay = () => {
    if (!activeTrack?.url) return alert("Музыкальные файлы не найдены!");
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); } 
    else { audioRef.current.play().catch(() => alert("Ошибка файла!")); setIsPlaying(true); }
  };

  const nextTrack = () => {
    if (tracksList.length === 0) return;
    if (isShuffle) setCurrentTrackIdx(Math.floor(Math.random() * tracksList.length));
    else {
      if (currentTrackIdx < tracksList.length - 1) setCurrentTrackIdx(prev => prev + 1);
      else { setCurrentPlaylistIdx((currentPlaylistIdx + 1) % playlistNames.length); setCurrentTrackIdx(0); }
    }
  };

  const prevTrack = () => {
    if (tracksList.length === 0) return;
    if (isShuffle) setCurrentTrackIdx(Math.floor(Math.random() * tracksList.length));
    else setCurrentTrackIdx((prev) => (prev - 1 + tracksList.length) % tracksList.length);
  };

  const cyclePlaylist = () => { setCurrentPlaylistIdx((prev) => (prev + 1) % playlistNames.length); setCurrentTrackIdx(0); };

return (
    <div 
      className={`
        select-none transition-all z-[9999]
        /* ПК ВЕРСИЯ: Идеально встает в левый нижний угол (внутрь визуального сайдбара) */
        md:fixed md:bottom-[1.5rem] md:left-[1.5rem] md:w-[208px] md:block md:bg-transparent
        /* МОБИЛЬНАЯ ВЕРСИЯ: Полноэкранный оверлей */
        ${isMobileMusicOpen ? 'fixed inset-0 bg-black/95 flex flex-col items-center justify-center p-6' : 'hidden'}
      `}
    >
      <div className="md:hidden absolute top-6 right-6">
        <button onClick={() => { playSound('click'); setIsMobileMusicOpen(false); }} className="text-white font-pixel-bold border-2 border-white p-2 active:bg-white active:text-black transition-colors">
          [X] ЗАКРЫТЬ
        </button>
      </div>

      <audio ref={audioRef} src={activeTrack?.url} onEnded={nextTrack} />

      {/* КАССЕТА */}
      <div className="w-full max-w-[320px] bg-[#231931] border-4 border-black p-2 flex flex-col gap-2 shadow-[0_4px_0_#0b0510] relative rounded-sm mx-auto">
        <div onClick={cyclePlaylist} className="bg-[#facc15] text-black border-2 border-black font-pixel-bold text-[7px] py-1 px-0.5 text-center cursor-pointer uppercase tracking-wider hover:bg-yellow-300 shadow-[inset_-2px_-2px_0_#ca8a04] truncate">
          {activePlaylistName} ↻
        </div>
        <div className="bg-[#0b0811] text-green border border-[#3a2e4d] p-1 text-[8px] text-center font-mono truncate uppercase tracking-tight h-5 flex items-center justify-center">
          {isPlaying ? '▶ ' : '⏸ '} {activeTrack?.name || 'ПУСТО'}
        </div>
        <div className="bg-[#0b0811] h-8 border-2 border-[#3a2e4d] rounded-sm mx-2 flex items-center justify-around relative overflow-hidden shrink-0">
          <div className="absolute inset-0 scanlines opacity-20 pointer-events-none"></div>
          <div className="w-5 h-5 rounded-full border border-dashed border-[#8b859e] flex items-center justify-center relative"><motion.div animate={isPlaying ? { rotate: 360 } : {}} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="w-3 h-3 bg-gray-600 rounded-full flex items-center justify-center"><div className="w-full h-0.5 bg-black absolute"></div><div className="w-0.5 h-full bg-black absolute"></div></motion.div></div>
          <div className="text-[6px] text-[#3a2e4d] font-mono tracking-tighter truncate max-w-[40px] text-center">{activeTrack?.originPlaylist !== 'NONE' ? activeTrack?.originPlaylist : 'TAPE'}</div>
          <div className="w-5 h-5 rounded-full border border-dashed border-[#8b859e] flex items-center justify-center relative"><motion.div animate={isPlaying ? { rotate: 360 } : {}} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="w-3 h-3 bg-gray-600 rounded-full flex items-center justify-center"><div className="w-full h-0.5 bg-black absolute"></div><div className="w-0.5 h-full bg-black absolute"></div></motion.div></div>
        </div>
        <div className="flex justify-between items-center gap-1 mt-0.5">
          <button type="button" onClick={prevTrack} className="bg-[#181124] text-white border-2 border-black text-[8px] p-1 font-pixel-bold shadow-[1px_1px_0_#000] active:translate-y-0.5 active:shadow-none cursor-pointer">&lt;</button>
          <button type="button" onClick={togglePlay} className={`flex-1 border-2 border-black text-[8px] py-1 font-pixel-bold shadow-[1px_1px_0_#000] active:translate-y-0.5 active:shadow-none cursor-pointer ${isPlaying ? 'bg-red text-white' : 'bg-green text-[#0b0811]'}`}>{isPlaying ? 'STOP' : 'PLAY'}</button>
          <button type="button" onClick={nextTrack} className="bg-[#181124] text-white border-2 border-black text-[8px] p-1 font-pixel-bold shadow-[1px_1px_0_#000] active:translate-y-0.5 active:shadow-none cursor-pointer">&gt;</button>
          <button type="button" onClick={() => setIsShuffle(!isShuffle)} className={`border-2 border-black text-[8px] px-1 py-1 font-bold shadow-[1px_1px_0_#000] active:translate-y-0.5 active:shadow-none cursor-pointer transition-colors ${isShuffle ? 'bg-purple text-white' : 'bg-[#261d35] text-[#8b859e]'}`}>🔀</button>
          <div className="relative">
            <button type="button" onClick={() => setShowVolume(!showVolume)} className="bg-[#261d35] text-purple border-2 border-black text-[8px] px-1 py-1 font-bold shadow-[1px_1px_0_#000] cursor-pointer">🔊</button>
            <AnimatePresence>
              {showVolume && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute bottom-8 right-0 md:-right-4 md:left-auto bg-panel border-2 border-black p-4 md:p-2 z-50 w-32 md:w-24 flex items-center shadow-[4px_4px_0_#000]">
                  <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-full accent-purple cursor-pointer h-2 md:h-1" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}