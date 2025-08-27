'use client';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { jsPDF } from 'jspdf';

export default function Chatbot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('chatMessages');
    if (stored) setMessages(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: uuidv4(), from: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);

    const loadingMessage = { id: uuidv4(), from: 'bot', text: '⏳ Traitement en cours...' };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      const res = await fetch('/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });

      const data = await res.json();
      setMessages((prev) => prev.filter((m) => m.id !== loadingMessage.id));

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { id: uuidv4(), from: 'bot', text: '❌ Erreur : ' + data.error },
        ]);
      } else {
        if (data.message) {
          setMessages((prev) => [
            ...prev,
            { id: uuidv4(), from: 'bot', text: '✅ ' + data.message },
          ]);
        }

        if (Array.isArray(data.result) && data.result.length > 0) {
          const table = renderResult(data.result);
          setMessages((prev) => [
            ...prev,
            { id: uuidv4(), from: 'bot', text: table },
          ]);
        }

        if (data.report) {
          // NE PAS afficher dans messages, mais stocker dans reports
          setReports((prev) => [...prev, { id: uuidv4(), content: data.report }]);
        }

        if (!data.message && !data.result && !data.report) {
          setMessages((prev) => [
            ...prev,
            { id: uuidv4(), from: 'bot', text: 'ℹ️ Aucune donnée trouvée.' },
          ]);
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== loadingMessage.id),
        { id: uuidv4(), from: 'bot', text: '❌ Erreur serveur inattendue' },
      ]);
    }

    setInput('');
  };

  const renderResult = (rows) => {
    const headers = Object.keys(rows[0]);
    return {
      type: 'table',
      headers,
      rows,
    };
  };

 const downloadAllReports = () => {
  if (reports.length === 0) {
    alert('Aucun rapport disponible.');
    return;
  }

  const doc = new jsPDF();
  let y = 10;

  doc.setFontSize(16);
  doc.text('Rapport Chatbot - Détection de plaques', 10, y);
  y += 10;

  reports.forEach((rep, index) => {
    doc.setFontSize(12);
    doc.text(`Rapport ${index + 1}`, 10, y);
    y += 8;

    // Nettoyer le Markdown (simplifié)
    const cleaned = rep.content
      .replace(/#+ /g, '')                // titres
      .replace(/\*\*/g, '')              // gras
      .replace(/\*/g, '-')               // puces
      .replace(/\|/g, '')                // barres de tableau
      .replace(/---/g, '')               // séparateurs tableau
      .replace(/`/g, '')                 // code
      .replace(/\r?\n/g, '\n');          // retours à la ligne

    const lines = doc.splitTextToSize(cleaned, 180);
    lines.forEach((line) => {
      if (y >= 280) {
        doc.addPage();
        y = 10;
      }
      doc.text(line, 10, y);
      y += 6;
    });

    y += 5;
  });

  doc.save('rapports-plaques.pdf');
};


  const renderMessage = (msg) => {
    if (typeof msg.text === 'string') {
      return <p className="whitespace-pre-line">{msg.text}</p>;
    }

    if (msg.text?.type === 'table') {
      const { headers, rows } = msg.text;
      return (
        <div className="overflow-x-auto">
          <table className="table-auto border border-gray-400 text-sm mt-2">
            <thead>
              <tr className="bg-blue-100">
                {headers.map((head) => (
                  <th key={head} className="border px-2 py-1">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="even:bg-gray-100">
                  {headers.map((head) => (
                    <td key={head} className="border px-2 py-1">{row[head]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return <p>❗ Format de message inconnu.</p>;
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md w-full max-w-2xl mx-auto">
      <h2 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">
        💬 Chatbot Admin - Plaques
      </h2>

      {/* 📥 Télécharger tous les rapports */}
      <div className="flex justify-between mb-2">
        <div className="text-xs space-x-2">
          {[
            'Donne-moi toutes les plaques présentes dans la base de données avec leur date de détection. ?',
          
            'Ajoute la plaque 123XYZ',
            'Supprime la plaque 123XYZ',
           
          ].map((ex, i) => (
            <button
              key={i}
              onClick={() => setInput(ex)}
              className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
            >
              {ex}
            </button>
          ))}
        </div>
        <button
          onClick={downloadAllReports}
          className="bg-green-700 text-white text-xs px-3 py-1 rounded hover:bg-green-800"
        >
          📥 Télécharger PDF
        </button>
      </div>

      {/* Messages */}
      <div className="h-[32rem] overflow-y-auto border rounded p-2 mb-2 bg-gray-50 dark:bg-gray-800 text-sm space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${
              msg.from === 'user'
                ? 'text-right text-blue-700 font-semibold'
                : 'text-left text-orange-700'
            }`}
          >
            {renderMessage(msg)}
          </div>
        ))}
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pose ta question..."
          className="flex-1 p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}
