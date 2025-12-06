import { FaStar } from 'react-icons/fa';
import { useState } from 'react';
import './StarRating.css';

interface StarRatingProps {
  flowerId: number;
  initialRating: number;
  ratingCount?: number;
  onRatingChange?: (newRating: number, newRatingCount: number) => void;
}

export default function StarRating({
  flowerId,
  initialRating,
  ratingCount,
  onRatingChange,
}: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];
  const [star, setStar] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [localRatingCount, setLocalRatingCount] = useState(ratingCount || 0);

  async function handleStar(rating: number) {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`http://localhost:4000/flowers/${flowerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      });

      if (response.ok) {
        const data = await response.json();
        const newRating = data.flower.rating;
        const newCount = data.flower.ratingCount;

        setStar(newRating);
        setLocalRatingCount(newCount);
        onRatingChange?.(newRating, newCount);
        setMessage('Спасибо за оценку!');
        setTimeout(() => setMessage(''), 2000);
      } else {
        setMessage('Ошибка обновления');
      }
    } catch {
      setMessage('Ошибка сети');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(''), 2000);
    }
  }

  return (
    <div className="rating-wrapper">
      <ul className="rating-stars">
        {stars.map((value) => {
          const fill = Math.min(Math.max((hover || star) - (value - 1), 0), 1) * 100;

          return (
            <li
              key={value}
              className={`star-item ${isSubmitting ? 'disabled' : ''}`}
              onClick={() => handleStar(value)}
              onMouseEnter={() => !isSubmitting && setHover(value)}
              onMouseLeave={() => setHover(0)}>
              <FaStar className="star-base" />
              <FaStar className="star-fill" style={{ clipPath: `inset(0 ${100 - fill}% 0 0)` }} />
            </li>
          );
        })}
      </ul>

      <div className="rating-info">
        {message ? (
          <span className={`rating-message ${message.includes('Спасибо') ? 'success' : 'error'}`}>
            {message}
          </span>
        ) : localRatingCount > 0 ? (
          <div className="rating-number">{star.toFixed(1)}</div>
        ) : (
          <div className="rating-empty">Еще нет оценок</div>
        )}
      </div>
    </div>
  );
}
