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
-----

## Installation

1.  **Cloner le projet**

    ```bash
    git clone https://github.com/Hajji-ahmed/ANPR.git
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

4.  **Base de données MySQL**

    Exécutez le script SQL suivant pour créer la base de données et les tables nécessaires :

    ```sql
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
  * **OCR :** Tesseract / TrOCR

-----

## Auteur

Développé par Ahmed Hajji.
