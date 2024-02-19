"""
check_condition()
Usage: function called by querier to check if a notification's query result has passed its threshold
"""
import mysql.connector

from dotenv import load_dotenv
from .connect_to_db import connect_to_db

####### CHECK_CONDITION #########
#function that checks if a notification's query result passed the threshold
async def check_condition(pool, resulting_statistic, notif_id):
    res = False
    try:
        # Acquire a connection from the pool
        async with pool.acquire() as cnx:  
            # Create a cursor from the connection
            async with cnx.cursor() as cursor: 
                await cursor.execute("""
                
                SELECT conditions.column_name, conditions.threshold, conditions.comparator
                FROM notifs
                JOIN conditions ON notifs.condition_id = conditions.condition_id
                WHERE notifs.notif_id = %s;
                
                """, (notif_id,))

                # Fetch all the rows
                result = await cursor.fetchall()
                result = result[0]
                column_name = result['column_name']
                comparator = result['comparator']
                threshold = result['threshold']
                
                res = evaluate(resulting_statistic, comparator, threshold)

    except mysql.connector.Error as err:
        print(f"Error in chceck_condition: {err}")

    finally:
        if res:
            return res, column_name, comparator, threshold
        else:

            return res, None, None, None

def evaluate(new_value, operator, threshold):
    operators = {'==': '==', '!=': '!=', '>': '>', '<': '<', '>=': '>=', '<=': '<='}

    if operator not in operators:
        raise ValueError(f"Invalid operator: {operator}")

    comparison_string = f"{new_value} {operators[operator]} {threshold}"
    return eval(comparison_string)