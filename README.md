🚗 ANPR Project – Automatic Number Plate Recognition
📌 Description

Ce projet est un système de reconnaissance automatique des plaques d’immatriculation.
Il combine :

YOLOv8 pour la détection des plaques.

Tesseract OCR (ou modèles personnalisés) pour la reconnaissance des caractères.

MySQL pour la gestion des utilisateurs et plaques autorisées.

Next.js pour l’interface web (visualisation, alertes, gestion des plaques, chatbot).

Python backend pour l’inférence (détection/reconnaissance) et l’intégration MySQL.

📂 Structure du projet
ANPR_PROJECT/
│── app/                   # Application Next.js
│   ├── api/               # Routes API (login, plaques, alertes, etc.)
│   ├── chatbot/           # Chatbot intégré
│   ├── components/        # Composants React (UI réutilisables)
│   ├── plaques/           # Gestion et affichage des plaques
│   ├── layout.js          # Layout global
│   ├── page.js            # Page principale
│   └── globals.css        # Styles globaux
│
│── backend/               # Partie traitement d’images et ANPR
│   ├── images/            # Images d’entrée
│   ├── output_plaques/    # Résultats des plaques détectées
│   ├── utils/             # Fonctions utilitaires
│   ├── yolo/              # Modèles YOLO
│   ├── coco1.txt          # Labels classes YOLO
│   └── main1.py           # Script principal ANPR (Python)
│
│── database/              # Scripts SQL pour MySQL
│── public/                # Fichiers statiques (images, icônes, etc.)
│── .env.local             # Variables d’environnement
│── package.json           # Dépendances Next.js
│── README.md              # 📖 Documentation projet

⚙️ Installation
1️⃣ Cloner le projet
git clone https://github.com/votre-nom/ANPR_PROJECT.git
cd ANPR_PROJECT

2️⃣ Installer les dépendances frontend
npm install

3️⃣ Installer les dépendances backend Python

Créer un environnement virtuel puis installer :

pip install -r requirements.txt


Exemple de requirements.txt :

opencv-python
ultralytics
numpy
pytesseract
pandas
mysql-connector-python
requests

4️⃣ Base de données MySQL

Exécuter le script suivant :

CREATE DATABASE anpr_system;
USE anpr_system;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE plaques (
  id SERIAL PRIMARY KEY,
  numero_plaque VARCHAR(50) UNIQUE NOT NULL,
  date_detection TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

🚀 Utilisation
1️⃣ Lancer le backend Python
cd backend
python main1.py

2️⃣ Lancer le frontend Next.js
npm run dev


Puis ouvrir 👉 http://localhost:3000
.

🔑 Authentification

Un système de login simple avec MySQL est intégré (/api/login).

Les utilisateurs doivent exister dans la table users.

Une fois connecté, accès à l’interface principale :

📷 Plaques détectées

📄 Export PDF

🔔 Alertes de sécurité

🤖 Chatbot intégré

📊 Fonctionnalités

✅ Détection de plaques avec YOLOv8
✅ Reconnaissance OCR (Tesseract ou CRNN/TrOCR)
✅ Sauvegarde et gestion des plaques autorisées/refusées
✅ Alertes en temps réel (interface Next.js)
✅ Export PDF des plaques détectées
✅ Authentification utilisateur (login)
✅ Chatbot intégré pour assistance

📸 Exemple de fonctionnement

Détection d’une voiture → Extraction de la plaque

Vérification dans la base MySQL

🔔 Si inconnue → Alerte envoyée dans l’interface

📄 Possibilité d’exporter toutes les détections en PDF

🛠️ Technologies

Frontend : Next.js, React, TailwindCSS

Backend : Python (YOLOv8, OpenCV, Tesseract, MySQL)

Database : MySQL

OCR : Tesseract / CRNN / TrOCR

📌 Auteur

👨‍💻 Développé par Ahmed Hajji
