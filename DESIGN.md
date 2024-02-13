# Design Specifications

### Telegram Trading Bot

Team Kyle Jan 2024

## Chatbot Query Capabilities:

Since the free tier for the DuneAPI does not allow the use of CRUD operations (Create, Read, Update, Delete), our chatbot will be restricted to allowing users to query existing queries. 
<br/>
While our chatbot currently only queries with our built-in compatible queries (premade on Dune.com and called within our application), we want to eventually encourage our users to create their own compatible queries on [Dune](https://dune.com/browse/queries) to use with our bot.
<br/>
**Compatible queries** are queries which have parameters that can result in a query with one result<br/>

### **Here are some examples:** <br/>

**Example 1:** [**All Known CEX Addresses**](https://dune.com/queries/3237025)
Since the data from this query is simmply a list of all known addresses from various CEX exchanges,
