<h1 align="center">Telegram Trading Bot</h1> 
<div align="center">
  <p>Made by: Team Kyle</p>
  <p>Last updated: Jan 20, 2024</p>
  <p>The power of the Dune community in your pocket!</p>
  <div style="display: flex; align-items: center; justify-content: center; flex-direction: column;">
    <a href="https://telegram.org/">
    <img alt="Telegram Logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/2048px-Telegram_logo.svg.png" width="140">
    </a>
    <a href="https://dune.com/">
      <img alt="Dune Logo" src="https://cdn-images.himalayas.app/d05wh7oxdola32ep86joa8x0wzhc" width="146">
    </a>
  </div>
  <h3>Download Telegram to try it out!:</h3>
</div>

<div align="center">
  <a href="https://apps.apple.com/us/app/telegram-messenger/id686449807">
    <img alt="Download on the App Store" title="App Store" src="http://i.imgur.com/0n2zqHD.png" width="140">
  </a>

  <a href="https://play.google.com/store/apps/details?id=org.telegram.messenger&hl=en_US&gl=US&pli=1">
    <img alt="Get it on Google Play" title="Google Play" src="http://i.imgur.com/mtGRPuM.png" width="140">
  </a>
<!--   <h4>Begin messaging our bot with this handle: @b97cfb452bebb5efbot</h4>
  <h4>
    Or simply follow this link: <a href="https://t.me/b97cfb452bebb5efbot">Telegram Trading Bot</a>
  </h4> -->
</div>

## Summary of our product:
Our product is a chatbot that users can interact with to easily access and utilize [Dune](https://dune.com/)’s sophisticated and large query system. It's a means for users to use and create query-based notifications which, if triggered will notify the user.

## User interactions:
Utilizing built-in functionality from the [Telegram Bot API](https://core.telegram.org/bots/api), our chatbot will allow users to create notifications in this basic format
```
/query-identifier parameter1=1 parameter2=2 condition>=threshold "notification name"
```

## Basic Chatbot Functionality:
Our chatbot's main functionality is to allow users to create custom notifications from data pulled from existing Dune queries. These notifications will be _threshold-based_, meaning users will be notified if a metric (specified by the user) passes a user specified threshhold. <br/><br/>
**To get started:** <br/>
1. Clone our github repository using this command: 
``` git clone https://github.com/0xBcamp/Kyle-janus-dragon.git ```
2. Navigate to it in Terminal, and start the virtual environment using this command:
``` source .venv/bin/activate ```
3. Create a .env file and use these variables--if you want to use this without contacting us, you will need to use a Coin Market Cap API Key, a MySQL database, a Telegram Bot API key, and a Dune API key. 
```
CMC_API_KEY=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_DATABASE=
DEBUG=True
TG_API_KEY=
DUNE_API_KEY=
```
4. Now, you can start our app using this command!
``` ./main.py ```
5. Our bot will be available to message. To see what commands are available type /help:
Example command:
``` ```
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
