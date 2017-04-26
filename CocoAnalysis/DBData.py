#===============================================================================
# Python Script for outputting data from the MongoDB to CSV format.
#
# Jeffery A. White - April 2017
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
data_set_label = "2017_04_24"

#============================================================================
# Dump to CSV file
def generate_csv_file(file_name, data_set):
	with open('OutputData/' + file_name, 'wb') as output_file:
		flag = False
		writer = csv.writer(output_file)
		
		for e in data_set:
			if(not flag):
				writer.writerow(e.keys())
				writer.writerow(e.values())
				flag = True
			else:
				writer.writerow(e.values())
		
	return

#============================================================================
# Generate Shared Features Data	
def generate_single_feature_counts(session_key_list):
	source_collection = database['affdexshared']
	write_data = []
	
	for key in session_key_list:
		document = source_collection.find_one({"session_key" : key})
		
		smile = document["single_smile_data"]
		joy = document["single_joy_data"]
		
		for user in smile:
			dict = {}
			data = smile[user]
			dict["session"] = key
			dict["user"] = user
			dict["interaction_type"] = "Smile"
			dict["count"] = data["Count"]
			dict["avg duration"] = data["Avg"]
			write_data.append(dict.copy())
			
		for user in joy:
			dict = {}
			data = joy[user]
			dict["session"] = key
			dict["user"] = user
			dict["interaction_type"] = "Joy"
			dict["count"] = data["Count"]
			dict["avg duration"] = data["Avg"]
			write_data.append(dict.copy())
			
	generate_csv_file(data_set_label + "_single_features.csv", write_data)
	return	


#============================================================================
# Generate Shared Features Data
def generate_shared_data(session_key_list):
	source_collection = database['affdexshared']
	write_data = []
	
	for key in session_key_list:
		document = source_collection.find_one({"session_key" : key})
		
		shared_smile = document["smile_data"]
		shared_joy = document["joy_data"]
		
		for record in shared_smile:
			dict = {}
			data = shared_smile[record]
			dict["session"] = key
			dict["interaction_type"] = "Shared Smile"
			dict["interaction"] = record
			dict["count"] = data["Count"]
			dict["avg duration"] = data["Avg"]
			write_data.append(dict.copy())
			
		for record in shared_joy:
			dict = {}
			data = shared_joy[record]
			dict["session"] = key
			dict["interaction_type"] = "Shared Joy"
			dict["interaction"] = record
			dict["count"] = data["Count"]
			dict["avg duration"] = data["Avg"]
			write_data.append(dict.copy())
			
	generate_csv_file(data_set_label + "_shared_features.csv", write_data)
	return	
	
#============================================================================
# Generate Attitude Data
def generate_attitude_data(session_key_list):
	source_collection = database['affdexaverages']
	write_data = []

	for key in session_key_list:
		documents = source_collection.find({"session_key" : key})
	
		for doc in documents:
			user = doc["user"]
			
			for data in doc:
				#pp.pprint(data)
				if(data != "session_key" and data != "user" and data != "_id"):
					values = doc[data]
					
					dict = {}
					dict["session"] = key
					dict["user"] = user
					dict["attitude towards"] = data
					
					for k in values:
						dict[k] = values[k]
						
					write_data.append(dict.copy())
				
	generate_csv_file(data_set_label + "_attitude.csv", write_data)
	return	
	
#============================================================================
# Generate Turntaking Data
def generate_turntaking_data(session_key_list):
	source_collection = database['participation']
	write_data = []

	for key in session_key_list:
		document = source_collection.find_one({"session_key" : key})
	
		turntaking = document["turntaking"]
		
		for user in turntaking:
			dict = {}
			data = turntaking[user]
			dict["session"] = key
			dict["interaction"] = user
			dict["count"] = data
			write_data.append(dict.copy())
				
	generate_csv_file(data_set_label + "_turntaking.csv", write_data)
	return	
	
	
#============================================================================
# Generate Participation Data
def generate_participation_data(session_key_list):
	source_collection = database['participation']
	write_data = []

	for key in session_key_list:
		document = source_collection.find_one({"session_key" : key})
	
		participation = document["participation"]
		total_count = 0
		
		for test in participation:
			if(test == "total"):
				total_count = participation[test]
		
		for user in participation:
			if(user != "total"):
				dict = {}
				data = participation[user]
				dict["session"] = key
				dict["user"] = user
				dict["rate"] = (data / total_count) * 100
				write_data.append(dict.copy())
				
	generate_csv_file(data_set_label + "_participation.csv", write_data)
	return

#============================================================================
# Create dataset of interruption information
def generate_interuption_data(session_key_list):
	source_collection = database['participation']
	write_data = []

	for key in session_key_list:
		document = source_collection.find_one({"session_key" : key})		
		
		interruptions = document["interruption"]
		for user in interruptions:
			dict = {}
			data = interruptions[user]
			dict["session"] = key
			dict["user"] = user
			dict["interrupting"] = data["interrupting"]
			dict["interrupted"] = data["interrupted"]
			write_data.append(dict.copy())	
		
	generate_csv_file(data_set_label + "_interruptions.csv", write_data)
	return
	
#============================================================================
# Create dataset of raw affdex data
def generate_affdex_data(session_key_list):
	source_collection = database['affdexmerge']
	write_data = []
	
	for key in session_key_list:
		document = source_collection.find({"session_key" : key})
		
		for doc in document:
			data = doc["data"]
			user = doc["user"]
			
			dict = {}
			for d in data:
				dict["session_key"] = key
				dict["user"] = user
				dict["focus"] = d["focus"]
				dict["time"] = d["timeValue"] * .25
				
				emotions = json.loads(d["emotions"])
				expressions = json.loads(d["expressions"])
				
				for k, v in emotions.iteritems():
					dict[k] = v
				
				for i, j in expressions.iteritems():
					dict[i] = j
					
				write_data.append(dict.copy())
			
	generate_csv_file(data_set_label + "_affdex.csv", write_data)
	return
				
	
#=======================================================
# Main Caller
#=======================================================
if __name__ == "__main__":
	# List of session keys you want to get data sets for
	session_key_list = ["2a3cd350-b807-11e6-b074-894d5799765b","12345678","07894240-0dbf-11e7-9ae9-6d413ab416f0","ebad4e90-17e6-11e7-9b9c-bf00dfff9daf",
	                    "999888777","3d574080-254c-11e7-a812-cd691f041850","906a2060-26c0-11e7-b40a-058fd8ca01a0","a79bd530-26c5-11e7-8408-6731f9ef0888",
						"2bb8a640-2847-11e7-af67-bf096685ec64","71ec3db0-284d-11e7-818b-8f39e78c9129","fee0b550-2a02-11e7-95b6-27c2f89beca5",
						"e69b3b00-2a07-11e7-895e-3d111079e18f"]
	
	#generate_interuption_data(session_key_list)
	#generate_participation_data(session_key_list)
	#generate_turntaking_data(session_key_list)
	#generate_attitude_data(session_key_list)
	#generate_shared_data(session_key_list)
	#generate_single_feature_counts(session_key_list)
	generate_affdex_data(session_key_list)
	
	
		
		