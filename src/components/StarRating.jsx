export function StarRating({ rating, setRating, interactive = false }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" disabled={!interactive}
          onClick={() => interactive && setRating(star)}
          style={{
            background: 'none', border: 'none', cursor: interactive ? 'pointer' : 'default',
            fontSize: interactive ? '22px' : '16px', padding: '0',
            color: star <= rating ? '#f59e0b' : '#d4c5a9',
            transform: interactive ? 'scale(1)' : undefined,
            transition: 'transform 0.1s ease'
          }}
          onMouseEnter={e => { if (interactive) e.currentTarget.style.transform = 'scale(1.2)'; }}
          onMouseLeave={e => { if (interactive) e.currentTarget.style.transform = 'scale(1)'; }}>
          ★
        </button>
      ))}
    </div>
  );
}
