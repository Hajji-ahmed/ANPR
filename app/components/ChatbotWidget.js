'use client';
import { useState } from 'react';
import { X, MessageCircle } from 'lucide-react'; // icons, tu peux installer `lucide-react` ou remplacer
import Chatbot from './Chatbot';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Bouton flottant */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
        >
          {isOpen ? <X /> : <MessageCircle />}
        </button>
      </div>

      {/* Fenêtre de chat */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-[600px] h-[700px] bg-white dark:bg-gray-900 border rounded-lg shadow-2xl z-50 overflow-hidden">
          <Chatbot />
        </div>
      )}
    </>
  );
}
