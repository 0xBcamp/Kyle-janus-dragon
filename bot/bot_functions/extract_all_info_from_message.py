"""
store_stuff function
Usage: Called by bot.py to store the necessary information (user_id, query_id, query parameters, and condition) into the database
"""

import re

###### MAIN MESSAGE EXTRACTION FUNCTION ######

#function to get all the parameters from  message
def extract_all_info_from_message(message, query_id):
    #get user info
    user_info = get_user_info(message)
    #extract message into an array
    msg_array = extract_msg_into_array(message)
    #get parameters from message array
    parameters = extract_parameters_from_msg_array(msg_array)
    #get condition from message array
    condition = extract_condition_from_msg_array(msg_array)

    #LATER, MAYBE MAKE A DICTIONARY WITH PRESET:QUERY_ID KEY VALUE PAIRS?
    message_info = user_info, query_id , parameters, condition
    return message_info

###### MESSAGE EXTRACTION HELPER FUNCTIONS ##########

#function to get user info
def get_user_info(message):
    user_id = message.from_user.id
    first_name = message.from_user.first_name
    return [user_id, first_name]

#function to extract message into an array
def extract_msg_into_array(message):
    msg_text = message.text.split(' ')
    if len(msg_text) > 1:
        return msg_text[1:]
    else:
        return False

#function to get parameters from message array
def extract_parameters_from_msg_array(msg_array):
    parameters = []
    #loop through everything except for last bit of message!!!!
    parameters_in_msg_array = msg_array[:len(msg_array) - 1]
    for parameter in parameters_in_msg_array:
        parameter_info = parameter.split('=', 1)
        parameters.append(parameter_info)
    if len(parameters) >= 1:
        return parameters
    else:
        return False

#function to get condition from message array
def extract_condition_from_msg_array(msg_array):
    raw_condition = ''.join(msg_array[len(msg_array) - 1:])  # Join the last element of the array into a single string
    condition = re.split(r'(<=|>=|<|>|=)', raw_condition)  # Split using regular expression
    condition = [c for c in condition if c]  # Remove empty strings from the result
    return condition