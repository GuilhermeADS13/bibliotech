import React, { useState } from 'react';
import { StarRating } from './StarRating';

export function BookForm({ onSave }) {
  const [loading, setLoading] = useState(false);
  const [nota, setNota] = useState(0);
  const [formData, setFormData] = useState({
    titulo: '', autor: '', genero: '', dataTermino: '', status: 'quero-ler', capa: ''
  });

  const buscarNoGoogleBooks = async () => {
    if (!formData.titulo) return;
    setLoading(true);
    try {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(formData.titulo)}`);
      const data = await res.json();
      if (data.items?.[0]) {
        const info = data.items[0].volumeInfo;
        setFormData({
          ...formData,
          titulo: info.title,
          autor: info.authors?.join(', ') || 'Desconhecido',
          genero: info.categories?.[0] || '',
          capa: info.imageLinks?.thumbnail?.replace('http:', 'https:') || ''
        });
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, nota, id: Date.now() });
    setFormData({ titulo: '', autor: '', genero: '', dataTermino: '', status: 'quero-ler', capa: '' });
    setNota(0);
    e.target.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Título do Livro"
          value={formData.titulo}
          className="flex-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={e => setFormData({...formData, titulo: e.target.value})}
        />
        <button
          type="button"
          onClick={buscarNoGoogleBooks}
          className="bg-amber-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-amber-600 transition"
        >
          {loading ? "..." : "🔍 Buscar"}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Autor"
          value={formData.autor}
          className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={e => setFormData({...formData, autor: e.target.value})}
        />
        <select
          className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
          value={formData.status}
          onChange={e => setFormData({...formData, status: e.target.value})}
        >
          <option value="quero-ler">Quero Ler</option>
          <option value="lendo">Lendo</option>
          <option value="finalizado">Finalizado</option>
        </select>
        <input
          type="date"
          className="p-3 border rounded-xl"
          onChange={e => setFormData({...formData, dataTermino: e.target.value})}
        />
        <div className="flex items-center justify-center p-3 border rounded-xl bg-gray-50 gap-4">
          <span className="text-xs text-gray-500">Nota:</span>
          <StarRating rating={nota} setRating={setNota} interactive={true} />
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-black hover:bg-indigo-700 transition"
      >
        ADICIONAR
      </button>
    </form>
  );
}
