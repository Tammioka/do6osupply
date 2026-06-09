// src/utils/cropImage.js

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    // crossOrigin закомментирован, чтобы не было конфликтов с Base64 файлами с компьютера
    // image.setAttribute('crossOrigin', 'anonymous'); 
    image.src = url;
  });

export async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  // Устанавливаем размер холста равный размеру области обрезки
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Рисуем часть оригинальной картинки на холсте
  ctx.drawImage(
    image,
    pixelCrop.x, 
    pixelCrop.y, 
    pixelCrop.width, 
    pixelCrop.height, 
    0, 
    0, 
    pixelCrop.width, 
    pixelCrop.height 
  );

  // ИСПРАВЛЕНИЕ: toDataURL отдает строку моментально, коллбэк (как был раньше) здесь не нужен!
  // Второй параметр 0.9 — это качество сжатия JPEG (90%), чтобы картинки были легкими.
  return canvas.toDataURL('image/jpeg', 0.9);
}