#===============================================================================
# Python Script for outputting data from the MongoDB to CSV format.
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
import csv

pp = pprint.PrettyPrinter(indent=2)
client = MongoClient()
database = client['rocconf']

# CHANGE THIS FOR A UNIQUE LABEL!
data_set_label = "TESTING"

#============================================================================
# Dump to CSV file
def generate_csv_file(file_name, data_set):
	with open('OutputData/' + file_name, 'wb') as output_file:
		flag = False
		writer = csv.writer(output_file)
		
		for e in data_set:
			if(not Flag):
				writer.writerow(e.keys())
				writer.writerow(e.values())
				Flag = True
			else:
				writer.writerow(e.values())
		
	return

#============================================================================
# Create dataset of interruption information
def generate_interuption_data(session_key_list):
	source_collection = database['participation']
	write_data = []

	for key in session_key_list:
		document = source_collection.find_one({"session_key" : key})
		dict = {}
		
		interruptions = document["interruption"]
		for data in interruptions:
			for k,v in data:
				dict["session"] = key
				dict["user"] = k
				dict["interrupting"] = v["interrupting"]
				dict["interrupted"] = v["interrupted"]
			
		write_data.append(dict.copy())	
		
	generate_csv_file(data_set_label + "_interruptions.csv", write_data)
	return
	
#=======================================================
# Main Caller
#=======================================================
if __name__ == "__main__":
	# List of session keys you want to get data sets for
	session_key_list = ["12345678","07894240-0dbf-11e7-9ae9-6d413ab416f0"]
	
	generate_interuption_data(session_key_list)
	
	
		
		