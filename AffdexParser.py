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
def parse_raw_data(session_key, user, type):
	source_collection = database['affdexmerge']

	document = source_collection.find_one({"session_key":session_key, "user":user})

	affdex_data = document["data"]
	parsed_data = []

	for row in affdex_data:
		sample = []
		sentiment_data = json.loads(row[type])
		try:
			sample.append(row["focus"])
			
			if(type == "expressions"):
				sample.append(float(sentiment_data["smile"]))
				sample.append(float(sentiment_data["smirk"]))
				sample.append(float(sentiment_data["attention"]))
			elif(type == "emotions"):
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
			
		parsed_data.append(sample)
	return parsed_data

# Compute average statistics about a set of records
def compute_averages(data, label):
	data_to_average = []
	
	if label == "ALL":
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
		parsed_data_emotions = parse_raw_data(session_key, user, "emotions")
		parsed_data_expressions = parse_raw_data(session_key, user, "expressions")
		
		final_dict = {}
		final_dict["session_key"] = session_key
		final_dict["user"] = user

		for user_flag in user_list:
			data = {}
			
			if user_flag == user:
				flag = "ALL"
			else:
				flag = user_flag
				
			average_data_emotions = compute_averages(parsed_data_emotions, flag)
			average_data_expressions = compute_averages(parsed_data_expressions, flag)
			try:
				data["joy"] = average_data_emotions[0]
				data["sadness"] = average_data_emotions[1]
				data["disgust"] = average_data_emotions[2]
				data["contempt"] = average_data_emotions[3]
				data["anger"] = average_data_emotions[4]
				data["fear"] = average_data_emotions[5]
				data["surprise"] = average_data_emotions[6]
				data["valence"] = average_data_emotions[7]
				data["engagement"] = average_data_emotions[8]
				data["smile"] = average_data_expressions[0]
				data["smirk"] = average_data_expressions[1]
				data["attention"] = average_data_expressions[2]
				final_dict[flag] = data
			except:
				data["joy"] = 0
				data["sadness"] = 0
				data["disgust"] = 0
				data["contempt"] = 0
				data["anger"] = 0
				data["fear"] = 0
				data["surprise"] = 0
				data["valence"] = 0
				data["engagement"] = 0
				data["smile"] = 0
				data["smirk"] = 0
				data["attention"] = 0
				final_dict[flag] = data
				
		collection = database['affdexaverages']	
		pp.pprint(collection.insert_one(final_dict).inserted_id)

	
		
		