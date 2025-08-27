import { v4 as uuidv4 } from "uuid"; // si tu peux utiliser uuid, sinon fais un id simple

let alertStorage = [];

// POST : recevoir une alerte
export async function POST(request) {
  try {
    const body = await request.json();
    const { plate, reason, time } = body;

    const newAlert = {
      id: uuidv4(),   // <-- ajoute un id unique
      plate,
      status: reason,
      time: time || new Date().toISOString(),
    };

    alertStorage.push(newAlert);

    if (global.io) {
      global.io.emit("plate_alert", newAlert);
    }

    return new Response(JSON.stringify({ message: "Alerte reçue !" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Erreur API POST :", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// GET : obtenir toutes les alertes
export async function GET() {
  try {
    return new Response(JSON.stringify(alertStorage), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Erreur API GET :", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// DELETE : supprimer alerte par id (plus simple)
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "Paramètre id manquant" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    alertStorage = alertStorage.filter((alert) => alert.id !== id);

    return new Response(JSON.stringify({ message: "Alerte supprimée" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Erreur API DELETE :", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
