"""
check_if_notif_is_valid function
Usage: Called by handle_notification_creation to check if the notification is valid by running the associated query! If it is valid, return the result!
"""

from dune_client.types import QueryParameter
from dune_client.client import DuneClient
from dune_client.query import QueryBase
import mysql.connector
from dotenv import load_dotenv
import logging

###### CHECK_IF_NOTIF_IS_VALID ##########
def check_if_notif_is_valid(cnx, query_id, parameters, condition_info, notif_name):

    # initialize main connection
    if check_if_notif_name_exists(cnx, notif_name):

        #Response Code 1: if there is already a notification with that same name!
        return 1, None
    result = check_if_queriable(query_id, parameters, condition_info)

    #Response Code 2: if the message's parameters did not result in a valid query!
    if not result:
        return 2, None
    
    elif cnx is None:
        #Response Code 3: if the database cannot be reached
        return 3, None
    
    else:
        threshold = condition_info[2]
        return 0, result
        

# function to check if a notification already has that name
def check_if_notif_name_exists(cnx, notif_name):
    try:
        cursor = cnx.cursor()
        # Check if user already exists
        check_notif_query = "SELECT notif_name FROM notifs WHERE notif_name = %s"
        cursor.execute(check_notif_query, (notif_name,))
        notif_stored = cursor.fetchone()
        cursor.close()
        if notif_stored:
            print(f"Notification with name {notif_name} already in database!")
        return notif_stored is not None
    except mysql.connector.Error as err:
        print(f"Error when checking if user already exists: {err}")
        return False


def check_if_queriable(query_id, parameters, condition_info):
    result_column = condition_info[0]
    query_params = []
    if parameters:
        for param in parameters:
            name, value = param
            if is_numeric(value):
                # Use number_type for numeric values
                query_params.append(QueryParameter.number_type(name, value))
            else:
                # Use text_type for non-numeric values
                query_params.append(QueryParameter.text_type(name, value))

        query = QueryBase(
            name="Sample Query",
            query_id=query_id,
            params=query_params
        )
        
    else:
            query = QueryBase(
            name="Sample Query",
            query_id=query_id
        )

    dune = DuneClient.from_env()
    print('Notification creation loading...')
    try:
        results = dune.run_query(query)

        # save as Pandas Dataframe
        results_df = dune.run_query_dataframe(query)

        # Check if the result_column exists in the DataFrame
        if result_column in results_df.columns:
            # Extract the first value from the result_column
            result_value = results_df[result_column].iloc[0]
            return result_value
        else:
            print(f"Column '{result_column}' not found in the DataFrame")
            return None
    except:
        print("parameters invalid")
        return None
    
#######    CHECK IF THE NOTIFICATION PARAMETERS ARE QUERIABLE    ###########
# Get the logger for the 'dune_client' library
dune_logger = logging.getLogger('dune_client')
# Set the logging level for the 'dune_client' logger to WARNING
dune_logger.setLevel(logging.WARNING)
# Load environment variables from .env file
load_dotenv()


def is_numeric(value):
    try:
        float(value)
        return True
    except ValueError:
        return False