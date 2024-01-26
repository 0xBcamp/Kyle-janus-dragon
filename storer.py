import mysql.connector
import os
from dotenv import load_dotenv

#main function to store everything!
def store_stuff(notif_info):
    user_id, first_name = notif_info[0][0], notif_info[0][1]

    cnx = connect_to_db()
    if cnx is not None:
        try:
            # STEP 1: Check if user already exists, if they don't store them in the database!
            if not does_user_already_exist(cnx, user_id):
                add_user(cnx, user_id, first_name)
            # STEP 2: add the notification to the database!

        except mysql.connector.Error as err:
            print(f"Error: {err}")
        finally:
            cnx.close()

####### STORING FUNCTIONS ###########

#function to store a new user to the database
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

#function to store conditions
def store_condition_and_return_id(cnx, column_name, comparator, threshold):
    try:
        cursor = cnx.cursor()
        add_condition_query="""
        INSERT INTO conditions (column_name, comparator, threshold)
        values (%s, %s, %s);
        """
        cursor.execute(add_condition_query, (column_name, comparator, threshold))
        print(f"condition added")
    except mysql.connector.Error as err:
        print(f"Error:{err}")
    finally:
        cursor.close()

#######    HELPER FUNCTIONS      ###########

#function to check if the user already exists in the database!
def does_user_already_exist(cnx, user_id):
    try:
        cursor = cnx.cursor()
        # Check if user already exists
        check_user_query = "SELECT user_id FROM users WHERE user_id = %s"
        cursor.execute(check_user_query, (user_id,))
        user_exists = cursor.fetchone()
        cursor.close()
        if user_exists:
            print(f"User with id {user_id} already in database!")
        return user_exists is not None
    except mysql.connector.Error as err:
            print(f"Error when checking if user already exists: {err}")
            return False

#function to connect to the database, returns a connection instance
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
        cnx = mysql.connector.connect(**config)
        print("Connection established")
        return cnx
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None
