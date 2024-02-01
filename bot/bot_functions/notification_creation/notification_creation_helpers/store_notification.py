"""
store_notification
Usage: Called by handle_notification_creation to store a notification assuming its associated query works/is valid
"""
import mysql.connector

###### STORE_NOTIFICATION() ###########
# adds notification and all its data to the database
def store_notification(cnx, user_id, query_id, parameters, condition, notif_name):

    # Step 1: Store condition into conditions table, and get its id
    condition_id = store_condition_and_return_id(cnx, condition)
    # Step 2: Store the new notification into notifs table with the condition_id, and get the notification id
    notif_id = store_notif_and_return_id(cnx, user_id, query_id, condition_id, notif_name)
    # step 3: Store parameters values into the parameter_values table with the notification id
    if parameters:
        store_parameter_values(cnx, notif_id, parameters)

####### STORE_NOTIFICATIONS() HELPER FUNCTIONS #########
    
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
def store_parameter_values(cnx, notif_id, parameters):

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