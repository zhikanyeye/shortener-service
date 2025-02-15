import { useEffect, useState } from 'react';

const backgrounds = [
  'https://images.unsplash.com/photo-1707345512638-997d31a10eaa',
  'https://images.unsplash.com/photo-1707350305489-7b65b0a6e486',
  'https://images.unsplash.com/photo-1707343844152-6c5274d1cba6'
];

export default function Wallpaper() {
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg(prev => (prev + 1) % backgrounds.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      {backgrounds.map((bg, index) => (
        <div
          key={bg}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            opacity: index === currentBg ? 1 : 0
          }}
        />
      ))}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
