import os
import requests
import telebot
from dotenv import load_dotenv
from storer import store_stuff
import re
# Load environment variables
# test
# git clone -b store_in_db https://github.com/0xBcamp/Kyle-janus-dragon.git

load_dotenv()
TG_API_KEY = os.getenv('TG_API_KEY')
CMC_API_KEY = os.getenv('CMC_API_KEY')
url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest'

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
    def a(message):
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
        #get user info:
        message_info = extract_all_info_from_message(message, 3368257)
        print(message_info)
    
    return bot


###### MAIN MESSAGE EXTRACTION FUNCTION ######

#function to get all the parameters from  message
def extract_all_info_from_message(message, query_id):
    #get user info
    user_info = get_user_info(message)
    #extract message into an array
    msg_array = extract_msg_into_array(message)
    #get parameters from message array
    parameters = extract_parameters_from_msg_array(msg_array)
    #get condition from message array
    condition = extract_condition_from_msg_array(msg_array)

    #LATER, MAYBE MAKE A DICTIONARY WITH PRESET:QUERY_ID KEY VALUE PAIRS?
    message_info = user_info, query_id , parameters, condition
    return message_info

###### MESSAGE EXTRACTION HELPER FUNCTIONS ##########

#function to get user info
def get_user_info(message):
    user_id = message.from_user.id
    first_name = message.from_user.first_name
    return [user_id, first_name]

#function to extract message into an array
def extract_msg_into_array(message):
    msg_text = message.text.split(' ')
    if len(msg_text) > 1:
        return msg_text[1:]
    else:
        return False

#function to get parameters from message array
def extract_parameters_from_msg_array(msg_array):
    parameters = []
    #loop through everything except for last bit of message!!!!
    parameters_in_msg_array = msg_array[:len(msg_array) - 1]
    for parameter in parameters_in_msg_array:
        parameter_info = parameter.split('=', 1)
        parameters.append(parameter_info)
    if len(parameters) >= 1:
        return parameters
    else:
        return False

#function to get condition from message array
def extract_condition_from_msg_array(msg_array):
    raw_condition = ''.join(msg_array[len(msg_array) - 1:])  # Join the last element of the array into a single string
    condition = re.split(r'(<=|>=|<|>|=)', raw_condition)  # Split using regular expression
    condition = [c for c in condition if c]  # Remove empty strings from the result
    return condition