#!/usr/bin/env python3

import asyncio
import mysql.connector
import os
from dotenv import load_dotenv

# Global result queue
result_queue = asyncio.Queue()

###### START_QUERY_LOOP #########
#starts loop to periodically query from all notifications
async def start_query_loop():
    interval = 5  # 5 second interval
    cnx = connect_to_db()
    while True:
        notifs = await get_notifs(cnx)  # Get the list of notifs
        for notif_id in notifs:
            result = await query(notif_id)  # Perform the query
            await result_queue.put((result, notif_id))  # Put the result in the queue

        await asyncio.sleep(interval)  # Wait for the specified interval

####### HELPER FUNCTIONS ##############

#function to call to query a notification by its id
async def query(notif_id):
    # Placeholder for your query implementation
    # Replace this with your actual query logic
    # For example, it could be a database query or an API call
    return f"Result for notif_id {notif_id}"

async def get_notifs(cnx):
    cursor = cnx.cursor()
    # Example query to select data from table
    query = f"""
    SELECT notifs.notif_id
    FROM notifs
    """

    cursor.execute(query)

    # Fetch all the rows
    result = cursor.fetchall()
    # Extract raw text from each tuple
    notif_ids = [notif[0] for notif in result]
    print(notif_ids)
    return notif_ids

#function to initialize a connection to the database
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
    

###### TESTING #########
#testing for this module
async def main():
    query_loop = asyncio.create_task(start_query_loop())
    # You can add other tasks or logic here
    await query_loop

if __name__ == '__main__':
    asyncio.run(main())