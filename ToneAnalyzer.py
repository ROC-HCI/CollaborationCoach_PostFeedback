#==================================================================================
# IBM Bluemix Tone Analyzer for the RocConf Project
#    - Jeffery A. White - July 2016
#
# Usage - ToneAnalyzer.py {filename}
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

session_key = ""
user_id = ""

client = MongoClient()
database = client['rocconf']
read_collection = database['transcript_bluemix']
write_collection = database['toneanalysis_bluemix']

pp = pprint.PrettyPrinter(indent=2)

#==================================================================================
# Access keys for using IBM Bluemix. Generate these through a Bluemix Account
# http://www.ibm.com/cloud-computing/bluemix/
#==================================================================================
IBM_TONE_USERNAME = "3020d7bb-7271-48a4-9f44-cc8918830788"
IBM_TONE_PASSWORD = "FOG5rXrhNK0J"

#==================================================================================
# Get the text transcript for this user from MongoDB
#==================================================================================
def get_transcript(session_id, user_id):
	db_data = read_collection.find({"session_key":session_id,"user":user_id})
	item = db_data[0]
	
	transcript_text = item["transcript"]

	return transcript_text

#==================================================================================
# Run this on a text based transcript to obtain tone analysis, add this
# analysis data to the tone collection
#==================================================================================
def process_tone(transcript_text, session_id, user_id):
	url = "https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?{0}" . format(urlencode({"version": "2016-05-19","text": transcript_text}))

	request = Request(url, headers = {"Content-Type": "application/json"})

	if hasattr("", "encode"):
		authorization_value = base64.standard_b64encode("{0}:{1}".format(IBM_TONE_USERNAME, IBM_TONE_PASSWORD).encode("utf-8")).decode("utf-8")
	else:
		authorization_value = base64.standard_b64encode("{0}:{1}".format(IBM_TONE_USERNAME, IBM_TONE_PASSWORD))

	request.add_header("Authorization", "Basic {0}" . format(authorization_value))

	try:
		response = urlopen(request)
	except HTTPError as e:
		raise RequestError("tone analysis request failed: {0}".format(getattr(e, "reason", "status {0}".format(e.code)))) # use getattr to be compatible with Python 2.6
	except URLError as e:
		raise RequestError("tone analysis connection failed: {0}".format(e.reason))

	response_text = response.read().decode("utf-8")
	result = json.loads(response_text)

	final_dict = {}
	final_dict["session_key"] = session_id
	final_dict["user"] = user_id
	final_dict["data"] = result

	pp.pprint(write_collection.insert_one(final_dict).inserted_id)

#=======================================================
# Main Caller
#=======================================================
if __name__ == "__main__":
	final = sys.argv[1].split('_')
	session_key = final[1]
	user_id = final[2]
	
	transcript = get_transcript(session_key, user_id)
	process_tone(transcript)
