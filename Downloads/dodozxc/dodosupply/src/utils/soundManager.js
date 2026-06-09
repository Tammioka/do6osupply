import clickSrc from '../assets/sounds/click.mp3';
import addSrc from '../assets/sounds/add.mp3';
import deleteSrc from '../assets/sounds/delete.mp3';
import alertSrc from '../assets/sounds/alert.mp3';

export const SoundConfig = {
  enabled: true,
  volume: 0.5
};

const sounds = {
  click: new Audio(clickSrc),
  add: new Audio(addSrc),
  delete: new Audio(deleteSrc),
  alert: new Audio(alertSrc),
};

export const playSound = (type) => {
  if (!SoundConfig.enabled) return;
  
  const audio = sounds[type];
  if (audio) {
    audio.volume = SoundConfig.volume;
    audio.currentTime = 0; 
    audio.play().catch(e => console.log("Звук заблокирован браузером до первого клика", e));
  }
};