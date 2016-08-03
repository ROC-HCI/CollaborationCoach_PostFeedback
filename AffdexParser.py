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

cursor = source_collection.find({"session_key":session_key, "user":user})

for document in cursor:
	pp.pprint(document)