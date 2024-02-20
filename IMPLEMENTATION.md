# Implementation Details
### Telegram Trading Bot
Team Kyle Jan 2024
<br/>
Our project is entirely run in **main.py**. 

## main.py
Our project is run centrally from **main.py** which does the following:
1. intializes the chatbot
2. begins a loop which periodically checks all notifications and loads a **queue** with the notifications that have triggered.
3. asynchronously runs through the **queue** and notifies the notifications' users with the corresponding information. 
<br/>

**main.py** pulls from two modules:
1. The **bot module** defines how the user interfaces with our bot by handling user inputs and formulating outgoing messages.
2. The **check notifications module** determines when to notify the user by checking all notifications stored in our database on a periodic basis and loading the **queue** with the notifications that have triggered. <br/>


## Bot module:
### bot.py:
**bot.py** holds key functions such as **create_bot()** which initializes the Telegram bot and defines the **message_handlers** which specify an input and handle the user messages using the associated command.
> **Example of message_handler declaration:** <br/>
```
    @bot.message_handler(commands=['median_gas_price'])
    def daily_median_gas_price(message):
        handle_notification_creation(
            bot, message, 407234, "median gas price of Ethereum in the last 24 hours")
```
To use this command, a user would start their message with: ```/median_gas_price ...```
<br/>

### handle_notification_creation.py
This file in the bot module holds **handle_notification_creation()** which takes as input a raw user message which intends to create a notification and extracts necessary information from it (such as user information, query id, notification name, etc.) to store in the database. It utilizes a variety of functions which are located in the **notification_creation_helpers** folder.
<br/>

## Check notifications module:
### check_notifs_loop.py:
A file which holds **check_notifs_loop()** which runs until the program is stopped. It periodically grabs all notifications stored in the database, then runs **check_notif()** on each notification.
<br/>

### check_notif.py
The file that holds **check_notif()**. The function takes as a parameter a notification and:
1. Runs the notification's associated queue
2. Checks the queue's result against the user-set condition
3. Adding the notification to the queue if the condition was met
It utilizes a variety of functions located in the **check_notif_helpers** folder.
<br/>

## Project Architecture Diagram:
> **Figure 1:** Full Architecture of project with pseudocode

![project_architecture_v3](https://github.com/0xBcamp/Kyle-janus-dragon/assets/81604772/ab408832-f094-40cd-8fa5-77d87e6e802c)

## Database Architecture Diagrams:
> **Figure 2:** Architecture of database

![Database_architecture_v1 0](https://github.com/0xBcamp/Kyle-janus-dragon/assets/81604772/95809c0d-d35b-46ee-9a73-81faade8c084)
> **Figure 3:** Database example usage

![Database_example](https://github.com/0xBcamp/Kyle-janus-dragon/assets/81604772/248aa0c8-9148-4dfe-8c13-cc9f60c04db9)
