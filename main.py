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

def main():
    bot = create_bot()
    bot.polling()

if __name__ == '__main__':
    main()