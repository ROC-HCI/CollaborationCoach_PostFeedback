#===============================================================================
# Python Script for parsing the raw affdex data for a session and user
#
# Jeffery A. White - August 2016
#===============================================================================
import random
import json
import sys
import pymongo
from pymongo import MongoClient
import pprint
import math

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
# NOTE: Faulty data is excluded from the records (generate NaN means no good)
def parse_raw_data(session_key, user):
	source_collection = database['affdexmerge']

	document = source_collection.find_one({"session_key":session_key, "user":user})

	affdex_data = document["data"]
	parsed_data = []

	for row in affdex_data:
		sample = []
		sentiment_data = json.loads(row["sentiment"])
		try:
			sample.append(int(row["focus"]))
			sample.append(float(sentiment_data["joy"]))
			sample.append(float(sentiment_data["sadness"]))
			sample.append(float(sentiment_data["disgust"]))
			sample.append(float(sentiment_data["contempt"]))
			sample.append(float(sentiment_data["anger"]))
			sample.append(float(sentiment_data["fear"]))
			sample.append(float(sentiment_data["surprise"]))
			sample.append(float(sentiment_data["valence"]))
			sample.append(float(sentiment_data["engagement"]))
		except KeyError:
			print "Error in parsing affdex merge data"
			
		nan_check = False
		for element in sample:
			if math.isnan(element):
				nan_check = True
		if not nan_check:
			parsed_data.append(sample)
	return parsed_data

# Compute average statistics about a set of records
def compute_averages(data, label):
	data_to_average = []
	
	if label == 0:
		data_to_average = data
	else:
		for e in data:
			if e[0] == label:
				data_to_average.append(e)
	
	length = float(len(data_to_average))
	values = []
	
	for record in data_to_average:
		values.append(record[1:])
	
	values = zip(*values)
	
	averages = [float(sum(v)/length) for v in values]

	return averages
	
#=======================================================
# Main Caller
#=======================================================
if __name__ == "__main__":
	session_key = sys.argv[1]
	
	user_list = get_user_list(session_key)
	
	for user in user_list:
		parsed_data = parse_raw_data(session_key, user)
		
		final_dict = {}
		final_dict["session_key"] = session_key
		final_dict["user"] = user

		flag = 0
		while flag < 5:
			data = {}
			average_data = compute_averages(parsed_data, flag)
			
			pp.pprint(average_data)
			
			data["joy"] = average_data[0]
			data["sadness"] = average_data[1]
			data["disgust"] = average_data[2]
			data["contempt"] = average_data[3]
			data["anger"] = average_data[4]
			data["fear"] = average_data[5]
			data["surprise"] = average_data[6]
			data["valence"] = average_data[7]
			data["engagement"] = average_data[8]
			final_dict[str(flag)] = data
			flag = flag + 1
		
		collection = database['affdexaverages']	
		pp.pprint(collection.insert_one(final_dict).inserted_id)

	
		
		