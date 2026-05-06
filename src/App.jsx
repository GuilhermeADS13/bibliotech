import React, { useState, useEffect } from 'react';
import { BookForm } from './components/BookForm';
import { StarRating } from './components/StarRating';
import { BookCard } from './components/BookCard';
import { Stats } from './components/Stats';
import { ResenhaModal } from './components/ResenhaModal';

const ABAS = [
  { key: 'inicio',    label: 'Início' },
  { key: 'estante',   label: 'Minha Estante' },
  { key: 'adicionar', label: '+ Adicionar Livro' },
  { key: 'metas',     label: 'Metas' },
];

export default function App() {
  const [aba, setAba] = useState('inicio');
  const [livros, setLivros] = useState(() => {
    try { return JSON.parse(localStorage.getItem('skoob-livros') || '[]'); } catch { return []; }
  });
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [modalResenha, setModalResenha] = useState(null);
  const [metaAnual, setMetaAnual] = useState(() => Number(localStorage.getItem('skoob-meta') || 12));
  const [editandoMeta, setEditandoMeta] = useState(false);

  useEffect(() => { localStorage.setItem('skoob-livros', JSON.stringify(livros)); }, [livros]);
  useEffect(() => { localStorage.setItem('skoob-meta', metaAnual); }, [metaAnual]);

  const adicionarLivro = (novoLivro) => {
    setLivros(prev => [...prev, { ...novoLivro, id: Date.now(), resenha: '', curtidas: 0 }]);
    setAba('estante');
  };

  const atualizarLivro = (id, dados) => {
    setLivros(prev => prev.map(l => l.id === id ? { ...l, ...dados } : l));
  };

  const removerLivro = (id) => {
    if (confirm('Remover este livro da estante?')) {
      setLivros(prev => prev.filter(l => l.id !== id));
    }
  };

  const ano = new Date().getFullYear();
  const lidos = livros.filter(l => l.status === 'lido');
  const lendoAgora = livros.filter(l => l.status === 'lendo');
  const queroLer = livros.filter(l => l.status === 'quero-ler');
  const abandonei = livros.filter(l => l.status === 'abandonei');
  const lidosAno = lidos.filter(l => l.dataTermino?.startsWith(String(ano)));
  const pctMeta = Math.min(100, Math.round((lidosAno.length / metaAnual) * 100));

  const livrosFiltrados = livros.filter(l => {
    const q = busca.toLowerCase();
    const match = !q || l.titulo?.toLowerCase().includes(q) || l.autor?.toLowerCase().includes(q);
    const st = filtroStatus === 'todos' || l.status === filtroStatus;
    return match && st;
  });

  const ultimoLido = [...lidos]
    .filter(l => l.dataTermino)
    .sort((a, b) => new Date(b.dataTermino) - new Date(a.dataTermino))[0];

  return (
    <div className="min-h-screen" style={{ background: '#f5f0e8', fontFamily: "'Segoe UI', sans-serif" }}>

      {/* HEADER */}
      <header style={{ background: '#2d6a4f', borderBottom: '3px solid #1b4332' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div style={{
                background: '#52b788', borderRadius: '8px', padding: '6px 14px',
                fontWeight: '900', fontSize: '22px', color: 'white', letterSpacing: '-0.5px'
              }}>
                biblio<span style={{ color: '#b7e4c7' }}>tech</span>
              </div>
            </div>
            <nav className="flex gap-1">
              {ABAS.map(a => (
                <button key={a.key} onClick={() => setAba(a.key)}
                  style={{
                    padding: '7px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                    fontWeight: '600', fontSize: '13px', transition: 'all .2s',
                    background: aba === a.key ? '#52b788' : 'transparent',
                    color: aba === a.key ? 'white' : '#b7e4c7',
                  }}>
                  {a.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* ── INÍCIO ── */}
        {aba === 'inicio' && (
          <div className="space-y-6">

            {/* Destaque último livro lido */}
            {ultimoLido ? (
              <div style={{
                background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 60%, #52b788 100%)',
                borderRadius: '16px', padding: '32px', color: 'white',
                display: 'flex', alignItems: 'center', gap: '32px',
                boxShadow: '0 8px 32px rgba(27,67,50,0.3)'
              }}>
                <img src={ultimoLido.capa || 'https://via.placeholder.com/120x170/2d6a4f/white?text=📚'}
                  alt={ultimoLido.titulo}
                  style={{ width: '120px', height: '170px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 6px 20px rgba(0,0,0,0.4)' }} />
                <div>
                  <p style={{ color: '#b7e4c7', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
                    📖 Último livro lido
                  </p>
                  <h2 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '6px', lineHeight: 1.2 }}>{ultimoLido.titulo}</h2>
                  <p style={{ opacity: 0.8, marginBottom: '12px', fontSize: '16px' }}>{ultimoLido.autor}</p>
                  <StarRating rating={ultimoLido.nota} />
                  {ultimoLido.resenha && (
                    <p style={{ marginTop: '12px', opacity: 0.75, fontSize: '14px', fontStyle: 'italic', maxWidth: '400px' }}>
                      "{ultimoLido.resenha.slice(0, 120)}{ultimoLido.resenha.length > 120 ? '…' : ''}"
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div style={{
                background: 'white', borderRadius: '16px', padding: '40px',
                textAlign: 'center', border: '2px dashed #d4c5a9'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📚</div>
                <p style={{ color: '#6b5d4f', fontSize: '16px', fontWeight: '600' }}>Sua estante está vazia</p>
                <p style={{ color: '#9c8c7e', fontSize: '14px', marginBottom: '16px' }}>Adicione seu primeiro livro para começar!</p>
                <button onClick={() => setAba('adicionar')}
                  style={{ background: '#2d6a4f', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 24px', fontWeight: '700', cursor: 'pointer' }}>
                  Adicionar Livro
                </button>
              </div>
            )}

            {/* Stats */}
            <Stats lidos={lidos.length} lendo={lendoAgora.length} queroLer={queroLer.length} abandonei={abandonei.length} />

            {/* Meta do ano */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontWeight: '800', fontSize: '16px', color: '#1b4332' }}>🎯 Meta de Leitura {ano}</h3>
                <button onClick={() => setEditandoMeta(v => !v)}
                  style={{ fontSize: '12px', color: '#2d6a4f', background: 'none', border: '1px solid #2d6a4f', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontWeight: '600' }}>
                  {editandoMeta ? 'Salvar' : 'Editar'}
                </button>
              </div>
              {editandoMeta ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', color: '#6b5d4f' }}>Quero ler</span>
                  <input type="number" min="1" max="365" value={metaAnual}
                    onChange={e => setMetaAnual(Number(e.target.value))}
                    style={{ width: '80px', padding: '6px 10px', borderRadius: '6px', border: '2px solid #52b788', textAlign: 'center', fontWeight: '700', fontSize: '16px' }} />
                  <span style={{ fontSize: '14px', color: '#6b5d4f' }}>livros em {ano}</span>
                </div>
              ) : (
                <p style={{ fontSize: '14px', color: '#6b5d4f', marginBottom: '12px' }}>
                  <strong style={{ color: '#1b4332', fontSize: '20px' }}>{lidosAno.length}</strong> de <strong>{metaAnual}</strong> livros lidos em {ano}
                </p>
              )}
              <div style={{ background: '#e8f5e9', borderRadius: '999px', height: '14px', overflow: 'hidden' }}>
                <div style={{
                  background: 'linear-gradient(90deg, #2d6a4f, #52b788)',
                  height: '100%', borderRadius: '999px',
                  width: `${pctMeta}%`, transition: 'width 0.6s ease'
                }} />
              </div>
              <p style={{ fontSize: '12px', color: '#9c8c7e', marginTop: '6px', textAlign: 'right' }}>{pctMeta}% da meta</p>
            </div>

            {/* Lendo agora */}
            {lendoAgora.length > 0 && (
              <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontWeight: '800', fontSize: '16px', color: '#1b4332', marginBottom: '16px' }}>📖 Lendo Agora</h3>
                <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                  {lendoAgora.map(l => (
                    <div key={l.id} style={{ minWidth: '120px', textAlign: 'center' }}>
                      <img src={l.capa || 'https://via.placeholder.com/100x140/2d6a4f/white?text=📚'}
                        alt={l.titulo}
                        style={{ width: '100px', height: '140px', objectFit: 'cover', borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />
                      <p style={{ fontSize: '11px', fontWeight: '700', marginTop: '8px', color: '#1b4332', maxWidth: '100px' }} className="truncate">{l.titulo}</p>
                      <p style={{ fontSize: '10px', color: '#9c8c7e' }}>{l.autor}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── MINHA ESTANTE ── */}
        {aba === 'estante' && (
          <div>
            {/* Filtros */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
              <input type="text" placeholder="🔍 Pesquisar livros..."
                value={busca} onChange={e => setBusca(e.target.value)}
                style={{ flex: 1, minWidth: '200px', padding: '10px 16px', borderRadius: '10px', border: '2px solid #d4c5a9', outline: 'none', fontSize: '14px' }} />
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[
                  { key: 'todos', label: 'Todos' },
                  { key: 'lendo', label: '📖 Lendo' },
                  { key: 'lido', label: '✅ Lidos' },
                  { key: 'quero-ler', label: '⏳ Quero Ler' },
                  { key: 'abandonei', label: '❌ Abandonei' },
                ].map(f => (
                  <button key={f.key} onClick={() => setFiltroStatus(f.key)}
                    style={{
                      padding: '8px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                      fontWeight: '600', fontSize: '12px', transition: 'all .15s',
                      background: filtroStatus === f.key ? '#2d6a4f' : 'white',
                      color: filtroStatus === f.key ? 'white' : '#6b5d4f',
                      boxShadow: filtroStatus === f.key ? '0 2px 8px rgba(45,106,79,0.3)' : '0 1px 4px rgba(0,0,0,0.08)',
                    }}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {livrosFiltrados.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#9c8c7e' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
                <p style={{ fontSize: '16px', fontWeight: '600' }}>Nenhum livro encontrado</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' }}>
                {livrosFiltrados.map(livro => (
                  <BookCard key={livro.id} livro={livro}
                    onAtualizar={(dados) => atualizarLivro(livro.id, dados)}
                    onRemover={() => removerLivro(livro.id)}
                    onResenha={() => setModalResenha(livro)} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ADICIONAR ── */}
        {aba === 'adicionar' && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontWeight: '900', fontSize: '20px', color: '#1b4332', marginBottom: '24px' }}>📚 Adicionar à Estante</h2>
              <BookForm onSave={adicionarLivro} />
            </div>
          </div>
        )}

        {/* ── METAS ── */}
        {aba === 'metas' && (
          <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontWeight: '900', fontSize: '18px', color: '#1b4332', marginBottom: '20px' }}>🎯 Meta de Leitura {ano}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <span style={{ fontSize: '14px', color: '#6b5d4f' }}>Quero ler</span>
                <input type="number" min="1" max="365" value={metaAnual}
                  onChange={e => setMetaAnual(Number(e.target.value))}
                  style={{ width: '90px', padding: '8px 12px', borderRadius: '8px', border: '2px solid #52b788', textAlign: 'center', fontWeight: '700', fontSize: '18px' }} />
                <span style={{ fontSize: '14px', color: '#6b5d4f' }}>livros em {ano}</span>
              </div>
              <div style={{ background: '#e8f5e9', borderRadius: '999px', height: '20px', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{
                  background: 'linear-gradient(90deg, #1b4332, #52b788)',
                  height: '100%', borderRadius: '999px', width: `${pctMeta}%`, transition: 'width 0.6s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '8px'
                }}>
                  {pctMeta > 15 && <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>{pctMeta}%</span>}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#9c8c7e' }}>
                <span>{lidosAno.length} lidos</span>
                <span>{Math.max(0, metaAnual - lidosAno.length)} restantes</span>
              </div>
            </div>

            {/* Progresso por mês */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontWeight: '800', fontSize: '16px', color: '#1b4332', marginBottom: '20px' }}>📅 Leituras por Mês ({ano})</h3>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '100px' }}>
                {Array.from({ length: 12 }, (_, i) => {
                  const mes = String(i + 1).padStart(2, '0');
                  const count = lidos.filter(l => l.dataTermino?.startsWith(`${ano}-${mes}`)).length;
                  const max = Math.max(1, ...Array.from({ length: 12 }, (_, j) => {
                    const m = String(j + 1).padStart(2, '0');
                    return lidos.filter(l => l.dataTermino?.startsWith(`${ano}-${m}`)).length;
                  }));
                  const h = count ? Math.max(12, (count / max) * 80) : 4;
                  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '10px', color: '#1b4332', fontWeight: '700' }}>{count || ''}</span>
                      <div style={{
                        width: '100%', height: `${h}px`, borderRadius: '4px 4px 0 0',
                        background: count ? 'linear-gradient(180deg, #52b788, #2d6a4f)' : '#e8f5e9',
                        transition: 'height 0.4s ease'
                      }} />
                      <span style={{ fontSize: '9px', color: '#9c8c7e', fontWeight: '600' }}>{meses[i]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Lista lidos no ano */}
            {lidosAno.length > 0 && (
              <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontWeight: '800', fontSize: '16px', color: '#1b4332', marginBottom: '16px' }}>✅ Lidos em {ano}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {lidosAno.sort((a,b) => new Date(b.dataTermino) - new Date(a.dataTermino)).map(l => (
                    <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '10px', background: '#f9f7f4' }}>
                      <img src={l.capa || 'https://via.placeholder.com/40x56/2d6a4f/white?text=📚'} alt={l.titulo}
                        style={{ width: '40px', height: '56px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: '700', fontSize: '14px', color: '#1b4332' }}>{l.titulo}</p>
                        <p style={{ fontSize: '12px', color: '#9c8c7e' }}>{l.autor} · {l.dataTermino}</p>
                      </div>
                      <StarRating rating={l.nota} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Resenha */}
      {modalResenha && (
        <ResenhaModal livro={modalResenha}
          onSalvar={(resenha, nota) => {
            atualizarLivro(modalResenha.id, { resenha, nota });
            setModalResenha(null);
          }}
          onFechar={() => setModalResenha(null)} />
      )}
    </div>
  );
}
