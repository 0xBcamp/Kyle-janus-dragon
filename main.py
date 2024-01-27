#!/usr/bin/env python3

"""
main.py
Usage: call with "./main.py". If permissino denied, run this command first "chmod +x main.py".
"""

from bot.bot import create_bot

def main():
    bot = create_bot()
    bot.polling()

if __name__ == '__main__':
    main()