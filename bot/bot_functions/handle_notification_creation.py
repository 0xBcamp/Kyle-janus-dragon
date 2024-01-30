"""
store_stuff function
Usage: Called by bot.py to store the necessary information (user_id, query_id, query parameters, and condition) into the database
"""

import mysql.connector
from dotenv import load_dotenv
import os
from dotenv import load_dotenv
from bot.bot_functions.extract_all_info_from_message import extract_all_info_from_message
from bot.bot_functions.check_if_notif_is_valid import check_if_notif_is_valid

###### HANDLE_NOTIFICATION_CREATION ########

# function that handles notification creation by:
    # checking that notification can be created
    # creating the notification if it can!
def handle_notification_creation(bot, message, query_id, condition_text):
    
    #STEP 1: establish a connection to the database
    cnx = connect_to_db()

    #STEP 2: extract information from the user's message into variables to use 
    user_info, query_id , parameters, condition_info, notif_name = extract_all_info_from_message(message, query_id)

    # STEP 3: check if the user's command is correctly formatted/if notification is valid
    response_code, current_value = check_if_notif_is_valid(cnx, query_id, parameters, condition_info, notif_name)

    #STEP 4: send a message back to the user based on if the message was successful or not
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
        store_notification(cnx, user_info, query_id, parameters, condition_info, notif_name)
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

######## HANDLE NOTIFICATIONS HELPER FUNCTIONS #######

######## USER STORAGE FUNCTIONS ############

#### CHECK_USER_AND_STORE_IF_NEW() #####

# checks if a user is new or not and acts accordingly
def check_user_and_store_if_new(cnx, user_info):
    user_id = user_info[0]
    first_name = user_info[1]
    # if the user is not already stored
    if not user_already_stored(cnx, user_id):
        # store them in the users table!
        add_new_user(cnx, user_id, first_name)

#### CHECK_USER_AND_STORE_IF_NEW() HELPER FUNCTIONS #####

# function to store a new user to the users table
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


# adds notification and all its data to the database
def store_notification(cnx, user_info, query_id, parameters, condition, notif_name):
    user_id = user_info[0]
    # Step 1: store condition in conditions table and get its id
    condition_id = store_condition_and_return_id(cnx, condition)
    # Step 2: store the new notification in notifs table
    notif_id = store_notif_and_return_id(
        cnx, user_id, query_id, condition_id, notif_name)
    # step 3: store parameters in notifs
    store_parameters(cnx, notif_id, parameters)

#### STORE_NOTIFICATION() HELPER FUNCTIONS #####

# function to store conditions and return its id
def store_condition_and_return_id(cnx, conditions):
    try:
        cursor = cnx.cursor()
        # store the three parts of the condition to he database
        add_condition_query = """
        INSERT INTO conditions (column_name, comparator, threshold)
        values (%s, %s, %s);
        """
        column_name, comparator, threshold = conditions
        cursor.execute(add_condition_query,
                       (column_name, comparator, threshold))
        cnx.commit()
        # get the id of the condition to return!
        condition_id = cursor.lastrowid
        print(
            f"Condition added to conditions table with condition_id: {condition_id}")
        return condition_id

    except mysql.connector.Error as err:
        print(f"store_condition_and_return_id error:{err}")
    finally:
        cursor.close()

# function to store conditions and return its id
def store_condition_and_return_id(cnx, conditions):
    cursor = None
    try:
        cursor = cnx.cursor()
        add_condition_query = """
        INSERT INTO conditions (column_name, comparator, threshold)
        values (%s, %s, %s);
        """
        column_name, comparator, threshold = conditions
        cursor.execute(add_condition_query,
                       (column_name, comparator, threshold))
        cnx.commit()
        # Get the condition's condition_id
        condition_id = cursor.lastrowid
        print(
            f"Condition added to conditions table with condition_id: {condition_id}")
        return condition_id
    except mysql.connector.Error as err:
        print(f"store_condition_and_return_id error:{err}")
    finally:
        if cursor:
            cursor.close()

# function to store notif in notif table and return its notif_id
def store_notif_and_return_id(cnx, user_id, query_id, condition_id, notif_name):
    cursor = None
    try:
        cursor = cnx.cursor()
        add_notif_query = """
        INSERT INTO notifs (user_id, query_id, condition_id, notif_name)
        VALUES (%s, %s, %s, %s);
        """
        cursor.execute(add_notif_query,
                       (user_id, query_id, condition_id, notif_name))
        cnx.commit()
        # get the notification's notif_id
        notif_id = cursor.lastrowid
        print(f"Added notification #{notif_id}: {notif_name}")
        return notif_id

    except mysql.connector.Error as err:
        print(f"store_notif_and_return_id error: {err}")
    finally:
        if cursor:
            cursor.close()

# function to store notification query parameters
def store_parameters(cnx, notif_id, parameters):

    # store parameter names if they are new and get all of their id's in an ordered array
    param_name_ids = store_parameter_names_and_get_ids(cnx, parameters)
    cursor = None
    # loop through each parameter name and its parameter name id to store it in parameter values!
    for i in range(0, len(parameters)):
        try:
            cursor = cnx.cursor()
            add_notif_query = """
            INSERT INTO parameter_values (notif_id, param_name_id, parameter_value)
            VALUES (%s, %s, %s);
            """
            param_name_id = param_name_ids[i]
            param_value = parameters[i][1]
            cursor.execute(add_notif_query, (notif_id,
                           param_name_id, param_value))
            cnx.commit()
            print(
                f"Added to parameter_values table: ({param_name_id}, {param_value})")

        except mysql.connector.Error as err:
            print(f"store_parameters error: {err}")
        finally:
            if cursor:
                cursor.close()

# helper function to store parameter names into the parameter_names table and return an array of their notif_id's in order
def store_parameter_names_and_get_ids(cnx, parameters):
    parameter_ids = []
    # for each parameter...
    for parameter in parameters:
        cursor = None
        try:
            parameter_name = parameter[0]
            cursor = cnx.cursor()

            # ...if the name of the parameter has not yet been seen/stored, store it...
            if not parameter_name_already_stored(cnx, parameter_name):
                add_notif_query = """
                INSERT INTO parameter_names (parameter_name)
                VALUES (%s);
                """
                cursor.execute(add_notif_query, (parameter_name,))
                cnx.commit()
                parameter_name_id = cursor.lastrowid
                print(
                    f"Parameter added to table with notif_id: {parameter_name_id}")
                # ... and remember its parameter_name_id!
                parameter_ids.append(parameter_name_id)

            # ... but if it has already been seen and stored ...
            else:
                get_parameter_name_id_query = """
                SELECT param_name_id FROM parameter_names WHERE parameter_name = %s
                """
                cursor.execute(get_parameter_name_id_query, (parameter_name,))
                # ... just get the parameter_name_id associated with the parameter name.
                parameter_name_id = cursor.fetchone()
                if parameter_name_id:
                    parameter_ids.append(parameter_name_id[0])

        except mysql.connector.Error as err:
            print(f"store_new_parameters error: {err}")
        finally:
            if cursor:
                cursor.close()
    return parameter_ids

#######    HELPER FUNCTIONS      ###########

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

# function to check if parameters are already stored
def parameter_name_already_stored(cnx, parameter_name):
    try:
        cursor = cnx.cursor(buffered=True)
        check_parameter_query = "SELECT param_name_id FROM parameter_names WHERE parameter_name = %s"
        cursor.execute(check_parameter_query, (parameter_name,))
        parameter_name_stored = cursor.fetchone()
        # return true if parameter name has been stored, false if it hasnt been stored before
        return parameter_name_stored is not None
    except mysql.connector.Error as err:
        print(f"Error when checking if parameter already exists: {err}")
        return False
    finally:
        cursor.close()

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