### Telegram Trading Bot
## Design Specifications

## User interactions:
Utilizing built-in functionality from the [Telegram Bot API](https://core.telegram.org/bots/api), our chatbot will allow users to interact with it using commands in the basic format:
```
/command {parameter}
```
## Basic Chatbot Functionality:
Our chatbot's main functionality is to allow users to create custom notifications from data pulled from existing Dune queries. These notifications will be _threshold-based_, meaning users will be notified if a metric (specified by the user) passes a user specified threshhold. <br/>
**Example use:** <br/>
Say a user wanted to be notified when the number of holders of more than $1 million in Ethereum surpasses 160. <br/>
They would: <br/>
1. Choose an existing query for the job by searching on Dune.com and note its "query id." In this case, they would use [this query](https://dune.com/queries/3220196) which has a query id of **3220196** (which you can spot in the url of the query).
2. Specify the query parameters that they would like (in this case, **minimum_token_balance_large_holders = 1,000,000**).
3. Specify the column name, value, and condition that they would like to be notified on (in this case, column name = **total_holders**, value = **160**, condition = **>** (greater than).
With this information, the user will send a command to the chatbot. 
> Fake example command:
> ``` /notify query_id=3220196 minimum_token_balance_large_holders=1000000 when total_holders>160 ```

## Chatbot Query Capabilities:
Since the free tier for the DuneAPI does not allow the use of CRUD operations (Create, Read, Update, Delete), our chatbot will be restricted to allowing users to query existing,
**compatible queries**.
<br/>
<br/>
**Compatible queries** are queries that are able to be used by users. Since our chatbot's main functionality is to allow users to create custom notifications from data pulled from existing Dune queries, there are a few things which make a query incapable of producing notifications. <br/><br/>

### **Here are some examples:** <br/>
**Example 1:** [**All Known CEX Addresses**](https://dune.com/queries/3237025)
Since the data from this query is simmply a list of all known addresses from various CEX exchanges,  

