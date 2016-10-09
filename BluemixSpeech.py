#==================================================================================
# IBM Bluemix Speech Recognition for the RocConf Project
#    - Jeffery A. White - September 2016
#
# Based upon the SpeechRecognition Library
# SpeechRecognition - Zhang, A. (2015). 
# Speech Recognition (Version 3.1) [Software]. 
# Available from https://github.com/Uberi/speech_recognition#readme.
#
# Modified here to take .flac as input since we couldn't get the 
# flac encoder in that library to work. Uses FFMPEG converted .flac files.
#
# Usage - BluemixSpeech.py {Filename}
#==================================================================================
import pymongo
from pymongo import MongoClient
import pprint
import sys
import os, base64
import json

from urllib import urlencode
from urllib2 import Request, urlopen, URLError, HTTPError

class RequestError(Exception): pass

client = MongoClient()
database = client['rocconf']
transcript_collection = database['transcript_bluemix']
raw_data_collection = database['speechrawdata_bluemix']

session_key = ""
user_id = ""

pp = pprint.PrettyPrinter(indent=2)

#==================================================================================
# Access keys for using IBM Bluemix. Generate these through a Bluemix Account
# http://www.ibm.com/cloud-computing/bluemix/
#==================================================================================
IBM_TONE_USERNAME = "2572b9cb-a85b-4a2d-afbf-c16813e8c18a"
IBM_TONE_PASSWORD = "b33xVMxeZsjq"

#==================================================================================
# Send the .flac data to BlueMix, dump the results to the DB
# 	and return the results to the caller
#==================================================================================
def bluemix_call(filename):
	language = "en-US"

	basepath = os.path.dirname(__file__)
	filepath = os.path.abspath(os.path.join(basepath,filename))
	
	flac_file = open(filepath,'r')
	flac_data = flac_file.read()

	model = "{0}_BroadbandModel".format(language)
	url = "https://stream.watsonplatform.net/speech-to-text/api/v1/recognize?{0}".format(urlencode({"profanity_filter": "false","timestamps": "true","continuous": "true","model": model}))

	request = Request(url, data = flac_data, headers = {"Content-Type": "audio/x-flac"})

	if hasattr("", "encode"):
		authorization_value = base64.standard_b64encode("{0}:{1}".format(IBM_TONE_USERNAME, IBM_TONE_PASSWORD).encode("utf-8")).decode("utf-8")
	else:
		authorization_value = base64.standard_b64encode("{0}:{1}".format(IBM_TONE_USERNAME, IBM_TONE_PASSWORD))

	request.add_header("Authorization", "Basic {0}" . format(authorization_value))
	
	try:
		response = urlopen(request)
	except HTTPError as e:
		raise RequestError("speech recognition request failed: {0}".format(getattr(e, "reason", "status {0}".format(e.code)))) # use getattr to be compatible with Python 2.6
	except URLError as e:
		raise RequestError("speech recognition connection failed: {0}".format(e.reason))

	response_text = response.read().decode("utf-8")
	result = json.loads(response_text)
	
	# Dump to MongoDB for later analysis!
	final_dict = {}
	final_dict['session_key'] = session_key
	final_dict['user'] = user_id
	final_dict['data'] = result
	
	raw_data_collection.insert_one(final_dict).inserted_id
	
	return result

#================================================================================================
# Processing a text transcript from bluemix results data
#================================================================================================
def process_transcript(raw_data):
	result = json.loads(raw_data)

	transcription = []
	for utterance in result["results"]:
		if "alternatives" not in utterance: raise UnknownValueError()
		for hypothesis in utterance["alternatives"]:
			if "transcript" in hypothesis:
				transcription.append(hypothesis["transcript"])
				
	transcript = ". ".join(transcription)

	# Dump transcript into MongoDB for display and later analysis!
	final_dict = {}
	final_dict['session_key'] = session_key
	final_dict['user'] = user_id
	final_dict['transcript'] = transcript
	
	transcript_collection.insert_one(final_dict).inserted_id
	
#=======================================================
# Main Caller
#=======================================================
if __name__ == "__main__":
	final = sys.argv[1].split('_')
	session_key = final[1]
	user_id = final[2]
	
	raw_data = bluemix_call(sys.argv[1])
	process_transcript(raw_data)
