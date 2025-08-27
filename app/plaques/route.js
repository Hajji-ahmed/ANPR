import mysql from 'mysql2/promise';

async function connectToDB() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
}

export async function GET() {
  try {
    const connection = await connectToDB();
    const [rows] = await connection.execute(
      'SELECT * FROM plaques ORDER BY date_detection DESC'
    );
    await connection.end();

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('GET error:', error);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  try {
    const { numero_plaque } = await request.json();

    if (!numero_plaque) {
      return new Response(JSON.stringify({ error: 'Champ manquant' }), {
        status: 400,
      });
    }

    const connection = await connectToDB();
    await connection.execute(
      'INSERT INTO plaques (numero_plaque, date_detection) VALUES (?, NOW())',
      [numero_plaque]
    );
    await connection.end();

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500,
    });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID manquant' }), {
        status: 400,
      });
    }

    const connection = await connectToDB();
    await connection.execute('DELETE FROM plaques WHERE id = ?', [id]);
    await connection.end();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500,
    });
  }
}
  