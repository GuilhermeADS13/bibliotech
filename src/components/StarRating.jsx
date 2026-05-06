export function StarRating({ rating, setRating, interactive = false }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && setRating(star)}
          className={`text-xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}
            ${interactive ? 'hover:scale-110 transition-transform' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
