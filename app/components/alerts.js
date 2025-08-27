"use client";
import { useEffect, useRef, useState } from "react";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const previousAlertIds = useRef(new Set());

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch("/api/alert");
        const data = await res.json();

        const newAlertIds = new Set(data.map((a) => a.id));
        const hasNewAlert = data.some((a) => !previousAlertIds.current.has(a.id));

        if (hasNewAlert) {
          const audio = new Audio("/sounds/alert.mp3");
          audio.play().catch((e) => console.log("Audio playback failed:", e));
        }

        previousAlertIds.current = newAlertIds;
        setAlerts(data);
      } catch (error) {
        console.error("Erreur de récupération des alertes :", error);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch("/api/alert", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setAlerts(alerts.filter((a) => a.id !== id));
      setSelectedAlert(null);
      previousAlertIds.current.delete(id);
    } catch (error) {
      console.error("Erreur de suppression :", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🔔 Alertes de sécurité</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {alerts.map((alert, index) => (
          <div
            key={alert.id ?? index}
            className="cursor-pointer p-4 bg-white rounded-lg shadow hover:shadow-md transition"
            onClick={() => setSelectedAlert(alert)}
          >
            <h2 className="text-xl font-semibold text-red-600">
              ⚠️ Plaque : {alert.plate}
            </h2>
            <p className="text-gray-700">Statut : {alert.status}</p>
            <p className="text-gray-500 text-sm">Heure : {alert.time}</p>
          </div>
        ))}
      </div>

      {selectedAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4 text-red-600">
              🚗 Autorisation d'accès au parking
            </h3>
            <p>
              <strong>Plaque :</strong> {selectedAlert.plate}
            </p>
            <p>
              <strong>Statut :</strong> {selectedAlert.status}
            </p>
            <p>
              <strong>Heure :</strong> {selectedAlert.time}
            </p>

            {/* 👉 Affichage de l'image de la plaque */}
            <div className="mt-4">
              <img
                src={`/output_plaques/${selectedAlert.plate}.jpg`}
                alt={`Image de la plaque ${selectedAlert.plate}`}
                className="w-full h-auto rounded shadow"
                onError={(e) => {
                  e.target.style.display = "none"; // cache l'image si elle n'existe pas
                }}
              />
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => handleDelete(selectedAlert.id)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                OK
              </button>
              <button
                onClick={() => setSelectedAlert(null)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
