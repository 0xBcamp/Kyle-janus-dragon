import mysql.connector
import os
from dotenv import load_dotenv

def connect_to_db():
    load_dotenv()
    DB_USER = os.getenv('DB_USER')
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    DB_HOST = os.getenv('DB_HOST')

    config={
        'user': DB_USER,
        'password': DB_PASSWORD,
        'host': DB_HOST,
        'database': 'tg_db',
        'raise_on_warnings': True
    }

    try:
        cnx = mysql.connector.connect(**config)
        print("Connection established")
        return cnx
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None

def add_user(user_id, user_first_name):
    cnx = connect_to_db()
    if cnx is not None:
        try:
            cursor = cnx.cursor()
            add_user_query = """
            INSERT INTO users (user_id, first_name)
            VALUES (%s, %s)
            ON DUPLICATE KEY UPDATE user_id = user_id;
            """
            cursor.execute(add_user_query, (user_id, user_first_name))
            cnx.commit()

            # Check the number of affected rows
            if cursor.rowcount == 1:
                print(f"User added with user_id: {user_id}")
            else:
                print(f"User already exists with user_id: {user_id}")

        except mysql.connector.Error as err:
            print(f"Error: {err}")
        finally:
            cursor.close()
            cnx.close()
