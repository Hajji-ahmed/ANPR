import mysql.connector

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
        print(f"❌ Erreur MySQL : {err}")
        return None
