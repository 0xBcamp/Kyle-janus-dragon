import mysql.connector
import os
from dotenv import load_dotenv

# Adam

# if check_condition(resulting_statistic, notif_id):
#      print("send message to owner of that notif_id!")


def check_condition(resulting_statistic, notif_id):

    res = False

    try:
        load_dotenv()
        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database="tg_db",
        )

        if connection.is_connected():
            print("Connected to MySQL database")

        # Create a cursor to execute SQL queries
        cursor = connection.cursor()

        # Example query to select data from a table
        query = f"""
        
        SELECT conditions.threshold, conditions.comparator
        FROM notifs
        JOIN conditions ON notifs.condition_id = conditions.condition_id
        WHERE notifs.notif_id = {notif_id};
        
        """

        cursor.execute(query)

        # Fetch all the rows
        result = cursor.fetchall()

        row = result[0]
        
        res = evaluate(resulting_statistic, row[1], row[0])

        # notify when large eth holders is over 100

    except mysql.connector.Error as err:
        print(f"Error: {err}")

    finally:
        # Close the cursor and connection
        if "cursor" in locals():
            cursor.close()
        if "connection" in locals() and connection.is_connected():
            connection.close()
        
        return res

def evaluate(new_value, operator, threshold):
    operators = {'==': '==', '!=': '!=', '>': '>', '<': '<', '>=': '>=', '<=': '<='}

    if operator not in operators:
        raise ValueError(f"Invalid operator: {operator}")

    comparison_string = f"{new_value} {operators[operator]} {threshold}"
    
    return eval(comparison_string)

# print(check_condition(99999999, 51))
