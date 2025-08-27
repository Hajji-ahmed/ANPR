# ANPR Project – Automatic Number Plate Recognition

## Description

Ce projet est un système de reconnaissance automatique des plaques d’immatriculation. Il combine plusieurs technologies pour détecter et reconnaître les plaques, gérer les données via une base de données et fournir une interface web interactive.

Il utilise :

  * **YOLOv8** pour la détection des plaques.
  * **Tesseract OCR** (ou modèles personnalisés) pour la reconnaissance des caractères.
  * **MySQL** pour la gestion des utilisateurs et des plaques autorisées.
  * **Next.js** pour l’interface web (visualisation, alertes, gestion des plaques, chatbot).
  * Un backend **Python** pour l’inférence (détection/reconnaissance) et l’intégration avec MySQL.

-----

## Structure du projet

```bash
ANPR_PROJECT/
├── app/                   # Application Next.js
│   ├── api/               # Routes API (login, plaques, alertes, etc.)
│   ├── chatbot/           # Chatbot intégré
│   ├── components/        # Composants React (UI réutilisables)
│   ├── plaques/           # Gestion et affichage des plaques
│   ├── layout.js          # Layout global
│   ├── page.js            # Page principale
│   └── globals.css        # Styles globaux
│
├── backend/               # Partie traitement d’images et ANPR
│   ├── images/            # Images d’entrée
│   ├── output_plaques/    # Résultats des plaques détectées
│   ├── utils/             # Fonctions utilitaires
│   ├── yolo/              # Modèles YOLO
│   ├── coco1.txt          # Labels classes YOLO
│   └── main1.py           # Script principal ANPR (Python)
│
├── database/              # Scripts SQL pour MySQL
├── public/                # Fichiers statiques (images, icônes, etc.)
├── .env.local             # Variables d’environnement
├── package.json           # Dépendances Next.js
└── README.md              # Documentation du projet
```

-----

## Installation

1.  **Cloner le projet**

    ```bash
    git clone https://github.com/votre-nom/ANPR_PROJECT.git
    cd ANPR_PROJECT
    ```

2.  **Installer les dépendances frontend**

    ```bash
    npm install
    ```

3.  **Installer les dépendances backend Python**

    Créez un environnement virtuel, puis installez les dépendances :

    ```bash
    pip install -r requirements.txt
    ```

    Exemple de `requirements.txt` :

    ```
    opencv-python
    ultralytics
    numpy
    pytesseract
    pandas
    mysql-connector-python
    requests
    ```

4.  **Base de données MySQL**

    Exécutez le script SQL suivant pour créer la base de données et les tables nécessaires :

    ```sql
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
    ```

-----

## Utilisation

1.  **Lancer le backend Python**

    ```bash
    cd backend
    python main1.py
    ```

2.  **Lancer le frontend Next.js**

    ```bash
    npm run dev
    ```

    Ouvrez votre navigateur et rendez-vous sur `http://localhost:3000`.

-----

## Fonctionnalités

  * **Détection de plaques** avec YOLOv8.
  * **Reconnaissance OCR** (Tesseract ou CRNN/TrOCR).
  * **Sauvegarde et gestion des plaques** autorisées/refusées.
  * **Alertes en temps réel** sur l’interface Next.js.
  * **Export PDF** des plaques détectées.
  * **Authentification utilisateur** (login).
  * **Chatbot** intégré pour l'assistance.

-----

## Exemple de fonctionnement

Le système détecte une voiture et en extrait la plaque. Il vérifie ensuite cette plaque dans la base de données MySQL. Si la plaque est inconnue, une alerte est envoyée à l’interface web. Il est également possible d'exporter toutes les détections en format PDF.

-----

## Technologies

  * **Frontend :** Next.js, React, TailwindCSS
  * **Backend :** Python (YOLOv8, OpenCV, Tesseract, MySQL)
  * **Base de données :** MySQL
  * **OCR :** Tesseract / CRNN / TrOCR

-----

## Auteur

Développé par Ahmed Hajji.
