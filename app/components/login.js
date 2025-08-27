// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   // Rediriger si déjà connecté
//   useEffect(() => {
//     const user = localStorage.getItem('user');
//     if (user) {
//       router.replace('/page'); // remplace par ta page de dashboard
//     }
//   }, [router]);

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if (!email || !password) {
//       setMessage('❌ Veuillez remplir tous les champs.');
//       return;
//     }

//     setLoading(true);
//     setMessage('');

//     try {
//       const res = await fetch('/api/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         // Sauvegarder l'utilisateur dans localStorage
//         localStorage.setItem('user', JSON.stringify(data.user));
//         setMessage('✅ Connexion réussie ! Redirection...');
//         setTimeout(() => {
//           router.replace('/page'); // remplace par ta page de dashboard
//         }, 1000);
//       } else {
//         setMessage(`❌ ${data.error || 'Erreur inconnue'}`);
//       }
//     } catch (error) {
//       setMessage('❌ Erreur réseau ou serveur.');
//       console.error('Erreur login:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: '50px auto', padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
//       <h2>Connexion</h2>
//       <form onSubmit={handleLogin}>
//         <label htmlFor="email">Email :</label>
//         <input
//           id="email"
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           style={{ width: '100%', padding: 8, marginBottom: 10 }}
//           disabled={loading}
//           autoComplete="username"
//         />

//         <label htmlFor="password">Mot de passe :</label>
//         <input
//           id="password"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           style={{ width: '100%', padding: 8, marginBottom: 10 }}
//           disabled={loading}
//           autoComplete="current-password"
//         />

//         <button
//           type="submit"
//           style={{
//             width: '100%',
//             padding: 10,
//             background: '#0070f3',
//             color: '#fff',
//             border: 'none',
//             borderRadius: 4,
//             cursor: loading ? 'not-allowed' : 'pointer',
//             opacity: loading ? 0.7 : 1,
//           }}
//           disabled={loading}
//         >
//           {loading ? 'Connexion...' : 'Se connecter'}
//         </button>
//       </form>
//       {message && <p style={{ marginTop: 10 }}>{message}</p>}
//     </div>
//   );
// }
