import mysql.connector
import os
from dotenv import load_dotenv

######## MAIN FUNCTION TO CALL FROM BOT.PY ########

#main function to store everything!

# notif_info should be an array in the following form:
# notif_info = [[user_id, first_name], query id, [['parameter name', parameter value], ['parameter name', parameter value], …], [column_name, comparator, threshold]]

def store_stuff(notif_info):
    user_info, query_id, parameters, condition_info = extract_notif_info(notif_info)
    cnx = connect_to_db()
    if cnx is not None:
        try:
            # STEP 1: Checks if user already exists, if they don't store them in the database!
            check_user(cnx, user_info)
            # STEP 2: add the notification to the database!
            add_notif(cnx, user_info, query_id, parameters, condition_info)
        except mysql.connector.Error as err:
            print(f"Error: {err}")
        finally:
            cnx.close()

######## STORAGE FUNCTIONS ############

# checks if a user is new or not and acts accordingly
def check_user(cnx, user_info):
    if not does_user_already_exist(cnx, user_info[0]):
        add_user(cnx, user_info[0], user_info[1])
    
# adds notification and all its data to the database
def add_notif(cnx, user_info, query_id, parameters, condition):
    user_id = user_info[0]
    #Step 1: store condition and get its id
    condition_id = store_condition_and_return_id(cnx, condition)
    #Step 2: create a new notification
    notif_id = store_notif_and_return_id(cnx, user_id, query_id, condition_id)


####### STORAGE HELPER FUNCTIONS ###########

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
        print(f"User added to users table with user_id: {user_id}")

    except mysql.connector.Error as err:
        print(f"add_user error: {err}")
    finally:
        cursor.close()

#function to store conditions and return its id
def store_condition_and_return_id(cnx, conditions):
    try:
        cursor = cnx.cursor()
        add_condition_query="""
        INSERT INTO conditions (column_name, comparator, threshold)
        values (%s, %s, %s);
        """
        column_name, comparator, threshold = conditions
        cursor.execute(add_condition_query, (column_name, comparator, threshold))
        cnx.commit()
        # Get the last inserted id
        condition_id = cursor.lastrowid
        print(f"Condition added to conditions table with condition_id: {condition_id}")
        return condition_id
    except mysql.connector.Error as err:
        print(f"store_condition error:{err}")
    finally:
        cursor.close()

#function to store notif in notif table and return its id
def store_notif_and_return_id(cnx, user_id, query_id, condition_id):
    try:
        cursor = cnx.cursor()
        add_notif_query = """
        INSERT INTO notifs (user_id, query_id, condition_id)
        VALUES (%s, %s, %s);
        """
        cursor.execute(add_notif_query, (user_id, query_id, condition_id ))
        cnx.commit()
        notif_id = cursor.lastrowid
        print(f"Notif added to notifs table with notif_id: {notif_id}")

    except mysql.connector.Error as err:
        print(f"store_notif_error: {err}")
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

# notif_info should be an array in the following form:
# notif_info = [[user_id, first_name], query id, [['parameter name', parameter value], ['parameter name', parameter value], …], [column_name, comparator, threshold]]

def extract_notif_info(notif_info):
    user_info = notif_info[0]
    query_id = notif_info[1]
    parameters = notif_info[2]
    condition_info = notif_info[3]
    return user_info, query_id, parameters, condition_info