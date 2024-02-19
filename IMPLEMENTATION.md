# Implementation Details
### Telegram Trading Bot
Team Kyle Jan 2024

## Project Architecture Diagram:
Our project is organized into two main modules, the **bot module** which is responsible for handling user interactions including user inputs and outgoing messages to the user, and the **check notifications module** which is responsible for determining when to notify the user. <br/>

> **Figure 1:** Full Architecture of project 

![project_architecture_v3](https://github.com/0xBcamp/Kyle-janus-dragon/assets/81604772/ab408832-f094-40cd-8fa5-77d87e6e802c)


## Bot module:
### bot.py:
**bot.py** holds key functions such as **create_bot()** which initializes the Telegram bot, and the **message_handlers** which specify an input and handle the message accordingly.
> **Example of message_handler declaration:** <br/>
```
    @bot.message_handler(commands=['median_gas_price'])
    def daily_median_gas_price(message):
        handle_notification_creation(
            bot, message, 407234, "median gas price of Ethereum in the last 24 hours")
```
An example command to use this message handler function would start with ```/median_gas_price ...```
## Back-end:

### Main.py:
### Translator:
### Logic Gate:
### Querier:

### Database:
This project uses a relational database. It will be organized into three tables: **users**, **events**, and **queries**.

A rough outline of the database structure is shown below:
![database_arch_v3](https://github.com/0xBcamp/Kyle-janus-dragon/assets/81604772/b26dd131-de0a-4f38-9424-73664456dba2)

# how to reset the database!
```
-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Delete data from tables
-- Replace 'table1', 'table2', etc., with your actual table names
DELETE FROM conditions;
DELETE FROM notifs;
DELETE FROM parameter_names;
DELETE FROM parameter_values;
DELETE FROM users;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
```
