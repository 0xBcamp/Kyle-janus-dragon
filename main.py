#!/usr/bin/env python3

"""
main.py
Usage: 
1. First, activate virtual environment with command:
    "source .venv/bin/activate "
2. Create a .env file and fill in this info:
    DUNE_API_KEY=
    CMC_API_KEY=
    DB_USER=
    DB_PASSWORD=
    DB_HOST=
    DB_DATABASE=
    DEBUG=
    TG_API_KEY=
3. Then, start the telegram bot with "./main.py". 
3a. If permission denied, run this command first "chmod +x main.py".
4. Message your Telegram bot /help to see how to interact with it!
"""

from bot.bot import create_bot
import asyncio
from check_notifs.check_notifs_loop import check_notifs_loop, notify_queue
from threading import Thread
from bot.bot_functions.notify_user import notify_user

def start_polling_in_thread(bot):
    bot.polling(none_stop=True)


async def main():
    bot = create_bot()

    # Start the bot's polling method in a separate thread
    polling_thread = Thread(target=start_polling_in_thread, args=(bot,))
    polling_thread.start()

    # Start loop to check notifications from database
    query_task = asyncio.create_task(check_notifs_loop())
    while True:
        try:
            # check the notify_queue to see if we need to notify anyone!
            (user_id, first_name, notif_name, monitored_statistic_name, threshold, resulting_statistic) = await notify_queue.get()
            #if we do have to notify someone, do it!
            await notify_user(bot, user_id, first_name, notif_name, monitored_statistic_name, threshold, resulting_statistic)
            # Sleep for a short time to prevent high CPU usage
            await asyncio.sleep(0.5)
        except:
            await asyncio.sleep(0.5)

if __name__ == '__main__':
    asyncio.run(main())