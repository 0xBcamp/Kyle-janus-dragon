# Implementation Details
### Telegram Trading Bot
Team Kyle Jan 2024

## Project Architecture Diagram:
> **Figure 1:** Full Architecture of project 

![project_architecture_v3](https://github.com/0xBcamp/Kyle-janus-dragon/assets/81604772/ab408832-f094-40cd-8fa5-77d87e6e802c)

## Front-end:
### Telegram Bot UI:

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
