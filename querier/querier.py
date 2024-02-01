#!/usr/bin/env python3

import asyncio
from dotenv import load_dotenv
from connect_to_db import connect_to_db
from query import query

# Global result queue
result_queue = asyncio.Queue()

###### START_QUERY_LOOP #########
#starts loop to periodically query from all notifications
async def start_query_loop():
    interval = 30  # 5 second interval
    cnx = connect_to_db()
    while True:
        notifs = await get_notifs(cnx)  # Get the list of notifs
        for notif_id in notifs:
            result = await query(cnx, notif_id)  # Perform the query
            await result_queue.put((result, notif_id))  # Put the result in the queue

        await asyncio.sleep(interval)  # Wait for the specified interval

####### HELPER FUNCTIONS ##############

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
    return notif_ids
