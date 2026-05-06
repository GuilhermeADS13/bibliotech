import React, { useState } from 'react';
import { StarRating } from './StarRating';

export function ResenhaModal({ livro, onSalvar, onFechar }) {
  const [resenha, setResenha] = useState(livro.resenha || '');
  const [nota, setNota] = useState(livro.nota || 0);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
    }} onClick={onFechar}>
      <div style={{
        background: 'white', borderRadius: '20px', padding: '32px',
        maxWidth: '500px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <img src={livro.capa || 'https://via.placeholder.com/70x100/2d6a4f/white?text=📚'} alt={livro.titulo}
            style={{ width: '70px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
          <div>
            <h3 style={{ fontWeight: '900', fontSize: '18px', color: '#1b4332', marginBottom: '4px' }}>{livro.titulo}</h3>
            <p style={{ color: '#9c8c7e', fontSize: '14px', marginBottom: '12px' }}>{livro.autor}</p>
            <div>
              <p style={{ fontSize: '12px', color: '#6b5d4f', marginBottom: '6px', fontWeight: '600' }}>Sua nota:</p>
              <StarRating rating={nota} setRating={setNota} interactive={true} />
            </div>
          </div>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '700', fontSize: '14px', color: '#1b4332', marginBottom: '8px' }}>
            ✏️ Sua resenha
          </label>
          <textarea
            value={resenha}
            onChange={e => setResenha(e.target.value)}
            rows={5}
            placeholder="O que você achou do livro? Conte sua experiência de leitura..."
            style={{
              width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #d4c5a9',
              fontSize: '14px', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'
            }}
            onFocus={e => e.target.style.borderColor = '#52b788'}
            onBlur={e => e.target.style.borderColor = '#d4c5a9'}
          />
          <p style={{ fontSize: '11px', color: '#9c8c7e', marginTop: '4px', textAlign: 'right' }}>{resenha.length} caracteres</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onFechar}
            style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '2px solid #d4c5a9', background: 'white', color: '#6b5d4f', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>
            Cancelar
          </button>
          <button onClick={() => onSalvar(resenha, nota)}
            style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#2d6a4f', color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
