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

pp = pprint.PrettyPrinter(indent=2)
client = MongoClient()
database = client['rocconf']
	
# Runnning through the raw data and extracting the stuff
# we actually want to analyze.
# NOTE: the except using randint needs to not do that in the final version haha
def parse_raw_data(session_key, user):
	source_collection = database['affdexmerge']

	document = source_collection.find_one({"session_key":session_key, "user":user})

	affdex_data = document["data"]
	parsed_data = []

	pass_headers = 0
	for row in affdex_data:
		sample = []
		if pass_headers != 0:
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
			parsed_data.append(sample)
		else:
			pass_headers = 1	
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
	
	pp.pprint(values[0])
	
	averages = [float(sum(v)/length) for v in values]

	return averages
	
#=======================================================
# Main Caller
#=======================================================
if __name__ == "__main__":
	session_key = sys.argv[1]
	user = sys.argv[2]
	parsed_data = parse_raw_data(session_key, user)

	flag = 0
	while flag < 5:
		pp.pprint(compute_averages(parsed_data, flag))
		flag = flag + 1

	
		
		