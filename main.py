import os
import telebot
from dotenv import load_dotenv
import requests

load_dotenv()
TG_API_KEY = os.getenv('TG_API_KEY')
CMC_API_KEY = os.getenv('CMC_API_KEY')
url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest'


# get btc function

parameters = {
    'start':'1',
    'limit':'2',
    'convert':'USD'
}

headers = {
    'Accepts': 'application/json',
    'X-CMC_PRO_API_KEY': CMC_API_KEY,
}

def get_bitcoin_price():
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





print(TG_API_KEY)
bot = telebot.TeleBot(TG_API_KEY)

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
    
    if  btc_price is None:
        btc_price = "error"
    else:
        btc_price = f"${round(btc_price, 2)}"

    bot.reply_to(message, btc_price)

bot.polling()