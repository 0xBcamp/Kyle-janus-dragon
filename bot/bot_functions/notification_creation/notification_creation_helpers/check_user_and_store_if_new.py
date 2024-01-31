"""
check_user_and_store_if_new
Usage: Called by handle_notification_creation when a user is trying to create a notification. If it is their first one, this function adds them to the database 
"""
import mysql.connector

###### CHECK_USER_AND_STORE_IF_NEW() ###########
# checks if a user is new or not and acts accordingly
def check_user_and_store_if_new(cnx, user_info):
    user_id = user_info[0]
    first_name = user_info[1]
    # if the user is not already stored
    if not user_already_stored(cnx, user_id):
        # store them in the users table!
        add_new_user(cnx, user_id, first_name)

# function to check if the user already exists in the database!
def user_already_stored(cnx, user_id):
    try:
        cursor = cnx.cursor()
        # Check if user already exists
        check_user_query = "SELECT user_id FROM users WHERE user_id = %s"
        cursor.execute(check_user_query, (user_id,))
        user_stored = cursor.fetchone()
        cursor.close()
        if user_stored:
            print(f"User with id {user_id} already in database!")
        return user_stored is not None
    except mysql.connector.Error as err:
        print(f"Error when checking if user already exists: {err}")
        return False
    
# helper function to store a new user to the users table if user doesn't yer exist in db
def add_new_user(cnx, user_id, user_first_name):
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