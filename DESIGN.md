# Design Specifications

### Telegram Trading Bot

Team Kyle Jan 2024

## Notifications
Notifications at their core consist of a **query** and a **condition**. Notifications "trigger" when the query associated with the notification returns a value that meets the user-specified condition. The main format of a command that sets a notification is as follows: 
> ```/query_identifier parameter1=1 parameter2=2 parameter3=3 ... condition<=threshold "notification name"```.<br/>
The basic rules for formatting as as follows:
1. There are no spaces between each variable, operator, and value declaration.
> ```parameter1=1``` instead of ```parameter1 = 1```
3. the command must be formatted in the correct order and with spaces between each variable, operator, and value declaration
> correct order: ```/query_identifier -> parameters -> condition -> name```

**Example of setting a notification:** <br/>
``` /large_erc20_holders large_amount=10000000 token=LINK total_large_holders>=10 "notification 1" ```<br/>
In this example, we are utilizing a query on Dune that retrieves the total number of large holders of LINK (total_large_holders). The message specifies the following:
1. ```large_amount=10000000``` From this parameter, we specify that a large holder should have $10,000,000 in the token
2. ```token=LINK``` From this parameter, we specify that we want our large holders to be holders of LINK.
3. ```total_large_holders>=10``` From this condition, we specify that the want to be notified when the total number of large holders (a column in the result of the queue) exceeds 10
4. ```"notification 1"``` This last part of our command specifies the notification name.

## Chatbot Limitations:
Since the free tier for the DuneAPI does not allow the use of CRUD operations (Create, Read, Update, Delete), our chatbot will be restricted to allowing users to query existing queries. 
<br/>
<br/>
While our chatbot currently only queries with our built-in compatible queries (premade on Dune.com and called within our application), we want to eventually encourage our users to create their own compatible queries on [Dune](https://dune.com/browse/queries) to use with our bot.
<br/>
<br/>
**Compatible queries** are queries which have parameters that can result in a query with a result that is time-based. An example of such would be this:
<br/>
1. Time based: [**Today's Average Gas Price**](https://dune.com/queries/3429830) A query that returns today's average gas price.
2. Non-time based: [**All Known CEX Addresses**](https://dune.com/queries/3237025) a query that returns all the known addresses of CEX's.
<br/>
Since our bot notifies users of current movements in the market, queries must return results that return the most recent metrics that change with time. 
<br/>
Compatible queries also must be able to be fully specified with parameters that are written in the Dune query creator like so:

```
amount_usd >= {{Total USD}}
```
When specifying a variable in your query, if you want to be able dynamically specify that variable value, you must surround the variable name with two pairs of curly braces!
