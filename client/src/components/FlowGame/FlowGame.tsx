'use client';

import React, { ReactNode, useState, useRef } from 'react';
import { IoIosRose } from 'react-icons/io';
import { PiFlowerTulip } from 'react-icons/pi';
import { GiSunflower, GiTrefoilLily } from 'react-icons/gi';
import { TbFlower } from 'react-icons/tb';
import { RotateCw } from 'lucide-react';

type Flower = {
  id: string;
  name: string;
  image: string;
  color: string;
  icon: ReactNode;
  uniqueId?: number;
  x?: number;
  y?: number;
  rotation?: number;
};

const SLOT_COUNT = 30;

const FlowerBouquetBuilder = () => {
  const [bouquet, setBouquet] = useState<Flower[]>([]);
  const [selectedFlower, setSelectedFlower] = useState<Flower | null>(null);
  const [currentRotation, setCurrentRotation] = useState<number>(0);
  const [activeSlotId, setActiveSlotId] = useState<number | null>(null);
  const [previewPosition, setPreviewPosition] = useState<{ x: number; y: number } | null>(null);

  const bouquetZoneRef = useRef<HTMLDivElement>(null);

  const COLS = 50;

  const [slots] = useState(
    Array.from({ length: SLOT_COUNT }, (_, i) => ({
      id: i,
      x: (i % COLS) * 1 + 35,
      y: Math.floor(i / COLS) * 0 + 60,
    })),
  );

  const availableFlowers: Flower[] = [
    {
      id: 'rose',
      name: 'Роза',
      image: '/img/flow/rose1.png',
      color: 'text-red-500',
      icon: <IoIosRose size={30} />,
    },
    {
      id: 'tulip',
      name: 'Тюльпан',
      image: '/img/flow/tulip.png',
      color: 'text-pink-500',
      icon: <PiFlowerTulip size={30} />,
    },
    {
      id: 'sunflower',
      name: 'Подсолнух',
      image: '/img/flow/sunflow.png',
      color: 'text-yellow-500',
      icon: <GiSunflower size={30} />,
    },
    {
      id: 'lily',
      name: 'Лилия',
      image: '/img/flow/lily.png',
      color: 'text-pink-600',
      icon: <GiTrefoilLily size={30} />,
    },
    {
      id: 'daisy',
      name: 'Ромашка',
      image: '/img/flow/romash.png',
      color: 'text-pink-300',
      icon: <TbFlower size={30} />,
    },
  ];

  const handleFlowerSelect = (flower: Flower) => {
    setSelectedFlower(flower);
    setCurrentRotation(0); // Сбрасываем угол при выборе нового цветка
  };

  const handleDragStart = (e: React.DragEvent, flower: Flower) => {
    if (!selectedFlower) return;

    // Создаем копию выбранного цветка с текущим углом поворота
    const flowerToDrag = {
      ...selectedFlower,
      rotation: currentRotation,
    };

    e.dataTransfer.setData('application/json', JSON.stringify(flowerToDrag));
  };

  const handleDragOverZone = (e: React.DragEvent) => {
    e.preventDefault();
    if (!bouquetZoneRef.current || !selectedFlower) return;

    const rect = bouquetZoneRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
    const mouseY = ((e.clientY - rect.top) / rect.height) * 100;

    let nearestSlotId: number | null = null;
    let minDist = Infinity;

    for (const slot of slots) {
      const isBusy = bouquet.some((flower) => flower.x === slot.x && flower.y === slot.y);

      if (isBusy) continue;

      const dx = slot.x - mouseX;
      const dy = slot.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < minDist) {
        minDist = dist;
        nearestSlotId = slot.id;
      }
    }

    setActiveSlotId(nearestSlotId);

    if (nearestSlotId !== null) {
      setPreviewPosition({
        x: slots[nearestSlotId].x,
        y: slots[nearestSlotId].y,
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    if (!selectedFlower || activeSlotId === null) return;

    const slot = slots[activeSlotId];

    const isBusy = bouquet.some((flower) => flower.x === slot.x && flower.y === slot.y);

    if (isBusy) return;

    const newFlower: Flower = {
      ...selectedFlower,
      uniqueId: Date.now() + Math.random(),
      x: slot.x,
      y: slot.y,
      rotation: currentRotation,
    };

    setBouquet([...bouquet, newFlower]);
    setActiveSlotId(null);
    setPreviewPosition(null);
    // Не сбрасываем selectedFlower и currentRotation, чтобы можно было добавлять несколько одинаковых цветков
  };

  const removeFlower = (uniqueId: number) => {
    setBouquet(bouquet.filter((f) => f.uniqueId !== uniqueId));
  };

  const clearBouquet = () => {
    setBouquet([]);
  };

  const handleRotateLeft = () => {
    setCurrentRotation((prev) => {
      let newRotation = prev - 15;
      while (newRotation < -180) newRotation += 360;
      return newRotation;
    });
  };

  const handleRotateRight = () => {
    setCurrentRotation((prev) => {
      let newRotation = prev + 15;
      while (newRotation > 180) newRotation -= 360;
      return newRotation;
    });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentRotation(parseInt(e.target.value));
  };

  const resetSelection = () => {
    setSelectedFlower(null);
    setCurrentRotation(0);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #fce7f3, #ddd6fe)',
        padding: '2rem',
      }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '0.5rem',
            color: '#831843',
          }}>
          🌸 Конструктор букетов 🌸
        </h1>
        <p
          style={{
            textAlign: 'center',
            color: '#9333ea',
            marginBottom: '2rem',
          }}>
          Сначала выберите цветок и угол поворота, затем перетащите в букет
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}>
          {/* Палитра */}
          <div>
            <div
              style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              }}>
              <h2
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  color: '#831843',
                }}>
                Доступные цветы
              </h2>

              {/* Панель управления поворотом */}
              {selectedFlower && (
                <div
                  style={{
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.75rem',
                    }}>
                    <div
                      style={{
                        fontWeight: '700',
                        color: 'white',
                        fontSize: '1.1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}>
                      <RotateCw size={18} />
                      Выбран: {selectedFlower.name}
                    </div>
                    <button
                      onClick={resetSelection}
                      style={{
                        padding: '0.25rem 0.75rem',
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                      }}>
                      Сбросить
                    </button>
                  </div>

                  <div
                    style={{
                      textAlign: 'center',
                      fontWeight: '700',
                      color: 'white',
                      fontSize: '1.25rem',
                      marginBottom: '0.75rem',
                    }}>
                    Угол: {currentRotation}°
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center',
                    }}>
                    <button
                      onClick={handleRotateLeft}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '700',
                      }}>
                      ← −15°
                    </button>

                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={currentRotation}
                      onChange={handleSliderChange}
                      style={{
                        flex: 3,
                        height: '8px',
                        borderRadius: '4px',
                        background: 'rgba(255, 255, 255, 0.3)',
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    />

                    <button
                      onClick={handleRotateRight}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '700',
                      }}>
                      +15° →
                    </button>
                  </div>

                  <div
                    style={{
                      marginTop: '0.75rem',
                      textAlign: 'center',
                      fontSize: '0.75rem',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}>
                    💡 Установите угол, затем перетащите цветок в букет
                  </div>
                </div>
              )}

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1rem',
                }}>
                {availableFlowers.map((flower) => (
                  <div
                    key={flower.id}
                    draggable={!!selectedFlower}
                    onDragStart={(e) => handleDragStart(e, flower)}
                    onClick={() => handleFlowerSelect(flower)}
                    style={{
                      padding: '1rem',
                      background:
                        selectedFlower?.id === flower.id
                          ? 'linear-gradient(to bottom, #c4b5fd, #a78bfa)'
                          : 'linear-gradient(to bottom, #fdf4ff, #fae8ff)',
                      borderRadius: '0.75rem',
                      cursor: selectedFlower?.id === flower.id ? 'grab' : 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s',
                      border:
                        selectedFlower?.id === flower.id
                          ? '2px solid #7c3aed'
                          : '2px solid #e9d5ff',
                      transform: selectedFlower?.id === flower.id ? 'scale(0.95)' : 'scale(1)',
                    }}
                    onMouseDown={(e) => {
                      if (selectedFlower?.id === flower.id) {
                        e.currentTarget.style.cursor = 'grabbing';
                      }
                    }}
                    onMouseUp={(e) => {
                      if (selectedFlower?.id === flower.id) {
                        e.currentTarget.style.cursor = 'grab';
                      }
                    }}>
                    <div
                      style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                      {flower.icon}
                    </div>
                    <div
                      className={flower.color}
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: selectedFlower?.id === flower.id ? 'white' : 'inherit',
                      }}>
                      {flower.name}
                    </div>
                    {selectedFlower?.id === flower.id && (
                      <div style={{ fontSize: '0.75rem', color: 'white', marginTop: '0.25rem' }}>
                        ✓ Выбран
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {!selectedFlower && (
                <div
                  style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: '#fef3c7',
                    borderRadius: '0.5rem',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    color: '#92400e',
                  }}>
                  💡 Сначала кликните на цветок чтобы выбрать его и установить угол поворота
                </div>
              )}
            </div>
          </div>

          {/* Букет */}
          <div>
            <div
              style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                }}>
                <h2
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#831843',
                  }}>
                  Ваш букет ({bouquet.length})
                </h2>

                {bouquet.length > 0 && (
                  <button
                    onClick={clearBouquet}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                    }}>
                    Очистить
                  </button>
                )}
              </div>

              <div
                ref={bouquetZoneRef}
                onDragOver={handleDragOverZone}
                onDrop={handleDrop}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '400px',
                  background: 'linear-gradient(to bottom, #fef3c7, #fce7f3)',
                  borderRadius: '0.75rem',
                  border: '3px dashed #d8b4fe',
                  overflow: 'hidden',
                }}>
                {/* АКТИВНЫЙ СЛОТ */}
                {activeSlotId !== null && (
                  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                    <div
                      style={{
                        position: 'absolute',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'rgba(168, 85, 247, 0.3)',
                        border: '3px solid #a855f7',
                        left: `${slots[activeSlotId].x}%`,
                        top: `${slots[activeSlotId].y}%`,
                        transform: 'translate(-50%, -50%)',
                        animation: 'pulse 1s infinite',
                      }}
                    />
                  </div>
                )}

                {/* ПРЕВЬЮ ЦВЕТКА ПРИ ПЕРЕТАСКИВАНИИ */}
                {selectedFlower && previewPosition && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${previewPosition.x}%`,
                      top: `${previewPosition.y}%`,
                      transform: `translate(-50%, -50%) rotate(${currentRotation}deg)`,
                      pointerEvents: 'none',
                      opacity: 0.7,
                    }}>
                    <img
                      src={selectedFlower.image}
                      alt={selectedFlower.name}
                      style={{
                        height: '200px',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 2px 8px rgba(168, 85, 247, 0.5))',
                      }}
                    />
                  </div>
                )}

                {/* ЦВЕТЫ */}
                {bouquet.length === 0 ? (
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: '#9333ea',
                      textAlign: 'center',
                      fontSize: '1.125rem',
                    }}>
                    {selectedFlower
                      ? 'Перетащите цветок в подсвеченный слот'
                      : 'Сначала выберите цветок слева'}
                  </div>
                ) : (
                  bouquet.map((flower) => (
                    <div
                      key={flower.uniqueId}
                      onClick={() => removeFlower(flower.uniqueId!)}
                      style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        left: `${flower.x}%`,
                        top: `${flower.y}%`,
                        transform: `translate(-50%, -50%) rotate(${flower.rotation}deg)`,
                      }}>
                      <img
                        src={flower.image}
                        alt={flower.name}
                        style={{
                          height: '200px',
                          objectFit: 'contain',
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                        }}
                      />
                    </div>
                  ))
                )}

                <div
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '200px',
                    height: '120px',
                  }}>
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background:
                        'linear-gradient(to bottom, rgba(139, 92, 246, 0.9), rgba(139, 92, 246, 0.7))',
                      clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
                      borderRadius: '0 0 1rem 1rem',
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  background: '#fef3c7',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#92400e',
                  textAlign: 'center',
                }}>
                💡 Клик на цветок - удалить | 📝 Сначала выберите цветок и угол, затем перетащите
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.7;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default FlowerBouquetBuilder;
