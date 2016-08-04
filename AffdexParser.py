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

# Debugging only, output raw data as CSV file
def output_as_csv(session_key, user):
	pass
	
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
				sample.append(row["focus"])
				sample.append(row["engagement"])
				sample.append(row["attention"])
				sample.append(row["suprise"])
				sample.append(row["contempt"])
				sample.append(row["joy"])
				sample.append(row["smirk"])
				sample.append(row["relaxed"])
				sample.append(row["dissapointed"])
			except KeyError:
				sample.append(random.randint(1,4))
				sample.append(row["engagement"])
				sample.append(row["attention"])
				sample.append(row["suprise"])
				sample.append(row["contempt"])
				sample.append(row["joy"])
				sample.append(row["smirk"])
				sample.append(row["relaxed"])
				sample.append(row["dissapointed"])
		else:
			pass_headers = 1
		parsed_data.append(sample)			
	return parsed_data

# Compute average statistics about a set of records
def compute_averages(data, label):
	return ""
	
#=======================================================
# Main Caller
#=======================================================
if __name__ == "__main__":
    parsed_data = parse_raw_data(sys.argv[1], sys.argv[2])
    pp.pprint(parsed_data)
	
		
		