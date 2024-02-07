from .connect_to_db import connect_to_db
from dune_client.types import QueryParameter
from dune_client.client import DuneClient
from dune_client.query import QueryBase
import logging
from dotenv import load_dotenv
import os

# function to call to query a notification by its id


async def query(pool, notif_id):
    load_dotenv()
    try:
        async with pool.acquire() as cnx:  # Acquire a connection from the pool
            # get the parameters associated with the notif_id to run the query
            parameters = await get_parameters(cnx, notif_id)
            # get the query_id
            query_id = await get_query_id(cnx, notif_id)
            # get the condition_info
            result_column, comparator, threshold = await get_condition_info(cnx, notif_id)
    except Exception as e:
        print(f"error: {e}")

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
    my_variable = os.getenv('DUNE_API_KEY')
    print(my_variable)
    dune = DuneClient(my_variable)
    print(f'checking notificaion {notif_id}...')
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


async def get_condition_info(cnx, notif_id):
    try:
        async with cnx.cursor() as cursor:
            # Asynchronously execute the query
            await cursor.execute("""
                SELECT condition_id
                FROM notifs
                WHERE notifs.notif_id = %s;  
            """, (notif_id,))

            # Asynchronously fetch all the rows
            condition_id = await cursor.fetchall()
            condition_id = condition_id[0]['condition_id']
            await cursor.execute("""
                SELECT column_name, comparator, threshold
                FROM conditions
                WHERE conditions.condition_id = %s;
            """, (condition_id, ))
            condition_info = await cursor.fetchall()
            column_name = condition_info[0]['column_name']
            comparator = condition_info[0]['comparator']
            threshold = condition_info[0]['threshold']
            return column_name, comparator, threshold

    except Exception as err:
        print(f"Error in get_condition_info: {err}")


async def get_query_id(cnx, notif_id):
    try:
        async with cnx.cursor() as cursor:
            # Asynchronously execute the query
            await cursor.execute("""
                SELECT query_id
                FROM notifs
                WHERE notifs.notif_id = %s;
            """, (notif_id,))

            # Asynchronously fetch all the rows
            query_id = await cursor.fetchall()
            query_id = query_id[0]['query_id']
            return query_id
    except Exception as err:
        print(f"Error in get_parameters: {err}")


async def get_parameters(cnx, notif_id):
    try:
        async with cnx.cursor() as cursor:
            # Asynchronously execute the query
            await cursor.execute("""
                SELECT param_name_id, parameter_value
                FROM parameter_values
                WHERE parameter_values.notif_id = %s;
            """, (notif_id,))

            # Asynchronously fetch all the rows
            raw_parameters = await cursor.fetchall()
            parameters = []
            for raw_parameter in raw_parameters:
                parameter_name_id = raw_parameter['param_name_id']
                parameter_value = raw_parameter['parameter_value']
                # Make sure get_parameter_name is also async and awaited
                parameter_name = await get_parameter_name(cnx, parameter_name_id)
                parameters.append((parameter_name, parameter_value))
            return parameters
    except Exception as err:
        print(f"Error in get_parameters: {err}")


async def get_parameter_name(cnx, parameter_name_id):
    try:
        async with cnx.cursor() as cursor:  # Use an async context manager to get a cursor
            # Asynchronously execute the query
            await cursor.execute("""
                SELECT parameter_name
                FROM parameter_names
                WHERE parameter_names.param_name_id = %s;
            """, (int(parameter_name_id),))  # Use parameterized queries to prevent SQL injection

            # Asynchronously fetch all the rows
            parameter_name = await cursor.fetchone()  # Fetch the first row
            if parameter_name:
                return parameter_name['parameter_name']
            else:
                return None  # Return None if no result is found

    except Exception as err:  # Catch a more general exception if not specifically using mysql.connector
        print(f"Error in get_parameter_name: {err}")


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
