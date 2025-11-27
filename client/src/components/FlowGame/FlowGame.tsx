'use client';

import React, { useState } from 'react';

const FlowerBouquetBuilder = () => {
  const [bouquet, setBouquet] = useState([]);
  const [draggedFlower, setDraggedFlower] = useState(null);

  const availableFlowers = [
    { id: 'rose', name: 'Роза', emoji: '🌹', color: 'text-red-500' },
    { id: 'tulip', name: 'Тюльпан', emoji: '🌷', color: 'text-pink-500' },
    { id: 'sunflower', name: 'Подсолнух', emoji: '🌻', color: 'text-yellow-500' },
    { id: 'hibiscus', name: 'Гибискус', emoji: '🌺', color: 'text-pink-600' },
    { id: 'blossom', name: 'Цветок', emoji: '🌸', color: 'text-pink-300' },
    { id: 'daisy', name: 'Ромашка', emoji: '🌼', color: 'text-yellow-300' },
  ];

  const handleDragStart = (flower) => {
    setDraggedFlower(flower);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const getFlowerPosition = (bouquetLength) => {
    const centerX = 50;
    const centerY = 60;

    const layer = bouquetLength;
    const maxRadius = 10 + layer * 2;
    const radius = Math.random() * maxRadius;
    const angle = Math.random() * 2 * Math.PI;

    const rotation = Math.random() * 30 - 15;

    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      rotation,
    };
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedFlower) {
      const { x, y, rotation } = getFlowerPosition(bouquet.length);
      const newFlower = {
        ...draggedFlower,
        uniqueId: Date.now() + Math.random(),
        x,
        y,
        rotation,
      };
      setBouquet([...bouquet, newFlower]);
      setDraggedFlower(null);
    }
  };

  const removeFlower = (uniqueId) => {
    setBouquet(bouquet.filter((f) => f.uniqueId !== uniqueId));
  };

  const clearBouquet = () => {
    setBouquet([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          🌸 Конструктор букетов 🌸
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Перетаскивайте цветы в вазу, чтобы создать свой уникальный букет
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Палитра цветов */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Доступные цветы</h2>
              <div className="grid grid-cols-2 gap-4">
                {availableFlowers.map((flower) => (
                  <div
                    key={flower.id}
                    draggable
                    onDragStart={() => handleDragStart(flower)}
                    className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-4 cursor-move hover:shadow-lg hover:scale-105 transition-all duration-200 active:scale-95">
                    <div className="text-5xl mb-2 text-center">{flower.emoji}</div>
                    <div className={`text-sm font-medium text-center ${flower.color}`}>
                      {flower.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ваза для букета */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-700">
                  Ваш букет ({bouquet.length}{' '}
                  {bouquet.length === 1 ? 'цветок' : bouquet.length < 5 ? 'цветка' : 'цветков'})
                </h2>
                {bouquet.length > 0 && (
                  <button
                    onClick={clearBouquet}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    Очистить
                  </button>
                )}
              </div>

              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="relative h-96 bg-gradient-to-b from-blue-50 to-green-100 rounded-xl border-4 border-dashed border-gray-300 overflow-hidden">
                {bouquet.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg">
                    Перетащите сюда цветы для создания букета
                  </div>
                ) : (
                  bouquet.map((flower) => (
                    <div
                      key={flower.uniqueId}
                      onClick={() => removeFlower(flower.uniqueId)}
                      style={{
                        position: 'absolute',
                        left: `${flower.x}%`,
                        top: `${flower.y}%`,
                        transform: `rotate(${flower.rotation}deg)`,
                        cursor: 'pointer',
                      }}
                      className="text-6xl hover:scale-110 transition-transform duration-200 animate-fade-in"
                      title="Нажмите, чтобы удалить">
                      {flower.emoji}
                    </div>
                  ))
                )}

                {/* Ваза */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                  <div
                    className="w-48 h-32 bg-gradient-to-b from-blue-400 to-blue-600 opacity-30"
                    style={{
                      clipPath: 'polygon(30% 0%, 70% 0%, 85% 100%, 15% 100%)',
                    }}></div>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-500 text-center">
                💡 Совет: Нажмите на цветок в букете, чтобы удалить его
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.5) rotate(0deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(var(--rotation));
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FlowerBouquetBuilder;
