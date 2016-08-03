#===============================================================================
# Python Script for parsing the raw affdex data for a session and user
#
# Jeffery A. White - August 2016
#===============================================================================

import json
import sys
import pymongo
from pymongo import MongoClient
import pprint

pp = pprint.PrettyPrinter(indent=2)
client = MongoClient()
database = client['rocconf']
	
# Runnning through the raw data and extracting the stuff
# we actually want to analyze
def parse_raw_data(session_key, user):
	source_collection = database['affdexmerge']

	document = source_collection.find_one({"session_key":session_key, "user":user})

	affdex_data = document["data"]
	parsed_data = []

	pass_headers = 0
	for row in affdex_data:
		if pass_headers != 0:
			sample = {}
			sample["focus"] = row["focus"]
			sample["engagement"] = row["engagement"]
			sample["attention"] = row["attention"]
			sample["suprise"] = row["suprise"]
			sample["contempt"] = row["contempt"]
			sample["joy"] = row["joy"]
			sample["smirk"] = row["smirk"]
			sample["relaxed"] = row["relaxed"]
			sample["disappointed"] = row["disappointed"]
			parsed_data.append(sample)
		else:
			pass_headers = 1
			
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
	
		
		