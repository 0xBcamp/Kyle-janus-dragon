### Telegram Trading Bot
## Design Specifications

## User interactions:
Utilizing built-in functionality from the [Telegram Bot API](https://core.telegram.org/bots/api), our chatbot will allow users to interact with it using commands in the basic format:
```
/command {parameter}
```
## Chatbot Query Capabilities:
Since the free tier for the DuneAPI does not allow the use of CRUD operations (Create, Read, Update, Delete), our chatbot will be restricted to allowing users to query existing, **compatible queries**.
<br/>
<br/>
**Compatible queries** are queries that are able to be used by our chatbot. 
