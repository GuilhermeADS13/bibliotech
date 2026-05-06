export function Stats({ lidos, lendo, queroLer, abandonei }) {
  const cards = [
    { label: 'Lidos',     value: lidos,    emoji: '✅', color: '#0d47a1', bg: '#e3f2fd' },
    { label: 'Lendo',     value: lendo,    emoji: '📖', color: '#1b4332', bg: '#e8f5e9' },
    { label: 'Quero Ler', value: queroLer, emoji: '⏳', color: '#e65100', bg: '#fff8e1' },
    { label: 'Abandonei', value: abandonei,emoji: '❌', color: '#880e4f', bg: '#fce4ec' },
  ];
  const total = lidos + lendo + queroLer + abandonei;

  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <h3 style={{ fontWeight: '800', fontSize: '16px', color: '#1b4332', marginBottom: '16px' }}>📊 Minha Estante</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {cards.map(c => (
          <div key={c.label} style={{ background: c.bg, borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', marginBottom: '4px' }}>{c.emoji}</div>
            <div style={{ fontSize: '26px', fontWeight: '900', color: c.color }}>{c.value}</div>
            <div style={{ fontSize: '11px', color: c.color, fontWeight: '600', opacity: 0.8 }}>{c.label}</div>
          </div>
        ))}
      </div>
      {total > 0 && (
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#9c8c7e', marginTop: '12px' }}>
          {total} livro{total !== 1 ? 's' : ''} na estante
        </p>
      )}
    </div>
  );
}
