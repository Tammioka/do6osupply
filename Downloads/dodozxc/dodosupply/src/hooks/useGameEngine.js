import { useEffect, useRef } from 'react';

export function useGameEngine() {
  const canvasRef = useRef(null);
  const keysRef = useRef({ left: false, right: false, shoot: false, spin: false, canShoot: true });
  
  // Игровые объекты храним в рефах
  const stateRef = useRef({
    player: { x: 65, y: 110, w: 20, h: 12, speed: 3, angle: 0, spinFrames: 0, spinCooldown: 0 },
    bullets: [],
    enemies: [],
    score: 0
  });

  const handleControl = (action, state) => {
    keysRef.current[action] = state;
    if (action === 'shoot' && !state) keysRef.current.canShoot = true;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    
    let animationId;
    let spawnInterval; // Храним ID интервала для очистки

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'a' || key === 'arrowleft') keysRef.current.left = true;
      if (key === 'd' || key === 'arrowright') keysRef.current.right = true;
      if (key === 's' || key === 'arrowdown') keysRef.current.shoot = true;
      if (key === 'w' || key === 'arrowup') keysRef.current.spin = true;
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'a' || key === 'arrowleft') keysRef.current.left = false;
      if (key === 'd' || key === 'arrowright') keysRef.current.right = false;
      if (key === 'w' || key === 'arrowup') keysRef.current.spin = false;
      if (key === 's' || key === 'arrowdown') {
        keysRef.current.shoot = false;
        keysRef.current.canShoot = true;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // ФУНКЦИЯ СПАВНА ВРАГОВ (Этого куска не хватало)
    const spawnEnemy = () => {
      stateRef.current.enemies.push({
        x: Math.random() * (canvas.width - 12),
        y: -15, 
        w: 12, 
        h: 12, 
        speed: 1 + Math.random() 
      });
    };
    
    // Запускаем спавн каждые 1.2 секунды
    spawnInterval = setInterval(spawnEnemy, 1200);

    const gameLoop = () => {
      const state = stateRef.current;
      const keys = keysRef.current;

      // Очистка экрана
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Вращение (Гаджет Динамайка)
      if (state.player.spinCooldown > 0) state.player.spinCooldown--;
      if (keys.spin && state.player.spinCooldown <= 0 && state.player.spinFrames <= 0) {
        state.player.spinFrames = 40;
        state.player.spinCooldown = 180;
      }

      if (state.player.spinFrames > 0) {
        state.player.angle += 0.5;
        if (state.player.spinFrames % 4 === 0) {
          for (let i = 0; i < 4; i++) {
            let a = state.player.angle + (Math.PI / 2) * i;
            state.bullets.push({
              x: state.player.x + state.player.w / 2 - 2,
              y: state.player.y + state.player.h / 2 - 2,
              w: 4, h: 4,
              vx: Math.cos(a) * 4, vy: Math.sin(a) * 4,
              color: '#eab308'
            });
          }
        }
        state.player.spinFrames--;
      } else {
        state.player.angle = 0;
        if (keys.left && state.player.x > 0) state.player.x -= state.player.speed;
        if (keys.right && state.player.x < canvas.width - state.player.w) state.player.x += state.player.speed;

        if (keys.shoot && keys.canShoot) {
          state.bullets.push({ x: state.player.x + state.player.w / 2 - 2, y: state.player.y, w: 4, h: 8, vx: 0, vy: -4, color: '#4ade80' });
          keys.canShoot = false;
        }
      }

      // Обновление и отрисовка пуль
      for (let i = state.bullets.length - 1; i >= 0; i--) {
        let b = state.bullets[i];
        b.x += b.vx; b.y += b.vy;
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.w, b.h);
        if (b.y < 0 || b.y > canvas.height || b.x < 0 || b.x > canvas.width) state.bullets.splice(i, 1);
      }

      // Обновление и отрисовка ВРАГОВ
      ctx.fillStyle = '#ef4444'; 
      for (let i = state.enemies.length - 1; i >= 0; i--) {
        let e = state.enemies[i];
        e.y += e.speed;
        ctx.fillRect(e.x, e.y, e.w, e.h);
        
        // Столкновения пуль с врагами
        for (let j = state.bullets.length - 1; j >= 0; j--) {
          let b = state.bullets[j];
          if (b.x < e.x + e.w && b.x + b.w > e.x && b.y < e.y + e.h && b.h + b.y > e.y) {
            state.enemies.splice(i, 1);
            state.bullets.splice(j, 1);
            state.score += 10; // Начисляем очки
            break;
          }
        }
        // Удаляем врага, если он улетел за экран
        if (e.y > canvas.height) state.enemies.splice(i, 1); 
      }

      // Отрисовка игрока
      ctx.fillStyle = '#a855f7';
      ctx.save();
      ctx.translate(state.player.x + state.player.w / 2, state.player.y + state.player.h / 2);
      ctx.rotate(state.player.angle);
      ctx.fillRect(-state.player.w / 2, -state.player.h / 2, state.player.w, state.player.h);
      ctx.fillRect(8 - state.player.w / 2, -6 - state.player.h / 2, 4, 6);
      ctx.restore();

      // Отрисовка счета
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px "Courier New", monospace';
      ctx.fillText(`СЧЕТ: ${state.score}`, 5, 14);

      animationId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    // Очистка при размонтировании
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(spawnInterval);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return { canvasRef, handleControl };
}