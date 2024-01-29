#!/usr/bin/env python3

from dune_client.types import QueryParameter
from dune_client.client import DuneClient
from dune_client.query import QueryBase
import os
from dotenv import load_dotenv
import logging

# Get the logger for the 'dune_client' library
dune_logger = logging.getLogger('dune_client')

# Set the logging level for the 'dune_client' logger to WARNING
dune_logger.setLevel(logging.WARNING)


# Load environment variables from .env file
load_dotenv()

def is_numeric(value):
    try:
        float(value)
        return True
    except ValueError:
        return False

def check_if_queriable(query_id, parameters, condition_info):
    result_column = condition_info[0]
    query_params = []
    for param in parameters:
        name, value = param
        if is_numeric(value):
            # Use number_type for numeric values
            query_params.append(QueryParameter.number_type(name, value))
        else:
            # Use text_type for non-numeric values
            query_params.append(QueryParameter.text_type(name, value))

    query = QueryBase(
        name="Sample Query",
        query_id=query_id,
        params=query_params
    )

    dune = DuneClient.from_env()
    print('loading...')
    try:
        results = dune.run_query(query)

        # save as Pandas Dataframe
        results_df = dune.run_query_dataframe(query)

        # Check if the result_column exists in the DataFrame
        if result_column in results_df.columns:
        # Extract the first value from the result_column
            result_value = results_df[result_column].iloc[0]
            return result_value
        else:
            print(f"Column '{result_column}' not found in the DataFrame")
            return None
    except:
        print("parameters invalid")
        return None

parameters = [
    ("blockchain_name", 'ethereum'),
    ("token_address_to_analyze", "0x514910771AF9Ca656af840dff83E8264EcF986CA"),
    ("min_token_balance", "10000000")
]
print(check_if_queriable(3368257, parameters, ['total_large_holders']))
