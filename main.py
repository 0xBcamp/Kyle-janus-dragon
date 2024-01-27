"""
main.py
Usage: call with "python3 main.py"
"""

from bot.bot import create_bot

def main():
    bot = create_bot()
    bot.polling()

if __name__ == '__main__':
    main()