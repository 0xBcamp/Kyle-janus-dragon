from bot import create_bot

def main():
    bot = create_bot()
    bot.polling()

if __name__ == '__main__':
    main()