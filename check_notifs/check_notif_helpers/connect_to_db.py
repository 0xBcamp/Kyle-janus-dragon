import os
import aiomysql
from dotenv import load_dotenv

async def connect_to_db():
    load_dotenv()
    DB_USER = os.getenv('DB_USER')
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    DB_HOST = os.getenv('DB_HOST')
    DB_DATABASE = os.getenv('DB_DATABASE')

    try:
        pool = await aiomysql.create_pool(
            host=DB_HOST,
            port=3306,
            user=DB_USER,
            password=DB_PASSWORD,
            db=DB_DATABASE,  # Make sure this is correctly set
            charset='utf8mb4',
            cursorclass=aiomysql.DictCursor,
            autocommit=True
        )
        print("Connection pool established")
        return pool
    except Exception as err:
        print(f"Error when connecting to DB: {err}")
        return None
