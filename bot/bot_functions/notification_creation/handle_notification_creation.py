"""
handle_notification_creation function
Usage: Called by bot.py to handle when a user tries to create a notification
"""
import mysql.connector
from dotenv import load_dotenv
import os
from .notification_creation_helpers.extract_all_info_from_message import extract_all_info_from_message
from .notification_creation_helpers.check_if_notif_is_valid import check_if_notif_is_valid
from .notification_creation_helpers.store_notification import store_notification
from .notification_creation_helpers.check_user_and_store_if_new import check_user_and_store_if_new

###### HANDLE_NOTIFICATION_CREATION ########

# function that handles notification creation
def handle_notification_creation(bot, message, query_id, condition_text):
    
    user_info, query_id , parameters, condition_info, notif_name = extract_all_info_from_message(message, query_id)
    print(user_info, query_id , parameters, condition_info, notif_name)
    cnx = connect_to_db()

    # STEP 1: check if the notification is valid and return a code
    response_code, current_value = check_if_notif_is_valid(cnx, query_id, parameters, condition_info, notif_name)
    #STEP 2: send a message back to the user based on this code number
    # Response codes: 
        # 0: notification creation successful
        # 1: the notification name has already been used
        # 2: the parameters specified by the user are invalid!
        # 3: having trouble connecting to our database
    def reply_name_used():
        bot.reply_to(
            message, "Notification name already used! Name it something else!")

    def reply_parameters_invalid():
        bot.reply_to(message, "Parameters not valid for query!")

    def reply_database_issue():
        bot.reply_to(
            message, "Having trouble accessing our database, check in later!")
    
    def notification_is_valid():
        check_user_and_store_if_new(cnx, user_info)
        user_id = user_info[0]
        store_notification(cnx, user_id, query_id, parameters, condition_info, notif_name)
        threshold = condition_info[2]
        cnx.close()
        bot.reply_to(
            message, f"Current number of {condition_text}: {current_value} \nWe will let you know when this value passes {threshold}.")
        
    actions = {
        0: notification_is_valid,
        1: reply_name_used,
        2: reply_parameters_invalid,
        3: reply_database_issue
    }

    action = actions.get(response_code)
    action()

# function to initialize a connection to the database
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
        print(f"Error when connecting to DB: {err}")
        return None