import React, { useState, useEffect } from 'react';
import { BookForm } from './components/BookForm';
import { StarRating } from './components/StarRating';

function App() {
  const [livros, setLivros] = useState(() => {
    const salvo = localStorage.getItem('meus-livros');
    return salvo ? JSON.parse(salvo) : [];
  });
  const [busca, setBusca] = useState('');

  useEffect(() => {
    localStorage.setItem('meus-livros', JSON.stringify(livros));
  }, [livros]);

  const ultimoLido = [...livros]
    .filter(l => l.status === 'finalizado' && l.dataTermino)
    .sort((a, b) => new Date(b.dataTermino) - new Date(a.dataTermino))[0];

  const renderPrateleira = (titulo, status) => {
    const filtrados = livros.filter(l => l.status === status &&
      (l.titulo.toLowerCase().includes(busca.toLowerCase()) || l.autor.toLowerCase().includes(busca.toLowerCase())));

    if (filtrados.length === 0) return null;

    return (
      <div className="py-6">
        <h3 className="text-xl font-bold text-indigo-900 mb-4 border-l-4 border-indigo-500 pl-3">{titulo}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {filtrados.map(livro => (
            <div key={livro.id} className="bg-white p-3 rounded-2xl shadow-sm hover:shadow-md transition">
              <img src={livro.capa || 'https://via.placeholder.com/150x200'} alt={livro.titulo} className="rounded-lg aspect-[2/3] object-cover w-full mb-3" />
              <h4 className="font-bold text-sm truncate">{livro.titulo}</h4>
              <p className="text-xs text-gray-500 mb-2">{livro.autor}</p>
              <StarRating rating={livro.nota} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 text-slate-900">
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <h1 className="text-4xl font-black tracking-tighter text-indigo-900 text-center">
          BIBLIO<span className="text-indigo-500">TECH</span>
        </h1>
        <input
          type="text"
          placeholder="Pesquisar na estante..."
          className="w-full md:w-80 p-3 rounded-2xl border-none shadow-md outline-none focus:ring-2 focus:ring-indigo-400"
          onChange={(e) => setBusca(e.target.value)}
        />
      </header>

      <main className="max-w-6xl mx-auto space-y-12">
        {ultimoLido && !busca && (
          <section className="bg-indigo-900 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
            <img src={ultimoLido.capa} alt={ultimoLido.titulo} className="w-40 h-60 object-cover rounded-xl shadow-2xl z-10" />
            <div className="z-10 text-center md:text-left">
              <p className="text-indigo-300 font-bold uppercase tracking-widest text-xs mb-2">Acabou de ler</p>
              <h2 className="text-4xl md:text-5xl font-black mb-2">{ultimoLido.titulo}</h2>
              <p className="text-xl opacity-80 mb-4">{ultimoLido.autor}</p>
              <StarRating rating={ultimoLido.nota} />
            </div>
          </section>
        )}

        <section>
          {renderPrateleira("📖 Lendo Agora", "lendo")}
          {renderPrateleira("✅ Já Li", "finalizado")}
          {renderPrateleira("⏳ Quero Ler", "quero-ler")}
        </section>

        <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold mb-6">Novo Livro</h2>
          <BookForm onSave={(n) => setLivros([...livros, n])} />
        </section>
      </main>
    </div>
  );
}

export default App;
