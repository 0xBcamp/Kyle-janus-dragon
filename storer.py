import os
import requests
import telebot
from dotenv import load_dotenv

def store_stuff(notif_info):
    user_id, first_name = notif_info[0][0], notif_info[0][1]

    cnx = connect_to_db()
    if cnx is not None:
        try:
            cursor = cnx.cursor()
            # Check if user already exists
            check_user_query = "SELECT user_id FROM users WHERE user_id = %s"
            cursor.execute(check_user_query, (user_id,))
            user_exists = cursor.fetchone()

            if user_exists:
                print(f"User already exists with user_id: {user_id}")
            else:
                # User does not exist, add the user
                add_user(cnx, user_id, first_name)

        except mysql.connector.Error as err:
            print(f"Error: {err}")
        finally:
            cursor.close()
            cnx.close()

def connect_to_db():
    load_dotenv()
    DB_USER = os.getenv('DB_USER')
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    DB_HOST = os.getenv('DB_HOST')
    DB_DATABASE = os.getenv('DB_DATABASE')

    config = {
        'user': DB_USER,
        'password': DB_PASSWORD,
        'host': DB_HOST,
        'database': 'tg_db',
        'raise_on_warnings': True
    }

    try:
        response = requests.get(url, headers=headers, params=parameters)
        response.raise_for_status()  # Raise an exception for bad requests
        data = response.json()

        # Extract the Bitcoin price from the response
        bitcoin_price = data['data'][0]['quote']['USD']['price']

        return bitcoin_price

    except requests.exceptions.RequestException as e:
        print(f"Error fetching Bitcoin price: {e}")
        return None

def add_user(cnx, user_id, user_first_name):
    try:
        cursor = cnx.cursor()
        add_user_query = """
        INSERT INTO users (user_id, first_name)
        VALUES (%s, %s);
        """
        cursor.execute(add_user_query, (user_id, user_first_name))
        cnx.commit()
        print(f"User added with user_id: {user_id}")

    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        cursor.close()

# Example usage
# store_stuff([(12345, 'John')])
