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
	
# Runnning through the raw data and extracting the stuff
# we actually want to analyze.
# NOTE: the except using randint needs to not do that in the final version haha
# NOTE: Faulty data is excluded from the records (generate NaN means no good)
def parse_raw_data(session_key, user):
	source_collection = database['affdexmerge']

	document = source_collection.find_one({"session_key":session_key, "user":user})

	affdex_data = document["data"]
	parsed_data = []

	pass_headers = 0
	for row in affdex_data:
		sample = []
		try:
			sample.append(int(row["focus"]))
			sample.append(float(row["engagement"]))
			sample.append(float(row["attention"]))
			sample.append(float(row["suprise"]))
			sample.append(float(row["contempt"]))
			sample.append(float(row["joy"]))
			sample.append(float(row["smirk"]))
			sample.append(float(row["relaxed"]))
			sample.append(float(row["dissapointed"]))
		except KeyError:
			sample.append(random.randint(0,4))
			sample.append(float(row["engagement"]))
			sample.append(float(row["attention"]))
			sample.append(float(row["suprise"]))
			sample.append(float(row["contempt"]))
			sample.append(float(row["joy"]))
			sample.append(float(row["smirk"]))
			sample.append(float(row["relaxed"]))
			sample.append(float(row["dissapointed"]))
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
	user = sys.argv[2]
	parsed_data = parse_raw_data(session_key, user)
	
	final_dict = {}
	final_dict["session_key"] = session_key
	final_dict["user"] = user

	flag = 0
	while flag < 5:
		data = {}
		average_data = compute_averages(parsed_data, flag)
		data["engagement"] = average_data[0]
		data["attention"] = average_data[1]
		data["suprise"] = average_data[2]
		data["contempt"] = average_data[3]
		data["joy"] = average_data[4]
		data["smirk"] = average_data[5]
		data["relaxed"] = average_data[6]
		data["dissapointed"] = average_data[7]
		final_dict[str(flag)] = data
		flag = flag + 1
	
	collection = database['affdexaverages']	
	pp.pprint(collection.insert_one(final_dict).inserted_id)

	
		
		