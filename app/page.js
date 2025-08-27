'use client';
// import LoginPage from './components/login';
import Alerts from './components/alerts';
import ChatbotWidget from './components/ChatbotWidget';
import Chatbot from './components/Chatbot';
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
export default function Page() {
  const [plaques, setPlaques] = useState([]);
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [newPlaque, setNewPlaque] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const plaquesParPage = 6;
  
  const exportPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Rapport des véhicules détectés', 14, 20);

  // ➕ Ajout du total des plaques détectées
  doc.setFontSize(12);
  doc.text(`Nombre total de plaques détectées : ${plaques.length}`, 14, 30);

  const tableColumn = ["N° Plaque", "Date de détection"];
  const tableRows = plaques.map(plaque => [
    plaque.numero_plaque,
    new Date(plaque.date_detection).toLocaleString()
  ]);

  autoTable(doc, {
    startY: 40, // décalé car on a ajouté une ligne au-dessus
    head: [tableColumn],
    body: tableRows,
    styles: { fontSize: 10 },
  });

  doc.save(`rapport_plaques_${new Date().toISOString().slice(0,10)}.pdf`);
};



  useEffect(() => {
    fetchPlaques();
  }, []);

  async function fetchPlaques() {
    try {
      const res = await fetch('/plaques');
      if (!res.ok) throw new Error('Erreur chargement');
      const data = await res.json();
      setPlaques(data);
    } catch (error) {
      console.error('❌ API fetch error:', error);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!newPlaque.trim()) return;

    try {
      const res = await fetch('/plaques', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numero_plaque: newPlaque.trim().toUpperCase() }),
      });
      if (res.ok) {
        setNewPlaque('');
        fetchPlaques();
      }
    } catch (error) {
      console.error('❌ Erreur ajout:', error);
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch('/plaques', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setPlaques(prev => prev.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('❌ Erreur suppression:', error);
    }
  }

  const filtered = plaques
    .filter(p => p.numero_plaque.toLowerCase().includes(search.toLowerCase()))
    .filter(p => date === '' || p.date_detection.startsWith(date));

  const indexOfLast = currentPage * plaquesParPage;
  const indexOfFirst = indexOfLast - plaquesParPage;
  const currentPlaques = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / plaquesParPage);

  const today = new Date().toISOString().slice(0, 10);
  const totalToday = plaques.filter(p => p.date_detection.startsWith(today)).length;

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-orange-600 dark:text-orange-400">
        📷 Plaques détectées
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Colonne gauche - Fonctions */}
        <aside className="lg:w-1/3 bg-blue-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-4">
          <input
            type="text"
            placeholder="🔍 Rechercher plaque"
            className="w-full px-4 py-2 rounded border dark:bg-gray-700 dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <input
            type="date"
            className="w-full px-4 py-2 rounded border dark:bg-gray-700 dark:text-white"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <div className="text-sm font-semibold text-blue-700 dark:text-blue-300">
            📊 Plaques aujourd’hui : {totalToday}
          </div>

          <form onSubmit={handleAdd} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Ajouter une plaque"
              className="px-3 py-2 rounded border dark:bg-gray-700 dark:text-white"
              value={newPlaque}
              onChange={(e) => setNewPlaque(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              ➕ Ajouter
            </button>
            <button
  onClick={exportPDF}
  className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
>
  📄 Exporter PDF
</button>

          </form>
        </aside>

        {/* Colonne droite - Images */}
        <section className="flex-1">
          {currentPlaques.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Aucune plaque détectée.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {currentPlaques.map((plaque) => {
                const imagePath = `/output_plaques/${plaque.numero_plaque}.jpg`;
                return (
                  <div
                    key={plaque.id}
                    className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow relative border border-gray-200 dark:border-gray-700"
                  >
                    <img
                      src={imagePath}
                      alt={`Plaque ${plaque.numero_plaque}`}
                      className="w-full h-48 object-contain rounded mb-3 bg-gray-100 dark:bg-gray-700"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                    <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                      🚗 {plaque.numero_plaque}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      🕒 {new Date(plaque.date_detection).toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleDelete(plaque.id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2 flex-wrap">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-full border ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
                  } hover:scale-105 transition`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
     <ChatbotWidget />
     <Alerts />
      {/* <LoginPage /> */}
    </main>
  );
}
