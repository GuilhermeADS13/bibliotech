import React, { useState } from 'react';
import { StarRating } from './StarRating';

const STATUS_OPTS = [
  { value: 'lendo',    label: '📖 Lendo' },
  { value: 'lido',     label: '✅ Lido' },
  { value: 'quero-ler',label: '⏳ Quero Ler' },
  { value: 'abandonei',label: '❌ Abandonei' },
];

const STATUS_COLORS = {
  'lendo':     { bg: '#e8f5e9', color: '#1b4332', border: '#52b788' },
  'lido':      { bg: '#e3f2fd', color: '#0d47a1', border: '#42a5f5' },
  'quero-ler': { bg: '#fff8e1', color: '#e65100', border: '#ffb74d' },
  'abandonei': { bg: '#fce4ec', color: '#880e4f', border: '#f48fb1' },
};

export function BookCard({ livro, onAtualizar, onRemover, onResenha }) {
  const [hover, setHover] = useState(false);
  const [editando, setEditando] = useState(false);
  const cor = STATUS_COLORS[livro.status] || STATUS_COLORS['quero-ler'];

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setEditando(false); }}
      style={{
        background: 'white', borderRadius: '12px', overflow: 'hidden',
        boxShadow: hover ? '0 8px 24px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'all 0.2s ease', transform: hover ? 'translateY(-4px)' : 'none',
        cursor: 'pointer', position: 'relative'
      }}>

      {/* Capa */}
      <div style={{ position: 'relative' }}>
        <img
          src={livro.capa || 'https://via.placeholder.com/160x220/2d6a4f/white?text=📚'}
          alt={livro.titulo}
          style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', display: 'block' }}
        />
        {/* Badge status */}
        <div style={{
          position: 'absolute', top: '8px', left: '8px',
          background: cor.bg, color: cor.color, border: `1px solid ${cor.border}`,
          borderRadius: '6px', fontSize: '10px', fontWeight: '700', padding: '2px 7px'
        }}>
          {STATUS_OPTS.find(s => s.value === livro.status)?.label || livro.status}
        </div>
        {/* Overlay de ações ao hover */}
        {hover && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(27,67,50,0.85)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}>
            <button onClick={onResenha}
              style={{ background: '#52b788', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', width: '130px' }}>
              ✏️ Resenha/Nota
            </button>
            <button onClick={() => setEditando(v => !v)}
              style={{ background: 'white', color: '#1b4332', border: 'none', borderRadius: '8px', padding: '8px 16px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', width: '130px' }}>
              🔄 Mudar Status
            </button>
            <button onClick={onRemover}
              style={{ background: 'transparent', color: '#f48fb1', border: '1px solid #f48fb1', borderRadius: '8px', padding: '8px 16px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', width: '130px' }}>
              🗑️ Remover
            </button>
          </div>
        )}
        {/* Select de status */}
        {editando && hover && (
          <div style={{ position: 'absolute', bottom: '8px', left: '8px', right: '8px' }}>
            <select
              value={livro.status}
              onChange={e => { onAtualizar({ status: e.target.value }); setEditando(false); }}
              style={{ width: '100%', padding: '6px', borderRadius: '6px', border: 'none', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}>
              {STATUS_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '10px' }}>
        <h4 style={{ fontWeight: '700', fontSize: '13px', color: '#1b4332', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {livro.titulo}
        </h4>
        <p style={{ fontSize: '11px', color: '#9c8c7e', marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {livro.autor}
        </p>
        <StarRating rating={livro.nota} />
        {livro.resenha && (
          <p style={{ fontSize: '10px', color: '#6b5d4f', marginTop: '6px', fontStyle: 'italic',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            "{livro.resenha}"
          </p>
        )}
      </div>
    </div>
  );
}
