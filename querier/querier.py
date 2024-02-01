#!/usr/bin/env python3

import asyncio
import aiomysql
from dotenv import load_dotenv
from .connect_to_db import connect_to_db
from .query import query
from .check_condition import check_condition

# Global result queue
result_queue = asyncio.Queue()

###### START_QUERY_LOOP #########
#starts loop to periodically query from all notifications
async def start_query_loop():
    interval = 30  # Interval in seconds
    pool = await connect_to_db()
    while True:
        notifs = await get_notifs(pool)  # Get the list of notifs
        print(f"got notifs: {notifs}")
        # Create a list of coroutine objects for processing each notification
        tasks = [process_notif(pool, notif_id) for notif_id in notifs]
        # Run the coroutines concurrently and wait for all to complete
        await asyncio.gather(*tasks)

        await asyncio.sleep(interval)  # Wait for the specified interval

async def process_notif(pool, notif_id):
    
    # Perform the query
    resulting_statistic = await query(pool, notif_id)
    #check if you should notify or not!
    need_to_notify, monitored_statistic_name, comparator, threshold = check_condition(resulting_statistic, notif_id)
    if need_to_notify:
        user_id, first_name, notif_name = await get_info_for_notif(pool, notif_id)
        # Put the result in the queue
        await result_queue.put((user_id, first_name, notif_name, monitored_statistic_name, threshold, resulting_statistic))
####### HELPER FUNCTIONS ##############

async def get_notifs(pool):
    try:
        async with pool.acquire() as cnx:  # Acquire a connection from the pool
            async with cnx.cursor() as cursor:  # Create a cursor from the connection
                await cursor.execute("""
                    SELECT notifs.notif_id
                    FROM notifs
                """)

                # Fetch all the rows
                result = await cursor.fetchall()
                # Extract raw text from each tuple
                notif_ids = [notif['notif_id'] for notif in result]
                return notif_ids
    except Exception as e:
        print(f"Error in get_notifs: {type(e).__name__}, {e}")

async def get_info_for_notif(pool, notif_id):
    try:
        async with pool.acquire() as cnx:
            async with cnx.cursor() as cursor:
                #get user_id
                await cursor.execute("""
                    SELECT notifs.user_id, notifs.notif_name
                    FROM notifs
                    WHERE notif_id = %s
                """, (notif_id,))
                # Fetch all the rows
                notif_info = await cursor.fetchall()
                # Extract raw text from each tuple
                user_id = notif_info[0]['user_id']
                notif_name = notif_info[0]['notif_name']
                
                #get the user's name
                await cursor.execute("""
                    SELECT users.first_name
                    FROM users
                    WHERE user_id = %s
                """, (int(user_id),))
                # Fetch all the rows
                first_name = await cursor.fetchall()
                # Extract raw text from each tuple
                first_name= first_name[0]['first_name']
                return user_id, first_name, notif_name
                
    except Exception as e:
        print(f"Error in get_info_for_notifs: {type(e).__name__}, {e}")

