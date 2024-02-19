"""
check_notif()
Usage: 
    Function called by check_notifs_loop() to 1. run the query notification and 2. check if the result passed the threshold
"""

from .check_notif_helpers.query import query
from .check_notif_helpers.check_condition import check_condition

###### CHECK_NOTIF() ##############
# function that runs a notification's query and checks if the result needs to be shared with the notification's owner
async def check_notif(pool, notif_id, notify_queue):

    # STEP 1: Perform the query
    resulting_statistic = await query(pool, notif_id)

    # STEP 2: check if you should notify or not!
        # in the mean time, grab condition info for notifying the user since you will be accessing those by checking if the condition was met (to minimize calls to DB)
    need_to_notify, monitored_statistic_name, comparator, threshold = await check_condition(pool,
                                                                                            resulting_statistic, notif_id)

    # STEP 3: add information to the result_queue if the user needs to be notified
    if need_to_notify:
        print(f"notification {notif_id} triggered!")
        # get the last bit of information you still need to formulate a message to the owner of the notification
        user_id, first_name, notif_name = await get_info_for_notif(pool, notif_id)
        # Put the result in the queue
        await notify_queue.put((user_id, first_name, notif_name, monitored_statistic_name, threshold, resulting_statistic))
    else:
        print(f"notification {notif_id} not triggered")

# function to get the last information you would need for a notification message: user_id, first_name, and notif_name
async def get_info_for_notif(pool, notif_id):
    try:
        async with pool.acquire() as cnx:
            async with cnx.cursor() as cursor:
                # get user_id
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

                # get the user's name
                await cursor.execute("""
                    SELECT users.first_name
                    FROM users
                    WHERE user_id = %s
                """, (int(user_id),))
                # Fetch all the rows
                first_name = await cursor.fetchall()
                # Extract raw text from each tuple
                first_name = first_name[0]['first_name']
                return user_id, first_name, notif_name

    except Exception as e:
        print(f"Error in get_info_for_notifs: {type(e).__name__}, {e}")
