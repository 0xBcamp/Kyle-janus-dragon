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
  <h4>Begin messaging our bot with this handle: @b97cfb452bebb5efbot</h4>
  <h4>
    Or simply follow this link: <a href="https://t.me/b97cfb452bebb5efbot">Telegram Trading Bot</a>
  </h4>
  <p>
    <strong> Supported Commands: </strong><br/>
    /greet -> says whats up to user <br/>
    /gm -> says good morning <br/>
    /gn -> says good night <br/>
    /btc -> fetches the current price of Bitcoin <br/>
  </p>
</div>

## Summary of our product:
Our product is a chatbot that users can interact with to easily access and utilize [Dune](https://dune.com/)’s sophisticated and large query system. It is not just a chatbot to access Dune, but a means for users to specify query-based "events," which, if triggered will notify the user.

## User interactions:
Utilizing built-in functionality from the [Telegram Bot API](https://core.telegram.org/bots/api), our chatbot will allow users to create notifications in this basic format
```
/query-identifier parameter1=1 parameter2=2 condition>=threshold "notification name"
```

## Basic Chatbot Functionality:
Our chatbot's main functionality is to allow users to create custom notifications from data pulled from existing Dune queries. These notifications will be _threshold-based_, meaning users will be notified if a metric (specified by the user) passes a user specified threshhold. <br/><br/>
**Example use:** <br/>
Say a user wanted to be notified when the number of holders of more than $1 million in LINK surpasses 160. <br/>
They would:
1. Choose an existing notification from our suite of notifications, in this case **num_large_erc20_holders**
2. Specify query parameters (in this case, **min_token_balance_large_holders = 1,000,000**).
3. Specify the column name, value, and condition that they would like to be notified on (in this case, column name = **total_holders**, value = **160**, condition = **>** (greater than).
With this information, the user will send a command to the chatbot. 
> Idea of how users can set a notification: <br/>

``` /num_large_erc20_holders min_token_balance=1000000 token_address_to_analyze=0x514910771AF9Ca656af840dff83E8264EcF986CA total_large_holders>=160
```

# how to reset the database!
-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Delete data from tables
-- Replace 'table1', 'table2', etc., with your actual table names
DELETE FROM conditions;
DELETE FROM notifs;
DELETE FROM parameter_names;
DELETE FROM parameter_values;
DELETE FROM users;

-- ... add more DELETE statements for each table ...

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
