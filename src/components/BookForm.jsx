import React, { useState } from 'react';
import { StarRating } from './StarRating';

export function BookForm({ onSave }) {
  const [loading, setLoading] = useState(false);
  const [nota, setNota] = useState(0);
  const [sugestoes, setSugestoes] = useState([]);
  const [formData, setFormData] = useState({
    titulo: '', autor: '', genero: '', paginas: '',
    dataTermino: '', status: 'quero-ler', capa: '', resenha: ''
  });

  const buscarNoGoogleBooks = async () => {
    if (!formData.titulo || formData.titulo.length < 2) return;
    setLoading(true);
    try {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(formData.titulo)}&maxResults=5&langRestrict=pt`);
      const data = await res.json();
      if (data.items?.length) {
        setSugestoes(data.items.map(item => ({
          titulo: item.volumeInfo.title,
          autor: item.volumeInfo.authors?.join(', ') || 'Desconhecido',
          genero: item.volumeInfo.categories?.[0] || '',
          paginas: item.volumeInfo.pageCount || '',
          capa: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || ''
        })));
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const selecionarSugestao = (s) => {
    setFormData(prev => ({ ...prev, ...s }));
    setSugestoes([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.titulo.trim()) return;
    onSave({ ...formData, nota, id: Date.now() });
    setFormData({ titulo: '', autor: '', genero: '', paginas: '', dataTermino: '', status: 'quero-ler', capa: '', resenha: '' });
    setNota(0);
    setSugestoes([]);
  };

  const inp = { padding: '10px 14px', borderRadius: '10px', border: '2px solid #d4c5a9', outline: 'none', fontSize: '14px', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Busca Google Books */}
      <div>
        <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#1b4332', marginBottom: '6px' }}>Título do Livro *</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input type="text" placeholder="Digite o título para buscar..."
            value={formData.titulo} style={{ ...inp, flex: 1 }}
            onChange={e => setFormData({ ...formData, titulo: e.target.value })}
            onFocus={e => e.target.style.borderColor = '#52b788'}
            onBlur={e => e.target.style.borderColor = '#d4c5a9'} />
          <button type="button" onClick={buscarNoGoogleBooks}
            style={{ background: '#52b788', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 18px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '14px' }}>
            {loading ? '⏳' : '🔍 Buscar'}
          </button>
        </div>
        {/* Sugestões */}
        {sugestoes.length > 0 && (
          <div style={{ background: 'white', border: '2px solid #52b788', borderRadius: '10px', marginTop: '8px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
            {sugestoes.map((s, i) => (
              <div key={i} onClick={() => selecionarSugestao(s)}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', cursor: 'pointer', borderBottom: i < sugestoes.length - 1 ? '1px solid #f0e8dc' : 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f0faf4'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                {s.capa && <img src={s.capa} alt={s.titulo} style={{ width: '32px', height: '46px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />}
                <div>
                  <p style={{ fontWeight: '700', fontSize: '13px', color: '#1b4332' }}>{s.titulo}</p>
                  <p style={{ fontSize: '11px', color: '#9c8c7e' }}>{s.autor}{s.paginas ? ` · ${s.paginas} pág.` : ''}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview da capa */}
      {formData.capa && (
        <div style={{ textAlign: 'center' }}>
          <img src={formData.capa} alt="Capa" style={{ height: '140px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />
        </div>
      )}

      {/* Autor / Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#1b4332', marginBottom: '6px' }}>Autor</label>
          <input type="text" placeholder="Nome do autor" value={formData.autor} style={inp}
            onChange={e => setFormData({ ...formData, autor: e.target.value })}
            onFocus={e => e.target.style.borderColor = '#52b788'}
            onBlur={e => e.target.style.borderColor = '#d4c5a9'} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#1b4332', marginBottom: '6px' }}>Status</label>
          <select value={formData.status} style={{ ...inp, background: 'white', cursor: 'pointer' }}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
            onFocus={e => e.target.style.borderColor = '#52b788'}
            onBlur={e => e.target.style.borderColor = '#d4c5a9'}>
            <option value="quero-ler">⏳ Quero Ler</option>
            <option value="lendo">📖 Lendo</option>
            <option value="lido">✅ Lido</option>
            <option value="abandonei">❌ Abandonei</option>
          </select>
        </div>
      </div>

      {/* Gênero / Páginas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#1b4332', marginBottom: '6px' }}>Gênero</label>
          <input type="text" placeholder="Ex: Romance, Ficção..." value={formData.genero} style={inp}
            onChange={e => setFormData({ ...formData, genero: e.target.value })}
            onFocus={e => e.target.style.borderColor = '#52b788'}
            onBlur={e => e.target.style.borderColor = '#d4c5a9'} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#1b4332', marginBottom: '6px' }}>Data de término</label>
          <input type="date" style={{ ...inp, background: 'white' }}
            onChange={e => setFormData({ ...formData, dataTermino: e.target.value })}
            onFocus={e => e.target.style.borderColor = '#52b788'}
            onBlur={e => e.target.style.borderColor = '#d4c5a9'} />
        </div>
      </div>

      {/* Nota */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px', borderRadius: '10px', background: '#f9f7f4', border: '2px solid #d4c5a9' }}>
        <span style={{ fontWeight: '700', fontSize: '13px', color: '#1b4332' }}>Sua nota:</span>
        <StarRating rating={nota} setRating={setNota} interactive={true} />
        {nota > 0 && <span style={{ fontSize: '12px', color: '#9c8c7e' }}>{nota}/5</span>}
      </div>

      {/* Resenha rápida */}
      <div>
        <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#1b4332', marginBottom: '6px' }}>Resenha (opcional)</label>
        <textarea placeholder="Deixe uma resenha rápida..." value={formData.resenha} rows={3}
          style={{ ...inp, resize: 'vertical' }}
          onChange={e => setFormData({ ...formData, resenha: e.target.value })}
          onFocus={e => e.target.style.borderColor = '#52b788'}
          onBlur={e => e.target.style.borderColor = '#d4c5a9'} />
      </div>

      <button type="submit"
        style={{ background: 'linear-gradient(135deg, #1b4332, #2d6a4f)', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '900', fontSize: '15px', cursor: 'pointer', letterSpacing: '0.5px' }}>
        ADICIONAR À ESTANTE
      </button>
    </form>
  );
}
