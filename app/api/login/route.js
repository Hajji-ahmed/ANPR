// import mysql from 'mysql2/promise';
// import bcrypt from 'bcrypt';

// // POST /api/login
// export async function POST(req) {
//   try {
//     const { email, password } = await req.json();

//     if (!email || !password) {
//       return new Response(JSON.stringify({ error: 'Email et mot de passe requis' }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }

//     // Connexion à MySQL
//     const connection = await mysql.createConnection({
//       host: 'localhost',
//       user: 'root',
//       password: '', // ton mot de passe MySQL
//       database: 'anpr_system'
//     });

//     const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);

//     if (rows.length === 0) {
//       return new Response(JSON.stringify({ error: 'Utilisateur non trouvé' }), {
//         status: 404,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }

//     const user = rows[0];
//     const match = await bcrypt.compare(password, user.password);

//     if (!match) {
//       return new Response(JSON.stringify({ error: 'Mot de passe incorrect' }), {
//         status: 401,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }

//     return new Response(JSON.stringify({ message: 'Connexion réussie', user }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' }
//     });

//   } catch (error) {
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }
// }
