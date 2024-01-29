"""
create_bot()
Usage: function called by main.py to initialize the bot and specify the bot's functionality
"""

import os
import requests
import telebot
from dotenv import load_dotenv
from bot.bot_functions.store_stuff import store_stuff
from bot.bot_functions.extract_all_info_from_message import extract_all_info_from_message
from bot.bot_functions.get_user_notifs import get_user_notifs

load_dotenv()
TG_API_KEY = os.getenv('TG_API_KEY')
CMC_API_KEY = os.getenv('CMC_API_KEY')
url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest'

###### CREATE_BOT() ########
#function to initialize bot!
def create_bot():
    bot = telebot.TeleBot(TG_API_KEY)

    @bot.message_handler(commands=['help'])
    def help(message):
        bot.reply_to(message, """
            Available Commands:\n
            /greet --> Says hello\n
            /gm --> Says good morning\n
            /gn --> Says goodnight\n
            /my-notifs --> See a list of your notifications! \n
            /help --> send this same message to see available commands\n
Preset Notifications:\n
            /num-large-erc20-holders --> parameters: (min_token_balance=int token_address_to_analyze=address) conditions: (total_large_holders)\n 
            /dex-large-transactions --> parameter: (large_transaction_amount=int) conditions: (total_large_trades)\n
        """)
    
    @bot.message_handler(commands=['greet'])
    def greet(message):
        bot.reply_to(message, "Hey whats up?")

    @bot.message_handler(commands=['gn'])
    def gn(message):
        bot.reply_to(message, "Goodnight 🌙")

    @bot.message_handler(commands=['gm'])
    def gm(message):
        bot.reply_to(message, "Good morning ☀️")
    
    @bot.message_handler(commands=['my-notifs'])
    def my_notifs(message):

        #get user_id
        user_id = message.from_user.id
        
        #get the user's notifications
        notifications = get_user_notifs(user_id)

        if len(notifications) == 0:
            my_notifs_message = "You don't have any notifications yet!"
        
        else:
            my_notifs_message = f"Here are your notifications: \n"
            for index, notification in enumerate(notifications):
                my_notifs_message += f"{index+1}. {notification} \n"
        bot.reply_to(message, my_notifs_message)

    @bot.message_handler(commands=['num-large-erc20-holders'])
    def num_large_erc20_holders(message):
        #get all info for the notification:
        handle_notification_creation(bot, message, 3368257, "large ERC20 Token holders")

    @bot.message_handler(commands=['dex-large-transactions'])
    def num_large_erc20_holders(message):
        handle_notification_creation(bot, message, 3386756, "large transactions on Dexes in the last 24 hours")
    
    return bot

########## HELPER FUNCTIONS #############
#function that checks if message is valid by trying to store it!
def handle_notification_creation(bot, message, query_id, condition_text):

    #break down message into separate variables
    notif_info = extract_all_info_from_message(message, query_id)
    #store the notification and get the current value and threshold value
    response_code, current_value, threshold = store_stuff(notif_info)

    def reply_parameters_invalid():
        bot.reply_to(message, "Parameters not valid for query!")

    def reply_name_used():
        bot.reply_to(message, "Notification name already used! Name it something else!")

    def reply_database_issue():
        bot.reply_to(message, "Having trouble accessing our database, check in later!")
    actions = {
        1: reply_parameters_invalid,
        2: reply_name_used,
        3: reply_database_issue
    }

    action = actions.get(response_code)
    if action:
        action()
        return False
    else:
        bot.reply_to(message, f"Current number of {condition_text}: {current_value} \nWe will let you know when this value passes {threshold}.")