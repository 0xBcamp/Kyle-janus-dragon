from connect_to_db import connect_to_db
import asyncio
import mysql.connector
from dune_client.types import QueryParameter
from dune_client.client import DuneClient
from dune_client.query import QueryBase
import logging
from dotenv import load_dotenv

#function to call to query a notification by its id
async def query(cnx, notif_id):

    # get the parameters associated with the notif_id to run the query
    parameters = get_parameters(cnx, notif_id)
    #get the query_id
    query_id = get_query_id(cnx, notif_id)
    #get the condition_info
    result_column, comparator, threshold = get_condition_info(cnx, notif_id)
    # run a query on the query!
    query_params = []
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

    dune = DuneClient.from_env()
    print('loading...')
    try:
        results = dune.run_query(query)

        # save as Pandas Dataframe
        results_df = dune.run_query_dataframe(query)
        print(results_df)
        #Check if the result_column exists in the DataFrame
        if result_column in results_df.columns:
            # Extract the first value from the result_column
            result_value = results_df[result_column].iloc[0]
            print(result_value)
            return result_value
        else:
            print(f"Column '{result_column}' not found in the DataFrame")
            return None

    except:
        print("parameters invalid")
        return None
    
def get_condition_info(cnx, notif_id):
    cursor = None
    try:
        cursor = cnx.cursor()
        # query to get notifications from notifs
        query = f"""
        
        SELECT condition_id
        FROM notifs
        WHERE notifs.notif_id = {notif_id};
        
        """
        cursor.execute(query)
        condition_id = cursor.fetchall()
        condition_id = condition_id[0][0]
        query = f"""
        
        SELECT column_name, comparator, threshold
        FROM conditions
        WHERE conditions.condition_id = {condition_id};
        
        """
        cursor.execute(query)
        condition_info = cursor.fetchall()
        condition_info = condition_info
        result_column= condition_info[0][0]
        comparator=condition_info[0][1]
        threshold=condition_info[0][2]
        return result_column, comparator, threshold
    except mysql.connector.Error as err:
        print(f"Error in get_condition_info: {err}")

    finally:
        # Close the cursor and connection
        if "cursor" in locals():
            cursor.close()
        if "connection" in locals() and cnx.is_connected():
            cnx.close()

def get_query_id(cnx, notif_id):
    cursor = None
    try:
        cursor = cnx.cursor()
        # query to get notifications from notifs
        query = f"""
        
        SELECT query_id
        FROM notifs
        WHERE notifs.notif_id = {notif_id};
        
        """
        cursor.execute(query)
        query_id = cursor.fetchall()
        return query_id[0][0]
    except mysql.connector.Error as err:
        print(f"Error: {err}")

    finally:
        # Close the cursor and connection
        if "cursor" in locals():
            cursor.close()
        if "connection" in locals() and cnx.is_connected():
            cnx.close()

def get_parameters(cnx, notif_id):
    cursor = None
    try:
        # Create a cursor to execute SQL queries
        cursor = cnx.cursor()

        # query to get notifications from notifs
        query = f"""
        
        SELECT param_name_id, parameter_value
        FROM parameter_values
        WHERE parameter_values.notif_id = {notif_id};
        
        """
        cursor.execute(query)

        # Fetch all the rows
        raw_parameters = cursor.fetchall()
        parameters = []
        for raw_parameter in raw_parameters:
            parameter_name_id = raw_parameter[0]
            parameter_value = raw_parameter[1]
            parameter_name = get_parameter_name(cnx, parameter_name_id)
            parameters.append((parameter_name, parameter_value))
        return parameters
    except mysql.connector.Error as err:
        print(f"Error: {err}")

    finally:
        # Close the cursor and connection
        if "cursor" in locals():
            cursor.close()
        if "connection" in locals() and cnx.is_connected():
            cnx.close()

def get_parameter_name(cnx, parameter_name_id):
    cursor= None
    try:
        # Create a cursor to execute SQL queries
        cursor = cnx.cursor()

        # query to get notifications from notifs
        query = f"""
        
        SELECT parameter_name
        FROM parameter_names
        WHERE parameter_names.param_name_id = {parameter_name_id};
        
        """
        cursor.execute(query)

        # Fetch all the rows
        parameter_name = cursor.fetchall()
        return parameter_name[0][0]
        
        
    except mysql.connector.Error as err:
        print(f"Error: {err}")

    finally:
        # Close the cursor and connection
        if "cursor" in locals():
            cursor.close()
        if "connection" in locals() and cnx.is_connected():
            cnx.close()

def is_numeric(value):
    try:
        float(value)
        return True
    except ValueError:
        return False

#######    CHECK IF THE NOTIFICATION PARAMETERS ARE QUERIABLE    ###########
# Get the logger for the 'dune_client' library
dune_logger = logging.getLogger('dune_client')
# Set the logging level for the 'dune_client' logger to WARNING
dune_logger.setLevel(logging.WARNING)
# Load environment variables from .env file
load_dotenv()


async def main():
    cnx = connect_to_db()
    if cnx is not None:
        await query(cnx, 115)
    else:
        print("Failed to connect to the database")

if __name__ == '__main__':
    asyncio.run(main())