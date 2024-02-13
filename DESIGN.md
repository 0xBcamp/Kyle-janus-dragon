# Design Specifications

### Telegram Trading Bot

Team Kyle Jan 2024

## Chatbot Query Capabilities:

Since the free tier for the DuneAPI does not allow the use of CRUD operations (Create, Read, Update, Delete), our chatbot will be restricted to allowing users to query existing queries. 
<br/>
While our chatbot currently only queries with our built-in compatible queries (premade on Dune.com and called within our application), we want to eventually encourage our users to create their own compatible queries on [Dune](https://dune.com/browse/queries) to use with our bot.
<br/>
**Compatible queries** are queries which have parameters that can result in a query with a result that is time-based. An example of such would be this:
<br/>
1. Time based: A query that returns average gas price by day.
2. Non-time based: a query that returns all the known addresses of CEX's.
<br/>
Since our bot notifies users of current movements in the market, queries must return results that return the most recent metrics that change with time. 
<br/>
Compatible queries also must be able to be fully specified with 
### **Here are some examples:** <br/>

**Example 1:** [**All Known CEX Addresses**](https://dune.com/queries/3237025)
Since the data from this query is simmply a list of all known addresses from various CEX exchanges,
