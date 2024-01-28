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
        /gm --> Says good morning\n
        /gn --> Says goodnight\n
        /btc --> Returns the current price of bitcoin in USD\n
        /send --> Records your user_id in our database\n
        /help --> send this same message to see available commands
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

    @bot.message_handler(commands=['btc'])
    def btc(message):
        btc_price = get_bitcoin_price()
        
        if btc_price is None:
            btc_price = "error"
        else:
            btc_price = f"${round(btc_price, 2)}"

        bot.reply_to(message, btc_price)
    
    @bot.message_handler(commands=['num-large-erc20-holders'])
    def num_large_erc20_holders(message):
        #get all info for the notification:
        notif_info = extract_all_info_from_message(message, 3368257)
        store_stuff(notif_info)
    
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
    
    return bot


########## HELPER FUNCTIONS ##########
# Get Bitcoin price function
def get_bitcoin_price():
    parameters = {
        'start':'1',
        'limit':'2',
        'convert':'USD'
    }
    headers = {
        'Accepts': 'application/json',
        'X-CMC_PRO_API_KEY': CMC_API_KEY,
    }

    try:
        response = requests.get(url, headers=headers, params=parameters)
        response.raise_for_status()  # Raise an exception for bad requests
        data = response.json()

        # Extract the Bitcoin price from the response
        bitcoin_price = data['data'][0]['quote']['USD']['price']

        return bitcoin_price

    except requests.exceptions.RequestException as e:
        print(f"Error fetching Bitcoin price: {e}")
        return None