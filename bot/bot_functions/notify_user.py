"""
notify_user()
Usage: function called by main.py when a notification has been triggered and you need to message the user!
"""

######## NOTIFICATION_MESSAGE() ##############
async def notify_user(bot, user_id, first_name, notif_name, monitored_statistic_name, threshold, resulting_statistic):
    message = f"Hello, {first_name}! \nYour notification, {notif_name}, has been triggered because the {monitored_statistic_name} has passed {threshold} with a value of {resulting_statistic}!"
    await bot.send_message(chat_id=user_id, text=message)