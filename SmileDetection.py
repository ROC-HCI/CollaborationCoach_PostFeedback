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

SMILE_THRESHOLD = 75 #We only care about smiles larger than this value


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
def compute_pair_shared_smiles(user, other):
	detections = []
	
	return "TEST"
	
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
	
	
	paired_detections = {}
	for user in user_list:
		if user != user_list[0]:
			output = compute_pair_shared_smiles(raw_smile_data[user_list[0]],raw_smile_data[user])
			paired_detections[user + " - " + user_list[0]] = output
	
	pp.pprint(user_list)
	pp.pprint(paired_detections)
	
	

	
		
		