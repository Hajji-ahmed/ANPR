import mysql from 'mysql2/promise';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function connectToDB() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
}

export async function POST(req) {
  try {
    const { question } = await req.json();

    if (!question || question.trim() === '') {
      return new Response(JSON.stringify({ error: '❗ Question manquante.' }), { status: 400 });
    }

    // Étape 1 : Générer requête SQL avec Gemini
    const sqlPrompt = `
Tu es un assistant SQL. Génère UNIQUEMENT une requête SQL sans explication.
La table s'appelle plaques (id, numero_plaque, date_detection [DATETIME]).

Exemples :
- "Combien de plaques aujourd’hui ?" → SELECT COUNT(*) FROM plaques WHERE date_detection LIKE '2025-08-01%';
- "Ajoute la plaque 123XYZ" → INSERT INTO plaques (numero_plaque, date_detection) VALUES ('123XYZ', NOW());
- "Supprime la plaque 123XYZ" → DELETE FROM plaques WHERE numero_plaque = '123XYZ';

Question : ${question}

⚠️ Réponds UNIQUEMENT par une requête SQL valide.
`;

    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' });
    const sqlResult = await model.generateContent(sqlPrompt);
    let sql = sqlResult.response.text().trim();
    sql = sql.replace(/```sql|```/gi, '').trim();
    const lowerSql = sql.toLowerCase();

    if (!['select', 'insert', 'delete'].some(cmd => lowerSql.startsWith(cmd))) {
      return new Response(JSON.stringify({
        error: '🚫 Seules les requêtes SELECT, INSERT et DELETE sont autorisées.',
      }), { status: 400 });
    }

    // Étape 2 : Exécuter la requête SQL
    const db = await connectToDB();
    const [rows] = await db.execute(sql);
    await db.end();

    const isSelect = lowerSql.startsWith('select');
    const responseText = isSelect
      ? `Résultats obtenus : ${JSON.stringify(rows, null, 2)}`
      : `✅ Opération "${lowerSql.split(' ')[0].toUpperCase()}" réussie.`;

    // Étape 3 : Générer un rapport clair avec Gemini (pas de SQL ici)
    const reportPrompt = `
Tu es un assistant pour un système de détection de plaques.
Voici une réponse obtenue suite à la question suivante : "${question}".

${responseText}

✅ Rédige un rapport clair, bien structuré en français (avec un titre, résumé, données clés et observations si pertinent).
❌ Ne réécris pas de SQL.
`;

    const reportModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const reportResult = await reportModel.generateContent(reportPrompt);
    const reportText = reportResult.response.text().trim();

    return new Response(JSON.stringify({
      result: isSelect ? rows : [],
      message: isSelect ? undefined : '✅ Opération effectuée avec succès.',
      sql,
      report: reportText,
    }), { status: 200 });

  } catch (err) {
    console.error('❌ Erreur API chatbot:', err);
    return new Response(JSON.stringify({ error: 'Erreur serveur inattendue.' }), { status: 500 });
  }
}
