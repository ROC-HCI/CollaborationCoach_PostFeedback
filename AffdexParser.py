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
source_collection = database['affdexmerge']

session_key = sys.argv[1]
user = sys.argv[2]

cursor = source_collection.find_one({"session_key":session_key, "user":user})

# Get the first document, we should only ever have one Affdex raw data
# for a session and user.
try:
	document = cursor.next()
except StopIteration:
	print("No Record Found for " + session_key + " and " + user)

affdex_data = document["data"]

for row in affdex_data:
	pp.pprint(row)
	break