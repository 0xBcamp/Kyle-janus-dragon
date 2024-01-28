"""
get_user_notifications function
Usage: Called by bot.py 
"""

import mysql.connector
import os
from dotenv import load_dotenv

def get_user_notifs(user_id):
    try:
        load_dotenv()
        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database="tg_db",
        )

        if connection.is_connected():
            print("get_user_notifs: Connected to MySQL database")
        
        # Create a cursor to execute SQL queries
        cursor = connection.cursor()

        # query to get notifications from notifs
        query = f"""
        
        SELECT notifs.notif_name
        FROM notifs
        WHERE notifs.user_id = {user_id};
        
        """

        cursor.execute(query)

        # Fetch all the rows
        result = cursor.fetchall()
        # Extract raw text from each tuple
        notif_names = [notif[0] for notif in result]
        return notif_names

    except mysql.connector.Error as err:
        print(f"Error: {err}")

    finally:
        # Close the cursor and connection
        if "cursor" in locals():
            cursor.close()
        if "connection" in locals() and connection.is_connected():
            connection.close()
        