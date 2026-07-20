import { Star } from 'lucide-react';

const StarRating = ({ value = 0, onChange, size = 'h-7 w-7' }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        disabled={!onChange}
        onClick={() => onChange?.(n)}
        className={onChange ? 'cursor-pointer' : 'cursor-default'}
        aria-label={`${n} star`}
      >
        <Star
          className={`${size} transition-colors ${
            n <= value ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-gray-300'
          }`}
        />
      </button>
    ))}
  </div>
);

export default StarRating;
