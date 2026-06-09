// src/components/SmoothScroll.jsx
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export default function SmoothScroll({ children }) {
  useEffect(() => {
    // Инициализируем плавный скролл глобально на всё окно браузера
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Автоматически пересчитываем высоту страницы при переключении вкладок
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
    });
    resizeObserver.observe(document.body);

    return () => {
      resizeObserver.disconnect();
      lenis.destroy();
    };
  }, []);

  // Возвращаем чистый контент без промежуточных div-оберток во избежание дублирования полос прокрутки
  return <>{children}</>;
}