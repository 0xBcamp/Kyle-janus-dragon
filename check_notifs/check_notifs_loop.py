"""
check_notifs_loop()
Usage: 
    Function called by main.py to continuously check each notification to see if it has been "activated"
"""
import asyncio
from .check_notif_functions.connect_to_db import connect_to_db
from .check_notif import check_notif
# Constants:
INTERVAL = 5 * 60  # Interval in seconds

###### CHECK_NOTIFS_LOOP() #########

# Initialize global result queue
notify_queue = asyncio.Queue()

# function that loops to constantly check notifications to see if they need to "notify"

async def check_notifs_loop():
    pool = await connect_to_db()

    while True:
        # STEP 1: Get the list of all notifications stored in the database
        notifs = await get_notifs(pool)
        print(f"got notifs: {notifs}")

        # STEP 2: Concurrently check all notifications
        tasks = [check_notif(pool, notif_id, notify_queue)
                 for notif_id in notifs]
        await asyncio.gather(*tasks)
        await asyncio.sleep(INTERVAL)

####### HELPER FUNCTION ##############
# function that gets all the notifications from the database


async def get_notifs(pool):
    try:
        # Acquire a connection from the pool
        async with pool.acquire() as cnx:
            # Create a cursor from the connection
            async with cnx.cursor() as cursor:
                await cursor.execute("""
                    SELECT notifs.notif_id
                    FROM notifs
                """)
                result = await cursor.fetchall()
                # shove the notification ids into an array
                notif_ids = [notif['notif_id'] for notif in result]
                return notif_ids
    except Exception as e:
        print(f"Error in get_notifs: {type(e).__name__}, {e}")
