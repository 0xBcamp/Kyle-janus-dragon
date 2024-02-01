#!/usr/bin/env python3

"""
main.py
Usage: 
1. First, activate virtual environment with command:
    "source .venv/bin/activate "
2. Create a .env file and fill in this info:
    TG_API_KEY=
    CMC_API_KEY=
    DB_USER=
    DB_PASSWORD=
    DB_HOST=
    DEBUG=
2. Then, start the telegram bot with "./main.py". 
2a. If permission denied, run this command first "chmod +x main.py".
3. Message your Telegram bot /help to see how to interact with it!
"""

from bot.bot import create_bot
import asyncio
from querier.querier import start_query_loop, result_queue
from threading import Thread

def start_polling_in_thread(bot):
    # Start polling in a separate thread
    bot.polling(none_stop=True)

async def main():
    bot = create_bot()

    # Start the bot's polling method in a separate thread
    polling_thread = Thread(target=start_polling_in_thread, args=(bot,))
    polling_thread.start()

    # Start the query loop
    query_task = asyncio.create_task(start_query_loop())
    while True:
        try:
            # wait for results from query loop
            (user_id, first_name, notif_name, monitored_statistic_name, threshold, resulting_statistic) = await result_queue.get()
            message = f"Hello, {first_name}!\nYour notification, {notif_name}, has been triggered because the {monitored_statistic_name} has passed {threshold} with a value of {resulting_statistic}!"
            await bot.send_message(chat_id=user_id, text=message)
            await asyncio.sleep(0.5)  # Sleep for a short time to prevent high CPU usage
        except:
            await asyncio.sleep(0.5)
            
if __name__ == '__main__':
    asyncio.run(main())