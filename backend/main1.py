import os
import cv2
import pandas as pd
from ultralytics import YOLO
import numpy as np
import pytesseract
from datetime import datetime
import mysql.connector
import requests
from datetime import datetime

def send_alert_to_nextjs(plate_number, reason="refusée"):
    url = url = "http://localhost:3000/api/alert"

    data = {
        "plate": plate_number,
        "reason": reason,
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            print("[ALERTE] Alerte envoyée avec succès.")
        else:
            print(f"[ALERTE] Échec de l’envoi : {response.status_code}")
    except Exception as e:
        print(f"[ERREUR] Impossible d’envoyer l’alerte : {e}")
# 📌 Configuration de Tesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# 📦 Chargement du modèle YOLOv8
model = YOLO('yolo/best.pt') 

# 🔗 Connexion MySQL
def connect_to_mysql():
    try:
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="anpr_system",
            autocommit=True
        )
        print("✅ Connexion MySQL réussie.")
        return db
    except mysql.connector.Error as err:
        print(f"❌ MySQL erreur : {err}")
        return None

# 🧹 Nettoyage du texte OCR
def clean_plate_text(text):
    cleaned = ''.join(e for e in text if e.isalnum()).upper()
    return cleaned if len(cleaned) >= 4 else None

# ✅ Gérer l'accès selon la présence dans la BDD
def gerer_acces(db, numero):
    try:
        cursor = db.cursor()

        # 🔍 Vérifie si la plaque est déjà autorisée
        check_sql = "SELECT id FROM plaques WHERE numero_plaque = %s"
        cursor.execute(check_sql, (numero,))
        result = cursor.fetchone()

        if result:
            print(f"✅ Accès autorisé – ouverture de porte ({numero})")

            # 📝 Optionnel : enregistrer dans historique, logs, etc.
            # current_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            # cursor.execute("INSERT INTO historique (numero_plaque, date_detection) VALUES (%s, %s)", (numero, current_datetime))

        else:
            print(f"❌ Accès refusé – plaque non reconnue ({numero})")

            # 🚨 Envoyer l'alerte à Next.js
            send_alert_to_nextjs(numero, reason="🚨Accès refusé – plaque non reconnue")

            # ⚠️ Ne pas insérer la plaque dans la base

    except mysql.connector.Error as err:
        print(f"❌ Erreur MySQL : {err}")
    finally:
        cursor.close()


# 📄 Chargement des classes
with open("coco1.txt", "r") as f:
    class_list = f.read().splitlines()

# 📁 Dossiers
images_path = 'images'
output_path = os.path.join(os.getcwd(),'..', 'public', 'output_plaques')  # 📍 vers public/output_plaques
os.makedirs(output_path, exist_ok=True)

# 🚀 Démarrage
db = connect_to_mysql()
image_files = [f for f in os.listdir(images_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]

for img_file in image_files:
    img_path = os.path.join(images_path, img_file)
    image = cv2.imread(img_path)
    if image is None:
        print(f"❌ Erreur lecture image : {img_file}")
        continue

    image = cv2.resize(image, (1020, 500))
    results = model.predict(image)
    boxes = results[0].boxes.data

    if boxes is None or len(boxes) == 0:
        print(f"🚫 Aucune plaque détectée dans : {img_file}")
        continue

    for i, row in pd.DataFrame(boxes).astype("float").iterrows():
        x1, y1, x2, y2 = map(int, row[:4])
        class_id = int(row[5])
        label = class_list[class_id] if class_id < len(class_list) else 'Unknown'

        # 📸 Extraction de la plaque
        crop = image[y1:y2, x1:x2]
        gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
        gray = cv2.bilateralFilter(gray, 10, 20, 20)

        # 🔍 OCR
        text = pytesseract.image_to_string(gray, config='--psm 8 --oem 3').strip()
        cleaned_text = clean_plate_text(text)

        if cleaned_text:
            # 🔐 Vérification de l'accès
            gerer_acces(db, cleaned_text)

            # 💾 Sauvegarde de l'image (optionnelle)
            plaque_filename = os.path.join(output_path, f"{cleaned_text}.jpg")

            cv2.imwrite(plaque_filename, crop)

            # 🖼️ Affichage
            cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(image, cleaned_text, (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
            cv2.imshow("Plaque détectée", crop)

    cv2.imshow("Résultat", image)
    key = cv2.waitKey(0)
    if key == 27:  # ESC
        break

cv2.destroyAllWindows()
if db and db.is_connected():
    db.close()
    print("✅ Connexion MySQL fermée.")
































# import os
# import cv2
# import pandas as pd
# from ultralytics import YOLO
# import numpy as np
# import tensorflow as tf
# import pickle
# from datetime import datetime
# import mysql.connector
# from tensorflow.keras import backend as K
# from PIL import Image

# # Chargement du modèle YOLOv8
# model = YOLO('best.pt')

# # Connexion à MySQL
# def connect_to_mysql():
#     try:
#         db = mysql.connector.connect(
#             host="localhost",
#             user="root",
#             password="",
#             database="anpr_system",
#             autocommit=True
#         )
#         print("✅ Connexion MySQL réussie.")
#         return db
#     except mysql.connector.Error as err:
#         print(f"❌ MySQL erreur : {err}")
#         return None

# # Insertion dans la base
# def inserer_plaque(db, numero):
#     try:
#         cursor = db.cursor()
#         current_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

#         check_sql = """
#         SELECT id FROM plaques 
#         WHERE numero_plaque = %s 
#         AND date_detection >= NOW() - INTERVAL 5 MINUTE
#         """
#         cursor.execute(check_sql, (numero,))
#         result = cursor.fetchone()

#         if not result:
#             insert_sql = """
#             INSERT INTO plaques (numero_plaque, date_detection) 
#             VALUES (%s, %s)
#             """
#             cursor.execute(insert_sql, (numero, current_datetime))
#             db.commit()
#             print(f"✅ Enregistrée : {numero}")
#         else:
#             print(f"⏭️ Déjà enregistrée récemment : {numero}")
#     except mysql.connector.Error as err:
#         print(f"❌ Erreur insertion : {err}")
#     finally:
#         cursor.close()

# # Chargement du vocabulaire
# with open("vocab.pkl", "rb") as f:
#     vocab_data = pickle.load(f)
#     char_to_num = vocab_data["char_to_num"]
#     num_to_char = vocab_data["num_to_char"]
#     vocab = vocab_data["vocab"]

# # Chargement du modèle CRNN
# crnn_model = tf.keras.models.load_model("plaque_model.h5", compile=False)

# def decode_prediction(pred, num_to_char):
#     input_len = np.ones(pred.shape[0]) * pred.shape[1]
#     results = K.ctc_decode(pred, input_length=input_len, greedy=True)[0][0]

#     output_text = []
#     for res in results:
#         decoded = []
#         for k in res:
#             k = int(k)
#             if k == -1 or k >= len(num_to_char):
#                 continue
#             decoded.append(num_to_char[k])
#         output_text.append(''.join(decoded))

#     return output_text[0] if output_text else None

# def preprocess_for_crnn(img, img_width=200, img_height=50):
#     img_pil = Image.fromarray(img).convert('L')
#     img_pil = img_pil.resize((img_width, img_height))
#     img_array = np.array(img_pil) / 255.0
#     img_array = img_array.T  # Transposé pour CRNN
#     return img_array

# # Chargement des classes
# with open("coco1.txt", "r", encoding="utf-8") as f:
#     class_list = f.read().splitlines()

# # Dossiers
# images_path = 'images'
# output_path = 'output_plaques'
# os.makedirs(output_path, exist_ok=True)

# # Démarrage
# db = connect_to_mysql()
# image_files = [f for f in os.listdir(images_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]

# for img_file in image_files:
#     img_path = os.path.join(images_path, img_file)
#     image = cv2.imread(img_path)
#     if image is None:
#         print(f"❌ Erreur lecture image : {img_file}")
#         continue

#     image = cv2.resize(image, (1020, 500))
#     results = model.predict(image)
#     boxes = results[0].boxes.data

#     if boxes is None or len(boxes) == 0:
#         print(f"🚫 Aucune plaque détectée dans : {img_file}")
#         continue

#     for i, row in pd.DataFrame(boxes).astype("float").iterrows():
#         x1, y1, x2, y2 = map(int, row[:4])
#         class_id = int(row[5])
#         label = class_list[class_id] if class_id < len(class_list) else 'Unknown'

#         # Crop et prétraitement
#         crop = image[y1:y2, x1:x2]
#         try:
#             img_crnn = preprocess_for_crnn(crop)
#             img_crnn = np.expand_dims(img_crnn, axis=(0, -1))  # (1, width, height, 1)

#             pred = crnn_model.predict(img_crnn)
#             text = decode_prediction(pred, num_to_char)

#             if text and len(text) >= 3:
#                 inserer_plaque(db, text)

#                 # Sauvegarde et affichage
#                 plaque_filename = os.path.join(output_path, f"{text}_{img_file}")
#                 cv2.imwrite(plaque_filename, crop)

#                 cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
#                 cv2.putText(image, text, (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
#                 cv2.imshow("Plaque détectée", crop)
#         except Exception as e:
#             print(f"⚠️ Erreur OCR sur {img_file}: {e}")

#     cv2.imshow("Résultat", image)
#     key = cv2.waitKey(0)
#     if key == 27:
#         break

# cv2.destroyAllWindows()
# if db and db.is_connected():
#     db.close()
#     print("✅ Connexion MySQL fermée.")
