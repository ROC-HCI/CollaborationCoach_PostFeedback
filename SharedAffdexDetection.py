#===============================================================================
# Python Script for Shared Affdex Value Detection
#
# Jeffery A. White - October 2016
#===============================================================================
import json
import sys
import pymongo
from pymongo import MongoClient
import pprint

INTENSITY_THRESHOLD = 75 # We only care about data points larger than this value
DURATION_THRESHOLD = 1 # Placeholder - can use this for filtering length of shared value
COUNTER_VALUE = .25 # How much time does each 'tick' represent

pp = pprint.PrettyPrinter(indent=2)
client = MongoClient()
database = client['rocconf']

#------------------------------------------------------------------------------------	
# Helper to get all users for this session.
def get_user_list(session_key):
	user_list = []
	source_collection = database['affdexmerge']
	
	documents = source_collection.find({"session_key":session_key})
	
	for doc in documents:
		user_list.append(doc["user"])
		
	return user_list
	
#------------------------------------------------------------------------------------		
# Runnning through the raw data and extracting the stuff
# we actually want to analyze.
def parse_raw_data(session_key, user, key, type):
	source_collection = database['affdexmerge']

	document = source_collection.find_one({"session_key":session_key, "user":user})

	affdex_data = document["data"]
	parsed_data = []

	for row in affdex_data:
		sentiment_data = json.loads(row[type])
		parsed_data.append(float(sentiment_data[key]))
		
	return parsed_data
	
#------------------------------------------------------------------------------------
# How many times did this user smile?
#
def compute_single(users, key, type):
	# Get all the data for this set of users
	raw_data = {}	
	final_data = {}
	
	for user in users:
		raw_data[user] = parse_raw_data(session_key, user, key, type)
		
	for user in users:
		analysis_data = raw_data[user]
		length = len(analysis_data)
		
		detections_data = {}
		detections = 0
		detected = False
		detected_length = 0
		cur_length = 0
		for i in range(0,length):
			if detected is False:
				if(analysis_data[i] > INTENSITY_THRESHOLD):
					detected = True
					cur_length = 1
			else:
				if(analysis_data[i] < INTENSITY_THRESHOLD):
					if((cur_length * COUNTER_VALUE) > DURATION_THRESHOLD):
						detections = detections + 1
						detected_length += cur_length
					detected = False
				else:
					cur_length = cur_length + 1
	
		true_time = detected_length * COUNTER_VALUE
	
		if(detections > 0):
			average_length = true_time / detections
		else:
			average_length = 0
	
		detections_data["Count"] = detections
		detections_data["Avg"] = average_length
		final_data[user] = detections_data
	return final_data


#------------------------------------------------------------------------------------	
# How many times did these two data sets share above the threshold
# and for how long
def compute_pair_shared(user, other, length):	
	data_one = user
	data_two = other
	
	detections_data = {}
	
	detections = 0	
	detected = False
	detected_length = 0
	
	cur_length = 0
	
	for i in range(0,length):
		if detected is False:
			if(data_one[i] > INTENSITY_THRESHOLD and data_two[i] > INTENSITY_THRESHOLD):
				detected = True
				cur_length = 1
		else:
			if(data_one[i] < INTENSITY_THRESHOLD or data_two[i] < INTENSITY_THRESHOLD):
				if((cur_length * COUNTER_VALUE) > DURATION_THRESHOLD):
					detections = detections + 1
					detected_length += cur_length
				detected = False
			else:
				cur_length = cur_length + 1
	
	true_time = detected_length * COUNTER_VALUE
	
	if(detections > 0):
		average_length = true_time / detections
	else:
		average_length = 0
	
	detections_data["Count"] = detections
	detections_data["Avg"] = average_length
	return detections_data

#------------------------------------------------------------------------------------	
# Compute a sharing dictionary for a particular affdex key
def compute(users, key, type):
	# Get all the data for this set of users
	raw_data = {}	
	
	for user in users:
		raw_data[user] = parse_raw_data(session_key, user, key, type)
		
	# Detect the minimum length of data we have
	# so we don't overun the end on one.
	length = 0	
	for user in users:
		temp_length = len(raw_data[user])
		if(length == 0):
			length = temp_length
		else:
			if(len(raw_data[user]) < length):
				length = len(raw_data[user])
	
	# Compute paired detections between users
	paired_detections = {}
	for user in users:
		for user2 in users:	
			key1 = user + " - " + user2
			key2 = user2 + " - " + user
			if (user != user2) and (key1 not in paired_detections) and (key2 not in paired_detections):
				output = compute_pair_shared(raw_data[user],raw_data[user2], length)
				paired_detections[user + " - " + user2] = output
				
	return paired_detections
				
#=======================================================
# Main Caller
#=======================================================
if __name__ == "__main__":
	session_key = sys.argv[1]
	
	user_list = get_user_list(session_key)
	
	final_dict = {}
	final_dict["session_key"] = session_key
	final_dict["single_smile_data"] = compute_single(user_list,"smile","expressions")
	final_dict["smile_data"] = compute(user_list, "smile","expressions")
	final_dict["single_joy_data"] = compute_single(user_list,"joy","emotions")
	final_dict["joy_data"] = compute(user_list,"joy","emotions")

	#pp.pprint(final_dict)
	collection = database['affdexshared']	
	pp.pprint(collection.insert_one(final_dict).inserted_id)

	

	
		
		