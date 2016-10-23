#===============================================================================
# Python Script for Shared Smile Detection
#
# Jeffery A. White - October 2016
#===============================================================================
import json
import sys
import pymongo
from pymongo import MongoClient
import pprint

SMILE_INTENSITY_THRESHOLD = 75 # We only care about data points larger than this value
SMILE_DURATION_THRESHOLD = 0 # Placeholder - can use this for filtering length of shared value
COUNTER_VALUE = 1 # How much time does each 'tick' represent


pp = pprint.PrettyPrinter(indent=2)
client = MongoClient()
database = client['rocconf']

# Helper to get all users for this session.
def get_user_list(session_key):
	user_list = []
	source_collection = database['affdexmerge']
	
	documents = source_collection.find({"session_key":session_key})
	
	for doc in documents:
		user_list.append(doc["user"])
		
	return user_list
	
	
# Runnning through the raw data and extracting the stuff
# we actually want to analyze.
def parse_raw_data(session_key, user):
	source_collection = database['affdexmerge']

	document = source_collection.find_one({"session_key":session_key, "user":user})

	affdex_data = document["data"]
	parsed_data = []

	for row in affdex_data:
		sentiment_data = json.loads(row["sentiment"])
		parsed_data.append(float(sentiment_data["joy"]))
		
	return parsed_data

# How many times did these two data sets share a smile
def compute_pair_shared_smiles(user, other, length):
	
	data_one = user
	data_two = other
	
	detections_data = {}
	
	detections = 0	
	detected = False
	detected_length = 0
	index = 0
	
	for i in range(0,length):
		if not detected:
			if(data_one[i] > SMILE_INTENSITY_THRESHOLD and data_two[i] > SMILE_INTENSITY_THRESHOLD):
				detections = detections + 1
				detected = True
				detected_length = detected_length + 1
		else:
			if(data_one[i] < SMILE_INTENSITY_THRESHOLD or data_two[i] < SMILE_INTENSITY_THRESHOLD):
				detected = False
			else:
				detected_length = detected_length + 1
	
	true_time = detected_length * COUNTER_VALUE
	average_length = true_time / detections
	
	detections_data["Count"] = detections
	detections_data["Avg"] = average_length
	return detections
	
#=======================================================
# Main Caller
#=======================================================
if __name__ == "__main__":
	session_key = sys.argv[1]
	
	user_list = get_user_list(session_key)
	
	# Get all the smile data for this set of users
	raw_smile_data = {}
	
	for user in user_list:
		raw_smile_data[user] = parse_raw_data(session_key, user)
		
	# Detect the minimum length of smile data we have
	# so we don't overun the end on one.
	length = 0	
	for user in user_list:
		temp_length = len(raw_smile_data[user])
		if(length = 0):
			length = temp_length
		else:
			if(len(raw_smile_data[user]) < length):
				length = len(raw_smile_data[user])
	
	# Compute paired smile detections between users
	paired_detections = {}
	for user in user_list:
		for user2 in user_list:	
			key1 = user + " - " + user2
			key2 = user2 + " - " + user
			if (user != user2) and (key1 not in paired_detections) and (key2 not in paired_detections):
				output = compute_pair_shared_smiles(raw_smile_data[user_list[0]],raw_smile_data[user], length)
				paired_detections[user + " - " + user2] = output
	
	pp.pprint(user_list)
	pp.pprint(paired_detections)
	
	

	
		
		