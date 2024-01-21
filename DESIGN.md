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
**They would:** <br/>
1. Choose an existing query for the job by searching on Dune.com. In this case, they would use [this query](https://dune.com/queries/3220196).

## Chatbot Query Capabilities:
Since the free tier for the DuneAPI does not allow the use of CRUD operations (Create, Read, Update, Delete), our chatbot will be restricted to allowing users to query existing,
**compatible queries**.
<br/>
<br/>
**Compatible queries** are queries that are able to be used by users. Since our chatbot's main functionality is to allow users to create custom notifications from data pulled from existing Dune queries, there are a few things which make a query incapable of producing notifications. <br/><br/>

### **Here are some examples:** <br/>
**Example 1:** [**All Known CEX Addresses**](https://dune.com/queries/3237025)
Since the data from this query is simmply a list of all known addresses from various CEX exchanges,  

